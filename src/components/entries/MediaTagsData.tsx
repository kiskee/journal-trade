import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { tradeTagsMediaSchema } from "../utils/Shemas";
import { ChevronLeft, Check, ChevronRight, Upload, X } from "lucide-react";
import { uploadMultipleFiles } from "../utils/fileUpload";

interface FormStepProps {
  onNext: (data: any) => void;
  onPrev: () => void;
  initialData?: any;
  isFirst: boolean;
  isLast: boolean;
  header: ReactElement<any, any>;
  userId: string;
}

interface UploadedFile {
  file: File;
  url?: string;
  key?: string;
  uploading: boolean;
  error?: string;
}

const MediaTagsData = (props: FormStepProps) => {
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>(
    props.initialData?.mediaFiles?.map((file: File) => ({
      file,
      uploading: false,
    })) || []
  );
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);

  type FormData = z.infer<typeof tradeTagsMediaSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tradeTagsMediaSchema),
    defaultValues: {
      notes: props.initialData?.notes || "",
      tags: props.initialData?.tags || [],
      followedPlan: props.initialData?.followedPlan ?? false,
      mediaUrl: props.initialData?.mediaUrl || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    // Subir archivos si hay alguno pendiente
    const filesToUpload = selectedFiles.filter((f) => !f.url && !f.uploading);
    let dataToSendInFiles: any;
    if (filesToUpload.length > 0) {
      dataToSendInFiles = await handleFileUpload(
        filesToUpload.map((f) => f.file)
      );
    }

    const dataWithFiles = {
      ...data,
      mediaUrl: data.mediaUrl?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
      uploadedFiles: dataToSendInFiles,
    };

    //console.log("Form submitted:", dataWithFiles);
    props.onNext(dataWithFiles);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const newFiles = Array.from(fileList).map((file) => ({
        file,
        uploading: false,
      }));
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      event.target.value = "";
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    // Marcar archivos como "subiendo"
    setSelectedFiles((prev) =>
      prev.map((f) =>
        files.includes(f.file) ? { ...f, uploading: true, error: undefined } : f
      )
    );

    try {
      const result = await uploadMultipleFiles(
        files,
        "trades", // carpeta específica para trades
        props.userId,
        (current, total) => setUploadProgress({ current, total })
      );

      if (!result.success) {
        const errors = result.results
          .filter((r) => !r.success)
          .map((r) => r.error)
          .join(", ");
        alert(`Error subiendo algunos archivos: ${errors}`);
      }
      const results = result.results.map((r) => ({
        file: r.file,
        url: r.data.url,
        key: r.data.key,
        uploading: false,
      }));
      return results;
    } catch (error) {
      console.error("Error en upload:", error);
      setSelectedFiles((prev) =>
        prev.map((f) =>
          files.includes(f.file)
            ? { ...f, uploading: false, error: "Error de conexión" }
            : f
        )
      );
      setUploadProgress(null);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileStatusColor = (file: UploadedFile) => {
    if (file.uploading) return "border-yellow-500 bg-yellow-900/20";
    if (file.error) return "border-red-500 bg-red-900/20";
    if (file.url) return "border-green-500 bg-green-900/20";
    return "border-neutral-600 bg-neutral-800";
  };

  const getFileStatusIcon = (file: UploadedFile) => {
    if (file.uploading) return <Upload className="animate-spin" size={16} />;
    if (file.error) return <X size={16} className="text-red-400" />;
    if (file.url) return <Check size={16} className="text-green-400" />;
    return null;
  };

  return (
    <div className="flex justify-center w-full items-center">
      <div className="flex flex-col p-4 border-4 border-blue-600 text-center shadow-2xl shadow-blue-800 rounded-md items-center w-full max-w-4xl">
        {props.header}
        <h1 className="text-center font-semibold text-blue-600 text-2xl">
          Formulario de Media y Tags de la Operación
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col lg:flex-row gap-4 w-full items-start mb-6">
            {/* Notas del trade */}
            <div className="w-full lg:w-1/2">
              <label className="block mb-1 text-neutral-200 text-sm">
                Notas del trade
              </label>
              <textarea
                {...register("notes")}
                rows={4}
                className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm resize-none"
                placeholder="Observaciones, errores, aprendizajes..."
              />
              {errors.notes && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.notes.message}
                </p>
              )}
            </div>

            {/* Etiquetas */}
            <div className="w-full lg:w-1/2">
              <label className="block mb-1 text-neutral-200 text-sm">
                Etiquetas
              </label>
              <input
                {...register("tags", {
                  setValueAs: (value) => {
                    if (typeof value === "string") {
                      return value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag.length > 0);
                    }
                    return Array.isArray(value) ? value : [];
                  },
                })}
                type="text"
                className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
                placeholder="#planCumplido, #emocional..."
              />
              <p className="text-neutral-400 text-xs mt-1">
                Separar etiquetas por coma
              </p>
              {errors.tags && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.tags.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 w-full items-center mb-6">
            {/* Checkbox - Plan seguido */}
            <div className="w-full lg:w-1/2">
              <div className="flex items-center gap-3 p-3 bg-neutral-700/50 rounded-lg hover:bg-neutral-700/70 transition-colors duration-200">
                <input
                  type="checkbox"
                  {...register("followedPlan")}
                  id="followedPlan"
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label
                  htmlFor="followedPlan"
                  className="text-sm font-medium text-neutral-200 cursor-pointer"
                >
                  ¿Se siguió el plan?
                </label>
              </div>
            </div>

            {/* URL de media */}
            <div className="w-full lg:w-1/2">
              <label className="block mb-1 text-neutral-200 text-sm">
                URL de imagen o video (opcional)
              </label>
              <input
                {...register("mediaUrl", {
                  setValueAs: (value) => value?.trim() || "",
                })}
                type="url"
                placeholder="https://www.tradingview.com/x/57eNzCK6/"
                className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
              />
              {errors.mediaUrl && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.mediaUrl.message}
                </p>
              )}
            </div>
          </div>

          {/* Subir archivo */}
          <div className="w-full mb-6">
            <label className="block mb-1 text-neutral-200 text-sm">
              Subir archivos (opcional)
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="w-full text-sm text-neutral-300 
        file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
        file:text-sm file:font-semibold file:bg-blue-600 file:text-white 
        hover:file:bg-blue-700 file:cursor-pointer file:transition-colors
        cursor-pointer bg-neutral-700/50 rounded-lg p-3 border border-neutral-600
        hover:bg-neutral-700/70 transition-colors duration-200"
            />

            <div className="flex justify-between items-center mt-2">
              <p className="text-neutral-400 text-xs">
                Acepta imágenes. Máximo 5MB por archivo.
              </p>

              {selectedFiles.some(
                (f) => !f.url && !f.uploading && !f.error
              ) && (
                <button
                  type="button"
                  onClick={() =>
                    handleFileUpload(
                      selectedFiles
                        .filter((f) => !f.url && !f.uploading && !f.error)
                        .map((f) => f.file)
                    )
                  }
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors"
                >
                  Subir archivos
                </button>
              )}
            </div>

            {/* Progreso de upload */}
            {uploadProgress && (
              <div className="mt-3 p-3 bg-neutral-800 rounded-lg">
                <div className="flex justify-between text-sm text-neutral-300 mb-2">
                  <span>Subiendo archivos...</span>
                  <span>
                    {uploadProgress.current} / {uploadProgress.total}
                  </span>
                </div>
                <div className="w-full bg-neutral-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        (uploadProgress.current / uploadProgress.total) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Lista de archivos seleccionados */}
            {selectedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium text-neutral-200">
                  Archivos seleccionados ({selectedFiles.length}):
                </p>
                {selectedFiles.map((fileObj, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded border-2 ${getFileStatusColor(
                      fileObj
                    )}`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {getFileStatusIcon(fileObj)}
                      <div className="flex-1">
                        <span className="text-sm text-neutral-300 truncate block">
                          {fileObj.file.name} (
                          {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                        {fileObj.error && (
                          <span className="text-xs text-red-400 block">
                            Error: {fileObj.error}
                          </span>
                        )}
                        {fileObj.url && (
                          <span className="text-xs text-green-400 block">
                            ✓ Subido correctamente
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      disabled={fileObj.uploading}
                      className="text-rose-400 hover:text-rose-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm ml-2 px-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full">
            {!props.isFirst && (
              <button
                type="button"
                onClick={props.onPrev}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-lg transition duration-300"
              >
                <ChevronLeft size={20} className="mr-1" />
                Anterior
              </button>
            )}

            <button
              type="submit"
              disabled={selectedFiles.some((f) => f.uploading)}
              className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed ${
                props.isLast
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } ${!props.isFirst ? "" : "ml-auto"}`}
            >
              {props.isLast ? (
                <>
                  <Check size={18} className="mr-1" />
                  Finalizar
                </>
              ) : (
                <>
                  Siguiente
                  <ChevronRight size={18} className="ml-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MediaTagsData;
