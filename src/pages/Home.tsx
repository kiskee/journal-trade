import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Link } from "react-router-dom";
import { PlusCircle, ChartCandlestick, TrendingUp } from "lucide-react";

import Calculator from "@/components/calculator/Calculator";
import CreateStrategyForm from "@/components/strategies/CreateStrategyForm";
import LastTrade from "@/components/LastTrade";
import News from "@/components/news/News";
import CreateNote from "@/components/notes/CreateNote";

export default function Home() {
  const context = useContext(UserDetailContext);
  const userName = context?.userDetail?.name || "Trader";
 

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Fondo con gradiente sutil */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-black to-yellow-800/10 pointer-events-none"></div> */}
      
      <main className="relative p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Bienvenido de nuevo,{" "}
            <span className="text-yellow-400">{userName}</span>
          </h1>
          <p className="text-neutral-400 mt-1">
            Listo para conquistar los mercados hoy?
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left/Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                to="/trade"
                className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-black p-6 rounded-2xl flex items-center gap-4 hover:from-yellow-700 hover:via-yellow-600 hover:to-yellow-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300"
              >
                <PlusCircle className="w-10 h-10" />
                <div>
                  <h2 className="font-bold text-xl">Registrar Trade</h2>
                  <p className="text-sm opacity-80">
                    Añade una nueva operación a tu journal.
                  </p>
                </div>
              </Link>
              <div className="bg-neutral-950 border border-yellow-600/30 p-6 rounded-2xl flex items-center gap-4 hover:border-yellow-500/50 backdrop-blur-sm transition-all duration-300">
                <ChartCandlestick className="w-10 h-10 text-yellow-400" />
                <div>
                  <h2 className="font-bold text-xl text-yellow-100">
                    Nueva Estrategia
                  </h2>
                  <CreateStrategyForm onlyForm={false} />
                </div>
              </div>
            </div>

            {/* Last Trade */}
            <div>
              <h3 className="text-xl font-semibold text-yellow-100 mb-4 flex items-center gap-2">
                <TrendingUp size={24} className="text-yellow-400" />
                Última Operación Registrada
              </h3>
              <LastTrade />
            </div>

            {/* Calculator */}
            <div className="bg-neutral-950 border border-yellow-600/30 shadow-2xl shadow-yellow-500/20 rounded-2xl p-6 flex flex-col items-center backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-center text-yellow-100 mb-1">
                Calculadora de Lotaje
              </h2>
              <p className="text-center text-neutral-400 mb-4 max-w-md">
                Calcula tu riesgo y tamaño de posición rápidamente.
              </p>
              <div className="w-full max-w-md">
                <Calculator />
              </div>
            </div>
          </div>

          {/* Right/Sidebar Column */}
          <div className="lg:col-span-1">
            <News />
          </div>
        </div>
        <CreateNote />
      </main>
    </div>
  );
}
