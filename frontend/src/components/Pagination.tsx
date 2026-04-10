interface Props {
  page: number;
  pages: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, pages, total, limit, onChange }: Props) {
  if (pages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const getPages = (): (number | "…")[] => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    const items: (number | "…")[] = [1];
    if (page > 3) items.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) {
      items.push(i);
    }
    if (page < pages - 2) items.push("…");
    items.push(pages);
    return items;
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mt-8">
      <p className="text-sm text-gray-500">
        Mostrando <span className="font-medium text-gray-700">{from}–{to}</span> de{" "}
        <span className="font-medium text-gray-700">{total.toLocaleString("pt-BR")}</span> produtos
      </p>

      <nav className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Página anterior"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {getPages().map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400 select-none">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition ${
                p === page
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === pages}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Próxima página"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    </div>
  );
}
