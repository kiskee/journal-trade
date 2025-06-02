import type { ReactElement } from "react";
import type z from "zod";
import { tradeResultSchema } from "../utils/Shemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const ResultsData = (props: FormStepProps) => {
  type FormSchema = z.infer<typeof tradeResultSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(tradeResultSchema),
    defaultValues: props.initialData || {
      entryPrice: 0,
      exitPrice: 0,
      stopLoss: 0,
      takeProfit: 0,
      resultUsd: 0,
      resultPercent: 0,
      fees: 0,
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
     console.log("Form submitted:", data);
    props.onNext(data);
  };

  return (
    <Card className="p-6 bg-neutral-800 rounded-2xl shadow-lg border-blue-600 shadow-blue-700 w-full max-w-full">
      <CardHeader>
        {props.header}
        <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-center font-semibold text-blue-600 mb-6">
          Formulario de Resultados de la Operación
        </CardTitle>
      </CardHeader>
      <form
        className="grid grid-cols-2 grid-rows-5 gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="min-w-0">
          <label className="block mb-1 text-neutral-200 text-sm text-center">
            Precio de entrada:
          </label>
          <input
            type="number"
            step="any"
            {...register("entryPrice", { valueAsNumber: true })}
            className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm min-w-0"
          />
          {errors.entryPrice && (
            <p className="text-rose-500 text-xs mt-1">
              {errors.entryPrice.message}
            </p>
          )}
        </div>
        <div className="min-w-0">
          <label className="block mb-1 text-neutral-200 text-sm text-center">
            Precio de salida:
          </label>
          <input
            type="number"
            step="any"
            {...register("exitPrice", { valueAsNumber: true })}
            className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm min-w-0"
          />
          {errors.exitPrice && (
            <p className="text-rose-500 text-xs mt-1">
              {errors.exitPrice.message}
            </p>
          )}
        </div>
        <div className="min-w-0">
          <label className="block mb-1 text-neutral-200 text-sm text-center">
            Stop Loss:
          </label>
          <input
            type="number"
            step="any"
            {...register("stopLoss", { valueAsNumber: true })}
            className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm min-w-0"
          />
          {errors.stopLoss && (
            <p className="text-rose-500 text-xs mt-1">
              {errors.stopLoss.message}
            </p>
          )}
        </div>

        <div className="min-w-0">
          <label className="block mb-1 text-neutral-200 text-sm text-center">
            Take Profit:
          </label>
          <input
            type="number"
            step="any"
            {...register("takeProfit", { valueAsNumber: true })}
            className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm min-w-0"
          />
          {errors.takeProfit && (
            <p className="text-rose-500 text-xs mt-1">
              {errors.takeProfit.message}
            </p>
          )}
        </div>

        <div className="min-w-0">
          <label className="block mb-1 text-neutral-200 text-sm text-center">
            Resultado ($):
          </label>
          <input
            type="number"
            step="any"
            {...register("resultUsd", { valueAsNumber: true })}
            className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm min-w-0"
          />
          {errors.resultUsd && (
            <p className="text-rose-500 text-xs mt-1">
              {errors.resultUsd.message}
            </p>
          )}
        </div>

        <div className="min-w-0">
          <label className="block mb-1 text-neutral-200 text-sm text-center">
            Resultado (%):
          </label>
          <input
            type="number"
            step="any"
            {...register("resultPercent", { valueAsNumber: true })}
            className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm min-w-0"
          />
          {errors.resultPercent && (
            <p className="text-rose-500 text-xs mt-1">
              {errors.resultPercent.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <div className="min-w-0">
            <label className="block mb-1 text-neutral-200 text-sm text-center">
              Comisiones / Spread:
            </label>
            <input
              type="number"
              step="any"
              {...register("fees", { valueAsNumber: true })}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm min-w-0"
            />
            {errors.fees && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.fees.message}
              </p>
            )}
          </div>
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
  );
};

export default ResultsData;
