import React, { useState, useEffect } from 'react';
import documentsData from './data/documents.json';
import { 
  Search, 
  Sun, 
  Moon,
  Flame,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

export default function App() {
  // Navigation & Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Q&A Filter, Bookmark & Reveal States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [revealedAnswers, setRevealedAnswers] = useState({});

  // LocalStorage Persisted Bookmarks
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('prep_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('prep_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmarks:', e);
    }
  }, [bookmarks]);

  const toggleAnswer = (key) => {
    setRevealedAnswers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleBookmark = (e, qnaItem) => {
    e.stopPropagation(); // prevent triggering answer reveal when clicking bookmark
    const exists = bookmarks.some(bId => bId === qnaItem.id);
    if (exists) {
      setBookmarks(bookmarks.filter(bId => bId !== qnaItem.id));
    } else {
      setBookmarks([...bookmarks, qnaItem.id]);
    }
  };

  // Helper to render bold text, key labels, and bullet dots on list items cleanly
  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      const trimmed = line.trim();
      
      // Check if line is a bullet item (starts with -, *, •, or 1., 2., etc.)
      const isBulletItem = /^(?:[-*•]|\d+\.)\s+/.test(trimmed);
      const cleanLine = isBulletItem ? trimmed.replace(/^(?:[-*•]|\d+\.)\s+/, '') : line;

      const parts = cleanLine.split(/(\*\*.*?\*\*|^[A-Za-z0-9\s,–-]+:|\d+\.\s+[A-Za-z0-9\s,–-]+:)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (!part) return null;
        if (typeof part === 'string' && part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-bold border-b border-rose-500/50 text-rose-600 dark:text-rose-400 pb-0.5">{part.slice(2, -2)}</strong>;
        }
        if (/^(?:[A-Za-z0-9\s,–-]+:|\d+\.\s+[A-Za-z0-9\s,–-]+:)$/.test(part)) {
          return <strong key={pIdx} className="font-semibold block mt-2 text-xs uppercase tracking-widest text-rose-600 dark:text-rose-400">{part}</strong>;
        }
        return <span key={pIdx}>{part}</span>;
      });

      if (isBulletItem) {
        return (
          <div key={lIdx} className="flex items-start space-x-2 pl-3 my-1">
            <span className="select-none font-bold text-sm leading-relaxed shrink-0 text-amber-500">•</span>
            <div className="flex-1">{renderedLine}</div>
          </div>
        );
      }

      return (
        <div key={lIdx} className="min-h-[1.25rem]">
          {renderedLine}
        </div>
      );
    });
  };

  // Helper to shuffle array (Fisher-Yates)
  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Flatten all Q&A and Document Sections into a single unified view
  const [allQna, setAllQna] = useState(() => {
    const raw = documentsData.flatMap(doc => 
      doc.sections.flatMap(sec => 
        sec.qna.map((q, idx) => ({
          id: `${doc.id}-${sec.title}-${idx}`,
          docTitle: doc.title,
          category: doc.category,
          question: q.question,
          answer: q.answer
        }))
      )
    );
    return shuffleArray(raw);
  });

  const categories = ['All', ...new Set(documentsData.map(d => d.category))];

  const filteredQna = allQna.filter(item => {
    let matchesCat = true;
    if (categoryFilter === 'Saved') {
      matchesCat = bookmarks.includes(item.id);
    } else if (categoryFilter !== 'All') {
      matchesCat = item.category === categoryFilter;
    }

    const matchesSearch = !searchQuery || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 font-["Plus_Jakarta_Sans",sans-serif] flex flex-col relative overflow-x-hidden ${
      isDarkMode 
        ? 'bg-[#0f090d] text-neutral-100' 
        : 'bg-[#fff5f7] text-neutral-900'
    }`}>

      {/* Sunset Rose & Amber Gold Ambient Glow Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-25 transition-all duration-700 ${
          isDarkMode ? 'bg-rose-600' : 'bg-rose-400'
        }`} />
        <div className={`absolute top-1/3 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-700 ${
          isDarkMode ? 'bg-amber-600' : 'bg-amber-300'
        }`} />
        <div className={`absolute -bottom-40 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-700 ${
          isDarkMode ? 'bg-pink-600' : 'bg-rose-300'
        }`} />
      </div>

      {/* Sunset Rose & Gold Header Nav */}
      <header className="sticky top-0 z-30 transition-all duration-300 px-4 sm:px-6 py-3.5">
        <div className={`max-w-7xl mx-auto rounded-2xl px-5 py-3 flex items-center justify-between transition-all ${
          isDarkMode ? 'glass-panel-dark' : 'glass-panel-light'
        }`}>
          
          {/* Logo / Title H1 for SEO */}
          <h1 className="flex items-center space-x-3 font-sans">
            <div className="p-2 rounded-xl border border-rose-400/30 bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 text-white shadow-lg shadow-rose-500/25">
              <Flame size={22} className="fill-amber-300/30 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5 font-extrabold text-base sm:text-lg tracking-tight uppercase leading-none">
                <span className={isDarkMode ? 'text-white' : 'text-neutral-900'}>Interview</span>
                <span className="bg-gradient-to-r from-amber-400 via-pink-400 to-rose-500 bg-clip-text text-transparent drop-shadow-sm">Prep</span>
              </div>
              <span className="text-[9px] font-semibold tracking-widest uppercase text-rose-600 dark:text-rose-400 pt-0.5">
                by khurshidalom
              </span>
            </div>
          </h1>

          {/* Right Header Actions: Saved Counter & Dark Mode Toggle Button */}
          <div className="flex items-center space-x-2 sm:space-x-3 font-sans">
            <button
              onClick={() => setCategoryFilter(categoryFilter === 'Saved' ? 'All' : 'Saved')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all border ${
                categoryFilter === 'Saved'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white border-transparent shadow-md shadow-rose-500/25'
                  : (isDarkMode 
                      ? 'border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300' 
                      : 'border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-700')
              }`}
              title="View Bookmarked Questions"
            >
              <Bookmark size={14} className={bookmarks.length > 0 ? 'fill-current' : ''} />
              <span>Saved ({bookmarks.length})</span>
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle Dark Mode"
              className={`p-2.5 rounded-xl transition-all border ${
                isDarkMode 
                  ? 'border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400' 
                  : 'border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600'
              }`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

        </div>
      </header>

      {/* Main Combined Page View */}
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 font-sans space-y-6 z-10">
        
        {/* Search & Category Filter Header Bar */}
        <div className={`p-4 sm:p-5 rounded-2xl transition-all flex flex-col md:flex-row gap-4 justify-between items-center ${
          isDarkMode ? 'glass-panel-dark' : 'glass-panel-light'
        }`}>
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-3 opacity-50 text-rose-500" />
            <input
              id="search-input"
              aria-label="Search questions and concepts"
              type="text"
              placeholder="Search concepts & questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 text-sm bg-transparent border rounded-xl focus:outline-none transition-all ${
                isDarkMode 
                  ? 'border-rose-500/20 focus:border-rose-500/50 bg-black/20 text-white placeholder-neutral-400' 
                  : 'border-rose-500/30 focus:border-rose-500/60 bg-white/40 text-black placeholder-neutral-500'
              }`}
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setCategoryFilter(cat);
                  if (cat === 'All') {
                    setAllQna(shuffleArray(allQna));
                  }
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap font-medium flex items-center space-x-1 ${
                  categoryFilter === cat 
                    ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold shadow-md shadow-rose-500/25' 
                    : (isDarkMode ? 'bg-rose-500/10 hover:bg-rose-500/20 text-neutral-300' : 'bg-rose-500/5 hover:bg-rose-500/10 text-neutral-700')
                }`}
              >
                {cat === 'Saved' && <Bookmark size={12} className="fill-current" />}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sunset Rose & Gold Cards Stream */}
        <div className="space-y-4">
          {filteredQna.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border ${
              isDarkMode ? 'glass-card-dark text-neutral-400' : 'glass-card-light text-neutral-600'
            }`}>
              <Bookmark size={36} className="mx-auto mb-3 opacity-40 text-rose-500" />
              <p className="text-sm font-medium">
                {categoryFilter === 'Saved' 
                  ? 'No bookmarked questions yet. Click the bookmark icon on any card to save it for quick revision!' 
                  : 'No questions match your search query.'}
              </p>
            </div>
          ) : (
            filteredQna.map((qnaItem) => {
              const isRevealed = revealedAnswers[qnaItem.id];
              const isBookmarked = bookmarks.includes(qnaItem.id);

              return (
                <div 
                  key={qnaItem.id}
                  onClick={() => toggleAnswer(qnaItem.id)}
                  className={`p-5 sm:p-6 rounded-2xl transition-all duration-300 cursor-pointer ${
                    isDarkMode 
                      ? 'glass-card-dark hover:border-rose-500/40 hover:shadow-lg hover:shadow-rose-500/10' 
                      : 'glass-card-light hover:border-rose-500/40 hover:shadow-md hover:shadow-rose-500/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-rose-600 dark:text-rose-400 opacity-90 block mb-1">
                        {qnaItem.category} • {qnaItem.docTitle}
                      </span>
                      <h3 className="font-semibold text-base sm:text-lg leading-snug">
                        {qnaItem.question}
                      </h3>
                    </div>

                    {/* Bookmark Toggle Button */}
                    <button
                      onClick={(e) => toggleBookmark(e, qnaItem)}
                      className={`p-2 rounded-xl transition-all border shrink-0 ${
                        isBookmarked 
                          ? 'border-rose-500/50 bg-rose-500/20 text-rose-500' 
                          : 'border-transparent opacity-40 hover:opacity-100 hover:bg-rose-500/10 text-neutral-400 hover:text-rose-500'
                      }`}
                      title={isBookmarked ? 'Remove Bookmark' : 'Save Question'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck size={18} className="text-rose-500 fill-rose-500/20" />
                      ) : (
                        <Bookmark size={18} />
                      )}
                    </button>
                  </div>

                  {isRevealed && (
                    <div className={`mt-4 pt-4 border-t text-sm leading-relaxed transition-all ${
                      isDarkMode ? 'border-rose-500/20 text-neutral-200' : 'border-rose-500/20 text-neutral-800'
                    }`}>
                      {renderFormattedText(qnaItem.answer)}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </main>

      {/* Sunset Rose & Gold Footer */}
      <footer className={`border-t py-6 mt-12 text-xs font-sans z-10 transition-all ${
        isDarkMode ? 'border-rose-500/20 text-neutral-400' : 'border-rose-500/20 text-neutral-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 uppercase tracking-wide">
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-gradient-to-r from-rose-500 to-amber-500 text-white">
              PREP
            </span>
            <span className="text-[10px] text-rose-600 dark:text-white font-semibold">BY KHURSHID</span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-300">
            Copyright © <a href="https://khurshidalom.in" target="_blank" rel="noopener noreferrer" className="underline font-bold text-rose-600 dark:text-white">Khurshid Alom</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
