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
  const [isDarkMode, setIsDarkMode] = useState(false);

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
          return <strong key={pIdx} className="font-bold border-b border-current pb-0.5">{part.slice(2, -2)}</strong>;
        }
        if (/^(?:[A-Za-z0-9\s,–-]+:|\d+\.\s+[A-Za-z0-9\s,–-]+:)$/.test(part)) {
          return <strong key={pIdx} className="font-semibold block mt-2 text-sm uppercase tracking-wide opacity-90">{part}</strong>;
        }
        return <span key={pIdx}>{part}</span>;
      });

      if (isBulletItem) {
        return (
          <div key={lIdx} className="flex items-start space-x-2 pl-3 my-1">
            <span className="select-none font-bold text-sm leading-relaxed shrink-0 opacity-70">•</span>
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
    <div className={`min-h-screen transition-colors duration-200 font-["Literata",Georgia,serif] flex flex-col ${
      isDarkMode ? 'bg-black text-neutral-200' : 'bg-white text-neutral-900'
    }`}>
      
      {/* Header Nav */}
      <header className={`sticky top-0 z-30 border-b backdrop-blur-md ${
        isDarkMode ? 'bg-black/90 border-neutral-800' : 'bg-white/90 border-neutral-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          
          {/* Logo / Title H1 for SEO */}
          <h1 className="flex items-center space-x-2.5 font-sans">
            <div className={`p-1.5 rounded-lg border ${
              isDarkMode ? 'border-neutral-200 bg-white text-black' : 'border-neutral-900 bg-black text-white'
            }`}>
              <Code2 size={20} className="stroke-[2.5]" />
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded font-black text-xl tracking-wider uppercase ${
                isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
              }`}>
                PREP
              </span>
              <span className="text-[9px] sm:text-[10px] font-normal tracking-widest uppercase opacity-60">
                by khurshid
              </span>
            </div>
          </h1>

          {/* Dark Mode Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle Dark Mode"
            className={`p-2 rounded-md transition-colors border ${
              isDarkMode 
                ? 'border-neutral-800 hover:bg-neutral-900 text-white' 
                : 'border-neutral-200 hover:bg-neutral-100 text-black'
            }`}
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

        </div>
      </header>

      {/* Main Combined Page View */}
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 font-sans space-y-6">
        
        {/* Search & Category Filter Header Bar */}
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center pb-2 border-b border-neutral-500/10">
          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute left-3 top-2.5 opacity-40" />
            <input
              id="search-input"
              aria-label="Search questions and concepts"
              type="text"
              placeholder="Search concepts & questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 text-sm bg-transparent border rounded focus:outline-none ${
                isDarkMode ? 'border-neutral-800 focus:border-neutral-500' : 'border-neutral-300 focus:border-black'
              }`}
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded text-xs transition-all whitespace-nowrap ${
                  categoryFilter === cat 
                    ? (isDarkMode ? 'bg-white text-black font-semibold' : 'bg-black text-white font-semibold') 
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Unified Cards Stream (Click to Expand Answers) */}
        <div className="space-y-3">
          {filteredQna.map((qnaItem) => {
            const isRevealed = revealedAnswers[qnaItem.id];

            return (
              <div 
                key={qnaItem.id}
                onClick={() => toggleAnswer(qnaItem.id)}
                className={`p-4 rounded border transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'border-neutral-800 bg-neutral-950 hover:border-neutral-700' 
                    : 'border-neutral-200 bg-white hover:border-neutral-400'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest opacity-40 block">
                      {qnaItem.category} • {qnaItem.docTitle}
                    </span>
                    <h3 className="font-medium text-base pt-0.5">
                      {qnaItem.question}
                    </h3>
                  </div>
                </div>

                {isRevealed && (
                  <div className={`mt-3 pt-3 border-t text-sm leading-relaxed ${
                    isDarkMode ? 'border-neutral-800 text-neutral-300' : 'border-neutral-200 text-neutral-800'
                  }`}>
                    {renderFormattedText(qnaItem.answer)}
                  </div>
                )}
              </div>
            );
          })}
          </div>

        </main>

      {/* Clean Minimal Footer */}
      <footer className={`border-t py-6 mt-12 text-xs font-sans ${
        isDarkMode ? 'border-neutral-800 text-neutral-400' : 'border-neutral-200 text-neutral-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 uppercase tracking-wide">
            <span className="font-bold">PREP</span>
            <span className="opacity-50">BY KHURSHID</span>
          </div>
          <p className="opacity-80">
            Copyright © <a href="https://khurshidalom.in" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-100 transition-opacity">Khurshid Alom</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
