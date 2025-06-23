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
import { lazy, Suspense } from "react";
const SelectPair = lazy(() => import("./SelectPair"));

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
              <Suspense fallback={<div>Cargando selector...</div>}>
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
