import { useState, useCallback, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { ProcessedImage } from './components/ImageItem'; // Keep type import

import { Sidebar } from './components/Sidebar';
import { ThemeProvider } from './contexts/ThemeContext';
import { processImage, createDownloadUrl } from './utils/imageProcessor';
import { Play, Trash2 } from 'lucide-react';
import './i18n';
import { useTranslation } from 'react-i18next';

import { HomeMenu } from './components/HomeMenu';
import { ToolId } from './config/tools';
import { WhatsNewSnackbar } from './components/WhatsNewSnackbar';
import { BackgroundWave } from './components/BackgroundWave';
import { GlobalSettingsModal } from './components/GlobalSettingsModal';

// Lazy load tool components
const DropZone = lazy(() => import('./components/DropZone').then(module => ({ default: module.DropZone })));
const ImageItem = lazy(() => import('./components/ImageItem').then(module => ({ default: module.ImageItem })));
const SettingsPanel = lazy(() => import('./components/SettingsPanel').then(module => ({ default: module.SettingsPanel })));
const IconGenerator = lazy(() => import('./components/IconGenerator').then(module => ({ default: module.IconGenerator })));
const ImageEnhancer = lazy(() => import('./components/ImageEnhancer').then(module => ({ default: module.ImageEnhancer })));
const ImageEditor = lazy(() => import('./components/ImageEditor').then(module => ({ default: module.ImageEditor })));
const QRGenerator = lazy(() => import('./components/QRGenerator').then(module => ({ default: module.QRGenerator })));
const SvgToDrawableConverter = lazy(() => import('./components/SvgToDrawableConverter').then(module => ({ default: module.SvgToDrawableConverter })));
const ImageToBase64 = lazy(() => import('./components/ImageToBase64').then(module => ({ default: module.ImageToBase64 })));
const JSONFormatter = lazy(() => import('./components/JSONFormatter').then(module => ({ default: module.JSONFormatter })));
const JsonToCodeConverter = lazy(() => import('./components/JsonToCodeConverter').then(module => ({ default: module.JsonToCodeConverter })));
const MockDataGenerator = lazy(() => import('./components/MockDataGenerator').then(module => ({ default: module.MockDataGenerator })));
const CsvToJsonConverter = lazy(() => import('./components/CsvToJsonConverter').then(module => ({ default: module.CsvToJsonConverter })));
const JWTDecoder = lazy(() => import('./components/JWTDecoder').then(module => ({ default: module.JWTDecoder })));
const EncryptionTool = lazy(() => import('./components/EncryptionTool').then(module => ({ default: module.EncryptionTool })));
const SHAGenerator = lazy(() => import('./components/SHAGenerator').then(module => ({ default: module.SHAGenerator })));
const ValidateTranslation = lazy(() => import('./components/ValidateTranslation').then(module => ({ default: module.ValidateTranslation })));
const SourceComparator = lazy(() => import('./components/SourceComparator').then(module => ({ default: module.SourceComparator })));
const AppStoreValidator = lazy(() => import('./components/AppStoreValidator').then(module => ({ default: module.AppStoreValidator })));
const LottiePlayer = lazy(() => import('./components/LottiePlayer').then(module => ({ default: module.LottiePlayer })));
const JsMinifier = lazy(() => import('./components/JsMinifier').then(module => ({ default: module.JsMinifier })));
const DeeplinkGenerator = lazy(() => import('./components/DeeplinkGenerator').then(module => ({ default: module.DeeplinkGenerator })));
const CurlConverter = lazy(() => import('./components/CurlConverter')); // Default export
const UnixTimestampConverter = lazy(() => import('./components/UnixTimestampConverter')); // Default export
const DensityConverter = lazy(() => import('./components/DensityConverter')); // Default export
const ScreenshotFramer = lazy(() => import('./components/ScreenshotFramer').then(module => ({ default: module.ScreenshotFramer })));
const TotpGenerator = lazy(() => import('./components/TotpGenerator').then(module => ({ default: module.TotpGenerator })));
const RegexTester = lazy(() => import('./components/RegexTester')); // Default export
const CssGenerator = lazy(() => import('./components/CssGenerator').then(module => ({ default: module.CssGenerator })));
const DownloadScreen = lazy(() => import('./components/DownloadScreen').then(module => ({ default: module.DownloadScreen })));
const CodeQualityChecker = lazy(() => import('./components/CodeQualityChecker').then(module => ({ default: module.CodeQualityChecker })));
const MarkdownEditor = lazy(() => import('./components/MarkdownEditor').then(module => ({ default: module.MarkdownEditor })));
const DeveloperGuide = lazy(() => import('./components/DeveloperGuide').then(module => ({ default: module.DeveloperGuide })));


function AppContent() {
  const [activeTab, setActiveTab] = useState<ToolId | 'home'>('home');
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
        error: 'Failed to process image'
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors relative isolate">
      <BackgroundWave />
      {activeTab !== 'home' && (
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSettingsClick={() => setIsSettingsOpen(true)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Mobile Header - Hide on Home */}
        {activeTab !== 'home' && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-800 dark:text-white">{t('app.title')}</h1>
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
        )}
        <div className="flex-1 h-full overflow-hidden flex flex-col relative">
          <Suspense fallback={
            <div className="h-full w-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          }>
            <AnimatePresence mode="wait">
              {activeTab === 'home' ? (
                <motion.main
                  key="home"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-hidden"
                >
                  <HomeMenu
                    onNavigate={(id) => {
                      setActiveTab(id);
                      setIsSidebarOpen(false);
                    }}
                    onSettingsClick={() => setIsSettingsOpen(true)}
                  />
                </motion.main>
              ) : activeTab === 'optimizer' ? (
                <motion.div
                  key="optimizer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto"
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
                  className="p-6 h-full overflow-y-auto"
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
                  className="p-6 h-full overflow-y-auto"
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
                  className="p-6 h-full overflow-y-auto"
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
                  className="p-6 h-full overflow-y-auto"
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
                  className="p-6 h-full overflow-y-auto"
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
                  className="p-6 h-full overflow-y-auto"
                >
                  <JSONFormatter />
                </motion.main>
              ) : activeTab === 'json-to-code' ? (
                <motion.main
                  key="json-to-code"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 h-full overflow-y-auto"
                >
                  <JsonToCodeConverter />
                </motion.main>
              ) : activeTab === 'csv-json' ? (
                <motion.main
                  key="csv-json"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 h-full overflow-y-auto"
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
                  className="p-6 h-full overflow-y-auto"
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
                  className="p-6 h-full overflow-y-auto"
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
                  className="p-6 h-full overflow-y-auto"
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
                  className="h-full overflow-y-auto"
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
                  className="h-full overflow-y-auto"
                >
                  <SourceComparator />
                </motion.main>
              ) : activeTab === 'store-validator' ? (
                <motion.main
                  key="store-validator"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto"
                >
                  <AppStoreValidator />
                </motion.main>
              ) : activeTab === 'mock-data' ? (
                <motion.main
                  key="mock-data"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto"
                >
                  <MockDataGenerator />
                </motion.main>
              ) : activeTab === 'lottie-player' ? (
                <motion.main
                  key="lottie-player"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto"
                >
                  <LottiePlayer />
                </motion.main>
              ) : activeTab === 'js-minifier' ? (
                <motion.main
                  key="js-minifier"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto"
                >
                  <JsMinifier />
                </motion.main>
              ) : activeTab === 'deeplink-generator' ? (
                <motion.main
                  key="deeplink-generator"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto"
                >
                  <DeeplinkGenerator />
                </motion.main>
              ) : activeTab === 'download' ? (
                <motion.main
                  key="download"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 h-full overflow-y-auto"
                >
                  <DownloadScreen />
                </motion.main>
              ) : activeTab === 'curl-converter' ? (
                <motion.main
                  key="curl-converter"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto"
                >
                  <CurlConverter />
                </motion.main>
              ) : activeTab === 'css-generator' ? (
                <motion.main
                  key="css-generator"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto"
                >
                  <CssGenerator />
                </motion.main>
              ) : activeTab === 'unix-timestamp' ? (
                <motion.main
                  key="unix-timestamp"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto"
                >
                  <UnixTimestampConverter />
                </motion.main>
              ) : activeTab === 'density-converter' ? (
                <motion.main
                  key="density-converter"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto"
                >
                  <DensityConverter />
                </motion.main>
              ) : activeTab === 'regex-tester' ? (
                <motion.main
                  key="regex-tester"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto"
                >
                  <RegexTester />
                </motion.main>
              ) : activeTab === 'screenshot-framer' ? (
                <motion.main
                  key="screenshot-framer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto"
                >
                  <ScreenshotFramer />
                </motion.main>
              ) : activeTab === 'totp-generator' ? (
                <motion.main
                  key="totp-generator"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto"
                >
                  <TotpGenerator />
                </motion.main>
              ) : activeTab === 'code-quality' ? (
                <motion.main
                  key="code-quality"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto"
                >
                  <CodeQualityChecker />
                </motion.main>
              ) : activeTab === 'markdown-editor' ? (
                <motion.main
                  key="markdown-editor"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto"
                >

                  <MarkdownEditor />
                </motion.main>
              ) : activeTab === 'developer-guide' ? (
                <motion.main
                  key="developer-guide"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto"
                >
                  <DeveloperGuide />
                </motion.main>
              ) : (
                <motion.main
                  key="base64"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 h-full overflow-y-auto"
                >
                  <ImageToBase64 />
                </motion.main>
              )}
            </AnimatePresence>
          </Suspense>
        </div>
      </div>

      <GlobalSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <WhatsNewSnackbar />
    </div >
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
