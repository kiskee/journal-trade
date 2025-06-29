import { Flame, Zap, Radio, ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface NewsItem {
  Outcome: string;
  Quality: string;
  Currency: string;
  Forecast: number;
  Previous: number;
  Actual: number;
  Date: string;
  Strength: string;
  Name: string;
}

interface NewsCardProps {
  item: NewsItem;
}

const getImpactDetails = (strength: string) => {
  switch (strength) {
    case 'Strong Data':
      return { 
        icon: <Flame className="w-5 h-5" />, 
        label: 'Alto Impacto', 
        color: 'border-red-500',
        textColor: 'text-red-500'
      };
    case 'Weak Data':
      return { 
        icon: <Zap className="w-5 h-5" />, 
        label: 'Impacto Medio', 
        color: 'border-amber-500',
        textColor: 'text-amber-500'
      };
    default:
      return { 
        icon: <Radio className="w-5 h-5" />, 
        label: 'Bajo Impacto', 
        color: 'border-green-500',
        textColor: 'text-green-500'
      };
  }
};

const getCurrencyFlag = (currency: string): string => {
  const flags: Record<string, string> = {
    USD: "🇺🇸", GBP: "🇬🇧", EUR: "🇪🇺", JPY: "🇯🇵", CAD: "🇨🇦", AUD: "🇦🇺", NZD: "🇳🇿", CHF: "🇨🇭",
  };
  return flags[currency] || "🌍";
};

const getActualVsForecast = (actual?: number, forecast?: number) => {
    if (actual === null || forecast === null || actual === undefined || forecast === undefined) {
        return { icon: <Minus size={16} className="text-neutral-500" />, color: 'text-neutral-500' };
    }
    if (actual > forecast) {
        return { icon: <ArrowUp size={16} className="text-green-400" />, color: 'text-green-400' };
    }
    if (actual < forecast) {
        return { icon: <ArrowDown size={16} className="text-red-400" />, color: 'text-red-400' };
    }
    return { icon: <Minus size={16} className="text-neutral-400" />, color: 'text-neutral-400' };
};


const NewsCard = ({ item }: NewsCardProps) => {
  const impact = getImpactDetails(item.Strength);
  const comparison = getActualVsForecast(item.Actual, item.Forecast);
  
  const newsTime = new Date(
    new Date(item.Date.replace(/\./g, "-").replace(" ", "T")).getTime() - 8 * 60 * 60 * 1000
  ).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Bogota",
  });

  return (
    <div className={`bg-neutral-800/50 border-l-4 ${impact.color} border-y border-r border-neutral-700 rounded-lg p-4 flex gap-4 items-start transition-all duration-300 hover:bg-neutral-800`}>
      <div className="font-bold text-lg text-center w-16 flex-shrink-0">
        <p className="text-white">{newsTime.split(' ')[0]}</p>
        <p className="text-xs text-neutral-400">{newsTime.split(' ')[1]}</p>
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
                <span className="text-xl">{getCurrencyFlag(item.Currency)}</span>
                <span className="font-semibold text-white">{item.Currency}</span>
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${impact.textColor} bg-neutral-900/50`}>
                {impact.icon}
                <span>{impact.label}</span>
            </div>
        </div>

        <h3 className="text-base text-neutral-200 mb-4">{item.Name}</h3>

        <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-neutral-900/70 p-2 rounded-md">
                <p className="text-xs text-neutral-400">Actual</p>
                <div className="flex items-center justify-center gap-1">
                    {comparison.icon}
                    <p className={`text-sm font-bold ${comparison.color}`}>{item.Actual ?? 'N/A'}</p>
                </div>
            </div>
            <div className="bg-neutral-900/70 p-2 rounded-md">
                <p className="text-xs text-neutral-400">Previsión</p>
                <p className="text-sm font-bold text-white">{item.Forecast ?? 'N/A'}</p>
            </div>
            <div className="bg-neutral-900/70 p-2 rounded-md">
                <p className="text-xs text-neutral-400">Anterior</p>
                <p className="text-sm font-bold text-white">{item.Previous ?? 'N/A'}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;