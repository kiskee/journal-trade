import React, {
  useState,
  useRef,
  useEffect,
  type MouseEvent,
  type TouchEvent,
  type ChangeEvent,
} from "react";
import {
  Download,
  FileText,
  PenTool,
  RotateCcw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";


// Tipos de datos
interface ContractData {
  nombres: string;
  apellidos: string;
  fecha: string;
}

interface SignaturePosition {
  x: number;
  y: number;
}

interface PDFSignatureComponentProps {
  onPDFGenerated?: (pdfData: Blob) => void;
  initialData?: Partial<ContractData>;
  className?: string;
}

const PDFSignatureComponent: React.FC<PDFSignatureComponentProps> = ({
  onPDFGenerated,
  initialData,
  className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [pdfGenerated, setPdfGenerated] = useState<boolean>(false);
  const [, setLastPosition] = useState<SignaturePosition>({
    x: 0,
    y: 0,
  });
  const [contractData, setContractData] = useState<ContractData>({
    nombres: initialData?.nombres || "",
    apellidos: initialData?.apellidos || "",
    fecha: initialData?.fecha || new Date().toLocaleDateString("es-CO"),
  });

  // Configurar canvas al montar el componente
  useEffect(() => {
    initializeCanvas();
  }, []);

  const initializeCanvas = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configurar canvas
    canvas.width = 400;
    canvas.height = 200;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Limpiar canvas con fondo transparente
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Restaurar estilo de firma
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
  };

  // Función unificada para obtener posición (mouse o touch)
  const getPosition = (
    e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>
  ): SignaturePosition => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;

    if ('touches' in e) {
      // Evento táctil
      const touch = e.touches[0] || e.changedTouches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      // Evento de mouse
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // Eventos de mouse
  const startDrawing = (e: MouseEvent<HTMLCanvasElement>): void => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getPosition(e);
    setLastPosition(pos);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: MouseEvent<HTMLCanvasElement>): void => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getPosition(e);

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    setLastPosition(pos);
  };

  const stopDrawing = (): void => {
    if (!isDrawing) return;

    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Capturar la firma como data URL con fondo transparente
    const dataURL = canvas.toDataURL("image/png");
    setSignatureData(dataURL);
  };

  // Eventos táctiles
  const startTouchDrawing = (e: TouchEvent<HTMLCanvasElement>): void => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getPosition(e);
    setLastPosition(pos);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const drawTouch = (e: TouchEvent<HTMLCanvasElement>): void => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getPosition(e);

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    setLastPosition(pos);
  };

  const stopTouchDrawing = (e: TouchEvent<HTMLCanvasElement>): void => {
    e.preventDefault();
    if (!isDrawing) return;

    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Capturar la firma como data URL con fondo transparente
    const dataURL = canvas.toDataURL("image/png");
    setSignatureData(dataURL);
  };

  const clearSignature = (): void => {
    initializeCanvas();
    setSignatureData(null);
    setPdfGenerated(false);
  };

  const isSignatureEmpty = (): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return true;

    const ctx = canvas.getContext("2d");
    if (!ctx) return true;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Verificar si hay píxeles no transparentes (firma)
    for (let i = 3; i < data.length; i += 4) {
      const alpha = data[i];
      // Si encuentra un píxel que no es transparente
      if (alpha > 0) {
        return false;
      }
    }

    return true;
  };

  const generatePDF = async (): Promise<void> => {
    if (!signatureData || isSignatureEmpty()) {
      alert("Por favor, firme el documento primero");
      return;
    }

    if (!contractData.nombres || !contractData.apellidos) {
      alert("Por favor, complete todos los campos requeridos");
      return;
    }

    try {
      console.log(import.meta.env.VITE_UPSALA_PDF)
      const existingPdfBytes = await fetch(
        import.meta.env.VITE_UPSALA_PDF
      ).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      const [firstPage, secondPage] = pdfDoc.getPages();

      // Insertar NOMBRE COMPLETO en la página 1 (línea del "El suscrito:")
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 11;
      const fullName = `${contractData.nombres} ${contractData.apellidos}`;

      firstPage.drawText(fullName, {
        x: 140,
        y: 565,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });

      const date = contractData.fecha.replace(/\//g, "         ");

      firstPage.drawText(date, {
        x: 230,
        y: 475,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });

      // Insertar FIRMA en página 2 con fondo transparente
      const pngImageBytes = await fetch(signatureData).then((res) =>
        res.arrayBuffer()
      );
      const pngImage = await pdfDoc.embedPng(pngImageBytes);
      const scaled = pngImage.scale(0.25);
      const x = 250;
      const y = 55;

      secondPage.drawImage(pngImage, {
        x,
        y,
        width: scaled.width,
        height: scaled.height,
      });

      // Guardar PDF
      const pdfBytes: any = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compromiso_firmado.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setPdfGenerated(true);
      onPDFGenerated?.(blob);
      

      alert("PDF generado y descargado exitosamente");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Error al generar el PDF");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setContractData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = (): boolean => {
    return Boolean(
      contractData.nombres &&
        contractData.apellidos &&
        signatureData &&
        !isSignatureEmpty()
    );
  };

  return (
    <div
      className={`max-w-4xl mx-auto p-4 sm:p-6 bg-black rounded-lg shadow-lg text-white ${className}`}
    >
      <div className="text-center mb-6">
        <h2 className="text-lg sx:text-xl ss:text-2xl font-bold text-yellow-500 mb-2">
          Firma Digital del Contrato
        </h2>
        <p className="text-sm text-gray-300">
          Complete sus datos y firme digitalmente para generar el PDF
        </p>
      </div>

      {/* Datos del Contrato */}
      <div className="mb-8 p-4 sm:p-6 bg-zinc-900 rounded-lg">
        <h3 className="text-base font-semibold text-yellow-500 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-yellow-500" />
          Datos del Contrato
        </h3>

        <div className="grid grid-cols-1 ss:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Nombres *
            </label>
            <input
              type="text"
              name="nombres"
              value={contractData.nombres}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm bg-black text-white border border-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Ingrese sus nombres"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Apellidos *
            </label>
            <input
              type="text"
              name="apellidos"
              value={contractData.apellidos}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm bg-black text-white border border-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Ingrese sus apellidos"
              required
            />
          </div>
          <div className="ss:col-span-2">
            <label className="block text-sm font-medium text-white mb-1">
              Fecha
            </label>
            <input
              type="text"
              value={contractData.fecha}
              readOnly
              className="w-full px-3 py-2 text-sm bg-zinc-800 text-gray-400 border border-yellow-500 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Área de Firma */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-yellow-500 mb-4 flex items-center">
          <PenTool className="w-5 h-5 mr-2 text-yellow-500" />
          Firma Digital
        </h3>

        <div className="border-2 border-dashed border-yellow-500 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-300 mb-4">
            Dibuje su firma en el área blanca usando el mouse o su dedo en dispositivos móviles
          </p>
          
          <canvas
            ref={canvasRef}
            // Eventos de mouse
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            // Eventos táctiles
            onTouchStart={startTouchDrawing}
            onTouchMove={drawTouch}
            onTouchEnd={stopTouchDrawing}
            onTouchCancel={stopTouchDrawing}
            className="w-full max-w-xs sm:max-w-md border border-yellow-500 rounded-md mx-auto cursor-crosshair bg-white touch-none"
            style={{ touchAction: "none" }}
          />

          <div className="mt-4 space-y-2 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center items-center">
            <button
              onClick={clearSignature}
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 text-sm bg-yellow-500 text-black rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Limpiar Firma
            </button>
          </div>
        </div>
      </div>

      {/* Estado de la Firma */}
      {signatureData && !isSignatureEmpty() && (
        <div className="mb-6 p-4 bg-green-900 border border-green-600 rounded-lg">
          <div className="flex items-center text-green-400 text-sm">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>Firma capturada exitosamente</span>
          </div>
        </div>
      )}

      {/* Validación de Formulario */}
      {(!contractData.nombres || !contractData.apellidos) && (
        <div className="mb-6 p-4 bg-yellow-900 border border-yellow-600 rounded-lg">
          <div className="flex items-center text-yellow-300 text-sm">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>Complete todos los campos requeridos</span>
          </div>
        </div>
      )}

      {/* Botón de Descarga */}
      <div className="text-center">
        <button
          onClick={generatePDF}
          disabled={!isFormValid()}
          type="button"
          className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          <Download className="w-5 h-5 mr-2" />
          Generar y Descargar PDF Firmado
        </button>
      </div>

      {pdfGenerated && (
        <div className="mt-6 p-4 bg-yellow-900 border border-yellow-600 rounded-lg">
          <div className="flex items-center text-yellow-300 text-sm">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>PDF generado y descargado exitosamente</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFSignatureComponent;