function EventLog({ events }) {
  const getEventColor = (type) => {
    switch(type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-700">
      <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Histórico de Eventos</h2>
      <div className="space-y-2 max-h-48 sm:max-h-56 md:max-h-64 overflow-y-auto custom-scrollbar">
        {events.length === 0 ? (
          <div className="text-slate-500 text-center py-6 md:py-8 text-sm md:text-base">
            Aguardando eventos...
          </div>
        ) : (
          events.map(event => (
            <div 
              key={event.id}
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 p-2 md:p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors"
            >
              <span className="text-slate-500 text-xs md:text-sm font-mono sm:w-20 md:w-24">
                {event.time}
              </span>
              <span className={`flex-1 text-xs md:text-sm ${getEventColor(event.type)}`}>
                {event.message}
              </span>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        @media (min-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
        }
      `}</style>
    </div>
  );
}

export default EventLog;
