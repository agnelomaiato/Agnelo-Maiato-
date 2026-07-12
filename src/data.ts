import { Song, VideoClip, ActivityMedia, ProfessionalPhoto, FanMessage } from './types';

// Let's reference the actual generated images as direct root-relative paths
const agneloHero = '/src/assets/images/agnelo_hero_1783789265459.jpg';
const agneloProfile = '/src/assets/images/agnelo_profile_1783789281876.jpg';
const albumCoverVip = '/src/assets/images/album_cover_vip_1783789295674.jpg';

export const ARTIST_INFO = {
  name: 'Agnelo Maiato',
  tagline: 'A Harmonia da Alma e do Ritmo Angolano',
  description: 'Agnelo Maiato é uma das vozes mais cativantes e promissoras da música contemporânea. Focando no R&B, Rap e Trapsoul, ele cria melodias que tocam o coração e ritmos que movem corpos. Com uma trajetória marcada pela sofisticação, Agnelo traduz sentimentos em poesia acústica.',
  heroImage: agneloHero,
  profileImage: agneloProfile,
  vipAlbumCover: albumCoverVip,
};

export const SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Ecos do Trapsoul',
    album: 'Sentimento & Poesia',
    duration: '03:45',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Functional real sound links
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop',
    year: '2024',
    plays: '142.5K'
  },
  {
    id: 'song-2',
    title: 'Brilho de Ouro',
    album: 'D\'Ouro (Singles)',
    duration: '04:12',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: albumCoverVip,
    year: '2025',
    plays: '389.2K'
  },
  {
    id: 'song-3',
    title: 'Caminho da Alma',
    album: 'Sentimento & Poesia',
    duration: '03:20',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop',
    year: '2024',
    plays: '89.7K'
  },
  {
    id: 'song-4',
    title: 'Ritmo e Sentimento',
    album: 'Evolução',
    duration: '03:58',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop',
    year: '2025',
    plays: '254.1K'
  }
];

export const VIP_SONGS: Song[] = [
  {
    id: 'vip-1',
    title: 'Lua Cheia de Luanda (VIP Exclusiva)',
    album: 'Unreleased Sessions',
    duration: '04:30',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    coverUrl: albumCoverVip,
    year: '2026',
    plays: 'Premium Only'
  },
  {
    id: 'vip-2',
    title: 'Teu Toque (Acústico R&B)',
    album: 'Live at Golden Studio',
    duration: '03:15',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=400&auto=format&fit=crop',
    year: '2026',
    plays: 'Premium Only'
  }
];

export const VIDEO_CLIPS: VideoClip[] = [
  {
    id: 'vid-1',
    title: 'Brilho de Ouro (Videoclipe Oficial)',
    description: 'Gravado na deslumbrante costa de Luanda, um hino ao amor e à resiliência com fotografia cinematográfica.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder/Example
    duration: '04:25',
  },
  {
    id: 'vid-2',
    title: 'Ecos do Trapsoul (Performance ao Vivo)',
    description: 'Concerto esgotado no Coliseu de Luanda. A energia pura do R&B, Rap e Trapsoul contemporâneos com arranjos modernos.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop',
    youtubeId: 'dQw4w9WgXcQ',
    duration: '03:55',
  }
];

export const PROFESSIONAL_PHOTOS: ProfessionalPhoto[] = [
  {
    id: 'photo-prof-1',
    title: 'Sessão Black Gold',
    category: 'Studio',
    url: agneloProfile,
  },
  {
    id: 'photo-prof-2',
    title: 'Concerto de Abertura da Turnê',
    category: 'Concert',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'photo-prof-3',
    title: 'Editorial de Luxo Luanda',
    category: 'Editorial',
    url: 'https://images.unsplash.com/photo-1488372759477-a7f4ae078ca6?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'photo-prof-4',
    title: 'Sessão Acústica Íntima',
    category: 'Studio',
    url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'photo-prof-5',
    title: 'Palco Iluminado',
    category: 'Concert',
    url: agneloHero,
  },
  {
    id: 'photo-prof-6',
    title: 'Retrato de Outono',
    category: 'Editorial',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
  }
];

export const ACTIVITIES_MEDIA: ActivityMedia[] = [
  {
    id: 'act-1',
    type: 'video',
    title: 'Nos Bastidores do Videoclipe Brilho de Ouro',
    description: 'Um olhar exclusivo sobre a produção, maquiagem, direção e os momentos engraçados durante a gravação na praia.',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-singer-performing-on-stage-with-neon-lights-34440-large.mp4', // Real static background-like videos
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
    date: '15 Mai 2025'
  },
  {
    id: 'act-2',
    type: 'photo',
    title: 'Ensaio Geral com a Banda',
    description: 'Preparação intensa para o espetáculo acústico nacional. Afinamento de metais e percussão tradicional angolana.',
    url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop',
    date: '10 Jun 2025'
  },
  {
    id: 'act-3',
    type: 'photo',
    title: 'Reunião de Alinhamento de Álbum',
    description: 'Planejando a ordem das faixas do novo álbum com a equipe de produção executiva no estúdio central.',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    date: '02 Jul 2025'
  },
  {
    id: 'act-4',
    type: 'video',
    title: 'Warm-up Vocal e Aquecimento',
    description: 'Minutos antes de subir ao palco para cantar para 15 mil pessoas. O foco e a técnica do artista.',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-man-singing-passionately-on-a-studio-microphone-40348-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
    date: '11 Jul 2025'
  }
];

export const INITIAL_FAN_MESSAGES: FanMessage[] = [
  {
    id: 'msg-1',
    userName: 'Carlos Silva',
    userEmail: 'carlos@vip.com',
    message: 'Agnelo! Teu novo som Brilho de Ouro está espetacular! Não canso de ouvir nas playlists de Luanda! Quando teremos show em Portugal?',
    timestamp: 'Hoje, 09:30',
    isVIP: true,
    repliedByAgnelo: 'Obrigado pelo carinho, Carlos! Portugal está na nossa rota para o final deste ano! Preparem-se!'
  },
  {
    id: 'msg-2',
    userName: 'Mariana Costa',
    userEmail: 'mariana@music.com',
    message: 'Que voz incrível! A faixa Lua Cheia de Luanda é de arrepiar, que bom que nos tornamos VIP para escutar esse som antes do mundo inteiro!',
    timestamp: 'Ontem, 18:15',
    isVIP: true,
    repliedByAgnelo: 'Fico imensamente feliz que tenha gostado da faixa exclusiva, Mariana! Foi gravada pensando em vocês, fãs dedicados!'
  },
  {
    id: 'msg-3',
    userName: 'Manuel K.',
    userEmail: 'manuel@rnb.ao',
    message: 'O R&B e Trapsoul moderno tem novo rei! Excelente trabalho, Agnelo!',
    timestamp: 'Há 2 dias',
    isVIP: true
  }
];

export function getSavedSongs(): Song[] {
  if (typeof window === 'undefined') return SONGS;
  const saved = localStorage.getItem('agnelo_songs_list');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return SONGS;
}

export function saveSongs(songs: Song[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('agnelo_songs_list', JSON.stringify(songs));
}

export function getSavedVipSongs(): Song[] {
  if (typeof window === 'undefined') return VIP_SONGS;
  const saved = localStorage.getItem('agnelo_vip_songs_list');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return VIP_SONGS;
}

export function saveVipSongs(songs: Song[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('agnelo_vip_songs_list', JSON.stringify(songs));
}

