import type { ReactElement } from "react";
import { tradeEmotionsSchema } from "../utils/Shemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ChevronLeft, Check, ChevronRight } from "lucide-react";

// Opciones emocionales
const emotionBeforeOptions = [
  "Confianza",
  "Ansiedad",
  "Duda",
  "Impaciencia",
  "Euforia",
  "Miedo",
  "Seguridad",
  "Tensión",
  "Apatía",
  "Motivación",
] as const;

const emotionAfterOptions = [
  "Satisfacción",
  "Frustración",
  "Alivio",
  "Enojo",
  "Desilusión",
  "Orgullo",
  "Remordimiento",
  "Indiferencia",
  "Euforia",
] as const;

interface FormStepProps {
  onNext: (data: any) => void;
  onPrev: () => void;
  initialData?: any;
  isFirst: boolean;
  isLast: boolean;
  header: ReactElement<any, any>;
}

const EmotionsData = (props: FormStepProps) => {
  type FormSchema = z.infer<typeof tradeEmotionsSchema>;
  const form = useForm<FormSchema>({
    resolver: zodResolver(tradeEmotionsSchema),
    defaultValues: props.initialData || {
     emotionBefore: "",
     emotionAfter: "",
     confidenceLevel: "",
     disciplineLevel: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors }, 
  } = form;

  const onSubmit = (data: FormSchema) => {
    //console.log("Form submitted:", data);
    props.onNext(data);
  };

  return (
    <>
      <Card className="p-6 bg-neutral-800 rounded-2xl shadow-lg border-blue-600 shadow-blue-700 w-full max-w-full">
        <CardHeader>
          {props.header}
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-center font-semibold text-blue-600 mb-6">
            Formulario de Emociones de la Operación
          </CardTitle>
        </CardHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-xl mx-auto p-6  shadow-md rounded-xl space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-white">
                Emoción antes del trade
              </label>
              <select
                {...register("emotionBefore")}
                className="w-full border rounded px-3 py-2 bg-white"
              >
                <option value="">Selecciona una emoción</option>
                {emotionBeforeOptions.map((emotion) => (
                  <option key={emotion} value={emotion}>
                    {emotion}
                  </option>
                ))}
              </select>
              {errors.emotionBefore && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.emotionBefore.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium text-white">
                Emoción después del trade
              </label>
              <select
                {...register("emotionAfter")}
                className="w-full border rounded px-3 py-2  bg-white"
              >
                <option value="">Selecciona una emoción</option>
                {emotionAfterOptions.map((emotion) => (
                  <option key={emotion} value={emotion}>
                    {emotion}
                  </option>
                ))}
              </select>
              {errors.emotionAfter && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.emotionAfter.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-white">
              Nivel de confianza:
            </label>

            <input
              type="range"
              min="1"
              max="10"
              {...register("confidenceLevel", { valueAsNumber: true })}
              className="w-full"
            />

            {/* Línea con valores del 1 al 10 */}
            <div className="flex justify-between text-xs text-blue-400 mt-1 px-1">
              {[...Array(10)].map((_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>

            {errors.confidenceLevel && (
              <p className="text-red-600 text-sm mt-1">
                {errors.confidenceLevel.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-white">
              Nivel de disciplina:{" "}
            </label>

            {/* <Slider defaultValue={[0]} max={100} step={1} /> */}
            <input
              type="range"
              min="1"
              max="10"
              {...register("disciplineLevel", { valueAsNumber: true })}
              className="w-full"
            />
            {/* Línea con valores del 1 al 10 */}
            <div className="flex justify-between text-xs text-blue-400 mt-1 px-1">
              {[...Array(10)].map((_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            {errors.disciplineLevel && (
              <p className="text-red-600 text-sm mt-1">
                {errors.disciplineLevel.message}
              </p>
            )}
          </div>

          <div className="col-span-2 row-start-5">
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
        </form>
      </Card>
    </>
  );
};

export default EmotionsData;
