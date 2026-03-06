import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, LogIn, UserPlus, Github, ArrowLeft, Phone, Facebook } from 'lucide-react';
import { auth, githubProvider, microsoftProvider, facebookProvider } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { getFirebaseErrorMessage } from '../lib/firebaseErrors';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isPhoneMode, setIsPhoneMode] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetState = () => {
    setIsLogin(true);
    setIsResetPassword(false);
    setIsPhoneMode(false);
    setEmail('');
    setPassword('');
    setPhoneNumber('');
    setVerificationCode('');
    setVerificationId(null);
    setError(null);
    setSuccessMsg(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleGithubLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, githubProvider);
      handleClose();
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, microsoftProvider);
      handleClose();
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, facebookProvider);
      handleClose();
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      // Format phone number to E.164 standard if needed, assuming user enters local format
      // For simplicity, we ask user to enter full number with country code
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setVerificationId(confirmationResult);
      setSuccessMsg('Doğrulama kodu gönderildi.');
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!verificationId) return;

    try {
      await verificationId.confirm(verificationCode);
      handleClose();
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Lütfen e-posta adresinizi girin.');
      return;
    }
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const actionCodeSettings = {
        url: window.location.origin,
        handleCodeInApp: false,
      };
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setSuccessMsg('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

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
      handleClose();
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
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
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-sage-400 hover:text-sage-600 hover:bg-sage-50 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              <div id="recaptcha-container"></div>
              {isResetPassword ? (
                <>
                  <button onClick={() => { setIsResetPassword(false); setError(null); setSuccessMsg(null); }} className="mb-4 text-sage-500 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-200 flex items-center gap-1 text-sm font-medium">
                    <ArrowLeft size={16} /> Geri
                  </button>
                  <h2 className="text-2xl font-bold text-sage-800 dark:text-sage-100 mb-2">Şifremi Unuttum</h2>
                  <p className="text-sage-500 dark:text-sage-400 mb-6 text-sm">
                    E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
                  </p>

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm mb-4">
                      {error}
                    </div>
                  )}
                  {successMsg && (
                    <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-xl text-sm mb-4">
                      {successMsg}
                    </div>
                  )}

                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-sage-700 dark:text-sage-300 mb-1">E-posta</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" size={18} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-sage-50 dark:bg-sage-50 border border-sage-200 dark:border-sage-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white"
                          placeholder="ornek@email.com"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-sage-600 hover:bg-sage-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-6"
                    >
                      {loading ? <span className="animate-pulse">Gönderiliyor...</span> : 'Bağlantı Gönder'}
                    </button>
                  </form>
                </>
              ) : isPhoneMode ? (
                <>
                  <button onClick={() => { setIsPhoneMode(false); setError(null); setSuccessMsg(null); }} className="mb-4 text-sage-500 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-200 flex items-center gap-1 text-sm font-medium">
                    <ArrowLeft size={16} /> Geri
                  </button>
                  <h2 className="text-2xl font-bold text-sage-800 dark:text-white mb-2">Telefon ile Giriş</h2>
                  <p className="text-sage-500 dark:text-neutral-400 mb-6 text-sm">
                    Telefon numaranızı girin, size doğrulama kodu gönderelim.
                  </p>

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm mb-4">
                      {error}
                    </div>
                  )}
                  {successMsg && (
                    <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-xl text-sm mb-4">
                      {successMsg}
                    </div>
                  )}

                  {!verificationId ? (
                    <form onSubmit={handleSendCode} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-sage-700 dark:text-neutral-300 mb-1">Telefon Numarası</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" size={18} />
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-3 bg-sage-50 dark:bg-neutral-800 border border-sage-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white"
                            placeholder="+90 555 123 45 67"
                          />
                        </div>
                        <p className="text-xs text-sage-400 mt-1">Lütfen ülke kodu ile birlikte giriniz (Örn: +90...)</p>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sage-600 hover:bg-sage-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-6"
                      >
                        {loading ? <span className="animate-pulse">Gönderiliyor...</span> : 'Kod Gönder'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyCode} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-sage-700 dark:text-neutral-300 mb-1">Doğrulama Kodu</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" size={18} />
                          <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-3 bg-sage-50 dark:bg-neutral-800 border border-sage-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white"
                            placeholder="123456"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sage-600 hover:bg-sage-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-6"
                      >
                        {loading ? <span className="animate-pulse">Doğrulanıyor...</span> : 'Doğrula ve Giriş Yap'}
                      </button>
                    </form>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-sage-800 dark:text-white mb-2">
                    {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                  </h2>
                  <p className="text-sage-500 dark:text-neutral-400 mb-6 text-sm">
                    {isLogin 
                      ? 'Verilerinizi eşitlemek için giriş yapın.' 
                      : 'Cihazlar arası eşitleme için hesap oluşturun.'}
                  </p>

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm mb-4">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-sage-700 dark:text-sage-300 mb-1">E-posta</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" size={18} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-sage-50 dark:bg-sage-50 border border-sage-200 dark:border-sage-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white"
                          placeholder="ornek@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-semibold text-sage-700 dark:text-sage-300">Şifre</label>
                        {isLogin && (
                          <button 
                            type="button"
                            onClick={() => { setIsResetPassword(true); setError(null); setSuccessMsg(null); }}
                            className="text-xs text-sage-500 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-200 font-medium"
                          >
                            Şifremi Unuttum
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" size={18} />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-sage-50 dark:bg-sage-50 border border-sage-200 dark:border-sage-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white"
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

                  <div className="mt-6 flex flex-col gap-3">
                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-sage-200 dark:border-sage-300"></div>
                      <span className="flex-shrink-0 mx-4 text-sage-400 text-sm">veya</span>
                      <div className="flex-grow border-t border-sage-200 dark:border-sage-300"></div>
                    </div>

                    <button
                      onClick={handleFacebookLogin}
                      disabled={loading}
                      className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Facebook size={18} /> Facebook ile Devam Et
                    </button>

                    <button
                      onClick={handleGithubLogin}
                      disabled={loading}
                      className="w-full bg-[#24292e] hover:bg-[#2f363d] text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Github size={18} /> GitHub ile Devam Et
                    </button>

                    <button
                      onClick={handleMicrosoftLogin}
                      disabled={loading}
                      className="w-full bg-white dark:bg-neutral-800 border border-sage-200 dark:border-neutral-700 hover:bg-sage-50 dark:hover:bg-neutral-700 text-sage-800 dark:text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 21 21">
                        <path fill="#f25022" d="M1 1h9v9H1z"/>
                        <path fill="#00a4ef" d="M1 11h9v9H1z"/>
                        <path fill="#7fba00" d="M11 1h9v9h-9z"/>
                        <path fill="#ffb900" d="M11 11h9v9h-9z"/>
                      </svg>
                      Microsoft ile Devam Et
                    </button>

                    <button
                      onClick={() => setIsPhoneMode(true)}
                      disabled={loading}
                      className="w-full bg-white dark:bg-neutral-800 border border-sage-200 dark:border-neutral-700 hover:bg-sage-50 dark:hover:bg-neutral-700 text-sage-800 dark:text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone size={18} /> Telefon ile Giriş Yap
                    </button>
                  </div>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError(null);
                      }}
                      className="text-sage-600 dark:text-sage-400 text-sm font-semibold hover:underline"
                    >
                      {isLogin ? 'Hesabınız yok mu? Kayıt olun.' : 'Zaten hesabınız var mı? Giriş yapın.'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
