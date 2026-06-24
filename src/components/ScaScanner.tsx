import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    ShieldAlert, ShieldCheck, Shield, AlertTriangle, Info, 
    Upload, FileJson, ChevronDown, ChevronUp, PackageOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types based on npm audit --json output
interface NpmAuditMetadata {
    vulnerabilities: {
        info: number;
        low: number;
        moderate: number;
        high: number;
        critical: number;
        total: number;
    };
    dependencies: {
        total: number;
    };
}

interface NpmAuditVulnerability {
    name: string;
    severity: 'critical' | 'high' | 'moderate' | 'low' | 'info';
    isDirect: boolean;
    via: (string | { source: number; name: string; dependency: string; title: string; url: string; severity: string })[];
    effects: string[];
    range: string;
    fixAvailable: boolean | { name: string; version: string; isSemVerMajor: boolean };
}

interface NpmAuditReport {
    auditReportVersion: number;
    vulnerabilities: Record<string, NpmAuditVulnerability>;
    metadata: NpmAuditMetadata;
}

const SeverityBadge: React.FC<{ severity: string }> = ({ severity }) => {
    const config = {
        critical: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: ShieldAlert },
        high: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', icon: AlertTriangle },
        moderate: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: Info },
        low: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: Info },
        info: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400', icon: Info },
    };

    const style = config[severity as keyof typeof config] || config.info;
    const Icon = style.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
            <Icon size={12} />
            <span className="capitalize">{severity}</span>
        </span>
    );
};

export function ScaScanner() {
    const { t } = useTranslation();
    const [report, setReport] = useState<NpmAuditReport | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expandedVuln, setExpandedVuln] = useState<string | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const json = JSON.parse(content);
                
                if (json.auditReportVersion || json.metadata?.vulnerabilities) {
                    setReport(json);
                    setError(null);
                } else {
                    setError("Invalid npm audit format. Please upload an 'npm audit --json' output file.");
                }
            } catch (err) {
                setError("Failed to parse JSON file.");
            }
        };
        reader.readAsText(file);
    };

    const vulnerabilitiesList = useMemo(() => {
        if (!report?.vulnerabilities) return [];
        return Object.values(report.vulnerabilities).sort((a, b) => {
            const weights = { critical: 4, high: 3, moderate: 2, low: 1, info: 0 };
            return (weights[b.severity as keyof typeof weights] || 0) - (weights[a.severity as keyof typeof weights] || 0);
        });
    }, [report]);

    const isSecure = report && report.metadata.vulnerabilities.total === 0;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <ShieldAlert className="text-blue-500" />
                        SCA & Vulnerability Scanner
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Upload your <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">npm audit --json</code> report to view a detailed security dashboard.
                    </p>
                </div>
            </div>

            {!report ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center bg-white dark:bg-gray-800 shadow-sm transition-colors hover:border-blue-500">
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 text-blue-500">
                            <Upload size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Upload Audit Report</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            Run <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded text-sm text-pink-500">npm audit --json &gt; audit.json</code> in your project, then upload the generated file here.
                        </p>
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2">
                                <AlertTriangle size={16} />
                                {error}
                            </div>
                        )}
                    </label>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Top Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className={`p-5 rounded-xl shadow-sm border ${isSecure ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'}`}>
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Vulnerabilities</h3>
                                {isSecure ? <ShieldCheck className="text-green-500" /> : <ShieldAlert className="text-red-500" />}
                            </div>
                            <p className={`text-3xl font-bold mt-2 ${isSecure ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                {report.metadata.vulnerabilities.total}
                            </p>
                        </div>
                        <div className="p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Critical</h3>
                                <AlertTriangle className="text-red-500" size={20} />
                            </div>
                            <p className="text-3xl font-bold mt-2 text-red-600 dark:text-red-400">
                                {report.metadata.vulnerabilities.critical}
                            </p>
                        </div>
                        <div className="p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">High / Moderate</h3>
                                <Shield className="text-orange-500" size={20} />
                            </div>
                            <p className="text-3xl font-bold mt-2 text-orange-600 dark:text-orange-400">
                                {report.metadata.vulnerabilities.high} / {report.metadata.vulnerabilities.moderate}
                            </p>
                        </div>
                        <div className="p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Dependencies</h3>
                                <PackageOpen className="text-blue-500" size={20} />
                            </div>
                            <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                                {report.metadata.dependencies.total}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end">
                        <button 
                            onClick={() => setReport(null)}
                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Upload Different Report
                        </button>
                    </div>

                    {/* Vulnerabilities Table */}
                    {vulnerabilitiesList.length > 0 ? (
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                    <AlertTriangle size={18} className="text-orange-500" />
                                    Detected Vulnerabilities
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {vulnerabilitiesList.map((vuln) => (
                                    <div key={vuln.name} className="flex flex-col">
                                        <div 
                                            className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                                            onClick={() => setExpandedVuln(expandedVuln === vuln.name ? null : vuln.name)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <SeverityBadge severity={vuln.severity} />
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white font-mono">
                                                        {vuln.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        Vulnerable versions: <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded text-pink-600 dark:text-pink-400">{vuln.range}</code>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {vuln.fixAvailable ? (
                                                    <span className="text-xs font-medium text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30 px-2 py-1 rounded">Fix Available</span>
                                                ) : (
                                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-800 px-2 py-1 rounded">No Fix Available</span>
                                                )}
                                                {expandedVuln === vuln.name ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                                            </div>
                                        </div>
                                        <AnimatePresence>
                                            {expandedVuln === vuln.name && (
                                                <motion.div 
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden bg-gray-50 dark:bg-gray-900/50"
                                                >
                                                    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700/50 space-y-4">
                                                        <div>
                                                            <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Affected Dependents</h5>
                                                            <div className="flex flex-wrap gap-2">
                                                                {vuln.effects.length > 0 ? vuln.effects.map(effect => (
                                                                    <span key={effect} className="text-sm px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded font-mono text-gray-700 dark:text-gray-300">
                                                                        {effect}
                                                                    </span>
                                                                )) : (
                                                                    <span className="text-sm text-gray-500">None (Direct Dependency)</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Advisories / Via</h5>
                                                            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                                                {vuln.via.map((v, i) => (
                                                                    <li key={i}>
                                                                        {typeof v === 'string' ? (
                                                                            <span className="font-mono">{v}</span>
                                                                        ) : (
                                                                            <span>
                                                                                <strong>{v.title}</strong> (Severity: {v.severity}) - <a href={v.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{v.url}</a>
                                                                            </span>
                                                                        )}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        {typeof vuln.fixAvailable === 'object' && (
                                                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                                                    <strong>Remediation:</strong> Update <code>{vuln.fixAvailable.name}</code> to version <code>{vuln.fixAvailable.version}</code>.
                                                                    {vuln.fixAvailable.isSemVerMajor && " Warning: This is a major version update and may contain breaking changes."}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        isSecure && (
                            <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                                    <ShieldCheck size={32} className="text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">0 Vulnerabilities Found</h3>
                                <p className="text-gray-500 dark:text-gray-400">Great job! Your project dependencies are secure.</p>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
