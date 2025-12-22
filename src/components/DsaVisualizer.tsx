import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Pause } from 'lucide-react';
import { useTranslation } from 'react-i18next';


interface DsaVisualizerProps {
    topicId: string;
}

export const DsaVisualizer: React.FC<DsaVisualizerProps> = ({ topicId }) => {
    // const { t } = useTranslation();
    // const topic = dsaTopics.find(t => t.id === topicId);
    // Determine visualization type
    const isSorting = ['bubble-sort', 'insertion-sort', 'quick-sort', 'merge-sort', 'selection-sort'].includes(topicId);
    const isArray = topicId === 'arrays';
    const isLinkedList = topicId === 'linked-list';
    const isBST = topicId === 'bst';
    const isStack = topicId === 'stack';
    const isQueue = topicId === 'queue';

    if (isSorting) return <SortingVisualizer algo={topicId} />;
    if (isArray) return <ArrayVisualizer />;
    if (isLinkedList) return <LinkedListVisualizer />;
    if (isBST) return <BSTVisualizer />;
    if (isStack) return <StackVisualizer />;
    if (isQueue) return <QueueVisualizer />;

    return null;
};

// --- Sorting Visualizer ---
const SortingVisualizer: React.FC<{ algo: string }> = ({ algo }) => {
    const { t } = useTranslation();
    const [array, setArray] = useState<number[]>([]);
    const [sorting, setSorting] = useState(false);
    const [comparing, setComparing] = useState<number[]>([]); // Indices being compared
    const [sorted, setSorted] = useState<number[]>([]); // Indices sorted

    const generateArray = () => {
        const arr = Array.from({ length: 15 }, () => Math.floor(Math.random() * 50) + 10);
        setArray(arr);
        setSorting(false);
        setComparing([]);
        setSorted([]);
    };

    useEffect(() => {
        generateArray();
    }, []);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const bubbleSort = async () => {
        setSorting(true);
        const arr = [...array];
        const n = arr.length;

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (!algorithmRef.current) return; // Stop if unmounted/reset
                setComparing([j, j + 1]);
                await sleep(100);

                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    setArray([...arr]);
                    await sleep(100);
                }
            }
            setSorted(prev => [...prev, n - i - 1]);
        }
        setComparing([]);
        setSorting(false);
    };

    // Generic algorithm dispatcher (placeholder for others for now)
    const startSort = async () => {
        algorithmRef.current = true;
        if (algo === 'bubble-sort') await bubbleSort();
        // Implement others or fallback to Bubble for demo
        else await bubbleSort();
    };

    const algorithmRef = useRef(true);
    useEffect(() => {
        algorithmRef.current = true;
        return () => { algorithmRef.current = false; };
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 dark:text-white">{t('tutorial.visualizer')}</h3>
                <div className="flex gap-2">
                    <button
                        onClick={generateArray}
                        disabled={sorting}
                        className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <RotateCcw size={18} />
                    </button>
                    <button
                        onClick={startSort}
                        disabled={sorting}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {sorting ? <Pause size={18} /> : <Play size={18} />}
                        {sorting ? t('tutorial.running') : t('tutorial.start')}
                    </button>
                </div>
            </div>

            <div className="h-64 flex items-end justify-center gap-1 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                {array.map((value, idx) => (
                    <motion.div
                        key={idx}
                        layout
                        initial={{ height: 0 }}
                        animate={{
                            height: `${(value / 60) * 100}%`,
                            backgroundColor: comparing.includes(idx)
                                ? '#EF4444' // Red (Comparing)
                                : sorted.includes(idx)
                                    ? '#10B981' // Green (Sorted)
                                    : '#3B82F6' // Blue (Default)
                        }}
                        className="w-4 md:w-6 rounded-t-md"
                    />
                ))}
            </div>
            <div className="mt-4 flex gap-4 text-xs text-gray-500 justify-center">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded"></div> {t('tutorial.unsorted')}</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded"></div> {t('tutorial.comparing')}</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded"></div> {t('tutorial.sorted')}</div>
            </div>
        </div>
    );
};

