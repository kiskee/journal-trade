import type { ReactElement } from "react";
import { tradeEmotionsSchema } from "../utils/Shemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
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
      <div className="flex justify-center mt-10 w-full items-center">
        <div className="flex flex-col p-4 border-4 border-blue-600 text-center shadow-2xl shadow-blue-800 rounded-md items-center w-full max-w-xl">
          {props.header}
          <h1 className="text-center font-semibold text-blue-600 text-2xl">
            Formulario de Emociones de la Operación
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col sm:flex-row gap-4 w-full items-center mb-6">
              {/* Emoción antes del trade */}
              <div className="w-full sm:w-1/2">
                <label className="block mb-1 text-neutral-200 text-sm">
                  Emoción antes del trade
                </label>
                <select
                  {...register("emotionBefore")}
                  className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
                >
                  <option value="">Selecciona una emoción</option>
                  {emotionBeforeOptions.map((emotion) => (
                    <option key={emotion} value={emotion}>
                      {emotion}
                    </option>
                  ))}
                </select>
                {errors.emotionBefore && (
                  <p className="text-rose-500 text-xs mt-1">
                    {errors.emotionBefore.message}
                  </p>
                )}
              </div>

              {/* Emoción después del trade */}
              <div className="w-full sm:w-1/2">
                <label className="block mb-1 text-neutral-200 text-sm">
                  Emoción después del trade
                </label>
                <select
                  {...register("emotionAfter")}
                  className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
                >
                  <option value="">Selecciona una emoción</option>
                  {emotionAfterOptions.map((emotion) => (
                    <option key={emotion} value={emotion}>
                      {emotion}
                    </option>
                  ))}
                </select>
                {errors.emotionAfter && (
                  <p className="text-rose-500 text-xs mt-1">
                    {errors.emotionAfter.message}
                  </p>
                )}
              </div>
            </div>

            {/* Nivel de confianza */}
            <div className="w-full mb-6">
              <label className="block mb-1 text-neutral-200 text-sm">
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
                <p className="text-rose-500 text-xs mt-1">
                  {errors.confidenceLevel.message}
                </p>
              )}
            </div>

            {/* Nivel de disciplina */}
            <div className="w-full mb-6">
              <label className="block mb-1 text-neutral-200 text-sm">
                Nivel de disciplina:
              </label>
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
                <p className="text-rose-500 text-xs mt-1">
                  {errors.disciplineLevel.message}
                </p>
              )}
            </div>

            {/* Botones */}
            <div className="flex flex-col sx:flex-row items-stretch sm:items-center justify-between gap-4 w-full">
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
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EmotionsData;
