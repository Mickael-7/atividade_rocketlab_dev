import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { getDashboard } from "@/services/api";
import { Skeleton } from "@/components/ui/Skeleton";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { exportarCSV } from "@/utils/exportCsv";
import type { DashboardData } from "@/types";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatCategoria(nome: string) {
  return nome.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatMes(mes: string) {
  const [year, month] = mes.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
}

const STATUS_COLORS_PIE: Record<string, string> = {
  entregue: "#22c55e",
  enviado: "#3b82f6",
  "em processamento": "#f59e0b",
  faturado: "#6366f1",
  cancelado: "#ef4444",
  "indisponível": "#9ca3af",
  criado: "#a855f7",
  aprovado: "#14b8a6",
};

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}

function PrazoBar({ data }: { data: DashboardData }) {
  const total = data.pedidos_no_prazo + data.pedidos_atrasados;
  const pct = total > 0 ? Math.round((data.pedidos_no_prazo / total) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-green-600 font-medium">No prazo — {data.pedidos_no_prazo.toLocaleString("pt-BR")}</span>
        <span className="text-red-500 font-medium">Atrasados — {data.pedidos_atrasados.toLocaleString("pt-BR")}</span>
      </div>
      <div className="h-3 rounded-full bg-red-100 overflow-hidden">
        <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-gray-400 text-right">{pct}% entregas no prazo</p>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    staleTime: 1000 * 60 * 10,
  });

  const maxReceita = data?.receita_por_estado[0]?.receita ?? 1;
  const prazoTotal = (data?.pedidos_no_prazo ?? 0) + (data?.pedidos_atrasados ?? 0);
  const prازPct = prazoTotal > 0 ? Math.round(((data?.pedidos_no_prazo ?? 0) / prazoTotal) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        {data && (
          <button
            onClick={() =>
              exportarCSV(
                data.top_produtos.map((p) => ({
                  id_produto: p.id_produto,
                  nome_produto: p.nome_produto,
                  categoria: p.categoria_produto,
                  unidades_vendidas: p.total_unidades,
                  receita_total: p.receita_total,
                })),
                "dashboard_top_produtos"
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shrink-0"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exportar Top Produtos
          </button>
        )}
      </div>

      {isLoading && <DashboardSkeleton />}
      {isError && <ErrorMessage message="Erro ao carregar o dashboard. Verifique se o backend está rodando." />}

      {data && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total de Pedidos" value={data.total_pedidos.toLocaleString("pt-BR")} />
            <StatCard label="Receita Total" value={formatBRL(data.receita_total)} />
            <StatCard label="Ticket Médio" value={formatBRL(data.ticket_medio)} />
            <StatCard
              label="Entregas no Prazo"
              value={`${prازPct}%`}
              sub={`${data.pedidos_no_prazo.toLocaleString("pt-BR")} de ${prazoTotal.toLocaleString("pt-BR")} pedidos`}
            />
          </div>

          {/* Gráfico de linha — pedidos por mês */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-6">Pedidos por Mês</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.pedidos_por_mes} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="mes"
                  tickFormatter={formatMes}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => v.toLocaleString("pt-BR")}
                />
                <Tooltip
                  formatter={(value: number) => [value.toLocaleString("pt-BR"), "Pedidos"]}
                  labelFormatter={formatMes}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#6366f1" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de pizza — status dos pedidos */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Distribuição de Status</h2>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={data.status_pedidos}
                    dataKey="total"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {data.status_pedidos.map((entry) => (
                      <Cell
                        key={entry.status}
                        fill={STATUS_COLORS_PIE[entry.status] ?? "#e5e7eb"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [value.toLocaleString("pt-BR"), name]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                  />
                  <Legend
                    formatter={(value) => <span className="text-xs capitalize text-gray-600">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top 5 produtos + receita por estado */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Top 5 Produtos Mais Vendidos</h2>
                <div className="space-y-3">
                  {data.top_produtos.map((p, i) => (
                    <Link key={p.id_produto} to={`/produtos/${p.id_produto}`} className="flex items-center gap-3 group">
                      <span className="text-lg font-bold text-gray-300 w-6 shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                          {p.nome_produto}
                        </p>
                        <p className="text-xs text-gray-400">{formatCategoria(p.categoria_produto)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-gray-900">{p.total_unidades.toLocaleString("pt-BR")} un.</p>
                        <p className="text-xs text-gray-400">{formatBRL(p.receita_total)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Receita por estado + pontualidade */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Receita por Estado (Vendedor)</h2>
            <div className="space-y-2.5">
              {data.receita_por_estado.map((r) => (
                <div key={r.estado} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-500 w-6 shrink-0">{r.estado}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(r.receita / maxReceita) * 100}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 shrink-0 w-28 text-right">{formatBRL(r.receita)}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Pontualidade de Entrega</h3>
              <PrazoBar data={data} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
