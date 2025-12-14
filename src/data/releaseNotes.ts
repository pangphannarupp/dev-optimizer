export interface ReleaseNote {
    version: string;
    date: string;
    changes: string[];
}

export const releaseNotes: ReleaseNote[] = [
    {
        version: '1.0.19',
        date: '2025-12-13',
        changes: [
            'Add Splash Animation',
            'Add new feature "Download App"',
        ]
    },
    {
        version: '1.0.18',
        date: '2025-12-13',
        changes: [
            'Improve feature "Source Comparison"',
            'Improve feature "Store Validator"',
            'Add new feature "JS Minifier"',
            'Add new feature "Deeplink Generator"',
            'Improve feature "Validate Translation"',
            'Improve menu'
        ]
    },
    {
        version: '1.0.17',
        date: '2025-12-13',
        changes: [
            'Add new feature "Lottie Player"',
            'Add new feature "Search Menu"',
            'Add new feature "Add favorite Menu"',
            'Improve feature "Validate Translation"',
            'Improve feature "Store Validator"',
            'Improve translation'
        ]
    },
    {
        version: '1.0.16',
        date: '2025-12-13',
        changes: [
            'Add new feature "View Mindmap" in CSV to JSON',
            'Implement barcode generator',
            'Implement qr extractor',
            'Improve qr code generator',
            'Improve translation validation to support more file types',
            'Improve performance'
        ]
    },
    {
        version: '1.0.15',
        date: '2025-12-13',
        changes: [
            'Implement App Store Validator',
            'Upgrade translation validation export to XLSX',
            'Improve performance'
        ]
    },
    {
        version: '1.0.14',
        date: '2025-12-12',
        changes: [
            'Create Release Notes',
            'Improve performance'
        ]
    },
    {
        version: '1.0.13',
        date: '2025-12-11',
        changes: [
            'Generate round Android app icon in menu App Icon Generator',
            'Generate round Android splash icon in menu App Icon Generator',
            'Add new feature "Source Comparison"',
            'Add new feature "Base64 to Image" in menu Image to Base64',
            'Add new feature "Import CSV/Excel" in menu CSV to JSON',
            'Add new feature "Export JSON to CSV/Excel" in menu JSON to CSV',
            'Improve feature "Validate Translation"'
        ]
    }
];
