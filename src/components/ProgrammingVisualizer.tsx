import React, { useState } from 'react';


interface ProgrammingVisualizerProps {
    visualizerId: string;
}

export const ProgrammingVisualizer: React.FC<ProgrammingVisualizerProps> = ({ visualizerId }) => {
    if (visualizerId === 'css-box-model') return <BoxModelVisualizer />;
    if (visualizerId === 'css-flexbox') return <FlexboxVisualizer />;
    if (visualizerId === 'android-lifecycle') return <AndroidLifecycleVisualizer />;
    return null;
};

// --- CSS Box Model ---
const BoxModelVisualizer = () => {
    return (
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-white">CSS Box Model Interactive</h3>

            {/* Margin */}
            <div className="relative bg-orange-100 dark:bg-orange-900/30 border-2 border-dashed border-orange-300 p-8 w-64 h-64 flex items-center justify-center">
                <span className="absolute top-2 left-2 text-xs font-mono text-orange-600 dark:text-orange-400">Margin</span>

                {/* Border */}
                <div className="relative bg-yellow-100 dark:bg-yellow-900/30 border-4 border-solid border-yellow-400 p-8 w-48 h-48 flex items-center justify-center">
                    <span className="absolute top-2 left-2 text-xs font-mono text-yellow-700 dark:text-yellow-500">Border</span>

                    {/* Padding */}
                    <div className="relative bg-green-100 dark:bg-green-900/30 border-2 border-dashed border-green-300 p-8 w-32 h-32 flex items-center justify-center">
                        <span className="absolute top-2 left-2 text-xs font-mono text-green-700 dark:text-green-500">Padding</span>

                        {/* Content */}
                        <div className="bg-blue-100 dark:bg-blue-900/50 w-full h-full flex items-center justify-center text-sm font-bold text-blue-800 dark:text-blue-200">
                            Content
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Flexbox Playground ---
const FlexboxVisualizer = () => {
    const [justify, setJustify] = useState('center');
    const [align, setAlign] = useState('center');

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Flexbox Playground</h3>

            <div className="flex gap-4 mb-4 flex-wrap">
                <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">Justify Content</label>
                    <select
                        value={justify}
                        onChange={(e) => setJustify(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-1 text-sm text-gray-800 dark:text-gray-200"
                    >
                        <option value="flex-start">flex-start</option>
                        <option value="center">center</option>
                        <option value="flex-end">flex-end</option>
                        <option value="space-between">space-between</option>
                        <option value="space-around">space-around</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">Align Items</label>
                    <select
                        value={align}
                        onChange={(e) => setAlign(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-1 text-sm text-gray-800 dark:text-gray-200"
                    >
                        <option value="flex-start">flex-start</option>
                        <option value="center">center</option>
                        <option value="flex-end">flex-end</option>
                        <option value="stretch">stretch</option>
                    </select>
                </div>
            </div>

            <div
                className="h-48 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex transition-all duration-300"
                style={{ justifyContent: justify, alignItems: align }}
            >
                <div className="w-12 h-12 bg-blue-500 rounded m-1 flex items-center justify-center text-white font-bold">1</div>
                <div className="w-12 h-16 bg-purple-500 rounded m-1 flex items-center justify-center text-white font-bold">2</div>
                <div className="w-12 h-12 bg-pink-500 rounded m-1 flex items-center justify-center text-white font-bold">3</div>
            </div>
        </div>
    );
};

// --- Android Lifecycle ---
const AndroidLifecycleVisualizer = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center">
            <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-white">Activity Lifecycle</h3>
            <div className="flex flex-col items-center gap-4">
                {['onCreate()', 'onStart()', 'onResume()'].map((method, idx) => (
                    <React.Fragment key={method}>
                        <div className="w-48 py-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-center font-mono rounded-lg border border-green-200 dark:border-green-800 font-bold">
                            {method}
                        </div>
                        {idx < 2 && <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>}
                    </React.Fragment>
                ))}
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div className="w-48 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-center font-bold rounded-lg border border-blue-200 dark:border-blue-800">
                    Running
                </div>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                {['onPause()', 'onStop()', 'onDestroy()'].map((method, idx) => (
                    <React.Fragment key={method}>
                        <div className="w-48 py-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-center font-mono rounded-lg border border-red-200 dark:border-red-800 font-bold">
                            {method}
                        </div>
                        {idx < 2 && <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
