import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formShemaBasicData } from "../utils/Shemas";
import { z } from "zod";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, ChevronRight, ChevronsUpDown } from "lucide-react";
import { useEffect, useState, type ReactElement } from "react";
import ModuleService from "@/services/moduleService";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import CreateStrategyForm from "../strategies/CreateStrategyForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import  Loading from "../utils/Loading";

interface FormStepProps {
  onNext: (data: any) => void;
  onPrev: () => void;
  initialData?: any;
  isFirst: boolean;
  isLast: boolean;
  header: ReactElement<any, any>;
  userId: string;
}

const BasicData = (props: FormStepProps) => {
  const [strategyDate, setStrategyDate] = useState(null as any);
  const [accounts, setAccounts] = useState(null as any);
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState("");
  const [strategyCreated, setStrategyCreated] = useState(null as any);
  const [loadingfetch, setLoadingfetch] = useState(true);

  useEffect(() => {
    const strategiesDate = async () => {
      try {
        const results = await ModuleService.strategies.byUser(
          "user",
          props.userId
        );
        const accountFetch: any = await ModuleService.accounts.byUser();

        setStrategyDate(results.results);
        setAccounts(accountFetch.data);
        setLoadingfetch(false);
      } catch (error) {
        console.log(error);
      }
    };

    strategiesDate();
  }, [strategyCreated]);

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
      accountId: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }, //isSubmitting
    // setError,
    // clearErrors,
  } = form;

  const onSubmit = (data: FormSchema) => {
    props.onNext(data);
  };

  const handleStrategyResult = (success: any) => {
    if (success) {
      // Aquí puedes recargar tu lista de estrategias
      // o hacer cualquier otra acción
      setStrategyCreated(false);
    } else {
      console.log("Error al crear la estrategia");
    }
  };
  return (
    <>
      {loadingfetch ? <Loading  text="Cargado datos"/> : <div className="flex justify-center  w-full items-center">
        <div className="flex flex-col p-4 border-4 border-yellow-500 text-center shadow-2xl shadow-yellow-500/40 rounded-md items-center w-full max-w-xl">
          {props.header}
          <h1 className="text-center font-semibold text-yellow-500 text-2xl">
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

            <div className="flex flex-col items-center justify-center w-full mb-4">
              {accounts && (
                <>
                <label className="block mb-1 text-neutral-200 text-sm">
                  Cuenta...
                </label>
                <Select onValueChange={(value) => setValue("accountId", value)}>
                  <SelectTrigger  className="w-full p-2 rounded bg-neutral-800 border-neutral-700 text-sm">
                    <SelectValue placeholder="Selecciona una cuenta..." className="placeholder:text-white"/>
                  </SelectTrigger>
                  <SelectContent className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm">
                    {accounts.map((account: any) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} - {account.currency}{" "}
                        {account.currentBalance}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </>
              )}
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
                  type="hidden"
                  {...register("setup", { value: localValue })}
                />
                {strategyDate ? (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-neutral-800 text-neutral-50 border-neutral-700 hover:bg-neutral-700 text-sm h-10"
                      >
                        {localValue || "Selecciona una estrategia..."}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-neutral-800 border-neutral-700">
                      <Command className="bg-neutral-800">
                        <CommandInput
                          placeholder="Buscar estrategia..."
                          className="h-9 bg-neutral-800 text-neutral-50 border-neutral-700"
                        />
                        <CommandList>
                          <CommandEmpty className="text-neutral-400">
                            No se encontró ninguna estrategia.
                          </CommandEmpty>
                          <CommandGroup>
                            {strategyDate.map((strategy: any) => (
                              <CommandItem
                                key={strategy.id}
                                value={strategy.strategyName}
                                onSelect={(currentValue) => {
                                  const newValue =
                                    currentValue === localValue
                                      ? ""
                                      : currentValue;
                                  setLocalValue(newValue);
                                  setValue("setup", newValue);
                                  setOpen(false);
                                }}
                                className="text-neutral-50 hover:bg-neutral-700"
                              >
                                {strategy.strategyName}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    localValue === strategy.strategyName
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div className="w-full h-full">
                    <CreateStrategyForm
                      onlyForm={false}
                      onStrategyCreated={handleStrategyResult}
                    />
                  </div>
                )}
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
              className={`w-full text-black p-6 rounded-2xl flex items-center justify-center gap-4 text-sm sm:text-base
  bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400
  hover:from-yellow-700 hover:via-yellow-600 hover:to-yellow-500
  hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/30
  transition-all duration-300 ${props.isFirst ? "ml-auto" : ""}`}
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
      </div>}
    </>
  );
};

export default BasicData;
