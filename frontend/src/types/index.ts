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
  ordenar?: string;
  avaliacao_min?: number;
  avaliacao_max?: number;
}

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
  resposta_gerente: string | null;
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

export interface Categoria {
  nome: string;
  imagem_url: string | null;
}

export interface ItemPedidoResumo {
  id_item: number;
  id_produto: string;
  nome_produto: string;
  id_vendedor: string;
  nome_vendedor: string;
  preco_BRL: number;
  preco_frete: number;
}

export interface AvaliacaoPedidoResumo {
  avaliacao: number;
  titulo_comentario: string | null;
  comentario: string | null;
}

export interface ConsumidorResumo {
  id_consumidor: string;
  nome_consumidor: string;
  cidade: string;
  estado: string;
}

export interface PedidoResponse {
  id_pedido: string;
  status: string;
  pedido_compra_timestamp: string | null;
  nome_consumidor: string;
  total_itens: number;
  valor_total: number;
}

export interface PedidoDetail {
  id_pedido: string;
  status: string;
  pedido_compra_timestamp: string | null;
  pedido_entregue_timestamp: string | null;
  data_estimada_entrega: string | null;
  tempo_entrega_dias: number | null;
  tempo_entrega_estimado_dias: number | null;
  diferenca_entrega_dias: number | null;
  entrega_no_prazo: string | null;
  consumidor: ConsumidorResumo;
  itens: ItemPedidoResumo[];
  avaliacoes: AvaliacaoPedidoResumo[];
  valor_total: number;
}

export interface PedidoListResponse {
  items: PedidoResponse[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PedidoResumo {
  id_pedido: string;
  status: string;
  pedido_compra_timestamp: string | null;
  valor_total: number;
}

export interface ConsumidorResponse {
  id_consumidor: string;
  nome_consumidor: string;
  cidade: string;
  estado: string;
  total_pedidos: number;
  total_gasto: number;
}

export interface ConsumidorDetail extends ConsumidorResponse {
  prefixo_cep: string;
  pedidos: PedidoResumo[];
}

export interface ConsumidorListResponse {
  items: ConsumidorResponse[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface Vendedor {
  id_vendedor: string;
  nome_vendedor: string;
  cidade: string;
  estado: string;
  total_vendas: number;
  receita_total: number;
}

export interface VendedorListResponse {
  items: Vendedor[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface TopProduto {
  id_produto: string;
  nome_produto: string;
  categoria_produto: string;
  total_unidades: number;
  receita_total: number;
}

export interface ReceitaEstado {
  estado: string;
  receita: number;
}

export interface PedidosPorMes {
  mes: string;
  total: number;
}

export interface StatusPedido {
  status: string;
  total: number;
}

export interface DashboardData {
  total_pedidos: number;
  receita_total: number;
  ticket_medio: number;
  pedidos_no_prazo: number;
  pedidos_atrasados: number;
  top_produtos: TopProduto[];
  receita_por_estado: ReceitaEstado[];
  pedidos_por_mes: PedidosPorMes[];
  status_pedidos: StatusPedido[];
}
