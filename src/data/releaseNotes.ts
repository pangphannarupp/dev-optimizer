export interface ReleaseNote {
    version: string;
    date: string;
    changes: string[];
}

export const releaseNotes: ReleaseNote[] = [
    {
        version: '1.1.14',
        date: '2025-12-27',
        changes: [
            'Add new feature "Project Translation Verifier"'
        ]
    },
    {
        version: '1.1.13',
        date: '2025-12-26',
        changes: [
            'Improve performance',
        ]
    },
    {
        version: '1.1.12',
        date: '2025-12-24',
        changes: [
            'Improve performance',
            'Improve UI'
        ]
    },
    {
        version: '1.1.11',
        date: '2025-12-23',
        changes: [
            'Add new feature "Firebease Analytics"',
            'Improve feature "TOTP Generator"',
            'Improve performance'
        ]
    },
    {
        version: '1.1.10',
        date: '2025-12-22',
        changes: [
            'Improve feature "CV Generator"',
            'Improve feature "Programming Tutorial"',
            'Improve translation'
        ]
    },
    {
        version: '1.1.9',
        date: '2025-12-20',
        changes: [
            'Add new feature "Code PlayGround"',
            'Add new feature "CV Generator"',
            'Add new feature "Programming Tutorial"',
            'Add new feature "Audio Maker"',
        ]
    },
    {
        version: '1.1.8',
        date: '2025-12-19',
        changes: [
            'Add new feature "Code PlayGround"',
        ]
    },
    {
        version: '1.1.7',
        date: '2025-12-18',
        changes: [
            'Improve url path'
        ]
    },
    {
        version: '1.1.6',
        date: '2025-12-18',
        changes: [
            'Improve Khmer Font'
        ]
    },
    {
        version: '1.1.5',
        date: '2025-12-17',
        changes: [
            'Improve performance',
            'Improve UI'
        ]
    },
    {
        version: '1.1.4',
        date: '2025-12-17',
        changes: [
            'Improve feature "CSV to JSON"',
            'Improve feature "Markdown Editor"',
            'Improve feature "Code Quality Checker"',
        ]
    },
    {
        version: '1.1.3',
        date: '2025-12-16',
        changes: [
            'Add new feature "Markdown Editor"',
            'Improve feature "Validate Translation"',
            'Improve feature "Source Comparison"',
            'Improve feature "Code Quality Checker"',
            'Improve UI'
        ]
    },
    {
        version: '1.1.2',
        date: '2025-12-16',
        changes: [
            'Add new feature "JSON to Code"',
            'Add new feature "Mock Data Generator"',
            'Improve feature "TOTP Generator"',
            'Improve feature "Source Comparison"',
        ]
    },
    {
        version: '1.1.1',
        date: '2025-12-15',
        changes: [
            'Add new feature "Code Quality Checker"',
        ]
    },
    {
        version: '1.1.0',
        date: '2025-12-14',
        changes: [
            'Improve performance',
            'Improve translation',
            'Improve UI'
        ]
    },
    {
        version: '1.0.21',
        date: '2025-12-14',
        changes: [
            'Add new feature "TOTP Generator"',
            'Add new feature "Unix Timestamp Converter"',
            'Add new feature "Density Converter"',
            'Add new feature "Regex Tester"',
            'Add new feature "CSS Generator"',
            'Add new feature "Screenshot Frame"',
            'Add new feature "TOTP Generator"',
            'Improve feature "CSV to JSON"',
        ]
    },
    {
        version: '1.0.20',
        date: '2025-12-14',
        changes: [
            'Add new feature "Regex Tester"',
            'Add new feature "Curl Converter"',
            'Add new feature "CSS Generator"',
            'Improve Splash animation',
            'Improve performance',
            'Improve translation'
        ]
    },
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
