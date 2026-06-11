# Sistema de Download Multi-Produtos SINGULAR.i

## Visão Geral

Sistema profissional de download de aplicativos com suporte a múltiplos produtos, contadores individuais por produto, captura de leads, envio de emails e painel administrativo.

## Funcionalidades

- ✅ Modal de download com formulário obrigatório
- ✅ Suporte a múltiplos produtos com contadores individuais
- ✅ Contador global de downloads (soma de todos os produtos)
- ✅ Captura de dados (Nome, Email, Telefone, Empresa)
- ✅ Validação de formulário em tempo real
- ✅ Armazenamento em arquivo JSON (sem banco de dados)
- ✅ Envio de emails (empresa e usuário) com informações do produto
- ✅ Painel administrativo com ranking de produtos
- ✅ Download automático do APK específico do produto após preenchimento

## Estrutura de Arquivos

```
src/
├── app/
│   ├── api/
│   │   ├── download/
│   │   │   └── route.ts          # API para processar downloads (suporta productId)
│   │   └── admin/
│   │       └── downloads/
│   │           └── route.ts      # API para painel administrativo
│   ├── admin/
│   │   └── downloads/
│   │       └── page.tsx          # Painel administrativo com ranking
│   ├── admin-secret-downloads/
│   │   └── page.tsx             # Painel administrativo oculto
│   ├── page.tsx                  # Homepage com contador global
│   └── projects/
│       └── [slug]/
│           └── page.tsx          # Páginas de produtos com download específico
├── components/
│   └── download/
│       ├── DownloadModal.tsx     # Modal de download (aceita productId)
│       ├── DownloadCounter.tsx   # Contador global de downloads
│       └── ProductDownloadCounter.tsx # Contador específico por produto
├── lib/
│   └── downloads/
│       ├── storage.ts           # Utilitários de armazenamento JSON (multi-produtos)
│       └── emailService.ts      # Serviço de envio de emails (com info do produto)
data/
└── downloads.json               # Arquivo de armazenamento de downloads (estrutura multi-produtos)
public/
├── app-release.apk              # APK genérico (opcional)
├── medscan.apk                  # APK do produto MedScan
└── jafadh.apk                   # APK do produto JAFADH
```

## Configuração de Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env.local`:

```env
# Configuração SMTP para envio de emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
SMTP_FROM=noreply@singula.i

# Email da empresa para receber notificações
COMPANY_EMAIL=info@singula.i

# Chave de API para proteção do painel administrativo (opcional)
ADMIN_API_KEY=sua-chave-secreta-aqui
```

### Configuração SMTP

Para Gmail:
1. Ative a autenticação de 2 fatores
2. Gere uma senha de app em: https://myaccount.google.com/apppasswords
3. Use a senha de app como `SMTP_PASS`

Para outros provedores (Outlook, SendGrid, etc.), ajuste as configurações conforme necessário.

## Instalação de Dependências

As seguintes dependências foram adicionadas ao `package.json`:

```json
{
  "nodemailer": "^6.9.16",
  "@types/nodemailer": "^6.4.17"
}
```

Execute `npm install` para instalar as dependências.

## Uso

### 1. Adicionar Arquivos APK

Coloque os arquivos APK de cada produto na pasta `public/`:

```
public/
├── medscan.apk      # APK do produto MedScan
└── jafadh.apk       # APK do produto JAFADH
```

### 2. Configurar Produtos

Edite o arquivo `data/downloads.json` para adicionar novos produtos:

```json
{
  "globalDownloads": 0,
  "products": [
    {
      "id": "medscan",
      "name": "MedScan",
      "slug": "medscan",
      "fileName": "medscan.apk",
      "downloads": 0
    },
    {
      "id": "jafadh",
      "name": "JAFADH",
      "slug": "jafadh",
      "fileName": "jafadh.apk",
      "downloads": 0
    }
  ],
  "downloads": []
}
```

### 3. Acessar Painel Administrativo

Navegue para: `http://localhost:3000/admin/downloads`

O painel mostra:
- Total global de downloads
- Ranking de produtos por número de downloads
- Lista de usuários que baixaram (filtrável por produto)
- Detalhes de cada download (produto, nome, email, telefone, empresa, data)

### 4. Testar Download

1. Acesse a página de um produto específico (ex: `/projects/medscan`)
2. Clique no botão "Baixar MedScan"
3. Preencha o formulário
4. O download do arquivo específico iniciará automaticamente após o envio

## Fluxo do Sistema

