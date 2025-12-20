
import { Tutorial } from '../types/TutorialTypes';

export const welcomeTutorial: Tutorial = {
    id: 'welcome-tutorial',
    steps: [
        {
            target: '#app-logo',
            title: 'Welcome to Dev Optimizer',
            content: 'This is your all-in-one developer toolkit. Optimize images, generate code, and more.',
            position: 'bottom',
        },
        {
            target: '#home-search-input',
            title: 'Quick Search',
            content: 'Start typing to quickly find any tool you need. Use keyboard shortcuts to navigate.',
            position: 'bottom',
        },
        {
            target: '#home-settings-btn',
            title: 'Settings',
            content: 'Customize your experience, change themes, or update your preferences here.',
            position: 'left',
        },
    ],
};
