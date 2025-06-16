export const tradingPairs = [
  { value: "XAU/USD", label: "XAU/USD (Oro)" },
  { value: "EUR/USD", label: "EUR/USD" },
  { value: "USD/JPY", label: "USD/JPY" },
  { value: "GBP/USD", label: "GBP/USD" },
  { value: "USD/CHF", label: "USD/CHF" },
  { value: "AUD/USD", label: "AUD/USD" },
  { value: "NZD/USD", label: "NZD/USD" },
  { value: "USD/CAD", label: "USD/CAD" },

  // Pares menores
  { value: "EUR/GBP", label: "EUR/GBP" },
  { value: "EUR/JPY", label: "EUR/JPY" },
  { value: "EUR/AUD", label: "EUR/AUD" },
  { value: "GBP/JPY", label: "GBP/JPY" },
  { value: "GBP/AUD", label: "GBP/AUD" },
  { value: "CHF/JPY", label: "CHF/JPY" },
  { value: "AUD/JPY", label: "AUD/JPY" },
  { value: "NZD/JPY", label: "NZD/JPY" },
  { value: "CAD/JPY", label: "CAD/JPY" },

  // Exóticos
  { value: "USD/MXN", label: "USD/MXN" },
  { value: "USD/TRY", label: "USD/TRY" },
  { value: "USD/ZAR", label: "USD/ZAR" },
  { value: "USD/SEK", label: "USD/SEK" },
  { value: "USD/NOK", label: "USD/NOK" },
  { value: "USD/SGD", label: "USD/SGD" },
  { value: "EUR/TRY", label: "EUR/TRY" },
  { value: "EUR/MXN", label: "EUR/MXN" },
  { value: "EUR/ZAR", label: "EUR/ZAR" },

  // Metales
  
  { value: "XAG/USD", label: "XAG/USD (Plata)" },

  // Criptomonedas
  { value: "BTC/USD", label: "BTC/USD (Bitcoin)" },
  { value: "ETH/USD", label: "ETH/USD (Ethereum)" },
];

export const pipValuePerLot: Record<string, number> = {
  // Majors y Minors típicos
  "EUR/USD": 10,
  "USD/JPY": 9.1,
  "GBP/USD": 10,
  "USD/CHF": 10,
  "AUD/USD": 10,
  "NZD/USD": 10,
  "USD/CAD": 10,
  "EUR/GBP": 10,
  "EUR/JPY": 9.1,
  "EUR/AUD": 10,
  "GBP/JPY": 9.1,
  "GBP/AUD": 10,
  "CHF/JPY": 9.1,
  "AUD/JPY": 9.1,
  "NZD/JPY": 9.1,
  "CAD/JPY": 9.1,

  // Exóticos
  "USD/MXN": 10,
  "USD/TRY": 10,
  "USD/ZAR": 10,
  "USD/SEK": 10,
  "USD/NOK": 10,
  "USD/SGD": 10,
  "EUR/TRY": 10,
  "EUR/MXN": 10,
  "EUR/ZAR": 10,

  // Metales
  "XAU/USD": 1,    // Oro: 1 pip = 0.01 → $1 por lote estándar
  "XAG/USD": 0.5,  // Plata

  // Criptomonedas
  "BTC/USD": 1,
  "ETH/USD": 1,
};

// Tipos para mejor type safety
export interface CalculoLotajeResult {
  lotaje: number;
  par: string;
  stopLossPips: number;
  riesgoUSD: number;
  pipValue: number;
  detalles: {
    riesgoPorPip: number;
    riesgoTotal: number;
    lotajeRedondeado: number;
  };
}

export interface CalculoLotajeError {
  tipo: 'PAR_NO_SOPORTADO' | 'PARAMETROS_INVALIDOS' | 'CALCULO_ERROR';
  mensaje: string;
  par?: string;
}

export function calcularLotaje(
  par: string, 
  stopLossPips: number, 
  riesgoUSD: number
): CalculoLotajeResult {
  
  // Validaciones de entrada
  if (!par || typeof par !== 'string') {
    throw new Error('El par de divisas es requerido y debe ser una cadena válida');
  }
  
  if (!stopLossPips || stopLossPips <= 0) {
    throw new Error('El stop loss debe ser mayor a 0 pips');
  }
  
  if (!riesgoUSD || riesgoUSD <= 0) {
    throw new Error('El riesgo debe ser mayor a $0 USD');
  }

  // Normalizar el par (remover espacios y convertir a mayúsculas)
  const parNormalizado = par.trim().toUpperCase();
  
  // Verificar si el par está soportado
  const pipValue = pipValuePerLot[parNormalizado];
  
  if (!pipValue) {
    const paresDisponibles = Object.keys(pipValuePerLot).join(', ');
    throw new Error(
      `El par "${par}" no está soportado. Pares disponibles: ${paresDisponibles}`
    );
  }

  // Cálculo del lotaje
  const riesgoPorPip = stopLossPips * pipValue;
  const lotaje = riesgoUSD / riesgoPorPip;
  
  // Redondear a 2 decimales (micro lotes)
  const lotajeRedondeado = Math.round(lotaje * 100) / 100;
  
  // Verificar que el resultado sea válido
  if (!isFinite(lotajeRedondeado) || lotajeRedondeado <= 0) {
    throw new Error('Error en el cálculo: resultado inválido');
  }

  return {
    lotaje: lotajeRedondeado,
    par: parNormalizado,
    stopLossPips,
    riesgoUSD,
    pipValue,
    detalles: {
      riesgoPorPip,
      riesgoTotal: lotajeRedondeado * riesgoPorPip,
      lotajeRedondeado,
    }
  };
}

// Función auxiliar para obtener todos los pares disponibles
export function obtenerParesDisponibles(): Array<{ value: string; label: string }> {
  return Object.keys(pipValuePerLot).map(par => ({
    value: par,
    label: par
  })).sort();
}

// Función auxiliar para validar si un par está soportado
export function esParSoportado(par: string): boolean {
  return pipValuePerLot.hasOwnProperty(par.trim().toUpperCase());
}

// Función para calcular el riesgo máximo recomendado (2% del capital)
export function calcularRiesgoRecomendado(capital: number, porcentaje: number = 2): number {
  if (capital <= 0) {
    throw new Error('El capital debe ser mayor a 0');
  }
  
  if (porcentaje <= 0 || porcentaje > 100) {
    throw new Error('El porcentaje debe estar entre 0 y 100');
  }
  
  return (capital * porcentaje) / 100;
}