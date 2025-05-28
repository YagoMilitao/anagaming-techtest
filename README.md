# 🎯 ANA Gaming - Plataforma de Apostas Esportivas

Esta é uma plataforma de visualização de apostas esportivas desenvolvida como parte de um desafio técnico para vaga de Desenvolvedor Front-End Pleno na **ANA Gaming**.

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

## 🛠️ Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/YagoMilitao/anagaming-techtest.git

# Acesse a pasta
cd anagaming-techtest

# Instale as dependências
npm install

# Configure variáveis de ambiente (veja .env.example)

# Rode o projeto em modo desenvolvimento
npm run dev
