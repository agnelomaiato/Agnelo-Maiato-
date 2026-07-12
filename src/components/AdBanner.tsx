import React, { useState, useEffect } from 'react';
import { Sparkles, ExternalLink, DollarSign, Heart, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdTemplate {
  id: string;
  brand: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  sponsorUrl: string;
}

const ADS_POOL: AdTemplate[] = [
  {
    id: 'unitel-5g',
    brand: 'UNITEL',
    title: 'UNITEL 5G - O Futuro é Agora',
    description: 'Navega à velocidade da luz com a rede 5G líder em Angola. Adere já aos novos planos de dados ilimitados!',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop',
    ctaText: 'Aderir à Rede 5G',
    sponsorUrl: 'https://www.unitel.ao'
  },
  {
    id: 'bfa-net',
    brand: 'Banco de Fomento Angola (BFA)',
    title: 'BFA App - O Banco no Teu Bolso',
    description: 'Faz transferências instantâneas, paga serviços e gere o teu orçamento diário com total segurança. Baixa já!',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop',
    ctaText: 'Instalar BFA App',
    sponsorUrl: 'https://www.bfa.ao'
  },
  {
    id: 'multicaixa-express',
    brand: 'EMIS / MULTICAIXA Express',
    title: 'Simplifica a Tua Vida',
    description: 'Associa os teus cartões de débito ao telemóvel e faz pagamentos e levantamentos sem cartão físico. Express e seguro.',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?q=80&w=600&auto=format&fit=crop',
    ctaText: 'Saber Mais',
    sponsorUrl: 'https://www.emis.co.ao'
  },
  {
    id: 'pepsi-ao',
    brand: 'PEPSI ANGOLA',
    title: 'Pepsi - Sabor Máximo, Zero Açúcar',
    description: 'Refresca o teu dia com a energia contagiante da Pepsi. Perfeita para acompanhar as tuas faixas favoritas do Agnelo Maiato.',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop',
    ctaText: 'Explorar Sabores',
    sponsorUrl: 'https://www.pepsi.com'
  }
];

interface AdBannerProps {
  position?: 'sidebar' | 'horizontal' | 'inline';
}

export default function AdBanner({ position = 'horizontal' }: AdBannerProps) {
  const [ad, setAd] = useState<AdTemplate>(ADS_POOL[0]);
  const [clicked, setClicked] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [earningMsg, setEarningMsg] = useState('');

  // Select a random ad from the pool on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * ADS_POOL.length);
    setAd(ADS_POOL[randomIndex]);

    // Send simulated impression (ad view) to server
    const registerImpression = async () => {
      try {
        await fetch('/api/ads/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isClick: false })
        });
        // Dispatch custom event to refresh wallet details if Agnelo is viewing
        window.dispatchEvent(new Event('walletUpdated'));
      } catch (err) {
        console.log('Error registering ad impression:', err);
      }
    };
    registerImpression();
  }, []);

  const handleAdClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (clicked) return;

    setClicked(true);
    setEarningMsg('A processar apoio monetário...');
    setShowToast(true);

    try {
      const res = await fetch('/api/ads/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isClick: true })
      });
      const data = await res.json();
      
      setEarningMsg('Fabuloso! O teu clique gerou +130 Kz ($0.15) de receita de anúncio enviada directamente à carteira do Agnelo! 🇦🇴❤️');
      
      // Dispatch update event
      window.dispatchEvent(new Event('walletUpdated'));
    } catch (err) {
      console.log('Error registering ad click:', err);
      setEarningMsg('Obrigado! O teu clique foi contabilizado como apoio ao artista.');
    }

    // Auto-close toast after 5 seconds
    setTimeout(() => {
      setShowToast(false);
      setClicked(false);
    }, 5500);

    // Open sponsor link in new tab
    setTimeout(() => {
      window.open(ad.sponsorUrl, '_blank', 'noopener,noreferrer');
    }, 1200);
  };

  if (position === 'sidebar') {
    return (
      <div className="relative rounded-2xl border border-white/5 bg-[#121214]/65 overflow-hidden p-4 flex flex-col justify-between group shadow-lg">
        {/* Ad Tag */}
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-[8px] font-mono text-gray-500 tracking-wider uppercase font-bold z-10">
          Anúncio Patrocinado
        </div>

        <div className="space-y-3">
          <div className="relative aspect-video rounded-lg overflow-hidden border border-white/5">
            <img 
              src={ad.imageUrl} 
              alt={ad.title} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-90"
            />
          </div>
          <div>
            <span className="text-[10px] font-montserrat font-bold text-amber-400 uppercase tracking-wider">{ad.brand}</span>
            <h4 className="text-xs font-bold text-white leading-snug mt-0.5">{ad.title}</h4>
            <p className="text-[11px] text-gray-400 font-light mt-1 line-clamp-2 leading-relaxed">{ad.description}</p>
          </div>
        </div>

        <button
          onClick={handleAdClick}
          className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-amber-400 hover:text-black hover:border-transparent text-xs font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          <span>{ad.ctaText}</span>
          <ExternalLink className="w-3 h-3" />
        </button>

        {/* Ad Earnings Notification Toast */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-x-2 bottom-2 bg-gradient-to-br from-amber-500 to-amber-400 text-black p-2.5 rounded-lg text-[10px] font-medium leading-relaxed shadow-lg flex items-start gap-1.5 z-20"
            >
              <DollarSign className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{earningMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Horizontal ad banner (default)
  return (
    <div className="w-full relative rounded-2xl border border-amber-500/10 bg-gradient-to-r from-black/80 via-[#101012] to-black/80 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden group shadow-md my-8">
      {/* Glow highlight */}
      <div className="absolute inset-0 bg-radial-gradient from-amber-500/2 via-transparent to-transparent opacity-80 pointer-events-none" />

      {/* Ad Badge */}
      <div className="absolute top-2.5 right-3 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[8px] font-mono text-amber-400 tracking-wider uppercase font-bold z-10">
        Patrocinador Oficial
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
        <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-white/5 shrink-0 hidden sm:block">
          <img 
            src={ad.imageUrl} 
            alt={ad.title} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="text-center sm:text-left">
          <span className="text-[10px] font-montserrat font-bold text-amber-400 uppercase tracking-widest">{ad.brand}</span>
          <h4 className="text-sm font-bold text-white leading-snug mt-0.5 flex items-center justify-center sm:justify-start gap-1.5">
            {ad.title}
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse hidden sm:inline" />
          </h4>
          <p className="text-xs text-gray-400 font-light mt-1 max-w-xl leading-relaxed">{ad.description}</p>
        </div>
      </div>

      <div className="shrink-0">
        <button
          onClick={handleAdClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-montserrat font-bold uppercase tracking-wider transition-all hover:scale-102 cursor-pointer shadow-[0_5px_15px_rgba(212,175,55,0.15)] active:scale-98"
        >
          <span>{ad.ctaText}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Popover Toast floating alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute inset-0 bg-[#070708]/98 backdrop-blur-md flex items-center justify-center px-6 text-center z-30 border border-amber-500/20 rounded-2xl"
          >
            <div className="flex flex-col items-center gap-1.5 max-w-lg">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs font-semibold text-white tracking-wide">{earningMsg}</p>
              <p className="text-[10px] text-gray-500">A redireccionar para o patrocinador...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
