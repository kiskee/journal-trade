import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  TrendingUp,
  BarChart3,
  Wallet,
  BookOpen,
  Calculator as CalculatorIcon,
  Shield,
  Target,
  Lightbulb,
  Upload,
  Zap
} from "lucide-react";

import Calculator from "@/components/calculator/Calculator";
import LastTrade from "@/components/LastTrade";
import News from "@/components/news/News";
import { SidebarInset } from "@/components/ui/sidebar";
import { BreadcrumbCf } from "@/components/Breadcrumb";

export default function Home() {
  const context = useContext(UserDetailContext);
  const userName = context?.userDetail?.name || "Trader";

  return (
    <SidebarInset className="text-yellow-500">
      <BreadcrumbCf firstPage="Inicio" />
      <div className="w-full min-h-screen bg-black -mt-4">
        <main className="relative p-3 sm:p-4 md:p-6 lg:p-8 max-w-screen-2xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Bienvenido de nuevo,{" "}
              <span className="text-yellow-400">{userName}</span>
            </h1>
            <p className="text-neutral-400 mt-1 text-sm sm:text-base">
              Tu journal de trading profesional para mejorar tu rendimiento
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:mb-8">
            <div className="bg-neutral-950 border border-yellow-600/30 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-yellow-400" />
                <h3 className="font-semibold text-yellow-100">
                  Gestión de Riesgo
                </h3>
              </div>
              <p className="text-neutral-400 text-sm">
                Controla tu riesgo con nuestra calculadora de lotaje y mantén un
                registro detallado de cada operación.
              </p>
            </div>

            <div className="bg-neutral-950 border border-yellow-600/30 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-yellow-400" />
                <h3 className="font-semibold text-yellow-100">
                  Análisis Detallado
                </h3>
              </div>
              <p className="text-neutral-400 text-sm">
                Revisa tus estadísticas, identifica patrones y mejora tu
                estrategia con datos precisos.
              </p>
            </div>

            <div className="bg-neutral-950 border border-yellow-600/30 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <h3 className="font-semibold text-yellow-100">
                  Desarrollo Continuo
                </h3>
              </div>
              <p className="text-neutral-400 text-sm">
                Documenta tus emociones, estrategias y aprendizajes para
                evolucionar como trader.
              </p>
            </div>
          </div>

          {/* MetaTrader Analysis Service */}
          <div className="bg-gradient-to-r from-yellow-600/20 via-yellow-500/10 to-yellow-400/20 border border-yellow-500/30 rounded-2xl p-4 sm:p-6 mb-6 md:mb-8 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">DISPONIBLE</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-yellow-500/20 rounded-xl">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-yellow-100 mb-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span>Análisis Profesional de MetaTrader</span>
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                </h3>
                <p className="text-neutral-300 mb-4 text-sm sm:text-base">
                  ¡Nuevo servicio disponible! Sube tu archivo Excel de MetaTrader y obtén un análisis completo y profesional de tu historial de trading con métricas avanzadas, gráficos y estadísticas detalladas.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <Link 
                    to="/import-mt" 
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 text-sm sm:text-base w-fit"
                  >
                    <Upload className="w-4 h-4" />
                    Analizar Trades
                  </Link>
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-green-400">
                      <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Análisis Completo</span>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Métricas Avanzadas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8">
            {/* Left/Main Column */}
            <div className="xl:col-span-3 space-y-6 md:space-y-8">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <Link
                  to="/trade"
                  className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-black p-3 sm:p-4 rounded-xl flex flex-col items-center gap-2 hover:from-yellow-700 hover:via-yellow-600 hover:to-yellow-500 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-300"
                >
                  <PlusCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                  <span className="font-bold text-xs sm:text-sm text-center">
                    Nuevo Trade
                  </span>
                </Link>

                <Link
                  to="/analytics"
                  className="bg-neutral-950 border border-yellow-600/30 p-3 sm:p-4 rounded-xl flex flex-col items-center gap-2 hover:border-yellow-500/50 hover:bg-neutral-900 transition-all duration-300"
                >
                  <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                  <span className="font-bold text-xs sm:text-sm text-yellow-100 text-center">
                    Analytics
                  </span>
                </Link>

                <Link
                  to="/portfolio"
                  className="bg-neutral-950 border border-yellow-600/30 p-3 sm:p-4 rounded-xl flex flex-col items-center gap-2 hover:border-yellow-500/50 hover:bg-neutral-900 transition-all duration-300"
                >
                  <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                  <span className="font-bold text-xs sm:text-sm text-yellow-100 text-center">
                    Portfolio
                  </span>
                </Link>

                <Link
                  to="/notes"
                  className="bg-neutral-950 border border-yellow-600/30 p-3 sm:p-4 rounded-xl flex flex-col items-center gap-2 hover:border-yellow-500/50 hover:bg-neutral-900 transition-all duration-300"
                >
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                  <span className="font-bold text-xs sm:text-sm text-yellow-100 text-center">
                    Notas
                  </span>
                </Link>
              </div>

              {/* Last Trade */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-yellow-100 mb-4 flex items-center gap-2">
                  <TrendingUp
                    size={20}
                    className="text-yellow-400 sm:w-6 sm:h-6"
                  />
                  Última Operación Registrada
                </h3>
                <LastTrade />
              </div>
            </div>

            {/* Right/Sidebar Column */}
            <div className="xl:col-span-1 space-y-6">
              {/* Calculator */}
              <div className="bg-neutral-950 border border-yellow-600/30 shadow-xl shadow-yellow-500/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="bg-gradient-to-r from-yellow-600/10 to-yellow-500/5 p-4 border-b border-yellow-600/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <CalculatorIcon className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-yellow-100">
                        Calculadora de Lotaje
                      </h2>
                      <p className="text-xs text-neutral-400">
                        Calcula tu riesgo y posición
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex justify-center">
                  <div className="w-full max-w-sm">
                    <Calculator />
                  </div>
                </div>
              </div>

              {/* News */}
              <News />
            </div>
          </div>
        </main>
      </div>
    </SidebarInset>
  );
}
