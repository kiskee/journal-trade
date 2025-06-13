import { UserDetailContext } from "@/context/UserDetailContext";
import { useContext, useEffect, useState } from "react";
import ModuleService from "@/services/moduleService";
import Loading from "@/components/Loading";
import { dataAnalisis, type TradingMetrics } from "@/services/dataAnalisis";



const Analytics = () => {
  const [data, setData] = useState<TradingMetrics>();
  const context = useContext(UserDetailContext);
  const [isLoading, setIsLoading] = useState(false);
  if (!context) {
    throw new Error(
      "UserDetailContext debe usarse dentro de un UserDetailProvider"
    );
  }
  const { userDetail } = context;
  //console.log(userDetail)
  useEffect(() => {
    setIsLoading(true);
    const init = async () => {
      try {
        const results = await ModuleService.trades.byUser(
          "user",
          userDetail?.id
        );

        const result = dataAnalisis(results);
        setData(result);
        //console.log(mostrarResumenMetricas(result));
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setData(undefined);
        setIsLoading(false);
      }
    };
    init();
  }, []);
  
  return (
    <>
      <div className="grid grid-cols-4 grid-rows-4 gap-4 w-screen h-screen px-8 pt-2 pb-19">
        <div className="shadow-sm shadow-blue-400">
          {isLoading ? (
            <Loading text="loading" />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-950  shadow-lg w-full h-full shadow-blue-800">
              <span className="text-lg font-medium text-white"># Trades</span>
              <span className="text-4xl font-bold text-blue-600 mt-2">
                {data?.totalTrades ?? 0}
              </span>{" "}
              {/* <- reemplaza el número dinámicamente */}
            </div>
          )}
        </div>
        <div className="col-span-2 w-full  h-full  bg-neutral-900">
          <div className="grid grid-cols-2 grid-rows-1 gap-4 h-full">
            <div className="shadow-sm shadow-blue-400">
              {isLoading ? (
                <Loading text="loading" />
              ) : (
                <div className="flex flex-col items-center justify-center p-4 bg-neutral-950  shadow-lg w-full h-full shadow-blue-800">
                  <span className="text-lg font-medium text-white">
                    # Trades
                  </span>
                  <span className="text-4xl font-bold text-blue-600 mt-2">
                    {data?.totalTrades ?? 0}
                  </span>{" "}
                  {/* <- reemplaza el número dinámicamente */}
                </div>
              )}
            </div>
            <div className="shadow-sm shadow-blue-400">
              {isLoading ? (
                <Loading text="loading" />
              ) : (
                <div className="flex flex-col items-center justify-center p-4 bg-neutral-950  shadow-lg w-full h-full shadow-blue-800">
                  <span className="text-lg font-medium text-white">
                    # Trades
                  </span>
                  <span className="text-4xl font-bold text-blue-600 mt-2">
                    {data?.totalTrades ?? 0}
                  </span>{" "}
                  {/* <- reemplaza el número dinámicamente */}
                </div>
              )}
            </div>
          </div>
          {/* <Link
            to="/trade"
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-blue-400"
          >
            Registra tu primera operación
          </Link> */}
        </div>

        <div className="col-start-4 shadow-sm shadow-blue-400">
          {isLoading ? (
            <Loading text="loading" />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-950  shadow-lg w-full h-full shadow-blue-800">
              <span className="text-lg font-medium text-white">
                Tasa de éxito:
              </span>
              <span className="text-4xl font-bold text-blue-600 mt-2">
                {data?.winRate ?? 0}%
              </span>{" "}
              {/* <- reemplaza el número dinámicamente */}
            </div>
          )}
        </div>
        <div className="row-start-2 shadow-sm shadow-blue-400">
          {isLoading ? (
            <Loading text="loading" />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-950  shadow-lg shadow-blue-800 w-full h-full">
              <span className="text-lg font-medium text-white">
                Trades ganadores:
              </span>
              <span className="text-4xl font-bold text-blue-600 mt-2">
                {data?.profitableTrades ?? 0}
              </span>{" "}
              {/* <- reemplaza el número dinámicamente */}
            </div>
          )}
        </div>
        <div className="row-start-2 shadow-sm shadow-blue-400">
          {isLoading ? (
            <Loading text="loading" />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-950  shadow-lg shadow-blue-800 w-full h-full">
              <span className="text-lg font-medium text-white">PnL Total:</span>
              <span className="text-4xl font-bold text-blue-600 mt-2">
                {data?.totalPnL ?? 0}
              </span>{" "}
              {/* <- reemplaza el número dinámicamente */}
            </div>
          )}
        </div>
        <div className="row-start-2 shadow-sm shadow-blue-400">
          {isLoading ? (
            <Loading text="loading" />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-950  shadow-lg shadow-blue-800 w-full h-full">
              <span className="text-lg font-medium text-white">PnL Neto:</span>
              <span className="text-4xl font-bold text-blue-600 mt-2">
                {data?.netPnL ?? 0}
              </span>{" "}
              {/* <- reemplaza el número dinámicamente */}
            </div>
          )}
        </div>
        <div className="row-start-2 shadow-sm shadow-blue-400">
          {isLoading ? (
            <Loading text="loading" />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-950  shadow-lg shadow-blue-800 w-full h-full">
              <span className="text-lg font-medium text-white">
                Trades perdedores:
              </span>
              <span className="text-4xl font-bold text-blue-600 mt-2">
                {data?.losingTrades ?? 0}
              </span>{" "}
              {/* <- reemplaza el número dinámicamente */}
            </div>
          )}
        </div>
        <div className="shadow-sm shadow-blue-400">
          {isLoading ? (
            <Loading text="loading" />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-950  shadow-lg shadow-blue-800 w-full h-full">
              <span className="text-lg font-medium text-white">
                Comisiones:
              </span>
              <span className="text-4xl font-bold text-blue-600 mt-2">
                {data?.totalFees ?? 0}
              </span>{" "}
              {/* <- reemplaza el número dinámicamente */}
            </div>
          )}
        </div>
        <div className="shadow-sm shadow-blue-400">
          {isLoading ? (
            <Loading text="loading" />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-950  shadow-lg shadow-blue-800 w-full h-full">
              <span className="text-lg font-medium text-white">
                Ganancia promedio:
              </span>
              <span className="text-4xl font-bold text-blue-600 mt-2">
                {data?.averageWin ?? 0}
              </span>{" "}
              {/* <- reemplaza el número dinámicamente */}
            </div>
          )}
        </div>
        <div className="row-start-3 shadow-sm shadow-blue-400">
          {isLoading ? (
            <Loading text="loading" />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-950  shadow-lg shadow-blue-800 w-full h-full">
              <span className="text-lg font-medium text-white">
                Confianza promedio:
              </span>
              <span className="text-4xl font-bold text-blue-600 mt-2">
                {data?.averageConfidenceBefore ?? 0}/10
              </span>{" "}
              {/* <- reemplaza el número dinámicamente */}
            </div>
          )}
        </div>
        <div className="shadow-sm shadow-blue-400">
          {isLoading ? (
            <Loading text="loading" />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-950  shadow-lg shadow-blue-800 w-full h-full">
              <span className="text-lg font-medium text-white">
                Disciplina promedio:
              </span>
              <span className="text-4xl font-bold text-blue-600 mt-2">
                {data?.averageDiscipline ?? 0}/10
              </span>{" "}
              {/* <- reemplaza el número dinámicamente */}
            </div>
          )}
        </div>
        <div className="shadow-sm shadow-blue-400">
          {isLoading ? (
            <Loading text="loading" />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-950  shadow-lg shadow-blue-800 w-full h-full">
              <span className="text-lg font-medium text-white">
                Pérdida promedio:
              </span>
              <span className="text-4xl font-bold text-blue-600 mt-2">
                {data?.averageLoss ?? 0}
              </span>{" "}
              {/* <- reemplaza el número dinámicamente */}
            </div>
          )}
        </div>
        <div className="shadow-sm shadow-blue-400">
          {isLoading ? (
            <Loading text="loading" />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-950  shadow-lg shadow-blue-800 w-full h-full">
              <span className="text-lg font-medium text-white">
                Factor de beneficio:
              </span>
              <span className="text-4xl font-bold text-blue-600 mt-2">
                {data?.profitFactor ?? 0}
              </span>{" "}
              {/* <- reemplaza el número dinámicamente */}
            </div>
          )}
        </div>
        <div className="row-start-4 shadow-sm shadow-blue-400">
          {isLoading ? (
            <Loading text="loading" />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-950  shadow-lg shadow-blue-800 w-full h-full">
              <span className="text-lg font-medium text-white">
                Duración promedio:
              </span>
              <span className="text-4xl font-bold text-blue-600 mt-2">
                {data?.averageDuration ?? 0} min
              </span>{" "}
              {/* <- reemplaza el número dinámicamente */}
            </div>
          )}
        </div>
        <div className="shadow-sm shadow-blue-400">
          {isLoading ? (
            <Loading text="loading" />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-950  shadow-lg shadow-blue-800 w-full h-full">
              <span className="text-lg font-medium text-white">
                Risk/Reward promedio:
              </span>
              <span className="text-4xl font-bold text-blue-600 mt-2">
                {data?.averageRiskReward ?? 0}
              </span>{" "}
              {/* <- reemplaza el número dinámicamente */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Analytics;
