import { useContext, useEffect, useState, type ReactElement } from "react";
import BasicData from "./BasicData";
import StepsVisual from "./StepsVisual";
import ResultsData from "./ResultsData";
import EmotionsData from "./EmotionsData";
import MediaTagsData from "./MediaTagsData";
import { UserDetailContext } from "@/context/UserDetailContext";
import ModuleService from "@/services/moduleService";
import { Card } from "../ui/card";
import { useNavigate } from "react-router-dom";

// Tipos para los props que recibirá cada componente de formulario
interface FormStepProps {
  onNext: (data: any) => void;
  onPrev: () => void;
  initialData?: any;
  isFirst: boolean;
  isLast: boolean;
  header: ReactElement<any, any>;
  userId: string
}

// Tipo para almacenar todos los datos del formulario
interface CompleteFormData {
  basic?: any;
  results?: any;
  emotions?: any;
  media?: any;
}

const NewEntry = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CompleteFormData>({});
  const totalSteps = 4;
  const stepTitles = ["Datos Básicos", "Resultados", "Emociones", "Media&tags"];
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const context = useContext(UserDetailContext);
  if (!context) {
    throw new Error(
      "UserDetailContext debe usarse dentro de un UserDetailProvider"
    );
  }
  const { userDetail } = context;

  const handleFormComplete = async (data: CompleteFormData) => {
    try {
      setIsLoading(true);
      const newData: any = { ...data };
      newData.user = userDetail?.id;
      newData.date = new Date().toISOString();
      //if (!newData.step4.mediaFile) delete newData.step4.mediaFile
      delete newData.step4.mediaFile;
      console.log(newData)
      await ModuleService.trades.create(newData);

      setIsLoading(false);
      navigate("/inicio", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  // Función para avanzar al siguiente paso
  const handleNext = (stepData: any) => {
    // Guardar datos del paso actual
    setFormData((prev) => ({
      ...prev,
      [`step${currentStep}`]: stepData,
    }));

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Es el último paso, ejecutar onComplete
      const finalData = {
        ...formData,
        [`step${currentStep}`]: stepData,
      };

      // console.log("Datos completos:", finalData);
      handleFormComplete?.(finalData);
    }
  };

  // Función para retroceder
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Obtener datos del paso actual
  const getCurrentStepData = () => {
    return formData[`step${currentStep}` as keyof CompleteFormData];
  };

  // Renderizar el componente del paso actual
  const renderCurrentStep = () => {
    const commonProps: FormStepProps = {
      onNext: handleNext,
      onPrev: handlePrev,
      initialData: getCurrentStepData(),
      isFirst: currentStep === 1,
      isLast: currentStep === totalSteps,
      header: StepsVisual({
        currentStep,
        totalSteps,
        stepTitles,
      }),
      userId: userDetail?.id,
    };

    switch (currentStep) {
      case 1:
        return <BasicData {...commonProps} />;
      case 2:
        return <ResultsData {...commonProps} />;
      case 3:
        return <EmotionsData {...commonProps} />;
      case 4:
        return <MediaTagsData {...commonProps} />;
      default:
        return <div>Paso no encontrado</div>;
    }
  };

  return (
    <div className=" bg-neutral-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
        {isLoading ? (
          <Card className="p-6 bg-neutral-800 rounded-2xl shadow-lg border-blue-600 shadow-blue-700 w-full max-w-full">
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold text-blue-500 mb-4 animate-pulse">
                Guardando tu trade, gracias por tu paciencia...
              </h1>
              <div className="flex justify-center">
                {/* Spinner animado con Tailwind */}
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </Card>
        ) : (
          <div className=" ">{renderCurrentStep()}</div>
        )}
      </div>
    </div>
  );
};

export default NewEntry;
