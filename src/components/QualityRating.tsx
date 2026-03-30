import React from 'react';

type Rating = 'A' | 'B' | 'C' | 'D' | 'E';

interface QualityRatingProps {
  rating: Rating;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const QualityRating: React.FC<QualityRatingProps> = ({ rating, label, size = 'md' }) => {
  const getColors = (r: Rating) => {
    switch (r) {
      case 'A': return 'bg-emerald-500 text-white';
      case 'B': return 'bg-lime-500 text-white';
      case 'C': return 'bg-yellow-500 text-white';
      case 'D': return 'bg-orange-500 text-white';
      case 'E': return 'bg-rose-500 text-white';
      default: return 'bg-stone-500 text-white';
    }
  };

  const getSizeClasses = (s: string) => {
    switch (s) {
      case 'sm': return 'w-6 h-6 text-xs';
      case 'lg': return 'w-12 h-12 text-xl';
      default: return 'w-8 h-8 text-sm';
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`flex items-center justify-center rounded-full font-bold shadow-sm ${getColors(rating)} ${getSizeClasses(size)}`}>
        {rating}
      </div>
      {label && <span className="text-[10px] uppercase font-semibold text-stone-500 tracking-tighter line-clamp-1">{label}</span>}
    </div>
  );
};
