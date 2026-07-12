import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, RotateCcw, Shuffle, Disc, Clock, Headphones, Lock, Crown } from 'lucide-react';
import { motion } from 'motion/react';
import { getSavedSongs, getSavedVipSongs } from '../data';
import { Song } from '../types';

export default function AudioPlayerSection() {
  const [playlistType, setPlaylistType] = useState<'official' | 'vip'>('official');
  const [songsList, setSongsList] = useState<Song[]>(getSavedSongs);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isVipUser, setIsVipUser] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSong = songsList[currentSongIndex] || songsList[0] || {
    id: 'placeholder',
    title: 'Nenhuma faixa',
    album: 'Nenhum álbum',
    duration: '00:00',
    url: '',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop',
    year: '2026',
    plays: '0'
  };

  const checkVipUser = () => {
    const saved = localStorage.getItem('agnelo_vip_user');
    setIsVipUser(!!saved);
  };

  const handleSongsUpdated = () => {
    const updatedList = playlistType === 'official' ? getSavedSongs() : getSavedVipSongs();
    setSongsList(updatedList);
    // Ensure we don't overflow index
    setCurrentSongIndex((prev) => {
      if (prev >= updatedList.length) {
        return 0;
      }
      return prev;
    });
  };

  // Sync VIP status and dynamic list updates
  useEffect(() => {
    checkVipUser();

    const handleLoginUpdate = () => {
      checkVipUser();
    };

    window.addEventListener('vipUserUpdated', handleLoginUpdate);
    window.addEventListener('songsUpdated', handleSongsUpdated);
    
    return () => {
      window.removeEventListener('vipUserUpdated', handleLoginUpdate);
      window.removeEventListener('songsUpdated', handleSongsUpdated);
    };
  }, [playlistType]);

  // Sync song list when changing tab
  useEffect(() => {
    handleSongsUpdated();
    setIsPlaying(false);
    setCurrentSongIndex(0);
  }, [playlistType]);

  // Initialize and handle track source changes
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log('Audio playback error:', err));
      }
    }
  }, [currentSongIndex, songsList]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.log('Audio playback error:', err));
      setIsPlaying(true);
    }
  };

  // Update Progress Time
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Loaded metadata
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Skip tracks
  const handleNext = () => {
    if (isShuffled) {
      const randomIndex = Math.floor(Math.random() * songsList.length);
      setCurrentSongIndex(randomIndex);
    } else {
      setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songsList.length);
    }
  };

  const handlePrev = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songsList.length) % songsList.length);
  };

  // Handle Track Completion
  const handleTrackEnded = () => {
    if (isLooping) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => console.log(err));
      }
    } else {
      handleNext();
    }
  };

  // Scrubbing
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Volume control
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Format seconds to MM:SS
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <section id="music" className="py-24 bg-[#09090A] relative border-t border-white/5">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      {/* Hidden Audio Tag */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleTrackEnded}
        id="html5-audio-element"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="font-montserrat text-xs tracking-[0.3em] text-amber-400 uppercase font-bold block mb-2">
            DISCOGRAFIA E REPRODUTOR
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide">
            Sons de <span className="gold-gradient-text text-glow-gold">Agnelo Maiato</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-3 max-w-lg mx-auto">
            Explora os grandes sucessos que misturam ritmos angolanos e sentimentos puros. Seleciona qualquer faixa para ouvir.
          </p>
        </div>

        {/* Player Dual Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left / Top Pane: Tracks List (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4" id="audio-playlist-pane">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <h3 className="font-montserrat text-xs uppercase tracking-wider text-amber-400/80 font-bold flex items-center gap-2">
                <Headphones className="w-4 h-4" />
                {playlistType === 'official' ? 'Lista de Faixas Oficiais' : 'Demos & Gravações Exclusivas'}
              </h3>
              
              {/* Premium Playlist Tab Switcher */}
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 self-start sm:self-auto">
                <button
                  onClick={() => setPlaylistType('official')}
                  className={`px-3 py-1.5 rounded-lg font-montserrat text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    playlistType === 'official'
                      ? 'bg-amber-400 text-black shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Oficiais 🎵
                </button>
                <button
                  onClick={() => setPlaylistType('vip')}
                  className={`px-3 py-1.5 rounded-lg font-montserrat text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                    playlistType === 'vip'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-400 text-black shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Crown className="w-3 h-3" />
                  VIP Exclusivos 👑
                </button>
              </div>
            </div>

            <div className="relative flex-1 min-h-[350px] flex flex-col" id="playlist-container-wrapper">
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-2 flex-1" id="playlist-container">
                {songsList.map((song, index) => {
                  const isSelected = index === currentSongIndex;
                  return (
                    <div
                      key={song.id}
                      onClick={() => {
                        if (playlistType === 'vip' && !isVipUser) return;
                        setCurrentSongIndex(index);
                        setIsPlaying(true);
                      }}
                      className={`group flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/5 border-amber-500/40 shadow-[0_0_15px_rgba(212,175,55,0.05)]'
                          : 'bg-[#121214] border-white/5 hover:border-amber-500/20 hover:bg-[#161619]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Song Cover Thumbnail */}
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/5">
                          <img
                            src={song.coverUrl}
                            alt={song.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          {isSelected && isPlaying && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="flex items-end gap-0.5 h-5 w-6 justify-center">
                                <span className="w-0.5 bg-amber-400 rounded-sm eq-bar-1" />
                                <span className="w-0.5 bg-amber-400 rounded-sm eq-bar-2" />
                                <span className="w-0.5 bg-amber-400 rounded-sm eq-bar-3" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Song Details */}
                        <div>
                          <h4 className={`text-sm font-semibold transition-colors ${isSelected ? 'text-amber-400' : 'text-white group-hover:text-amber-300'}`}>
                            {song.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5 font-light">
                            {song.album} • {song.year}
                          </p>
                        </div>
                      </div>

                      {/* Right side: plays & duration */}
                      <div className="flex items-center gap-6">
                        <span className="hidden sm:inline font-mono text-[11px] text-gray-500">
                          {song.plays} visualizações
                        </span>
                        <span className="flex items-center gap-1.5 font-mono text-xs text-gray-400">
                          <Clock className="w-3.5 h-3.5 text-gray-500" />
                          {song.duration}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {playlistType === 'vip' && !isVipUser && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-center p-6 border border-amber-500/20 z-20">
                  <Lock className="w-10 h-10 text-amber-400 mb-3 animate-pulse" />
                  <h4 className="font-serif text-lg font-bold text-white tracking-wide">
                    Conteúdo Exclusivo VIP
                  </h4>
                  <p className="text-xs text-gray-400 mt-2 max-w-sm leading-relaxed">
                    Estas faixas são demos inéditas e gravações exclusivas de estúdio do Agnelo Maiato, reservadas apenas a membros VIP.
                  </p>
                  <button
                    onClick={() => {
                      const element = document.getElementById('vip-club-section');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="mt-5 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-montserrat font-bold text-xs uppercase tracking-wider rounded-lg hover:scale-105 transition-all cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                  >
                    Aceder à Área VIP 👑
                  </button>
                </div>
              )}
            </div>

            {/* Quick Note */}
            <div className="text-[10px] text-gray-500 font-light italic mt-2 bg-[#121214] p-3 rounded-lg border border-white/5">
              💡 Para acessar faixas adicionais exclusivas de estúdio e demos inéditas, conecte-se ao nosso fã-clube VIP no topo da página.
            </div>
          </div>

          {/* Right / Bottom Pane: Sophisticated Vinyl Player Deck (5 cols) */}
          <div className="lg:col-span-5 flex" id="audio-vinyl-deck">
            <div className="w-full glass-panel border border-amber-500/20 rounded-2xl p-6 flex flex-col justify-between shadow-[0_0_35px_rgba(212,175,55,0.08)] relative overflow-hidden">
              <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-amber-500/5 blur-2xl" />

              {/* Title & Equalizer Icon */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="font-montserrat text-[10px] uppercase tracking-widest text-amber-400 font-bold">
                  Deck de Reprodução
                </span>
                <div className={`flex items-end gap-1 h-5 ${isPlaying ? 'opacity-100' : 'opacity-30'}`}>
                  <span className={`w-1 bg-amber-400 rounded-sm h-1.5 ${isPlaying ? 'eq-bar-2' : ''}`} style={{ height: '6px' }} />
                  <span className={`w-1 bg-amber-400 rounded-sm h-3.5 ${isPlaying ? 'eq-bar-4' : ''}`} style={{ height: '14px' }} />
                  <span className={`w-1 bg-amber-400 rounded-sm h-2.5 ${isPlaying ? 'eq-bar-1' : ''}`} style={{ height: '10px' }} />
                  <span className={`w-1 bg-amber-400 rounded-sm h-4.5 ${isPlaying ? 'eq-bar-5' : ''}`} style={{ height: '18px' }} />
                </div>
              </div>

              {/* Vinyl / Cover Art Container */}
              <div className="flex flex-col items-center justify-center my-8">
                <div className="relative w-44 h-44 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.1)] flex items-center justify-center shrink-0">
                  {/* Outer Vinyl ring */}
                  <div className="absolute inset-0 rounded-full bg-radial-gradient border-4 border-zinc-800 animate-spin" style={{ background: 'radial-gradient(circle, #0F0F10 40%, #1a1a1d 75%, #050506 100%)', animationDuration: '8s', animationPlayState: isPlaying ? 'running' : 'paused' }} />
                  
                  {/* Music Cover inside Center */}
                  <div className="absolute w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-[#1E1E1F] animate-spin" style={{ animationDuration: '8s', animationPlayState: isPlaying ? 'running' : 'paused' }}>
                    <img
                      src={currentSong.coverUrl}
                      alt={currentSong.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Vinyl center pinhole */}
                  <div className="absolute w-3 h-3 rounded-full bg-black border border-amber-500/40 z-10" />
                </div>

                <div className="text-center mt-6">
                  <h4 className="font-serif text-lg font-bold text-white tracking-wide">
                    {currentSong.title}
                  </h4>
                  <p className="text-xs text-amber-400/80 uppercase tracking-wider font-montserrat mt-1">
                    {currentSong.album}
                  </p>
                </div>
              </div>

              {/* Controls Section */}
              <div className="space-y-4">
                
                {/* Seeker */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleProgressChange}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
                    id="audio-seek-slider"
                  />
                </div>

                {/* Main Player buttons */}
                <div className="flex items-center justify-between">
                  {/* Shuffle Toggle */}
                  <button
                    onClick={() => setIsShuffled(!isShuffled)}
                    className={`p-2 rounded-lg transition-colors focus:outline-none ${isShuffled ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'}`}
                    title="Misturar faixas"
                    id="shuffle-toggle"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-4">
                    {/* Prev */}
                    <button
                      onClick={handlePrev}
                      className="p-2 rounded-lg text-gray-300 hover:text-amber-400 transition-colors focus:outline-none cursor-pointer"
                      title="Anterior"
                      id="prev-track-btn"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>

                    {/* Play / Pause circular container */}
                    <button
                      onClick={togglePlay}
                      className="w-12 h-12 rounded-full gold-gradient-bg flex items-center justify-center shadow-lg cursor-pointer transform active:scale-95 transition-transform focus:outline-none"
                      title={isPlaying ? 'Pausar' : 'Ouvir'}
                      id="play-pause-btn"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-black fill-black" />
                      ) : (
                        <Play className="w-5 h-5 text-black fill-black translate-x-0.5" />
                      )}
                    </button>

                    {/* Next */}
                    <button
                      onClick={handleNext}
                      className="p-2 rounded-lg text-gray-300 hover:text-amber-400 transition-colors focus:outline-none cursor-pointer"
                      title="Próxima"
                      id="next-track-btn"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Loop Toggle */}
                  <button
                    onClick={() => setIsLooping(!isLooping)}
                    className={`p-2 rounded-lg transition-colors focus:outline-none ${isLooping ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'}`}
                    title="Repetir faixa"
                    id="loop-toggle"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Volume bar */}
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <button
                    onClick={toggleMute}
                    className="text-gray-400 hover:text-amber-400 focus:outline-none"
                    id="mute-toggle"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-red-400" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
                    id="volume-slider"
                  />
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
