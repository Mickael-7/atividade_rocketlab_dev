import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPedido } from "@/services/api";
import { Skeleton } from "@/components/ui/Skeleton";
import ErrorMessage from "@/components/ui/ErrorMessage";

const STATUS_COLORS: Record<string, string> = {
  entregue: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  enviado: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "em processamento": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  faturado: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  cancelado: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "indisponível": "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
  criado: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  aprovado: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 text-right">{value ?? "—"}</span>
    </div>
  );
}

export default function PedidoDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: pedido, isLoading, isError } = useQuery({
    queryKey: ["pedido", id],
    queryFn: () => getPedido(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (isError || !pedido) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorMessage message="Pedido não encontrado ou erro ao carregar." />
        <Link to="/pedidos" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
          ← Voltar aos pedidos
        </Link>
      </div>
    );
  }

  const prazoLabel = pedido.entrega_no_prazo === "Sim"
    ? <span className="text-green-600">Sim</span>
    : pedido.entrega_no_prazo === "Não"
    ? <span className="text-red-500">Não</span>
    : "—";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/pedidos" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pedidos</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-mono text-gray-700 dark:text-gray-300">{pedido.id_pedido.slice(0, 8)}…</span>
      </nav>

      {/* cabeçalho */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-mono">{pedido.id_pedido}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Comprado em {formatDate(pedido.pedido_compra_timestamp)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${STATUS_COLORS[pedido.status] ?? "bg-gray-100 text-gray-500"}`}>
          {pedido.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* consumidor */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Consumidor</h2>
          <Link
            to={`/consumidores/${pedido.consumidor.id_consumidor}`}
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {pedido.consumidor.nome_consumidor}
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{pedido.consumidor.cidade}, {pedido.consumidor.estado}</p>
        </div>

        {/* entrega */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Entrega</h2>
          <InfoRow label="Entrega estimada" value={formatDate(pedido.data_estimada_entrega)} />
          <InfoRow label="Entregue em" value={formatDate(pedido.pedido_entregue_timestamp)} />
          <InfoRow label="Prazo estimado" value={pedido.tempo_entrega_estimado_dias != null ? `${pedido.tempo_entrega_estimado_dias} dias` : null} />
          <InfoRow label="Tempo real" value={pedido.tempo_entrega_dias != null ? `${pedido.tempo_entrega_dias} dias` : null} />
          <InfoRow label="No prazo" value={prazoLabel} />
        </div>
      </div>

      {/* itens */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Itens do Pedido</h2>
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatBRL(pedido.valor_total)}</span>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-700">
          {pedido.itens.map((item) => (
            <div key={item.id_item} className="px-5 py-3 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <Link
                  to={`/produtos/${item.id_produto}`}
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate block"
                >
                  {item.nome_produto}
                </Link>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Vendedor: {item.nome_vendedor}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatBRL(item.preco_BRL)}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Frete: {formatBRL(item.preco_frete)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* avaliações */}
      {pedido.avaliacoes.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Avaliações</h2>
          <div className="space-y-4">
            {pedido.avaliacoes.map((av, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex shrink-0 mt-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className={`h-4 w-4 ${s <= av.avaliacao ? "text-amber-400" : "text-gray-200 dark:text-gray-600"}`} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div>
                  {av.titulo_comentario && <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{av.titulo_comentario}</p>}
                  {av.comentario && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{av.comentario}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
