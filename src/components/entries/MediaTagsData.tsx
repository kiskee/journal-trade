import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactElement } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { tradeTagsMediaSchema } from "../utils/Shemas";
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
      mediaFile:
        data.mediaFile && data.mediaFile.length > 0 ? data.mediaFile[0] : null,
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
    <div className="flex justify-center mt-10 w-full items-center">
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
              Subir archivo (opcional)
            </label>
            <input
              {...register("mediaFile", {
                setValueAs: (fileList) => {
                  if (!fileList || fileList.length === 0) return undefined;
                  return fileList;
                },
              })}
              type="file"
              accept="image/*,video/*"
              className="w-full text-sm text-neutral-300 
            file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
            file:text-sm file:font-semibold file:bg-blue-600 file:text-white 
            hover:file:bg-blue-700 file:cursor-pointer file:transition-colors
            cursor-pointer bg-neutral-700/50 rounded-lg p-3 border border-neutral-600
            hover:bg-neutral-700/70 transition-colors duration-200"
            />
            {errors.mediaFile && (
              <p className="text-rose-500 text-xs mt-1">
                {/* {errors.mediaFile.message} */}
              </p>
            )}
            <p className="text-neutral-400 text-xs mt-1">
              Completamente opcional. Acepta imágenes y videos.
            </p>
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
              className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition duration-300 text-sm sm:text-base ${
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
