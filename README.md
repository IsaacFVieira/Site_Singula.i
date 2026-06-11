# SINGULAR.i Website

Website institucional moderno da SINGULAR.i, empresa de desenvolvimento de software sediada no Huambo, Angola.

## 🚀 Tecnologias

- **Next.js 16** - Framework React para produção
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS utilitário
- **Framer Motion** - Animações
- **Lucide React** - Ícones
- **Google Generative AI** - Chatbot com IA
- **Resend** - Serviço de email

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de exemplo de variáveis de ambiente
cp .env.example .env.local
```

## 🔐 Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `.env.local`:

```env
GEMINI_API_KEY=sua_chave_gemini_aqui
RESEND_API_KEY=sua_chave_resend_aqui
EMAIL_FROM=seu_email@dominio.com
```

### Onde obter as chaves:

- **GEMINI_API_KEY**: [Google AI Studio](https://aistudio.google.com/app/apikey)
- **RESEND_API_KEY**: [Resend Dashboard](https://resend.com/api-keys)

## 🏃 Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Executar em http://localhost:3000
```

## 📦 Build para Produção

```bash
# Criar build de produção
npm run build

# Iniciar servidor de produção
npm start
```

## 🌐 Deploy no Vercel

### Pré-requisitos

1. **Conta no Vercel**: [vercel.com](https://vercel.com)
2. **Repositório Git**: GitHub, GitLab ou Bitbucket
3. **Variáveis de ambiente** configuradas

### Passos para Deploy

1. **Conectar repositório**
   - Faça login no Vercel
   - Clique em "Add New Project"
   - Importe seu repositório Git

2. **Configurar variáveis de ambiente**
   - Nas configurações do projeto, vá em "Settings" > "Environment Variables"
   - Adicione as seguintes variáveis:
     - `GEMINI_API_KEY`: Sua chave do Google AI
     - `RESEND_API_KEY`: Sua chave do Resend
     - `EMAIL_FROM`: Email de origem para envio (ex: singular.i.ao@gmail.com)

3. **Deploy**
   - O Vercel fará deploy automático ao detectar mudanças
   - O primeiro build pode levar alguns minutos

4. **Domínio personalizado (opcional)**
   - Nas configurações do projeto, vá em "Domains"
   - Adicione seu domínio personalizado
   - Configure os DNS conforme instruções do Vercel

### Configuração Automática

O arquivo `vercel.json` já está configurado com:
- Comandos de build e instalação
- Regiões de deploy (iad1)
- Variáveis de ambiente necessárias

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Páginas Next.js (App Router)
│   ├── products/           # Página de produtos
│   ├── produtos/           # Página de produtos (PT)
│   ├── servicos/          # Página de serviços
│   ├── sobre/             # Página sobre
│   ├── contacto/          # Página de contato
│   └── api/               # Rotas da API
│       ├── chat/         # Chatbot AI
│       └── admin/        # Rotas admin
├── components/            # Componentes React
│   ├── layout/           # Layout (Navbar, Footer, etc.)
│   ├── ui/               # Componentes UI reutilizáveis
│   ├── ai/               # Componentes de IA
│   └── animations/       # Componentes de animação
├── lib/                   # Bibliotecas utilitárias
│   ├── translations.ts   # Traduções (PT/EN)
│   ├── ai/               # Funções de IA
│   └── downloads/        # Sistema de downloads
└── contexts/             # React Contexts
    └── LanguageContext   # Contexto de internacionalização
```

## 🌍 Internacionalização

O site suporta dois idiomas:
- **Português (PT)** - Idioma padrão
- **Inglês (EN)** - Alternar via botão no header

As traduções estão em `src/lib/translations.ts`.

## 🤖 Chatbot AI

O chatbot usa Google Generative AI (Gemini) para responder perguntas sobre a SINGULAR.i. O conhecimento base é configurado em `src/lib/ai/knowledgeBase.ts`.

## 📧 Sistema de Email

O sistema de email usa Resend para envio de emails de download e notificações. Configure a API key do Resend nas variáveis de ambiente.

## 🎨 Personalização

- **Cores**: Modifique as variáveis CSS em `src/app/globals.css`
- **Logo**: Substitua `public/images/logo_aceite.svg`
- **Imagens**: Adicione imagens em `public/images/`

## 📝 Licença

ISC

## 👥 Contato

- Email: info@singula.i
- Localização: Huambo, Angola
