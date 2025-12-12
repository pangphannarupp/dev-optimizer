export interface ReleaseNote {
    version: string;
    date: string;
    changes: string[];
}

export const releaseNotes: ReleaseNote[] = [
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