```
Usuário visita página de um produto específico
    ↓
Clica em "Baixar [Nome do Produto]"
    ↓
Modal de formulário abre com nome do produto
    ↓
Usuário preenche dados
    ↓
Validação do formulário
    ↓
Dados enviados para API com productId
    ↓
API valida e salva no JSON associado ao produto
    ↓
Incrementa contador do produto específico
    ↓
Incrementa contador global
    ↓
Envia email para empresa com informações do produto
    ↓
Envia email de boas-vindas ao usuário
    ↓
Download automático do APK específico do produto
    ↓
Modal mostra sucesso
```

## Estrutura do Arquivo JSON

```json
{
  "globalDownloads": 548,
  "products": [
    {
      "id": "medscan",
      "name": "MedScan",
      "slug": "medscan",
      "fileName": "medscan.apk",
      "downloads": 150
    },
    {
      "id": "jafadh",
      "name": "JAFADH",
      "slug": "jafadh",
      "fileName": "jafadh.apk",
      "downloads": 78
    }
  ],
  "downloads": [
    {
      "productId": "medscan",
      "productName": "MedScan",
      "nome": "João Silva",
      "email": "joao@email.com",
      "telefone": "+244 923 123 456",
      "empresa": "Empresa XYZ",
      "data": "2026-06-05T12:00:00.000Z"
    }
  ]
}
```

## API Endpoints

### POST /api/download
Processa solicitação de download para um produto específico.

**Request Body:**
```json
{
  "productId": "medscan",
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "+244 923 123 456",
  "empresa": "Empresa XYZ"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Download registrado com sucesso",
  "globalDownloads": 548,
  "productDownloads": 150,
  "fileName": "medscan.apk"
}
```

### GET /api/download
Retorna contador global de downloads.

**Response:**
```json
{
  "globalDownloads": 548,
  "message": "548+ downloads realizados em todos os produtos da Singular.i"
}
```

### GET /api/download?productId=medscan
Retorna contador de downloads de um produto específico.

**Response:**
```json
{
  "productId": "medscan",
  "productName": "MedScan",
  "productDownloads": 150,
  "message": "150+ utilizadores já baixaram MedScan"
}
```

### GET /api/admin/downloads
Retorna dados completos para o painel administrativo.

**Response:**
```json
{
  "globalDownloads": 548,
  "products": [...],
  "rankedProducts": [...],
  "downloads": [...]
}
```

## Personalização

### Adicionar Novo Produto

1. Adicione o produto ao `data/downloads.json`
2. Coloque o arquivo APK correspondente em `public/`
3. Adicione o produto ao objeto `products` em `src/app/projects/[slug]/page.tsx`
4. Mapeie o slug para o nome do arquivo em `productFileNames`

### Cores e Design

O sistema segue a identidade visual da SINGULAR.i:
- Primary: `#1E40AF` (azul profundo)
- Background: `#F9FAFB` (cinza claro)
- Text: `#1F2937` (cinza escuro)

Edite os componentes em `src/components/download/` para ajustar o design.

### Emails

Personalize os templates de email em `src/lib/downloads/emailService.ts`:
- `sendCompanyEmail`: Email enviado para a empresa (inclui informações do produto)
- `sendUserEmail`: Email de boas-vindas para o usuário (inclui nome do produto)

## Segurança

### Proteção do Painel Administrativo

Em produção, implemente autenticação adequada:

1. Adicione autenticação JWT ou session-based
2. Use middleware para proteger rotas de admin
3. Implemente rate limiting para prevenir abuso

### Validação de Dados

O sistema já inclui:
- Validação de email (regex)
- Validação de telefone (formato internacional)
- Validação de productId (produto deve existir)
- Campos obrigatórios
- Sanitização de inputs

## Troubleshooting

### Emails não são enviados

1. Verifique as variáveis de ambiente SMTP
2. Confirme que o provedor de email permite envio via SMTP
3. Verifique os logs do servidor para erros

### Download não inicia

1. Confirme que o arquivo APK específico existe em `public/`
2. Verifique o mapeamento de `productFileNames` na página do produto
3. Teste acessando diretamente: `http://localhost:3000/medscan.apk`

### Erro ao salvar dados

1. Verifique permissões de escrita na pasta `data/`
2. Confirme que o arquivo `downloads.json` existe
3. Verifique logs do servidor

### Produto não encontrado

1. Verifique se o productId está correto no `data/downloads.json`
2. Confirme que o produto existe na lista de produtos
3. Verifique se o slug corresponde ao ID do produto

## Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento da SINGULAR.i.
