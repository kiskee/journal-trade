// utils/fileUpload.ts
import ModuleService from "@/services/moduleService";
import Compressor from "compressorjs";

interface CompressOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  mimeType?: string;
  convertSize?: number;
}

interface UploadResponse {
  success: boolean;
  data?: {
    url: string;
    key: string;
    originalFilename: string;
    size: number;
    contentType: string;
    uploadDate: string;
  };
  error?: string;
  message?: string;
}

interface MultipleUploadResult {
  success: boolean;
  results: Array<{
    file: File;
    success: boolean;
    data?: any;
    error?: string;
  }>;
}

/**
 * Comprime una imagen usando compressorjs
 */
const compressImage = (file: File, options: CompressOptions = {}): Promise<File> => {
  // Solo comprimir si es una imagen
  if (!file.type.startsWith('image/')) {
    return Promise.resolve(file);
  }

  const defaultOptions: CompressOptions = {
    quality: 0.6,
    maxWidth: 1024,
    maxHeight: 1000,
    mimeType: "image/jpeg",
    convertSize: 1000000, // 1MB
  };

  const finalOptions = { ...defaultOptions, ...options };

  return new Promise<File>((resolve) => {
    new Compressor(file, {
      ...finalOptions,
      success(result) {
        // Compressor devuelve un Blob, lo convertimos a File
        const compressedFile = new File([result], file.name, {
          type: result.type,
          lastModified: Date.now(),
        });
        resolve(compressedFile);
      },
      error(err) {
        console.warn('Error al comprimir imagen, usando archivo original:', err);
        // Si falla la compresión, usar el archivo original
        resolve(file);
      },
    });
  });
};

/**
 * Convierte un archivo File a base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Sube un archivo individual al servidor
 */
export const uploadFile = async (
  file: File,
  folder: string = "general",
  userId: string = "anonymous",
  compressOptions?: CompressOptions
): Promise<UploadResponse> => {
  try {
    // Comprimir la imagen antes de convertir a base64 (solo si es imagen)
    const processedFile = await compressImage(file, compressOptions);

    // Convertir archivo procesado a base64
    const base64Data = await fileToBase64(processedFile);

    // Preparar payload para el servidor
    const payload = {
      image: base64Data,
      filename: file.name, // Mantener el nombre original
      folder,
      userId,
    };

   
    const response = await ModuleService.images.create(payload);

    if (response.data.data.statusCode !== 200) {
      throw new Error("Error al subir la imagen");
    }

    const result = JSON.parse(response.data.data.body);
    return result;
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

/**
 * Sube múltiples archivos de forma secuencial
 */
export const uploadMultipleFiles = async (
  files: File[],
  folder: string = "general",
  userId: string = "anonymous",
  onProgress?: (current: number, total: number) => void,
  compressOptions?: CompressOptions
): Promise<MultipleUploadResult> => {
  const results = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.(i + 1, files.length);

    const result = await uploadFile(file, folder, userId, compressOptions);
    results.push({
      file,
      success: result.success,
      data: result.data,
      error: result.error,
    });

    // Pequeña pausa entre uploads para no sobrecargar el servidor
    if (i < files.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return {
    success: results.every((r) => r.success),
    results,
  };
};

/**
 * Utilidad para obtener el tamaño de archivo en formato legible
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Valida si un archivo es una imagen
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Valida el tamaño máximo de archivo
 */
export const validateFileSize = (file: File, maxSizeInMB: number = 10): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};