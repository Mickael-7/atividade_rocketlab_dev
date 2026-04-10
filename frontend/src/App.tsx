import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Header from "@/components/Header";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import NotFoundPage from "@/pages/NotFoundPage";

const CatalogPage = lazy(() => import("@/pages/CatalogPage"));
const ProductDetailPage = lazy(() => import("@/pages/ProductDetailPage"));
const ProductFormPage = lazy(() => import("@/pages/ProductFormPage"));

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner fullPage />}>
            <Routes>
              <Route path="/" element={<CatalogPage />} />
              <Route path="/produtos/novo" element={<ProductFormPage />} />
              <Route path="/produtos/:id" element={<ProductDetailPage />} />
              <Route path="/produtos/:id/editar" element={<ProductFormPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}
