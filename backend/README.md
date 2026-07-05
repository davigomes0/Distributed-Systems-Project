# Backend - Monitor de Sistemas Distribuídos

Servidor Node.js com WebSocket para monitoramento de usuários online em tempo real.

## Stack

- Node.js + Express
- Socket.IO 4.7
- dotenv

## Como Rodar

```bash
npm install
cp .env.example .env
# Edite .env com a URL do frontend
npm start
# Servidor em http://localhost:3000
```

## Estrutura

```
backend/
├── server.js       # Servidor HTTP, configuração Socket.IO e eventos
├── package.json
├── .env            # Variáveis locais (não vai pro git)
└── .env.example    # Template
```

## Como Funciona

### Inicialização

```js
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',')
  : ['http://localhost:3000'];

const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ['GET', 'POST'], credentials: true }
});
```

`FRONTEND_URL` aceita múltiplas origens separadas por vírgula. Em produção, deve receber a URL do Vercel.

### Estado

```js
let onlineUsers = new Set();
```

Um `Set` garante que cada `socket.id` apareça uma única vez. O tamanho (`onlineUsers.size`) é a fonte da verdade da contagem.

### Eventos Socket.IO

**Conexão:**
```js
io.on('connection', (socket) => {
  onlineUsers.add(socket.id);
  io.emit('user_connected', { id, count, timestamp });
  io.emit('online_count_update', { count, timestamp });
});
```

**Desconexão:**
```js
socket.on('disconnect', () => {
  onlineUsers.delete(socket.id);
  io.emit('user_disconnected', { id, count, timestamp });
  io.emit('online_count_update', { count, timestamp });
});
```

`io.emit()` faz broadcast para todos os clientes conectados. `socket.emit()` enviaria apenas para aquele cliente.

### Rota HTTP

```
GET /status
```

Retorna:
```json
{
  "status": "online",
  "online_count": 3,
  "uptime": 42.5
}
```

Útil para verificar se o servidor está de pé antes de abrir o frontend.

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor (Render define automaticamente) | `3000` |
| `FRONTEND_URL` | URL do frontend, separe múltiplas com vírgula | `http://localhost:3000` |

## Deploy no Render

1. Crie um **Web Service** apontando para este repositório
2. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
3. Adicione a variável de ambiente `FRONTEND_URL` com a URL do Vercel
4. Após deploy, teste em: `https://sua-url.onrender.com/status`

**Atenção:** No plano gratuito o servidor dorme após 15 minutos sem requisições. A primeira conexão pode demorar ~30 segundos para acordar.
