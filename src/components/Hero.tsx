import React, { useState } from 'react';

// Definimos la interfaz para los datos del formulario de trade
interface TradeEntryForm {
  symbol: string;
  tradeDate: string;
  tradeTime: string;
  direction: 'LONG' | 'SHORT';
  entryPrice: string; // Usamos string para el input y luego parseamos a number
  quantity: string;   // Usamos string para el input y luego parseamos a number
  notes: string;
}

// Props que el componente UserDashboardHero aceptará
interface UserDashboardHeroProps {
  userName?: string; // Nombre del usuario, opcional. Si no se pasa, usará "Trader".
  onTradeSubmit: (tradeData: TradeEntryForm) => void; // Función para manejar el envío del trade
}

const UserDashboardHero: React.FC<UserDashboardHeroProps> = ({ userName = "Trader", onTradeSubmit }) => {
  // Estado del formulario para capturar los datos de la primera entrada
  const [formData, setFormData] = useState<TradeEntryForm>({
    symbol: '',
    tradeDate: new Date().toISOString().slice(0, 10), // Fecha actual por defecto (YYYY-MM-DD)
    tradeTime: new Date().toTimeString().slice(0, 5),  // Hora actual por defecto (HH:MM)
    direction: 'LONG', // Por defecto a "LONG" (compra)
    entryPrice: '',
    quantity: '',
    notes: '',
  });

  // Manejador genérico para los cambios en los inputs del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejador para el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica en el cliente
    if (!formData.symbol || !formData.entryPrice || !formData.quantity || !formData.tradeDate || !formData.tradeTime) {
      alert('Por favor, completa todos los campos obligatorios: Símbolo, Fecha, Hora, Precio de Entrada y Cantidad.');
      return;
    }

    // Convertir precios/cantidades a números antes de enviar
    const parsedData = {
      ...formData,
      entryPrice: parseFloat(formData.entryPrice),
      quantity: parseFloat(formData.quantity),
    };
    
    // Llamamos a la función `onTradeSubmit` pasada por las props
    // Aquí es donde el componente padre enviaría esto a tu backend (Lambda)
    onTradeSubmit(parsedData); 

    // Opcional: Reiniciar el formulario después de un envío exitoso
    setFormData({
      symbol: '',
      tradeDate: new Date().toISOString().slice(0, 10),
      tradeTime: new Date().toTimeString().slice(0, 5),
      direction: 'LONG',
      entryPrice: '',
      quantity: '',
      notes: '',
    });
  };

  return (
    <section className="relative overflow-hidden bg-neutral-900 py-16 text-white md:py-24 lg:py-32">
      {/* Fondo sutil degradado para añadir profundidad */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900"></div>

      {/* Contenedor principal del contenido, diseñado para dos columnas en pantallas grandes */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start justify-between gap-12 px-4 sm:px-6 lg:px-8 lg:flex-row">

        {/* Sección Izquierda: Mensaje de Bienvenida y Funcionalidades */}
        <div className="text-center lg:w-1/2 lg:text-left">
          <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            ¡Bienvenido de nuevo, <span className="text-blue-500">{userName}</span>!
          </h1>
          <p className="mb-8 mx-auto max-w-lg text-lg text-gray-300 lg:mx-0">
            Tu centro de control para el trading inteligente. Aquí puedes:
          </p>
          <ul className="mb-10 mx-auto max-w-md space-y-3 text-left text-lg text-gray-200 lg:mx-0">
            <li className="flex items-center">
              <svg className="mr-3 h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <strong className="text-blue-300">Registrar</strong> tus operaciones al detalle.
            </li>
            <li className="flex items-center">
              <svg className="mr-3 h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V4m0 8v4m-4 0h8m-4 0h8m-4-8h8m-4 0h8"></path></svg>
              <strong className="text-blue-300">Analizar</strong> tu rendimiento con métricas avanzadas (P&L, R-Múltiple, Win Rate, Drawdown).
            </li>
            <li className="flex items-center">
              <svg className="mr-3 h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              <strong className="text-blue-300">Mejorar</strong> tus estrategias y gestionar emociones.
            </li>
            <li className="flex items-center">
              <svg className="mr-3 h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <strong className="text-blue-300">Personalizar</strong> tus dashboards y métricas.
            </li>
          </ul>
          {/* Botón para ir al dashboard principal */}
          <a
            href="/dashboard" // Enlace a la ruta de tu dashboard principal
            className="inline-flex transform items-center justify-center rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition-colors duration-300 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-75"
          >
            Ir al Dashboard
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </a>
        </div>

        {/* Sección Derecha: Formulario de Registro de la Primera Operación */}
        <div className="w-full rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-2xl md:p-8 lg:w-1/2">
          <h2 className="mb-6 text-center text-2xl font-bold text-white">Registra tu Primera Operación</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Símbolo */}
            <div>
              <label htmlFor="symbol" className="mb-1 block text-sm font-medium text-gray-300">Símbolo (Ej: EURUSD, AAPL)</label>
              <input
                type="text"
                id="symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ej: XAUUSD"
              />
            </div>
            {/* Campos Fecha y Hora */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="tradeDate" className="mb-1 block text-sm font-medium text-gray-300">Fecha</label>
                <input
                  type="date"
                  id="tradeDate"
                  name="tradeDate"
                  value={formData.tradeDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="tradeTime" className="mb-1 block text-sm font-medium text-gray-300">Hora</label>
                <input
                  type="time"
                  id="tradeTime"
                  name="tradeTime"
                  value={formData.tradeTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* Campo Dirección (Radio buttons) */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">Dirección</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="direction"
                    value="LONG"
                    checked={formData.direction === 'LONG'}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-200">Compra (LONG)</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="direction"
                    value="SHORT"
                    checked={formData.direction === 'SHORT'}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-200">Venta (SHORT)</span>
                </label>
              </div>
            </div>
            {/* Campos Precio de Entrada y Cantidad */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="entryPrice" className="mb-1 block text-sm font-medium text-gray-300">Precio de Entrada</label>
                <input
                  type="text" // Usar text para permitir input de decimales de alta precisión sin problemas de parseo inicial
                  id="entryPrice"
                  name="entryPrice"
                  value={formData.entryPrice}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ej: 1.07550"
                />
              </div>
              <div>
                <label htmlFor="quantity" className="mb-1 block text-sm font-medium text-gray-300">Tamaño (Lotes/Unidades)</label>
                <input
                  type="text" // Usar text para permitir input de decimales de alta precisión
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ej: 0.10"
                />
              </div>
            </div>
            {/* Campo Notas/Razonamiento */}
            <div>
              <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-300">Notas/Razonamiento (Opcional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ej: Entrada por patrón de doble suelo en H1."
              ></textarea>
            </div>
            {/* Botón de envío del formulario */}
            <button
              type="submit"
              className="w-full transform rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition-colors duration-300 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-75"
            >
              Registrar Operación
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserDashboardHero;