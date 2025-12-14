import { motion } from 'framer-motion';
import { Download, Monitor, Laptop, AppWindow, Cpu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function DownloadScreen() {
    const { t } = useTranslation();

    const platforms = [
        {
            id: 'windows',
            name: 'Windows',
            description: 'Windows 10, 11 (64-bit)',
            icon: AppWindow,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            downloadUrl: 'https://drive.google.com/drive/folders/1umhaW-bJrl_GaTAVsZyekPaVztLe2QKt?usp=sharing' // Placeholder
        },
        {
            id: 'linux',
            name: 'Linux',
            description: 'AppImage for Linux distributions',
            icon: Monitor,
            color: 'text-orange-500',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20',
            downloadUrl: 'https://drive.google.com/drive/folders/1tpJmmQmuuBMoxamWr-Xtxn3Ibpdov-G5?usp=sharing' // Placeholder
        },
        {
            id: 'mac-intel',
            name: 'MacOS (Intel)',
            description: 'For Intel-based Macs',
            icon: Laptop,
            color: 'text-gray-500',
            bgColor: 'bg-gray-50 dark:bg-gray-700/50',
            downloadUrl: 'https://drive.google.com/drive/folders/1xd2sYW_zR91wHx8dBhV3QfZGiLEhEAyC?usp=sharing' // Placeholder
        },
        {
            id: 'mac-silicon',
            name: 'MacOS (Apple Chip)',
            description: 'For M1/M2/M3 Macs',
            icon: Cpu,
            color: 'text-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            downloadUrl: 'https://drive.google.com/drive/folders/134eVXPi8bzMV4zrgOM0y7ZwyXINfTk3c?usp=sharing' // Placeholder
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('download.title', 'Download Dev Optimizer')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {t('download.subtitle', 'Get the native application for your operating system to enjoy offline capabilities and better performance.')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {platforms.map((platform, index) => (
                    <motion.div
                        key={platform.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all flex flex-col items-center text-center group"
                    >
                        <div className={`p-4 rounded-full mb-4 ${platform.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                            <platform.icon size={32} className={platform.color} />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {platform.name}
                        </h3>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-1">
                            {platform.description}
                        </p>

                        <a
                            href={platform.downloadUrl}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium"
                            onClick={(e) => {
                                if (platform.downloadUrl === '#') {
                                    e.preventDefault();
                                    alert('Download link coming soon!');
                                }
                            }}
                        >
                            <Download size={18} />
                            {t('common.download', 'Download')}
                        </a>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-900/20">
                <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {t('download.sourceCodeTitle', 'Open Source')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {t('download.sourceCodeDesc', 'Check out the source code on GitHub. Contributions are welcome!')}
                        </p>
                    </div>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                    >
                        {t('download.viewOnGithub', 'View on GitHub')}
                    </a>
                </div>
            </div>
        </div>
    );
}
