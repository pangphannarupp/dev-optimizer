import s2v from 'svg2vectordrawable/src/main.browser';

export async function convertSvgToAndroidDrawable(svgContent: string): Promise<string> {
  try {
    return await s2v(svgContent);
  } catch (error) {
    console.error('Conversion failed:', error);
    throw error;
  }
}
