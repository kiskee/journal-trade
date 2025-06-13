import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formShemaBasicData } from "../utils/Shemas";
import { z } from "zod";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChevronRight } from "lucide-react";
import type { ReactElement } from "react";

interface FormStepProps {
  onNext: (data: any) => void;
  onPrev: () => void;
  initialData?: any;
  isFirst: boolean;
  isLast: boolean;
  header: ReactElement<any, any>;
}

const BasicData = (props: FormStepProps) => {
  type FormSchema = z.infer<typeof formShemaBasicData>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formShemaBasicData),
    defaultValues: props.initialData || {
      date: "",
      time: "",
      asset: "",
      tradeType: "compra",
      setup: "",
      duration: "",
      durationUnit: "min",
      positionSize: "",
      leverage: "",
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
    // console.log("Form submitted:", data);
    props.onNext(data);
  };

  return (
    <>
      <Card className="p-6 bg-neutral-800 rounded-2xl shadow-lg border-blue-600 shadow-blue-700 w-full max-w-full">
        <CardHeader>
          {props.header}
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-center font-semibold text-blue-600 mb-6">
            Formulario de Datos Básicos de la Operación
          </CardTitle>
        </CardHeader>

        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Fecha */}
          <div className="min-w-0">
            <label className="block mb-1 text-neutral-200 text-sm">Fecha</label>
            <input
              type="date"
              {...register("date")}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm min-w-0"
            />
            {errors.date && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Hora */}
          <div className="min-w-0">
            <label className="block mb-1 text-neutral-200 text-sm">Hora</label>
            <input
              type="time"
              {...register("time")}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm min-w-0"
            />
            {errors.time && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.time.message}
              </p>
            )}
          </div>

          {/* Activo */}
          <div className="min-w-0">
            <label className="block mb-1 text-neutral-200 text-sm">
              Activo
            </label>
            <input
              type="text"
              {...register("asset")}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm min-w-0"
            />
            {errors.asset && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.asset.message}
              </p>
            )}
          </div>

          {/* Tipo de operación */}
          <div className="min-w-0">
            <label className="block mb-1 text-neutral-200 text-sm">
              Tipo de operación
            </label>
            <select
              {...register("tradeType")}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm min-w-0"
            >
              <option value="compra">Compra</option>
              <option value="venta">Venta</option>
            </select>
            {errors.tradeType && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.tradeType.message}
              </p>
            )}
          </div>

          {/* Setup */}
          <div className="min-w-0">
            <Tooltip>
              <TooltipTrigger>
                <label className="block mb-1 text-neutral-200 text-sm">
                  Setup
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nombre de tu estrategia</p>
              </TooltipContent>
            </Tooltip>

            <input
              type="text"
              {...register("setup")}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm min-w-0"
            />
            {errors.setup && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.setup.message}
              </p>
            )}
          </div>

          {/* Duración */}
          <div className="min-w-0">
            <label className="block mb-1 text-neutral-200 text-sm">
              Duración
            </label>
            <input
              type="number"
              {...register("duration", { valueAsNumber: true })}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm min-w-0"
            />
            {errors.duration && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.duration.message}
              </p>
            )}
          </div>

          {/* Unidad de duración */}
          <div className="min-w-0 sm:col-start-1">
            <label className="block mb-1 text-neutral-200 text-sm">
              Unidad de duración
            </label>
            <select
              {...register("durationUnit")}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm min-w-0"
            >
              <option value="min">Minutos</option>
              <option value="h">Horas</option>
              <option value="d">Días</option>
            </select>
            {errors.durationUnit && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.durationUnit.message}
              </p>
            )}
          </div>

          {/* Tamaño de posición */}
          <div className="min-w-0">
            <label className="block mb-1 text-neutral-200 text-sm">
              Tamaño de posición
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              {...register("positionSize", { valueAsNumber: true })}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm min-w-0"
            />
            {errors.positionSize && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.positionSize.message}
              </p>
            )}
          </div>

          {/* Apalancamiento */}
          <div className="sm:col-span-2 min-w-0">
            <label className="block mb-1 text-neutral-200 text-sm">
              Apalancamiento
            </label>
            <input
              type="number"
              {...register("leverage", {
                setValueAs: (value) =>
                  value === "" ? undefined : parseFloat(value) || 0,
              })}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm min-w-0"
            />
            {errors.leverage && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.leverage.message}
              </p>
            )}
          </div>

          <CardFooter className="sm:col-span-2 p-0 mt-4">
            <button
              type="submit"
              className={`w-full flex items-center justify-center px-4 py-3 font-semibold rounded-lg transition duration-300 text-sm sm:text-base ${
                props.isLast
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } ${props.isFirst ? "ml-auto" : ""}`}
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
        </form>
      </Card>
    </>
  );
};

export default BasicData;
