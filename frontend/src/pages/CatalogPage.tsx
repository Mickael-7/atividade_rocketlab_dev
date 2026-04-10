import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

export default function CatalogPage() {
  const [page, setPage] = useState(1);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("");

  const debouncedBusca = useDebounce(busca, 400);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["produtos", page, debouncedBusca, categoria],
    queryFn: () =>
      getProdutos({ page, limit: LIMIT, busca: debouncedBusca, categoria }),
    placeholderData: (prev) => prev,
  });

  function handleBuscaChange(value: string) {
    setBusca(value);
    setPage(1);
  }

  function handleCategoriaChange(value: string) {
    setCategoria(value);
    setPage(1);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* cabeçalho */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Catálogo de Produtos</h1>
        <p className="text-gray-500 text-sm mt-1">
          {data ? (
            <>
              <span className="font-medium text-gray-700">
                {data.total.toLocaleString("pt-BR")}
              </span>{" "}
              produtos encontrados
            </>
          ) : (
            "Carregando..."
          )}
        </p>
      </div>

      {/* barra de filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar value={busca} onChange={handleBuscaChange} />
        <CategoryFilter value={categoria} onChange={handleCategoriaChange} />
      </div>

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
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
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
