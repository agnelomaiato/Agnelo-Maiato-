import { useState, useEffect } from 'react';
import { Menu, X, Crown, LogOut, Disc, Sparkles } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onNavigate: (sectionId: string) => void;
}

export default function Navbar({ user, onOpenLogin, onLogout, onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Início', id: 'home' },
    { label: 'Biografia', id: 'bio' },
    { label: 'Músicas', id: 'music' },
    { label: 'Atividades', id: 'activities' },
    { label: 'Galeria', id: 'gallery' },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-md border-b border-amber-500/15 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-5'
      }`}
      id="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo / Brand */}
          <div 
            onClick={() => handleItemClick('home')}
            className="flex items-center gap-2 cursor-pointer group"
            id="nav-logo"
          >
            <div className="relative w-9 h-9 rounded-full bg-amber-500/5 border border-amber-500/30 flex items-center justify-center group-hover:border-amber-500/80 transition-all duration-500 shadow-[0_0_10px_rgba(212,175,55,0.1)]">
              <Disc className="w-5 h-5 text-amber-400 group-hover:rotate-180 transition-all duration-1000" />
              <div className="absolute inset-0 rounded-full border border-t-amber-400 border-r-transparent border-b-transparent border-l-transparent animate-spin opacity-0 group-hover:opacity-100" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-[0.2em] text-white group-hover:text-amber-300 transition-colors">
                AGNELO
              </span>
              <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-amber-400/80 font-semibold -mt-1">
                MAIATO
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8" id="nav-desktop-links">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="font-montserrat text-xs tracking-widest text-gray-300 hover:text-amber-300 transition-colors uppercase font-medium focus:outline-none relative group"
              >
                {item.label}
                <span className="absolute bottom-[-6px] left-0 w-0 h-[1.5px] bg-amber-400 transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* CTA / VIP Access */}
          <div className="hidden md:flex items-center gap-4" id="nav-vip-container">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 shadow-[0_0_15px_rgba(212,175,55,0.05)]">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-montserrat text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                    {user.username}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all focus:outline-none"
                  title="Sair da Área VIP"
                  id="logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="relative overflow-hidden group cursor-pointer"
                id="login-trigger-desktop"
              >
                {/* Gold outer neon line */}
                <span className="absolute inset-0 w-full h-full rounded border border-amber-500/30 group-hover:border-amber-400/80 transition-colors" />
                <span className="absolute -inset-px bg-amber-500/10 rounded filter blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative px-5 py-2 flex items-center gap-2 bg-black/40 rounded">
                  <Crown className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="font-montserrat text-xs font-bold tracking-widest text-amber-400 group-hover:text-white transition-colors">
                    FÃ CLUBE VIP
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3" id="nav-mobile-hamburger">
            {user && (
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-amber-500/5 border border-amber-500/20">
                <Crown className="w-3 h-3 text-amber-400" />
                <span className="font-montserrat text-[9px] font-bold text-amber-300 uppercase">
                  {user.username.substring(0, 8)}
                </span>
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-amber-400 focus:outline-none p-1.5 rounded-lg border border-white/5 bg-[#121214]"
              aria-label="Abrir menu"
              id="mobile-menu-btn"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 mt-0.5 border-b border-amber-500/20 bg-[#0B0B0C]/98 backdrop-blur-xl py-6 px-4 space-y-4 shadow-2xl animate-fade-in"
          id="mobile-drawer"
        >
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="w-full text-left font-montserrat text-sm tracking-widest text-gray-300 hover:text-amber-400 py-2 border-b border-white/5 transition-colors uppercase font-medium focus:outline-none"
              >
                {item.label}
              </button>
            ))}

            {/* Mobile VIP CTA */}
            {user ? (
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="font-montserrat text-xs font-bold text-amber-300 uppercase tracking-wider">
                    {user.username} (VIP)
                  </span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded border border-red-500/20 text-red-400 hover:bg-red-500/5 text-xs font-montserrat transition-colors"
                  id="logout-btn-mobile"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenLogin();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-3 mt-2 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-400 text-black font-montserrat font-bold text-xs tracking-wider"
                id="login-trigger-mobile"
              >
                <Crown className="w-4 h-4" />
                <span>ADHERIR AO FÃ CLUBE VIP</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
