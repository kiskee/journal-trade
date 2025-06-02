import { useEffect, useState, type ReactElement } from "react";
import BasicData from "./BasicData";
import StepsVisual from "./StepsVisual";
import ResultsData from "./ResultsData";
import EmotionsData from "./EmotionsData";
import MediaTagsData from "./MediaTagsData";

// Tipos para los props que recibirá cada componente de formulario
interface FormStepProps {
  onNext: (data: any) => void;
  onPrev: () => void;
  initialData?: any;
  isFirst: boolean;
  isLast: boolean;
  header: ReactElement<any, any>;
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
  const [formData, setFormData] = useState<CompleteFormData>({});
  const totalSteps = 4;
  const stepTitles = [
    "Datos Básicos",
    "Resultados",
    "Emociones",
    "Media&tags",
  ];
useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);


  const handleFormComplete = (data: CompleteFormData) => {
    console.log("Formulario completado:", data);
    // Aquí puedes enviar los datos a tu API
    // api.saveTradeData(data);
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
        <div className="max-w-4xl mx-auto px-4">{renderCurrentStep()}</div>
      </div>
    </div>
  );
};

export default NewEntry;
