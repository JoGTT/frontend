// Utilidad para generar PDFs de alta calidad con html2canvas
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PDFOptions {
  filename?: string;
  quality?: number;
  scale?: number;
}

export const generateHighQualityPDF = async (
  element: HTMLElement, 
  options: PDFOptions = {}
): Promise<void> => {
  const { filename = 'document.pdf', quality = 1.0, scale = 3 } = options;

  try {
    // PASO 1: Preparar elemento para captura
    const originalStyles = {
      transform: element.style.transform,
      transformOrigin: element.style.transformOrigin
    };

    // PASO 2: Configurar html2canvas para alta resolución
    const canvas = await html2canvas(element, {
      allowTaint: false,
      useCORS: true,
      scale: scale, // 3x para 300 DPI
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      backgroundColor: '#ffffff',
      removeContainer: true,
      imageTimeout: 15000,
      logging: false
    });

    // PASO 3: Configurar PDF
    const imgData = canvas.toDataURL('image/jpeg', quality);
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: false
    });

    const pageWidth = 210; // A4
    const pageHeight = 297;
    const margin = 5;
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - (margin * 2);

    // Calcular dimensiones manteniendo proporción
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(maxWidth / (imgWidth * 0.264583), maxHeight / (imgHeight * 0.264583));

    const finalWidth = imgWidth * 0.264583 * ratio;
    const finalHeight = imgHeight * 0.264583 * ratio;

    // Centrar en página
    const x = (pageWidth - finalWidth) / 2;
    const y = (pageHeight - finalHeight) / 2;

    // PASO 4: Agregar imagen al PDF
    pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight, undefined, 'FAST');

    // PASO 5: Guardar
    pdf.save(filename);

    // Restaurar estilos originales
    element.style.transform = originalStyles.transform;
    element.style.transformOrigin = originalStyles.transformOrigin;

  } catch (error) {
    console.error('Error generando PDF:', error);
    throw error;
  }
};

export default generateHighQualityPDF;