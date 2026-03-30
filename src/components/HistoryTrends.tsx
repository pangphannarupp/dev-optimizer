import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface HistorySnap {
    timestamp: number;
    reliability: string;
    security: string;
    maintainability: string;
    debt: number;
    bugs: number;
}

interface HistoryTrendsProps {
    history: HistorySnap[];
}

export const HistoryTrends: React.FC<HistoryTrendsProps> = ({ history }) => {
    if (history.length < 2) return null;

    const current = history[history.length - 1];
    const previous = history[history.length - 2];

    const getTrendIcon = (curr: number | string, prev: number | string, lowerIsBetter: boolean = true) => {
        if (curr === prev) return <Minus size={12} className="text-gray-400" />;
        
        const isBetter = lowerIsBetter ? curr < prev : curr > prev;
        if (typeof curr === 'string') {
            const ratings = ['A', 'B', 'C', 'D', 'E'];
            const currIdx = ratings.indexOf(curr);
            const prevIdx = ratings.indexOf(prev as string);
            const ratingBetter = currIdx < prevIdx;
            return ratingBetter ? <TrendingUp size={12} className="text-emerald-500" /> : <TrendingDown size={12} className="text-rose-500" />;
        }

        return isBetter ? <TrendingUp size={12} className="text-emerald-500" /> : <TrendingDown size={12} className="text-rose-500" />;
    };

    return (
        <div className="flex flex-col gap-2 p-3 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-100 dark:border-stone-800">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <TrendingUp size={12} />
                Recent Trends
            </h4>
            <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Reliability</span>
                <div className="flex items-center gap-1">
                    <span className="font-bold">{current.reliability}</span>
                    {getTrendIcon(current.reliability, previous.reliability)}
                </div>
            </div>
            <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Technical Debt</span>
                <div className="flex items-center gap-1">
                    <span className="font-bold">{current.debt}m</span>
                    {getTrendIcon(current.debt, previous.debt)}
                </div>
            </div>
        </div>
    );
};
