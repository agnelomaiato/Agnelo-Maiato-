import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BioSection from './components/BioSection';
import AudioPlayerSection from './components/AudioPlayerSection';
import MediaSection from './components/MediaSection';
import VipDashboard from './components/VipDashboard';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import MobileSimulator from './components/MobileSimulator';
import { User } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, LogIn } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Load user session from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('agnelo_vip_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Error loading saved VIP user:', err);
        localStorage.removeItem('agnelo_vip_user');
      }
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('agnelo_vip_user', JSON.stringify(loggedInUser));
    window.dispatchEvent(new Event('vipUserUpdated'));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('agnelo_vip_user');
    window.dispatchEvent(new Event('vipUserUpdated'));
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const iosViewport = document.getElementById('ios-app-viewport');
      const androidViewport = document.getElementById('android-app-viewport');
      const activeViewport = iosViewport || androidViewport;
      
      if (activeViewport) {
        // Intelligently compute the top offset of target within the mobile container viewport
        const viewportRect = activeViewport.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const relativeTop = elementRect.top - viewportRect.top + activeViewport.scrollTop;
        
        activeViewport.scrollTo({
          top: relativeTop,
          behavior: 'smooth'
        });
      } else {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <MobileSimulator user={user}>
      <div className="min-h-screen bg-[#0B0B0C] text-white selection:bg-amber-400 selection:text-black font-sans antialiased overflow-x-hidden">
        
        {/* Translucent Premium Navbar */}
        <Navbar
          user={user}
          onOpenLogin={() => setIsLoginOpen(true)}
          onLogout={handleLogout}
          onNavigate={scrollToSection}
        />

        {/* Cinematic Hero Header */}
        <Hero
          user={user}
          onOpenLogin={() => setIsLoginOpen(true)}
          onNavigate={scrollToSection}
        />

        {/* Biography Section */}
        <BioSection />

        {/* Official Tracks Audio Player */}
        <AudioPlayerSection />

        {/* Professional Media Section (Photos / Videoclips) */}
        <MediaSection />

        {/* VIP Fan Zone Panel - Render dashboard if logged in, else render custom premium login invitation card */}
        <div id="vip-club-section" className="relative">
          <AnimatePresence mode="wait">
            {user ? (
              <motion.div
                key="vip-active"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <VipDashboard user={user} />
              </motion.div>
            ) : (
              <motion.div
                key="vip-invitation"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="py-24 bg-[#080809] border-t border-white/5 relative overflow-hidden"
                id="vip-club"
              >
                {/* Outer soft gold glow circles */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 mb-6">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-montserrat text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                      Club VIP Agnelo Maiato
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-wide mb-6">
                    Pronto para <span className="gold-gradient-text text-glow-gold font-extrabold">Aceder ao Inédito</span>?
                  </h2>

                  <p className="text-gray-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed mb-10 font-light">
                    Membros do Fã Clube VIP oficial ganham acesso antecipado a músicas exclusivas de estúdio, agendas de shows secretas, ensaios em vídeo e um canal de chat interativo direto com o Agnelo Maiato. O acesso é inteiramente gratuito.
                  </p>

                  {/* Styled Login Trigger Card */}
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="relative overflow-hidden group cursor-pointer inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-amber-600 to-amber-400 text-black font-montserrat font-bold text-xs tracking-widest rounded-xl shadow-[0_15px_30px_rgba(212,175,55,0.15)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] transition-all transform active:scale-98"
                    id="vip-join-invitation-btn"
                  >
                    <LogIn className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                    <span>CRIAR CONTA VIP GRATUITA</span>
                  </button>

                  <div className="mt-8 flex items-center justify-center gap-6 text-[10px] uppercase tracking-widest text-gray-500 font-montserrat">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Músicas Demos</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Vídeos Privados</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Mural de Chat</span>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sophisticated Footer with Social Integration */}
        <Footer onNavigate={scrollToSection} />

        {/* Validation-backed Responsive Login / Register Modal */}
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

      </div>
    </MobileSimulator>
  );
}
