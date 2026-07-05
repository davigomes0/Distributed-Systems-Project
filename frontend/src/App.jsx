import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Users, Wifi, WifiOff, TrendingUp } from 'lucide-react';
import Header from './components/Header';
import StatCard from './components/StatCard';
import Chart from './components/Chart';
import EventLog from './components/EventLog';
import Footer from './components/Footer';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function App() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [events, setEvents] = useState([]);
  const [peakUsers, setPeakUsers] = useState(0);

  useEffect(() => {
    const newSocket = io(BACKEND_URL, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      addEvent('Conectado ao servidor', 'success');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      addEvent('Desconectado do servidor', 'error');
    });

    newSocket.on('online_count_update', (data) => {
      setOnlineCount(data.count);
      setPeakUsers(prev => Math.max(prev, data.count));
      
      setChartData(prev => {
        const newData = [...prev, {
          time: data.timestamp,
          count: data.count
        }];
        return newData.slice(-20);
      });
    });

    newSocket.on('user_connected', (data) => {
      addEvent(`Novo usuário conectado (${data.id.substring(0, 8)})`, 'info');
    });

    newSocket.on('user_disconnected', (data) => {
      addEvent(`Usuário desconectado (${data.id.substring(0, 8)})`, 'warning');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const addEvent = (message, type) => {
    const newEvent = {
      id: Date.now(),
      message,
      type,
      time: new Date().toLocaleTimeString('pt-BR')
    };
    
    setEvents(prev => [newEvent, ...prev].slice(0, 50));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatCard
            title="Usuários Online"
            value={onlineCount}
            subtitle={onlineCount === 1 ? 'usuário conectado' : 'usuários conectados'}
            icon={Users}
            color="blue"
            delay={0}
          />

          <StatCard
            title="Pico de Usuários"
            value={peakUsers}
            subtitle="máximo atingido"
            icon={TrendingUp}
            color="purple"
            delay={0.1}
          />

          <StatCard
            title="Status da Conexão"
            value={isConnected ? 'Conectado' : 'Desconectado'}
            subtitle={isConnected ? 'WebSocket ativo' : 'Aguardando conexão'}
            icon={isConnected ? Wifi : WifiOff}
            color={isConnected ? 'green' : 'red'}
            delay={0.2}
          />
        </div>

        <Chart data={chartData} />

        <EventLog events={events} />

        <Footer />
      </div>
    </div>
  );
}

export default App;
