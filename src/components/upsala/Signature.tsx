import React, {
  useState,
  useRef,
  useEffect,
  type MouseEvent,
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
  //numeroDocumento: string;
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
    //numeroDocumento: initialData?.numeroDocumento || "",
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

    // Restaurar estilo de firma
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
  };

  const getMousePosition = (
    e: MouseEvent<HTMLCanvasElement>
  ): SignaturePosition => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: MouseEvent<HTMLCanvasElement>): void => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getMousePosition(e);
    setLastPosition(pos);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: MouseEvent<HTMLCanvasElement>): void => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getMousePosition(e);

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    setLastPosition(pos);
  };

  const stopDrawing = (): void => {
    if (!isDrawing) return;

    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Capturar la firma como data URL
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

    // Verificar si hay píxeles no blancos (firma)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Si encuentra un píxel que no es blanco o transparente
      if (a > 0 && (r !== 255 || g !== 255 || b !== 255)) {
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
        x: 140, // ajusta según lo necesario
        y: 565, // ajusta según la línea horizontal
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });

      const date = contractData.fecha.replace(/\//g, "         ");

      firstPage.drawText(date, {
        x: 230, // ajusta según lo necesario
        y: 475, // ajusta según la línea horizontal
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });

      // Insertar FIRMA en página 2
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
      const pdfBytes = await pdfDoc.save();
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
        //contractData.numeroDocumento &&
        signatureData &&
        !isSignatureEmpty()
    );
  };

  return (
    <div
      className={`max-w-4xl mx-auto p-6 bg-black rounded-lg shadow-lg text-white ${className}`}
    >
      <div className="text-center mb-6">
        <h2 className="text-xl ss:text-2xl font-bold text-yellow-500 mb-2">
          Firma Digital del Contrato
        </h2>
        <p className="text-gray-300">
          Complete sus datos y firme digitalmente para generar el PDF
        </p>
      </div>

      {/* Datos del Contrato */}
      <div className="mb-8 p-6 bg-zinc-900 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-500 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-yellow-500" />
          Datos del Contrato
        </h3>
        <div className="grid grid-cols-1 ss:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Nombres *
            </label>
            <input
              type="text"
              name="nombres"
              value={contractData.nombres}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-black text-white border border-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Ingrese sus nombres"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Apellidos *
            </label>
            <input
              type="text"
              name="apellidos"
              value={contractData.apellidos}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-black text-white border border-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Ingrese sus apellidos"
              required
            />
          </div>
          <div className="ss:col-span-2">
            <label className="block text-sm font-medium text-white mb-2">
              Fecha
            </label>
            <input
              type="text"
              value={contractData.fecha}
              readOnly
              className="w-full px-3 py-2 bg-zinc-800 text-gray-400 border border-yellow-500 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Área de Firma */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-yellow-500 mb-4 flex items-center">
          <PenTool className="w-5 h-5 mr-2 text-yellow-500" />
          Firma Digital
        </h3>

        <div className="border-2 border-dashed border-yellow-500 rounded-lg p-6 text-center">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="border border-yellow-500 rounded-md mx-auto cursor-crosshair touch-none bg-white"
            style={{ touchAction: "none" }}
          />

          <div className="mt-4 space-x-4">
            <button
              onClick={clearSignature}
              type="button"
              className="inline-flex items-center px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
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
          <div className="flex items-center text-green-400">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Firma capturada exitosamente</span>
          </div>
        </div>
      )}

      {/* Validación de Formulario */}
      {(!contractData.nombres || !contractData.apellidos) && (
        <div className="mb-6 p-4 bg-yellow-900 border border-yellow-600 rounded-lg">
          <div className="flex items-center text-yellow-300">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">
              Complete todos los campos requeridos
            </span>
          </div>
        </div>
      )}

      {/* Botón de Descarga */}
      <div className="text-center">
        <button
          onClick={generatePDF}
          disabled={!isFormValid()}
          type="button"
          className="inline-flex items-center px-6 py-3 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-5 h-5 mr-2" />
          Generar y Descargar PDF Firmado
        </button>
      </div>

      {pdfGenerated && (
        <div className="mt-6 p-4 bg-yellow-900 border border-yellow-600 rounded-lg">
          <div className="flex items-center text-yellow-300">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">
              PDF generado y descargado exitosamente
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFSignatureComponent;
