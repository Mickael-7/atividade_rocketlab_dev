# Sistema de Gerenciamento de E-Commerce

Aplicação fullstack para gerenciamento de produtos de e-commerce, com catálogo, detalhes de vendas, avaliações e CRUD completo.

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

# Criar e ativar o ambiente virtual
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux / macOS
source .venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Rodar as migrações (cria o banco de dados)
alembic upgrade head

# Popular o banco com os dados dos CSVs (~440k registros)
python -m app.seed

# Iniciar o servidor (porta 8000)
uvicorn app.main:app --reload --port 8000
```

> A documentação interativa da API estará disponível em: http://localhost:8000/docs

### 3. Frontend

Abra um **novo terminal** na raiz do projeto:

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento (porta 5173)
npm run dev
```

> Acesse a aplicação em: http://localhost:5173

---

## Variáveis de ambiente

### Backend (`backend/.env`)

Opcional — o padrão já funciona sem configuração:

```env
DATABASE_URL=sqlite:///./database.db
```

### Frontend (`frontend/.env.local`)

Opcional — use apenas se precisar apontar para outra porta do backend:

```env
VITE_API_URL=http://localhost:8000
```

---

## Funcionalidades

### Catálogo de Produtos (`/`)
- Grid responsivo com imagem representativa da categoria
- Busca por nome com debounce (sem recarregar a página)
- Filtro por categoria
- Paginação com navegação por ellipsis
- Média de avaliações exibida em cada card

### Detalhe do Produto (`/produtos/:id`)
- Especificações: peso, comprimento, altura e largura
- Desempenho de vendas: unidades vendidas, receita total e preço médio
- Avaliações: média geral, distribuição por estrela e lista de comentários
- Ações: editar e excluir (com modal de confirmação)

### Gerenciamento de Produtos
- Cadastrar novo produto (`/produtos/novo`)
- Editar produto existente (`/produtos/:id/editar`)
- Validação de campos no frontend
- Feedback visual de carregamento e erros inline

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
│   ├── alembic/             # Migrações do banco
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/           # Páginas (rotas)
│   │   ├── services/        # Cliente Axios + chamadas à API
│   │   ├── hooks/           # Custom hooks (useDebounce)
│   │   ├── types/           # Interfaces TypeScript
│   │   └── main.tsx         # Entry point
│   └── package.json
└── dados/                   # CSVs de origem dos dados
```

---

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/produtos` | Lista paginada com busca e filtro por categoria |
| `GET` | `/produtos/{id}` | Detalhe com vendas e avaliações agregadas |
| `POST` | `/produtos` | Criar produto |
| `PUT` | `/produtos/{id}` | Atualizar produto (partial update) |
| `DELETE` | `/produtos/{id}` | Remover produto |
| `GET` | `/categorias` | Lista de categorias com imagem |
