function Header() {
  return (
    <header className="text-center mb-8 md:mb-12 animate-fade-in px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Monitor de Sistemas Distribuídos
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-slate-400">
        Monitoramento em Tempo Real com WebSocket
      </p>
    </header>
  );
}

export default Header;
