"use server";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DEFAULT_ROOT = fs.existsSync("/home") ? "/home" : "/";
const ROOT_DIRECTORY = process.env.POSTURA_FILES_ROOT
  ? path.resolve(process.env.POSTURA_FILES_ROOT)
  : path.resolve(DEFAULT_ROOT);

function resolveSafePath(targetPath: string) {
  const normalized = (targetPath ?? "").replace(/\\/g, "/");
  const reference = normalized.length > 0 ? normalized : ".";
  const resolved = path.resolve(ROOT_DIRECTORY, reference);
  if (!resolved.startsWith(ROOT_DIRECTORY)) {
    throw new Error("Caminho fora do diretório permitido.");
  }
  return resolved;
}

function buildRelative(fullPath: string) {
  const relative = path.relative(ROOT_DIRECTORY, fullPath).replace(/\\/g, "/");
  return relative;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const relativePath = searchParams.get("path") ?? "";
    const fullPath = resolveSafePath(relativePath);
    const absolutePath = fullPath;

    const stats = fs.existsSync(fullPath) ? fs.statSync(fullPath) : null;
    if (!stats) {
      return NextResponse.json(
        { error: "Arquivo ou diretório não encontrado." },
        { status: 404 }
      );
    }

    if (stats.isDirectory()) {
      const entries = fs.readdirSync(fullPath, { withFileTypes: true }).map((entry) => {
        const entryPath = path.join(fullPath, entry.name);
        const entryStats = fs.statSync(entryPath);
        return {
          name: entry.name,
          relativePath: buildRelative(entryPath),
          absolutePath: entryPath,
          type: entry.isDirectory() ? "directory" : "file",
          size: entry.isDirectory() ? null : entryStats.size,
          lastModified: entryStats.mtime.toISOString(),
        };
      });

      return NextResponse.json({
        type: "directory",
        root: ROOT_DIRECTORY,
        path: buildRelative(fullPath),
        absolutePath,
        entries,
      });
    }

    const content = fs.readFileSync(fullPath, "utf-8");
    return NextResponse.json({
      type: "file",
      root: ROOT_DIRECTORY,
      path: buildRelative(fullPath),
      absolutePath,
      content,
      size: stats.size,
      lastModified: stats.mtime.toISOString(),
    });
  } catch (error) {
    console.error("[scripts:GET]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao listar scripts." },
      { status: 500 }
    );
  }
}
