import { useContext, useEffect, useState } from "react";
import ModuleService from "@/services/moduleService";
import { UserDetailContext } from "@/context/UserDetailContext";

const Portfolio = () => {
  const [trades, setTrades] = useState(null as any);
  const context = useContext(UserDetailContext);
  if (!context) {
    throw new Error(
      "UserDetailContext debe usarse dentro de un UserDetailProvider"
    );
  }
  const { userDetail } = context;

  useEffect(() => {
    const initials = async () => {
      const results = await ModuleService.trades.byUser("user", userDetail?.id);
      const sorted = results.results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTrades(sorted);
    };
    initials();
  }, []);

  return (
    <div className="min-h-screen w-full bg-neutral-900 p-6 text-blue-600 overflow-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Portfolio - Trades</h1>

      {trades && trades.length > 0 ? (
        <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 justify-items-center">
          {trades.map((trade: any) => (
            <div
              key={trade.id}
              className="bg-neutral-800 text-white rounded-lg shadow-md p-6 border border-neutral-700 w-full h-full"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {trade.step1.asset.toUpperCase()} - {trade.step1.setup}
                  </h3>
                  <p className="text-sm text-neutral-400">
                    {new Date(trade.date).toLocaleDateString("es-ES")} -{" "}
                    {trade.step1.time}
                  </p>
                </div>
                <div>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      trade.step2.resultUsd > 0
                        ? "bg-green-500 text-black"
                        : "bg-red-500 text-black"
                    }`}
                  >
                    {trade.step1.tradeType === "venta" ? "SELL" : "BUY"}
                  </span>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                {/* Información */}
                <div>
                  <h4 className="font-medium text-blue-400 mb-2">
                    Información
                  </h4>
                  <p className="text-sm">
                    Duración: {trade.step1.duration} {trade.step1.durationUnit}
                  </p>
                  <p className="text-sm">Tamaño: {trade.step1.positionSize}</p>
                  <p className="text-sm">Entrada: ${trade.step2.entryPrice}</p>
                  <p className="text-sm">Salida: ${trade.step2.exitPrice}</p>
                </div>

                {/* Resultados */}
                <div>
                  <h4 className="font-medium text-blue-400 mb-2">Resultados</h4>
                  <p
                    className={`text-sm ${
                      trade.step2.resultUsd > 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    USD: ${trade.step2.resultUsd}
                  </p>
                  <p
                    className={`text-sm ${
                      trade.step2.resultPercent > 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    %: {trade.step2.resultPercent}%
                  </p>
                  <p className="text-sm">TP: ${trade.step2.takeProfit}</p>
                  <p className="text-sm">SL: ${trade.step2.stopLoss}</p>
                </div>

                {/* Psicología */}
                <div>
                  <h4 className="font-medium text-blue-400 mb-2">Psicología</h4>
                  <p className="text-sm">Antes: {trade.step3.emotionBefore}</p>
                  <p className="text-sm">Después: {trade.step3.emotionAfter}</p>
                  <p className="text-sm">
                    Confianza: {trade.step3.confidenceLevel}/10
                  </p>
                  <p className="text-sm">
                    Disciplina: {trade.step3.disciplineLevel}/10
                  </p>
                </div>
              </div>

              {/* Notas y Tags */}
              <div className="border-t border-neutral-700 pt-4">
                {trade.step4.notes && (
                  <div className="mb-3">
                    <h4 className="font-medium text-blue-400 mb-1">Notas</h4>
                    <p className="text-sm text-neutral-300">
                      {trade.step4.notes}
                    </p>
                  </div>
                )}

                {trade.step4.tags?.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-medium text-blue-400 mb-1">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {trade.step4.tags.map((tag: any, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Plan y media */}
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        trade.step4.followedPlan ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    <span className="text-sm text-neutral-300">
                      {trade.step4.followedPlan
                        ? "Siguió el plan"
                        : "No siguió el plan"}
                    </span>
                  </div>

                  {trade.step4.mediaUrl && (
                    <a
                      href={trade.step4.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline hover:text-blue-400"
                    >
                      Ver gráfico
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-neutral-400 text-lg">
            No tienes trades registrados aún
          </p>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
