import { Link } from "react-router-dom";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useContext, useEffect, useState } from "react";
import ModuleService from "@/services/moduleService";
import Loading from "@/components/Loading";

interface TradeResponse {
  count: number;
  results: any[];
}

export default function Home() {
  const [data, setData] = useState<TradeResponse>();
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
        setData(results);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, []);
  //console.log(data)
  return (
    <>
      <div className="grid grid-cols-4 grid-rows-4 gap-4 w-screen h-screen p-8">
        <div className="shadow-sm shadow-blue-400">
          {isLoading ? (
            <Loading text="loading" />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-950  shadow-md w-full h-full">
              <span className="text-lg font-medium text-white"># Trades</span>
              <span className="text-4xl font-bold text-blue-600 mt-2">
                {data && data.count}
              </span>{" "}
              {/* <- reemplaza el número dinámicamente */}
            </div>
          )}
        </div>
        <div className="col-span-2 shadow-sm shadow-blue-400 flex items-center justify-center h-full">
          <Link
            to="/trade"
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-blue-400"
          >
            Registra tu primera operación
          </Link>
        </div>
        <div className="col-start-4 shadow-sm shadow-blue-400">4</div>
        <div className="row-start-2 shadow-sm shadow-blue-400">5</div>
        <div className="row-start-2 shadow-sm shadow-blue-400">6</div>
        <div className="row-start-2 shadow-sm shadow-blue-400">7</div>
        <div className="row-start-2 shadow-sm shadow-blue-400">8</div>
        <div className="shadow-sm shadow-blue-400">9</div>
        <div className="shadow-sm shadow-blue-400">10</div>
        <div className="row-start-3 shadow-sm shadow-blue-400">11</div>
        <div className="shadow-sm shadow-blue-400">12</div>
        <div className="shadow-sm shadow-blue-400">13</div>
        <div className="shadow-sm shadow-blue-400">14</div>
        <div className="row-start-4 shadow-sm shadow-blue-400">15</div>
        <div className="shadow-sm shadow-blue-400">16</div>
      </div>
    </>
  );
}
