import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProduto, getCategorias, criarProduto, atualizarProduto } from "@/services/api";
import FormField from "@/components/ui/FormField";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import type { ProdutoCreate } from "@/types";

type FormData = {
  nome_produto: string;
  categoria_produto: string;
  peso_produto_gramas: string;
  comprimento_centimetros: string;
  altura_centimetros: string;
  largura_centimetros: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const EMPTY: FormData = {
  nome_produto: "",
  categoria_produto: "",
  peso_produto_gramas: "",
  comprimento_centimetros: "",
  altura_centimetros: "",
  largura_centimetros: "",
};

function formatCategoria(nome: string) {
  return nome.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.nome_produto.trim()) {
    errors.nome_produto = "Nome é obrigatório.";
  } else if (data.nome_produto.trim().length > 255) {
    errors.nome_produto = "Nome deve ter no máximo 255 caracteres.";
  }

  if (!data.categoria_produto) {
    errors.categoria_produto = "Selecione uma categoria.";
  }

  const numFields: (keyof FormData)[] = [
    "peso_produto_gramas",
    "comprimento_centimetros",
    "altura_centimetros",
    "largura_centimetros",
  ];
  for (const field of numFields) {
    const v = data[field];
    if (v !== "" && (isNaN(Number(v)) || Number(v) < 0)) {
      errors[field] = "Valor deve ser um número positivo.";
    }
  }

  return errors;
}

function toPayload(data: FormData): ProdutoCreate {
  const num = (v: string) => (v === "" ? null : Number(v));
  return {
    nome_produto: data.nome_produto.trim(),
    categoria_produto: data.categoria_produto,
    peso_produto_gramas: num(data.peso_produto_gramas),
    comprimento_centimetros: num(data.comprimento_centimetros),
    altura_centimetros: num(data.altura_centimetros),
    largura_centimetros: num(data.largura_centimetros),
  };
}

const inputCls =
  "w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

const inputErrCls =
  "w-full px-3 py-2.5 rounded-lg border border-red-300 bg-red-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition";

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: produto, isLoading: loadingProduto } = useQuery({
    queryKey: ["produto", id],
    queryFn: () => getProduto(id!),
    enabled: isEditing,
  });

  const { data: categorias = [], isLoading: loadingCats } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (produto) {
      setForm({
        nome_produto: produto.nome_produto,
        categoria_produto: produto.categoria_produto,
        peso_produto_gramas: produto.peso_produto_gramas?.toString() ?? "",
        comprimento_centimetros: produto.comprimento_centimetros?.toString() ?? "",
        altura_centimetros: produto.altura_centimetros?.toString() ?? "",
        largura_centimetros: produto.largura_centimetros?.toString() ?? "",
      });
    }
  }, [produto]);

  const mutation = useMutation({
    mutationFn: () =>
      isEditing
        ? atualizarProduto(id!, toPayload(form))
        : criarProduto(toPayload(form)),
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      if (isEditing) queryClient.invalidateQueries({ queryKey: ["produto", id] });
      toast.success(isEditing ? "Produto atualizado com sucesso." : "Produto cadastrado com sucesso.");
      navigate(`/produtos/${saved.id_produto}`);
    },
    onError: () => {
      setSubmitError("Ocorreu um erro ao salvar o produto. Tente novamente.");
      toast.error("Ocorreu um erro ao salvar o produto.");
    },
  });

  function handleChange(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (submitError) setSubmitError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    mutation.mutate();
  }

  if (isEditing && loadingProduto) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-indigo-600 transition-colors">Catálogo</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {isEditing && produto && (
          <>
            <Link
              to={`/produtos/${id}`}
              className="hover:text-indigo-600 transition-colors truncate max-w-[160px]"
            >
              {produto.nome_produto}
            </Link>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
        <span className="text-gray-900 font-medium">
          {isEditing ? "Editar" : "Novo Produto"}
        </span>
      </nav>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          {isEditing ? "Editar Produto" : "Cadastrar Novo Produto"}
        </h1>

        {submitError && (
          <div className="mb-5">
            <ErrorMessage message={submitError} />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* nome */}
          <FormField label="Nome do Produto" required error={errors.nome_produto}>
            <input
              type="text"
              value={form.nome_produto}
              onChange={(e) => handleChange("nome_produto", e.target.value)}
              placeholder="Ex: Tênis Esportivo Azul"
              className={errors.nome_produto ? inputErrCls : inputCls}
            />
          </FormField>

          {/* categoria */}
          <FormField label="Categoria" required error={errors.categoria_produto}>
            <div className="relative">
              <select
                value={form.categoria_produto}
                onChange={(e) => handleChange("categoria_produto", e.target.value)}
                disabled={loadingCats}
                className={`appearance-none pr-8 ${errors.categoria_produto ? inputErrCls : inputCls} ${loadingCats ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
              >
                <option value="">Selecione uma categoria...</option>
                {categorias.map((cat) => (
                  <option key={cat.nome} value={cat.nome}>
                    {formatCategoria(cat.nome)}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </FormField>

          {/* dimensões */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Especificações Físicas
              <span className="text-gray-400 font-normal ml-1">(opcionais)</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Peso (g)" error={errors.peso_produto_gramas}>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={form.peso_produto_gramas}
                  onChange={(e) => handleChange("peso_produto_gramas", e.target.value)}
                  placeholder="Ex: 500"
                  className={errors.peso_produto_gramas ? inputErrCls : inputCls}
                />
              </FormField>

              <FormField label="Comprimento (cm)" error={errors.comprimento_centimetros}>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={form.comprimento_centimetros}
                  onChange={(e) => handleChange("comprimento_centimetros", e.target.value)}
                  placeholder="Ex: 30"
                  className={errors.comprimento_centimetros ? inputErrCls : inputCls}
                />
              </FormField>

              <FormField label="Altura (cm)" error={errors.altura_centimetros}>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={form.altura_centimetros}
                  onChange={(e) => handleChange("altura_centimetros", e.target.value)}
                  placeholder="Ex: 15"
                  className={errors.altura_centimetros ? inputErrCls : inputCls}
                />
              </FormField>

              <FormField label="Largura (cm)" error={errors.largura_centimetros}>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={form.largura_centimetros}
                  onChange={(e) => handleChange("largura_centimetros", e.target.value)}
                  placeholder="Ex: 20"
                  className={errors.largura_centimetros ? inputErrCls : inputCls}
                />
              </FormField>
            </div>
          </div>

          {/* ações */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate(isEditing ? `/produtos/${id}` : "/")}
              disabled={mutation.isPending}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition disabled:opacity-50 disabled:cursor-wait"
            >
              {mutation.isPending && (
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {mutation.isPending
                ? isEditing ? "Salvando..." : "Cadastrando..."
                : isEditing ? "Salvar Alterações" : "Cadastrar Produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
