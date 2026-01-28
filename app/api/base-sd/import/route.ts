import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { insertBaseSdAssets } from "@/lib/base-sd/base-sd-service";
import { db } from "@/lib/auth/database";

const REQUIRED_HEADERS = [
  "hostname",
  "mês inclusão",
  "type",
  "cmdb",
  "tlv cmdb",
  "valid",
  "ip",
  "so",
  "cobertura atual - ferramentas",
  "observação cofre",
  "observação tenable",
  "observação guardicore",
  "observação deep security",
  "observação crowdstrike",
  "observação wazuh",
  "observação trellix",
];

function normalizeHeader(value: string) {
  return value.replace(/^\uFEFF/, "").trim().toLowerCase();
}

function detectDelimiter(line: string) {
  const counts = { comma: 0, semicolon: 0 };
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (line[i + 1] === '"') {
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (inQuotes) continue;
    if (char === ";") counts.semicolon += 1;
    if (char === ",") counts.comma += 1;
  }
  return counts.semicolon >= counts.comma ? ";" : ",";
}

function parseCsv(text: string, delimiter: string) {
  const rows: string[][] = [];
  let current: string[] = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (!inQuotes && char === delimiter) {
      current.push(value);
      value = "";
      continue;
    }
    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && text[i + 1] === "\n") {
        i += 1;
      }
      current.push(value);
      if (current.some((cell) => cell.trim().length > 0)) {
        rows.push(current);
      }
      current = [];
      value = "";
      continue;
    }
    value += char;
  }

  if (value.length > 0 || current.length > 0) {
    current.push(value);
    if (current.some((cell) => cell.trim().length > 0)) {
      rows.push(current);
    }
  }

  return rows;
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Arquivo CSV não encontrado." }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length === 0) {
      return NextResponse.json({ error: "Arquivo vazio." }, { status: 400 });
    }

    const delimiter = detectDelimiter(lines[0]);
    const rows = parseCsv(text, delimiter);
    if (rows.length === 0) {
      return NextResponse.json({ error: "Não foi possível ler o CSV." }, { status: 400 });
    }

    const headerRow = rows[0].map(normalizeHeader);
    const missing = REQUIRED_HEADERS.filter(
      (header) => !headerRow.includes(normalizeHeader(header))
    );
    if (missing.length > 0) {
      return NextResponse.json(
        {
          error: `Headers ausentes no CSV: ${missing.join(", ")}.`,
        },
        { status: 400 }
      );
    }

    const getValue = (row: string[], header: string) => {
      const index = headerRow.indexOf(normalizeHeader(header));
      if (index < 0) return "";
      return row[index] ?? "";
    };

    const records = rows.slice(1).map((row) => ({
      hostname: getValue(row, "Hostname").trim(),
      monthInclusion: getValue(row, "Mês inclusão").trim(),
      assetType: getValue(row, "Type").trim(),
      cmdb: getValue(row, "CMDB").trim(),
      tlvCmdb: getValue(row, "TLV CMDB").trim(),
      valid: getValue(row, "Valid").trim(),
      ip: getValue(row, "IP").trim(),
      os: getValue(row, "SO").trim(),
      coverageTools: getValue(row, "Cobertura atual - Ferramentas").trim(),
      obsCofre: getValue(row, "Observação Cofre").trim(),
      obsTenable: getValue(row, "Observação Tenable").trim(),
      obsGuardicore: getValue(row, "Observação Guardicore").trim(),
      obsDeepSecurity: getValue(row, "Observação Deep Security").trim(),
      obsCrowdstrike: getValue(row, "Observação Crowdstrike").trim(),
      obsWazuh: getValue(row, "Observação Wazuh").trim(),
      obsTrellix: getValue(row, "Observação Trellix").trim(),
    }));

    const filtered = records.filter((record) =>
      Object.values(record).some((value) => value && String(value).trim().length > 0)
    );

    // Sempre substitui a base atual por uma nova carga
    db.prepare("DELETE FROM base_sd_assets").run();
    const result = insertBaseSdAssets(filtered);
    return NextResponse.json({
      inserted: result.inserted,
      skipped: records.length - filtered.length,
      delimiter,
      assets: filtered,
    });
  } catch (error) {
    console.error("[base-sd:import]", error);
    return NextResponse.json(
      { error: "Não foi possível importar o CSV." },
      { status: 500 }
    );
  }
}
