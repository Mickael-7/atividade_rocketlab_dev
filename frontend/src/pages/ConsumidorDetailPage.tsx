import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getConsumidor } from "@/services/api";
import { Skeleton } from "@/components/ui/Skeleton";
import ErrorMessage from "@/components/ui/ErrorMessage";

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

export default function ConsumidorDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: consumidor, isLoading, isError } = useQuery({
    queryKey: ["consumidor", id],
    queryFn: () => getConsumidor(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (isError || !consumidor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorMessage message="Consumidor não encontrado ou erro ao carregar." />
        <Link to="/consumidores" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
          ← Voltar aos consumidores
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/consumidores" className="hover:text-indigo-600 transition-colors">Consumidores</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 font-medium truncate">{consumidor.nome_consumidor}</span>
      </nav>

      {/* perfil */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
          <span className="text-xl font-bold text-indigo-600">
            {consumidor.nome_consumidor.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{consumidor.nome_consumidor}</h1>
          <p className="text-sm text-gray-500">{consumidor.cidade}, {consumidor.estado} — CEP {consumidor.prefixo_cep}</p>
        </div>
        <div className="flex gap-6 shrink-0">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{consumidor.total_pedidos.toLocaleString("pt-BR")}</p>
            <p className="text-xs text-gray-500">pedidos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{formatBRL(consumidor.total_gasto)}</p>
            <p className="text-xs text-gray-500">total gasto</p>
          </div>
        </div>
      </div>

      {/* histórico de pedidos */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Histórico de Pedidos</h2>
        </div>
        {consumidor.pedidos.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-400">Nenhum pedido encontrado.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {consumidor.pedidos.map((p) => (
              <div key={p.id_pedido} className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <Link
                    to={`/pedidos/${p.id_pedido}`}
                    className="font-mono text-xs text-indigo-600 hover:underline shrink-0"
                  >
                    {p.id_pedido.slice(0, 8)}…
                  </Link>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize shrink-0 ${STATUS_COLORS[p.status] ?? "bg-gray-100 text-gray-500"}`}>
                    {p.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs text-gray-400">{formatDate(p.pedido_compra_timestamp)}</span>
                  <span className="text-sm font-semibold text-gray-900">{formatBRL(p.valor_total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
