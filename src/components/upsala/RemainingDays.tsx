import { useEffect, useState } from "react";


interface CountdownComponentProps {
  startDate: string | Date;
}

const RemainingDays: React.FC<CountdownComponentProps> = ({ startDate }) => {
  const [daysPassed, setDaysPassed] = useState<number>(0);

  useEffect(() => {
    const calculateDaysPassed = (): void => {
      // Convertir la fecha de inicio a objeto Date
      const start = new Date(startDate);
      const today = new Date();
      
      // Validar que la fecha sea válida
      if (isNaN(start.getTime())) {
        console.error('Fecha inválida proporcionada');
        setDaysPassed(1);
        return;
      }
      
      // Normalizar las fechas para comparar solo días (sin horas)
      start.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      // Calcular la diferencia en milisegundos y convertir a días
      const diffTime: number = today.getTime() - start.getTime();
      const diffDays: number = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      // El día actual cuenta como día 1, por eso sumamos 1
      const currentDay: number = diffDays + 1;
      
      // Asegurar que esté dentro del rango de 1-30 días
      if (currentDay <= 0) {
        setDaysPassed(1); // Si es el mismo día, es día 1
      } else if (currentDay > 30) {
        setDaysPassed(30); // Máximo 30 días
      } else {
        setDaysPassed(currentDay);
      }
    };

    calculateDaysPassed();
    
    // Actualizar cada día a medianoche
    const interval: NodeJS.Timeout = setInterval(calculateDaysPassed, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-800 rounded-full text-white font-bold text-2xl shadow-lg">
      {daysPassed}
    </div>
  );
};



export default RemainingDays