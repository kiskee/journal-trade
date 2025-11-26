import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import type { UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";
import { Suspense } from "react";
import SelectPair from "./SelectPair";


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
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        {/* Select de Pares */}
        <div className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="par"
            render={({ field }) => (
              <Suspense fallback={<div className="text-yellow-100">Cargando selector...</div>}>
                <SelectPair
                  value={field.value}
                  onChange={(value) =>
                    form.setValue("par", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }
                  tradingPairs={tradingPairs}
                />
              </Suspense>
            )}
          />
          <div className="space-y-4">
            {/* Stop Loss en pips */}
            <FormField
              control={form.control}
              name="stopLossPips"
              render={({ field }) => (
                <FormItem className="text-yellow-100">
                  <FormLabel className="text-yellow-400 font-medium text-center block">
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
                      className="bg-neutral-900 border-yellow-600/30 text-yellow-100 placeholder-neutral-500 focus:border-yellow-500 focus:ring-yellow-500 text-center"
                    />
                  </FormControl>
                  <FormMessage className="text-center text-red-400" />
                </FormItem>
              )}
            />

            {/* Riesgo en USD */}
            <FormField
              control={form.control}
              name="riskUSD"
              render={({ field }) => (
                <FormItem className="text-yellow-100">
                  <FormLabel className="text-yellow-400 font-medium text-center block">Riesgo ($USD)</FormLabel>
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
                      className="bg-neutral-900 border-yellow-600/30 text-yellow-100 placeholder-neutral-500 focus:border-yellow-500 focus:ring-yellow-500 text-center"
                    />
                  </FormControl>
                  <FormMessage className="text-center text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 hover:from-yellow-700 hover:via-yellow-600 hover:to-yellow-500 text-black px-6 py-3 rounded-lg text-lg font-semibold text-center transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-yellow-500/25 transform hover:-translate-y-0.5"
          >
            Calcular
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CalForm;
