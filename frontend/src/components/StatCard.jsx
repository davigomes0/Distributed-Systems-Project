function StatCard({ title, value, subtitle, icon: Icon, color, delay = 0 }) {
  const colorClasses = {
    blue: {
      text: 'text-blue-400',
      border: 'hover:border-blue-500',
      icon: 'text-blue-400'
    },
    purple: {
      text: 'text-purple-400',
      border: 'hover:border-purple-500',
      icon: 'text-purple-400'
    },
    green: {
      text: 'text-green-400',
      border: 'hover:border-green-500',
      icon: 'text-green-400 animate-pulse-slow'
    },
    red: {
      text: 'text-red-400',
      border: 'hover:border-red-500',
      icon: 'text-red-400'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div 
      className={`bg-slate-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-700 ${colors.border} transition-all duration-300 animate-slide-up`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-slate-400 font-medium text-sm md:text-base">{title}</h3>
        <Icon className={colors.icon} size={20} />
      </div>
      <div className={`text-3xl sm:text-4xl md:text-5xl font-bold ${colors.text} mb-1 md:mb-2`}>
        {value}
      </div>
      <div className="text-xs md:text-sm text-slate-500">
        {subtitle}
      </div>
    </div>
  );
}

export default StatCard;
