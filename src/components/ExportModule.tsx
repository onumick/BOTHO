import html2canvas from 'html2canvas';

async function waitForImagesInElement(element: HTMLElement, timeoutMs = 3000): Promise<void> {
  const images = Array.from(element.querySelectorAll('img'));
  const pending = images.filter((img) => !img.complete);

  if (pending.length === 0) {
    return;
  }

  await Promise.race([
    Promise.all(
      pending.map(
        (img) =>
          new Promise<void>((resolve) => {
            img.addEventListener('load', () => resolve(), { once: true });
            img.addEventListener('error', () => resolve(), { once: true });
          }),
      ),
    ),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}

export async function exportResultCard(elementId: string, studentName: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    await waitForImagesInElement(element);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff', // Ensure white background
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const safeName = (studentName || 'Student').replace(/\s+/g, '_');
    
    // Create download link
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `${safeName}_Botho_GPA_Report.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Export failed:', error);
  }
}
