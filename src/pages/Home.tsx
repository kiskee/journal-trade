import Calculator from "@/components/calculator/Calculator";
import CreateStrategyForm from "@/components/CreateStrategyForm";
import LastTrade from "@/components/LastTrade";
import LivePrices from "@/components/livePrices/LivePrices";
import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <LivePrices />
      <div className="flex flex-col items-center gap-6 p-4 pt-8">
        
        <div className="flex flex-row items-center justify-center gap-3">
          <TrendingUp className="w-24 h-24 md:w-12 md:h-12 text-emerald-400" />
          <h1 className="text-5xl text-white text-center">
            Lleva el control de tus trades como un pro
          </h1>
        </div>
        <CreateStrategyForm />
        <Link
          to="/trade"
          className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold text-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block"
        >
          Registrar Trade en Journal
        </Link>
        <LastTrade/>
        <div className=" border-blue-600 p-8 rounded-md border-4 shadow-xl shadow-blue-800 flex flex-col items-center">
          <h1 className="text-3xl text-blue-600 text-center pb-6">
            {" "}
            Calculadora de Lotajes{" "}
          </h1>
          <h1 className="text-2xl text-white text-center">
            {" "}
            Calcula Rapidamente tus lotajes{" "}
          </h1>
          <Calculator />
        </div>
        
        
      </div>
    </>
  );
}
