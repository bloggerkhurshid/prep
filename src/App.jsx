import React, { useState } from 'react';
import documentsData from './data/documents.json';
import { 
  Search, 
  Sun, 
  Moon,
  Code2
} from 'lucide-react';

export default function App() {
  // Navigation & Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Q&A Filter & Reveal States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [revealedAnswers, setRevealedAnswers] = useState({});

  const toggleAnswer = (key) => {
    setRevealedAnswers(prev => ({ ...prev, [key]: !prev[key] }));
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
          return <strong key={pIdx} className="font-bold border-b border-orange-500/50 text-orange-600 dark:text-orange-400 pb-0.5">{part.slice(2, -2)}</strong>;
        }
        if (/^(?:[A-Za-z0-9\s,–-]+:|\d+\.\s+[A-Za-z0-9\s,–-]+:)$/.test(part)) {
          return <strong key={pIdx} className="font-semibold block mt-2 text-xs uppercase tracking-widest text-orange-600 dark:text-orange-400">{part}</strong>;
        }
        return <span key={pIdx}>{part}</span>;
      });

      if (isBulletItem) {
        return (
          <div key={lIdx} className="flex items-start space-x-2 pl-3 my-1">
            <span className="select-none font-bold text-sm leading-relaxed shrink-0 text-orange-500">•</span>
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

  // Flatten all Q&A and Document Sections into a single unified view
  const allQna = documentsData.flatMap(doc => 
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

  const categories = ['All', ...new Set(documentsData.map(d => d.category))];

  const filteredQna = allQna.filter(item => {
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch = !searchQuery || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 font-["Plus_Jakarta_Sans",sans-serif] flex flex-col relative overflow-x-hidden ${
      isDarkMode 
        ? 'bg-[#0f0a07] text-neutral-100' 
        : 'bg-[#fffaf5] text-neutral-900'
    }`}>

      {/* Warm Orange Ambient Glow Orbs for Glassmorphism */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-25 transition-all duration-700 ${
          isDarkMode ? 'bg-orange-600' : 'bg-orange-400'
        }`} />
        <div className={`absolute top-1/3 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-700 ${
          isDarkMode ? 'bg-amber-600' : 'bg-amber-300'
        }`} />
        <div className={`absolute -bottom-40 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-700 ${
          isDarkMode ? 'bg-red-600' : 'bg-orange-300'
        }`} />
      </div>

      {/* Orange Glassmorphism Header Nav */}
      <header className="sticky top-0 z-30 transition-all duration-300 px-4 sm:px-6 py-3.5">
        <div className={`max-w-7xl mx-auto rounded-2xl px-5 py-3 flex items-center justify-between transition-all ${
          isDarkMode ? 'glass-panel-dark' : 'glass-panel-light'
        }`}>
          
          {/* Logo / Title H1 for SEO */}
          <h1 className="flex items-center space-x-3 font-sans">
            <div className="p-2 rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20">
              <Code2 size={20} className="stroke-[2.5]" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-lg font-black text-lg sm:text-xl tracking-wider uppercase bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20">
                PREP
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase opacity-70 text-orange-800 dark:text-orange-300">
                by khurshid
              </span>
            </div>
          </h1>

          {/* Dark Mode Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle Dark Mode"
            className={`p-2.5 rounded-xl transition-all border ${
              isDarkMode 
                ? 'border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400' 
                : 'border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 text-orange-600'
            }`}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

        </div>
      </header>

      {/* Main Combined Glass Page View */}
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 font-sans space-y-6 z-10">
        
        {/* Search & Category Filter Header Bar */}
        <div className={`p-4 sm:p-5 rounded-2xl transition-all flex flex-col md:flex-row gap-4 justify-between items-center ${
          isDarkMode ? 'glass-panel-dark' : 'glass-panel-light'
        }`}>
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-3 opacity-40 text-orange-500" />
            <input
              id="search-input"
              aria-label="Search questions and concepts"
              type="text"
              placeholder="Search concepts & questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 text-sm bg-transparent border rounded-xl focus:outline-none transition-all ${
                isDarkMode 
                  ? 'border-orange-500/20 focus:border-orange-500/50 bg-black/20 text-white placeholder-neutral-400' 
                  : 'border-orange-500/30 focus:border-orange-500/60 bg-white/40 text-black placeholder-neutral-500'
              }`}
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap font-medium ${
                  categoryFilter === cat 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-md shadow-orange-500/20' 
                    : (isDarkMode ? 'bg-orange-500/10 hover:bg-orange-500/20 text-neutral-300' : 'bg-orange-500/5 hover:bg-orange-500/10 text-neutral-700')
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Orange Glassmorphism Cards Stream */}
        <div className="space-y-4">
          {filteredQna.map((qnaItem) => {
            const isRevealed = revealedAnswers[qnaItem.id];

            return (
              <div 
                key={qnaItem.id}
                onClick={() => toggleAnswer(qnaItem.id)}
                className={`p-5 sm:p-6 rounded-2xl transition-all duration-300 cursor-pointer ${
                  isDarkMode 
                    ? 'glass-card-dark hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5' 
                    : 'glass-card-light hover:border-orange-500/40 hover:shadow-md hover:shadow-orange-500/5'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-orange-600 dark:text-orange-400 opacity-80 block mb-1">
                      {qnaItem.category} • {qnaItem.docTitle}
                    </span>
                    <h3 className="font-semibold text-base sm:text-lg leading-snug">
                      {qnaItem.question}
                    </h3>
                  </div>
                </div>

                {isRevealed && (
                  <div className={`mt-4 pt-4 border-t text-sm leading-relaxed transition-all ${
                    isDarkMode ? 'border-orange-500/20 text-neutral-200' : 'border-orange-500/20 text-neutral-800'
                  }`}>
                    {renderFormattedText(qnaItem.answer)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </main>

      {/* Orange Glassmorphism Footer */}
      <footer className={`border-t py-6 mt-12 text-xs font-sans z-10 transition-all ${
        isDarkMode ? 'border-orange-500/20 text-neutral-400' : 'border-orange-500/20 text-neutral-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 uppercase tracking-wide">
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white">
              PREP
            </span>
            <span className="text-[10px] opacity-70 text-orange-800 dark:text-orange-300">BY KHURSHID</span>
          </div>
          <p className="opacity-80">
            Copyright © <a href="https://khurshidalom.in" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-100 transition-opacity font-medium text-orange-600 dark:text-orange-400">Khurshid Alom</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
