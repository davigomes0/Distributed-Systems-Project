// Configuração do Socket.IO
// Em produção, a URL seria o endereço do servidor
const socket = io();

// Elementos do DOM
const onlineCountEl = document.getElementById('online-count');
const statusEl = document.getElementById('connection-status');
const eventLogEl = document.getElementById('event-log');

// Inicialização do Gráfico Chart.js
const ctx = document.getElementById('realtimeChart').getContext('2d');
const maxDataPoints = 20;

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Timestamps
        datasets: [{
            label: 'Utilizadores Online',
            data: [],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1 }
            }
        },
        plugins: {
            legend: { display: true }
        }
    }
});

// Função para adicionar logs na interface
function addLog(message, type = 'info') {
    const li = document.createElement('li');
    const time = new Date().toLocaleTimeString();
    li.textContent = `[${time}] ${message}`;
    
    if (type === 'connect') li.style.color = 'green';
    if (type === 'disconnect') li.style.color = 'red';
    
    eventLogEl.prepend(li);
    
    // Limitar logs para não sobrecarregar o DOM
    if (eventLogEl.children.length > 50) {
        eventLogEl.removeChild(eventLogEl.lastChild);
    }
}

// Função para atualizar o gráfico
function updateChart(count) {
    const now = new Date().toLocaleTimeString();
    
    chart.data.labels.push(now);
    chart.data.datasets[0].data.push(count);

    // Manter apenas os últimos N pontos
    if (chart.data.labels.length > maxDataPoints) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }

    chart.update();
}

// Eventos do Socket.IO
socket.on('connect', () => {
    statusEl.textContent = 'Conectado';
    statusEl.className = 'status-indicator status-online';
    addLog('Conexão estabelecida com o servidor.', 'connect');
});

socket.on('disconnect', () => {
    statusEl.textContent = 'Desconectado';
    statusEl.className = 'status-indicator status-offline';
    addLog('Conexão perdida com o servidor.', 'disconnect');
});

socket.on('online_count_update', (data) => {
    onlineCountEl.textContent = data.count;
    updateChart(data.count);
});

socket.on('user_connected', (data) => {
    addLog(`Novo utilizador entrou (ID: ${data.id.substring(0, 5)}...)`);
});

socket.on('user_disconnected', (data) => {
    addLog(`Utilizador saiu (ID: ${data.id.substring(0, 5)}...)`);
});
