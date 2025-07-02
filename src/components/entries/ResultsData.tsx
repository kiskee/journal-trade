import type { ReactElement } from "react";
import type z from "zod";
import { tradeResultSchema } from "../utils/Shemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChevronLeft, Check, ChevronRight } from "lucide-react";

interface FormStepProps {
  onNext: (data: any) => void;
  onPrev: () => void;
  initialData?: any;
  isFirst: boolean;
  isLast: boolean;
  header: ReactElement<any, any>;
  userId: string;
}

const ResultsData = (props: FormStepProps) => {
  type FormSchema = z.infer<typeof tradeResultSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(tradeResultSchema),
    defaultValues: props.initialData || {
      entryPrice: "",
      exitPrice: "",
      stopLoss: "",
      takeProfit: "",
      resultUsd: "",
      resultPercent: "",
      fees: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors }, //isSubmitting
    // setError,
    // clearErrors,
  } = form;

  const onSubmit = (data: FormSchema) => {
    props.onNext(data);
  };

  return (
    <div className="flex justify-center w-full items-center">
      <div className="flex flex-col p-4 border-4 border-yellow-500 text-center shadow-2xl shadow-yellow-500/40 rounded-md items-center w-full max-w-xl">
        {props.header}
        <h1 className="text-center font-semibold text-yellow-500 text-2xl">
          Formulario de Resultados de la Operación
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col sx:flex-row gap-4 w-full items-center mb-6">
            {/* Precio de entrada */}
            <div className="w-full sm:w-1/2">
              <label className="block mb-1 text-neutral-200 text-sm">
                Precio de entrada:
              </label>
              <input
                type="number"
                step="any"
                {...register("entryPrice", { valueAsNumber: true })}
                className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
              />
              {errors.entryPrice && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.entryPrice.message}
                </p>
              )}
            </div>

            {/* Precio de salida */}
            <div className="w-full sm:w-1/2">
              <label className="block mb-1 text-neutral-200 text-sm">
                Precio de salida:
              </label>
              <input
                type="number"
                step="any"
                {...register("exitPrice", { valueAsNumber: true })}
                className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
              />
              {errors.exitPrice && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.exitPrice.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sx:flex-row gap-4 w-full items-center mb-6">
            {/* Stop Loss */}
            <div className="w-full sm:w-1/2">
              <label className="block mb-1 text-neutral-200 text-sm">
                Stop Loss:
              </label>
              <input
                type="number"
                step="any"
                {...register("stopLoss", { valueAsNumber: true })}
                className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
              />
              {errors.stopLoss && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.stopLoss.message}
                </p>
              )}
            </div>

            {/* Take Profit */}
            <div className="w-full sm:w-1/2">
              <label className="block mb-1 text-neutral-200 text-sm">
                Take Profit:
              </label>
              <input
                type="number"
                step="any"
                {...register("takeProfit", { valueAsNumber: true })}
                className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
              />
              {errors.takeProfit && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.takeProfit.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sx:flex-row gap-4 w-full items-center mb-6">
            {/* Resultado ($) */}
            <div className="w-full sm:w-1/2">
              <label className="block mb-1 text-neutral-200 text-sm">
                Resultado ($):
              </label>
              <input
                type="number"
                step="any"
                {...register("resultUsd", { valueAsNumber: true })}
                className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
              />
              {errors.resultUsd && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.resultUsd.message}
                </p>
              )}
            </div>

            {/* Resultado (%) */}
            <div className="w-full sm:w-1/2">
              <label className="block mb-1 text-neutral-200 text-sm">
                Resultado (%):
              </label>
              <input
                type="number"
                step="any"
                {...register("resultPercent", { valueAsNumber: true })}
                className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
              />
              {errors.resultPercent && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.resultPercent.message}
                </p>
              )}
            </div>
          </div>

          {/* Comisiones / Spread */}
          <div className="w-full mb-6">
            <label className="block mb-1 text-neutral-200 text-sm">
              Comisiones / Spread:
            </label>
            <input
              type="number"
              step="any"
              {...register("fees", {
                setValueAs: (value) =>
                  value === "" ? undefined : parseFloat(value) || 0,
              })}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
            />
            {errors.fees && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.fees.message}
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
              className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 font-semibold rounded-2xl transition-all duration-300 text-sm sm:text-base ${
                props.isLast
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-black hover:from-yellow-700 hover:via-yellow-600 hover:to-yellow-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/30"
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
  );
};

export default ResultsData;
