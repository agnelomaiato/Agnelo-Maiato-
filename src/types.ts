export interface Song {
  id: string;
  title: string;
  album: string;
  duration: string;
  url: string; // fallback/mock streaming link
  coverUrl: string;
  year: string;
  plays: string;
}

export interface VideoClip {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  youtubeId: string; // or simulated video URL
  duration: string;
}

export interface ActivityMedia {
  id: string;
  type: 'photo' | 'video';
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string; // used if it's a video
  date: string;
}

export interface ProfessionalPhoto {
  id: string;
  title: string;
  category: 'Studio' | 'Concert' | 'Editorial';
  url: string;
}

export interface FanMessage {
  id: string;
  userName: string;
  userEmail: string;
  message: string;
  timestamp: string;
  isVIP: boolean;
  repliedByAgnelo?: string; // Optional simulated response from Agnelo!
}

export interface User {
  username: string;
  email: string;
  isVIP: boolean;
}
