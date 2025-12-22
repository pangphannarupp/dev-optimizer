
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const newTranslations = {
    screenAudio: {
        title: "Screen Audio Studio",
        subtitle: "Professional Text-to-Speech Editor",
        voiceSettings: "Voice Settings",
        characterVoice: "Character Voice",
        speed: "Speed",
        pitch: "Pitch",
        emotiveStyles: "Emotive Styles",
        exportAudio: "Export Audio",
        exportNote: "Browser limitation: To download, you must share 'Tab Audio' in the popup.",
        saveRecording: "Save Recording",
        recordToDownload: "Record to Download",
        recordingState: "Recording... (Share Audio)",
        clearScript: "Clear Script",
        startReading: "Start Reading",
        resume: "Resume",
        pause: "Pause",
        editText: "Edit Text",
        khmerMissingTitle: "Khmer Voice Missing",
        khmerMissingText: "Your system does not appear to have a Khmer text-to-speech voice installed. The audio may sound incorrect.",
        installVoice: "Install Voice",
        installModalTitle: "Install Khmer Voice",
        installModalNote: "High-quality voices are part of your Operating System. You can install them for free in your settings.",
        gotIt: "Got it, thanks!",
        windows: "Windows 10/11",
        mac: "macOS",
        android: "Android",
        styles: {
            standard: "Standard",
            storyteller: "Storyteller",
            serious: "Serious",
            excited: "Excited",
            soft: "Soft"
        }
    },
    tutorial: {
        progTitle: "Programming Tutorials",
        progSubtitle: "Choose a technology to start learning",
        backToLanguages: "Back to Languages",
        searchTopics: "Search topics...",
        dsaTitle: "DSA Tutorial",
        visualizer: "Visualizer",
        start: "Start",
        running: "Running...",
        reset: "Reset",
        unsorted: "Unsorted",
        comparing: "Comparing",
        sorted: "Sorted",
        arrayMemory: "Array Memory Visualization",
        linkedList: "Linked List Visualization",
        stack: "Stack (LIFO) Visualization",
        queue: "Queue (FIFO) Visualization",
        bst: "Binary Search Tree",
        timeComplexity: "Time Complexity",
        spaceComplexity: "Space Complexity",
        visualGuide: "Visual Guide",
        guide: "Guide",
        example: "Example",
        explanation: "Explanation",
        implementation: "Implementation",
        selectTopic: "Select a topic to start learning",
        skip: "Skip",
        back: "Back",
        next: "Next",
        finish: "Finish"
    }
};

files.forEach(file => {
    const filePath = path.join(localesDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Check if keys already exist to avoid overwriting if run multiple times
    if (!content.screenAudio) {
        content.screenAudio = newTranslations.screenAudio;
        console.log(`Added screenAudio to ${file}`);
    } else {
        // Merge just in case
        content.screenAudio = { ...content.screenAudio, ...newTranslations.screenAudio };
        console.log(`Updated screenAudio in ${file}`);
    }

    if (!content.tutorial) {
        content.tutorial = newTranslations.tutorial;
        console.log(`Added tutorial to ${file}`);
    } else {
        content.tutorial = { ...content.tutorial, ...newTranslations.tutorial };
        console.log(`Updated tutorial in ${file}`);
    }

    fs.writeFileSync(filePath, JSON.stringify(content, null, 4));
});

console.log("All locale files updated successfully.");
