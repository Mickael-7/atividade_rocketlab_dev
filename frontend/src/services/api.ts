import axios from "axios";
import type {
  Categoria,
  ProdutoCreate,
  ProdutoDetail,
  ProdutoListParams,
  ProdutoListResponse,
  ProdutoUpdate,
  Produto,
} from "@/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// ─── Produtos ─────────────────────────────────────────────────────────────────

export async function getProdutos(
  params: ProdutoListParams = {}
): Promise<ProdutoListResponse> {
  const { data } = await api.get<ProdutoListResponse>("/produtos", { params });
  return data;
}

export async function getProduto(id: string): Promise<ProdutoDetail> {
  const { data } = await api.get<ProdutoDetail>(`/produtos/${id}`);
  return data;
}

export async function criarProduto(payload: ProdutoCreate): Promise<Produto> {
  const { data } = await api.post<Produto>("/produtos", payload);
  return data;
}

export async function atualizarProduto(
  id: string,
  payload: ProdutoUpdate
): Promise<Produto> {
  const { data } = await api.put<Produto>(`/produtos/${id}`, payload);
  return data;
}

export async function deletarProduto(id: string): Promise<void> {
  await api.delete(`/produtos/${id}`);
}

// ─── Categorias ───────────────────────────────────────────────────────────────

export async function getCategorias(): Promise<Categoria[]> {
  const { data } = await api.get<Categoria[]>("/categorias");
  return data;
}
