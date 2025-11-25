import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import ModuleService from "@/services/moduleService";
import Loading from "./utils/Loading";
import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function IntLayaout({ children }: LayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        await ModuleService.accounts.byUser();
        setIsLoading(false);
      } catch (error) {
        navigate("/create-account");
        setIsLoading(false);
      }
    };
    init();
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading text="Cargando" />
      ) : (
        <SidebarProvider>
          <AppSidebar />
          {children}
        </SidebarProvider>
      )}
    </>
  );
}
