import React, { useState, useRef, useEffect } from 'react';
import { 
  Crown, Play, Pause, Send, Calendar, Download, ShieldCheck, 
  Sparkles, Tv, Image, MessageSquare, Flame, Plus, Trash2, 
  Music, UploadCloud, Check, Settings, Radio, DollarSign, 
  CreditCard, Lock, Wallet, RefreshCw, TrendingUp, HelpCircle, 
  ArrowRight, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, FanMessage, Song, WalletSettings } from '../types';
import { VIP_SONGS, ACTIVITIES_MEDIA, INITIAL_FAN_MESSAGES, getSavedSongs, saveSongs, getSavedVipSongs, saveVipSongs } from '../data';
import AdBanner from './AdBanner';

interface VipDashboardProps {
  user: User;
}

export default function VipDashboard({ user }: VipDashboardProps) {
  const [messages, setMessages] = useState<FanMessage[]>(INITIAL_FAN_MESSAGES);
  const [newMessageText, setNewMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Dynamic Songs State initialized from localStorage
  const [songsList, setSongsList] = useState<Song[]>(getSavedSongs);
  const [vipSongsList, setVipSongsList] = useState<Song[]>(getSavedVipSongs);

  // Artist Mode (Agnelo has complete full creator access)
  const isAgneloEmail = user.email.toLowerCase() === 'agneloheart@gmail.com';
  const [isArtistMode, setIsArtistMode] = useState(isAgneloEmail);
  const [artistPanelTab, setArtistPanelTab] = useState<'music' | 'finance'>('music');

  // Subscription States
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<'monthly' | 'yearly' | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(true);

  // Checkout Form States
  const [checkoutPlan, setCheckoutPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'multicaixa_express' | 'paypal' | 'bank_iban' | 'credit_card'>('multicaixa_express');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentEmail, setPaymentEmail] = useState(user.email);
  const [paymentIban, setPaymentIban] = useState('');
  const [paymentCardNum, setPaymentCardNum] = useState('');
  const [paymentCardHolder, setPaymentCardHolder] = useState(user.username);
  const [paymentCardExp, setPaymentCardExp] = useState('');
  const [paymentCardCvc, setPaymentCardCvc] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Wallet State (Agnelo/Artist side)
  const [wallet, setWallet] = useState<WalletSettings | null>(null);
  const [isSavingWallet, setIsSavingWallet] = useState(false);
  const [walletFormType, setWalletFormType] = useState<string>('multicaixa_express');
  const [walletFormAddress, setWalletFormAddress] = useState('');
  const [walletFormOwner, setWalletFormOwner] = useState('Agnelo Maiato');
  const [walletMessage, setWalletMessage] = useState('');
  const [isCashingOut, setIsCashingOut] = useState(false);

  // Form states for adding a song (Artist Panel)
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newTrackAlbum, setNewTrackAlbum] = useState('');
  const [newTrackDuration, setNewTrackDuration] = useState('03:30');
  const [newTrackUrl, setNewTrackUrl] = useState('');
  const [newTrackCoverUrl, setNewTrackCoverUrl] = useState('');
  const [newTrackType, setNewTrackType] = useState<'official' | 'vip'>('official');
  const [addSuccess, setAddSuccess] = useState('');

  // Audio state for unreleased tracks
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Sync state and fetch VIP details
  const checkSubscription = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/vip-status?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      setIsSubscribed(data.isSubscribed);
      setSubscriptionPlan(data.plan || null);
    } catch (err) {
      console.error('Error fetching VIP status:', err);
      // Fallback
      setIsSubscribed(isAgneloEmail);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const fetchWallet = async () => {
    if (!isAgneloEmail) return;
    try {
      const res = await fetch('/api/wallet');
      const data = await res.json();
      setWallet(data);
      setWalletFormType(data.walletType);
      setWalletFormAddress(data.walletAddress);
      setWalletFormOwner(data.ownerName);
    } catch (err) {
      console.error('Error fetching wallet settings:', err);
    }
  };

  useEffect(() => {
    checkSubscription();
    fetchWallet();
  }, [user]);

  useEffect(() => {
    const refreshWallet = () => {
      fetchWallet();
    };
    window.addEventListener('walletUpdated', refreshWallet);
    return () => {
      window.removeEventListener('walletUpdated', refreshWallet);
    };
  }, []);

  const handlePlayVipTrack = (trackId: string, trackUrl: string) => {
    if (playingTrackId === trackId) {
      audioRef.current?.pause();
      setPlayingTrackId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(trackUrl);
      audioRef.current.play().catch(err => console.log('VIP audio playback error:', err));
      setPlayingTrackId(trackId);

      audioRef.current.addEventListener('ended', () => {
        setPlayingTrackId(null);
      });
    }
  };

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackTitle.trim()) return;

    const defaultCovers = [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop'
    ];

    const randomCover = defaultCovers[Math.floor(Math.random() * defaultCovers.length)];

    const defaultUrls = [
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
    ];
    const randomUrl = defaultUrls[Math.floor(Math.random() * defaultUrls.length)];

    const newSong: Song = {
      id: newTrackType === 'official' ? `song-${Date.now()}` : `vip-${Date.now()}`,
      title: newTrackTitle.trim(),
      album: newTrackAlbum.trim() || 'Singles',
      duration: newTrackDuration.trim() || '03:30',
      url: newTrackUrl.trim() || randomUrl,
      coverUrl: newTrackCoverUrl.trim() || randomCover,
      year: new Date().getFullYear().toString(),
      plays: '0'
    };

    if (newTrackType === 'official') {
      const updated = [...songsList, newSong];
      setSongsList(updated);
      saveSongs(updated);
    } else {
      const updated = [...vipSongsList, newSong];
      setVipSongsList(updated);
      saveVipSongs(updated);
    }

    // Trigger custom event so AudioPlayerSection catches the update
    window.dispatchEvent(new Event('songsUpdated'));

    // Clear form
    setNewTrackTitle('');
    setNewTrackAlbum('');
    setNewTrackDuration('03:30');
    setNewTrackUrl('');
    setNewTrackCoverUrl('');
    setAddSuccess('Música carregada com sucesso! Já está disponível no reprodutor.');
    
    setTimeout(() => {
      setAddSuccess('');
    }, 4000);
  };

  const handleRemoveSong = (id: string, type: 'official' | 'vip') => {
    if (type === 'official') {
      const updated = songsList.filter((s) => s.id !== id);
      setSongsList(updated);
      saveSongs(updated);
    } else {
      const updated = vipSongsList.filter((s) => s.id !== id);
      setVipSongsList(updated);
      saveVipSongs(updated);
    }
    // Trigger custom event
    window.dispatchEvent(new Event('songsUpdated'));
  };

  const handlePostMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) {
      setErrorText('Por favor, escreva uma mensagem antes de enviar.');
      return;
    }
    if (newMessageText.trim().length < 5) {
      setErrorText('A mensagem deve ter pelo menos 5 caracteres.');
      return;
    }

    setErrorText('');
    setIsSubmitting(true);

    const messageToPost: FanMessage = {
      id: `fan-msg-${Date.now()}`,
      userName: user.username,
      userEmail: user.email,
      message: newMessageText,
      timestamp: 'Agora mesmo',
      isVIP: true,
    };

    setTimeout(() => {
      setMessages((prev) => [messageToPost, ...prev]);
      setNewMessageText('');
      setIsSubmitting(false);

      // Trigger automatic simulated reply from Agnelo!
      setTimeout(() => {
        const agneloReplies = [
          `Olá ${user.username}! Que bom ler o teu comentário por aqui. Agradeço imensamente de coração o teu apoio VIP! Abraço forte.`,
          `Grande abraço, ${user.username}! O vosso apoio como membros VIP é o combustível para continuar a criar novas canções!`,
          `Incrível ler isso, ${user.username}! Guarda esse entusiasmo que o novo álbum está quase cá fora e teremos surpresas para os VIPs!`,
          `Fico super grato com as tuas palavras, ${user.username}. Tu fazes a diferença nesta caminhada!`
        ];
        const randomReply = agneloReplies[Math.floor(Math.random() * agneloReplies.length)];

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageToPost.id
              ? { ...msg, repliedByAgnelo: randomReply }
              : msg
          )
        );
      }, 2000);

    }, 1000);
  };

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');
    setCheckoutLoading(true);

    // Form validations
    if (paymentMethod === 'multicaixa_express' && !paymentPhone.trim()) {
      setCheckoutError('Por favor, indique o número de telemóvel associado ao Multicaixa Express.');
      setCheckoutLoading(false);
      return;
    }
    if (paymentMethod === 'paypal' && !paymentEmail.trim()) {
      setCheckoutError('Por favor, indique o e-mail da sua conta PayPal.');
      setCheckoutLoading(false);
      return;
    }
    if (paymentMethod === 'bank_iban' && !paymentIban.trim()) {
      setCheckoutError('Por favor, preencha o IBAN para transferir os valores.');
      setCheckoutLoading(false);
      return;
    }
    if (paymentMethod === 'credit_card' && (!paymentCardNum || !paymentCardExp || !paymentCardCvc)) {
      setCheckoutError('Por favor, preencha todos os dados do cartão de crédito.');
      setCheckoutLoading(false);
      return;
    }

    const detailsMap = {
      multicaixa_express: paymentPhone,
      paypal: paymentEmail,
      bank_iban: paymentIban,
      credit_card: `Card ending in ${paymentCardNum.slice(-4)}`
    };

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          username: user.username,
          plan: checkoutPlan,
          paymentMethod,
          paymentDetails: detailsMap[paymentMethod]
        })
      });

      const data = await res.json();
      if (data.success) {
        setCheckoutSuccess(true);
        setTimeout(() => {
          setIsSubscribed(true);
          setSubscriptionPlan(checkoutPlan);
          setCheckoutSuccess(false);
        }, 2500);
      } else {
        setCheckoutError(data.error || 'Não foi possível completar o pagamento.');
      }
    } catch (err) {
      setCheckoutError('Erro de ligação ao servidor de cobrança.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleUpdateWalletConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingWallet(true);
    setWalletMessage('');

    try {
      const res = await fetch('/api/wallet/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletType: walletFormType,
          walletAddress: walletFormAddress,
          ownerName: walletFormOwner
        })
      });
      const data = await res.json();
      if (data.success) {
        setWalletMessage('Sucesso! Carteira digital associada e vinculada à sua conta.');
        fetchWallet();
        setTimeout(() => setWalletMessage(''), 4000);
      } else {
        setWalletMessage('Erro ao salvar as configurações.');
      }
    } catch (err) {
      setWalletMessage('Erro na ligação.');
    } finally {
      setIsSavingWallet(false);
    }
  };

  const handleCashoutProceed = async () => {
    if (!wallet || (wallet.balanceKz === 0 && wallet.balanceUsd === 0)) {
      alert('De momento, não possui saldo acumulado para levantar.');
      return;
    }

    if (!confirm(`Deseja transferir ${wallet.balanceKz.toLocaleString()} Kz ($${wallet.balanceUsd.toFixed(2)}) para a sua carteira digital ativa (${walletFormAddress})?`)) {
      return;
    }

    setIsCashingOut(true);
    try {
      const res = await fetch('/api/wallet/cashout', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`Sucesso! Os fundos foram creditados na sua conta: \n${walletFormType.toUpperCase()} - ${walletFormAddress}`);
        fetchWallet();
      }
    } catch (err) {
      alert('Falha ao processar o levantamento.');
    } finally {
      setIsCashingOut(false);
    }
  };

  const vipPhotos = ACTIVITIES_MEDIA.filter((item) => item.type === 'photo');
  const vipVideos = ACTIVITIES_MEDIA.filter((item) => item.type === 'video');

  // LOADING STATE
  if (isCheckingStatus) {
    return (
      <section id="vip-club" className="py-24 bg-[#070708] relative overflow-hidden border-t border-amber-500/10 flex flex-col items-center justify-center min-h-[450px]">
        <div className="w-12 h-12 rounded-full border-2 border-t-amber-400 border-r-transparent border-b-transparent border-l-transparent animate-spin mb-4" />
        <p className="text-xs font-montserrat text-gray-500 font-bold uppercase tracking-widest">A carregar credenciais VIP...</p>
      </section>
    );
  }

  // CHECKOUT SCREEN (If user is not subscribed and is not the artist)
  if (!isSubscribed && !isAgneloEmail) {
    return (
      <section id="vip-club" className="py-24 bg-[#070708] relative overflow-hidden border-t border-amber-500/20">
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          
          {/* Headline block */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 mb-4 animate-bounce">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-montserrat text-[10px] uppercase tracking-wider text-amber-400 font-bold">Acesso Premium Reservado</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide">
              Adere ao <span className="gold-gradient-text text-glow-gold">Fã Clube VIP Oficial</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-3 max-w-xl mx-auto leading-relaxed font-light">
              Desbloqueia as músicas unreleased, demos exclusivas gravadas em Luanda, os vídeos de bastidores e o fórum interativo de conversa do cantor Agnelo Maiato.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left side: Subscription pricing selector (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <h3 className="text-xs font-montserrat font-bold uppercase tracking-wider text-amber-400/80 mb-3">Escolhe o teu plano</h3>
              
              {/* Monthly card */}
              <div 
                onClick={() => setCheckoutPlan('monthly')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  checkoutPlan === 'monthly'
                    ? 'bg-amber-400/5 border-amber-500/60 shadow-[0_0_20px_rgba(212,175,55,0.06)]'
                    : 'bg-[#121214]/60 border-white/5 hover:border-white/10'
                }`}
              >
                {checkoutPlan === 'monthly' && (
                  <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-white font-montserrat">PLANO MENSAL VIP</h4>
                  <p className="text-[10px] text-gray-400 mt-1">Acesso completo por 30 dias. Cancela quando quiseres.</p>
                </div>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-serif text-white">2.500 Kz</span>
                  <span className="text-xs text-gray-500">/ mês</span>
                  <span className="text-[10px] text-amber-400/60 font-mono ml-auto">(~$3.00 USD)</span>
                </div>
              </div>

              {/* Annual Card */}
              <div 
                onClick={() => setCheckoutPlan('yearly')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between overflow-hidden ${
                  checkoutPlan === 'yearly'
                    ? 'bg-amber-400/5 border-amber-500/80 shadow-[0_0_20px_rgba(212,175,55,0.08)]'
                    : 'bg-[#121214]/60 border-white/5 hover:border-white/10'
                }`}
              >
                {/* Save badge */}
                <div className="absolute top-0 right-0 bg-amber-400 text-black text-[8px] font-bold font-montserrat px-3 py-1 uppercase rounded-bl-xl tracking-wider">
                  Poupa 20%
                </div>
                {checkoutPlan === 'yearly' && (
                  <div className="absolute top-3 right-12 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-white font-montserrat flex items-center gap-1.5">
                    PLANO ANUAL VIP
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-1 font-light">Garante 1 ano inteiro de suporte ao cantor e conteúdo lossless premium.</p>
                </div>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-serif text-white">24.000 Kz</span>
                  <span className="text-xs text-gray-500">/ ano</span>
                  <span className="text-[10px] text-amber-400/60 font-mono ml-auto">(~$28.00 USD)</span>
                </div>
              </div>

              {/* Safe disclosure */}
              <div className="p-3.5 bg-white/2 rounded-xl border border-white/5 text-[10px] text-gray-400 font-light space-y-1.5">
                <p className="font-semibold text-gray-300">🇦🇴 Apoio Directo ao Artista</p>
                <p className="leading-normal">
                  Todas as mensalidades são enviadas em tempo real para a carteira digital Express ou conta bancária vinculada do Agnelo Maiato, financiando directamente a produção de novos temas.
                </p>
              </div>
            </div>

            {/* Right side: Payment Gate form (7 cols) */}
            <div className="md:col-span-7 glass-panel border border-white/10 rounded-2xl p-6 bg-[#121214]/80">
              <h3 className="text-xs font-montserrat font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5 border-b border-white/5 pb-3 mb-5">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                Checkout Seguro & Vinculado
              </h3>

              <AnimatePresence mode="wait">
                {checkoutSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 space-y-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                      <Check className="w-7 h-7 text-emerald-400 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-white">Pagamento Confirmado!</h4>
                      <p className="text-xs text-gray-400 mt-1">Bem-vindo ao Club VIP, as tuas faixas exclusivas estão prontas.</p>
                    </div>
                    <p className="text-[11px] text-amber-400 font-mono">A redireccionar para o Dashboard VIP...</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubscribeSubmit} className="space-y-5">
                    
                    {/* Method Selector */}
                    <div>
                      <label className="text-[10px] font-semibold text-gray-400 font-montserrat uppercase tracking-wider block mb-2">Método de Envio</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('multicaixa_express')}
                          className={`py-2 px-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 justify-center transition-all ${
                            paymentMethod === 'multicaixa_express'
                              ? 'bg-amber-400/5 border-amber-400 text-amber-400'
                              : 'bg-black/35 border-white/5 text-gray-400 hover:border-white/15'
                          }`}
                        >
                          <Wallet className="w-3.5 h-3.5" />
                          <span className="truncate">MC Express</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('paypal')}
                          className={`py-2 px-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 justify-center transition-all ${
                            paymentMethod === 'paypal'
                              ? 'bg-amber-400/5 border-amber-400 text-amber-400'
                              : 'bg-black/35 border-white/5 text-gray-400 hover:border-white/15'
                          }`}
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>PayPal</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('bank_iban')}
                          className={`py-2 px-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 justify-center transition-all ${
                            paymentMethod === 'bank_iban'
                              ? 'bg-amber-400/5 border-amber-400 text-amber-400'
                              : 'bg-black/35 border-white/5 text-gray-400 hover:border-white/15'
                          }`}
                        >
                          <Radio className="w-3.5 h-3.5" />
                          <span>IBAN / Banco</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('credit_card')}
                          className={`py-2 px-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 justify-center transition-all ${
                            paymentMethod === 'credit_card'
                              ? 'bg-amber-400/5 border-amber-400 text-amber-400'
                              : 'bg-black/35 border-white/5 text-gray-400 hover:border-white/15'
                          }`}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Cartão</span>
                        </button>
                      </div>
                    </div>

                    {/* Conditional input fields */}
                    <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                      
                      {/* Multicaixa Express */}
                      {paymentMethod === 'multicaixa_express' && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-gray-300 font-montserrat uppercase tracking-wider">Telemóvel associado ao MC Express *</label>
                          <input
                            type="tel"
                            required
                            value={paymentPhone}
                            onChange={(e) => setPaymentPhone(e.target.value)}
                            placeholder="Ex: +244 923 000 000"
                            className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                          <p className="text-[9px] text-gray-500 font-light mt-1">
                            Será enviada uma notificação de pagamento para o seu Multicaixa Express para confirmar a transacção.
                          </p>
                        </div>
                      )}

                      {/* PayPal */}
                      {paymentMethod === 'paypal' && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-gray-300 font-montserrat uppercase tracking-wider">E-mail da sua conta PayPal *</label>
                          <input
                            type="email"
                            required
                            value={paymentEmail}
                            onChange={(e) => setPaymentEmail(e.target.value)}
                            placeholder="Ex: joao.santos@gmail.com"
                            className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      )}

                      {/* IBAN */}
                      {paymentMethod === 'bank_iban' && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-gray-300 font-montserrat uppercase tracking-wider">IBAN Bancário de Origem *</label>
                          <input
                            type="text"
                            required
                            value={paymentIban}
                            onChange={(e) => setPaymentIban(e.target.value)}
                            placeholder="Ex: AO06 0040 0000 1234 5678 9012 3"
                            className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                          />
                          <p className="text-[9px] text-gray-500 font-light mt-1">
                            Disponível para transferências imediatas interbancárias em Angola (BAI, BFA, BIC, BCI).
                          </p>
                        </div>
                      )}

                      {/* Credit Card */}
                      {paymentMethod === 'credit_card' && (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-gray-300 font-montserrat uppercase tracking-wider block">Nome do Titular *</label>
                            <input
                              type="text"
                              required
                              value={paymentCardHolder}
                              onChange={(e) => setPaymentCardHolder(e.target.value)}
                              className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-gray-300 font-montserrat uppercase tracking-wider block">Número do Cartão *</label>
                            <input
                              type="text"
                              required
                              maxLength={19}
                              value={paymentCardNum}
                              onChange={(e) => setPaymentCardNum(e.target.value)}
                              placeholder="4111 2222 3333 4444"
                              className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-gray-300 font-montserrat uppercase tracking-wider block">Validade *</label>
                              <input
                                type="text"
                                required
                                placeholder="MM/AA"
                                maxLength={5}
                                value={paymentCardExp}
                                onChange={(e) => setPaymentCardExp(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-xs text-white text-center focus:outline-none focus:border-amber-500 font-mono"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-gray-300 font-montserrat uppercase tracking-wider block">CVC *</label>
                              <input
                                type="password"
                                required
                                maxLength={3}
                                value={paymentCardCvc}
                                onChange={(e) => setPaymentCardCvc(e.target.value)}
                                placeholder="***"
                                className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-xs text-white text-center focus:outline-none focus:border-amber-500 font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                    {checkoutError && (
                      <p className="text-red-400 text-[11px] bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                        ⚠️ {checkoutError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={checkoutLoading}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-montserrat font-bold text-xs tracking-wider rounded-lg flex items-center justify-center gap-2 hover:scale-101 active:scale-99 transition-all cursor-pointer shadow-[0_5px_15px_rgba(212,175,55,0.15)]"
                    >
                      {checkoutLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>A PROCESSAR PAGAMENTO...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-black stroke-[3]" />
                          <span>ACTIVAR ACESSO VIP DE IMEDIATO</span>
                        </>
                      )}
                    </button>
                    
                    <div className="text-center">
                      <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        Transacção encriptada de ponta a ponta de forma segura.
                      </p>
                    </div>
                  </form>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Premium sponsor ad at the bottom of checkout page */}
          <div className="mt-12 border-t border-white/5 pt-4">
            <AdBanner position="horizontal" />
          </div>

        </div>
      </section>
    );
  }

  // ACTIVE VIP DASHBOARD
  return (
    <section id="vip-club" className="py-24 bg-[#070708] relative overflow-hidden border-t border-amber-500/10">
      {/* Glow Effects */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* VIP Header Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 glass-panel p-8 sm:p-12 mb-16 shadow-[0_0_50px_rgba(212,175,55,0.08)]">
          <div className="absolute top-4 right-4 animate-pulse">
            <Crown className="w-8 h-8 text-amber-400" />
          </div>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 mb-4">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-montserrat text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                Área Exclusiva de Fã VIP {subscriptionPlan ? `• Plano ${subscriptionPlan === 'yearly' ? 'Anual' : 'Mensal'}` : ''}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide">
              Bem-vindo de volta, <span className="gold-gradient-text text-glow-gold font-bold">{user.username}</span>!
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-4 leading-relaxed font-light">
              Esta é a tua área restrita de fã. Aqui tens acesso a gravações de bastidores, demos inéditas gravadas diretamente de estúdios em Luanda, e um canal direto de feedback com o Agnelo Maiato.
            </p>
          </div>
        </div>

        {/* Creator Control Panel Toggle */}
        <div className="mb-12 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/2">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            <div>
              <p className="text-xs font-montserrat font-bold uppercase tracking-wider text-white">Painel do Artista Agnelo Maiato</p>
              <p className="text-[10px] text-gray-400 leading-normal">
                {isAgneloEmail 
                  ? 'Autenticado como Agnelo (agneloheart@gmail.com). Painel de Músicas e Carteira de Receitas ativo.' 
                  : 'Modo de visualização e teste de Administração do Artista (Músicas e Finanças).'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsArtistMode(!isArtistMode)}
            className="px-3.5 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-400 hover:text-black hover:border-transparent transition-all text-[10px] font-montserrat font-bold uppercase tracking-wider cursor-pointer font-bold select-none whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            {isArtistMode ? 'Ocultar Ferramentas do Artista 🔒' : 'Ver Ferramentas do Artista 🔧'}
          </button>
        </div>

        {/* ARTIST EXCLUSIVE PANEL */}
        <AnimatePresence>
          {isArtistMode && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-[#121214] to-[#0A0A0B] p-6 sm:p-8 mb-16 shadow-[0_0_50px_rgba(212,175,55,0.05)]"
              id="artist-panel-card"
            >
              {/* Tab Selector */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex gap-4">
                  <button
                    onClick={() => setArtistPanelTab('music')}
                    className={`pb-2 text-xs font-montserrat font-bold uppercase tracking-widest transition-all relative ${
                      artistPanelTab === 'music' ? 'text-amber-400' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>🎵 Gestão de Músicas</span>
                    {artistPanelTab === 'music' && (
                      <motion.div layoutId="artistTabLine" className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-400" />
                    )}
                  </button>
                  <button
                    onClick={() => setArtistPanelTab('finance')}
                    className={`pb-2 text-xs font-montserrat font-bold uppercase tracking-widest transition-all relative ${
                      artistPanelTab === 'finance' ? 'text-amber-400' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>💼 Carteira de Receitas & Finanças</span>
                    {artistPanelTab === 'finance' && (
                      <motion.div layoutId="artistTabLine" className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-400" />
                    )}
                  </button>
                </div>
              </div>

              {artistPanelTab === 'music' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left pane: Add Track Form */}
                  <form onSubmit={handleAddSong} className="lg:col-span-5 space-y-4" id="add-track-form">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300 font-montserrat uppercase tracking-wider">Título da Música *</label>
                      <input
                        type="text"
                        required
                        value={newTrackTitle}
                        onChange={(e) => setNewTrackTitle(e.target.value)}
                        placeholder="Ex: Noite Fria em Luanda"
                        className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 focus:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 font-montserrat uppercase tracking-wider">Álbum</label>
                        <input
                          type="text"
                          value={newTrackAlbum}
                          onChange={(e) => setNewTrackAlbum(e.target.value)}
                          placeholder="Ex: Singles"
                          className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 font-montserrat uppercase tracking-wider">Duração</label>
                        <input
                          type="text"
                          value={newTrackDuration}
                          onChange={(e) => setNewTrackDuration(e.target.value)}
                          placeholder="Ex: 03:45"
                          className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300 font-montserrat uppercase tracking-wider text-amber-300">URL do Áudio (MP3)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTrackUrl}
                          onChange={(e) => setNewTrackUrl(e.target.value)}
                          placeholder="Vazio para link de teste aleatório"
                          className="flex-1 bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300 font-montserrat uppercase tracking-wider">Tipo de Playlist</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setNewTrackType('official')}
                          className={`py-2 px-3 text-xs rounded-lg font-bold border transition-all ${
                            newTrackType === 'official'
                              ? 'bg-amber-500/10 border-amber-500/60 text-amber-400'
                              : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/15'
                          }`}
                        >
                          🎵 Oficial (Principal)
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewTrackType('vip')}
                          className={`py-2 px-3 text-xs rounded-lg font-bold border transition-all ${
                            newTrackType === 'vip'
                              ? 'bg-amber-500/10 border-amber-500/60 text-amber-400'
                              : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/15'
                          }`}
                        >
                          👑 Demo Exclusiva (VIP)
                        </button>
                      </div>
                    </div>

                    {addSuccess && (
                      <div className="text-[11px] text-green-400 flex items-center gap-1 bg-green-500/10 p-2 rounded border border-green-500/20">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span>{addSuccess}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-montserrat font-bold text-xs tracking-wider rounded-lg hover:scale-102 transition-transform cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      CARREGAR NO SITE
                    </button>
                  </form>

                  {/* Right pane: Songs List Manager */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <h4 className="font-montserrat text-xs uppercase tracking-wider text-amber-400 font-bold mb-3 flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5" />
                        Músicas Oficiais no Site ({songsList.length})
                      </h4>
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {songsList.map((song) => (
                          <div key={song.id} className="flex items-center justify-between p-2 rounded-lg border border-white/5 bg-black/40 text-xs">
                            <div className="flex items-center gap-3">
                              <img src={song.coverUrl} alt="" className="w-7 h-7 rounded object-cover shrink-0" referrerPolicy="no-referrer" />
                              <div className="truncate max-w-[150px] sm:max-w-xs">
                                <p className="font-bold text-white truncate">{song.title}</p>
                                <p className="text-[9px] text-gray-500">{song.album} • {song.duration}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSong(song.id, 'official')}
                              className="text-red-400 hover:text-red-300 p-1 hover:bg-white/5 rounded transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-montserrat text-xs uppercase tracking-wider text-amber-400 font-bold mb-3 flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5" />
                        Demos VIP Inéditas no Site ({vipSongsList.length})
                      </h4>
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {vipSongsList.map((song) => (
                          <div key={song.id} className="flex items-center justify-between p-2 rounded-lg border border-white/5 bg-black/40 text-xs">
                            <div className="flex items-center gap-3">
                              <img src={song.coverUrl} alt="" className="w-7 h-7 rounded object-cover shrink-0" referrerPolicy="no-referrer" />
                              <div className="truncate max-w-[150px] sm:max-w-xs">
                                <p className="font-bold text-white truncate">{song.title}</p>
                                <p className="text-[9px] text-gray-500">{song.album} • {song.duration}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSong(song.id, 'vip')}
                              className="text-red-400 hover:text-red-300 p-1 hover:bg-white/5 rounded transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Finance Tab (Agnelo Wallet Manager) */
                <div className="space-y-8">
                  {wallet ? (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                      
                      {/* Box 1: Wallet Balance indicators (4 cols) */}
                      <div className="md:col-span-4 bg-black/50 border border-amber-500/10 p-5 rounded-2xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-montserrat font-bold uppercase tracking-wider mb-2">
                            <Wallet className="w-4 h-4 text-amber-500" />
                            <span>Saldo Líquido Acumulado</span>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-3xl font-bold font-serif text-white tracking-wide">
                              {wallet.balanceKz.toLocaleString()} <span className="text-xs font-sans text-amber-400">Kz</span>
                            </p>
                            <p className="text-sm font-semibold text-gray-400 font-mono">
                              ${wallet.balanceUsd.toFixed(2)} <span className="text-[10px] text-gray-500">USD</span>
                            </p>
                          </div>
                        </div>

                        <div className="mt-8">
                          <button
                            onClick={handleCashoutProceed}
                            disabled={isCashingOut || (wallet.balanceKz === 0 && wallet.balanceUsd === 0)}
                            className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-[11px] font-montserrat font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 text-black ${isCashingOut ? 'animate-spin' : ''}`} />
                            <span>Efectuar Levantamento</span>
                          </button>
                          <p className="text-[9px] text-gray-500 font-light mt-1.5 text-center">
                            Transfere os fundos do site para a carteira vinculada abaixo.
                          </p>
                        </div>
                      </div>

                      {/* Box 2: Revenue source breakdown stats (4 cols) */}
                      <div className="md:col-span-4 bg-[#121214]/60 border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-montserrat font-bold uppercase tracking-wider mb-1">
                            <TrendingUp className="w-4 h-4 text-amber-500" />
                            <span>Breakdown de Ganhos</span>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                              <span className="text-gray-400">Assinaturas VIP:</span>
                              <span className="font-bold text-white">{wallet.subscriptionEarningsKz.toLocaleString()} Kz</span>
                            </div>
                            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                              <span className="text-gray-400">Receitas de Anúncios:</span>
                              <span className="font-bold text-emerald-400 font-mono">${wallet.adEarningsUsd.toFixed(2)} USD</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-400">Interações de Ads:</span>
                              <span className="font-mono text-[10px] text-gray-300">
                                {wallet.adClicks} cliq. / {wallet.adImpressions} impr.
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                          <span className="text-gray-400 flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-amber-500" /> Subscritores Activos:
                          </span>
                          <span className="font-serif font-bold text-white text-base">{wallet.subscribersCount}</span>
                        </div>
                      </div>

                      {/* Box 3: Update linked digital wallet config (4 cols) */}
                      <form onSubmit={handleUpdateWalletConfig} className="md:col-span-4 bg-[#121214]/60 border border-white/5 p-5 rounded-2xl space-y-3.5">
                        <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-montserrat font-bold uppercase tracking-wider">
                          <Settings className="w-4 h-4 text-amber-500" />
                          <span>Vincular Carteira Digital</span>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <label className="text-[9px] text-gray-400 font-bold uppercase font-montserrat">Tipo de Carteira</label>
                            <select
                              value={walletFormType}
                              onChange={(e) => setWalletFormType(e.target.value)}
                              className="w-full bg-black border border-white/10 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-amber-500 mt-1"
                            >
                              <option value="multicaixa_express">Multicaixa Express (AO)</option>
                              <option value="paypal">PayPal (Internacional)</option>
                              <option value="bank_iban">Conta Bancária / IBAN</option>
                              <option value="crypto">Carteira de Cripto (USDT)</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[9px] text-gray-400 font-bold uppercase font-montserrat">Endereço / Telefone / IBAN</label>
                            <input
                              type="text"
                              required
                              value={walletFormAddress}
                              onChange={(e) => setWalletFormAddress(e.target.value)}
                              className="w-full bg-black border border-white/10 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-amber-500 mt-1"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] text-gray-400 font-bold uppercase font-montserrat">Beneficiário / Titular</label>
                            <input
                              type="text"
                              required
                              value={walletFormOwner}
                              onChange={(e) => setWalletFormOwner(e.target.value)}
                              className="w-full bg-black border border-white/10 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-amber-500 mt-1"
                            />
                          </div>
                        </div>

                        {walletMessage && (
                          <p className="text-[10px] text-center text-amber-400">{walletMessage}</p>
                        )}

                        <button
                          type="submit"
                          disabled={isSavingWallet}
                          className="w-full py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-amber-400 hover:text-black hover:border-transparent text-[10px] font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer"
                        >
                          {isSavingWallet ? 'A salvar...' : 'Salvar & Vincular'}
                        </button>
                      </form>

                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-xs text-gray-400">A carregar dados financeiros do servidor Express...</p>
                    </div>
                  )}

                  <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl flex items-start gap-2 text-xs text-amber-300 leading-relaxed font-light">
                    <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <p className="font-semibold mb-0.5">Como funcionam as receitas do site?</p>
                      <p>
                        Sempre que um novo fã completa a assinatura de fã VIP de forma recorrente (mensal ou anual), os Kwanzas e Dólares correspondentes são transferidos directamente para o saldo líquido da sua carteira digital. De igual modo, ao exibir patrocinadores em banners, cada clique que os fãs dão gera receitas em dólares reais de patrocínio que também alimentam a sua carteira!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3-Column Bento Grid: Gold Card, Demos, Chat Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* Card 1: Gold Fan Club Card (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between" id="vip-gold-card-panel">
            <div className="glass-panel border border-amber-500/20 rounded-2xl p-6 flex flex-col justify-between h-full bg-[#121214]/60">
              <div>
                <h3 className="font-montserrat text-xs uppercase tracking-wider text-amber-400/80 font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Cartão VIP Digital
                </h3>

                {/* Metallic Gold Card container */}
                <div className="relative aspect-[1.58/1] rounded-xl overflow-hidden p-5 border border-amber-400/30 bg-radial-gradient shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(212,175,55,0.1)] hover:border-amber-400/80 transition-all duration-500 group cursor-pointer" style={{ background: 'linear-gradient(135deg, #0d0d0e 0%, #1c180e 40%, #2f2510 100%)' }}>
                  {/* Sheen animation sweep */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" style={{ backgroundSize: '200% 100%' }} />

                  {/* Top line of card */}
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="font-serif text-xs font-bold tracking-[0.2em] text-white">AGNELO MAIATO</span>
                      <span className="font-montserrat text-[7px] uppercase tracking-[0.2em] text-amber-400 -mt-0.5 font-bold">FÃ CLUBE OFICIAL</span>
                    </div>
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>

                  {/* Golden Microchip mockup */}
                  <div className="w-7 h-5 rounded-md bg-gradient-to-br from-amber-500 to-amber-300 opacity-80 mt-4 border border-amber-600/40" />

                  {/* Card bottom details */}
                  <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="font-mono text-[7px] text-gray-500 uppercase tracking-widest">Membro Autêntico</span>
                      <span className="font-montserrat text-xs font-bold text-white uppercase tracking-wider mt-0.5">{user.username}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="font-mono text-[7px] text-amber-400/80 tracking-widest font-bold">VIP-0{user.username.length}82</span>
                      <span className="font-mono text-[6px] text-gray-500 tracking-wider">Membro desde 2026</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download / Perks panel */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-gray-300 font-light">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Acesso prioritário a ingressos</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-300 font-light">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Qualidade de som lossless Hi-Fi</span>
                </div>
                <button
                  onClick={() => alert('Download do Cartão VIP em alta resolução iniciado!')}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-amber-400 hover:text-black hover:border-transparent transition-all text-xs font-montserrat font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Baixar Cartão PDF
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Exclusive Unreleased Demos (8 Cols Total on bento layout or separate) */}
          <div className="lg:col-span-8 flex flex-col justify-between" id="vip-demos-panel">
            <div className="glass-panel border border-amber-500/20 rounded-2xl p-6 h-full flex flex-col justify-between bg-[#121214]/60">
              <div>
                <h3 className="font-montserrat text-xs uppercase tracking-wider text-amber-400/80 font-bold mb-4 flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  Gravações Inéditas & Demos de Estúdio
                </h3>
                <p className="text-xs text-gray-400 mb-6 font-light">
                  Escute rascunhos acústicos gravados com microfone condensador diretamente do Golden Studio em Luanda.
                </p>

                <div className="space-y-3">
                  {vipSongsList.map((song) => {
                    const isThisPlaying = playingTrackId === song.id;
                    return (
                      <div
                        key={song.id}
                        className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                          isThisPlaying
                            ? 'bg-amber-400/5 border-amber-400/40 shadow-[0_0_15px_rgba(212,175,55,0.05)]'
                            : 'bg-black/40 border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handlePlayVipTrack(song.id, song.url)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border cursor-pointer transition-all ${
                              isThisPlaying
                                ? 'bg-amber-400 border-transparent text-black scale-105'
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-400 hover:text-black hover:border-transparent'
                            }`}
                          >
                            {isThisPlaying ? (
                              <Pause className="w-4 h-4 fill-current" />
                            ) : (
                              <Play className="w-4 h-4 fill-current translate-x-0.5" />
                            )}
                          </button>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-semibold text-white">{song.title}</h4>
                              <span className="text-[8px] bg-amber-400/10 text-amber-400 border border-amber-400/30 px-1.5 py-0.2 rounded uppercase font-bold font-montserrat">
                                Inédito
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 font-mono mt-0.5">{song.album} ({song.year})</p>
                          </div>
                        </div>

                        <span className="font-mono text-xs text-amber-400 font-bold">{song.duration}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Safety banner */}
              <div className="mt-6 p-3 rounded-lg border border-amber-400/20 bg-amber-400/5 text-[10px] text-amber-300 font-light flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Estas gravações pertencem estritamente à Agnelo Maiato Produções e contêm marcas de água de áudio protegidas. Por favor, evite vazamentos.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Ad Placement Banner inside Dashboard */}
        <AdBanner position="horizontal" />

        {/* Exclusive activities space: Videos and Behind the Scenes photos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16" id="vip-activities-multimedia">
          
          {/* Subspace A: Rehearsal and Vlog Clips ("Vídeos de Atividades") */}
          <div className="glass-panel border border-amber-500/15 rounded-2xl p-6 bg-[#121214]/60">
            <h3 className="font-montserrat text-xs uppercase tracking-wider text-amber-400/80 font-bold mb-4 flex items-center gap-2">
              <Tv className="w-4 h-4" />
              Vídeos de Atividades & Ensaios (Bastidores)
            </h3>
            <p className="text-xs text-gray-400 mb-6 font-light">
              Assista a ensaios gerais com os instrumentistas e o dia a dia nos camarins da turnê.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vipVideos.map((video) => (
                <div key={video.id} className="group bg-black/40 rounded-xl overflow-hidden border border-white/5 hover:border-amber-500/20 transition-all flex flex-col">
                  <div className="relative aspect-video overflow-hidden bg-black shrink-0">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-all opacity-80"
                    />
                    {/* Floating play state mockup */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => alert(`A abrir o vídeo privado em HD: ${video.title}`)}
                        className="w-10 h-10 rounded-full bg-black/80 group-hover:bg-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-all cursor-pointer"
                      >
                        <Play className="w-4.5 h-4.5 text-amber-400 group-hover:text-black fill-current translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">{video.title}</h4>
                    <span className="font-mono text-[9px] text-gray-500 block mt-2">{video.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subspace B: Photos of activities / Rehearsals ("Fotos de Atividades") */}
          <div className="glass-panel border border-amber-500/15 rounded-2xl p-6 bg-[#121214]/60">
            <h3 className="font-montserrat text-xs uppercase tracking-wider text-amber-400/80 font-bold mb-4 flex items-center gap-2">
              <Image className="w-4 h-4" />
              Fotos de Encontros, Alinhamentos e Reuniões
            </h3>
            <p className="text-xs text-gray-400 mb-6 font-light">
              Registos íntimos que demonstram o processo de planeamento de faixas e ensaios técnicos de palco.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {vipPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => alert('Foto de bastidor exclusiva para visualização local.')}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-white/5 bg-black cursor-pointer"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all p-3 flex flex-col justify-end">
                    <h4 className="text-[10px] font-bold text-white">{photo.title}</h4>
                    <span className="text-[8px] text-amber-400 font-mono mt-0.5">{photo.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Interactive VIP Guestbook Chat Board */}
        <div className="glass-panel border border-amber-500/15 rounded-2xl p-6 sm:p-8 bg-[#121214]/40" id="vip-chat-board">
          
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <MessageSquare className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Canal de Chat VIP Oficial</h3>
              <p className="text-xs text-gray-400 font-light">Fala com a nossa comunidade e recebe feedback interativo do Agnelo!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Post Message Form (5 Cols) */}
            <div className="lg:col-span-5" id="chat-form-container">
              <form onSubmit={handlePostMessage} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300 block font-montserrat">
                    Partilha a tua opinião com o Artista
                  </label>
                  <textarea
                    rows={4}
                    value={newMessageText}
                    onChange={(e) => {
                      setNewMessageText(e.target.value);
                      if (errorText) setErrorText('');
                    }}
                    placeholder="Escreve uma mensagem simpática para o Agnelo..."
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all resize-none"
                    id="chat-textarea"
                  />
                  {errorText && (
                    <div className="text-[11px] text-red-400 flex items-center gap-1.5 mt-1 animate-pulse">
                      <span>⚠️ {errorText}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-600 to-amber-400 text-black font-montserrat font-bold text-xs tracking-wider rounded-lg hover:scale-102 transition-transform cursor-pointer shadow-[0_5px_15px_rgba(212,175,55,0.15)]"
                  id="chat-submit-btn"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'A ENVIAR...' : 'PUBLICAR NO MURAL VIP'}</span>
                </button>
              </form>
            </div>

            {/* Comments List (7 Cols) */}
            <div className="lg:col-span-7" id="chat-messages-container">
              <h4 className="font-montserrat text-xs uppercase tracking-wider text-amber-400 font-bold mb-4">
                Mural de Conversas VIP ({messages.length})
              </h4>

              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2" id="chat-messages-list">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-3 shadow-inner"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-montserrat text-xs font-bold text-white">{msg.userName}</span>
                          <span className="text-[8px] bg-amber-400/10 text-amber-400 border border-amber-400/20 px-1.5 py-0.2 rounded uppercase font-bold font-montserrat">
                            Membro VIP
                          </span>
                        </div>
                        <span className="font-mono text-[9px] text-gray-500">{msg.timestamp}</span>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed font-light">{msg.message}</p>

                      {/* Replied by Agnelo? */}
                      {msg.repliedByAgnelo && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-3 pt-3 border-t border-amber-500/10 bg-amber-500/5 rounded p-3 border-l-2 border-amber-400 space-y-1"
                        >
                          <div className="flex items-center gap-1.5">
                            <Crown className="w-3 h-3 text-amber-400" />
                            <span className="font-serif text-[10px] uppercase tracking-wider text-amber-300 font-bold">
                              Agnelo Maiato
                            </span>
                            <span className="text-[7px] bg-amber-500/25 text-white px-1 py-0.1 rounded uppercase font-bold">
                              Artista
                            </span>
                          </div>
                          <p className="text-xs text-amber-100 leading-relaxed font-light italic">
                            "{msg.repliedByAgnelo}"
                          </p>
                        </motion.div>
                      )}

                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
