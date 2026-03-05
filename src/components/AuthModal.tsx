import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-sage-400 hover:text-sage-600 hover:bg-sage-50 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              <h2 className="text-2xl font-bold text-sage-800 mb-2">
                {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
              </h2>
              <p className="text-sage-500 mb-6 text-sm">
                {isLogin 
                  ? 'Verilerinizi eşitlemek için giriş yapın.' 
                  : 'Cihazlar arası eşitleme için hesap oluşturun.'}
              </p>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-sage-700 mb-1">E-posta</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-sage-50 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all"
                      placeholder="ornek@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-sage-700 mb-1">Şifre</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-sage-50 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sage-600 hover:bg-sage-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-6"
                >
                  {loading ? (
                    <span className="animate-pulse">Bekleniyor...</span>
                  ) : isLogin ? (
                    <><LogIn size={18} /> Giriş Yap</>
                  ) : (
                    <><UserPlus size={18} /> Kayıt Ol</>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                  }}
                  className="text-sage-600 text-sm font-semibold hover:underline"
                >
                  {isLogin ? 'Hesabınız yok mu? Kayıt olun.' : 'Zaten hesabınız var mı? Giriş yapın.'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
