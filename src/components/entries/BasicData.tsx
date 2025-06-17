import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formShemaBasicData } from "../utils/Shemas";
import { z } from "zod";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
      <div className="flex justify-center  w-full items-center">
        <div className="flex flex-col p-4 border-4 border-blue-600 text-center shadow-2xl shadow-blue-800 rounded-md items-center w-full max-w-xl">
          {props.header}
          <h1 className="text-center font-semibold text-blue-600 text-2xl">
            Formulario de Datos Básicos de la Operación
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col sx:flex-row gap-4 w-full items-center mb-6">
              {/* Fecha */}
              <div className="w-full sm:w-1/2">
                <label className="block mb-1 text-neutral-200 text-sm">
                  Fecha
                </label>
                <input
                  type="date"
                  {...register("date")}
                  className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
                />
                {errors.date && (
                  <p className="text-rose-500 text-xs mt-1">
                    {errors.date.message}
                  </p>
                )}
              </div>

              {/* Hora */}
              <div className="w-full sm:w-1/2">
                <label className="block mb-1 text-neutral-200 text-sm">
                  Hora
                </label>
                <input
                  type="time"
                  {...register("time")}
                  className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
                />
                {errors.time && (
                  <p className="text-rose-500 text-xs mt-1">
                    {errors.time.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sx:flex-row gap-4 w-full items-center mb-6">
              {/* Activo */}
              <div className="w-full sm:w-1/2">
                <label className="block mb-1 text-neutral-200 text-sm">
                  Activo
                </label>
                <input
                  type="text"
                  {...register("asset")}
                  className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
                />
                {errors.asset && (
                  <p className="text-rose-500 text-xs mt-1">
                    {errors.asset.message}
                  </p>
                )}
              </div>

              {/* Tipo de operación */}
              <div className="w-full sm:w-1/2">
                <label className="block mb-1 text-neutral-200 text-sm">
                  Tipo de operación
                </label>
                <select
                  {...register("tradeType")}
                  className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
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
            </div>

            <div className="flex flex-col sx:flex-row gap-4 w-full items-center mb-6">
              {/* Setup */}
              <div className="w-full sm:w-1/2">
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
                  className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
                />
                {errors.setup && (
                  <p className="text-rose-500 text-xs mt-1">
                    {errors.setup.message}
                  </p>
                )}
              </div>

              {/* Duración */}
              <div className="w-full sm:w-1/2">
                <label className="block mb-1 text-neutral-200 text-sm">
                  Duración
                </label>
                <input
                  type="number"
                  {...register("duration", { valueAsNumber: true })}
                  className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
                />
                {errors.duration && (
                  <p className="text-rose-500 text-xs mt-1">
                    {errors.duration.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sx:flex-row gap-4 w-full items-center mb-6">
              {/* Unidad de duración */}
              <div className="w-full sm:w-1/2">
                <label className="block mb-1 text-neutral-200 text-sm">
                  Unidad de duración
                </label>
                <select
                  {...register("durationUnit")}
                  className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
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
              <div className="w-full sm:w-1/2">
                <label className="block mb-1 text-neutral-200 text-sm">
                  Tamaño de posición
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  {...register("positionSize", { valueAsNumber: true })}
                  className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
                />
                {errors.positionSize && (
                  <p className="text-rose-500 text-xs mt-1">
                    {errors.positionSize.message}
                  </p>
                )}
              </div>
            </div>

            {/* Apalancamiento */}
            <div className="w-full mb-6">
              <label className="block mb-1 text-neutral-200 text-sm">
                Apalancamiento
              </label>
              <input
                type="number"
                {...register("leverage", {
                  setValueAs: (value) =>
                    value === "" ? undefined : parseFloat(value) || 0,
                })}
                className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
              />
              {errors.leverage && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.leverage.message}
                </p>
              )}
            </div>

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
          </form>
        </div>
      </div>
    </>
  );
};

export default BasicData;
