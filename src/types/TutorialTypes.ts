
export type TutorialPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TutorialStep {
    target: string; // CSS selector
    title: string;
    content: string;
    position?: TutorialPosition;
    disableBeacon?: boolean; // If true, auto-open tooltip without pulsating beacon
}

export interface Tutorial {
    id: string;
    steps: TutorialStep[];
}
