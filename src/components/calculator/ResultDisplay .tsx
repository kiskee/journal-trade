import { lazy, Suspense } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
const LotajeResumen = lazy(() => import("./LotajeResumen"));
const InformacionGrid = lazy(() => import("./InformacionGrid"));
const DetallesCalculo = lazy(() => import("./DetallesCalculo"));

interface CalculoLotajeResult {
  lotaje: number;
  par: string;
  stopLossPips: number;
  riesgoUSD: number;
  pipValue: number;
  detalles: {
    riesgoPorPip: number;
    riesgoTotal: number;
    lotajeRedondeado: number;
  };
}

interface ResultDialogProps {
  result: CalculoLotajeResult | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNewCalculation?: () => void;
}

const ResultDialog = ({
  result,
  isOpen,
  onOpenChange,
  onNewCalculation,
}: ResultDialogProps) => {
  if (!result) return null;

  const handleNewCalculation = () => {
    onOpenChange(false);
    onNewCalculation?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg lg:max-w-xl mx-auto w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-lg sm:text-xl">📊 Resultado del Cálculo</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              {result.par}
            </span>
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Aquí tienes el cálculo de lotaje basado en tu riesgo y stop loss.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Suspense fallback={<div>Cargando resumen...</div>}>
            <LotajeResumen lotaje={result.lotaje} />
          </Suspense>

          <Suspense fallback={<div>Cargando información...</div>}>
            <InformacionGrid result={result} />
          </Suspense>

          <Suspense fallback={<div>Cargando detalles...</div>}>
            <DetallesCalculo result={result} />
          </Suspense>

          <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs sm:text-sm text-blue-700">
              💡 <strong>Nota:</strong> El riesgo real puede diferir ligeramente
              del objetivo debido al redondeo del lotaje a 2 decimales.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 flex-col sm:flex-row">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Cerrar
            </Button>
          </DialogClose>
          <Button
            onClick={handleNewCalculation}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            Nueva Calculación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResultDialog;
