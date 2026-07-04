require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Configuração de CORS para permitir o frontend
const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',') 
    : ['http://localhost:3000'];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Porta do servidor
const PORT = process.env.PORT || 3000;

// Estado Distribuído (em memória para este exemplo didático)
let onlineUsers = new Set();
let history = []; // Armazena histórico de contagem para novos clientes

io.on('connection', (socket) => {
    // 1. Atribuição de ID e Registo de Conexão
    console.log(`Novo cliente conectado: ${socket.id}`);
    
    // Adiciona o utilizador ao conjunto de online
    onlineUsers.add(socket.id);

    // 2. Broadcast de Conexão
    // Informa a todos os clientes que um novo utilizador entrou
    io.emit('user_connected', {
        id: socket.id,
        count: onlineUsers.size,
        timestamp: new Date().toLocaleTimeString()
    });

    // Envia o estado atual (contagem) para todos
    io.emit('online_count_update', {
        count: onlineUsers.size,
        timestamp: new Date().toLocaleTimeString()
    });

    // 3. Gestão de Desconexão
    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
        onlineUsers.delete(socket.id);

        // Broadcast de Desconexão
        io.emit('user_disconnected', {
            id: socket.id,
            count: onlineUsers.size,
            timestamp: new Date().toLocaleTimeString()
        });

        // Atualiza a contagem global para todos os clientes restantes
        io.emit('online_count_update', {
            count: onlineUsers.size,
            timestamp: new Date().toLocaleTimeString()
        });
    });
});

// Rota de saúde do sistema
app.get('/status', (req, res) => {
    res.json({
        status: 'online',
        online_count: onlineUsers.size,
        uptime: process.uptime()
    });
});

server.listen(PORT, () => {
    console.log(`Servidor de Sistemas Distribuídos a correr na porta ${PORT}`);
});
