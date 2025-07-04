import { Check } from "lucide-react";

interface VisualProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export default function StepsVisual({
  currentStep,
  totalSteps,
  stepTitles,
}: VisualProps) {
  return (
    <div className="mb-2 bg-black rounded-2xl p-4 border border-yellow-700">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-yellow-500">
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
            className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
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
              index + 1 <= currentStep ? "text-yellow-500" : "text-neutral-500"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                index + 1 < currentStep
                  ? "bg-yellow-500 text-black"
                  : index + 1 === currentStep
                  ? "bg-yellow-500 text-black"
                  : "bg-neutral-600 text-neutral-400"
              }`}
            >
              {index + 1 < currentStep ? <Check size={16} /> : index + 1}
            </div>
            <span className="text-xs text-center hidden sm:block max-w-20">
              {title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
