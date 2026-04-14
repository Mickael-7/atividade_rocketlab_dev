import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProduto, deletarProduto, getCategorias } from "@/services/api";
import SalesStats from "@/components/SalesStats";
import ReviewList from "@/components/ReviewList";
import StarRating from "@/components/StarRating";
import { ProductDetailSkeleton } from "@/components/ui/Skeleton";
import ErrorMessage from "@/components/ui/ErrorMessage";
import ConfirmModal from "@/components/ui/ConfirmModal";

function formatCategoria(nome: string) {
  return nome.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function DimRow({ label, value, unit }: { label: string; value: number | null; unit: string }) {
  if (value === null) return null;
  return (
    <div className="flex justify-between py-2.5 border-b border-gray-100 dark:border-gray-600 last:border-0">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {value.toLocaleString("pt-BR")} {unit}
      </span>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: produto, isLoading, isError } = useQuery({
    queryKey: ["produto", id],
    queryFn: () => getProduto(id!),
    enabled: !!id,
  });

  const { data: categorias = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
    staleTime: Infinity,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletarProduto(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      toast.success("Produto excluído com sucesso.");
      navigate("/", { replace: true });
    },
    onError: () => {
      toast.error("Erro ao excluir produto. Tente novamente.");
    },
  });

  if (isLoading) return <ProductDetailSkeleton />;
  if (isError || !produto) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorMessage message="Produto não encontrado ou erro ao carregar." />
        <Link to="/" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
          ← Voltar ao catálogo
        </Link>
      </div>
    );
  }

  const imagem = categorias.find((c) => c.nome === produto.categoria_produto)?.imagem_url;

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Catálogo</Link>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 dark:text-gray-100 font-medium truncate">{produto.nome_produto}</span>
        </nav>

        {/* hero */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row">
            {/* imagem */}
            <div className="md:w-72 h-56 md:h-auto bg-gray-100 dark:bg-gray-700 shrink-0">
              {imagem ? (
                <img
                  src={imagem}
                  alt={produto.categoria_produto}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                  <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                  </svg>
                </div>
              )}
            </div>

            {/* info */}
            <div className="p-6 flex flex-col gap-3 flex-1">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1.5">
                  <span className="inline-block text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full">
                    {formatCategoria(produto.categoria_produto)}
                  </span>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                    {produto.nome_produto}
                  </h1>
                  {produto.avaliacoes.media_avaliacao !== null && (
                    <StarRating
                      value={produto.avaliacoes.media_avaliacao}
                      total={produto.avaliacoes.total_avaliacoes}
                      size="md"
                    />
                  )}
                </div>

                {/* ações */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/produtos/${produto.id_produto}/editar`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </Link>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Excluir
                  </button>
                </div>
              </div>

              {/* dimensões */}
              <div className="mt-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Especificações
                </p>
                <DimRow label="Peso" value={produto.peso_produto_gramas} unit="g" />
                <DimRow label="Comprimento" value={produto.comprimento_centimetros} unit="cm" />
                <DimRow label="Altura" value={produto.altura_centimetros} unit="cm" />
                <DimRow label="Largura" value={produto.largura_centimetros} unit="cm" />
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">ID: {produto.id_produto}</p>
            </div>
          </div>
        </div>

        {/* vendas */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Desempenho de Vendas</h2>
          <SalesStats vendas={produto.vendas} />
        </section>

        {/* avaliações */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Avaliações dos Consumidores
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <ReviewList stats={produto.avaliacoes} produtoId={produto.id_produto} />
          </div>
        </section>
      </div>

      {/* modal de exclusão */}
      {showDeleteModal && (
        <ConfirmModal
          title="Excluir produto"
          message={`Tem certeza que deseja excluir "${produto.nome_produto}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          loading={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate()}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}
