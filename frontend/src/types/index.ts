// ─── Produto ─────────────────────────────────────────────────────────────────

export interface Produto {
  id_produto: string;
  nome_produto: string;
  categoria_produto: string;
  peso_produto_gramas: number | null;
  comprimento_centimetros: number | null;
  altura_centimetros: number | null;
  largura_centimetros: number | null;
  media_avaliacao?: number | null;
  total_avaliacoes?: number;
}

export interface ProdutoCreate {
  nome_produto: string;
  categoria_produto: string;
  peso_produto_gramas?: number | null;
  comprimento_centimetros?: number | null;
  altura_centimetros?: number | null;
  largura_centimetros?: number | null;
}

export type ProdutoUpdate = Partial<ProdutoCreate>;

// ─── Paginação ────────────────────────────────────────────────────────────────

export interface ProdutoListResponse {
  items: Produto[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ProdutoListParams {
  page?: number;
  limit?: number;
  busca?: string;
  categoria?: string;
}

// ─── Detalhe (vendas + avaliações) ───────────────────────────────────────────

export interface VendasStats {
  total_unidades_vendidas: number;
  receita_total: number;
  preco_medio: number;
}

export interface AvaliacaoItem {
  id_avaliacao: string;
  avaliacao: number;
  titulo_comentario: string | null;
  comentario: string | null;
  data_comentario: string | null;
}

export interface AvaliacaoStats {
  media_avaliacao: number | null;
  total_avaliacoes: number;
  avaliacoes: AvaliacaoItem[];
}

export interface ProdutoDetail extends Produto {
  vendas: VendasStats;
  avaliacoes: AvaliacaoStats;
}

// ─── Categoria ────────────────────────────────────────────────────────────────

export interface Categoria {
  nome: string;
  imagem_url: string | null;
}
