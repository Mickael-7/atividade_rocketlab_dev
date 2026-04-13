export function exportarCSV(dados: Record<string, unknown>[], nomeArquivo: string) {
  if (!dados.length) return;

  const headers = Object.keys(dados[0]);
  const escapar = (v: unknown) =>
    `"${String(v ?? "").replace(/"/g, '""')}"`;

  const linhas = [
    headers.join(","),
    ...dados.map((row) => headers.map((h) => escapar(row[h])).join(",")),
  ];

  const blob = new Blob(["\uFEFF" + linhas.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nomeArquivo}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
