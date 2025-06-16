import {
  tradingPairs,
  calcularLotaje,
  type CalculoLotajeResult,
} from "./CalUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CalForm from "./CalForm";
import { useState } from "react";
import ResultDialog from "./ResultDisplay ";

const formSchema = z.object({
  par: z.string().min(1, "Debes seleccionar un par"),
  stopLossPips: z.number().min(1, "Stop loss debe ser mayor a 0"),
  riskUSD: z.number().min(1, "El riesgo debe ser mayor a 0"),
});

const Calculator = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [result, setResult] = useState<CalculoLotajeResult | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      par: "",
      stopLossPips: undefined,
      riskUSD: undefined,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const calculoResult = calcularLotaje(
        data.par,
        data.stopLossPips,
        data.riskUSD
      );
      setResult(calculoResult);
      setIsDialogOpen(true); // Abrir el dialog automáticamente
    } catch (err) {
      // Manejar error
    }
  };

  const handleNewCalculation = () => {
    setResult(null);
    form.reset(); // Resetear tu formulario
  };
  //console.log(result);
  return (
    <>
      <div className="pt-4">
        <>
          <CalForm
            form={form}
            tradingPairs={tradingPairs}
            onSubmit={onSubmit}
          />
          <ResultDialog
            result={result}
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onNewCalculation={handleNewCalculation}
          />
        </>
      </div>
    </>
  );
};

export default Calculator;
