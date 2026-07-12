import React, { useState, useRef, useEffect } from 'react';
import { Crown, Play, Pause, Send, Calendar, Download, ShieldCheck, Sparkles, Tv, Image, MessageSquare, Flame, Plus, Trash2, Music, UploadCloud, Check, Settings, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, FanMessage, Song } from '../types';
import { VIP_SONGS, ACTIVITIES_MEDIA, INITIAL_FAN_MESSAGES, getSavedSongs, saveSongs, getSavedVipSongs, saveVipSongs } from '../data';

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

  // Artist mode state (Agnelo gets automatic access, others can toggle demo mode to test)
  const isAgneloEmail = user.email === 'agneloheart@gmail.com';
  const [isArtistMode, setIsArtistMode] = useState(isAgneloEmail);

  // Form states for adding a song
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

  const vipPhotos = ACTIVITIES_MEDIA.filter((item) => item.type === 'photo');
  const vipVideos = ACTIVITIES_MEDIA.filter((item) => item.type === 'video');

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
                Área Exclusiva de Fã VIP
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

        {/* Artist / Creator Control Panel Toggle */}
        <div className="mb-12 flex flex-wrap gap-4 items-center justify-between p-4 rounded-xl border border-white/5 bg-white/2">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            <div>
              <p className="text-xs font-montserrat font-bold uppercase tracking-wider text-white">Painel do Artista Agnelo Maiato</p>
              <p className="text-[10px] text-gray-400">
                {isAgneloEmail 
                  ? 'Autenticado como Agnelo (agneloheart@gmail.com). Acesso de Criador completo.' 
                  : 'Modo de visualização e teste do Painel de Carregamento de Músicas.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsArtistMode(!isArtistMode)}
            className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-400 hover:text-black hover:border-transparent transition-all text-[10px] font-montserrat font-bold uppercase tracking-wider cursor-pointer"
          >
            {isArtistMode ? 'Ocultar Painel de Música 🎵' : 'Mostrar Painel de Música 🎵'}
          </button>
        </div>

        <AnimatePresence>
          {isArtistMode && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-[#121214] to-[#0A0A0B] p-6 sm:p-8 mb-16 shadow-[0_0_50px_rgba(212,175,55,0.05)]"
              id="artist-panel-card"
            >
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <UploadCloud className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="font-serif text-xl font-bold text-white tracking-wide">Carregar & Gerir Músicas do Artista</h3>
                  <p className="text-xs text-gray-400">Adiciona novas faixas oficiais ou demos exclusivas diretamente no site.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left pane: Add Track Form (5 cols) */}
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
                        placeholder="Ex: Singles ou R&B Vibes"
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
                    <label className="text-xs font-semibold text-gray-300 font-montserrat uppercase tracking-wider">URL do Áudio (MP3)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTrackUrl}
                        onChange={(e) => setNewTrackUrl(e.target.value)}
                        placeholder="Deixe em branco para usar áudio de teste"
                        className="flex-1 bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const demoUrls = [
                            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
                            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
                            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
                          ];
                          setNewTrackUrl(demoUrls[Math.floor(Math.random() * demoUrls.length)]);
                        }}
                        className="px-2.5 py-1 text-[10px] rounded bg-white/5 hover:bg-white/10 text-amber-400 font-bold"
                      >
                        Demo Link
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 font-montserrat uppercase tracking-wider">URL da Capa da Música</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTrackCoverUrl}
                        onChange={(e) => setNewTrackCoverUrl(e.target.value)}
                        placeholder="Deixe em branco para capa aleatória"
                        className="flex-1 bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const demoCovers = [
                            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop'
                          ];
                          setNewTrackCoverUrl(demoCovers[Math.floor(Math.random() * demoCovers.length)]);
                        }}
                        className="px-2.5 py-1 text-[10px] rounded bg-white/5 hover:bg-white/10 text-amber-400 font-bold"
                      >
                        Demo Capa
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 font-montserrat uppercase tracking-wider block">Tipo de Playlist</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setNewTrackType('official')}
                        className={`py-2 px-3 text-xs rounded-lg font-bold border transition-all ${
                          newTrackType === 'official'
                            ? 'bg-amber-500/10 border-amber-500/60 text-amber-400'
                            : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/15'
                        }`}
                      >
                        🎵 Oficial (Reprodutor Principal)
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
                    CARREGAR MÚSICA NO SITE
                  </button>
                </form>

                {/* Right pane: Songs List Manager (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Official tracks list */}
                  <div>
                    <h4 className="font-montserrat text-xs uppercase tracking-wider text-amber-400 font-bold mb-3 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5" />
                      Músicas Oficiais no Site ({songsList.length})
                    </h4>
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {songsList.map((song) => (
                        <div key={song.id} className="flex items-center justify-between p-2.5 rounded-lg border border-white/5 bg-black/40 text-xs">
                          <div className="flex items-center gap-3">
                            <img src={song.coverUrl} alt="" className="w-8 h-8 rounded object-cover shrink-0" referrerPolicy="no-referrer" />
                            <div>
                              <p className="font-bold text-white">{song.title}</p>
                              <p className="text-[10px] text-gray-500">{song.album} • {song.duration}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSong(song.id, 'official')}
                            className="text-red-400 hover:text-red-300 p-1.5 hover:bg-white/5 rounded transition-all cursor-pointer"
                            title="Remover Música"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* VIP exclusive tracks list */}
                  <div>
                    <h4 className="font-montserrat text-xs uppercase tracking-wider text-amber-400 font-bold mb-3 flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5" />
                      Músicas VIP no Site ({vipSongsList.length})
                    </h4>
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {vipSongsList.map((song) => (
                        <div key={song.id} className="flex items-center justify-between p-2.5 rounded-lg border border-white/5 bg-black/40 text-xs">
                          <div className="flex items-center gap-3">
                            <img src={song.coverUrl} alt="" className="w-8 h-8 rounded object-cover shrink-0" referrerPolicy="no-referrer" />
                            <div>
                              <p className="font-bold text-white">{song.title}</p>
                              <p className="text-[10px] text-gray-500">{song.album} • {song.duration}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSong(song.id, 'vip')}
                            className="text-red-400 hover:text-red-300 p-1.5 hover:bg-white/5 rounded transition-all cursor-pointer"
                            title="Remover Música"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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
                  onClick={() => alert('Download do Cartão VIP iniciado com sucesso!')}
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
                        onClick={() => alert(`A abrir o vídeo privado: ${video.title}`)}
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
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-600 to-amber-400 text-black font-montserrat font-bold text-xs tracking-wider rounded-lg hover:scale-102 transition-transform cursor-pointer"
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
