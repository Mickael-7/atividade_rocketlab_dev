import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import NotFoundPage from "@/pages/NotFoundPage";
import LoginPage from "@/pages/LoginPage";

const CatalogPage = lazy(() => import("@/pages/CatalogPage"));
const ProductDetailPage = lazy(() => import("@/pages/ProductDetailPage"));
const ProductFormPage = lazy(() => import("@/pages/ProductFormPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const VendedoresPage = lazy(() => import("@/pages/VendedoresPage"));
const PedidosPage = lazy(() => import("@/pages/PedidosPage"));
const PedidoDetailPage = lazy(() => import("@/pages/PedidoDetailPage"));
const ConsumidoresPage = lazy(() => import("@/pages/ConsumidoresPage"));
const ConsumidorDetailPage = lazy(() => import("@/pages/ConsumidorDetailPage"));

export default function App() {
  return (
    <Routes>
      {/* rota pública */}
      <Route path="/login" element={<LoginPage />} />

      {/* rotas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1">
                <ErrorBoundary>
                  <Suspense fallback={<LoadingSpinner fullPage />}>
                    <Routes>
                      <Route path="/" element={<CatalogPage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/vendedores" element={<VendedoresPage />} />
                      <Route path="/pedidos" element={<PedidosPage />} />
                      <Route path="/pedidos/:id" element={<PedidoDetailPage />} />
                      <Route path="/consumidores" element={<ConsumidoresPage />} />
                      <Route path="/consumidores/:id" element={<ConsumidorDetailPage />} />
                      <Route path="/produtos/novo" element={<ProductFormPage />} />
                      <Route path="/produtos/:id" element={<ProductDetailPage />} />
                      <Route path="/produtos/:id/editar" element={<ProductFormPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
              </main>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
