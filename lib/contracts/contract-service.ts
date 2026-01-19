import { db } from "@/lib/auth/database";
import { getLocalTimestamp } from "@/lib/utils/time";

export type ContractRecord = {
  id: number;
  title: string;
  vendor: string;
  owner: string;
  area: string | null;
  contract_type: string | null;
  status: string;
  start_date: string;
  end_date: string;
  alert_days: number | null;
  value_amount: number | null;
  value_currency: string | null;
  description: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ContractInput = {
  title: string;
  vendor: string;
  owner: string;
  area?: string | null;
  contractType?: string | null;
  status: string;
  startDate: string;
  endDate: string;
  alertDays?: number | null;
  valueAmount?: number | null;
  valueCurrency?: string | null;
  description?: string | null;
  notes?: string | null;
};

export type ContractUpdatePayload = ContractInput & {
  id: number;
};

export function listContracts() {
  return db
    .prepare<ContractRecord>(
      `SELECT id, title, vendor, owner, area, contract_type, status, start_date, end_date,
              alert_days, value_amount, value_currency, description, notes, created_at, updated_at
       FROM contracts
       ORDER BY end_date ASC, created_at DESC`
    )
    .all();
}

export function createContract(input: ContractInput) {
  const now = getLocalTimestamp();
  const record = db
    .prepare<ContractRecord>(
      `INSERT INTO contracts
        (title, vendor, owner, area, contract_type, status, start_date, end_date, alert_days,
         value_amount, value_currency, description, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING id, title, vendor, owner, area, contract_type, status, start_date, end_date,
                 alert_days, value_amount, value_currency, description, notes, created_at, updated_at`
    )
    .get(
      input.title,
      input.vendor,
      input.owner,
      input.area ?? null,
      input.contractType ?? null,
      input.status,
      input.startDate,
      input.endDate,
      input.alertDays ?? 30,
      input.valueAmount ?? null,
      input.valueCurrency ?? null,
      input.description ?? null,
      input.notes ?? null,
      now,
      now
    );

  return record;
}

export function updateContract(input: ContractUpdatePayload) {
  const now = getLocalTimestamp();
  const record = db
    .prepare<ContractRecord>(
      `UPDATE contracts
       SET title = ?, vendor = ?, owner = ?, area = ?, contract_type = ?, status = ?,
           start_date = ?, end_date = ?, alert_days = ?, value_amount = ?, value_currency = ?,
           description = ?, notes = ?, updated_at = ?
       WHERE id = ?
       RETURNING id, title, vendor, owner, area, contract_type, status, start_date, end_date,
                 alert_days, value_amount, value_currency, description, notes, created_at, updated_at`
    )
    .get(
      input.title,
      input.vendor,
      input.owner,
      input.area ?? null,
      input.contractType ?? null,
      input.status,
      input.startDate,
      input.endDate,
      input.alertDays ?? 30,
      input.valueAmount ?? null,
      input.valueCurrency ?? null,
      input.description ?? null,
      input.notes ?? null,
      now,
      input.id
    );

  return record ?? null;
}

export function deleteContract(id: number) {
  const result = db.prepare("DELETE FROM contracts WHERE id = ?").run(id);
  return result.changes > 0;
}
