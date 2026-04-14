import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getConsumidores } from "@/services/api";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "@/components/ui/Skeleton";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Pagination from "@/components/Pagination";

const LIMIT = 20;

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function TableSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-12 rounded-xl" />
      ))}
    </div>
  );
}

export default function ConsumidoresPage() {
  const [page, setPage] = useState(1);
  const [busca, setBusca] = useState("");
  const debouncedBusca = useDebounce(busca, 400);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["consumidores", page, debouncedBusca],
    queryFn: () => getConsumidores({ page, limit: LIMIT, busca: debouncedBusca || undefined }),
    placeholderData: (prev) => prev,
  });

  function handleBuscaChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBusca(e.target.value);
    setPage(1);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Consumidores</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {data ? (
              <>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {data.total.toLocaleString("pt-BR")}
                </span>{" "}
                consumidores cadastrados
              </>
            ) : "Carregando..."}
          </p>
        </div>

        <div className="relative sm:w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={busca}
            onChange={handleBuscaChange}
            placeholder="Buscar por nome..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {isError && <ErrorMessage message="Erro ao carregar consumidores. Verifique se o backend está rodando." />}

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {isLoading ? <TableSkeleton /> : data && data.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Nome</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Localização</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Pedidos</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Total Gasto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {data.items.map((c) => (
                  <tr key={c.id_consumidor} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        to={`/consumidores/${c.id_consumidor}`}
                        className="font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {c.nome_consumidor}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {c.cidade}, <span className="font-medium">{c.estado}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">{c.total_pedidos.toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">{formatBRL(c.total_gasto)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-gray-400 dark:text-gray-500 text-sm">Nenhum consumidor encontrado.</div>
        )}
      </div>

      {data && (
        <Pagination page={data.page} pages={data.pages} total={data.total} limit={LIMIT} onChange={setPage} />
      )}
    </div>
  );
}
