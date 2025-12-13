
export interface ImageRule {
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    maxSizeBytes?: number; // 1MB = 1024*1024
    allowedTypes: string[]; // ['png', 'jpg', 'jpeg']
    required: boolean;
    name: string;
    aspectRatio?: number; // width/height
    aspectRatioTolerance?: number;
}

export interface PlatformRules {
    name: string;
    icon: ImageRule;
    feature?: ImageRule;
    screenshots: {
        phone: ImageRule;
        tablet7?: ImageRule;
        tablet10?: ImageRule;
        ipad?: ImageRule;
        iphone65?: ImageRule;
        iphone55?: ImageRule;
    };
}

export const STORE_RULES: Record<string, PlatformRules> = {
    playStore: {
        name: 'Google Play Store',
        icon: {
            name: 'App Icon',
            width: 512,
            height: 512,
            maxSizeBytes: 1024 * 1024, // 1MB
            allowedTypes: ['png'],
            required: true
        },
        feature: {
            name: 'Feature Graphic',
            width: 1024,
            height: 500,
            maxSizeBytes: 1024 * 1024,
            allowedTypes: ['png', 'jpg', 'jpeg'],
            required: true
        },
        screenshots: {
            phone: {
                name: 'Phone Screenshots',
                minWidth: 320,
                minHeight: 320,
                // Max dimension 3840
                allowedTypes: ['png', 'jpg', 'jpeg'],
                required: true,
                // Aspect ratio logic is complex for Play Store (2:1 to 1:2), handled in code
            },
            tablet7: {
                name: '7-inch Tablet Screenshots',
                minWidth: 320,
                minHeight: 320,
                allowedTypes: ['png', 'jpg', 'jpeg'],
                required: false
            },
            tablet10: {
                name: '10-inch Tablet Screenshots',
                minWidth: 320,
                minHeight: 320,
                allowedTypes: ['png', 'jpg', 'jpeg'],
                required: false
            }
        }
    },
    appStore: {
        name: 'Apple App Store',
        icon: {
            name: 'App Icon',
            width: 1024,
            height: 1024,
            allowedTypes: ['png', 'jpg', 'jpeg'], // No alpha for icon usually, but validator can check size
            required: true
        },
        screenshots: {
            iphone65: {
                name: 'iPhone 6.5" Display (1284 x 2778 or 1242 x 2688)',
                // Apple is strict. We might need a flexible array of allowed dimensions.
                // For simplified validation, we'll check allowing specific dimensions in logic
                allowedTypes: ['png', 'jpg', 'jpeg'],
                required: true,
                minWidth: 1242,
                minHeight: 2208 // Generalized for now, logic will be specific
            },
            iphone55: {
                name: 'iPhone 5.5" Display (1242 x 2208)',
                width: 1242,
                height: 2208,
                allowedTypes: ['png', 'jpg', 'jpeg'],
                required: true
            },
            ipad: {
                name: 'iPad Pro (2nd/3rd Gen) (2048 x 2732)',
                width: 2048,
                height: 2732,
                allowedTypes: ['png', 'jpg', 'jpeg'],
                required: true
            },
            phone: { // Abstract fallback
                name: 'iPhone Screenshots',
                allowedTypes: ['png', 'jpg', 'jpeg'],
                required: true
            }
        }
    },
    huawei: {
        name: 'Huawei AppGallery',
        icon: {
            name: 'App Icon',
            width: 216,
            height: 216, // Huawei sometimes asks for 216 or 512. Let's assume 512 is standard now? 
            // Checking docs: 216x216 or 512x512. We'll enforce 512 for better quality if not strict.
            // Let's stick to 216 or 512.
            allowedTypes: ['png'],
            required: true
        },
        screenshots: {
            phone: {
                name: 'Phone Screenshots',
                minWidth: 320, // Huawei logic similar to Play Store usually
                allowedTypes: ['png', 'jpg', 'jpeg'],
                required: true
            }
        }
    }
};
