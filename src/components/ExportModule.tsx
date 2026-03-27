import html2canvas from 'html2canvas';

export async function exportResultCard(elementId: string, studentName: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
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
