// components/ResultDialog/DetallesCalculo.tsx

import type { CalculoLotajeResult } from "./CalUtils";


const DetallesCalculo = ({ result }: { result: CalculoLotajeResult }) => {
  const diferencia = Math.abs(result.riesgoUSD - result.detalles.riesgoTotal).toFixed(2);

  return (
    <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
      <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-3">
        💡 Detalles del Cálculo
      </h4>
      <div className="space-y-2">
        <InfoRow label="Riesgo Total Real" value={`$${result.detalles.riesgoTotal.toFixed(2)} USD`} />
        <InfoRow label="Lotaje Redondeado" value={`${result.detalles.lotajeRedondeado} lotes`} />
        <InfoRow label="Diferencia de Riesgo" value={`$${diferencia} USD`} highlight />
      </div>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
    <span className="text-sm text-gray-600">{label}:</span>
    <span
      className={`text-sm font-medium ${
        highlight ? "text-orange-600" : "text-gray-800"
      }`}
    >
      {value}
    </span>
  </div>
);

export default DetallesCalculo;
