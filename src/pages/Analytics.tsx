import { UserDetailContext } from "@/context/UserDetailContext";
import { useContext, useEffect, useState } from "react";
import ModuleService from "@/services/moduleService";

import { dataAnalisis, type TradingMetrics } from "@/services/dataAnalisis";
import MetricCard from "@/components/analytics/MetricCard";
import {
  BarChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Scale,
  Percent,
  Hash,
  Heart,
  Brain,
  CheckCircle,
  Award,
  Shield,
  Clock,
  Zap,
  PlusCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarInset } from "@/components/ui/sidebar";
import { BreadcrumbCf } from "@/components/Breadcrumb";
import Loading from "@/components/utils/Loading";

const Analytics = () => {
  const [data, setData] = useState<TradingMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const context = useContext(UserDetailContext);

  if (!context) {
    throw new Error(
      "UserDetailContext debe usarse dentro de un UserDetailProvider"
    );
  }
  const { userDetail } = context;

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const response = await ModuleService.trades.byUser(
          "user",
          userDetail?.id
        );
        if (response.results && response.results.length > 0) {
          const result = dataAnalisis(response);
          setData(result);
        } else {
          setData(null); // No hay trades
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [userDetail?.id]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-neutral-900">
        <Loading text="Analizando tus métricas..." />
      </div>
    );
  }

  if (!data) {
    return (
      <SidebarInset className="text-yellow-500">
        <BreadcrumbCf firstPage="Trades" secondPage="Analiticas" />
      <div className="w-screen h-screen flex flex-col items-center justify-center text-center text-white bg-neutral-900 p-8">
        <Target size={64} className="text-yellow-600 mb-4" />
        <h2 className="text-3xl font-bold mb-2">Aún no hay datos que analizar</h2>
        <p className="text-neutral-400 mb-6 max-w-md">
          Parece que no has registrado ninguna operación. ¡Empieza ahora para ver
          tus estadísticas y mejorar tu rendimiento!
        </p>
        <Link
          to="/trade"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2"
        >
          <PlusCircle size={20} />
          Registrar mi primer Trade
        </Link>
      </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset className="text-yellow-500">
       <BreadcrumbCf firstPage="Trades" secondPage="Analiticas" />
    <div className="min-h-screen w-full bg-black text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 text-yellow-500">
          <BarChart className="w-10 h-10 text-yellow-500" />
          Dashboard de Analíticas
        </h1>
        <p className="text-neutral-400 mb-8">
          Tu rendimiento de un vistazo. Usa estos datos para encontrar tus puntos fuertes y débiles.
        </p>

        {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="PnL Neto"
            value={`$${data.netPnL}`}
            icon={DollarSign}
            color={data.netPnL >= 0 ? "text-green-400" : "text-red-400"}
          />
          <MetricCard
            title="Tasa de Acierto (Win Rate)"
            value={data.winRate}
            unit="%"
            icon={Target}
            color="text-cyan-400"
          />
          <MetricCard
            title="Total de Operaciones"
            value={data.totalTrades}
            icon={Hash}
            color="text-indigo-400"
          />
        </div>

        {/* Secciones de Métricas */}
        <div className="space-y-8">
          {/* Rentabilidad */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-l-4 border-yellow-500 pl-3 text-yellow-500">Rentabilidad</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <MetricCard title="Ganancia Bruta" value={`$${data.totalPnL}`} icon={TrendingUp} color="text-green-500" />
              <MetricCard title="Comisiones Pagadas" value={`$${data.totalFees}`} icon={Scale} color="text-amber-500" />
              <MetricCard title="Ganancia Promedio" value={`$${data.averageWin}`} icon={Award} color="text-green-500" />
              <MetricCard title="Pérdida Promedio" value={`$${data.averageLoss}`} icon={Shield} color="text-red-500" />
              <MetricCard title="Mayor Ganancia" value={`$${data.largestWin}`} icon={Zap} color="text-green-500" />
              <MetricCard title="Mayor Pérdida" value={`$${data.largestLoss}`} icon={TrendingDown} color="text-red-500" />
              <MetricCard title="Factor de Beneficio" value={data.profitFactor} icon={Percent} />
            </div>
          </div>

          {/* Psicología y Disciplina */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-l-4 border-yellow-500 pl-3 text-yellow-500">Psicología y Disciplina</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <MetricCard title="Confianza Promedio" value={`${data.averageConfidenceBefore}/10`} icon={Heart} />
              <MetricCard title="Disciplina Promedio" value={`${data.averageDiscipline}/10`} icon={Brain} />
              <MetricCard title="Plan Seguido" value={`${data.planFollowRate}%`} icon={CheckCircle} color={data.planFollowRate > 75 ? "text-green-400" : "text-amber-400"} />
              <MetricCard title="Duración Promedio" value={`${data.averageDuration} min`} icon={Clock} />
            </div>
          </div>
        </div>
      </div>
    </div>
    </SidebarInset>
  );
};

export default Analytics;