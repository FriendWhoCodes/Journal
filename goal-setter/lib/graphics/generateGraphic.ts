import { toPng } from 'html-to-image';
import { createRoot } from 'react-dom/client';

/**
 * Renders a React element off-screen and captures it as a PNG download.
 * Follows the same pattern as the existing PDF download in complete/page.tsx.
 */
export async function generateAndDownloadGraphic(
  element: React.ReactElement,
  width: number,
  height: number,
  fileName: string,
): Promise<void> {
  // Create off-screen container
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-9999px';
  wrapper.style.top = '0';
  wrapper.style.width = `${width}px`;
  wrapper.style.height = `${height}px`;
  wrapper.style.overflow = 'hidden';
  document.body.appendChild(wrapper);

  // Render the template
  const root = createRoot(wrapper);
  root.render(element);

  try {
    // Wait for fonts and a render cycle
    await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(resolve));
    // Small extra delay for paint
    await new Promise(resolve => setTimeout(resolve, 100));

    // Double-pass: first warms up font/style capture
    await toPng(wrapper, {
      width,
      height,
      pixelRatio: 1,
      cacheBust: true,
    });

    // Second pass produces the correct output
    const dataUrl = await toPng(wrapper, {
      width,
      height,
      pixelRatio: 1,
      cacheBust: true,
    });

    // Convert to blob and trigger download
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } finally {
    // Cleanup
    root.unmount();
    document.body.removeChild(wrapper);
  }
}
