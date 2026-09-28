'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Layers, X, ChevronRight } from 'lucide-react';
import { categories, type CategoryId } from '@/lib/mockData';

interface CategorySelectorProps {
  selected: CategoryId;
  onSelect: (id: CategoryId) => void;
  selectedSubcategory: string | null;
  onSelectSubcategory: (id: string | null) => void;
}

// Top 5 featured categories for quick access
const FEATURED_CATEGORIES: CategoryId[] = ['gastronomia', 'indumentaria', 'estetica', 'salud', 'construccion'];

export function CategorySelector({
  selected,
  onSelect,
  selectedSubcategory,
  onSelectSubcategory,
}: CategorySelectorProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const currentCat = categories.find((c) => c.id === selected);

  const featuredCategories = categories.filter(c => FEATURED_CATEGORIES.includes(c.id));
  const otherCategories = categories.filter(c => !FEATURED_CATEGORIES.includes(c.id));

  const handleSelectCategory = (categoryId: CategoryId) => {
    onSelect(categoryId);
    onSelectSubcategory(null);
    setDropdownOpen(false);
  };

  const handleSelectSubcategory = (subcategoryId: string | null) => {
    onSelectSubcategory(subcategoryId);
    setDropdownOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Top 5 featured categories */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 snap-x snap-mandatory touch-scroll">
        {featuredCategories.map((cat, index) => {
          const isActive = selected === cat.id;
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              onClick={() => handleSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-full font-body text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 snap-start ${
                isActive
                  ? 'bg-neon-green/15 border border-neon-green/50 text-neon-green shadow-[0_0_15px_rgba(0,255,135,0.2)]'
                  : 'glass-panel text-muted-foreground hover:text-foreground hover:border-white/20'
              }`}
            >
              <span className="text-base">{cat.emoji}</span>
              <span>{cat.label}</span>
            </motion.button>
          );
        })}

        {/* "Ver todos los rubros" dropdown button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-full font-body text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
            dropdownOpen
              ? 'bg-neon-purple/15 border border-neon-purple/50 text-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.2)]'
              : 'glass-panel text-muted-foreground hover:text-foreground hover:border-white/20'
          }`}
        >
          <span className="text-base">📂</span>
          <span>Ver todos</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </motion.button>
      </div>

      {/* Dropdown for all categories */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative z-50"
          >
            {/* Backdrop for mobile */}
            <div
              className="fixed inset-0 bg-black/50 sm:hidden"
              onClick={() => setDropdownOpen(false)}
            />

            {/* Dropdown content */}
            <div className="glass-panel rounded-2xl border border-white/10 p-4 sm:absolute sm:top-full sm:left-0 sm:right-0 sm:mt-2 sm:shadow-2xl sm:max-h-[70vh] sm:overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-display font-bold text-foreground">Todos los rubros</span>
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Featured categories section */}
                <div>
                  <div className="text-[10px] font-body text-muted-foreground uppercase tracking-wider mb-2">
                    Rubros destacados
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {featuredCategories.map((cat) => {
                      const isActive = selected === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleSelectCategory(cat.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                            isActive
                              ? 'bg-neon-green/15 border border-neon-green/30 text-neon-green'
                              : 'glass-panel text-muted-foreground hover:text-foreground hover:border-white/20'
                          }`}
                        >
                          <span className="text-lg">{cat.emoji}</span>
                          <span className="text-xs font-body font-medium">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Other categories section */}
                {otherCategories.length > 0 && (
                  <div>
                    <div className="text-[10px] font-body text-muted-foreground uppercase tracking-wider mb-2">
                      Otros rubros
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {otherCategories.map((cat) => {
                        const isActive = selected === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => handleSelectCategory(cat.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                              isActive
                                ? 'bg-neon-green/15 border border-neon-green/30 text-neon-green'
                                : 'glass-panel text-muted-foreground hover:text-foreground hover:border-white/20'
                            }`}
                          >
                            <span className="text-lg">{cat.emoji}</span>
                            <span className="text-xs font-body font-medium">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Subcategories for selected category */}
              {currentCat && currentCat.subcategories.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="h-3.5 w-3.5 text-neon-purple" />
                    <span className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">
                      Sub-rubros de {currentCat.emoji} {currentCat.label}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleSelectSubcategory(null)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                        selectedSubcategory === null
                          ? 'bg-neon-purple/15 border border-neon-purple/30 text-neon-purple'
                          : 'glass-panel text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-body font-medium">Todos los sub-rubros</span>
                    </button>
                    {currentCat.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleSelectSubcategory(sub.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                          selectedSubcategory === sub.id
                            ? 'bg-neon-purple/15 border border-neon-purple/30 text-neon-purple'
                            : 'glass-panel text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-body font-medium">{sub.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subcategory pills (only show when dropdown is closed) */}
      <AnimatePresence mode="wait">
        {!dropdownOpen && currentCat && currentCat.subcategories.length > 0 && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-2">
              <Layers className="h-3.5 w-3.5 text-neon-purple" />
              <span className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">
                Filtrar por sub-rubro
              </span>
            </div>
            <div className="w-full overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 snap-x snap-mandatory touch-scroll">
              <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
                <button
                  onClick={() => onSelectSubcategory(null)}
                  className={`px-3 py-1.5 rounded-full text-xs font-body font-medium whitespace-nowrap transition-all snap-start ${
                    selectedSubcategory === null
                      ? 'bg-neon-purple/15 border border-neon-purple/40 text-neon-purple'
                      : 'glass-panel text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Todos
                </button>
                {currentCat.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => onSelectSubcategory(sub.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-body font-medium whitespace-nowrap transition-all snap-start ${
                      selectedSubcategory === sub.id
                        ? 'bg-neon-purple/15 border border-neon-purple/40 text-neon-purple'
                        : 'glass-panel text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
