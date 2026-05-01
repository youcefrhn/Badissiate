/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Flag, 
  Moon, 
  BookOpenText, 
  GraduationCap, 
  Sparkles, 
  Info, 
  ArrowRight,
  Search,
  X,
  Quote as QuoteIcon,
  Home,
  MessageSquareQuote,
  Heart,
  Share2,
  Trash2
} from 'lucide-react';
import { categories, Category, Quote } from './data';

const iconMap: Record<string, any> = {
  Moon,
  Flag,
  BookOpenText,
  GraduationCap,
  Sparkles
};

// Types for navigation
type Screen = 'splash' | 'home' | 'category' | 'about' | 'favorites';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSkip, setShowSkip] = useState(false);
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('badisiyat_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('LocalStorage error:', e);
      return [];
    }
  });

  const allQuotes = useMemo(() => categories.flatMap(c => c.quotes), []);
  
  useEffect(() => {
    try {
      localStorage.setItem('badisiyat_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const favoriteQuotes = useMemo(() => 
    allQuotes.filter(q => favorites.includes(q.id)),
  [favorites, allQuotes]);

  const filteredQuotes = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allQuotes.filter(q => 
      q.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.reference.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allQuotes]);

  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => setCurrentScreen('home'), 3000);
      const skipTimer = setTimeout(() => setShowSkip(true), 1500);
      return () => {
        clearTimeout(timer);
        clearTimeout(skipTimer);
      };
    }
  }, [currentScreen]);

  const goToCategory = (category: Category) => {
    setSelectedCategory(category);
    setCurrentScreen('category');
  };

  const goBack = () => {
    if (currentScreen === 'category') {
      setCurrentScreen('home');
    } else if (currentScreen === 'about') {
      setCurrentScreen('home');
    } else if (currentScreen === 'favorites') {
      setCurrentScreen('home');
    }
  };

  const shareQuote = async (quote: Quote) => {
    const shareData = {
      title: 'بَادِيسِيَّات',
      text: `"${quote.text}" - الإمام ابن باديس (${quote.reference})`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        alert('تم نسخ الحكمة إلى الحافظة');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const [randomQuoteId] = useState(() => {
    const ids = allQuotes.map(q => q.id);
    return ids[Math.floor(Math.random() * ids.length)];
  });

  return (
    <div className="min-h-screen max-w-md mx-auto bg-accent relative overflow-hidden flex flex-col font-sans">
      <AnimatePresence mode="wait">
        {currentScreen === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 geometric-pattern text-white text-center relative"
          >
            <div className="absolute inset-0 opacity-10 light-pattern pointer-events-none"></div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-28 h-28 bg-secondary rounded-full flex items-center justify-center mb-8 shadow-2xl border-4 border-white/20"
            >
              <h1 className="text-5xl text-primary font-serif font-bold">ب</h1>
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-5xl font-serif mb-3 tracking-wide"
            >
              بَادِيسِيَّات
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="w-20 h-1 bg-secondary mx-auto mb-6 rounded-full"
            ></motion.div>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-secondary font-serif text-lg leading-relaxed max-w-[280px] mb-8"
            >
              "لا يندقّ هذا القلم حتـى تندقّ أمامه جبال من الباطل"
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex flex-col items-center gap-4"
            >
              <p className="text-secondary/60 text-sm tracking-widest font-bold">بإشراف الأستاذ ربيع شملال</p>
              {showSkip && (
                <button 
                  onClick={() => setCurrentScreen('home')}
                  className="text-white/40 text-xs border border-white/10 px-4 py-1 rounded-full hover:bg-white/5 transition-colors"
                >
                  تخطي الشاشة
                </button>
              )}
            </motion.div>
          </motion.div>
        )}

        {currentScreen === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <div className="px-6 pt-12 pb-6 bg-white border-b border-black/5 sticky top-0 z-40">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-serif text-primary">بَادِيسِيَّات</h1>
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-0.5 bg-secondary"></div>
                    <p className="text-primary/60 text-[10px] font-bold">تراث الإمام عبد الحميد بن باديس</p>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentScreen('about')}
                  className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-secondary border border-black/5 active:scale-95"
                >
                  <Info size={20} />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative group">
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-primary/30 group-focus-within:text-secondary transition-colors">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="ابحث في أقوال الإمام..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-accent/50 border border-black/5 rounded-2xl py-3 pr-12 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all text-primary font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 left-4 flex items-center text-primary/30 hover:text-primary transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 px-6 pt-6 pb-24 overflow-y-auto no-scrollbar">
              {searchQuery.trim() ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-primary/40">نتائج البحث ({filteredQuotes.length})</h2>
                    <div className="h-px bg-primary/10 flex-1 mx-4"></div>
                  </div>
                  
                  {filteredQuotes.length > 0 ? (
                    <div className="space-y-6">
                      {filteredQuotes.map((quote, idx) => (
                        <div key={quote.id}>
                          <QuoteItem 
                            quote={quote} 
                            index={idx} 
                            onShare={shareQuote} 
                            isFavorite={favorites.includes(quote.id)}
                            onToggleFavorite={() => toggleFavorite(quote.id)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 opacity-40">
                      <Search size={48} className="mx-auto mb-4" />
                      <p className="font-bold">لم يتم العثور على نتائج لـ "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8">
                  <DailyInspiration 
                    isFavorite={favorites.includes(randomQuoteId)} 
                    onToggleFavorite={() => toggleFavorite(randomQuoteId)} 
                    onShare={() => shareQuote(allQuotes.find(q => q.id === randomQuoteId)!)} 
                  />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <h2 className="text-sm font-bold uppercase tracking-widest text-primary/40">محاور الفوائد</h2>
                      <div className="h-px bg-primary/10 flex-1 mx-4"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {categories.map((category) => {
                        const Icon = iconMap[category.icon] || Sparkles;
                        return (
                          <motion.div
                            key={category.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => goToCategory(category)}
                            className="bg-white p-5 rounded-2xl flex items-center gap-4 cursor-pointer shadow-sm border border-black/5"
                          >
                            <div className="w-14 h-14 bg-accent/50 rounded-2xl flex items-center justify-center text-secondary">
                              <Icon size={28} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-primary">{category.title}</h3>
                              <p className="text-[10px] text-primary/40 uppercase font-bold">{category.description}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-primary/20">
                              <ChevronLeft size={20} />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {currentScreen === 'category' && selectedCategory && (
          <motion.div
            key="category"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col pt-12"
          >
            <div className="px-6 flex items-center justify-between mb-8">
              <button 
                onClick={goBack}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm"
              >
                <ArrowRight size={20} />
              </button>
              <h2 className="text-2xl font-bold">{selectedCategory.title}</h2>
              <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="flex-1 px-6 overflow-y-auto no-scrollbar pb-24 space-y-6">
              {selectedCategory.quotes.map((quote, idx) => (
                <div key={quote.id}>
                  <QuoteItem 
                    quote={quote} 
                    index={idx} 
                    onShare={shareQuote} 
                    isFavorite={favorites.includes(quote.id)}
                    onToggleFavorite={() => toggleFavorite(quote.id)}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {currentScreen === 'favorites' && (
          <FavoritesScreen 
            quotes={favoriteQuotes} 
            onToggleFavorite={toggleFavorite} 
            onShare={shareQuote} 
          />
        )}

        {currentScreen === 'about' && (
          <motion.div
            key="about"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex-1 p-8 overflow-y-auto"
          >
             <button 
                onClick={goBack}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm mb-8"
              >
                <ArrowRight size={20} />
              </button>
            
            <h2 className="text-2xl font-serif mb-6 text-primary border-b-2 border-secondary pb-2 inline-block">عن التطبيق</h2>
            
            <div className="space-y-6 text-primary/80 leading-relaxed text-lg">
              <p>
                هذا التطبيق مقتبس من ملف <strong>'بَادِيسِيَّات'</strong> للأستاذ الشيخ ربيع شملال، الذي جمع فيه زبدة الأقوال المأثورة والفوائد المنتقاة من آثار الإمام ابن باديس رحمه الله.
              </p>
              <p>
                يهدف التطبيق إلى تعزيز الهوية الجزائرية وترسيخ قيم ومبادئ الإمام في نفوس الشباب بأسلوب عصري وسهل الوصول.
              </p>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm italic text-center text-primary/70 border-r-4 border-secondary">
                "لا يندقّ هذا القلم حتـى تندقّ أمامه جبال من الباطل"
                <br />
                <span className="not-italic font-bold block mt-2 text-primary">— عبد الحميد بن باديس</span>
              </div>
              
              <div className="pt-8 text-center text-sm text-primary/40">
                تصميم وتطوير تعزيز الهوية الجزائرية
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar */}
      {currentScreen !== 'splash' && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 bg-white/80 backdrop-blur-md border-t border-black/5 flex items-center justify-around px-8 z-50">
          <button 
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center gap-1 ${currentScreen === 'home' ? 'text-primary' : 'text-primary/30'}`}
          >
            <Home size={24} />
            <span className="text-[10px] font-bold">الرئيسية</span>
          </button>
          
          <button 
            onClick={() => setCurrentScreen('favorites')}
            className={`flex flex-col items-center gap-1 ${currentScreen === 'favorites' ? 'text-primary' : 'text-primary/30'}`}
          >
            <Heart size={24} fill={currentScreen === 'favorites' ? 'currentColor' : 'none'} />
            <span className="text-[10px] font-bold">المفضلة</span>
          </button>

          <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center -mt-10 shadow-lg border-4 border-accent active:scale-95 transition-transform cursor-pointer overflow-hidden group">
             <QuoteIcon size={24} className="group-hover:scale-110 transition-transform" />
          </div>
          <button 
            onClick={() => setCurrentScreen('about')}
            className={`flex flex-col items-center gap-1 ${currentScreen === 'about' ? 'text-primary' : 'text-primary/30'}`}
          >
            <Info size={24} />
            <span className="text-[10px] font-bold">حول</span>
          </button>
        </div>
      )}
    </div>
  );
}

function FavoritesScreen({ quotes, onToggleFavorite, onShare }: { quotes: Quote[], onToggleFavorite: (id: number) => void, onShare: (quote: Quote) => void }) {
  return (
    <motion.div
      key="favorites"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex-1 flex flex-col pt-12"
    >
      <div className="px-6 mb-8 text-center">
        <h2 className="text-3xl font-serif text-primary">المفضلة</h2>
        <div className="w-12 h-1 bg-secondary mx-auto mt-2 rounded-full"></div>
      </div>

      <div className="flex-1 px-6 overflow-y-auto no-scrollbar pb-24 space-y-6">
        {quotes.length > 0 ? (
          quotes.map((quote, idx) => (
            <div key={quote.id}>
              <QuoteItem 
                quote={quote} 
                index={idx} 
                onShare={onShare} 
                isFavorite={true}
                onToggleFavorite={() => onToggleFavorite(quote.id)}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-primary/40 space-y-4">
            <Heart size={64} className="opacity-20" />
            <p className="font-bold">لا توجد حكم مفضلة بعد</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function DailyInspiration({ isFavorite, onToggleFavorite, onShare }: { isFavorite: boolean, onToggleFavorite: () => void, onShare: () => void }) {
  const allQuotes = categories.flatMap(c => c.quotes);
  const [randomQuote] = useState(() => allQuotes[Math.floor(Math.random() * allQuotes.length)]);

  return (
    <div className="geometric-pattern p-7 rounded-[2rem] text-white shadow-xl relative overflow-hidden border border-white/10 group">
      <div className="absolute inset-0 opacity-10 light-pattern pointer-events-none"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">فائدة مختارة</span>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={onShare} className="text-secondary hover:text-white transition-colors">
               <Share2 size={18} />
             </button>
             <button onClick={onToggleFavorite} className="text-secondary hover:text-white transition-colors">
               <Heart size={18} fill={isFavorite ? '#d4af37' : 'none'} className={isFavorite ? 'text-secondary' : ''} />
             </button>
          </div>
        </div>
        <p className="text-2xl font-serif mb-6 leading-relaxed italic pr-2 border-r-2 border-secondary/30">
          "{randomQuote.text}"
        </p>
        <div className="flex items-center justify-between opacity-50">
          <span className="text-[9px] font-mono tracking-wider">{randomQuote.reference}</span>
          <QuoteIcon size={14} />
        </div>
      </div>
    </div>
  );
}

function QuoteItem({ quote, index, onShare, isFavorite, onToggleFavorite }: { quote: Quote; index: number; onShare: (quote: Quote) => void; isFavorite?: boolean; onToggleFavorite?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 relative group hover:shadow-md transition-shadow"
    >
      <div className="absolute top-6 right-6 text-secondary/10 group-hover:text-secondary/20 transition-colors">
        <QuoteIcon size={48} />
      </div>
      <div className="relative z-10">
        <p className="text-2xl leading-relaxed text-primary mb-6 arabic-quote font-serif">
          {quote.text}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
              <span className="text-[10px] font-bold text-primary/40 uppercase tracking-wider">{quote.reference}</span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => onShare(quote)}
                className="p-2 hover:bg-accent rounded-full text-secondary transition-colors active:scale-90"
                title="مشاركة"
              >
                <Share2 size={16} />
              </button>
              {onToggleFavorite && (
                <button 
                  onClick={onToggleFavorite}
                  className="p-2 hover:bg-accent rounded-full text-secondary transition-colors active:scale-90"
                  title="تفضيل"
                >
                  <Heart size={16} fill={isFavorite ? '#d4af37' : 'none'} />
                </button>
              )}
            </div>
          </div>
          <div className="bg-accent px-3 py-1 rounded-full text-[9px] font-bold text-secondary uppercase tracking-widest border border-secondary/10">
            ابن باديس
          </div>
        </div>
      </div>
    </motion.div>
  );
}

