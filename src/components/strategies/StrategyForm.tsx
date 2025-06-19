import { Check } from "lucide-react";

interface Propis {
    handleSubmit: any
    onSubmit: any
    register: any
    errors:any
}

const StrategyForm = ({handleSubmit, onSubmit, register, errors }:Propis) => {
  return (
    <div className="flex justify-center w-full items-center">
      <div className="flex flex-col p-4 border-4 border-blue-600 text-center shadow-2xl shadow-blue-800 rounded-md items-center w-full max-w-md">
        <h1 className="text-blue-600 text-xl font-bold mb-4">
          Nueva Estrategia
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-neutral-200 text-sm mb-1">
              Nombre:
            </label>
            <input
              {...register("strategyName")}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
            />
            {errors.strategyName && (
              <p className="text-rose-500 text-xs">
                {errors.strategyName.message}
              </p>
            )}
          </div>

          {/* Entrada */}
          <div>
            <label className="block text-neutral-200 text-sm mb-1">
              Requisitos de entrada:
            </label>
            <textarea
              {...register("entryType")}
              rows={3}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm resize-none"
            />
            {errors.entryType && (
              <p className="text-rose-500 text-xs">
                {errors.entryType.message}
              </p>
            )}
          </div>

          {/* Salida */}
          <div>
            <label className="block text-neutral-200 text-sm mb-1">
              Requisitos de salida:
            </label>
            <textarea
              {...register("exitType")}
              rows={3}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm resize-none"
            />
            {errors.exitType && (
              <p className="text-rose-500 text-xs">{errors.exitType.message}</p>
            )}
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-300"
          >
            <Check size={18} className="mr-1" />
            Guardar Estrategia
          </button>
        </form>
      </div>
    </div>
  );
};

export default StrategyForm;
