import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getVendedores } from "@/services/api";
import { Skeleton } from "@/components/ui/Skeleton";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Pagination from "@/components/Pagination";
import { exportarCSV } from "@/utils/exportCsv";

const LIMIT = 20;

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function TableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-12 rounded-xl" />
      ))}
    </div>
  );
}

export default function VendedoresPage() {
  const [page, setPage] = useState(1);
  const [exportando, setExportando] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vendedores", page],
    queryFn: () => getVendedores({ page, limit: LIMIT }),
    placeholderData: (prev) => prev,
  });

  async function handleExportar() {
    if (!data) return;
    setExportando(true);
    try {
      const todos = await getVendedores({ page: 1, limit: data.total });
      exportarCSV(
        todos.items.map((v) => ({
          id_vendedor: v.id_vendedor,
          nome_vendedor: v.nome_vendedor,
          cidade: v.cidade,
          estado: v.estado,
          total_vendas: v.total_vendas,
          receita_total: v.receita_total,
        })),
        "vendedores"
      );
    } finally {
      setExportando(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendedores</h1>
          <p className="text-gray-500 text-sm mt-1">
            {data ? (
              <>
                <span className="font-medium text-gray-700">
                  {data.total.toLocaleString("pt-BR")}
                </span>{" "}
                vendedores cadastrados
              </>
            ) : (
              "Carregando..."
            )}
          </p>
        </div>
        <button
          onClick={handleExportar}
          disabled={exportando || !data}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-wait shrink-0"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {exportando ? "Exportando..." : "Exportar CSV"}
        </button>
      </div>

      {isError && (
        <ErrorMessage message="Erro ao carregar vendedores. Verifique se o backend está rodando." />
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton />
          </div>
        ) : data && data.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Vendedor</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Localização</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Vendas</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Receita</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.items.map((v) => (
                  <tr key={v.id_vendedor} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{v.nome_vendedor}</p>
                      <p className="text-xs text-gray-400 font-mono">{v.id_vendedor}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {v.cidade}, <span className="font-medium">{v.estado}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 font-medium">
                      {v.total_vendas.toLocaleString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      {formatBRL(v.receita_total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-gray-400 text-sm">
            Nenhum vendedor encontrado.
          </div>
        )}
      </div>

      {data && (
        <Pagination
          page={data.page}
          pages={data.pages}
          total={data.total}
          limit={LIMIT}
          onChange={setPage}
        />
      )}
    </div>
  );
}
