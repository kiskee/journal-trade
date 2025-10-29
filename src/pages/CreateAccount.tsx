import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import ModuleService from "@/services/moduleService";
import toro from "../assets/toro.png";
import { useState } from "react";
import Loading from "@/components/utils/Loading";

// Tipos
const AccountSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(50, "Máximo 50 caracteres"),
  initialBalance: z
    .number({ message: "Debe ser un número" })
    .min(0, "El saldo inicial no puede ser negativo"),
  currency: z.string().min(1, "La divisa es requerida"),
  isprimary: z.boolean(),
});

type AccountForm = z.infer<typeof AccountSchema>;

const CURRENCIES = ["USD", "EUR", "COP", "GBP", "MXN"];

export default function CreateAccount() {
 const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<AccountForm>({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      name: "",
      initialBalance: 0,
      currency: "USD",
      isprimary: true,
    },
    mode: "onTouched",
  });

  const isPrimary = watch("isprimary");

  const onSubmit = async (values: AccountForm) => {
    try {
      setIsLoading(true);
      await ModuleService.accounts.create(values);
      navigate("/inicio", { replace: true });
    } catch (err) {
      console.error("Error creando la cuenta:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      {isLoading ? <Loading text="Creando tu cuenta" /> : <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto p-8 bg-black border border-yellow-300 rounded-2xl shadow-lg"
      >
        {/* Header */}
        <div className="mb-8">
            <div className="flex items-center justify-between">
                 <h2 className="text-3xl font-bold text-yellow-500">Crear cuenta</h2>
                  <img
                  src={toro}
                  alt="LØNNSOM Logo"
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain filter drop-shadow-md"
                />
            </div>
         
          <p className="text-sm text-white mt-1">
            Complete los datos para crear una nueva cuenta
          </p>
        </div>

        {/* Name Field */}
        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2">
            <label className="text-sm font-semibold text-yellow-500">
              Nombre
            </label>
            <span className="text-xs text-white">Máx 50 caracteres</span>
          </div>
          <input
            {...register("name")}
            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-600 text-white placeholder:text-white ${
              errors.name
                ? "border-red-400 bg-red-50"
                : "border-green-200 hover:border-green-300"
            }`}
            placeholder="Ej. Cuenta Principal"
          />
          {errors.name && (
            <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
              <span>⚠</span>
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Initial Balance Field */}
        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2">
            <label className="text-sm font-semibold text-yellow-500">
              Saldo inicial
            </label>
            <span className="text-xs text-white">Valor por defecto: 0</span>
          </div>
          <input
            type="number"
            step="0.01"
            {...register("initialBalance", { valueAsNumber: true })}
            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-600 placeholder:text-white text-white ${
              errors.initialBalance
                ? "border-red-400 bg-red-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            placeholder="50000"
          />
          {errors.initialBalance && (
            <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
              <span>⚠</span>
              {errors.initialBalance.message}
            </p>
          )}
        </div>

        {/* Currency Field */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Divisa
          </label>
          <select
            {...register("currency")}
            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow  -300 focus:border-yellow-600 bg-black text-yellow-500 ${
              errors.currency
                ? "border-red-400 bg-red-50"
                : "border-green-200 hover:border-green-300"
            }`}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.currency && (
            <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
              <span>⚠</span>
              {errors.currency.message}
            </p>
          )}
        </div>

        {/* Is Primary Toggle */}
        <div className="flex items-center justify-between p-4 mb-8 bg-black rounded-xl border-2 border-gray-100">
          <div>
            <div className="text-sm font-semibold text-yellow-500">
              Cuenta primaria
            </div>
            <div className="text-xs text-white mt-0.5">
              Marca esta cuenta como principal
            </div>
          </div>

          <button
            type="button"
            onClick={() => setValue("isprimary", !isPrimary)}
            className={`relative inline-flex items-center h-7 rounded-full w-12 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 ${
              isPrimary ? "bg-yellow-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`transform transition-transform duration-300 inline-block w-5 h-5 bg-white rounded-full shadow-md ${
                isPrimary ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <input type="hidden" {...register("isprimary")} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Link to="/dashboard" className="flex-1">
            <button
              type="button"
              className="w-full px-6 py-3 rounded-xl border-2 border-gray-300 text-white font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancelar
            </button>
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black hover:from-yellow-700 hover:via-yellow-600 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-yellow-500/25"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Guardando...
              </span>
            ) : (
              "Crear cuenta"
            )}
          </button>
        </div>
      </form>}
    </div>
  );
}
