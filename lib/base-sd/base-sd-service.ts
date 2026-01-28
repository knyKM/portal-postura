import { db } from "@/lib/auth/database";
import { getLocalTimestamp } from "@/lib/utils/time";

export type BaseSdAssetRecord = {
  id: number;
  hostname: string | null;
  month_inclusion: string | null;
  asset_type: string | null;
  cmdb: string | null;
  tlv_cmdb: string | null;
  valid: string | null;
  ip: string | null;
  os: string | null;
  coverage_tools: string | null;
  obs_cofre: string | null;
  obs_tenable: string | null;
  obs_guardicore: string | null;
  obs_deep_security: string | null;
  obs_crowdstrike: string | null;
  obs_wazuh: string | null;
  obs_trellix: string | null;
  created_at: string;
};

export type BaseSdAssetInput = {
  hostname?: string | null;
  monthInclusion?: string | null;
  assetType?: string | null;
  cmdb?: string | null;
  tlvCmdb?: string | null;
  valid?: string | null;
  ip?: string | null;
  os?: string | null;
  coverageTools?: string | null;
  obsCofre?: string | null;
  obsTenable?: string | null;
  obsGuardicore?: string | null;
  obsDeepSecurity?: string | null;
  obsCrowdstrike?: string | null;
  obsWazuh?: string | null;
  obsTrellix?: string | null;
};

export function listBaseSdAssets(limit = 200, offset = 0) {
  return db
    .prepare<BaseSdAssetRecord>(
      `SELECT id, hostname, month_inclusion, asset_type, cmdb, tlv_cmdb, valid, ip, os,
              coverage_tools, obs_cofre, obs_tenable, obs_guardicore, obs_deep_security,
              obs_crowdstrike, obs_wazuh, obs_trellix, created_at
       FROM base_sd_assets
       ORDER BY id DESC
       LIMIT ? OFFSET ?`
    )
    .all(limit, offset);
}

export function getBaseSdAssetById(id: number) {
  return db
    .prepare<BaseSdAssetRecord>(
      `SELECT id, hostname, month_inclusion, asset_type, cmdb, tlv_cmdb, valid, ip, os,
              coverage_tools, obs_cofre, obs_tenable, obs_guardicore, obs_deep_security,
              obs_crowdstrike, obs_wazuh, obs_trellix, created_at
       FROM base_sd_assets
       WHERE id = ?`
    )
    .get(id);
}

export function insertBaseSdAssets(records: BaseSdAssetInput[]) {
  if (records.length === 0) {
    return { inserted: 0 };
  }

  const stmt = db.prepare(
    `INSERT INTO base_sd_assets
      (hostname, month_inclusion, asset_type, cmdb, tlv_cmdb, valid, ip, os,
       coverage_tools, obs_cofre, obs_tenable, obs_guardicore, obs_deep_security,
       obs_crowdstrike, obs_wazuh, obs_trellix, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const now = getLocalTimestamp();
  const insertMany = db.transaction((rows: BaseSdAssetInput[]) => {
    rows.forEach((row) => {
      stmt.run(
        row.hostname ?? null,
        row.monthInclusion ?? null,
        row.assetType ?? null,
        row.cmdb ?? null,
        row.tlvCmdb ?? null,
        row.valid ?? null,
        row.ip ?? null,
        row.os ?? null,
        row.coverageTools ?? null,
        row.obsCofre ?? null,
        row.obsTenable ?? null,
        row.obsGuardicore ?? null,
        row.obsDeepSecurity ?? null,
        row.obsCrowdstrike ?? null,
        row.obsWazuh ?? null,
        row.obsTrellix ?? null,
        now
      );
    });
  });

  insertMany(records);
  return { inserted: records.length };
}
