import React, { useState } from 'react';
import { Mail, Lock, User, X, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserType } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  
  // Validation state
  const [errors, setErrors] = useState<{ email?: string; password?: string; username?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const tempErrors: { email?: string; password?: string; username?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      tempErrors.email = 'O e-mail é obrigatório.';
    } else if (!emailRegex.test(email)) {
      tempErrors.email = 'Introduza um endereço de e-mail válido.';
    }

    if (!password) {
      tempErrors.password = 'A palavra-passe é obrigatória.';
    } else if (password.length < 6) {
      tempErrors.password = 'A palavra-passe deve ter pelo menos 6 caracteres.';
    }

    if (isRegistering && !username) {
      tempErrors.username = 'O nome de utilizador é obrigatório.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    // Simulate server validation / registration
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);

      setTimeout(() => {
        const finalUser: UserType = {
          username: isRegistering ? username : email.split('@')[0],
          email: email,
          isVIP: true,
        };
        onLoginSuccess(finalUser);
        setSuccess(false);
        // Clear forms
        setEmail('');
        setPassword('');
        setUsername('');
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          id="login-backdrop"
        />

        {/* Modal content container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-amber-500/20 glass-panel-heavy shadow-[0_0_50px_rgba(212,175,55,0.15)]"
          id="login-modal-box"
        >
          {/* Decorative Gold Glows inside the modal */}
          <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-amber-400 transition-colors p-1 rounded-full hover:bg-white/5"
            aria-label="Fechar"
            id="login-close-btn"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success screen overlay */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/95 text-center p-6"
                id="login-success-view"
              >
                <motion.div
                  initial={{ scale: 0.6, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/50 mb-4 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                >
                  <CheckCircle2 className="w-10 h-10 text-amber-400" />
                </motion.div>
                <h3 className="font-serif text-2xl font-bold text-white tracking-wide mb-2">
                  Acesso Autorizado!
                </h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  {isRegistering
                    ? 'O teu registo VIP foi efetuado com sucesso. Bem-vindo à experiência exclusiva!'
                    : 'A entrar na Área Exclusiva do Fã Clube de Agnelo Maiato...'}
                </p>
                <div className="mt-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-xs text-amber-500/80 font-mono tracking-widest uppercase">
                    Carregando Dashboard VIP
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/5 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold font-montserrat">
                  Fã Clube Oficial • VIP
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-white tracking-wider">
                {isRegistering ? 'Registo VIP' : 'Login de Fã'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {isRegistering
                  ? 'Cria a tua conta para usufruir de faixas inéditas e conteúdos de estúdio'
                  : 'Insere os teus dados para aceder à área exclusiva'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
              {isRegistering && (
                <div className="space-y-1.5" id="field-username-container">
                  <label className="text-xs font-medium text-gray-300 block font-montserrat">
                    Nome Completo / Utilizador
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ex: João Silva"
                      className={`w-full bg-[#161619] border rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none transition-all ${
                        errors.username
                          ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                          : 'border-white/10 focus:border-amber-500 focus:shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                      }`}
                      id="input-username"
                    />
                  </div>
                  {errors.username && (
                    <div className="flex items-center gap-1 text-[11px] text-red-400 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.username}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1.5" id="field-email-container">
                <label className="text-xs font-medium text-gray-300 block font-montserrat">
                  E-mail de Fã
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teuemail@exemplo.com"
                    className={`w-full bg-[#161619] border rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none transition-all ${
                      errors.email
                        ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                        : 'border-white/10 focus:border-amber-500 focus:shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                    }`}
                    id="input-email"
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-1 text-[11px] text-red-400 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5" id="field-password-container">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-gray-300 block font-montserrat">
                    Palavra-passe
                  </label>
                  {!isRegistering && (
                    <button
                      type="button"
                      className="text-[10px] text-amber-400/80 hover:text-amber-400 hover:underline"
                    >
                      Esqueceu?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className={`w-full bg-[#161619] border rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none transition-all ${
                      errors.password
                        ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                        : 'border-white/10 focus:border-amber-500 focus:shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                    }`}
                    id="input-password"
                  />
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1 text-[11px] text-red-400 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden group cursor-pointer mt-2"
                id="login-submit-btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-400 group-hover:scale-105 transition-transform duration-300" />
                <div className="relative py-3 flex items-center justify-center font-montserrat font-bold text-xs tracking-wider text-black">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>PROCESSANDO...</span>
                    </div>
                  ) : isRegistering ? (
                    'CRIAR CONTA VIP E ENTRAR'
                  ) : (
                    'ENTRAR NA ÁREA VIP'
                  )}
                </div>
              </button>
            </form>

            {/* Selector footer */}
            <div className="mt-6 text-center border-t border-white/5 pt-4">
              <p className="text-xs text-gray-400">
                {isRegistering ? 'Já fazes parte do fã clube?' : 'Ainda não és um Fã VIP de elite?'}
                <button
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setErrors({});
                  }}
                  className="ml-1.5 text-amber-400 hover:text-amber-300 font-bold hover:underline transition-colors focus:outline-none"
                  id="toggle-auth-mode-btn"
                >
                  {isRegistering ? 'Inicia Sessão' : 'Garante Acesso Grátis'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
