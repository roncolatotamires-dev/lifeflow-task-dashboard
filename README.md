# 🌟 LifeFlow - Personal Task & Life OS Dashboard

![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.21-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**LifeFlow** é um sistema completo de gestão de vida pessoal e tarefas diárias (*Personal Task OS*), desenvolvido com arquitetura **Full-stack (React + Express + SQLite)**. 

Desenvolvido para oferecer clareza mental, organização por categorias/etiquetas e uma visão geral em tempo real através de um **Painel de Controle (Dashboard)** moderno e interativo.

---

## ✨ Recursos Principais

### 📊 1. Painel de Controle (Dashboard) de Alto Impacto
- **Métricas em Tempo Real (KPIs)**: Total de Tarefas, Concluídas Hoje, Vencem Hoje e Alerta de Atrasadas.
- **Gráfico de Ritmo de Conclusão**: Curva visual dos últimos 7 dias (*Recharts AreaChart*).
- **Divisão por Categoria**: Gráfico estilo Donut mostrando a alocação de tempo por área da vida.
- **Foco Imediato**: Lista das principais prioridades e tarefas urgentes para agir imediatamente.
- **Saudação Dinâmica & Indicadores de Progresso**.

### 📝 2. Gerenciador de Tarefas Flexível
- **Visão em Lista e Visão Quadro (Kanban)**: Alterne com 1 clique entre lista detalhada e colunas *A Fazer*, *Em Andamento* e *Concluídas*.
- **Níveis de Prioridade**: 🚨 Urgente, ⚠️ Alta, 🔹 Média e ▫️ Baixa.
- **Datas Limite (Prazos)**: Cálculo automático de tarefas vencidas, a vencer hoje ou futuras.
- **Checklist Interno (Subtarefas)**: Adicione subitens dentro de cada tarefa com barra de progresso.
- **Efeito Comemorativo (Confetis)** ao marcar tarefas como concluídas.

### 🏷️ 3. Categorização & Etiquetas (Tags)
- **Categorias Pré-configuradas e Personalizadas**: Criar categorias com cores e ícones customizados (*Trabalho, Estudo, Casa, Compras, Saúde & Lazer*).
- **Sistema de Tags**: Atribuição de múltiplas etiquetas (`#importante`, `#reuniao`, `#projeto`, etc.) com cores personalizadas.
- **Busca e Filtros Múltiplos**: Filtragem por texto, prioridade, status, tag e categoria.

### 🌓 4. Interface & Acessibilidade
- **Dark Mode & Light Mode**: Alternância de temas com persistência e variáveis CSS responsivas.
- **Design System Premium**: Tipografia refinada (*Plus Jakarta Sans*), cards com efeito glassmorphism e sombras suaves.

---

## 🗄️ Modelo de Dados (SQLite)

O sistema utiliza um banco de dados relacional leve e ultrarrápido em SQLite (`better-sqlite3`):

```sql
users (id, name, email, password_hash, created_at)
categories (id, user_id, name, color, icon, created_at)
tags (id, user_id, name, color, created_at)
tasks (id, user_id, category_id, title, description, priority, status, due_date, completed_at, created_at)
task_tags (task_id, tag_id)
subtasks (id, task_id, title, completed, created_at)
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js (v18+) e npm instalado.

### 1. Clonar o Repositório
```bash
git clone https://github.com/SEU_USUARIO/lifeflow-task-dashboard.git
cd lifeflow-task-dashboard
```

### 2. Iniciar o Backend (Servidor Express + SQLite)
```bash
cd server
npm install
npm start
```
> O servidor iniciará em `http://localhost:5000` e criará o banco `data/database.sqlite` automaticamente.

### 3. Iniciar o Frontend (React + Vite)
Em outro terminal:
```bash
cd client
npm install
npm run dev
```
> A aplicação abrirá em `http://localhost:5173`.
> *(Você pode utilizar a opção **⚡ Entrar com conta de teste** para acessar a aplicação imediatamente).*

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React, Vite, Lucide Icons, Recharts, Date-fns, Canvas-Confetti, CSS3 Custom Properties.
- **Backend**: Node.js, Express, Better-SQLite3, JWT (JsonWebToken), Bcryptjs, CORS, Dotenv.
- **Banco de Dados**: SQLite.

---

## 📝 Licença

Este projeto é um software livre sob a licença [MIT](LICENSE).
