import { useState } from 'react';
import { MATH_SYMBOLS, SymbolCategory } from '../../data/MathSymbols';

interface MathSymbolPaletteProps {
    onInsert: (latex: string) => void;
    className?: string; // Allow custom styling from parent
}

export const MathSymbolPalette = ({ onInsert, className = '' }: MathSymbolPaletteProps) => {
    const [activeCategory, setActiveCategory] = useState<SymbolCategory>('Basic');

    return (
        <div className={`flex flex-col h-full bg-white dark:bg-gray-800 ${className}`}>
            <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 scrollbar-hide">
                <style>{`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                    .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
                {Object.keys(MATH_SYMBOLS).map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat as SymbolCategory)}
                        className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${activeCategory === cat
                            ? 'text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-800 border-b-2 border-purple-500'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto p-2 grid grid-flow-col auto-cols-max gap-2 content-start bg-gray-50 dark:bg-gray-900/50 h-full overflow-x-auto">
                {MATH_SYMBOLS[activeCategory].map((symbol, idx) => (
                    <button
                        key={`${symbol.latex}-${idx}`}
                        onClick={() => onInsert(symbol.latex)}
                        title={symbol.description || symbol.latex}
                        className="h-full aspect-square p-1 flex items-center justify-center bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 rounded-lg transition-all text-gray-800 dark:text-gray-200 font-math shadow-sm hover:shadow-md hover:-translate-y-0.5 min-w-[40px]"
                    >
                        <span className={`text-center w-full ${activeCategory === 'Templates' ? 'text-[10px]' : 'text-lg'}`}>
                            {symbol.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
