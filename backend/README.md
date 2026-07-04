# Backend - Sistema de Monitoramento em Tempo Real

Backend Node.js com WebSocket para monitoramento de usuários online em tempo real.

## Tecnologias

- Node.js + Express
- Socket.IO (WebSocket)
- dotenv (variáveis de ambiente)

## Configuração Local

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Edite o arquivo `.env` e configure a URL do frontend:
```env
FRONTEND_URL=http://localhost:3000
```

4. Inicie o servidor:
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`.

## Deploy no Render

### Passo 1: Criar conta no Render
- Acesse [render.com](https://render.com)
- Faça login com GitHub

### Passo 2: Criar Web Service
1. Clique em **New +** → **Web Service**
2. Conecte seu repositório do GitHub
3. Configure:
   - **Name:** `distributed-systems-backend` (ou qualquer nome)
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free`

### Passo 3: Configurar Variáveis de Ambiente
No painel do Render, vá em **Environment** e adicione:

```
FRONTEND_URL=https://seu-frontend.vercel.app
```

**Importante:** Depois que fizer o deploy do frontend no Vercel, volte aqui e atualize essa variável com a URL real.

### Passo 4: Deploy
- Clique em **Create Web Service**
- Aguarde o build completar (3-5 minutos)
- Copie a URL gerada (ex: `https://seu-app.onrender.com`)

### Passo 5: Testar
Acesse `https://seu-app.onrender.com/status` para verificar se está funcionando:

```json
{
  "status": "online",
  "online_count": 0,
  "uptime": 42.5
}
```

## Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `PORT` | Porta do servidor (Render define automaticamente) | `3000` |
| `FRONTEND_URL` | URL do frontend (aceita múltiplas separadas por vírgula) | `https://app.vercel.app` |

## Endpoints

- `GET /status` - Status do servidor e contagem de usuários
- WebSocket em `/` - Conexão em tempo real

## Eventos WebSocket

### Enviados pelo servidor:
- `user_connected` - Novo usuário conectou
- `user_disconnected` - Usuário desconectou
- `online_count_update` - Atualização da contagem

## Troubleshooting

### CORS Error
Se receber erro de CORS, verifique se a `FRONTEND_URL` está configurada corretamente no Render.

### WebSocket não conecta
- Verifique se o Render está rodando (plan free dorme após 15 min de inatividade)
- Confirme que está usando `https://` na URL de produção

### Servidor reinicia sozinho
No plano gratuito do Render, o servidor dorme após 15 minutos sem requisições. A primeira requisição pode demorar ~30 segundos para "acordar".
