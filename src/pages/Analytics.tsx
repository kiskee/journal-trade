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
  Percent,
  Hash,
  Heart,
  Brain,
  CheckCircle,
  Award,
  Shield,
  Zap,
  PlusCircle,
  Activity,
  Flame,
  X,
  Star,
  Calculator,
  AlertTriangle,
  Calendar,
  Tag,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarInset } from "@/components/ui/sidebar";
import { BreadcrumbCf } from "@/components/Breadcrumb";
import Loading from "@/components/utils/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Account {
  id: string;
  name: string;
  currency: string;
  currentBalance: number;
}

const Analytics = () => {
  const [data, setData] = useState<TradingMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const context = useContext(UserDetailContext);

  if (!context) {
    throw new Error(
      "UserDetailContext debe usarse dentro de un UserDetailProvider"
    );
  }
  const { userDetail } = context;

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accountResponse: any = await ModuleService.accounts.byUser();
        if (accountResponse.data) {
          setAccounts(accountResponse.data);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const response = await ModuleService.trades.byUser(
          "user",
          userDetail?.id
        );
        if (response.results && response.results.length > 0) {
          // Filtrar trades por cuenta si se seleccionó una específica
          let filteredTrades = response.results;
          if (selectedAccount !== "all") {
            filteredTrades = response.results.filter(
              (trade: any) => trade.step1?.accountId === selectedAccount
            );
          }
          
          if (filteredTrades.length > 0) {
            const result = dataAnalisis({ ...response, results: filteredTrades });
            setData(result);
          } else {
            setData(null);
          }
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [userDetail?.id, selectedAccount]);

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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 text-yellow-500">
              <BarChart className="w-10 h-10 text-yellow-500" />
              Dashboard de Analíticas
            </h1>
            <p className="text-neutral-400">
              Tu rendimiento de un vistazo. Usa estos datos para encontrar tus puntos fuertes y débiles.
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0">
            <label className="block text-sm text-neutral-300 mb-2">
              Filtrar por cuenta:
            </label>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger className="w-64 bg-neutral-800 border-neutral-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                <SelectItem value="all" className="text-white hover:bg-neutral-700">
                  Todas las cuentas
                </SelectItem>
                {accounts.map((account) => (
                  <SelectItem 
                    key={account.id} 
                    value={account.id}
                    className="text-white hover:bg-neutral-700"
                  >
                    {account.name} ({account.currency})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div className="space-y-8 mt-8">
          {/* Rentabilidad */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-l-4 border-yellow-500 pl-3 text-yellow-500">Rentabilidad</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <MetricCard title="Ganancia Bruta" value={`$${data.totalPnL}`} icon={TrendingUp} color="text-green-500" />
              <MetricCard title="Ganancia Promedio" value={`$${data.averageWin}`} icon={Award} color="text-green-500" />
              <MetricCard title="Pérdida Promedio" value={`$${data.averageLoss}`} icon={Shield} color="text-red-500" />
              <MetricCard title="Mayor Ganancia" value={`$${data.largestWin}`} icon={Zap} color="text-green-500" />
              <MetricCard title="Mayor Pérdida" value={`$${data.largestLoss}`} icon={TrendingDown} color="text-red-500" />
              <MetricCard title="Factor de Beneficio" value={data.profitFactor} icon={Percent} />
              <MetricCard title="Expectativa" value={`$${data.expectancy}`} icon={Calculator} color={data.expectancy > 0 ? "text-green-400" : "text-red-400"} />
              <MetricCard title="Sharpe Ratio" value={data.sharpeRatio} icon={Activity} color={data.sharpeRatio > 1 ? "text-green-400" : "text-amber-400"} />
              <MetricCard title="Sortino Ratio" value={data.sortinoRatio} icon={TrendingUp} color={data.sortinoRatio > 1 ? "text-green-400" : "text-amber-400"} />
              <MetricCard title="Recovery Factor" value={data.recoveryFactor} icon={Shield} color={data.recoveryFactor > 2 ? "text-green-400" : "text-amber-400"} />
            </div>
          </div>

          {/* Consistencia */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-l-4 border-yellow-500 pl-3 text-yellow-500">Consistencia</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <MetricCard title="Racha Ganadora Más Larga" value={data.longestWinStreak} icon={Flame} color="text-green-400" />
              <MetricCard title="Racha Perdedora Más Larga" value={data.longestLossStreak} icon={X} color="text-red-400" />
              <MetricCard 
                title="Racha Actual" 
                value={`${data.currentStreak.count} ${data.currentStreak.type === 'win' ? 'G' : data.currentStreak.type === 'loss' ? 'P' : '-'}`} 
                icon={Target} 
                color={data.currentStreak.type === 'win' ? "text-green-400" : data.currentStreak.type === 'loss' ? "text-red-400" : "text-neutral-400"} 
              />
              <MetricCard title="Drawdown Máximo" value={`$${data.maxDrawdown}`} icon={TrendingDown} color="text-red-400" />
              <MetricCard title="Volatilidad" value={`$${data.volatility}`} icon={Activity} color="text-blue-400" />
            </div>
          </div>

          {/* Mejores Rendimientos */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-l-4 border-yellow-500 pl-3 text-yellow-500">Mejores Rendimientos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <MetricCard title="Mejor Activo" value={data.bestAsset.name} subtitle={`$${data.bestAsset.pnl} (${data.bestAsset.winRate}%)`} icon={Star} color="text-yellow-400" />
              <MetricCard title="Mejor Setup" value={data.bestSetup.name} subtitle={`$${data.bestSetup.pnl} (${data.bestSetup.winRate}%)`} icon={Award} color="text-yellow-400" />
              <MetricCard title="Peor Activo" value={data.worstAsset.name} subtitle={`$${data.worstAsset.pnl} (${data.worstAsset.winRate}%)`} icon={AlertTriangle} color="text-red-400" />
              <MetricCard title="Peor Setup" value={data.worstSetup.name} subtitle={`$${data.worstSetup.pnl} (${data.worstSetup.winRate}%)`} icon={X} color="text-red-400" />
            </div>
          </div>

          {/* Psicología y Disciplina */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-l-4 border-yellow-500 pl-3 text-yellow-500">Psicología y Disciplina</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <MetricCard title="Confianza Promedio" value={`${data.averageConfidenceBefore}/10`} icon={Heart} />
              <MetricCard title="Disciplina Promedio" value={`${data.averageDiscipline}/10`} icon={Brain} />
              <MetricCard title="Plan Seguido" value={`${data.planFollowRate}%`} icon={CheckCircle} color={data.planFollowRate > 75 ? "text-green-400" : "text-amber-400"} />
              <MetricCard title="Correlación Confianza" value={data.confidenceCorrelation} icon={Activity} color={data.confidenceCorrelation > 0.3 ? "text-green-400" : "text-amber-400"} />
              <MetricCard title="Correlación Disciplina" value={data.disciplineCorrelation} icon={Brain} color={data.disciplineCorrelation > 0.3 ? "text-green-400" : "text-amber-400"} />
            </div>
          </div>

          {/* Gestión de Riesgo */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-l-4 border-yellow-500 pl-3 text-yellow-500">Gestión de Riesgo</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <MetricCard title="Riesgo Promedio" value={`$${data.averageRiskPerTrade}`} icon={AlertTriangle} color="text-orange-400" />
              <MetricCard title="Recompensa Promedio" value={`$${data.averageRewardPerTrade}`} icon={Target} color="text-green-400" />
              <MetricCard title="Risk/Reward Promedio" value={`1:${data.averageRiskReward}`} icon={Calculator} color="text-blue-400" />
            </div>
          </div>

          {/* Análisis Temporal */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-l-4 border-yellow-500 pl-3 text-yellow-500">Análisis Temporal</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {Object.entries(data.performanceByDayOfWeek).slice(0, 4).map(([day, perf]) => (
                <MetricCard 
                  key={day}
                  title={day}
                  value={`${perf.trades} trades`}
                  subtitle={`$${Math.round(perf.pnl * 100) / 100} (${Math.round(perf.winRate)}%)`}
                  icon={Calendar}
                  color={perf.pnl > 0 ? "text-green-400" : "text-red-400"}
                />
              ))}
            </div>
          </div>

          {/* Tags Más Rentables */}
          {data.mostProfitableTags.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 border-l-4 border-yellow-500 pl-3 text-yellow-500">Tags Más Rentables</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {data.mostProfitableTags.slice(0, 4).map((tag, index) => (
                  <MetricCard 
                    key={tag.tag}
                    title={`#${tag.tag}`}
                    value={`$${Math.round(tag.pnl * 100) / 100}`}
                    subtitle={`${Math.round(tag.winRate)}% win rate`}
                    icon={Tag}
                    color={index === 0 ? "text-yellow-400" : "text-green-400"}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </SidebarInset>
  );
};

export default Analytics;