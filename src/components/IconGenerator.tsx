import React, { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { DropZone } from './DropZone';
import { Download, Loader2, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface IconSize {
    name: string;
    size: number;
    path: string;
    platform?: string;
    idiom?: string;
    scale?: string;
}

interface IconPreview {
    size: number;
    url: string;
    label: string;
}

const IOS_ICONS: IconSize[] = [
    // iPhone Notifications (20pt)
    { name: 'Icon-20@2x.png', size: 40, path: 'ios/AppIcon.appiconset', idiom: 'iphone', scale: '2x' },
    { name: 'Icon-20@3x.png', size: 60, path: 'ios/AppIcon.appiconset', idiom: 'iphone', scale: '3x' },

    // iPhone Settings (29pt)
    { name: 'Icon-29@2x.png', size: 58, path: 'ios/AppIcon.appiconset', idiom: 'iphone', scale: '2x' },
    { name: 'Icon-29@3x.png', size: 87, path: 'ios/AppIcon.appiconset', idiom: 'iphone', scale: '3x' },

    // iPhone Spotlight (40pt)
    { name: 'Icon-40@2x.png', size: 80, path: 'ios/AppIcon.appiconset', idiom: 'iphone', scale: '2x' },
    { name: 'Icon-40@3x.png', size: 120, path: 'ios/AppIcon.appiconset', idiom: 'iphone', scale: '3x' },

    // iPhone App (60pt)
    { name: 'Icon-60@2x.png', size: 120, path: 'ios/AppIcon.appiconset', idiom: 'iphone', scale: '2x' },
    { name: 'Icon-60@3x.png', size: 180, path: 'ios/AppIcon.appiconset', idiom: 'iphone', scale: '3x' },

    // iPad Notifications (20pt)
    { name: 'Icon-20-ipad.png', size: 20, path: 'ios/AppIcon.appiconset', idiom: 'ipad', scale: '1x' },
    { name: 'Icon-20-ipad@2x.png', size: 40, path: 'ios/AppIcon.appiconset', idiom: 'ipad', scale: '2x' },

    // iPad Settings (29pt)
    { name: 'Icon-29-ipad.png', size: 29, path: 'ios/AppIcon.appiconset', idiom: 'ipad', scale: '1x' },
    { name: 'Icon-29-ipad@2x.png', size: 58, path: 'ios/AppIcon.appiconset', idiom: 'ipad', scale: '2x' },

    // iPad Spotlight (40pt)
    { name: 'Icon-40-ipad.png', size: 40, path: 'ios/AppIcon.appiconset', idiom: 'ipad', scale: '1x' },
    { name: 'Icon-40-ipad@2x.png', size: 80, path: 'ios/AppIcon.appiconset', idiom: 'ipad', scale: '2x' },

    // iPad App (76pt)
    { name: 'Icon-76.png', size: 76, path: 'ios/AppIcon.appiconset', idiom: 'ipad', scale: '1x' },
    { name: 'Icon-76@2x.png', size: 152, path: 'ios/AppIcon.appiconset', idiom: 'ipad', scale: '2x' },

    // iPad Pro (83.5pt)
    { name: 'Icon-83.5@2x.png', size: 167, path: 'ios/AppIcon.appiconset', idiom: 'ipad', scale: '2x' },

    // App Store
    { name: 'Icon-1024.png', size: 1024, path: 'ios/AppIcon.appiconset', idiom: 'ios-marketing', scale: '1x' },
];

const ANDROID_ICONS: IconSize[] = [
    { name: 'ic_launcher.png', size: 48, path: 'android/mipmap-mdpi', platform: 'mdpi' },
    { name: 'ic_launcher.png', size: 72, path: 'android/mipmap-hdpi', platform: 'hdpi' },
    { name: 'ic_launcher.png', size: 96, path: 'android/mipmap-xhdpi', platform: 'xhdpi' },
    { name: 'ic_launcher.png', size: 144, path: 'android/mipmap-xxhdpi', platform: 'xxhdpi' },
    { name: 'ic_launcher.png', size: 192, path: 'android/mipmap-xxxhdpi', platform: 'xxxhdpi' },
    { name: 'ic_launcher_playstore.png', size: 512, path: 'android', platform: 'Play Store' },
];

const MACOS_ICONS: IconSize[] = [
    { name: 'icon_16x16.png', size: 16, path: 'macos' },
    { name: 'icon_32x32.png', size: 32, path: 'macos' },
    { name: 'icon_128x128.png', size: 128, path: 'macos' },
    { name: 'icon_256x256.png', size: 256, path: 'macos' },
    { name: 'icon_512x512.png', size: 512, path: 'macos' },
    { name: 'icon_512x512@2x.png', size: 1024, path: 'macos' },
];

const WINDOWS_ICONS: IconSize[] = [
    { name: 'icon_16x16.png', size: 16, path: 'windows' },
    { name: 'icon_32x32.png', size: 32, path: 'windows' },
    { name: 'icon_48x48.png', size: 48, path: 'windows' },
    { name: 'icon_256x256.png', size: 256, path: 'windows' },
];

const LINUX_ICONS: IconSize[] = [
    { name: 'icon_16x16.png', size: 16, path: 'linux' },
    { name: 'icon_32x32.png', size: 32, path: 'linux' },
    { name: 'icon_48x48.png', size: 48, path: 'linux' },
    { name: 'icon_128x128.png', size: 128, path: 'linux' },
    { name: 'icon_256x256.png', size: 256, path: 'linux' },
];

const ANDROID_ROUND_ICONS: IconSize[] = [
    { name: 'ic_launcher_round.png', size: 48, path: 'android/mipmap-mdpi', platform: 'mdpi' },
    { name: 'ic_launcher_round.png', size: 72, path: 'android/mipmap-hdpi', platform: 'hdpi' },
    { name: 'ic_launcher_round.png', size: 96, path: 'android/mipmap-xhdpi', platform: 'xhdpi' },
    { name: 'ic_launcher_round.png', size: 144, path: 'android/mipmap-xxhdpi', platform: 'xxhdpi' },
    { name: 'ic_launcher_round.png', size: 192, path: 'android/mipmap-xxxhdpi', platform: 'xxxhdpi' },
];

const ANDROID_SPLASH_ICONS: IconSize[] = [
    { name: 'ic_splash_round.png', size: 512, path: 'android', platform: 'Splash' },
];

// Helper functions (moved outside component)
const resizeImage = (img: HTMLImageElement, size: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas to Blob failed'));
        }, 'image/png');
    });
};

