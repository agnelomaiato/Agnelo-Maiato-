import { motion } from 'motion/react';
import { ARTIST_INFO } from '../data';
import { Award, Music, Globe, Flame } from 'lucide-react';

export default function BioSection() {
  const quickFacts = [
    { icon: <Music className="w-4 h-4 text-amber-400" />, label: 'Gêneros', value: 'R&B, Rap, Trapsoul' },
    { icon: <Globe className="w-4 h-4 text-amber-400" />, label: 'Origem', value: 'Luanda, Angola' },
    { icon: <Award className="w-4 h-4 text-amber-400" />, label: 'Início', value: '2018 (Carreira Profissional)' },
    { icon: <Flame className="w-4 h-4 text-amber-400" />, label: 'Lançamentos', value: '1 Mixtape, e múltiplos singles' },
  ];

  return (
    <section id="bio" className="py-24 bg-[#0B0B0C] relative overflow-hidden border-t border-white/5">
      {/* Decorative background element */}
      <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Portrait with Luxury Frames */}
          <div className="lg:col-span-5 flex justify-center" id="bio-portrait-container">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-[360px] aspect-square"
            >
              {/* Outer gold decorative border offset */}
              <div className="absolute -inset-3 rounded-2xl border border-amber-500/20 pointer-events-none scale-102" />
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-2xl filter blur-sm" />
              
              {/* Main Image Frame */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-amber-500/30 shadow-[0_0_40px_rgba(212,175,55,0.15)] bg-zinc-900">
                <img
                  src={ARTIST_INFO.profileImage}
                  alt={ARTIST_INFO.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Little Floating Badge */}
              <div className="absolute -bottom-4 -right-4 bg-black/90 backdrop-blur-md border border-amber-500/30 rounded-xl px-4 py-2.5 shadow-2xl flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-montserrat text-[10px] uppercase tracking-widest text-white font-bold">
                  A Voz de Luanda
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Bio details */}
          <div className="lg:col-span-7 flex flex-col justify-center" id="bio-content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Gold subtitle */}
              <span className="font-montserrat text-xs tracking-[0.3em] text-amber-400 uppercase font-bold block mb-2">
                SOBRE O ARTISTA
              </span>
              
              {/* Main artist name heading */}
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide mb-6">
                {ARTIST_INFO.name}
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
                {ARTIST_INFO.description}
              </p>

              <blockquote className="border-l-2 border-amber-500/50 pl-4 py-1.5 my-6 bg-amber-500/5 rounded-r-lg">
                <p className="text-amber-300/90 italic text-xs sm:text-sm font-light">
                  "A música não é apenas som, é a vibração da nossa ancestralidade moldando o futuro com as cores do amor."
                </p>
                <cite className="text-[10px] text-gray-500 font-montserrat uppercase tracking-wider block mt-1">
                  — Agnelo Maiato
                </cite>
              </blockquote>

              {/* Quick Facts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
                {quickFacts.map((fact, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5 hover:border-amber-500/10 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                      {fact.icon}
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-montserrat">
                        {fact.label}
                      </span>
                      <span className="text-xs text-white font-medium">
                        {fact.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
