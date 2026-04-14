import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { Produto } from "@/types";
import { getCategorias } from "@/services/api";
import StarRating from "@/components/StarRating";

function formatCategoria(nome: string) {
  return nome.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

interface Props {
  produto: Produto & { media_avaliacao: number | null; total_avaliacoes: number };
}

export default function ProductCard({ produto }: Props) {
  const { data: categorias = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
    staleTime: Infinity,
  });

  const imagem = categorias.find((c) => c.nome === produto.categoria_produto)?.imagem_url;

  return (
    <Link
      to={`/produtos/${produto.id_produto}`}
      className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      <div className="h-40 bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {imagem ? (
          <img
            src={imagem}
            alt={produto.categoria_produto}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="inline-block self-start text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
          {formatCategoria(produto.categoria_produto)}
        </span>

        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {produto.nome_produto}
        </h3>

        <div className="mt-auto pt-2 flex items-center justify-between">
          {produto.media_avaliacao !== null ? (
            <StarRating value={produto.media_avaliacao} total={produto.total_avaliacoes} />
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500">Sem avaliações</span>
          )}

          {produto.peso_produto_gramas !== null && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {produto.peso_produto_gramas >= 1000
                ? `${(produto.peso_produto_gramas / 1000).toFixed(1)} kg`
                : `${produto.peso_produto_gramas} g`}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
