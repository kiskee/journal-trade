// utils/fileUpload.ts

/**
 * Convierte un archivo File a base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Sube un archivo individual al servidor
 */
export const uploadFile = async (
  file: File, 
  folder: string = 'general',
  userId: string = 'anonymous'
): Promise<{
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
}> => {
  try {
    // Convertir archivo a base64
    const base64Data = await fileToBase64(file);
    
    // Preparar payload para el servidor
    const payload = {
      image: base64Data,
      filename: file.name,
      folder,
      userId
    };

    // Hacer petición al endpoint
    const response = await fetch('https://pznfszxcv5.execute-api.us-east-1.amazonaws.com/dev/images/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    //console.log(result)
    if (!response.ok) {
      throw new Error(result.error || 'Error al subir archivo');
    }

    return result;
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Sube múltiples archivos de forma secuencial
 */
export const uploadMultipleFiles = async (
  files: File[],
  folder: string = 'general',
  userId: string = 'anonymous',
  onProgress?: (current: number, total: number) => void
): Promise<{
  success: boolean;
  results: Array<{
    file: File;
    success: boolean;
    data?: any;
    error?: string;
  }>;
}> => {
  const results = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.(i + 1, files.length);
    
    const result = await uploadFile(file, folder, userId);
    results.push({
      file,
      success: result.success,
      data: result.data,
      error: result.error
    });
  }

  return {
    success: results.every(r => r.success),
    results
  };
};