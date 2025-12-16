import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Download, RefreshCw, Settings, FileJson, Table } from 'lucide-react';
import { clsx } from 'clsx';
import { generateMockData, SchemaField, MockDataType } from '../utils/MockGeneratorLogic';
import { saveAs } from 'file-saver';

export const MockDataGenerator: React.FC = () => {
    const { t } = useTranslation();
    const [schema, setSchema] = useState<SchemaField[]>([
        { id: '1', name: 'id', type: 'uuid' },
        { id: '2', name: 'firstName', type: 'firstName' },
        { id: '3', name: 'email', type: 'email' },
    ]);
    const [rowCount, setRowCount] = useState<number>(10);
    const [generatedData, setGeneratedData] = useState<any[]>([]);
    const [viewMode, setViewMode] = useState<'table' | 'json'>('table');

    const addField = () => {
        setSchema([...schema, { id: crypto.randomUUID(), name: 'newField', type: 'custom' }]);
    };

    const removeField = (id: string) => {
        setSchema(schema.filter(f => f.id !== id));
    };

    const updateField = (id: string, updates: Partial<SchemaField>) => {
        setSchema(schema.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const updateOptions = (id: string, options: any) => {
        setSchema(schema.map(f => f.id === id ? { ...f, options: { ...f.options, ...options } } : f));
    };

    const handleGenerate = () => {
        const data = generateMockData(schema, rowCount);
        setGeneratedData(data);
    };

    const handleDownloadJson = () => {
        const blob = new Blob([JSON.stringify(generatedData, null, 2)], { type: 'application/json' });
        saveAs(blob, 'mock_data.json');
    };

    const types: { value: MockDataType, label: string }[] = [
        { value: 'uuid', label: t('mockData.types.uuid') },
        { value: 'name', label: t('mockData.types.name') },
        { value: 'firstName', label: t('mockData.types.firstName') },
        { value: 'lastName', label: t('mockData.types.lastName') },
        { value: 'email', label: t('mockData.types.email') },
        { value: 'boolean', label: t('mockData.types.boolean') },
        { value: 'number', label: t('mockData.types.number') },
        { value: 'date', label: t('mockData.types.date') },
        { value: 'custom', label: t('mockData.types.custom') },
    ];

    return (
        <div className="h-full flex flex-col md:flex-row gap-6 p-6">
            {/* Left Panel: Configuration */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <Settings size={20} />
                        {t('mockData.configTitle')}
                    </h2>

                    {/* Schema Builder */}
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px]">
                        {schema.map((field) => (
                            <div key={field.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={field.name}
                                        onChange={(e) => updateField(field.id, { name: e.target.value })}
                                        className="flex-1 min-w-0 px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                        placeholder="Field Name"
                                    />
                                    <select
                                        value={field.type}
                                        onChange={(e) => updateField(field.id, { type: e.target.value as MockDataType })}
                                        className="w-32 px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                    >
                                        {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                    </select>
                                    <button onClick={() => removeField(field.id)} className="text-red-500 hover:text-red-700 p-1">
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {/* Options based on type */}
                                {field.type === 'number' && (
                                    <div className="flex items-center gap-2 text-xs">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            className="w-16 px-1 py-0.5 border rounded dark:bg-gray-700 text-gray-900 dark:text-white"
                                            value={field.options?.min || ''}
                                            onChange={(e) => updateOptions(field.id, { min: parseInt(e.target.value) })}
                                        />
                                        <span>-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            className="w-16 px-1 py-0.5 border rounded dark:bg-gray-700 text-gray-900 dark:text-white"
                                            value={field.options?.max || ''}
                                            onChange={(e) => updateOptions(field.id, { max: parseInt(e.target.value) })}
                                        />
                                    </div>
                                )}
                                {field.type === 'custom' && (
                                    <input
                                        type="text"
                                        placeholder="Items (comma separated)"
                                        className="w-full px-2 py-1 text-xs border rounded dark:bg-gray-700 text-gray-900 dark:text-white"
                                        onChange={(e) => updateOptions(field.id, { listItems: e.target.value.split(',').map(s => s.trim()) })}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addField}
                        className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                        <Plus size={16} />
                        {t('mockData.addField')}
                    </button>

                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />

                    {/* Generate Controls */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('mockData.rowCount')}</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={rowCount}
                                onChange={(e) => setRowCount(parseInt(e.target.value))}
                                className="flex-1 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                min="1"
                                max="1000"
                            />
                            <button
                                onClick={handleGenerate}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                            >
                                <RefreshCw size={18} />
                                {t('mockData.generate')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Preview */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                    <h2 className="font-semibold text-gray-800 dark:text-white">{t('mockData.preview')}</h2>
                    <div className="flex items-center gap-2">
                        <div className="flex bg-gray-200 dark:bg-gray-700 rounded p-1">
                            <button
                                onClick={() => setViewMode('table')}
                                className={clsx("p-1.5 rounded transition-all", viewMode === 'table' ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400")}
                            >
                                <Table size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('json')}
                                className={clsx("p-1.5 rounded transition-all", viewMode === 'json' ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400")}
                            >
                                <FileJson size={16} />
                            </button>
                        </div>
                        <button
                            onClick={handleDownloadJson}
                            disabled={generatedData.length === 0}
                            className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                            <Download size={16} />
                            JSON
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-4 bg-gray-50/50 dark:bg-gray-900/50">
                    {generatedData.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <Table size={48} className="mb-2 opacity-20" />
                            <p>{t('mockData.noData')}</p>
                        </div>
                    ) : (
                        viewMode === 'table' ? (
                            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            {schema.map(f => (
                                                <th key={f.id} className="px-4 py-3 whitespace-nowrap">{f.name}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800">
                                        {generatedData.map((row, i) => (
                                            <tr key={i} className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                {schema.map(f => (
                                                    <td key={f.id} className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-gray-300 max-w-[200px] truncate">
                                                        {String(row[f.name])}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-xs font-mono h-full border border-gray-700">
                                {JSON.stringify(generatedData, null, 2)}
                            </pre>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