const resizeImageCircular = (img: HTMLImageElement, size: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
        }

        // Create circular clipping path
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(img, 0, 0, size, size);

        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas to Blob failed'));
        }, 'image/png');
    });
};

const resizeImageRoundWithPadding = (img: HTMLImageElement, size: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
        }

        // Calculate padding (20%)
        const padding = size * 0.2;
        const innerSize = size - (padding * 2);
        const center = size / 2;
        const radius = innerSize / 2;

        // Create circular clipping path for the INNER image
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(img, padding, padding, innerSize, innerSize);

        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas to Blob failed'));
        }, 'image/png');
    });
};

const resizeImageToDataURL = (img: HTMLImageElement, size: number): string => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    ctx.drawImage(img, 0, 0, size, size);
    return canvas.toDataURL('image/png');
};

const resizeImageCircularToDataURL = (img: HTMLImageElement, size: number): string => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(img, 0, 0, size, size);
    return canvas.toDataURL('image/png');
};

const resizeImageRoundWithPaddingToDataURL = (img: HTMLImageElement, size: number): string => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Calculate padding (20%)
    const padding = size * 0.2;
    const innerSize = size - (padding * 2);
    const center = size / 2;
    const radius = innerSize / 2;

    // Create circular clipping path for the INNER image
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(img, padding, padding, innerSize, innerSize);
    return canvas.toDataURL('image/png');
};

