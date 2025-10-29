import { useEffect, useState, type ReactNode } from "react";
import Footer from "./Footer";
import Header from "./header/Header";
import { useNavigate } from "react-router-dom";
import ModuleService from "@/services/moduleService";
import Loading from "./utils/Loading";

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
        <div className="flex flex-col items-center bg-black min-h-screen w-screen">
          <Header />
          <div className="pt-16">{children}</div>
          <Footer />
        </div>
      )}
    </>
  );
}