// --- Array Visualizer ---
const ArrayVisualizer = () => {
    const { t } = useTranslation();
    const data = [10, 20, 30, 40, 50];
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
            <h3 className="font-bold text-gray-800 dark:text-white mb-6">{t('tutorial.arrayMemory')}</h3>
            <div className="flex justify-center items-center gap-0">
                {data.map((val, idx) => (
                    <div key={idx} className="relative group">
                        <div className="w-16 h-16 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-xl font-bold text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-900 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:border-blue-500 transition-colors">
                            {val}
                        </div>
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-gray-400">
                            Idx: {idx}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Linked List Visualizer ---
const LinkedListVisualizer = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
            <h3 className="font-bold text-gray-800 dark:text-white mb-6">{t('tutorial.linkedList')}</h3>
            <div className="flex flex-wrap justify-center items-center gap-2">
                {[10, 20, 30, 40].map((val, idx) => (
                    <React.Fragment key={idx}>
                        <div className="border border-gray-300 dark:border-gray-600 rounded-lg flex overflow-hidden">
                            <div className="w-12 h-12 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-bold border-r border-gray-300 dark:border-gray-600">
                                {val}
                            </div>
                            <div className="w-8 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-xs text-gray-500">
                                Next
                            </div>
                        </div>
                        {idx < 3 && (
                            <div className="text-gray-400">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
                            </div>
                        )}
                        {idx === 3 && (
                            <div className="flex items-center text-gray-400 ml-2">
                                <div className="text-sm font-mono">NULL</div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

// --- Stack Visualizer ---
const StackVisualizer = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
            <h3 className="font-bold text-gray-800 dark:text-white mb-6">{t('tutorial.stack')}</h3>
            <div className="flex justify-center">
                <div className="border-l-4 border-b-4 border-r-4 border-gray-300 dark:border-gray-600 p-4 w-32 flex flex-col-reverse gap-2 min-h-[200px] items-center bg-gray-50 dark:bg-gray-900/30">
                    {[40, 30, 20, 10].map((val, idx) => (
                        <div key={idx} className="w-full py-2 bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 text-center rounded text-blue-800 dark:text-blue-200 font-bold">
                            {val}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Queue Visualizer ---
const QueueVisualizer = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
            <h3 className="font-bold text-gray-800 dark:text-white mb-6">{t('tutorial.queue')}</h3>
            <div className="flex justify-center items-center gap-2 border-t-2 border-b-2 border-gray-300 dark:border-gray-600 p-4 min-h-[100px] relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-2 text-xs text-gray-500">OUT (Dequeue)</div>
                {[10, 20, 30, 40].map((val, idx) => (
                    <div key={idx} className="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 rounded font-bold">
                        {val}
                    </div>
                ))}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-2 text-xs text-gray-500">IN (Enqueue)</div>
            </div>
        </div>
    );
};

// --- BST Visualizer ---
const BSTVisualizer = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8 flex flex-col items-center">
            <h3 className="font-bold text-gray-800 dark:text-white mb-6 w-full text-left">{t('tutorial.bst')}</h3>
            <div className="relative w-64 h-48">
                {/* SVG Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-gray-300 dark:stroke-gray-600" strokeWidth="2">
                    <line x1="50%" y1="20" x2="25%" y2="80" />
                    <line x1="50%" y1="20" x2="75%" y2="80" />
                    <line x1="25%" y1="80" x2="12%" y2="140" />
                    <line x1="25%" y1="80" x2="38%" y2="140" />
                </svg>

                {/* Nodes */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-md">10</div>

                <div className="absolute top-[60px] left-[25%] -translate-x-1/2 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-md">5</div>
                <div className="absolute top-[60px] left-[75%] -translate-x-1/2 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-md">15</div>

                <div className="absolute top-[120px] left-[12%] -translate-x-1/2 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-md">2</div>
                <div className="absolute top-[120px] left-[38%] -translate-x-1/2 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-md">7</div>
            </div>
        </div>
    );
};
