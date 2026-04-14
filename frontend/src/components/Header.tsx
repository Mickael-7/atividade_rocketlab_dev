import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const navLinkCls = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-indigo-600" : "text-gray-600 hover:text-gray-900"
  }`;

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = query.trim();
    navigate(term ? `/?busca=${encodeURIComponent(term)}` : "/");
    setQuery("");
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* logo + nav */}
        <div className="flex items-center gap-6 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg sm:text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="hidden sm:inline">E-Commerce Manager</span>
            <span className="sm:hidden">ECM</span>
          </Link>

          <nav className="hidden md:flex items-center gap-5">
            <NavLink to="/" end className={navLinkCls}>Catálogo</NavLink>
            <NavLink to="/pedidos" className={navLinkCls}>Pedidos</NavLink>
            <NavLink to="/consumidores" className={navLinkCls}>Consumidores</NavLink>
            <NavLink to="/vendedores" className={navLinkCls}>Vendedores</NavLink>
            <NavLink to="/dashboard" className={navLinkCls}>Dashboard</NavLink>
          </nav>
        </div>

        {/* busca global */}
        <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xs">
          <div className="relative w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar produto..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 shrink-0">
          {/* novo produto */}
          <button
            onClick={() => navigate("/produtos/novo")}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Novo Produto</span>
            <span className="sm:hidden">Novo</span>
          </button>

          {/* sair */}
          <button
            onClick={logout}
            title="Sair"
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
