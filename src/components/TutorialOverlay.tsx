import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTutorial } from '../contexts/TutorialContext';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export const TutorialOverlay: React.FC = () => {
    const { t } = useTranslation();
    const { isActive, currentStep, nextStep, prevStep, endTutorial, currentStepIndex, activeTutorial } = useTutorial();
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [, setWindowSize] = useState({ width: 0, height: 0 });

    // Update window size and target position
    const updatePosition = () => {
        if (currentStep?.target) {
            const element = document.querySelector(currentStep.target);
            if (element) {
                const rect = element.getBoundingClientRect();
                setTargetRect(rect);
                // Scroll into view if needed
                element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            } else {
                setTargetRect(null);
            }
        }
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    useEffect(() => {
        if (isActive) {
            updatePosition();
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true);

            // Mutation observer to handle dynamic content changes
            const observer = new MutationObserver(updatePosition);
            observer.observe(document.body, { childList: true, subtree: true, attributes: true });

            return () => {
                window.removeEventListener('resize', updatePosition);
                window.removeEventListener('scroll', updatePosition, true);
                observer.disconnect();
            };
        }
    }, [isActive, currentStep]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isActive) return;
            if (e.key === 'ArrowRight') nextStep();
            if (e.key === 'ArrowLeft') prevStep();
            if (e.key === 'Escape') endTutorial();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isActive, nextStep, prevStep, endTutorial]);

    if (!isActive || !currentStep || !activeTutorial) return null;

    const isLastStep = currentStepIndex === activeTutorial.steps.length - 1;

    // Tooltip positioning logic
    const getTooltipStyle = () => {
        if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

        const padding = 16;
        let top = 0;
        let left = 0;
        let transform = '';

        // Simple positioning logic (prefer step.position, fallback to auto)
        // For now, let's just place it below or above
        const spaceBelow = window.innerHeight - targetRect.bottom;
        const spaceAbove = targetRect.top;

        if (currentStep.position === 'top' || (spaceAbove > 200 && spaceBelow < 200)) {
            top = targetRect.top - padding;
            left = targetRect.left + (targetRect.width / 2);
            transform = 'translate(-50%, -100%)';
        } else if (currentStep.position === 'bottom' || spaceBelow > 200) {
            top = targetRect.bottom + padding;
            left = targetRect.left + (targetRect.width / 2);
            transform = 'translate(-50%, 0)';
        } else if (currentStep.position === 'left') {
            top = targetRect.top + (targetRect.height / 2);
            left = targetRect.left - padding;
            transform = 'translate(-100%, -50%)';
        } else {
            // Default right or best fit
            top = targetRect.bottom + padding;
            left = targetRect.left + (targetRect.width / 2);
            transform = 'translate(-50%, 0)';
        }

        // Boundary checks to keep it on screen
        // Note: A more robust library like Popper.js would handle this better, 
        // but for "no external libs" we do basic clamping if needed.
        // We'll trust the transform for centering but might need clamping logic for edges logic later.

        return { top, left, transform };
    };

    return (
        <div className="fixed inset-0 z-50 pointer-events-none" style={{ width: '100vw', height: '100vh' }}>

            {/* SVG Mask for "Spotlight" effect */}
            <svg className="absolute inset-0 w-full h-full text-black/50" width="100%" height="100%">
                <defs>
                    <mask id="tutorial-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        {targetRect && (
                            <rect
                                x={targetRect.left - 5}
                                y={targetRect.top - 5}
                                width={targetRect.width + 10}
                                height={targetRect.height + 10}
                                rx="8"
                                fill="black"
                            />
                        )}
                    </mask>
                </defs>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="currentColor"
                    mask="url(#tutorial-mask)"
                    className="pointer-events-auto transition-all duration-300"
                />
            </svg>

            {/* Beacon / Highlighter border (Target indicator) */}
            {targetRect && !currentStep.disableBeacon && (
                <div
                    className="absolute border-2 border-blue-500 rounded-lg animate-pulse pointer-events-none transition-all duration-300"
                    style={{
                        top: targetRect.top - 5,
                        left: targetRect.left - 5,
                        width: targetRect.width + 10,
                        height: targetRect.height + 10,
                    }}
                />
            )}

            {/* Tooltip Card */}
            <div
                className="absolute pointer-events-auto flex flex-col w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300"
                style={{ ...getTooltipStyle(), position: 'absolute' }}
            >
                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                            {currentStep.title} {currentStepIndex + 1}/{activeTutorial.steps.length}
                        </h3>
                        <button
                            onClick={endTutorial}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                        {currentStep.content}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button
                            onClick={endTutorial}
                            className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-2 py-1"
                        >
                            {t('tutorial.skip')}
                        </button>

                        <div className="flex gap-2">
                            {currentStepIndex > 0 && (
                                <button
                                    onClick={prevStep}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                    <ChevronLeft size={14} /> {t('tutorial.back')}
                                </button>
                            )}
                            <button
                                onClick={nextStep}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/30 transition-colors"
                            >
                                {isLastStep ? (
                                    <>{t('tutorial.finish')} <Check size={14} /></>
                                ) : (
                                    <>{t('tutorial.next')} <ChevronRight size={14} /></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                {/* Progress bar */}
                <div className="h-1 w-full bg-gray-100 dark:bg-gray-900">
                    <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${((currentStepIndex + 1) / activeTutorial.steps.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
