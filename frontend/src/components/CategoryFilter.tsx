import { useQuery } from "@tanstack/react-query";
import { getCategorias } from "@/services/api";

function formatCategoria(nome: string) {
  return nome.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CategoryFilter({ value, onChange }: Props) {
  const { data: categorias = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
    staleTime: Infinity,
  });

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition cursor-pointer"
      >
        <option value="">Todas as categorias</option>
        {categorias.map((cat) => (
          <option key={cat.nome} value={cat.nome}>
            {formatCategoria(cat.nome)}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
