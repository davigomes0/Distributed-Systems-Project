# Frontend - Monitor de Sistemas Distribuídos

Interface React para visualização em tempo real de usuários conectados via WebSocket.

## Stack

- React 18 + Vite
- Tailwind CSS 3
- Socket.IO Client 4.7
- Recharts
- Lucide React

## Como Rodar

```bash
npm install
cp .env.example .env
# Edite .env: VITE_BACKEND_URL=http://localhost:3000
npm run dev
# Interface em http://localhost:5173
```

## Estrutura

```
src/
├── App.jsx                 # Estado, Socket.IO e composição da página
├── main.jsx                # Entry point
├── index.css               # Tailwind directives + estilos globais
└── components/
    ├── Header.jsx          # Título e subtítulo
    ├── StatCard.jsx        # Card reutilizável (recebe props de cor, ícone, texto)
    ├── Chart.jsx           # Gráfico de linha Recharts
    ├── EventLog.jsx        # Lista de eventos com scroll
    └── Footer.jsx          # Rodapé
```

## Como Funciona

### Conexão WebSocket (`App.jsx`)

```js
const newSocket = io(BACKEND_URL, {
  transports: ['websocket', 'polling']
});
```

Conecta ao backend assim que o componente monta (`useEffect` com array vazio). Fecha a conexão no cleanup do `useEffect`.

### Estado Gerenciado

| State | Tipo | Descrição |
|-------|------|-----------|
| `isConnected` | boolean | Status da conexão WebSocket |
| `onlineCount` | number | Contagem atual de usuários |
| `peakUsers` | number | Pico máximo desde que abriu a página |
| `chartData` | array | Últimos 20 pontos `{ time, count }` |
| `events` | array | Últimos 50 eventos do log |

### Eventos Recebidos

**`online_count_update`** — atualiza o contador, pico e gráfico:
```js
socket.on('online_count_update', (data) => {
  setOnlineCount(data.count);
  setPeakUsers(prev => Math.max(prev, data.count));
  setChartData(prev => [...prev, { time: data.timestamp, count: data.count }].slice(-20));
});
```

**`user_connected` / `user_disconnected`** — adiciona entrada no log:
```js
socket.on('user_connected', (data) => {
  addEvent(`Novo usuário conectado (${data.id.substring(0, 8)})`, 'info');
});
```

### StatCard

Componente reutilizável. Recebe `color` como string e mapeia para classes Tailwind internamente:

```jsx
<StatCard
  title="Usuários Online"
  value={onlineCount}
  subtitle="usuários conectados"
  icon={Users}
  color="blue"   // blue | purple | green | red
  delay={0}      // delay da animação de entrada (segundos)
/>
```

### Chart

Recebe o array `data` e renderiza um `LineChart` do Recharts com `ResponsiveContainer`. Limita a 20 pontos via `.slice(-20)` no `App.jsx`. Labels do eixo X são rotacionados 45° para caber em telas pequenas.

### EventLog

Recebe o array `events` e renderiza lista com scroll. Cada evento tem `type` que define a cor:
- `success` → verde
- `error` → vermelho
- `warning` → amarelo
- `info` → azul

Buffer circular: ao chegar em 50 itens, o mais antigo é removido com `.slice(0, 50)`.

## Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_BACKEND_URL` | URL do servidor WebSocket | `https://seu-app.onrender.com` |

Vite só expõe variáveis com prefixo `VITE_`. São injetadas em build time, não em runtime.

## Deploy no Vercel

1. Crie um projeto apontando para este repositório
2. Configure **Root Directory** como `frontend`
3. Adicione a variável de ambiente `VITE_BACKEND_URL` com a URL do Render
4. Deploy — o Vercel detecta Vite automaticamente

Após obter a URL do Vercel, atualize a variável `FRONTEND_URL` no Render para evitar erros de CORS.
