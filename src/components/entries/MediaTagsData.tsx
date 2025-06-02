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
      followedPlan: false,
    },
  });

  const onSubmit = (data: FormData) => {
    //console.log("Form submitted:", data);
    props.onNext(data);
  };
  return (
    <>
      <Card className="p-6 bg-neutral-800 rounded-2xl shadow-lg border-blue-600 shadow-blue-700 w-full max-w-full">
        <CardHeader>
          {props.header}
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-center font-semibold text-blue-600 mb-6">
            Formulario de Media y Tags de la Operación
          </CardTitle>
        </CardHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-xl mx-auto p-6  shadow-md rounded-xl space-y-6"
        >
          <div className="grid grid-cols-2 grid-rows-4 gap-4">
            <div>
              <label className="block font-semibold">Notas del trade</label>
              <textarea
                {...register("notes")}
                rows={4}
                className="mt-1 w-full border rounded p-2"
                placeholder="Observaciones, errores, aprendizajes..."
              />
              {errors.notes && (
                <p className="text-red-500 text-sm">{errors.notes.message}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold">Etiquetas</label>
              <input
                {...register("tags")}
                type="text"
                className="mt-1 w-full border rounded p-2"
                placeholder="#planCumplido, #emocional..."
              />
              <p className="text-sm text-gray-500">
                Separar etiquetas por coma
              </p>
              {errors.tags && (
                <p className="text-red-500 text-sm">{errors.tags.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("followedPlan")}
                id="followedPlan"
              />
              <label htmlFor="followedPlan" className="font-medium">
                ¿Se siguió el plan?
              </label>
            </div>
            <div>
              <label className="block font-semibold">
                URL de imagen o video (opcional)
              </label>
              <input
                {...register("mediaUrl")}
                type="url"
                placeholder="https://www.tradingview.com/x/57eNzCK6/"
                className="mt-1 w-full border rounded p-2"
              />
              {errors.mediaUrl && (
                <p className="text-red-500 text-sm">
                  {errors.mediaUrl.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <div>
                <label className="block font-semibold">
                  Subir archivo (opcional)
                </label>
                <input
                  {...register("mediaFile")}
                  type="file"
                  accept="image/*,video/*"
                  className="mt-1"
                />
                {errors.mediaFile && (
                  <p className="text-red-500 text-sm">
                    {/* {errors.mediaFile.message} */}
                  </p>
                )}
              </div>
            </div>
            <div className="col-span-2 row-start-4">
              <CardFooter className="sm:col-span-2 mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-0">
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
                  }`}
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
              </CardFooter>
            </div>
          </div>
        </form>
      </Card>
    </>
  );
};

export default MediaTagsData;
