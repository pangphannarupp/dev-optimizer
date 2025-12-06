import { removeBackground as removeBg, Config } from '@imgly/background-removal';

/**
 * Sharpen an image using unsharp mask algorithm
 * @param imageData Original ImageData from canvas
 * @param amount Sharpening intensity (0-2, default 1)
 * @returns Sharpened ImageData
 */
export function sharpenImage(imageData: ImageData, amount: number = 1): ImageData {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const result = new ImageData(width, height);

    // Gaussian blur kernel for unsharp mask
    const kernel = [
        [1, 2, 1],
        [2, 4, 2],
        [1, 2, 1]
    ];
    const kernelWeight = 16;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;

            // Skip edges
            if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                result.data[idx] = data[idx];
                result.data[idx + 1] = data[idx + 1];
                result.data[idx + 2] = data[idx + 2];
                result.data[idx + 3] = data[idx + 3];
                continue;
            }

            // Apply gaussian blur
            let r = 0, g = 0, b = 0;
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const pixelIdx = ((y + ky) * width + (x + kx)) * 4;
                    const weight = kernel[ky + 1][kx + 1];
                    r += data[pixelIdx] * weight;
                    g += data[pixelIdx + 1] * weight;
                    b += data[pixelIdx + 2] * weight;
                }
            }
            r /= kernelWeight;
            g /= kernelWeight;
            b /= kernelWeight;

            // Unsharp mask: original + amount * (original - blurred)
            result.data[idx] = Math.min(255, Math.max(0, data[idx] + amount * (data[idx] - r)));
            result.data[idx + 1] = Math.min(255, Math.max(0, data[idx + 1] + amount * (data[idx + 1] - g)));
            result.data[idx + 2] = Math.min(255, Math.max(0, data[idx + 2] + amount * (data[idx + 2] - b)));
            result.data[idx + 3] = data[idx + 3]; // Keep alpha
        }
    }

    return result;
}

/**
 * Remove background from an image
 * @param imageFile Source image file
 * @param backgroundColor Optional background color (default: transparent)
 * @returns Blob of the processed image
 */
export async function removeBackground(
    imageFile: File,
    backgroundColor?: string
): Promise<Blob> {
    const config: Config = {
        output: {
            format: 'image/png',
            quality: 1,
        }
    };

    const blob = await removeBg(imageFile, config);

    // If background color is specified, composite it
    if (backgroundColor && backgroundColor !== 'transparent') {
        return await compositeBackground(blob, backgroundColor);
    }

    return blob;
}

/**
 * Composite a background color onto a transparent image
 */
async function compositeBackground(blob: Blob, color: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Canvas context not available'));
                return;
            }

            // Fill background
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw image on top
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((resultBlob) => {
                if (resultBlob) resolve(resultBlob);
                else reject(new Error('Canvas to Blob failed'));
            }, 'image/png');
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(blob);
    });
}
