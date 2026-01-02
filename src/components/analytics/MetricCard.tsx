
import { type LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  unit?: string;
  subtitle?: string;
}

const MetricCard = ({ title, value, icon: Icon, color = "text-blue-500", unit = "", subtitle }: MetricCardProps) => {
  return (
    <div className="bg-black border border-yellow-700 rounded-2xl p-5 flex flex-col justify-between shadow-lg hover:shadow-yellow-800/30 hover:border-yellow-800/50 transition-all duration-300 h-full">
      <div className="flex items-center justify-between text-neutral-400">
        <span className="text-sm font-medium">{title}</span>
        <Icon className="w-5 h-5" />
      </div>
      <div className="mt-4">
        <span className={`text-3xl font-bold ${color}`}>
          {value}
        </span>
        {unit && <span className="text-lg text-neutral-300 ml-1">{unit}</span>}
        {subtitle && (
          <div className="text-sm text-neutral-400 mt-1">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
