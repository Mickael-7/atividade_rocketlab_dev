import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getPedidos } from "@/services/api";
import { Skeleton } from "@/components/ui/Skeleton";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Pagination from "@/components/Pagination";

const LIMIT = 20;

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "entregue", label: "Entregue" },
  { value: "enviado", label: "Enviado" },
  { value: "em processamento", label: "Em processamento" },
  { value: "faturado", label: "Faturado" },
  { value: "cancelado", label: "Cancelado" },
  { value: "indisponível", label: "Indisponível" },
  { value: "criado", label: "Criado" },
  { value: "aprovado", label: "Aprovado" },
];

const STATUS_COLORS: Record<string, string> = {
  entregue: "bg-green-100 text-green-700",
  enviado: "bg-blue-100 text-blue-700",
  "em processamento": "bg-yellow-100 text-yellow-700",
  faturado: "bg-indigo-100 text-indigo-700",
  cancelado: "bg-red-100 text-red-700",
  "indisponível": "bg-gray-100 text-gray-500",
  criado: "bg-purple-100 text-purple-700",
  aprovado: "bg-teal-100 text-teal-700",
};

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR");
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

export default function PedidosPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pedidos", page, status],
    queryFn: () => getPedidos({ page, limit: LIMIT, status: status || undefined }),
    placeholderData: (prev) => prev,
  });

  function handleStatusChange(value: string) {
    setStatus(value);
    setPage(1);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-500 text-sm mt-1">
            {data ? (
              <>
                <span className="font-medium text-gray-700">
                  {data.total.toLocaleString("pt-BR")}
                </span>{" "}
                pedidos encontrados
              </>
            ) : "Carregando..."}
          </p>
        </div>

        <div className="relative shrink-0">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="appearance-none w-full sm:w-52 pl-3 pr-8 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isError && <ErrorMessage message="Erro ao carregar pedidos. Verifique se o backend está rodando." />}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? <TableSkeleton /> : data && data.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Pedido</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Consumidor</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Data</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Itens</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.items.map((p) => (
                  <tr key={p.id_pedido} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        to={`/pedidos/${p.id_pedido}`}
                        className="font-mono text-xs text-indigo-600 hover:underline"
                      >
                        {p.id_pedido.slice(0, 8)}…
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-[180px] truncate">
                      {p.nome_consumidor}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(p.pedido_compra_timestamp)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[p.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{p.total_itens}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatBRL(p.valor_total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-gray-400 text-sm">Nenhum pedido encontrado.</div>
        )}
      </div>

      {data && (
        <Pagination page={data.page} pages={data.pages} total={data.total} limit={LIMIT} onChange={setPage} />
      )}
    </div>
  );
}
