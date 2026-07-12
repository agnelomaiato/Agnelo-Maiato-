import { Instagram, Youtube, Facebook, Mail, Music2, ArrowUp, Disc } from 'lucide-react';
import { ARTIST_INFO } from '../data';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const socialLinks = [
    { icon: <Instagram className="w-4 h-4" />, href: 'https://www.instagram.com/agnelomaiato', label: 'Instagram' },
    { icon: <Youtube className="w-4 h-4" />, href: 'https://www.youtube.com/agnelomaiato', label: 'YouTube' },
    { icon: <Music2 className="w-4 h-4" />, href: 'https://spotify.com', label: 'Spotify' },
    { icon: <Facebook className="w-4 h-4" />, href: 'https://www.facebook.com/agnelomaiato', label: 'Facebook' },
  ];

  const handleScrollToTop = () => {
    onNavigate('home');
  };

  return (
    <footer className="bg-black border-t border-white/5 pt-16 pb-8 relative overflow-hidden" id="main-footer">
      {/* Absolute minor decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/5">
          
          {/* Logo brand & tagline */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start" id="footer-brand">
            <div className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <Disc className="w-5 h-5 text-amber-400" />
              <span className="font-serif text-lg font-bold tracking-[0.25em] text-white">AGNELO MAIATO</span>
            </div>
            <p className="text-[11px] text-gray-500 uppercase tracking-widest font-montserrat">
              {ARTIST_INFO.tagline}
            </p>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4" id="footer-social-links">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#121214] hover:bg-amber-400 text-gray-400 hover:text-black border border-white/5 hover:border-transparent flex items-center justify-center transition-all shadow-md group"
                aria-label={social.label}
              >
                <span className="group-hover:scale-110 transition-transform">
                  {social.icon}
                </span>
              </a>
            ))}
          </div>

          {/* Contact mail */}
          <div className="flex items-center gap-2 text-xs text-gray-400" id="footer-contact">
            <Mail className="w-4 h-4 text-amber-500" />
            <a href="mailto:agneloheart@gmail.com" className="hover:text-amber-400 transition-colors">agneloheart@gmail.com</a>
          </div>

        </div>

        {/* Bottom copyright details */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} Agnelo Maiato. Todos os direitos reservados. Desenvolvido com sofisticação.</p>
          
          {/* Back to top scroll button */}
          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors focus:outline-none cursor-pointer text-xs uppercase tracking-wider font-montserrat font-bold"
            id="footer-back-to-top-btn"
          >
            <span>Voltar ao topo</span>
            <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:border-amber-400/30 transition-colors">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

      </div>
    </footer>
  );
}
