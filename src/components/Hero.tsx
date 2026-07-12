import { Crown, Play, ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';
import { ARTIST_INFO } from '../data';
import { User } from '../types';

interface HeroProps {
  user: User | null;
  onOpenLogin: () => void;
  onNavigate: (sectionId: string) => void;
}

export default function Hero({ user, onOpenLogin, onNavigate }: HeroProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Cinematic Image with Luxury Dimmer and Blur Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={ARTIST_INFO.heroImage}
          alt="Agnelo Maiato"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-70 scale-105 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-radial-gradient" style={{ background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.85) 100%)' }} />
      </div>

      {/* Hero Ambient Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-12">
        
        {/* Small gold label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 mb-6 backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-amber-400 font-semibold">
            Portal Oficial de Música
          </span>
        </motion.div>

        {/* Main Title with Elegant Letter Spacing */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-[0.2em] text-white leading-none mb-4"
          id="hero-title"
        >
          AGNELO
          <span className="block mt-2 gold-gradient-text text-glow-gold filter drop-shadow-[0_2px_15px_rgba(212,175,55,0.2)]">
            MAIATO
          </span>
        </motion.h1>

        {/* Tagline / Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-montserrat text-xs sm:text-sm md:text-lg text-gray-300 uppercase tracking-[0.4em] max-w-3xl mx-auto mb-10 font-light"
          id="hero-tagline"
        >
          {ARTIST_INFO.tagline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
          id="hero-actions"
        >
          {/* Main Action - Play music */}
          <button
            onClick={() => onNavigate('music')}
            className="w-full sm:w-auto relative group overflow-hidden cursor-pointer rounded-lg bg-gradient-to-r from-amber-600 to-amber-400 p-[1px] shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.45)] transition-all"
            id="hero-btn-music"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-300 group-hover:scale-105 transition-transform duration-300" />
            <div className="relative px-8 py-3.5 bg-[#0B0B0C] group-hover:bg-transparent rounded-[7px] flex items-center justify-center gap-2 transition-colors">
              <Play className="w-4 h-4 text-amber-400 group-hover:text-black transition-colors" />
              <span className="font-montserrat text-xs font-bold tracking-widest text-white group-hover:text-black transition-colors">
                OUVIR MÚSICAS
              </span>
            </div>
          </button>

          {/* Secondary Action - VIP Fan Club */}
          <button
            onClick={() => {
              if (user) {
                onNavigate('vip-club');
              } else {
                onOpenLogin();
              }
            }}
            className="w-full sm:w-auto relative overflow-hidden group cursor-pointer border border-white/10 hover:border-amber-400/50 hover:bg-amber-400/5 rounded-lg transition-all"
            id="hero-btn-vip"
          >
            <div className="px-8 py-4 flex items-center justify-center gap-2">
              <Crown className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-montserrat text-xs font-bold tracking-widest text-gray-300 group-hover:text-white transition-colors">
                {user ? 'VER ÁREA VIP' : 'FÃ CLUBE VIP'}
              </span>
            </div>
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer hover:opacity-100 transition-opacity"
          onClick={() => onNavigate('bio')}
          id="hero-scroll-indicator"
        >
          <span className="font-montserrat text-[9px] uppercase tracking-[0.4em] text-gray-400">
            Explorar
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowDown className="w-4 h-4 text-amber-400" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
