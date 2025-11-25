import { SidebarInset } from "@/components/ui/sidebar";
import NewEntry from "../components/entries/NewEntry";
import { BreadcrumbCf } from "@/components/Breadcrumb";

export default function CreateTrade() {
  return (
    <>
     <SidebarInset className="text-yellow-500">
      <BreadcrumbCf firstPage="Trades" secondPage="Registrar Trade" />
      <NewEntry />
      </SidebarInset>
    </>
  );
}
