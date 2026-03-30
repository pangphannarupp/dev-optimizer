import { useState } from 'react';
import { X, Table as TableIcon, Check } from 'lucide-react';

interface TableWizardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInsert: (latex: string) => void;
}

export const TableWizardModal = ({ isOpen, onClose, onInsert }: TableWizardModalProps) => {
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);
    const [hasHeader, setHasHeader] = useState(true);
    const [bordered, setBordered] = useState(true);
    const [centered, setCentered] = useState(true);

    if (!isOpen) return null;

    const generateTable = () => {
        let latex = '';
        if (centered) latex += '\\begin{center}\n';

        // Define column alignment (e.g., |c|c|c|)
        const colAlign = bordered
            ? '|' + Array(cols).fill('c').join('|') + '|'
            : Array(cols).fill('c').join(' ');

        latex += `\\begin{tabular}{${colAlign}}\n`;

        if (bordered) latex += '\\hline\n';

        // Header Row
        if (hasHeader) {
            const headerCells = Array(cols).fill(0).map((_, i) => `Header ${i + 1}`).join(' & ');
            latex += `\\textbf{${headerCells}} \\\\\n`;
            latex += '\\hline\n';
        }

        // Data Rows
        for (let i = 0; i < rows; i++) {
            const cells = Array(cols).fill('Cell').join(' & ');
            latex += `${cells} \\\\\n`;
            if (bordered) latex += '\\hline\n';
        }

        latex += '\\end{tabular}\n';
        if (centered) latex += '\\end{center}\n';

        onInsert(latex);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 transform transition-all scale-100">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-t-xl">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <TableIcon size={20} className="text-purple-600 dark:text-purple-400" />
                        Insert Table
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">

                    {/* Rows & Cols Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Rows</label>
                            <input
                                type="number"
                                min="1" max="20"
                                value={rows}
                                onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all font-mono text-center"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Columns</label>
                            <input
                                type="number"
                                min="1" max="10"
                                value={cols}
                                onChange={(e) => setCols(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all font-mono text-center"
                            />
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-3 pt-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${hasHeader ? 'bg-purple-600 border-purple-600' : 'border-gray-400 dark:border-gray-500'}`}>
                                {hasHeader && <Check size={14} className="text-white" />}
                            </div>
                            <input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} className="hidden" />
                            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-purple-600 transition-colors">Include Header Row</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${bordered ? 'bg-purple-600 border-purple-600' : 'border-gray-400 dark:border-gray-500'}`}>
                                {bordered && <Check size={14} className="text-white" />}
                            </div>
                            <input type="checkbox" checked={bordered} onChange={(e) => setBordered(e.target.checked)} className="hidden" />
                            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-purple-600 transition-colors">Add Borders</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${centered ? 'bg-purple-600 border-purple-600' : 'border-gray-400 dark:border-gray-500'}`}>
                                {centered && <Check size={14} className="text-white" />}
                            </div>
                            <input type="checkbox" checked={centered} onChange={(e) => setCentered(e.target.checked)} className="hidden" />
                            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-purple-600 transition-colors">Center Table</span>
                        </label>
                    </div>

                    {/* Preview Visualization (Simple grid) */}
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 flex justify-center">
                        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                            {Array(rows + (hasHeader ? 1 : 0)).fill(0).map((_, r) => (
                                Array(cols).fill(0).map((_, c) => (
                                    <div key={`${r}-${c}`} className={`w-6 h-6 border ${bordered ? 'border-gray-300 dark:border-gray-600' : 'border-transparent'} bg-white dark:bg-gray-800 rounded-sm flex items-center justify-center`}>
                                        <div className={`w-3 h-1 ${r === 0 && hasHeader ? 'bg-purple-400' : 'bg-gray-200 dark:bg-gray-700'} rounded-full`}></div>
                                    </div>
                                ))
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={generateTable}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2"
                    >
                        <TableIcon size={16} />
                        Insert Table
                    </button>
                </div>
            </div>
        </div>
    );
};
