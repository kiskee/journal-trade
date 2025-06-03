import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactElement } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { tradeTagsMediaSchema } from "../utils/Shemas";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ChevronLeft, Check, ChevronRight } from "lucide-react";

interface FormStepProps {
  onNext: (data: any) => void;
  onPrev: () => void;
  initialData?: any;
  isFirst: boolean;
  isLast: boolean;
  header: ReactElement<any, any>;
}

const MediaTagsData = (props: FormStepProps) => {
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
      mediaFile: undefined,
    },
  });

  const onSubmit = (data: FormData) => {
    // Procesar los datos antes de enviarlos
    const processedData = {
      ...data,
      // Convertir FileList a File o null
      mediaFile: data.mediaFile && data.mediaFile.length > 0 ? data.mediaFile[0] : null,
      // Asegurar que tags sea un array (puede estar vacío)
      tags: Array.isArray(data.tags) ? data.tags : [],
      // Limpiar mediaUrl si está vacía o solo espacios
      mediaUrl: data.mediaUrl?.trim() || undefined,
      // Limpiar notes si está vacía
      notes: data.notes?.trim() || undefined,
    };
    
    //console.log("Form submitted:", processedData);
    props.onNext(processedData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-neutral-800 rounded-2xl shadow-lg border border-blue-600/30 shadow-blue-700/20">
      <CardHeader className="p-4 sm:p-6">
        {props.header}
        <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-center font-semibold text-blue-600 mt-4">
          Formulario de Media y Tags de la Operación
        </CardTitle>
      </CardHeader>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-4 sm:px-6 pb-6 space-y-6"
      >
        {/* Grid principal responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Notas del trade */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-white mb-2">
              Notas del trade
            </label>
            <textarea
              {...register("notes")}
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder:text-gray-500 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Observaciones, errores, aprendizajes..."
            />
            {errors.notes && (
              <p className="text-red-400 text-sm mt-1">
                {errors.notes.message}
              </p>
            )}
          </div>

          {/* Etiquetas */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-white mb-2">
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
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="#planCumplido, #emocional..."
            />
            <p className="text-gray-400 text-xs mt-1">
              Separar etiquetas por coma
            </p>
            {errors.tags && (
              <p className="text-red-400 text-sm mt-1">
                {errors.tags.message}
              </p>
            )}
          </div>

          {/* Checkbox - Plan seguido */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 p-3 bg-neutral-700/50 rounded-lg hover:bg-neutral-700/70 transition-colors duration-200">
              <input
                type="checkbox"
                {...register("followedPlan")}
                id="followedPlan"
                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label
                htmlFor="followedPlan"
                className="text-sm font-medium text-white cursor-pointer"
              >
                ¿Se siguió el plan?
              </label>
            </div>
          </div>

          {/* URL de media */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-white mb-2">
              URL de imagen o video (opcional)
            </label>
            <input
              {...register("mediaUrl", {
                setValueAs: (value) => value?.trim() || "",
              })}
              type="url"
              placeholder="https://www.tradingview.com/x/57eNzCK6/"
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {errors.mediaUrl && (
              <p className="text-red-400 text-sm mt-1">
                {errors.mediaUrl.message}
              </p>
            )}
          </div>

          {/* Subir archivo */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-white mb-2">
              Subir archivo (opcional)
            </label>
            <div className="relative">
              <input
                {...register("mediaFile", {
                  setValueAs: (fileList: FileList) => {
                    // Si no hay archivos, retorna undefined para que sea opcional
                    if (!fileList || fileList.length === 0) return undefined;
                    return fileList; // Retorna el FileList completo
                  }
                })}
                type="file"
                accept="image/*,video/*"
                className="w-full text-sm text-gray-300 
                  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                  file:text-sm file:font-semibold file:bg-blue-600 file:text-white 
                  hover:file:bg-blue-700 file:cursor-pointer file:transition-colors
                  cursor-pointer bg-neutral-700/50 rounded-lg p-3 border border-gray-600
                  hover:bg-neutral-700/70 transition-colors duration-200"
              />
            </div>
            {errors.mediaFile && (
              <p className="text-red-400 text-sm mt-1">
                {/* {errors.mediaFile.message} */}
              </p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              Completamente opcional. Acepta imágenes y videos.
            </p>
          </div>
        </div>

        {/* Footer con botones */}
        <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 px-0">
          {!props.isFirst && (
            <button
              type="button"
              onClick={props.onPrev}
              className="w-full sm:w-auto flex items-center justify-center px-6 py-3 
                bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-lg 
                transition-all duration-300 transform hover:scale-105 focus:outline-none 
                focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-neutral-800"
            >
              <ChevronLeft size={20} className="mr-2" />
              Anterior
            </button>
          )}

          <div className={`${!props.isFirst ? '' : 'ml-auto'}`}>
            <button
              type="submit"
              className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 
                font-semibold rounded-lg transition-all duration-300 transform hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800
                ${props.isLast
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25 focus:ring-green-500"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 focus:ring-blue-500"
                }`}
            >
              {props.isLast ? (
                <>
                  <Check size={18} className="mr-2" />
                  Finalizar
                </>
              ) : (
                <>
                  Siguiente
                  <ChevronRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MediaTagsData;