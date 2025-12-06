import imageCompression from 'browser-image-compression';

export async function processImage(
    file: File,
    targetFormat: 'image/jpeg' | 'image/png' | 'image/webp',
    quality: number
): Promise<Blob> {
    const options = {
        maxSizeMB: 50, // High limit to allow quality control to dictate size
        maxWidthOrHeight: 8192, // Support 8K images
        useWebWorker: true,
        fileType: targetFormat,
        initialQuality: quality,
        alwaysKeepResolution: true,
    };

    try {
        // browser-image-compression handles both compression and format conversion
        // It works well for standard formats but might fail for others (SVG, ICO, BMP)
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (error) {
        console.warn('Standard compression failed, falling back to Canvas conversion:', error);
        try {
            return await convertViaCanvas(file, targetFormat, quality);
        } catch (fallbackError) {
            console.error('Fallback conversion failed:', fallbackError);
            throw new Error('Failed to process image');
        }
    }
}

async function convertViaCanvas(
    file: File,
    targetFormat: string,
    quality: number
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            // Fill white background for transparent images if converting to JPEG
            if (targetFormat === 'image/jpeg') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Canvas to Blob failed'));
                    }
                },
                targetFormat,
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            console.error(`Failed to load image for canvas conversion. Type: ${file.type}, Name: ${file.name}`);
            if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
                reject(new Error('HEIC/HEIF format is not supported by your browser for fallback conversion.'));
            } else {
                reject(new Error(`Failed to load image: ${file.name} (${file.type || 'unknown type'})`));
            }
        };

        img.src = url;
    });
}

export function createDownloadUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
}

export function revokeDownloadUrl(url: string) {
    URL.revokeObjectURL(url);
}
