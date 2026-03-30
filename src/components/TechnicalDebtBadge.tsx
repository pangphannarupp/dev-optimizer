import React from 'react';

/**
 * TechnicalDebtBadge component to showcase remediated effort.
 */
interface TechnicalDebtBadgeProps {
  minutes: number;
  className?: string;
}

export const TechnicalDebtBadge: React.FC<TechnicalDebtBadgeProps> = ({ minutes, className = '' }) => {
  const formatDebt = (m: number): string => {
    if (m < 60) return `${m}min`;
    const h = Math.floor(m / 60);
    const remainingM = m % 60;
    if (h < 8) return `${h}h ${remainingM}min`;
    const d = Math.floor(h / 8); // Assume 8-hour workday
    const remainingH = h % 8;
    return `${d}d ${remainingH}h`;
  };

  return (
    <div className={`px-2 py-1 rounded-md bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-2 ${className}`}>
      <span className="text-xs font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wider">Debt</span>
      <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{formatDebt(minutes)}</span>
    </div>
  );
};
