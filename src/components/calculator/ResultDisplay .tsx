
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

const ResultDialog = ({ result, isOpen, onOpenChange, onNewCalculation }: ResultDialogProps) => {
  if (!result) return null;

  const handleNewCalculation = () => {
    onOpenChange(false);
    onNewCalculation?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>📊 Resultado del Cálculo</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              {result.par}
            </span>
          </DialogTitle>
          <DialogDescription>
            Aquí tienes el cálculo de lotaje basado en tu riesgo y stop loss.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resultado Principal */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-green-500">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Lotaje Calculado</p>
              <p className="text-3xl font-bold text-green-600">{result.lotaje}</p>
              <p className="text-sm text-gray-500">lotes</p>
            </div>
          </div>

          {/* Grid de información */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Stop Loss</p>
              <p className="text-lg font-semibold text-gray-800">{result.stopLossPips} <span className="text-sm font-normal">pips</span></p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Riesgo</p>
              <p className="text-lg font-semibold text-gray-800">${result.riesgoUSD} <span className="text-sm font-normal">USD</span></p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Valor por Pip</p>
              <p className="text-lg font-semibold text-gray-800">${result.pipValue}</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Riesgo por Pip</p>
              <p className="text-lg font-semibold text-gray-800">${result.detalles.riesgoPorPip}</p>
            </div>
          </div>

          {/* Detalles adicionales */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">💡 Detalles del Cálculo</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Riesgo Total Real:</span>
                <span className="text-sm font-medium text-gray-800">${result.detalles.riesgoTotal.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Lotaje Redondeado:</span>
                <span className="text-sm font-medium text-gray-800">{result.detalles.lotajeRedondeado} lotes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Diferencia de Riesgo:</span>
                <span className="text-sm font-medium text-orange-600">
                  ${Math.abs(result.riesgoUSD - result.detalles.riesgoTotal).toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>

          {/* Nota informativa */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 <strong>Nota:</strong> El riesgo real puede diferir ligeramente del objetivo debido al redondeo del lotaje a 2 decimales.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">
              Cerrar
            </Button>
          </DialogClose>
          <Button 
            onClick={handleNewCalculation}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Nueva Calculación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResultDialog