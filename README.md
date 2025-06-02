# 🎯 ANA Gaming - Plataforma de Apostas Esportivas

Esta é uma plataforma de visualização de apostas esportivas 

A aplicação permite que usuários visualizem jogos ao vivo, futuros e passados com as melhores odds disponíveis, utilizando autenticação e diversas tecnologias modernas.

---

## 🚀 Deploy

🔗 Acesse a aplicação em produção:

**[https://anagaming-techtest.vercel.app/](https://anagaming-techtest.vercel.app/)**

---

## 🧭 Onboarding: Como Usar a Plataforma ANA Gaming

Bem-vindo à plataforma de visualização de apostas esportivas da **ANA Gaming**! Abaixo está um guia completo para te ajudar a começar do zero e entender todas as funcionalidades disponíveis.

### ✅ 1. Acessando a Plataforma

Você pode acessar a aplicação hospedada na Vercel pelo seguinte link:


---

### 🧑‍💻 2. Autenticação

Ao acessar a plataforma, você será direcionado para a **página de login**. A autenticação é feita via:

- Google
- GitHub (ou outro provedor configurado)
  
🔒 **Importante:** Algumas funcionalidades são **restritas a usuários autenticados**. Certifique-se de estar logado para ter acesso completo.

---

### 🏠 3. Página Inicial

Após o login, você será redirecionado à **home**, que exibe:

- Uma lista de **eventos esportivos** recuperados da [The Odds API](https://the-odds-api.com/)
- Separação clara entre:
  - **Jogos ao vivo**
  - **Jogos futuros**
  - **Jogos passados** (em cinza)

---

### 🧩 4. Funcionalidades da Plataforma

#### 📈 Visualização de Odds
- Cada evento exibe as **melhores odds para os times em disputa**.
- As **odds mais altas** são destacadas em **verde**, para facilitar a comparação.
- As casas são indicadas abaixo das odds para melhor visualização

#### 🔍 Filtros Personalizados
- Utilize os **filtros na parte superior da página** para personalizar sua experiência:
  - Filtrar por esporte (ex: futebol, basquete, etc.)
- Os filtros são gerenciados com `Context API`, garantindo fluidez na interação.

#### ⭐ Categorias Favoritas (Em desenvolvimento)
- Possibilidade de selecionar e salvar suas **categorias favoritas** para uma navegação mais rápida e personalizada.
- As preferências serão persistidas via API própria da plataforma.

---

## 🧪 Tecnologias Utilizadas

| Camada         | Tecnologia                      |
|----------------|----------------------------------|
| Frontend       | Next.js 15 (App Router)          |
| Estilo         | TailwindCSS                     |
| Animações      | Framer Motion                   |
| Autenticação   | NextAuth                        |
| SSR e SSG      | Sim (Web Fetch API + RSC)       |
| Gerenciamento  | Context API                     |
| Persistência   | API backend própria              |
| Deploy         | Vercel                          |

---

Ao iniciar o projeto localmente, siga este passo a passo:

1. **Acesse a aplicação** (em `http://localhost:3000`).
2. **Faça login com GitHub**.
3. **Visualize os jogos na Home**, separados em "Ao Vivo", "Futuros" e "Encerrados".
4. **Os melhores valores de odds** estarão destacados em **verde**, enquanto os piores em **azul**.
5. **Clique no botão de filtro no topo da lista** para escolher os esportes de seu interesse.
6. **Esses filtros são salvos** como favoritos e carregados automaticamente em acessos futuros.

A plataforma é intuitiva e reativa, feita para facilitar a análise rápida de apostas.

---

### 🔎 Como obter essas variáveis

#### 🔗 `GITHUB_ID` e `GITHUB_SECRET`

1. Vá para [GitHub Developer Settings](https://github.com/settings/developers).
2. Clique em **"OAuth Apps"** > **"New OAuth App"**.
3. Preencha:
   - **Application Name**: `ANA Gaming App`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copie o **Client ID** e **Client Secret** gerados.

#### 🔑 `NEXTAUTH_SECRET`

Você pode gerar uma chave segura com o seguinte comando:

```bash
openssl rand -base64 32
```

#### 🔐 `ODDS_API_KEY` e `NEXT_PUBLIC_ODDS_API_KEY`

1. Acesse [The Odds API](https://the-odds-api.com/).
2. Crie uma conta gratuita.
3. Copie sua chave da API.
4. Use a mesma chave nos campos `ODDS_API_KEY` e `NEXT_PUBLIC_ODDS_API_KEY`.

> ⚠️ **Importante:** `NEXT_PUBLIC_ODDS_API_KEY` deve obrigatoriamente começar com `NEXT_PUBLIC_` para que esteja disponível no frontend com Next.js.

---

### ▶️ Como rodar o projeto localmente

#### 1. Clone o repositório:

```bash
git clone https://github.com/YagoMilitao/anagaming-techtest.git
```

#### 2. Instale as dependências:

```bash
npm install
```

#### 3. Configure o `.env.local`

Crie um arquivo `.env.local` na raiz do projeto e preencha com as variáveis que você obteve anteriormente:

```env
GITHUB_ID=xxx
GITHUB_SECRET=xxx
NEXTAUTH_SECRET=xxx
NEXTAUTH_URL=http://localhost:3000
ODDS_API_KEY=xxx
NEXT_PUBLIC_ODDS_API_KEY=xxx
```

#### 4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

---

💡 Projeto desenvolvido por [Yago Militão](https://github.com/YagoMilitao)
