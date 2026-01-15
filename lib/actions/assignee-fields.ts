export const ASSIGNEE_CUSTOM_FIELDS = [
  { id: "customfield_11702", label: "Área Proprietária Ativo Diretor_LB" },
  { id: "customfield_11704", label: "Área Proprietária Ativo Ponto Focal_LB" },
  { id: "customfield_11703", label: "Área Proprietária Ativo Gerente Sr_LB" },
  { id: "customfield_11706", label: "Área Solucionadora Responsável Gerente Sr_LB" },
  { id: "customfield_11705", label: "Área Solucionadora Responsável Diretor_LB" },
  { id: "customfield_11707", label: "Área Solucionadora Responsável Ponto Focal_LB" },
  { id: "customfield_10663", label: "Área Solucionadora Responsável VP" },
  { id: "customfield_10647", label: "Área Negócio Responsável VP" },
  { id: "customfield_13200", label: "Owner de Desenvolvimento" },
  { id: "customfield_13202", label: "Owner de Operação" },
  { id: "customfield_13205", label: "Owner de Sustentação" },
  { id: "customfield_12301", label: "Owner de Negócio" },
  { id: "customfield_12302", label: "Responsável de Negócio" },
  { id: "customfield_13201", label: "Responsável de Desenvolvimento" },
  { id: "customfield_13203", label: "Responsável de Operação" },
  { id: "customfield_13204", label: "Responsável de Sustentação" },
];

export function normalizeAssigneeLabel(label: string) {
  return label.trim().toLowerCase();
}

export const ASSIGNEE_MULTI_USER_FIELDS = new Set([
  "customfield_13200",
  "customfield_13202",
  "customfield_13205",
  "customfield_12301",
  "customfield_12302",
  "customfield_13201",
  "customfield_13203",
  "customfield_13204",
]);

export function toMultiUserValues(raw: string) {
  return raw
    .split("|")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((name) => ({ name }));
}
