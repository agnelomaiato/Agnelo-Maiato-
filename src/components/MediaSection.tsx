import { useState } from 'react';
import { Camera, Video, Play, X, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PROFESSIONAL_PHOTOS, VIDEO_CLIPS } from '../data';
import { ProfessionalPhoto, VideoClip } from '../types';

export default function MediaSection() {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  
  // Lightbox & Video popup state
  const [selectedPhoto, setSelectedPhoto] = useState<ProfessionalPhoto | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoClip | null>(null);

  const categories = ['Todos', 'Studio', 'Concert', 'Editorial'];

  const filteredPhotos = activeCategory === 'Todos'
    ? PROFESSIONAL_PHOTOS
    : PROFESSIONAL_PHOTOS.filter(p => p.category === activeCategory);

  return (
    <section id="gallery" className="py-24 bg-[#0B0B0C] relative border-t border-white/5">
      {/* Background Accent */}
      <div className="absolute bottom-12 left-0 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header with Switch Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          <div>
            <span className="font-montserrat text-xs tracking-[0.3em] text-amber-400 uppercase font-bold block mb-2">
              GALERIA MULTIMÍDIA
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide">
              Trabalhos de Estúdio
            </h2>
          </div>

          {/* Luxury Tab Switcher */}
          <div className="flex bg-[#121214] p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-montserrat text-xs font-bold uppercase tracking-wider transition-all focus:outline-none cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-400 text-black shadow-lg shadow-amber-500/10'
                  : 'text-gray-400 hover:text-white'
              }`}
              id="tab-btn-photos"
            >
              <Camera className="w-4 h-4" />
              Fotos Profissionais
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-montserrat text-xs font-bold uppercase tracking-wider transition-all focus:outline-none cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-400 text-black shadow-lg shadow-amber-500/10'
                  : 'text-gray-400 hover:text-white'
              }`}
              id="tab-btn-videos"
            >
              <Video className="w-4 h-4" />
              Vídeo Clipes
            </button>
          </div>
        </div>

        {/* Tab 1: Fotos Profissionais */}
        {activeTab === 'photos' && (
          <div id="photos-tab-view">
            {/* Category Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-10" id="category-filter-bar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full font-montserrat text-[10px] uppercase font-bold tracking-widest border transition-all cursor-pointer focus:outline-none ${
                    activeCategory === cat
                      ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                      : 'border-white/5 bg-[#121214] text-gray-400 hover:border-white/10 hover:text-white'
                  }`}
                >
                  {cat === 'Todos' ? 'Todos' : cat === 'Studio' ? 'Estúdio' : cat === 'Concert' ? 'Concertos' : 'Editoriais'}
                </button>
              ))}
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="photos-grid">
              {filteredPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-white/5 bg-[#121214] cursor-pointer"
                >
                  {/* Photo content */}
                  <img
                    src={photo.url}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />

                  {/* Dark hover dimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5" />

                  {/* Eye Zoom Hover indicator */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 border border-amber-500/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Eye className="w-4 h-4 text-amber-400" />
                  </div>

                  {/* Bottom Text in Hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <span className="font-montserrat text-[9px] uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {photo.category === 'Studio' ? 'Estúdio' : photo.category === 'Concert' ? 'Concerto' : 'Editorial'}
                    </span>
                    <h3 className="font-serif text-base font-bold text-white mt-2 tracking-wide">
                      {photo.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Vídeo Clipes Oficiais */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in" id="videos-tab-view">
            {VIDEO_CLIPS.map((video) => (
              <div
                key={video.id}
                className="group relative bg-[#121214] rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/20 transition-all flex flex-col"
              >
                {/* Video thumbnail and Play button */}
                <div
                  onClick={() => setSelectedVideo(video)}
                  className="relative aspect-video overflow-hidden cursor-pointer bg-black"
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  
                  {/* Floating duration badge */}
                  <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-0.5 rounded font-mono text-[10px] text-gray-400 border border-white/10">
                    {video.duration}
                  </div>

                  {/* Centered Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-black/70 group-hover:bg-amber-400 border border-amber-500/30 group-hover:border-transparent flex items-center justify-center group-hover:scale-110 shadow-2xl transition-all duration-300">
                      <Play className="w-6 h-6 text-amber-400 group-hover:text-black fill-current translate-x-0.5 transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Video description */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white tracking-wide group-hover:text-amber-300 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed font-light">
                      {video.description}
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-amber-400/80 font-montserrat font-bold uppercase tracking-wider">
                    <span>Agnelo Maiato Produções</span>
                    <span>HD 1080P</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Photo Overlay */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8"
              onClick={() => setSelectedPhoto(null)}
              id="lightbox-container"
            >
              <button
                className="absolute top-4 right-4 text-white hover:text-amber-400 cursor-pointer p-1.5 rounded-full hover:bg-white/5 transition-colors"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Fechar galeria"
              >
                <X className="w-6 h-6" />
              </button>

              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ type: 'spring', duration: 0.4 }}
                className="relative max-w-4xl w-full max-h-[80vh] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  referrerPolicy="no-referrer"
                  className="rounded-lg object-contain max-h-[70vh] max-w-full border border-white/10"
                />
                <div className="text-center mt-4 space-y-1">
                  <h4 className="font-serif text-lg font-bold text-white">{selectedPhoto.title}</h4>
                  <p className="text-xs text-amber-400 uppercase tracking-widest font-montserrat">
                    Categoria: {selectedPhoto.category === 'Studio' ? 'Estúdio' : selectedPhoto.category === 'Concert' ? 'Concerto' : 'Editorial'}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cinematic Video Player Overlay */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8"
              onClick={() => setSelectedVideo(null)}
              id="video-player-container"
            >
              <button
                className="absolute top-4 right-4 text-white hover:text-amber-400 cursor-pointer p-1.5 rounded-full hover:bg-white/5 transition-colors"
                onClick={() => setSelectedVideo(null)}
                aria-label="Fechar vídeo"
              >
                <X className="w-6 h-6" />
              </button>

              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ type: 'spring', duration: 0.4 }}
                className="relative aspect-video max-w-4xl w-full rounded-xl overflow-hidden border border-amber-500/30 shadow-[0_0_50px_rgba(212,175,55,0.2)] bg-black"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Embedded HTML5 mock video player or responsive static visual stream */}
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&mute=1`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
