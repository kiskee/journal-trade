import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";
import { useState } from "react";

type FormValues = {
  par: string;
  stopLossPips: number;
  riskUSD: number;
};

type Props = {
  form: UseFormReturn<FormValues>;
  tradingPairs: { value: string; label: string }[];
  onSubmit: (data: FormValues) => void;
};

const CalForm = ({ form, tradingPairs, onSubmit }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        {/* Select de Pares */}
        <div className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="par"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormLabel className="text-blue-600 text-2xl">Pares</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground",
                          "text-black"
                        )}
                      >
                        {field.value
                          ? tradingPairs.find(
                              (pair) => pair.value === field.value
                            )?.label
                          : "Selecciona un Par"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Buscar..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No se encontró el par.</CommandEmpty>
                        <CommandGroup>
                          {tradingPairs.map((pair) => (
                            <CommandItem
                              value={pair.label}
                              key={pair.value}
                              onSelect={() => {
                                form.setValue("par", pair.value, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                  shouldTouch: true,
                                });
                                setOpen(false);
                              }}
                            >
                              {pair.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  pair.value === field.value
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
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row text-center gap-6">
            {/* Stop Loss en pips */}
            <FormField
              control={form.control}
              name="stopLossPips"
              render={({ field }) => (
                <FormItem className="text-white text-center">
                  <FormLabel className="text-blue-600">
                    Stop Loss (en pips)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ej: 50"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? undefined
                            : parseFloat(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />

            {/* Riesgo en USD */}
            <FormField
              control={form.control}
              name="riskUSD"
              render={({ field }) => (
                <FormItem className="text-white">
                  <FormLabel className="text-blue-600">Riesgo ($USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ej: 25"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? undefined
                            : parseFloat(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg text-lg font-semibold text-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Calcular
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CalForm;