export const IconGenerator: React.FC = () => {
    const [sourceImage, setSourceImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [iconPreviews, setIconPreviews] = useState<{
        android: IconPreview[];
        androidRound: IconPreview[];
        androidSplash: IconPreview[];
        iosIPhone: IconPreview[];
        iosIPad: IconPreview[];
        iosAppStore: IconPreview[];
        macos: IconPreview[];
        windows: IconPreview[];
        linux: IconPreview[];
    } | null>(null);
    const { t } = useTranslation();

    const handleFileDropped = useCallback((files: File[]) => {
        if (files.length > 0) {
            const file = files[0];
            setSourceImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }, []);

    // Generate previews when image is uploaded
    useEffect(() => {
        if (!previewUrl) {
            setIconPreviews(null);
            return;
        }

        const img = new Image();
        img.onload = () => {
            setIconPreviews({
                android: [
                    { size: 48, url: resizeImageToDataURL(img, 48), label: '48px (mdpi)' },
                    { size: 72, url: resizeImageToDataURL(img, 72), label: '72px (hdpi)' },
                    { size: 96, url: resizeImageToDataURL(img, 96), label: '96px (xhdpi)' },
                    { size: 144, url: resizeImageToDataURL(img, 144), label: '144px (xxhdpi)' },
                    { size: 192, url: resizeImageToDataURL(img, 192), label: '192px (xxxhdpi)' },
                    { size: 512, url: resizeImageToDataURL(img, 512), label: '512px (Play Store)' },
                ],
                androidRound: [
                    { size: 48, url: resizeImageCircularToDataURL(img, 48), label: '48px (mdpi)' },
                    { size: 72, url: resizeImageCircularToDataURL(img, 72), label: '72px (hdpi)' },
                    { size: 96, url: resizeImageCircularToDataURL(img, 96), label: '96px (xhdpi)' },
                    { size: 144, url: resizeImageCircularToDataURL(img, 144), label: '144px (xxhdpi)' },
                    { size: 192, url: resizeImageCircularToDataURL(img, 192), label: '192px (xxxhdpi)' },
                ],
                androidSplash: [
                    { size: 512, url: resizeImageRoundWithPaddingToDataURL(img, 512), label: '512px (Splash)' },
                ],
                iosIPhone: [
                    { size: 60, url: resizeImageToDataURL(img, 60), label: '60px' },
                    { size: 120, url: resizeImageToDataURL(img, 120), label: '120px' },
                    { size: 180, url: resizeImageToDataURL(img, 180), label: '180px' },
                ],
                iosIPad: [
                    { size: 76, url: resizeImageToDataURL(img, 76), label: '76px' },
                    { size: 152, url: resizeImageToDataURL(img, 152), label: '152px' },
                    { size: 167, url: resizeImageToDataURL(img, 167), label: '167px' },
                ],
                iosAppStore: [
                    { size: 1024, url: resizeImageToDataURL(img, 1024), label: '1024px' },
                ],
                macos: [
                    { size: 16, url: resizeImageToDataURL(img, 16), label: '16px' },
                    { size: 32, url: resizeImageToDataURL(img, 32), label: '32px' },
                    { size: 128, url: resizeImageToDataURL(img, 128), label: '128px' },
                    { size: 256, url: resizeImageToDataURL(img, 256), label: '256px' },
                    { size: 512, url: resizeImageToDataURL(img, 512), label: '512px' },
                    { size: 1024, url: resizeImageToDataURL(img, 1024), label: '1024px (@2x)' },
                ],
                windows: [
                    { size: 16, url: resizeImageToDataURL(img, 16), label: '16px' },
                    { size: 32, url: resizeImageToDataURL(img, 32), label: '32px' },
                    { size: 48, url: resizeImageToDataURL(img, 48), label: '48px' },
                    { size: 256, url: resizeImageToDataURL(img, 256), label: '256px' },
                ],
                linux: [
                    { size: 16, url: resizeImageToDataURL(img, 16), label: '16px' },
                    { size: 32, url: resizeImageToDataURL(img, 32), label: '32px' },
                    { size: 48, url: resizeImageToDataURL(img, 48), label: '48px' },
                    { size: 128, url: resizeImageToDataURL(img, 128), label: '128px' },
                    { size: 256, url: resizeImageToDataURL(img, 256), label: '256px' },
                ],
            });
        };
        img.src = previewUrl;
    }, [previewUrl]);

    const handleGenerate = async () => {
        if (!sourceImage || !previewUrl) return;

        setIsGenerating(true);
        try {
            const img = new Image();
            img.src = previewUrl;
            await new Promise((resolve) => (img.onload = resolve));

            const zip = new JSZip();

            // Process iOS Icons and generate Contents.json
            const contentsJson = {
                images: [] as any[],
                info: {
                    author: 'xcode',
                    version: 1
                }
            };

            for (const icon of IOS_ICONS) {
                const blob = await resizeImage(img, icon.size);
                zip.file(`${icon.path}/${icon.name}`, blob);

                // Add to Contents.json
                const scaleValue = icon.scale === '1x' ? 1 : icon.scale === '2x' ? 2 : 3;
                const pointSize = icon.size / scaleValue;

                contentsJson.images.push({
                    filename: icon.name,
                    idiom: icon.idiom,
                    scale: icon.scale,
                    size: `${pointSize}x${pointSize}`
                });
            }

            // Add Contents.json to the zip
            zip.file('ios/AppIcon.appiconset/Contents.json', JSON.stringify(contentsJson, null, 2));

            // Process Android Icons
            for (const icon of ANDROID_ICONS) {
                const blob = await resizeImage(img, icon.size);
                zip.file(`${icon.path}/${icon.name}`, blob);
            }

            // Process Android Round Icons
            for (const icon of ANDROID_ROUND_ICONS) {
                const blob = await resizeImageCircular(img, icon.size);
                zip.file(`${icon.path}/${icon.name}`, blob);
            }

            // Process Android Splash Icons
            for (const icon of ANDROID_SPLASH_ICONS) {
                const blob = await resizeImageRoundWithPadding(img, icon.size);
                zip.file(`${icon.path}/${icon.name}`, blob);
            }

            // Process macOS Icons
            for (const icon of MACOS_ICONS) {
                const blob = await resizeImage(img, icon.size);
                zip.file(`${icon.path}/${icon.name}`, blob);
            }

            // Process Windows Icons
            for (const icon of WINDOWS_ICONS) {
                const blob = await resizeImage(img, icon.size);
                zip.file(`${icon.path}/${icon.name}`, blob);
            }

            // Process Linux Icons
            for (const icon of LINUX_ICONS) {
                const blob = await resizeImage(img, icon.size);
                zip.file(`${icon.path}/${icon.name}`, blob);
            }

            // EXTRA: Save Store Icons to root for easy access
            const storeIcon1024 = await resizeImage(img, 1024);
            zip.file('AppStore_Icon_1024.png', storeIcon1024);

            const playStoreIcon512 = await resizeImage(img, 512);
            zip.file('PlayStore_Icon_512.png', playStoreIcon512);

            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, 'AppIcons.zip');
        } catch (error) {
            console.error('Error generating icons:', error);
            alert('Failed to generate icons. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const renderPlatformIcons = (title: string, icons: IconPreview[]) => (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">{title}</h3>
            <div className="flex flex-wrap gap-3">
                {icons.map((icon) => (
                    <div key={icon.url} className="flex flex-col items-center gap-1">
                        <div
                            className="border-2 border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-700 shadow-sm"
                            style={{ width: Math.min(icon.size, 80), height: Math.min(icon.size, 80) }}
                        >
                            <img src={icon.url} alt={icon.label} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{icon.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <ImageIcon className="text-blue-600" />
                    {t('iconGenerator.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('iconGenerator.description')}
                </p>

                {!sourceImage ? (
                    <DropZone onFilesDropped={handleFileDropped} className="h-64" />
                ) : (
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-md flex-shrink-0">
                                <img src={previewUrl!} alt="Source" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setSourceImage(null);
                                        setPreviewUrl(null);
                                    }}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    disabled={isGenerating}
                                >
                                    {t('iconGenerator.upload')}
                                </button>
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            {t('iconGenerator.generate')}...
                                        </>
                                    ) : (
                                        <>
                                            <Download size={20} />
                                            {t('iconGenerator.download')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {iconPreviews && (
                            <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Icon Preview</h3>

                                {/* Android */}
                                {renderPlatformIcons('Android', iconPreviews.android)}

                                {/* Android Round */}
                                {renderPlatformIcons('Android Round', iconPreviews.androidRound)}

                                {/* Android Splash */}
                                {renderPlatformIcons('Android Splash', iconPreviews.androidSplash)}

                                {/* iOS iPhone */}
                                {renderPlatformIcons('iOS - iPhone', iconPreviews.iosIPhone)}

                                {/* iOS iPad */}
                                {renderPlatformIcons('iOS - iPad', iconPreviews.iosIPad)}

                                {/* iOS App Store */}
                                {renderPlatformIcons('iOS - App Store', iconPreviews.iosAppStore)}

                                {/* macOS */}
                                {renderPlatformIcons('macOS', iconPreviews.macos)}

                                {/* Windows */}
                                {renderPlatformIcons('Windows', iconPreviews.windows)}

                                {/* Linux */}
                                {renderPlatformIcons('Linux', iconPreviews.linux)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
