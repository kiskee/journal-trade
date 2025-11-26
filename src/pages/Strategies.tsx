import { BreadcrumbCf } from "@/components/Breadcrumb";
import { StrategiesList } from "@/components/StrategiesList";

import { SidebarInset } from "@/components/ui/sidebar";
import Loading from "@/components/utils/Loading";
import { useStrategies } from "@/hooks/useStrategies";
import { useEffect, useState } from "react";

export const Strategies = () => {

const { getStrategies, isLoading } = useStrategies();
  const [strategies, setStrategies] = useState([] as any);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const data: any = await getStrategies();
        setStrategies(data);
      } catch (error) {
        console.error("Error loading strategies:", error);
      }
    };

    fetchStrategies();
  }, []);

  if (isLoading) {
    return  <div className="flex items-center justify-center md:pl-72"> <Loading text="Cargando tus estrategias..."/> </div> ;
  }

  console.log("Estrategias cargadas:", strategies);
  return (
    <>
     <SidebarInset>
         <BreadcrumbCf firstPage="Estrategias" secondPage="Todas las Estrategias"/>
        <div className="bg-linear-to-r from-black via-yellow-900 to-black w-full h-full">
          <StrategiesList strategies={strategies?.results} />
        </div>
     </SidebarInset>
    </>
  );
}