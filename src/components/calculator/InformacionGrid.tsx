import type { CalculoLotajeResult } from "./CalUtils";


const InformacionGrid = ({ result }: { result: CalculoLotajeResult }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <InfoItem label="Stop Loss" value={`${result.stopLossPips} pips`} />
    <InfoItem label="Riesgo" value={`$${result.riesgoUSD} USD`} />
    <InfoItem label="Valor por Pip" value={`$${result.pipValue}`} />
    <InfoItem label="Riesgo por Pip" value={`$${result.detalles.riesgoPorPip}`} />
  </div>
);

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
    <p className="text-xs sm:text-sm text-gray-600">{label}</p>
    <p className="text-lg sm:text-xl font-semibold text-gray-800">{value}</p>
  </div>
);

export default InformacionGrid;
