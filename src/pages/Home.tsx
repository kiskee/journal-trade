import { useContext } from 'react';
import { UserDetailContext } from '@/context/UserDetailContext';
import { Link } from 'react-router-dom';
import { PlusCircle, BrainCircuit, TrendingUp } from 'lucide-react';

import Calculator from "@/components/calculator/Calculator";
import CreateStrategyForm from "@/components/strategies/CreateStrategyForm";
import LastTrade from "@/components/LastTrade";
import LivePrices from "@/components/livePrices/LivePrices";
import News from "@/components/news/News";

export default function Home() {
  const context = useContext(UserDetailContext);
  const userName = context?.userDetail?.name || 'Trader';

  return (
    <div className="w-full min-h-screen bg-black">
      <LivePrices />

      <main className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Bienvenido de nuevo, <span className="text-blue-500">{userName}</span>
          </h1>
          <p className="text-neutral-400 mt-1">Listo para conquistar los mercados hoy?</p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left/Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/trade" className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 rounded-2xl flex items-center gap-4 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-800/30 transition-all duration-300">
                <PlusCircle className="w-10 h-10" />
                <div>
                  <h2 className="font-bold text-xl">Registrar Trade</h2>
                  <p className="text-sm opacity-80">Añade una nueva operación a tu journal.</p>
                </div>
              </Link>
              <div className="bg-neutral-800/50 border border-neutral-700 p-6 rounded-2xl flex items-center gap-4 hover:border-blue-700/70 transition-all duration-300">
                <BrainCircuit className="w-10 h-10 text-amber-400" />
                <div>
                  <h2 className="font-bold text-xl text-white">Nueva Estrategia</h2>
                  <CreateStrategyForm onlyForm={false}/>
                </div>
              </div>
            </div>

            {/* Last Trade */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp size={24} className="text-green-400"/>Última Operación Registrada</h3>
              <LastTrade />
            </div>

            {/* Calculator */}
            <div className="bg-neutral-900/50 border-4 border-blue-600 shadow-2xl shadow-blue-800 rounded-2xl p-6 flex flex-col items-center">
              <h2 className="text-2xl font-bold text-center text-white mb-1">Calculadora de Lotaje</h2>
              <p className="text-center text-neutral-400 mb-4 max-w-md">Calcula tu riesgo y tamaño de posición rápidamente.</p>
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
      </main>
    </div>
  );
}