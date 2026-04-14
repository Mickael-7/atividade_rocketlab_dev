import axios from "axios";
import { toast } from "sonner";
import { clearToken, getToken } from "@/hooks/useAuth";
import type {
  Categoria,
  ConsumidorDetail,
  ConsumidorListResponse,
  DashboardData,
  PedidoDetail,
  PedidoListResponse,
  ProdutoCreate,
  ProdutoDetail,
  ProdutoListParams,
  ProdutoListResponse,
  ProdutoUpdate,
  Produto,
  Vendedor,
  VendedorListResponse,
} from "@/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      clearToken();
      window.location.href = "/login";
      return Promise.reject(error);
    }
    if (!status || status >= 500) {
      toast.error("Erro no servidor. Tente novamente em instantes.");
    }
    return Promise.reject(error);
  }
);

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

export async function getCategorias(): Promise<Categoria[]> {
  const { data } = await api.get<Categoria[]>("/categorias");
  return data;
}

export async function getVendedores(params: { page?: number; limit?: number } = {}): Promise<VendedorListResponse> {
  const { data } = await api.get<VendedorListResponse>("/vendedores", { params });
  return data;
}

export async function getDashboard(): Promise<DashboardData> {
  const { data } = await api.get<DashboardData>("/dashboard");
  return data;
}

export async function getPedidos(params: { page?: number; limit?: number; status?: string } = {}): Promise<PedidoListResponse> {
  const { data } = await api.get<PedidoListResponse>("/pedidos", { params });
  return data;
}

export async function getPedido(id: string): Promise<PedidoDetail> {
  const { data } = await api.get<PedidoDetail>(`/pedidos/${id}`);
  return data;
}

export async function getConsumidores(params: { page?: number; limit?: number; busca?: string } = {}): Promise<ConsumidorListResponse> {
  const { data } = await api.get<ConsumidorListResponse>("/consumidores", { params });
  return data;
}

export async function getConsumidor(id: string): Promise<ConsumidorDetail> {
  const { data } = await api.get<ConsumidorDetail>(`/consumidores/${id}`);
  return data;
}

export async function login(username: string, password: string): Promise<{ access_token: string }> {
  const form = new URLSearchParams({ username, password });
  const { data } = await api.post<{ access_token: string }>("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data;
}

export async function responderAvaliacao(
  id: string,
  resposta: string
): Promise<void> {
  await api.patch(`/avaliacoes/${id}/resposta`, { resposta });
}

export async function removerRespostaAvaliacao(id: string): Promise<void> {
  await api.delete(`/avaliacoes/${id}/resposta`);
}

export type { Vendedor };
