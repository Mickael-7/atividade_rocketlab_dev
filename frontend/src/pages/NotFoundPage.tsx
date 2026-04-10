import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <p className="text-8xl font-extrabold text-indigo-100 select-none">404</p>
      <h1 className="text-2xl font-bold text-gray-900 -mt-4">Página não encontrada</h1>
      <p className="text-gray-500 text-sm mt-2 max-w-sm">
        A página que você tentou acessar não existe ou foi removida.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar ao catálogo
      </Link>
    </div>
  );
}
