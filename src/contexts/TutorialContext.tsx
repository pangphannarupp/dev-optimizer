import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Tutorial, TutorialStep } from '../types/TutorialTypes';

interface TutorialContextProps {
    activeTutorial: Tutorial | null;
    currentStepIndex: number;
    currentStep: TutorialStep | null;
    isActive: boolean;
    startTutorial: (tutorialId: string) => void;
    endTutorial: () => void;
    nextStep: () => void;
    prevStep: () => void;
    registerTutorial: (tutorial: Tutorial) => void;
}

const TutorialContext = createContext<TutorialContextProps | undefined>(undefined);

export const TutorialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tutorials, setTutorials] = useState<Record<string, Tutorial>>({});
    const [activeTutorialId, setActiveTutorialId] = useState<string | null>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const activeTutorial = activeTutorialId ? tutorials[activeTutorialId] : null;
    const isActive = !!activeTutorial;
    const currentStep = activeTutorial ? activeTutorial.steps[currentStepIndex] : null;

    const registerTutorial = useCallback((tutorial: Tutorial) => {
        setTutorials(prev => ({ ...prev, [tutorial.id]: tutorial }));
    }, []);

    const startTutorial = useCallback((tutorialId: string) => {
        if (tutorials[tutorialId]) {
            setActiveTutorialId(tutorialId);
            setCurrentStepIndex(0);
        } else {
            console.warn(`Tutorial with ID ${tutorialId} not found.`);
        }
    }, [tutorials]);

    const endTutorial = useCallback(() => {
        setActiveTutorialId(null);
        setCurrentStepIndex(0);
    }, []);

    const nextStep = useCallback(() => {
        if (!activeTutorial) return;
        if (currentStepIndex < activeTutorial.steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            endTutorial();
        }
    }, [activeTutorial, currentStepIndex, endTutorial]);

    const prevStep = useCallback(() => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    }, [currentStepIndex]);

    return (
        <TutorialContext.Provider
            value={{
                activeTutorial,
                currentStepIndex,
                currentStep,
                isActive,
                startTutorial,
                endTutorial,
                nextStep,
                prevStep,
                registerTutorial,
            }}
        >
            {children}
        </TutorialContext.Provider>
    );
};

export const useTutorial = () => {
    const context = useContext(TutorialContext);
    if (!context) {
        throw new Error('useTutorial must be used within a TutorialProvider');
    }
    return context;
};
