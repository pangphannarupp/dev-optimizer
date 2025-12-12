import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { DropZone } from './components/DropZone';
import { ImageItem, ProcessedImage } from './components/ImageItem';
import { SettingsPanel } from './components/SettingsPanel';
import { IconGenerator } from './components/IconGenerator';
import { ImageEnhancer } from './components/ImageEnhancer';
import { ImageEditor } from './components/ImageEditor';
import { QRGenerator } from './components/QRGenerator';
import { GlobalSettingsModal } from './components/GlobalSettingsModal';
import { SvgToDrawableConverter } from './components/SvgToDrawableConverter';
import { ImageToBase64 } from './components/ImageToBase64';
import { JSONFormatter } from './components/JSONFormatter';
import { CsvToJsonConverter } from './components/CsvToJsonConverter';
import { JWTDecoder } from './components/JWTDecoder';
import { EncryptionTool } from './components/EncryptionTool';
import { SHAGenerator } from './components/SHAGenerator';
import { ValidateTranslation } from './components/ValidateTranslation';
import { SourceComparator } from './components/SourceComparator';

import { Sidebar } from './components/Sidebar';
import { ThemeProvider } from './contexts/ThemeContext';
import { processImage, createDownloadUrl } from './utils/imageProcessor';
import { Play, Trash2 } from 'lucide-react';
import './i18n';
import { useTranslation } from 'react-i18next';

