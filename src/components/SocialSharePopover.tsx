import React, { useState, useRef, useEffect } from 'react';
import { Share2, Link2, Check, MessageSquare, Facebook, Twitter, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SocialSharePopoverProps {
  itemId: string;
  itemTitle: string;
  itemType: 'track' | 'photo' | 'video';
  itemSubtitle?: string;
  align?: 'left' | 'right' | 'top';
  size?: 'sm' | 'md' | 'icon-only';
}

export default function SocialSharePopover({
  itemId,
  itemTitle,
  itemType,
  itemSubtitle = "Agnelo Maiato",
  align = 'right',
  size = 'md'
}: SocialSharePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Construct sharing parameters
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://agnelomaiato.com';
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const shareUrl = `${origin}${path}?${itemType}=${encodeURIComponent(itemId)}`;
  
  const shareText = `Ouve "${itemTitle}" de ${itemSubtitle} - Agnelo Maiato Oficial 🎵🇦🇴`;
  
  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleShareClick = (e: React.MouseEvent, platformUrl: string) => {
    e.stopPropagation();
    setIsOpen(false);
    window.open(platformUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      {/* Trigger Button */}
      {size === 'icon-only' ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`p-2 rounded-lg border transition-all cursor-pointer focus:outline-none flex items-center justify-center ${
            isOpen 
              ? 'bg-amber-400 border-amber-400 text-black shadow-[0_0_12px_rgba(212,175,55,0.3)]' 
              : 'bg-black/35 border-white/5 hover:border-amber-500/20 text-gray-400 hover:text-amber-400'
          }`}
          title="Partilhar"
        >
          <Share2 className="w-4 h-4" />
        </button>
      ) : size === 'sm' ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer focus:outline-none ${
            isOpen 
              ? 'bg-amber-400 border-transparent text-black' 
              : 'bg-black/50 border-white/5 hover:border-amber-500/20 text-gray-400 hover:text-white'
          }`}
        >
          <Share2 className="w-3 h-3" />
          <span>Partilhar</span>
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-montserrat font-bold uppercase tracking-widest transition-all cursor-pointer focus:outline-none ${
            isOpen 
              ? 'bg-gradient-to-r from-amber-500 to-amber-400 border-transparent text-black shadow-[0_0_20px_rgba(212,175,55,0.25)]' 
              : 'bg-[#121214] border-white/5 hover:border-amber-500/30 text-gray-300 hover:text-white'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Partilhar</span>
        </button>
      )}

      {/* Popover Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: align === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: align === 'top' ? 10 : -10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className={`absolute z-50 mt-2 w-56 rounded-xl border border-white/5 bg-[#121214]/98 p-3 shadow-[0_15px_35px_rgba(0,0,0,0.85)] backdrop-blur-xl ${
              align === 'right' ? 'right-0 origin-top-right' : 
              align === 'top' ? 'bottom-full mb-3 right-0 origin-bottom-right' : 'left-0 origin-top-left'
            }`}
          >
            <div className="mb-2.5 px-2 pb-1.5 border-b border-white/5">
              <p className="text-[10px] font-montserrat font-bold uppercase tracking-wider text-amber-400">Partilhar {itemType === 'track' ? 'Música' : itemType === 'photo' ? 'Foto' : 'Vídeo'}</p>
              <p className="text-xs font-medium text-white truncate max-w-[200px]" title={itemTitle}>{itemTitle}</p>
            </div>

            <div className="space-y-1">
              {/* WhatsApp */}
              <button
                onClick={(e) => handleShareClick(e, shareLinks.whatsapp)}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-[#25D366]/10 hover:text-[#25D366] transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-[#25D366]/10 flex items-center justify-center">
                    <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                  </div>
                  <span>WhatsApp</span>
                </div>
                <span className="text-[9px] font-mono opacity-50 font-bold uppercase">Popular</span>
              </button>

              {/* Facebook */}
              <button
                onClick={(e) => handleShareClick(e, shareLinks.facebook)}
                className="w-full flex items-center px-2.5 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-[#1877F2]/10 hover:text-[#1877F2] transition-colors cursor-pointer text-left"
              >
                <div className="w-6 h-6 rounded-md bg-[#1877F2]/10 flex items-center justify-center mr-2.5">
                  <Facebook className="w-3.5 h-3.5 text-[#1877F2] fill-[#1877F2]" />
                </div>
                <span>Facebook</span>
              </button>

              {/* Twitter / X */}
              <button
                onClick={(e) => handleShareClick(e, shareLinks.twitter)}
                className="w-full flex items-center px-2.5 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer text-left"
              >
                <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center mr-2.5">
                  <Twitter className="w-3.5 h-3.5 text-white fill-white" />
                </div>
                <span>Twitter / X</span>
              </button>

              {/* Telegram */}
              <button
                onClick={(e) => handleShareClick(e, shareLinks.telegram)}
                className="w-full flex items-center px-2.5 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-[#0088cc]/10 hover:text-[#0088cc] transition-colors cursor-pointer text-left"
              >
                <div className="w-6 h-6 rounded-md bg-[#0088cc]/10 flex items-center justify-center mr-2.5">
                  <Send className="w-3.5 h-3.5 text-[#0088cc]" />
                </div>
                <span>Telegram</span>
              </button>

              {/* Divider */}
              <div className="h-px bg-white/5 my-1.5" />

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
                  copied 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : 'bg-amber-400/5 hover:bg-amber-400/10 text-amber-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 animate-bounce" /> : <Link2 className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
