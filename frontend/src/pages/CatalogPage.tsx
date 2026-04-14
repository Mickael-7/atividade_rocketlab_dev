import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getProdutos } from "@/services/api";
import { useDebounce } from "@/hooks/useDebounce";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import Pagination from "@/components/Pagination";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import type { Produto } from "@/types";

const LIMIT = 20;

type ProdutoComStats = Produto & {
  media_avaliacao: number | null;
  total_avaliacoes: number;
};

const ORDENAR_OPTIONS = [
  { value: "", label: "Relevância" },
  { value: "nome_asc", label: "Nome (A-Z)" },
  { value: "nome_desc", label: "Nome (Z-A)" },
  { value: "avaliacao_desc", label: "Melhor avaliação" },
  { value: "mais_vendidos", label: "Mais vendidos" },
];

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [busca, setBusca] = useState(searchParams.get("busca") ?? "");
  const [categoria, setCategoria] = useState("");
  const [ordenar, setOrdenar] = useState("");
  const [avaliacaoMin, setAvaliacaoMin] = useState(0);
  const [avaliacaoMax, setAvaliacaoMax] = useState(0);

  const debouncedBusca = useDebounce(busca, 400);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedBusca) params.set("busca", debouncedBusca);
    else params.delete("busca");
    setSearchParams(params, { replace: true });
  }, [debouncedBusca]);

  const filtroInvalido = avaliacaoMin > 0 && avaliacaoMax > 0 && avaliacaoMin > avaliacaoMax;

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["produtos", page, debouncedBusca, categoria, ordenar, avaliacaoMin, avaliacaoMax],
    queryFn: () =>
      getProdutos({ page, limit: LIMIT, busca: debouncedBusca, categoria, ordenar, avaliacao_min: avaliacaoMin || undefined, avaliacao_max: avaliacaoMax || undefined }),
    placeholderData: (prev) => prev,
    enabled: !filtroInvalido,
  });

  function handleBuscaChange(value: string) {
    setBusca(value);
    setPage(1);
  }

  function handleCategoriaChange(value: string) {
    setCategoria(value);
    setPage(1);
  }

  function handleOrdenarChange(value: string) {
    setOrdenar(value);
    setPage(1);
  }

  function handleAvaliacaoMin(value: number) {
    setAvaliacaoMin((prev) => (prev === value ? 0 : value));
    setPage(1);
  }

  function handleAvaliacaoMax(value: number) {
    setAvaliacaoMax((prev) => (prev === value ? 0 : value));
    setPage(1);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* cabeçalho */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Catálogo de Produtos</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {data ? (
            <>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {data.total.toLocaleString("pt-BR")}
              </span>{" "}
              produtos encontrados
            </>
          ) : (
            "Carregando..."
          )}
        </p>
      </div>

      {/* barra de filtros — linha 1 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <SearchBar value={busca} onChange={handleBuscaChange} />
        <CategoryFilter value={categoria} onChange={handleCategoriaChange} />
        <div className="relative shrink-0">
          <select
            value={ordenar}
            onChange={(e) => handleOrdenarChange(e.target.value)}
            className="appearance-none h-full w-full sm:w-48 pl-3 pr-8 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {ORDENAR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* filtros de avaliação — linha 2 */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6">
        {/* mínima */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">Avaliação mínima:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleAvaliacaoMin(star)}
                title={`${star} estrela${star > 1 ? "s" : ""} ou mais`}
                className="focus:outline-none"
              >
                <svg
                  className={`h-5 w-5 transition-colors ${
                    star <= avaliacaoMin ? "text-amber-400" : "text-gray-300 hover:text-amber-300"
                  }`}
                  viewBox="0 0 20 20" fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          {avaliacaoMin > 0 && (
            <button
              onClick={() => { setAvaliacaoMin(0); setPage(1); }}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              limpar
            </button>
          )}
        </div>

        {/* máxima */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">Avaliação máxima:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleAvaliacaoMax(star)}
                title={`até ${star} estrela${star > 1 ? "s" : ""}`}
                className="focus:outline-none"
              >
                <svg
                  className={`h-5 w-5 transition-colors ${
                    star <= avaliacaoMax ? "text-indigo-400" : "text-gray-300 hover:text-indigo-300"
                  }`}
                  viewBox="0 0 20 20" fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          {avaliacaoMax > 0 && (
            <button
              onClick={() => { setAvaliacaoMax(0); setPage(1); }}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              limpar
            </button>
          )}
        </div>
      </div>

      {/* aviso de filtro inválido */}
      {filtroInvalido && (
        <div className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300 text-sm">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          A avaliação mínima ({avaliacaoMin}★) não pode ser maior que a máxima ({avaliacaoMax}★). Ajuste os filtros para ver os resultados.
        </div>
      )}

      {/* skeleton no carregamento inicial */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <ErrorMessage message="Não foi possível carregar os produtos. Verifique se o backend está rodando." />
      )}

      {/* grid */}
      {data && (
        <>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 transition-opacity duration-200 ${
              isFetching ? "opacity-60" : "opacity-100"
            }`}
          >
            {data.items.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500 gap-3">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">Nenhum produto encontrado para "<strong>{debouncedBusca || categoria}</strong>"</p>
              </div>
            ) : (
              data.items.map((produto) => (
                <ProductCard
                  key={produto.id_produto}
                  produto={produto as ProdutoComStats}
                />
              ))
            )}
          </div>

          <Pagination
            page={data.page}
            pages={data.pages}
            total={data.total}
            limit={LIMIT}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}
