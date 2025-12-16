import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { LucideIcon } from 'lucide-react';

export interface DonutChartItem {
    id: string;
    value: number;
    color: string;
    bg: string;
    icon: LucideIcon;
    label: string;
}

interface DonutChartProps {
    items: DonutChartItem[];
    total: number;
    centerLabel?: string;
    centerSubLabel?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({ items, total, centerLabel, centerSubLabel }) => {

    const data = useMemo(() => {
        // Calculate percentages
        const totalCount = Math.max(total, 1); // Avoid division by zero

        let accumulatedPercentage = 0;
        return items.map(segment => {
            const percentage = (segment.value / totalCount) * 100;
            const startPercentage = accumulatedPercentage;
            accumulatedPercentage += percentage;

            return {
                ...segment,
                percentage,
                startPercentage,
                // SVG Circle calculations (radius 40, circumference ~251.2)
                circumference: 251.2,
                strokeDasharray: `${(percentage / 100) * 251.2} 251.2`,
                strokeDashoffset: -((startPercentage / 100) * 251.2)
            };
        });
    }, [items, total]);

    return (
        <div className="flex flex-row items-center gap-8 h-full">
            {/* Donut Chart */}
            <div className="relative w-24 h-24 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        strokeWidth="8"
                        className="text-gray-100 dark:text-gray-700 stroke-current"
                    />

                    {/* Segments */}
                    {data.map((segment) => (
                        <motion.circle
                            key={segment.id}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            strokeWidth="8"
                            className={clsx("stroke-current transition-colors", segment.color)}
                            strokeDasharray={segment.strokeDasharray}
                            strokeDashoffset={segment.strokeDashoffset}
                            initial={{ strokeDasharray: `0 251.2` }}
                            animate={{ strokeDasharray: segment.strokeDasharray }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                            strokeLinecap="butt"
                        />
                    ))}
                </svg>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xl font-bold text-gray-800 dark:text-white"
                    >
                        {centerLabel || total}
                    </motion.span>
                    {centerSubLabel && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mt-0.5"
                        >
                            {centerSubLabel}
                        </motion.span>
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-1.5 min-w-[200px]">
                {data.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (index * 0.1) }}
                        className="flex items-center justify-between p-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <div className={clsx("w-1.5 h-1.5 rounded-full shrink-0", item.bg)} />
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                {item.label}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                            <span className="text-xs font-bold text-gray-800 dark:text-white min-w-[20px] text-right">
                                {item.value}
                            </span>
                            <span className={clsx("text-[10px] font-semibold px-1.5 py-0.5 rounded bg-opacity-10 dark:bg-opacity-20 min-w-[40px] text-center", item.color.replace('text-', 'bg-'), item.color)}>
                                {item.percentage.toFixed(0)}%
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
