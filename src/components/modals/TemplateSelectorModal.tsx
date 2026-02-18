import { X, FileText, Check } from 'lucide-react';
import { LATEX_TEMPLATES } from '../../data/LatexTemplates';

interface TemplateSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (templateCode: string) => void;
}

export const TemplateSelectorModal = ({ isOpen, onClose, onSelect }: TemplateSelectorProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <FileText size={20} className="text-blue-500" />
                            Choose a Template
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Start with a pre-made layout</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-gray-900/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {LATEX_TEMPLATES.map((template) => (
                            <div
                                key={template.id}
                                className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col"
                                onClick={() => {
                                    onSelect(template.code);
                                    onClose();
                                }}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                        <FileText size={24} />
                                    </div>
                                    <span className="text-[10px] font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500">
                                        {template.category}
                                    </span>
                                </div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {template.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                                    {template.description}
                                </p>
                                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                        Select Template <Check size={14} />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
