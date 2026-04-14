import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AvaliacaoStats } from "@/types";
import StarRating from "@/components/StarRating";
import { responderAvaliacao, removerRespostaAvaliacao } from "@/services/api";

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
      <span className="w-4 text-right">{star}</span>
      <svg className="h-3 w-3 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right">{count}</span>
    </div>
  );
}

function ReviewItem({
  av,
  produtoId,
}: {
  av: AvaliacaoStats["avaliacoes"][number];
  produtoId: string;
}) {
  const queryClient = useQueryClient();
  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState(av.resposta_gerente ?? "");

  const salvarMutation = useMutation({
    mutationFn: () => responderAvaliacao(av.id_avaliacao, texto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produto", produtoId] });
      toast.success("Resposta salva.");
      setEditando(false);
    },
    onError: () => toast.error("Erro ao salvar resposta."),
  });

  const removerMutation = useMutation({
    mutationFn: () => removerRespostaAvaliacao(av.id_avaliacao),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produto", produtoId] });
      toast.success("Resposta removida.");
      setEditando(false);
    },
    onError: () => toast.error("Erro ao remover resposta."),
  });

  return (
    <div className="py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm shrink-0">
            {av.avaliacao}
          </div>
          <div>
            <StarRating value={av.avaliacao} size="sm" />
            {av.titulo_comentario && av.titulo_comentario !== "Sem título" && (
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mt-0.5">{av.titulo_comentario}</p>
            )}
          </div>
        </div>
        {av.data_comentario && (
          <time className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
            {new Date(av.data_comentario).toLocaleDateString("pt-BR")}
          </time>
        )}
      </div>

      {av.comentario && av.comentario !== "Sem comentário" && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed pl-10">
          {av.comentario}
        </p>
      )}

      {/* resposta existente */}
      {av.resposta_gerente && !editando && (
        <div className="mt-3 ml-10 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">Resposta da loja</p>
          <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{av.resposta_gerente}</p>
          <div className="mt-2 flex gap-3">
            <button
              onClick={() => { setTexto(av.resposta_gerente ?? ""); setEditando(true); }}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Editar
            </button>
            <button
              onClick={() => removerMutation.mutate()}
              disabled={removerMutation.isPending}
              className="text-xs text-red-500 hover:underline disabled:opacity-50"
            >
              Remover
            </button>
          </div>
        </div>
      )}

      {/* formulário de resposta */}
      {editando ? (
        <div className="mt-3 ml-10 space-y-2">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={3}
            placeholder="Escreva a resposta da loja..."
            className="w-full text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => salvarMutation.mutate()}
              disabled={salvarMutation.isPending || !texto.trim()}
              className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {salvarMutation.isPending ? "Salvando..." : "Salvar"}
            </button>
            <button
              onClick={() => setEditando(false)}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : !av.resposta_gerente ? (
        <button
          onClick={() => { setTexto(""); setEditando(true); }}
          className="mt-2 ml-10 text-xs text-indigo-500 hover:text-indigo-700 hover:underline transition-colors"
        >
          + Responder
        </button>
      ) : null}
    </div>
  );
}

interface Props {
  stats: AvaliacaoStats;
  produtoId: string;
}

export default function ReviewList({ stats, produtoId }: Props) {
  const { media_avaliacao, total_avaliacoes, avaliacoes } = stats;

  const countByStar = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: avaliacoes.filter((a) => a.avaliacao === star).length,
  }));

  if (total_avaliacoes === 0) {
    return (
      <div className="text-center py-10 text-gray-400 dark:text-gray-500">
        <svg className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <p className="text-sm">Nenhuma avaliação ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* resumo */}
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
        <div className="text-center shrink-0">
          <p className="text-5xl font-extrabold text-gray-900 dark:text-gray-100">
            {media_avaliacao?.toFixed(1)}
          </p>
          <StarRating value={media_avaliacao!} size="md" />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {total_avaliacoes.toLocaleString("pt-BR")} avaliações
            {total_avaliacoes >= 50 && " (mostrando 50)"}
          </p>
        </div>

        <div className="flex-1 w-full space-y-1.5">
          {countByStar.map(({ star, count }) => (
            <RatingBar key={star} star={star} count={count} total={avaliacoes.length} />
          ))}
        </div>
      </div>

      {/* lista */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {avaliacoes.map((av) => (
          <ReviewItem key={av.id_avaliacao} av={av} produtoId={produtoId} />
        ))}
      </div>
    </div>
  );
}
