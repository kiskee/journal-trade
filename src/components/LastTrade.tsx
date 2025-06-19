import ModuleService from "@/services/moduleService";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useContext, useEffect, useState } from "react";

const LastTrade = () => {
  const [tradeData, setTradeData] = useState(null as any);
  const context = useContext(UserDetailContext);
  if (!context) {
    throw new Error(
      "UserDetailContext debe usarse dentro de un UserDetailProvider"
    );
  }
  const { userDetail } = context;
  useEffect(() => {
    const lastTrade = async () => {
      try {
        const lastTradeData = await ModuleService.trades.lastTrade(
          "user",
          userDetail?.id
        );
        setTradeData(lastTradeData.results);
      } catch (error) {
        console.log(error);
      }
    };
    lastTrade();
  }, []);

  return (
    <>
      {tradeData && (
        <>
          <div className="w-full max-w-4xl mx-auto p-4 bg-neutral-900 text-white rounded-xl border border-green-400 shadow-md shadow-green-400">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-lg font-semibold text-blue-500">
                  Último Trade -{" "}
                  {new Date(tradeData.step1.date).toLocaleDateString()}
                </h2>
                <p className="text-sm text-neutral-300">
                  {tradeData.step1.asset.toUpperCase()} -{" "}
                  {tradeData.step1.tradeType.toUpperCase()}
                </p>
              </div>
              <div className="text-sm text-right sm:text-left">
                <p>
                  <span className="text-neutral-400">Resultado:</span>{" "}
                  <span className="text-green-400 font-medium">
                    ${tradeData.step2.resultUsd}
                  </span>
                </p>
                <p>
                  <span className="text-neutral-400">Confianza:</span>{" "}
                  {tradeData.step3.confidenceLevel}/10
                </p>
              </div>
            </div>

            <div className="mt-3 text-sm text-neutral-300 flex flex-wrap gap-4">
              <p>
                <span className="text-neutral-400">Antes:</span>{" "}
                {tradeData.step3.emotionBefore}
              </p>
              <p>
                <span className="text-neutral-400">Después:</span>{" "}
                {tradeData.step3.emotionAfter}
              </p>
              <p>
                <span className="text-neutral-400">Setup:</span>{" "}
                {tradeData.step1.setup}
              </p>
              <p>
                <span className="text-neutral-400">Duración:</span>{" "}
                {tradeData.step1.duration} {tradeData.step1.durationUnit}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LastTrade;
