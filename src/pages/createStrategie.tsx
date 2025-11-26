import { BreadcrumbCf } from "@/components/Breadcrumb";
import CreateStrategyForm from "@/components/strategies/CreateStrategyForm";
import { SidebarInset } from "@/components/ui/sidebar";
import { ChartCandlestick } from "lucide-react";

export const CreateStrategiePage = () => {
  return (
     <SidebarInset className="bg-black">
  <BreadcrumbCf firstPage="Estrategias" secondPage="Crear estrategia"/>
  <div className="flex items-center justify-center bg-black pt-16">
      <div className="bg-neutral-950 border border-yellow-600/30 p-6 rounded-2xl flex items-center gap-4 hover:border-yellow-500/50 backdrop-blur-sm transition-all duration-300">
        <ChartCandlestick className="w-10 h-10 text-yellow-400" />
        <div>
          <h2 className="font-bold text-xl text-yellow-100">
            Nueva Estrategia
          </h2>
          <CreateStrategyForm onlyForm={false} isFromPage={true}/>
        </div>
      </div>
    </div>
    </SidebarInset>
  );
};
