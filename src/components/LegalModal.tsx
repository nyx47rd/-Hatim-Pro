import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

export function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  if (!isOpen) return null;

  const title = type === 'privacy' ? 'Gizlilik Politikası' : 'Kullanım Koşulları';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-sage-100 dark:border-neutral-800">
            <h2 className="text-xl font-bold text-sage-800 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-sage-500 hover:bg-sage-100 dark:text-neutral-400 dark:hover:bg-neutral-800 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto prose dark:prose-invert max-w-none text-sm text-sage-700 dark:text-neutral-300">
            {type === 'privacy' ? (
              <>
                <h3 className="text-lg font-bold text-sage-900 dark:text-white mb-2">1. Veri Toplama</h3>
                <p className="mb-4">Hatim Pro, kullanıcı deneyimini geliştirmek amacıyla ad, e-posta adresi ve profil fotoğrafı gibi temel profil bilgilerinizi toplar. Ayrıca, uygulama içindeki hatim ve zikir ilerlemeleriniz bulut sunucularımızda (Firebase) güvenle saklanır.</p>
                
                <h3 className="text-lg font-bold text-sage-900 dark:text-white mb-2">2. Veri Kullanımı</h3>
                <p className="mb-4">Toplanan veriler yalnızca size hizmet sunmak, ilerlemenizi cihazlar arasında senkronize etmek ve arkadaşlarınızla ortak zikir odaları oluşturabilmeniz için kullanılır. Verileriniz kesinlikle üçüncü taraf reklam şirketleriyle paylaşılmaz.</p>
                
                <h3 className="text-lg font-bold text-sage-900 dark:text-white mb-2">3. Veri Güvenliği</h3>
                <p className="mb-4">Kullanıcı verileri, endüstri standardı şifreleme yöntemleriyle korunmaktadır. Şifreleriniz hash'lenerek saklanır ve tarafımızca görülemez. Google, Apple veya Microsoft gibi üçüncü taraf giriş yöntemleri kullanıldığında, bu platformların güvenlik standartları geçerlidir.</p>
                
                <h3 className="text-lg font-bold text-sage-900 dark:text-white mb-2">4. Hesap Silme</h3>
                <p className="mb-4">Kullanıcılar diledikleri zaman "Ayarlar" menüsünden hesaplarını ve tüm ilişkili verilerini kalıcı olarak silebilirler. Bu işlem geri alınamaz.</p>
                
                <h3 className="text-lg font-bold text-sage-900 dark:text-white mb-2">5. İletişim</h3>
                <p className="mb-4">Gizlilik politikamızla ilgili sorularınız için destek@hatimpro.com adresinden bizimle iletişime geçebilirsiniz.</p>
                <p className="text-xs mt-8 text-sage-500">Son Güncelleme: 7 Mart 2026</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-sage-900 dark:text-white mb-2">1. Hizmetin Kullanımı</h3>
                <p className="mb-4">Hatim Pro uygulamasını kullanarak bu koşulları kabul etmiş sayılırsınız. Uygulama, kişisel ibadet takibi ve sosyal zikir odaları oluşturma amacıyla sunulmaktadır.</p>
                
                <h3 className="text-lg font-bold text-sage-900 dark:text-white mb-2">2. Kullanıcı Sorumlulukları</h3>
                <p className="mb-4">Kullanıcılar, hesaplarının güvenliğinden kendileri sorumludur. Ortak zikir odalarında diğer kullanıcılara saygılı davranılması esastır. Rahatsız edici veya uygunsuz davranışlarda bulunan hesaplar askıya alınabilir.</p>
                
                <h3 className="text-lg font-bold text-sage-900 dark:text-white mb-2">3. Hizmet Kesintileri</h3>
                <p className="mb-4">Hatim Pro, hizmetin kesintisiz çalışması için çaba gösterir ancak teknik arızalar, bakım çalışmaları veya mücbir sebeplerden dolayı oluşabilecek veri kayıpları veya kesintilerden sorumlu tutulamaz.</p>
                
                <h3 className="text-lg font-bold text-sage-900 dark:text-white mb-2">4. Fikri Mülkiyet</h3>
                <p className="mb-4">Uygulamanın tasarımı, kodları ve içerikleri Hatim Pro'ya aittir. İzinsiz kopyalanamaz veya çoğaltılamaz.</p>
                
                <h3 className="text-lg font-bold text-sage-900 dark:text-white mb-2">5. Değişiklikler</h3>
                <p className="mb-4">Hatim Pro, bu kullanım koşullarını dilediği zaman değiştirme hakkını saklı tutar. Önemli değişiklikler kullanıcılara bildirilecektir.</p>
                <p className="text-xs mt-8 text-sage-500">Son Güncelleme: 7 Mart 2026</p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
