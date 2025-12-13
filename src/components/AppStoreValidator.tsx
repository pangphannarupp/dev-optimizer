import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { DropZone } from './DropZone';
import { STORE_RULES, ImageRule } from '../data/storeRules';
import { Check, X, Info } from 'lucide-react';
import { clsx } from 'clsx';

type ValidationResult = {
    valid: boolean;
    errors: string[];
    width?: number;
    height?: number;
    size?: number;
};

export const AppStoreValidator: React.FC = () => {
    const { t } = useTranslation();
    const [platform, setPlatform] = useState<keyof typeof STORE_RULES>('playStore');
    const [validations, setValidations] = useState<Record<string, ValidationResult>>({});

    const currentRules = STORE_RULES[platform];

    const validateFile = async (file: File, rule: ImageRule): Promise<ValidationResult> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const errors: string[] = [];

                // Type check
                const ext = file.name.split('.').pop()?.toLowerCase();
                if (!rule.allowedTypes.includes(ext || '')) {
                    errors.push(t('storeValidator.invalidFileType', { allowed: rule.allowedTypes.join(', ') }));
                }

                // Dimension checks
                if (rule.width && img.width !== rule.width) errors.push(t('storeValidator.widthError', { width: rule.width, found: img.width }));
                if (rule.height && img.height !== rule.height) errors.push(t('storeValidator.heightError', { height: rule.height, found: img.height }));

                if (rule.minWidth && img.width < rule.minWidth) errors.push(t('storeValidator.minWidthError', { minWidth: rule.minWidth, found: img.width }));
                if (rule.minHeight && img.height < rule.minHeight) errors.push(t('storeValidator.minHeightError', { minHeight: rule.minHeight, found: img.height }));

                // Size check
                if (rule.maxSizeBytes && file.size > rule.maxSizeBytes) {
                    errors.push(t('storeValidator.fileTooLarge', {
                        max: (rule.maxSizeBytes / 1024 / 1024).toFixed(1),
                        found: (file.size / 1024 / 1024).toFixed(2)
                    }));
                }

                // Max Dimension check
                if (rule.maxDimension) {
                    const maxDim = Math.max(img.width, img.height);
                    if (maxDim > rule.maxDimension) {
                        errors.push(t('storeValidator.maxDimensionError', {
                            max: rule.maxDimension,
                            found: maxDim
                        }));
                    }
                }

                // Max Aspect Ratio check (e.g. 2:1)
                if (rule.maxAspectRatio) {
                    const ratio = Math.max(img.width, img.height) / Math.max(Math.min(img.width, img.height), 1);
                    if (ratio > rule.maxAspectRatio) {
                        errors.push(t('storeValidator.aspectRatioError'));
                    }
                }

                // Square check
                if (rule.noSquare && img.width === img.height) {
                    errors.push(t('storeValidator.squareError'));
                }

                // Transparency check
                if (rule.noTransparency) {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0);
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const data = imageData.data;
                        let hasTransparency = false;

                        for (let i = 3; i < data.length; i += 4) {
                            if (data[i] < 255) {
                                hasTransparency = true;
                                break;
                            }
                        }

                        if (hasTransparency) {
                            errors.push(t('storeValidator.transparencyError'));
                        }
                    }
                }

                resolve({
                    valid: errors.length === 0,
                    errors,
                    width: img.width,
                    height: img.height,
                    size: file.size
                });
            };
            img.onerror = () => {
                resolve({ valid: false, errors: [t('storeValidator.failedToLoad')] });
            };
            img.src = URL.createObjectURL(file);
        });
    };

    const handleDrop = (section: string, rule: ImageRule) => async (files: File[]) => {
        // Handle multiple files for screenshots, single for icon/feature
        for (const file of files) {
            const result = await validateFile(file, rule);
            setValidations(prev => ({
                ...prev,
                [`${section}-${file.name}`]: result
            }));
        }
    };

    const renderSection = (key: string, rule: ImageRule, label: string) => {
        return (
            <div className="flex flex-col gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{label || rule.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {rule.width ? `${rule.width}x${rule.height}` : `Min ${rule.minWidth}x${rule.minHeight}`}
                            {rule.maxDimension && ` • Max ${rule.maxDimension}px`}
                            {rule.allowedTypes.length > 0 && ` • ${rule.allowedTypes.join('/').toUpperCase()}`}
                        </p>
                    </div>
                </div>

                <DropZone
                    onFilesDropped={handleDrop(key, rule)}
                    multiple={key.includes('screenshots')}
                    accept={rule.allowedTypes.map(t => `.${t}`).join(',')}
                    validator={() => true} // We do custom validation
                    supportedText={t('storeValidator.dropToValidate')}
                    className="min-h-[120px]"
                />

                {/* Results List */}
                <div className="flex flex-col gap-2 mt-2">
                    {Object.entries(validations)
                        .filter(([k]) => k.startsWith(`${key}-`))
                        .map(([k, res]) => {
                            const fileName = k.replace(`${key}-`, '');
                            return (
                                <div key={k} className={clsx(
                                    "flex items-center gap-2 p-2 rounded text-sm border",
                                    res.valid ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30" : "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30"
                                )}>
                                    {res.valid ? <Check size={16} className="text-green-600" /> : <X size={16} className="text-red-600" />}
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-700 dark:text-gray-300 truncate">{fileName}</div>
                                        {res.errors.length > 0 && (
                                            <div className="text-xs text-red-600 dark:text-red-400">
                                                {res.errors.join(', ')}
                                            </div>
                                        )}
                                        {res.valid && (
                                            <div className="text-xs text-green-600 dark:text-green-400">
                                                {res.width}x{res.height} • {(res.size! / 1024).toFixed(1)} KB
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {t('storeValidator.title')}
                </h2>

                {/* Platform Selector */}
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    {(Object.keys(STORE_RULES) as Array<keyof typeof STORE_RULES>).map((p) => (
                        <button
                            key={p}
                            onClick={() => { setPlatform(p); setValidations({}); }}
                            className={clsx(
                                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                                platform === p ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                            )}
                        >
                            {STORE_RULES[p].name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Icon */}
                {currentRules.icon && renderSection('icon', currentRules.icon, t('storeValidator.appIcon'))}

                {/* Feature Graphic */}
                {currentRules.feature && renderSection('feature', currentRules.feature, t('storeValidator.featureGraphic'))}

                {/* Screenshots */}
                {currentRules.screenshots.phone && renderSection('ss-phone', currentRules.screenshots.phone, t('storeValidator.phoneScreenshots'))}

                {/* Tablet Screenshots (Conditional) */}
                {platform === 'playStore' && (
                    <>
                        {renderSection('ss-tab7', DIRECT_RULES.playStore.screenshots.tablet7!, t('storeValidator.tablet7'))}
                        {renderSection('ss-tab10', DIRECT_RULES.playStore.screenshots.tablet10!, t('storeValidator.tablet10'))}
                    </>
                )}

                {platform === 'appStore' && (
                    <>
                        {renderSection('ss-iphone65', DIRECT_RULES.appStore.screenshots.iphone65!, t('storeValidator.iphone65'))}
                        {renderSection('ss-iphone55', DIRECT_RULES.appStore.screenshots.iphone55!, t('storeValidator.iphone55'))}
                        {renderSection('ss-ipad', DIRECT_RULES.appStore.screenshots.ipad!, t('storeValidator.ipadPro'))}
                    </>
                )}
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30 text-sm text-blue-700 dark:text-blue-300 flex items-start gap-3">
                <Info className="flex-shrink-0 mt-0.5" size={18} />
                <div>
                    <div>
                        <Trans
                            i18nKey="storeValidator.usingSpecs"
                            values={{ name: currentRules.name }}
                            components={[<strong key="0" />]}
                            defaults="Using specs for <0>{{name}}</0>. Drag images to check dimensions and file size limits."
                        />
                    </div>
                    <div>{t('storeValidator.redIndicators')}</div>
                </div>
            </div>
        </div>
    );
};

// Quick fix for type inference in render block above
const DIRECT_RULES = STORE_RULES; 