import { WhatsNewSnackbar } from './components/WhatsNewSnackbar';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'optimizer' | 'generator' | 'enhancer' | 'editor' | 'qr' | 'svg-drawable' | 'base64' | 'json' | 'csv-json' | 'jwt' | 'encryption' | 'sha' | 'validate-translation' | 'source-compare'>('optimizer');
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [defaultFormat, setDefaultFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp');
  const [defaultQuality, setDefaultQuality] = useState(0.8);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useTranslation();

  const handleFilesDropped = useCallback((files: File[]) => {
    const newImages: ProcessedImage[] = files.map(file => ({
      id: uuidv4(),
      originalFile: file,
      previewUrl: URL.createObjectURL(file),
      targetFormat: defaultFormat,
      quality: defaultQuality,
      status: 'pending'
    }));
    setImages(prev => [...prev, ...newImages]);
  }, [defaultFormat, defaultQuality]);

  const handleRemove = useCallback((id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl);
      if (img?.processedUrl) URL.revokeObjectURL(img.processedUrl);
      return prev.filter(i => i.id !== id);
    });
  }, []);

  const handleUpdate = useCallback((id: string, updates: Partial<ProcessedImage>) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, ...updates, status: 'pending' } : img));
  }, []);

  const processSingleImage = async (img: ProcessedImage): Promise<ProcessedImage> => {
    try {
      const blob = await processImage(img.originalFile, img.targetFormat, img.quality);
      const url = createDownloadUrl(blob);
      return {
        ...img,
        status: 'done',
        processedBlob: blob,
        processedUrl: url,
        error: undefined
      };
    } catch (error) {
      return {
        ...img,
        status: 'error',
        error: 'Failed to process'
      };
    }
  };

  const handleProcess = useCallback(async (id: string) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, status: 'processing' } : img));

    const img = images.find(i => i.id === id);
    if (!img) return;

    const processed = await processSingleImage(img);
    setImages(prev => prev.map(i => i.id === id ? processed : i));
  }, [images]);

  const handleProcessAll = useCallback(async () => {
    setIsProcessingAll(true);
    const pendingImages = images.filter(img => img.status === 'pending' || img.status === 'error');

    // Mark all as processing
    setImages(prev => prev.map(img => pendingImages.find(p => p.id === img.id) ? { ...img, status: 'processing' } : img));

    // Process sequentially to avoid freezing UI
    for (const img of pendingImages) {
      const processed = await processSingleImage(img);
      setImages(prev => prev.map(i => i.id === img.id ? processed : i));
    }
    setIsProcessingAll(false);
  }, [images]);

  const handleDownload = useCallback((id: string) => {
    const img = images.find(i => i.id === id);
    if (img && img.processedUrl) {
      const a = document.createElement('a');
      a.href = img.processedUrl;
      const ext = img.targetFormat.split('/')[1];
      const name = img.originalFile.name.substring(0, img.originalFile.name.lastIndexOf('.'));
      a.download = `${name}_optimized.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [images]);

  const handleClearAll = useCallback(() => {
    images.forEach(img => {
      if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
      if (img.processedUrl) URL.revokeObjectURL(img.processedUrl);
    });
    setImages([]);
  }, [images]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSettingsClick={() => setIsSettingsOpen(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800 dark:text-white">Dev Optimizer</h1>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            {activeTab === 'optimizer' ? (
              <motion.div
                key="optimizer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <SettingsPanel
                  defaultFormat={defaultFormat}
                  defaultQuality={defaultQuality}
                  onFormatChange={setDefaultFormat}
                  onQualityChange={setDefaultQuality}
                />

                <main className="p-6 max-w-5xl mx-auto w-full flex flex-col gap-6">
                  <DropZone onFilesDropped={handleFilesDropped} />

                  {images.length > 0 && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t('app.queue')} ({images.length})</h2>
                        <div className="flex gap-3">
                          <button
                            onClick={handleClearAll}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            disabled={isProcessingAll}
                          >
                            <Trash2 size={18} />
                            {t('app.clearAll')}
                          </button>
                          <button
                            onClick={handleProcessAll}
                            disabled={isProcessingAll || !images.some(i => i.status === 'pending')}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                          >
                            {isProcessingAll ? (
                              <>
                                {t('app.processing')}
                              </>
                            ) : (
                              <>
                                <Play size={18} />
                                {t('app.processAll')}
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        {images.map(img => (
                          <ImageItem
                            key={img.id}
                            item={img}
                            onRemove={handleRemove}
                            onUpdate={handleUpdate}
                            onProcess={handleProcess}
                            onDownload={handleDownload}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </main>
              </motion.div>
            ) : activeTab === 'generator' ? (
              <motion.main
                key="generator"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="p-6 h-full"
              >
                <IconGenerator />
              </motion.main>
            ) : activeTab === 'enhancer' ? (
              <motion.main
                key="enhancer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="p-6 h-full"
              >
                <ImageEnhancer />
              </motion.main>
            ) : activeTab === 'editor' ? (
              <motion.main
                key="editor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="p-6 h-full"
              >
                <ImageEditor />
              </motion.main>
            ) : activeTab === 'qr' ? (
              <motion.main
                key="qr"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="p-6 h-full"
              >
                <QRGenerator />
              </motion.main>
            ) : activeTab === 'svg-drawable' ? (
              <motion.main
                key="svg-drawable"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="p-6 h-full"
              >
                <SvgToDrawableConverter />
              </motion.main>
            ) : activeTab === 'json' ? (
              <motion.main
                key="json"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="p-6 h-full"
              >
                <JSONFormatter />
              </motion.main>
            ) : activeTab === 'csv-json' ? (
              <motion.main
                key="csv-json"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="p-6 h-full"
              >
                <CsvToJsonConverter />
              </motion.main>
            ) : activeTab === 'jwt' ? (
              <motion.main
                key="jwt"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="p-6 h-full"
              >
                <JWTDecoder />
              </motion.main>
            ) : activeTab === 'encryption' ? (
              <motion.main
                key="encryption"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="p-6 h-full"
              >
                <EncryptionTool />
              </motion.main>
            ) : activeTab === 'sha' ? (
              <motion.main
                key="sha"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="p-6 h-full"
              >
                <SHAGenerator />
              </motion.main>
            ) : activeTab === 'validate-translation' ? (
              <motion.main
                key="validate-translation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <ValidateTranslation />
              </motion.main>
            ) : activeTab === 'source-compare' ? (
              <motion.main
                key="source-compare"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <SourceComparator />
              </motion.main>
            ) : (
              <motion.main
                key="base64"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="p-6 h-full"
              >
                <ImageToBase64 />
              </motion.main>
            )}
          </AnimatePresence>
        </div>
      </div>

      <GlobalSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <WhatsNewSnackbar />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
