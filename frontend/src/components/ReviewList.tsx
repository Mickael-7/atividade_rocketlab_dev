import type { AvaliacaoStats } from "@/types";
import StarRating from "@/components/StarRating";

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <span className="w-4 text-right">{star}</span>
      <svg className="h-3 w-3 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right">{count}</span>
    </div>
  );
}

interface Props {
  stats: AvaliacaoStats;
}

export default function ReviewList({ stats }: Props) {
  const { media_avaliacao, total_avaliacoes, avaliacoes } = stats;

  // contagem por estrela
  const countByStar = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: avaliacoes.filter((a) => a.avaliacao === star).length,
  }));

  if (total_avaliacoes === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
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
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-gray-50 rounded-xl p-5">
        <div className="text-center shrink-0">
          <p className="text-5xl font-extrabold text-gray-900">
            {media_avaliacao?.toFixed(1)}
          </p>
          <StarRating value={media_avaliacao!} size="md" />
          <p className="text-xs text-gray-400 mt-1">
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
      <div className="divide-y divide-gray-100">
        {avaliacoes.map((av) => (
          <div key={av.id_avaliacao} className="py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm shrink-0">
                  {av.avaliacao}
                </div>
                <div>
                  <StarRating value={av.avaliacao} size="sm" />
                  {av.titulo_comentario && av.titulo_comentario !== "Sem título" && (
                    <p className="text-sm font-medium text-gray-800 mt-0.5">{av.titulo_comentario}</p>
                  )}
                </div>
              </div>
              {av.data_comentario && (
                <time className="text-xs text-gray-400 shrink-0">
                  {new Date(av.data_comentario).toLocaleDateString("pt-BR")}
                </time>
              )}
            </div>

            {av.comentario && av.comentario !== "Sem comentário" && (
              <p className="mt-2 text-sm text-gray-600 leading-relaxed pl-10">
                {av.comentario}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
