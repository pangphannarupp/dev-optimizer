import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download, Search, FolderOpen, Film, Music,
    CheckCircle, Loader2, AlertCircle, List
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Define types for IPC communication
interface QualityOption {
    height: number;
    fps: number;
    label: string;
}

interface VideoInfo {
    type: 'video';
    title: string;
    thumbnail: string;
    duration: string | number; // Seconds or formatted string
    author: string;
    qualityOptions?: QualityOption[];
}

interface PlaylistInfo {
    type: 'playlist';
    title: string;
    thumbnail: string;
    videoCount: number;
    author?: string; // Optional for playlist
    items: {
        title: string;
        url: string;
        thumbnail: string;
        duration: string | number;
        author: string;
    }[];
}

type YoutubeInfo = VideoInfo | PlaylistInfo;

interface DownloadItem {
    url: string;
    title: string;
    status: 'pending' | 'downloading' | 'completed' | 'error';
    progress: number;
    error?: string;
}

export function YoutubeDownloader() {
    const { t } = useTranslation();
    const [url, setUrl] = useState('');
    const [info, setInfo] = useState<YoutubeInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [downloadPath, setDownloadPath] = useState<string | null>(null);
    const [downloadType, setDownloadType] = useState<'video' | 'audio'>('video');
    const [selectedOption, setSelectedOption] = useState<QualityOption | null>(null);
    const [downloads, setDownloads] = useState<Record<string, DownloadItem>>({});
    const [isElectron, setIsElectron] = useState(true);

    const formatDuration = (input: number | string | undefined) => {
        if (!input) return '--:--';
        if (typeof input === 'string') {
            // Check if it's potentially seconds in string format e.g. "120"
            if (/^\d+$/.test(input) || /^\d+\.\d+$/.test(input)) {
                return formatDuration(parseFloat(input));
            }
            return input;
        }

        const totalSeconds = Math.floor(input);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (n: number) => n.toString().padStart(2, '0');

        if (hours > 0) {
            return `${hours}:${pad(minutes)}:${pad(seconds)}`;
        }
        return `${minutes}:${pad(seconds)}`;
    };

    // Check environment
    useEffect(() => {
        if (!window.ipcRenderer) {
            setIsElectron(false);
            setError(t('youtube.electronRequired', 'This feature is only available in the desktop application.'));
        }
    }, [t]);

    // Listen for download progress
    useEffect(() => {
        if (!window.ipcRenderer) return;

        const removeListener = window.ipcRenderer.on('download:progress', (_event: any, { url, percent }: any) => {
            setDownloads(prev => ({
                ...prev,
                [url]: {
                    ...prev[url],
                    status: 'downloading',
                    progress: percent
                }
            }));
        });

        return () => {
            // safe call
            if (typeof removeListener === 'function') {
                removeListener();
            }
        }
    }, []);

    const fetchInfo = async () => {
        if (!url) return;
        if (!window.ipcRenderer) {
            setError("Desktop app required");
            return;
        }
        setLoading(true);
        setError(null);
        setInfo(null);

        try {
            const result = await window.ipcRenderer.invoke('youtube:getInfo', url);
            setInfo(result);
            // Default to highest quality
            if (result.type === 'video' && result.qualityOptions && result.qualityOptions.length > 0) {
                setSelectedOption(result.qualityOptions[0]);
            } else {
                setSelectedOption(null);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch info');
        } finally {
            setLoading(false);
        }
    };

    const selectFolder = async () => {
        if (!window.ipcRenderer) return;
        const path = await window.ipcRenderer.invoke('youtube:selectFolder');
        if (path) setDownloadPath(path);
    };

    const startDownload = async (itemUrl: string, title: string) => {
        if (!downloadPath) {
            setError(t('youtube.selectFolderError', 'Please select a download folder first'));
            return;
        }
        if (!window.ipcRenderer) return;

        setDownloads(prev => ({
            ...prev,
            [itemUrl]: {
                url: itemUrl,
                title,
                status: 'pending',
                progress: 0
            }
        }));

        try {
            await window.ipcRenderer.invoke('youtube:download', {
                url: itemUrl,
                type: downloadType,
                outputDir: downloadPath,
                fileName: title,
                resolution: info?.type === 'video' && downloadType === 'video' ? selectedOption?.height : undefined,
                fps: info?.type === 'video' && downloadType === 'video' ? selectedOption?.fps : undefined
            });

            setDownloads(prev => ({
                ...prev,
                [itemUrl]: {
                    ...prev[itemUrl],
                    status: 'completed',
                    progress: 100
                }
            }));
        } catch (err: any) {
            setDownloads(prev => ({
                ...prev,
                [itemUrl]: {
                    ...prev[itemUrl],
                    status: 'error',
                    error: err.message
                }
            }));
        }
    };

    const downloadAll = async () => {
        if (info?.type !== 'playlist') return;
        for (const item of info.items) {
            await startDownload(item.url, item.title);
        }
    };

    if (!isElectron) {
        return (
            <div className="max-w-4xl mx-auto p-8 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="bg-orange-100 p-4 rounded-full">
                    <AlertCircle className="w-12 h-12 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Desktop Required</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-md">
                    The YouTube Downloader feature relies on native system capabilities and is only available in the Dev Optimizer desktop application.
                </p>
                <button
                    onClick={() => window.open('https://github.com/pangphannarupp/dev-optimizer/releases', '_blank')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Download Desktop App
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Download className="w-8 h-8 text-red-600" />
                    YouTube Downloader
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Download videos and playlists in high quality.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
                {/* Search Bar */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Paste YouTube Video or Playlist URL"
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                            onKeyDown={(e) => e.key === 'Enter' && fetchInfo()}
                        />
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    </div>
                    <button
                        onClick={fetchInfo}
                        disabled={loading || !url}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Fetch'}
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {/* Download Options */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="flex text-black dark:text-white items-center gap-4">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Save to:</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={selectFolder}
                                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <FolderOpen className="w-4 h-4" />
                                {downloadPath ? downloadPath.split(/[\\/]/).pop() || downloadPath : 'Select Folder'}
                            </button>
                        </div>
                    </div>

                    <div className="flex text-black dark:text-white items-center gap-4">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Format:</span>
                        <div className="flex bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
                            <button
                                onClick={() => setDownloadType('video')}
                                className={`px-3 py-1 text-sm rounded-md transition-all flex items-center gap-1 ${downloadType === 'video'
                                    ? 'bg-white dark:bg-gray-800 text-red-600 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                                    }`}
                            >
                                <Film className="w-4 h-4" /> Video
                            </button>
                            <button
                                onClick={() => setDownloadType('audio')}
                                className={`px-3 py-1 text-sm rounded-md transition-all flex items-center gap-1 ${downloadType === 'audio'
                                    ? 'bg-white dark:bg-gray-800 text-red-600 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                                    }`}
                            >
                                <Music className="w-4 h-4" /> Audio
                            </button>
                        </div>
                    </div>

                    {downloadType === 'video' && info?.type === 'video' && info.qualityOptions && info.qualityOptions.length > 0 && (
                        <div className="flex text-black dark:text-white items-center gap-4">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quality:</span>
                            <select
                                value={selectedOption ? JSON.stringify(selectedOption) : ''}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setSelectedOption(JSON.parse(e.target.value));
                                    }
                                }}
                                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm outline-none focus:ring-2 focus:ring-red-500"
                            >
                                {info.qualityOptions.map((opt, idx) => (
                                    <option key={idx} value={JSON.stringify(opt)}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Info Display */}
                <AnimatePresence mode="wait">
                    {info && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex gap-6 items-start">
                                <img
                                    src={info.thumbnail}
                                    alt={info.title}
                                    className="w-48 aspect-video object-cover rounded-lg shadow-md"
                                />
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded text-white mb-2 inline-block ${info.type === 'playlist' ? 'bg-blue-600' : 'bg-red-600'}`}>
                                                {info.type === 'playlist' ? 'PLAYLIST' : 'VIDEO'}
                                            </span>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                                                {info.title}
                                            </h2>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                {info.type === 'video' ? info.author : `${info.videoCount} Videos`}
                                            </p>
                                        </div>
                                    </div>

                                    {info.type === 'video' && (
                                        <div className="pt-2">
                                            <button
                                                onClick={() => startDownload(url, info.title)}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                            >
                                                <Download className="w-5 h-5" /> Download
                                            </button>
                                        </div>
                                    )}

                                    {info.type === 'playlist' && (
                                        <div className="pt-2 flex items-center gap-4">
                                            <button
                                                onClick={downloadAll}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                            >
                                                <Download className="w-5 h-5" /> Download All ({info.videoCount})
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Downloads Status for Single Video */}
                            {info.type === 'video' && downloads[url] && (
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between text-sm mb-2 text-black dark:text-white">
                                        <span className="font-medium truncate pr-4">{downloads[url].title}</span>
                                        <span className={
                                            downloads[url].status === 'error' ? 'text-red-500' :
                                                downloads[url].status === 'completed' ? 'text-green-500' : 'text-blue-500'
                                        }>
                                            {downloads[url].status === 'downloading' ? `${Math.round(downloads[url].progress || 0)}%` :
                                                downloads[url].status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${downloads[url].progress || 0}%` }}
                                            className={`h-full ${downloads[url].status === 'error' ? 'bg-red-500' :
                                                downloads[url].status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                                                }`}
                                        />
                                    </div>
                                    {downloads[url].error && (
                                        <p className="text-red-500 text-xs mt-1">{downloads[url].error}</p>
                                    )}
                                </div>
                            )}

                            {/* Playlist Items */}
                            {info.type === 'playlist' && (
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <List className="w-5 h-5" /> Tracks
                                    </h3>
                                    <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                        {info.items.map((item, idx) => {
                                            const dlParams = downloads[item.url];
                                            return (
                                                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group">
                                                    <span className="text-gray-400 w-6 text-center">{idx + 1}</span>
                                                    <img src={item.thumbnail} alt="" className="w-16 h-9 object-cover rounded" />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-900 dark:text-white truncate">{item.title}</h4>
                                                        <p className="text-xs text-gray-500">{formatDuration(item.duration)}</p>
                                                    </div>

                                                    {dlParams ? (
                                                        <div className="w-24 text-right">
                                                            {dlParams.status === 'completed' ? (
                                                                <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                                                            ) : dlParams.status === 'error' ? (
                                                                <AlertCircle className="w-5 h-5 text-red-500 ml-auto" />
                                                            ) : (
                                                                <div className="w-full">
                                                                    <div className="text-xs text-right mb-1 text-blue-500">{Math.round(dlParams.progress || 0)}%</div>
                                                                    <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-blue-500" style={{ width: `${dlParams.progress}%` }} />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => startDownload(item.url, item.title)}
                                                            className="p-2 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <Download className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
