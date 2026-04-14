# Sistema de Gerenciamento de E-Commerce

Aplicação fullstack para gerenciamento de produtos, pedidos, consumidores, vendedores e análise de desempenho de vendas.

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Vite + React 19 + TypeScript + Tailwind CSS v4 |
| Backend | FastAPI + SQLAlchemy 2 + Alembic |
| Banco de dados | SQLite |

---

## Pré-requisitos

- **Node.js** 18+ (recomendado 22)
- **Python** 3.11+
- **npm** 9+

---

## Como executar

### 1. Clone o repositório

```bash
git clone https://github.com/Mickael-7/atividade_rocketlab_dev.git
cd atividade_rocketlab_dev
```

### 2. Backend

```bash
cd backend

# Criar o ambiente virtual
python -m venv .venv

# Ativar — Windows
.venv\Scripts\activate

# Ativar — Linux / macOS
source .venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Copiar variáveis de ambiente
cp .env.example .env

# Rodar as migrações (cria o banco de dados)
alembic upgrade head

# Popular o banco com os dados dos CSVs (~440k registros)
python -m app.seed

# Iniciar o servidor (porta 8000)
uvicorn app.main:app --reload --port 8000
```

A documentação interativa da API estará disponível em: http://localhost:8000/docs

### 3. Frontend

Abra um **novo terminal** na raiz do projeto:

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento (porta 5173)
npm run dev
```

Acesse a aplicação em: http://localhost:5173

### 4. Testes automatizados (opcional)

Com o ambiente virtual ativo, a partir da pasta `backend/`:

```bash
pytest
```

---

## Variáveis de ambiente

### Backend (`backend/.env`)

```env
DATABASE_URL=sqlite:///./database.db
ALLOWED_ORIGINS=["http://localhost:5173","http://localhost:5174"]

# Credenciais do administrador (acesso ao painel)
ADMIN_EMAIL=gerente@loja.com
ADMIN_PASSWORD=senha123

# JWT
JWT_SECRET=troque-por-uma-chave-segura-em-producao
JWT_EXPIRE_MINUTES=480
```

### Frontend (`frontend/.env.local`)

Opcional — use apenas se precisar apontar para outra porta do backend:

```env
VITE_API_URL=http://localhost:8000
```

---

## Funcionalidades

### Autenticação (`/login`)
- Login com email e senha (credenciais configuradas no `.env`)
- JWT com expiração configurável
- Rotas protegidas — redireciona para `/login` automaticamente
- Logout pela sidebar

### Catálogo de Produtos (`/`)
- Grid responsivo com imagem representativa da categoria
- Busca por nome com debounce e sincronização com URL
- Filtro por categoria, avaliação mínima e avaliação máxima (estrelas)
- Aviso quando o filtro mínimo > máximo (evita requisição inválida)
- Ordenação por nome, mais vendidos e melhor avaliados
- Média de avaliações exibida em cada card
- Paginação com navegação por ellipsis

### Detalhe do Produto (`/produtos/:id`)
- Especificações: peso, comprimento, altura e largura
- Desempenho de vendas: unidades vendidas, receita total e preço médio
- Avaliações: média geral, distribuição por estrela e lista de comentários
- Resposta da loja por avaliação (criar, editar e remover)
- Ações: editar e excluir (com modal de confirmação)

### Gerenciamento de Produtos
- Cadastrar novo produto (`/produtos/novo`)
- Editar produto existente (`/produtos/:id/editar`)
- Validação de campos e feedback visual de erros

### Pedidos (`/pedidos`)
- Listagem paginada com filtro por status
- Badge colorido por status (entregue, cancelado, em processamento…)
- Página de detalhe com itens do pedido, avaliações e informações do consumidor

### Consumidores (`/consumidores`)
- Listagem paginada com busca por nome
- Página de perfil com histórico de pedidos e estatísticas

### Vendedores (`/vendedores`)
- Listagem paginada ordenada por receita
- Exportação para CSV (todos os registros)

### Dashboard (`/dashboard`)
- KPIs: total de pedidos, receita total, ticket médio e % de entregas no prazo
- Gráfico de linha: pedidos por mês
- Gráfico de pizza: distribuição de status dos pedidos
- Top 5 produtos mais vendidos (com link para detalhe)
- Receita por estado do vendedor (barras proporcionais)
- Indicador de pontualidade de entrega
- Exportação dos top produtos para CSV

### Interface
- Sidebar colapsável com ícones (estado persistido no localStorage)
- Tema claro / escuro com toggle na sidebar (persistido no localStorage)
- Detecção automática de `prefers-color-scheme` no primeiro acesso
- Notificações toast em erros e ações (sonner)
- Interceptor global de erros HTTP com redirecionamento em caso de 401
- Caching de consultas com TanStack Query

---

## Estrutura do projeto

```
atividade_rocketlab_dev/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy ORM
│   │   ├── routers/         # Endpoints FastAPI
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── seed.py          # Script de população do banco
│   │   ├── database.py      # Configuração do SQLAlchemy
│   │   ├── config.py        # Settings via pydantic-settings
│   │   └── main.py          # App FastAPI + CORS
│   ├── tests/               # Testes automatizados (pytest)
│   ├── alembic/             # Migrações do banco
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   │   └── ui/          # Primitivos genéricos (FormField, Modal, Skeleton…)
│   │   ├── pages/           # Páginas (rotas)
│   │   ├── services/        # Cliente Axios + chamadas à API
│   │   ├── hooks/           # Custom hooks (useDebounce, useTheme, useAuth)
│   │   ├── types/           # Interfaces TypeScript
│   │   ├── utils/           # Utilitários (exportação CSV)
│   │   └── main.tsx         # Entry point
│   └── package.json
└── dados/                   # CSVs de origem dos dados
```

---

## Endpoints da API

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/auth/login` | — | Autenticação, retorna JWT |
| `GET` | `/produtos` | — | Lista paginada com busca, filtro e ordenação |
| `GET` | `/produtos/{id}` | — | Detalhe com vendas e avaliações agregadas |
| `POST` | `/produtos` | JWT | Criar produto |
| `PUT` | `/produtos/{id}` | JWT | Atualizar produto |
| `DELETE` | `/produtos/{id}` | JWT | Remover produto |
| `GET` | `/categorias` | — | Lista de categorias |
| `PATCH` | `/avaliacoes/{id}/resposta` | JWT | Adicionar/editar resposta da loja |
| `DELETE` | `/avaliacoes/{id}/resposta` | JWT | Remover resposta da loja |
| `GET` | `/pedidos` | — | Lista paginada com filtro por status |
| `GET` | `/pedidos/{id}` | — | Detalhe do pedido com itens e avaliações |
| `GET` | `/consumidores` | — | Lista paginada com busca por nome |
| `GET` | `/consumidores/{id}` | — | Perfil com histórico de pedidos |
| `GET` | `/vendedores` | — | Lista paginada ordenada por receita |
| `GET` | `/dashboard` | — | Agregações para o painel gerencial |
