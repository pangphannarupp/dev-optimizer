import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { QualityGateResult } from '../utils/analysisEngine';

interface QualityGateBadgeProps {
    result: QualityGateResult;
}

export const QualityGateBadge: React.FC<QualityGateBadgeProps> = ({ result }) => {
    return (
        <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${result.passed ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800' : 'bg-rose-50 border-rose-200 dark:bg-rose-900/10 dark:border-rose-800'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {result.passed ? (
                        <CheckCircle className="text-emerald-500" size={20} />
                    ) : (
                        <XCircle className="text-rose-500" size={20} />
                    )}
                    <span className={`font-bold uppercase tracking-wider ${result.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                        Quality Gate {result.passed ? 'Passed' : 'Failed'}
                    </span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {result.conditions.map((c, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-semibold text-gray-500">{c.metric}</span>
                        <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold ${c.passed ? 'text-emerald-600' : 'text-rose-600'}`}>{c.actual}</span>
                            <span className="text-[10px] text-gray-400">Target: {c.expected}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
