const LotajeResumen = ({ lotaje }: { lotaje: number }) => (
  <div className="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-green-500">
    <div className="text-center">
      <p className="text-sm sm:text-base text-gray-600 mb-1">Lotaje Calculado</p>
      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">{lotaje}</p>
      <p className="text-sm text-gray-500">lotes</p>
    </div>
  </div>
);

export default LotajeResumen;