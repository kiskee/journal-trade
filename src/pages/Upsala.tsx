import Loading from "@/components/Loading";
import RemainingDays from "@/components/upsala/RemainingDays";
import PDFSignatureComponent from "@/components/upsala/Signature";
import { UserDetailContext } from "@/context/UserDetailContext";
import ModuleService from "@/services/moduleService";
import { useContext, useEffect, useState } from "react";

interface RegistryResponse {
  data: DataRegistry[];
  error: boolean;
  message: string;
}

interface DataRegistry {
  date: string;
  user: string;
}

export default function Upsala() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const context = useContext(UserDetailContext);
  const [registry, setRegistry] = useState<DataRegistry>();

  if (!context) {
    throw new Error(
      "UserDetailContext debe usarse dentro de un UserDetailProvider"
    );
  }
  const { userDetail } = context;

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const response: RegistryResponse = await ModuleService.upsala.byUser(
          userDetail?.id
        );
        if (!response.error) {
          setRegistry(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [refreshTrigger, userDetail?.id]);

  const handlePDFGenerated = async () => {
    //pdfData: Blob
    try {
      setIsLoading(true);
      const registerData = {
        user: userDetail?.id,
        date: new Date().toISOString(),
      };
      await ModuleService.upsala.create(registerData);

      // Reinvocar el useEffect
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-neutral-900">
        <Loading text="Cargando Upsala..." />
      </div>
    );
  }

  return (
    <>
      {registry ? (
        <>
          {" "}
          <h1 className="text-4xl text-yellow-500 font-bold text-center pt-4 pb-6">
            Upsala
          </h1>
          <div className="flex flex-row items-center gap-4">
            <h1 className="text-2xl text-yellow-500">Dia: </h1>
            <RemainingDays startDate={registry.date} />
          </div>
        </>
      ) : (
        <>
          <PDFSignatureComponent
            onPDFGenerated={handlePDFGenerated}
            //initialData={initialData}
            className="my-custom-class"
          />
        </>
      )}
    </>
  );
}
