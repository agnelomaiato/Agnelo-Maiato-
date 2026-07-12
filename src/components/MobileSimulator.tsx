import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  RotateCcw, 
  Wifi, 
  Battery, 
  BatteryCharging, 
  Signal, 
  QrCode, 
  Crown, 
  Settings, 
  Compass, 
  Radio, 
  ChevronLeft, 
  Check, 
  AppWindow, 
  User, 
  Sparkles, 
  Smartphone as PhoneIcon,
  Maximize2
} from 'lucide-react';

interface MobileSimulatorProps {
  children: React.ReactNode;
  user: any;
}

export default function MobileSimulator({ children, user }: MobileSimulatorProps) {
  const [mode, setMode] = useState<'none' | 'ios' | 'android'>('none');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [carrier, setCarrier] = useState<'UNITEL' | 'MOVICEL'>('UNITEL');
  const [batteryLevel, setBatteryLevel] = useState(98);
  const [isCharging, setIsCharging] = useState(true);
  const [signalStrength, setSignalStrength] = useState<4 | 3 | 2>(4);
  const [currentTime, setCurrentTime] = useState('12:00');
  const [showQrCode, setShowQrCode] = useState(false);
  const [showToast, setShowToast] = useState('');

  // Update mock clock time in real-time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Update mock battery drain
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel((prev) => {
        if (isCharging) {
          if (prev >= 100) {
            setIsCharging(false);
            return 100;
          }
          return prev + 1;
        } else {
          if (prev <= 15) {
            setIsCharging(true);
            return 15;
          }
          return prev - 1;
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [isCharging]);

  const toggleOrientation = () => {
    if (orientation === 'portrait') {
      setOrientation('landscape');
      triggerToast('Rotação Automática: Modo Paisagem 🔄');
    } else {
      setOrientation('portrait');
      triggerToast('Rotação Automática: Modo Retrato 🔄');
    }
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 3000);
  };

  const handleDeviceSelect = (selectedMode: 'none' | 'ios' | 'android') => {
    setMode(selectedMode);
    if (selectedMode !== 'none') {
      triggerToast(`Simulador ${selectedMode.toUpperCase()} ativado com sucesso! 📱`);
    } else {
      triggerToast('Visualização Padrão de Navegador restaurada! 💻');
    }
  };

  if (mode === 'none') {
    return (
      <div className="relative">
        {/* Floating Quick Simulator Trigger Widget */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-black/90 border border-amber-500/30 text-white text-[11px] font-montserrat font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>{showToast}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2 bg-[#0d0d0f]/95 border border-white/5 p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <button
              onClick={() => handleDeviceSelect('ios')}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#121214] hover:bg-amber-500 hover:text-black border border-white/5 hover:border-transparent text-gray-300 rounded-xl text-[10px] font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer"
              title="Visualizar como App iOS (iPhone)"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>iOS App</span>
            </button>
            <button
              onClick={() => handleDeviceSelect('android')}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#121214] hover:bg-amber-500 hover:text-black border border-white/5 hover:border-transparent text-gray-300 rounded-xl text-[10px] font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer"
              title="Visualizar como App Android"
            >
              <PhoneIcon className="w-3.5 h-3.5 text-amber-500" />
              <span>Android App</span>
            </button>
            <button
              onClick={() => setShowQrCode(!showQrCode)}
              className="p-2 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-black rounded-xl transition-all cursor-pointer"
              title="Abrir no Telemóvel Real"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real Phone QR Code Overlays */}
        <AnimatePresence>
          {showQrCode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setShowQrCode(false)}
            >
              <motion.div
                className="bg-[#121214] border border-amber-500/30 rounded-3xl p-8 max-w-sm text-center relative shadow-[0_0_50px_rgba(212,175,55,0.15)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer text-sm" onClick={() => setShowQrCode(false)}>✕</div>
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                  <QrCode className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-2">Testar no Telemóvel Real</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">
                  Esta aplicação é 100% responsiva para telemóveis. Faça scan do QR Code com a câmera do seu Android ou iPhone para viver a experiência nativa!
                </p>
                
                {/* Simulated high contrast QR Code placeholder with scan border */}
                <div className="bg-white p-4 rounded-2xl inline-block mb-4 shadow-xl border-4 border-amber-500">
                  <div className="w-44 h-44 flex flex-col items-center justify-center bg-gray-100 border border-gray-300 relative">
                    {/* Mock QR graphic lines and dots */}
                    <div className="absolute top-2 left-2 w-10 h-10 border-4 border-black" />
                    <div className="absolute top-2 right-2 w-10 h-10 border-4 border-black" />
                    <div className="absolute bottom-2 left-2 w-10 h-10 border-4 border-black" />
                    <div className="w-32 h-32 opacity-85 grid grid-cols-6 gap-1 p-2">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-sm ${(i % 3 === 0 || i % 5 === 2 || i === 7 || i === 19 || i === 29) ? 'bg-black' : 'bg-transparent'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-amber-400 bg-amber-500/5 py-1.5 px-3 rounded-lg border border-amber-500/15 select-all">
                  {window.location.href}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060607] text-white flex flex-col justify-between overflow-x-hidden selection:bg-amber-400 selection:text-black">
      {/* Dynamic Header control row for the Desktop User */}
      <header className="bg-black/85 border-b border-white/5 py-4 px-6 relative z-30 flex flex-wrap gap-4 items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/5 border border-amber-500/30 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm font-extrabold tracking-widest text-white uppercase">Agnelo Maiato Mobile</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold uppercase">
                {mode === 'ios' ? 'iOS iPhone' : 'Android OS'}
              </span>
            </div>
            <p className="text-[10px] text-gray-400">Ambiente de Testes Avançado de Dispositivos Móveis para Angola (UNITEL & MOVICEL)</p>
          </div>
        </div>

        {/* Simulation Controls */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Quick Carrier Selector */}
          <div className="flex items-center bg-zinc-900 border border-white/5 p-1 rounded-xl text-xs">
            <button
              onClick={() => { setCarrier('UNITEL'); triggerToast('Rede Móvel: UNITEL 📶'); }}
              className={`px-3 py-1.5 rounded-lg font-montserrat text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                carrier === 'UNITEL' ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              UNITEL
            </button>
            <button
              onClick={() => { setCarrier('MOVICEL'); triggerToast('Rede Móvel: MOVICEL 📶'); }}
              className={`px-3 py-1.5 rounded-lg font-montserrat text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                carrier === 'MOVICEL' ? 'bg-[#ff3b30] text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              MOVICEL
            </button>
          </div>

          {/* Orientation Control */}
          <button
            onClick={toggleOrientation}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-xl text-[10px] font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer"
            title="Girar Telemóvel"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Girar ({orientation === 'portrait' ? 'Vertical' : 'Horizontal'})</span>
          </button>

          {/* Device toggle list */}
          <div className="flex items-center bg-zinc-900 border border-white/5 p-1 rounded-xl text-xs">
            <button
              onClick={() => handleDeviceSelect('ios')}
              className={`px-3 py-1.5 rounded-lg font-montserrat text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                mode === 'ios' ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              iOS (iPhone)
            </button>
            <button
              onClick={() => handleDeviceSelect('android')}
              className={`px-3 py-1.5 rounded-lg font-montserrat text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                mode === 'android' ? 'bg-amber-400 text-black shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Android
            </button>
          </div>

          {/* Close / Return to full screen web view */}
          <button
            onClick={() => handleDeviceSelect('none')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 hover:text-amber-300 border border-white/10 rounded-xl text-[10px] font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Ecrã Inteiro</span>
          </button>
        </div>
      </header>

      {/* Simulator workspace frame center alignment */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gradient-to-b from-[#09090b] to-[#121214] relative overflow-hidden">
        
        {/* Decorative Grid and Ambient Lights */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,175,55,0.06),rgba(0,0,0,0))]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic simulator visual feed toast feedback inside workspace */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-[#161619] border border-amber-500/30 text-white text-[11px] font-montserrat font-bold uppercase tracking-widest px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 backdrop-blur-xl"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>{showToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hardware Frame Shell container */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
          className={`relative transition-all duration-500 ${
            orientation === 'portrait' 
              ? 'w-full max-w-[390px] h-[812px]' 
              : 'w-full max-w-[812px] h-[390px]'
          }`}
          id="mockup-viewport-frame"
        >
          {/* iOS iPhone Mockup Device */}
          {mode === 'ios' && (
            <div 
              className={`w-full h-full bg-zinc-950 rounded-[44px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-[11px] border-zinc-850 ring-4 ring-zinc-700/50 flex flex-col overflow-hidden relative transition-all duration-500`}
            >
              {/* Dynamic Island Face Id Bar */}
              {orientation === 'portrait' && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-3.5 shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-950 border border-indigo-900/40 relative">
                    <span className="absolute inset-0.5 rounded-full bg-blue-900/50 animate-pulse" />
                  </div>
                  <div className="w-12 h-1 bg-zinc-900 rounded-full" />
                  <div className="w-2 h-2 rounded-full bg-zinc-950" />
                </div>
              )}

              {/* iOS System Status Bar */}
              {orientation === 'portrait' ? (
                <div className="h-8 shrink-0 flex items-center justify-between px-6 text-xs text-white/95 font-semibold select-none z-30">
                  <span className="font-montserrat text-[11px] font-bold">{currentTime}</span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="font-montserrat font-bold text-[9px] uppercase tracking-wider text-amber-400">{carrier}</span>
                    <Signal className="w-3.5 h-3.5 text-white" />
                    <Wifi className="w-3.5 h-3.5 text-white" />
                    <div className="flex items-center gap-0.5 bg-white/20 px-1 py-0.5 rounded">
                      <span className="font-mono text-[9px] font-bold">{batteryLevel}%</span>
                      {isCharging ? <BatteryCharging className="w-3 h-3 text-green-400" /> : <Battery className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-5 shrink-0 flex items-center justify-between px-6 text-[10px] text-white/80 select-none z-30 bg-black/40">
                  <span className="font-montserrat font-bold">{currentTime} • {carrier}</span>
                  <div className="flex items-center gap-1.5">
                    <Signal className="w-3 h-3 text-white" />
                    <Wifi className="w-3 h-3 text-white" />
                    <span className="font-mono text-[9px]">{batteryLevel}%</span>
                    {isCharging ? <BatteryCharging className="w-3 h-3 text-green-400" /> : <Battery className="w-3 h-3 text-white" />}
                  </div>
                </div>
              )}

              {/* iPhone Side Buttons Styling Accents */}
              <div className="absolute top-24 -left-[14px] w-[3px] h-10 bg-zinc-700 rounded-r" />
              <div className="absolute top-40 -left-[14px] w-[3px] h-14 bg-zinc-700 rounded-r" />
              <div className="absolute top-58 -left-[14px] w-[3px] h-14 bg-zinc-700 rounded-r" />
              <div className="absolute top-32 -right-[14px] w-[3px] h-16 bg-zinc-700 rounded-l" />

              {/* Interactive Scrollable App Viewport */}
              <div className="flex-1 w-full rounded-[32px] overflow-y-auto overflow-x-hidden bg-[#0B0B0C] relative scrollbar-none" id="ios-app-viewport">
                <div className="mobile-touch-container scale-100 origin-top">
                  {children}
                </div>
              </div>

              {/* iOS Home Indicator Bar Footer */}
              <div className="h-5 shrink-0 flex items-center justify-center bg-[#0B0B0C] relative z-30 select-none">
                <div 
                  className="w-32 h-1 bg-white/35 rounded-full cursor-pointer hover:bg-white/60 transition-colors" 
                  onClick={() => triggerToast('Voltar ao Início (Gesto iOS Home)')}
                  title="iOS Swipe Bar Home"
                />
              </div>
            </div>
          )}

          {/* Android Smartphone Mockup Device */}
          {mode === 'android' && (
            <div 
              className={`w-full h-full bg-zinc-950 rounded-[32px] p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-[9px] border-zinc-800 ring-4 ring-zinc-700/40 flex flex-col overflow-hidden relative transition-all duration-500`}
            >
              {/* Central Android Camera Hole Punch */}
              {orientation === 'portrait' && (
                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-40 border-2 border-zinc-900 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-950/80" />
                </div>
              )}

              {/* Android OS System Status Bar */}
              {orientation === 'portrait' ? (
                <div className="h-7 shrink-0 flex items-center justify-between px-6 text-[10px] text-white/90 font-medium select-none z-30 bg-black/10">
                  <div className="flex items-center gap-1.5">
                    <span className="font-montserrat font-bold text-amber-500 text-[9px] tracking-wide">{carrier}</span>
                    <span className="text-[9px] font-mono opacity-60">5G</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Signal className="w-3.5 h-3.5 text-white" />
                    <Wifi className="w-3.5 h-3.5 text-white" />
                    <div className="flex items-center gap-1">
                      {isCharging ? <BatteryCharging className="w-3 h-3 text-green-400" /> : <Battery className="w-3 h-3 text-white" />}
                      <span className="font-mono text-[9px]">{batteryLevel}%</span>
                    </div>
                    <span className="font-montserrat font-bold ml-1">{currentTime}</span>
                  </div>
                </div>
              ) : (
                <div className="h-5 shrink-0 flex items-center justify-between px-6 text-[9px] text-white/80 select-none z-30 bg-black/40">
                  <span className="font-montserrat font-bold">{carrier} • {currentTime}</span>
                  <div className="flex items-center gap-1.5">
                    <Signal className="w-3 h-3 text-white" />
                    <Wifi className="w-3 h-3 text-white" />
                    <span className="font-mono text-[8px]">{batteryLevel}%</span>
                    {isCharging ? <BatteryCharging className="w-3 h-3 text-green-400" /> : <Battery className="w-3 h-3 text-white" />}
                  </div>
                </div>
              )}

              {/* Android Side Buttons Accent Highlights */}
              <div className="absolute top-28 -right-[11px] w-[3px] h-12 bg-zinc-600 rounded-l" />
              <div className="absolute top-44 -right-[11px] w-[3px] h-16 bg-zinc-600 rounded-l" />

              {/* Interactive Scrollable App Viewport */}
              <div className="flex-1 w-full rounded-[22px] overflow-y-auto overflow-x-hidden bg-[#0B0B0C] relative scrollbar-none animate-fade-in" id="android-app-viewport">
                <div className="mobile-touch-container scale-100 origin-top">
                  {children}
                </div>
              </div>

              {/* Android Custom Bottom Software Navigation Bar */}
              <div className="h-8 shrink-0 flex items-center justify-around bg-black text-white/50 text-[10px] select-none z-30 border-t border-white/5">
                <button 
                  onClick={() => {
                    triggerToast('Tecla Traseira (Android Back Key) pressionada ◀');
                    // Scroll slightly backwards as a tactile feedback action
                    const vp = document.getElementById('android-app-viewport');
                    if (vp) vp.scrollBy({ top: -150, behavior: 'smooth' });
                  }}
                  className="py-1 px-4 hover:bg-white/5 hover:text-white rounded transition-colors cursor-pointer"
                  title="Voltar"
                >
                  ◀
                </button>
                <button 
                  onClick={() => {
                    triggerToast('Tecla Inicial (Android Home Key) pressionada ●');
                    // Scroll to top of current viewport
                    const vp = document.getElementById('android-app-viewport');
                    if (vp) vp.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="py-1 px-4 hover:bg-white/5 hover:text-white rounded transition-colors cursor-pointer"
                  title="Início"
                >
                  ●
                </button>
                <button 
                  onClick={() => triggerToast('Gestor de Tarefas (Android Overview Key) 🚀')}
                  className="py-1 px-4 hover:bg-white/5 hover:text-white rounded transition-colors cursor-pointer"
                  title="Aplicações Recentes"
                >
                  ■
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </div>

      {/* Simulator Footer Information Indicator */}
      <footer className="bg-black/85 border-t border-white/5 py-3 px-6 text-center text-xs text-gray-500 relative z-30">
        <p className="font-montserrat text-[10px] uppercase tracking-widest">
          Agnelo Maiato Smart Simulator — Teste a reprodução de MP3 e envio de mensagens VIP em layouts móveis reais
        </p>
      </footer>
    </div>
  );
}
