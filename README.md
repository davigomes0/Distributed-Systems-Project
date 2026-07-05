# Sistema de Monitoramento em Tempo Real de Usuários Online

Aplicação web que exibe em tempo real a quantidade de usuários conectados simultaneamente, utilizando WebSocket para comunicação bidirecional entre cliente e servidor.

🔗 **[Acessar aplicação ao vivo](https://distributed-systems-project-j6vf.vercel.app/)**

---

## Conceitos de Sistemas Distribuídos Aplicados

**Comunicação assíncrona via WebSocket**
O servidor não espera requisições do cliente para enviar dados. Sempre que o estado muda, ele empurra a atualização para todos os conectados.

**Estado distribuído**
O estado — a contagem de usuários online — é mantido no servidor (`Set onlineUsers`) e compartilhado continuamente com todos os clientes. Todos veem a mesma informação ao mesmo tempo.

**Broadcast**
O servidor usa `io.emit()` para enviar eventos simultaneamente a todos os clientes conectados, garantindo consistência na visualização.

**Concorrência**
Node.js processa múltiplas conexões simultâneas via event loop, sem bloquear a execução. O Socket.IO gerencia cada socket individualmente.

**Tolerância a falhas**
Quando um cliente desconecta (fecha a aba, perde internet), o Socket.IO detecta automaticamente o evento `disconnect`, remove o usuário do `Set` e atualiza a contagem para todos os demais.

**Limitação de escala**
O estado fica em memória em uma única instância do servidor. Em um ambiente com múltiplas instâncias, cada servidor teria seu próprio `Set` e as contagens ficariam inconsistentes. A solução seria usar Redis Pub/Sub como estado compartilhado.

---

## Arquitetura

```
Browser (React)  ←── WebSocket ──→  Socket.IO  ←──→  Express / Node.js
                                                           ↓
                                                   onlineUsers (Set)
```

Frontend hospedado no **Vercel**. Backend hospedado no **Render**.

### Fluxo de Eventos

```
Cliente conecta
  → servidor adiciona ao Set
  → io.emit('user_connected')
  → io.emit('online_count_update')

Cliente desconecta
  → servidor remove do Set
  → io.emit('user_disconnected')
  → io.emit('online_count_update')
```

---

## Stack

**Backend**
- Node.js + Express — servidor HTTP
- Socket.IO 4.7 — WebSocket com fallback para long-polling
- dotenv — variáveis de ambiente

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Socket.IO Client
- Recharts — gráfico em tempo real
- Lucide React — ícones

---

## Estrutura do Projeto

```
Distributed-Systems-Project/
├── backend/
│   ├── server.js          # Servidor, eventos Socket.IO e rota /status
│   ├── package.json
│   ├── .env               # Variáveis locais (não vai pro git)
│   └── .env.example       # Template de configuração
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Lógica principal e gerenciamento de estado
│   │   ├── main.jsx       # Entry point
│   │   ├── index.css      # Tailwind directives
│   │   └── components/
│   │       ├── Header.jsx
│   │       ├── StatCard.jsx
│   │       ├── Chart.jsx
│   │       ├── EventLog.jsx
│   │       └── Footer.jsx
│   ├── .env               # Variáveis locais (não vai pro git)
│   ├── .env.example       # Template de configuração
│   └── package.json
│
└── README.md
```

---

## Como Rodar Localmente

**Pré-requisitos:** Node.js e npm instalados.

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm start
# Servidor em http://localhost:3000
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
# Edite .env: VITE_BACKEND_URL=http://localhost:3000
npm run dev
# Interface em http://localhost:5173
```

Abra múltiplas abas em `http://localhost:5173` e observe o contador sincronizar em tempo real.

---

## Deploy

| Serviço | URL |
|---------|-----|
| Frontend (Vercel) | https://distributed-systems-project-j6vf.vercel.app/ |
| Backend (Render) | — |

- **Frontend:** deploy automático via Vercel a cada push na branch principal.
- **Backend:** hospedado no Render com suporte nativo a WebSocket.

Consulte `backend/README.md` e `frontend/README.md` para instruções detalhadas de deploy.
