import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formShemaBasicData } from "../utils/Shemas";
import { z } from "zod";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FormStepProps {
  onNext: (data: any) => void;
  onPrev: () => void;
  initialData?: any;
  isFirst: boolean;
  isLast: boolean;
}

const BasicData = (props: FormStepProps) => {
  type FormSchema = z.infer<typeof formShemaBasicData>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formShemaBasicData),
    defaultValues: {
      date: "",
      time: "",
      asset: "",
      tradeType: "compra",
      setup: "",
      duration: 1,
      durationUnit: "min",
      positionSize: 1,
      leverage: 1,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors,  },//isSubmitting
    // setError,
    // clearErrors,
  } = form;

  const onSubmit = (data: FormSchema) => {
    console.log("Form submitted:", data);
  };
  console.log(props)
  return (
    <>
      <Card className="max-w-4xl mx-auto mt-10 p-6 bg-neutral-800 rounded-2xl shadow-lg  border-blue-600 shadow-blue-700">
        <CardHeader>
          <CardTitle className="text-4xl  text-center font-semibold text-blue-600 mb-6">
            Formulario de Datos Basicos de la operacion
          </CardTitle>
        </CardHeader>

        <form
          className="grid grid-cols-2 grid-rows-6 gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Fecha */}
          <div>
            <label className="block mb-1 text-neutral-200">Fecha</label>
            <input
              type="date"
              {...register("date")}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700"
            />
            {errors.date && (
              <p className="text-rose-500 text-sm">{errors.date.message}</p>
            )}
          </div>
          {/* Hora */}
          <div>
            <label className="block mb-1 text-neutral-200">Hora</label>
            <input
              type="time"
              {...register("time")}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700"
            />
            {errors.time && (
              <p className="text-rose-500 text-sm">{errors.time.message}</p>
            )}
          </div>
          {/* Activo */}
          <div>
            <label className="block mb-1 text-neutral-200">Activo</label>
            <input
              type="text"
              {...register("asset")}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700"
            />
            {errors.asset && (
              <p className="text-rose-500 text-sm">{errors.asset.message}</p>
            )}
          </div>
          {/* Tipo de operación */}
          <div>
            <label className="block mb-1 text-neutral-200">
              Tipo de operación
            </label>
            <select
              {...register("tradeType")}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700"
            >
              <option value="compra">Compra</option>
              <option value="venta">Venta</option>
              <option value="largo">Largo</option>
              <option value="corto">Corto</option>
            </select>
            {errors.tradeType && (
              <p className="text-rose-500 text-sm">
                {errors.tradeType.message}
              </p>
            )}
          </div>

          {/* Setup */}
          <div>
            <Tooltip>
              <TooltipTrigger>
                <label className="block mb-1 text-neutral-200">Setup</label>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nombre de tu estretegia</p>
              </TooltipContent>
            </Tooltip>

            <input
              type="text"
              {...register("setup")}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700"
            />
            {errors.setup && (
              <p className="text-rose-500 text-sm">{errors.setup.message}</p>
            )}
          </div>

          {/* Duración */}
          <div>
            <label className="block mb-1 text-neutral-200">Duración</label>
            <input
              type="number"
              {...register("duration", { valueAsNumber: true })}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700"
            />
            {errors.duration && (
              <p className="text-rose-500 text-sm">{errors.duration.message}</p>
            )}
          </div>

          {/* Unidad de duración */}
          <div>
            <label className="block mb-1 text-neutral-200">
              Unidad de duración
            </label>
            <select
              {...register("durationUnit")}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700"
            >
              <option value="min">Minutos</option>
              <option value="h">Horas</option>
              <option value="d">Días</option>
            </select>
            {errors.durationUnit && (
              <p className="text-rose-500 text-sm">
                {errors.durationUnit.message}
              </p>
            )}
          </div>

          {/* Tamaño de posición */}
          <div>
            <label className="block mb-1 text-neutral-200">
              Tamaño de posición
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              {...register("positionSize", { valueAsNumber: true })}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700"
            />
            {errors.positionSize && (
              <p className="text-rose-500 text-sm">
                {errors.positionSize.message}
              </p>
            )}
          </div>
          {/* Apalancamiento */}

          <div className="col-span-2 col-start-1 row-start-5">
            <div>
              <label className="block mb-1 text-neutral-200">
                Apalancamiento
              </label>
              <input
                type="number"
                {...register("leverage", { valueAsNumber: true })}
                className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700"
              />
              {errors.leverage && (
                <p className="text-rose-500 text-sm">
                  {errors.leverage.message}
                </p>
              )}
            </div>
          </div>

          <CardFooter className="col-span-2 col-start-1 row-start-6">
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
            >
              Siguente
            </button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
};

export default BasicData;
