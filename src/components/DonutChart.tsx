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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col md:flex-row items-center gap-8 justify-center">
            {/* Donut Chart */}
            <div className="relative w-48 h-48 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        strokeWidth="12"
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
                            strokeWidth="12"
                            className={clsx("stroke-current transition-colors", segment.color)}
                            strokeDasharray={segment.strokeDasharray}
                            strokeDashoffset={segment.strokeDashoffset} // Initial offset for calculation
                            initial={{ strokeDasharray: `0 251.2` }}
                            animate={{ strokeDasharray: segment.strokeDasharray }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                            strokeLinecap="butt" // Use butt for seamless segments
                        />
                    ))}
                </svg>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-3xl font-bold text-gray-800 dark:text-white"
                    >
                        {centerLabel || total}
                    </motion.span>
                    {centerSubLabel && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-xs text-gray-500 uppercase font-medium tracking-wider"
                        >
                            {centerSubLabel}
                        </motion.span>
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                {data.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (index * 0.1) }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm flex-shrink-0", item.bg)}>
                            <item.icon size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {item.label}
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-lg font-bold text-gray-800 dark:text-white">
                                    {item.value}
                                </span>
                                <span className={clsx("text-xs font-medium", item.color)}>
                                    {item.percentage.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
