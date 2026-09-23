'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Layers } from 'lucide-react';
import { categories, type CategoryId } from '@/lib/mockData';

interface CategorySelectorProps {
  selected: CategoryId;
  onSelect: (id: CategoryId) => void;
  selectedSubcategory: string | null;
  onSelectSubcategory: (id: string | null) => void;
}

export function CategorySelector({
  selected,
  onSelect,
  selectedSubcategory,
  onSelectSubcategory,
}: CategorySelectorProps) {
  const currentCat = categories.find((c) => c.id === selected);

  return (
    <div className="space-y-3">
      {/* Category pills */}
      <div className="w-full overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 sm:gap-2.5 min-w-max sm:min-w-0 sm:flex-wrap sm:justify-center pb-1">
          {categories.map((cat, index) => {
            const isActive = selected === cat.id;
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                onClick={() => {
                  onSelect(cat.id);
                  onSelectSubcategory(null);
                }}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-full font-body text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 ${
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
        </div>
      </div>

      {/* Subcategory pills */}
      <AnimatePresence mode="wait">
        {currentCat && currentCat.subcategories.length > 0 && (
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
            <div className="w-full overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
                <button
                  onClick={() => onSelectSubcategory(null)}
                  className={`px-3 py-1.5 rounded-full text-xs font-body font-medium whitespace-nowrap transition-all ${
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
                    className={`px-3 py-1.5 rounded-full text-xs font-body font-medium whitespace-nowrap transition-all ${
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
