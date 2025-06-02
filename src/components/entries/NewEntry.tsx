import { useState } from "react";
import BasicData from "./BasicData";
import {  Check } from 'lucide-react';

// Tipos para los props que recibirá cada componente de formulario
interface FormStepProps {
  onNext: (data: any) => void;
  onPrev: () => void;
  initialData?: any;
  isFirst: boolean;
  isLast: boolean;
}

// Tipo para almacenar todos los datos del formulario
interface CompleteFormData {
  step1?: any;
  step2?: any;
  step3?: any;
  step4?: any;
  step5?: any;
}

// Props del wrapper principal
// interface MultiStepWrapperProps {
//   // Tus componentes de formulario
//   Step1Component: React.ComponentType<FormStepProps>;
//   Step2Component: React.ComponentType<FormStepProps>;
//   Step3Component: React.ComponentType<FormStepProps>;
//   Step4Component: React.ComponentType<FormStepProps>;
//   Step5Component: React.ComponentType<FormStepProps>;

//   // Configuración opcional
//   stepTitles?: string[];
//   onComplete?: (data: CompleteFormData) => void;
//   className?: string;
// }

const NewEntry = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CompleteFormData>({});
  const totalSteps = 5;
  const className = ""
  const stepTitles=[
        'Datos Básicos',
        'Gestión Riesgo',
        'Ejecución',
        'Análisis',
        'Resultados'
      ]

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

      console.log("Datos completos:", finalData);
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
    };

    switch (currentStep) {
      case 1:
        return <BasicData {...commonProps} />;
      case 2:
        return <BasicData {...commonProps} />;
      case 3:
        return <BasicData {...commonProps} />;
      case 4:
        return <BasicData {...commonProps} />;
      case 5:
        return <BasicData {...commonProps} />;
      default:
        return <div>Paso no encontrado</div>;
    }
  };

  return (
    <div className=" bg-neutral-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900"></div> */}
      <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
        <div className={`min-h-screen bg-neutral-900 py-8 ${className}`}>
          <div className="max-w-4xl mx-auto px-4">
            {/* Indicador de Progreso */}
            <div className="mb-8 bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-blue-400">
                  Formulario Multi-paso
                </h1>
                <span className="text-sm text-neutral-400">
                  Paso {currentStep} de {totalSteps}
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="mb-4">
                <div className="w-full bg-neutral-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              {/* Indicadores de pasos */}
              <div className="flex justify-between">
                {stepTitles.map((title, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center ${
                      index + 1 <= currentStep
                        ? "text-blue-400"
                        : "text-neutral-500"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                        index + 1 < currentStep
                          ? "bg-blue-600 text-white"
                          : index + 1 === currentStep
                          ? "bg-blue-500 text-white"
                          : "bg-neutral-600 text-neutral-400"
                      }`}
                    >
                      {index + 1 < currentStep ? (
                        <Check size={16} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className="text-xs text-center hidden sm:block max-w-20">
                      {title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Renderizar el paso actual */}
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewEntry;
