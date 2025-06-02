
# Sabor & Prosa Manager 🍔🥤

Bem-vindo ao **Sabor & Prosa Manager**, o sistema de gerenciamento para a Lanchonete Sabor & Prosa! Este aplicativo foi desenvolvido para auxiliar no controle de vendas, estoque, produtos e fornecer insights através de relatórios e previsões com Inteligência Artificial.

## ✨ Funcionalidades Principais

*   **Dashboard:** Visão geral com estatísticas chave, vendas recentes e itens com baixo estoque.
*   **Gerenciamento de Produtos:** Adicione, edite e remova produtos do catálogo.
*   **Registro de Vendas:** Registre novas vendas de forma fácil e rápida.
*   **Controle de Estoque:** Monitore e ajuste os níveis de estoque dos produtos.
*   **Relatórios:** Visualize relatórios de vendas e status do estoque.
*   **Previsão com IA:** Utilize Inteligência Artificial para prever vendas futuras com base em dados históricos.
*   **Autenticação:** Sistema de login e cadastro de usuários (simulado).
*   **Tema Claro/Escuro:** Interface adaptável para preferência de tema.

## 🚀 Tecnologias Utilizadas

*   **Frontend:**
    *   [Next.js](https://nextjs.org/) (App Router)
    *   [React](https://react.dev/)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [ShadCN UI](https://ui.shadcn.com/): Componentes de UI
    *   [Lucide React](https://lucide.dev/): Ícones
    *   [Recharts](https://recharts.org/): Gráficos
*   **Backend & IA:**
    *   [Genkit (Firebase AI)](https://firebase.google.com/docs/genkit): Para funcionalidades de Inteligência Artificial (previsão de vendas).
    *   [Google AI (Gemini Models)](https://ai.google.dev/): Modelos de linguagem utilizados pelo Genkit.
*   **Utilitários:**
    *   `zod`: Validação de schemas.
    *   `react-hook-form`: Gerenciamento de formulários.
    *   `date-fns`: Manipulação de datas.

## ⚙️ Configuração e Instalação

Siga os passos abaixo para configurar e rodar o projeto localmente.

### Pré-requisitos

*   [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
*   [npm](https://www.npmjs.com/) (geralmente vem com o Node.js) ou [Yarn](https://yarnpkg.com/)
*   Git (para clonar o repositório)

### Passos

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
    cd SEU_REPOSITORIO
    ```
    *Substitua `SEU_USUARIO/SEU_REPOSITORIO` pelo caminho correto do seu repositório no GitHub.*

2.  **Instale as dependências:**
    ```bash
    npm install
    ```
    ou
    ```bash
    yarn install
    ```

3.  **Configure as Variáveis de Ambiente (se necessário):**
    *   Copie o arquivo `.env.example` (se existir) para `.env` e preencha as variáveis necessárias. Para este projeto, a configuração principal do Genkit/Google AI é feita em `src/ai/genkit.ts`, mas pode ser necessário configurar chaves de API do Google AI em um arquivo `.env` se você for além do emulador ou da configuração padrão.
    *   Exemplo de `.env`:
        ```
        GOOGLE_API_KEY=SUA_CHAVE_DE_API_AQUI
        ```

## ▶️ Rodando a Aplicação

Você precisará de dois terminais abertos para rodar a aplicação completa (frontend e backend de IA).

1.  **Frontend (Next.js):**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:9002`.

2.  **Backend de IA (Genkit):**
    Em um novo terminal:
    ```bash
    npm run genkit:dev
    ```
    Ou, para que reinicie automaticamente ao detectar alterações nos arquivos de IA:
    ```bash
    npm run genkit:watch
    ```
    O servidor Genkit geralmente roda em `http://localhost:4000` (para o painel de inspeção do Genkit) e suas flows ficam disponíveis para a aplicação Next.js.

## 📝 Credenciais de Login (Simuladas)

Para acessar a área logada da aplicação:
*   **Email:** `user@example.com`
*   **Senha:** `password`

## 📂 Estrutura de Pastas (Visão Geral)

```
sabor-prosa-manager/
├── src/
│   ├── ai/                  # Lógica de Inteligência Artificial com Genkit
│   │   ├── flows/           # Fluxos do Genkit
│   │   ├── dev.ts           # Configuração de desenvolvimento do Genkit
│   │   └── genkit.ts        # Configuração principal do Genkit
│   ├── app/                 # Rotas e páginas do Next.js (App Router)
│   │   ├── (app)/           # Rotas autenticadas
│   │   │   ├── dashboard/
│   │   │   ├── forecast/
│   │   │   ├── products/
│   │   │   ├── reports/
│   │   │   ├── sales/
│   │   │   └── stock/
│   │   ├── (auth)/          # Rotas de autenticação
│   │   │   └── login/
│   │   │   └── signup/
│   │   ├── globals.css      # Estilos globais e tema ShadCN
│   │   └── layout.tsx       # Layout principal da aplicação
│   │   └── page.tsx         # Página inicial (redireciona para login)
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── dashboard/
│   │   ├── forecast/
│   │   ├── icons.tsx
│   │   ├── layout/
│   │   ├── products/
│   │   ├── reports/
│   │   ├── sales/
│   │   ├── stock/
│   │   └── ui/              # Componentes ShadCN UI
│   ├── hooks/               # Hooks React customizados
│   ├── lib/                 # Utilitários, constantes, tipos
│   │   ├── constants.ts
│   │   ├── types.ts
│   │   └── utils.ts
├── public/                  # Arquivos estáticos
├── .env                     # Variáveis de ambiente (local)
├── next.config.ts           # Configuração do Next.js
├── package.json             # Dependências e scripts do projeto
├── tailwind.config.ts       # Configuração do Tailwind CSS
└── tsconfig.json            # Configuração do TypeScript
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Se você encontrar um bug ou tiver uma sugestão de melhoria, sinta-se à vontade para abrir uma *Issue* ou um *Pull Request*.

## 📄 Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes (se aplicável).
(Você pode adicionar um arquivo `LICENSE` se desejar, ou remover esta seção se não for relevante).
