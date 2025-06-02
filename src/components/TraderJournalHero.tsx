import {
  TrendingUp,
  BarChart3,
  Target,
  DollarSign,
  Calendar,
  Clock,
  FileText,
} from "lucide-react";

export default function TraderJournalHero() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-blue-600/10 text-blue-100 px-4 py-2 rounded-full text-sm border border-blue-600/20">
                  <TrendingUp className="w-4 h-4" />
                  <span>Mejora tu Trading</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                  Tu <span className="text-blue-600">Journal</span> de
                  <br />
                  Trading Profesional
                </h1>

                <p className="text-xl text-neutral-200 leading-relaxed max-w-xl">
                  Registra, analiza y mejora tus operaciones. Convierte cada
                  trade en una oportunidad de aprendizaje y maximiza tu
                  rentabilidad.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3 text-neutral-200">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Análisis P&L</h3>
                    <p className="text-sm text-neutral-400">
                      Seguimiento detallado
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-neutral-200">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Estrategias</h3>
                    <p className="text-sm text-neutral-400">
                      Documenta patrones
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-neutral-200">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Reportes</h3>
                    <p className="text-sm text-neutral-400">
                      Informes automáticos
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-500">
                    +24%
                  </div>
                  <div className="text-sm text-neutral-400">
                    Mejora promedio
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-neutral-400">
                    Traders activos
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">10K+</div>
                  <div className="text-sm text-neutral-400">
                    Trades registrados
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Crea tu Primera Entrada
                  </h2>
                  <p className="text-neutral-400">
                    Comienza a documentar tus trades ahora
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Symbol */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-200">
                      Símbolo/Par
                    </label>
                    <input
                      type="text"
                      name="symbol"
                      //    value={formData.symbol}
                      //    onChange={handleInputChange}
                      placeholder="Ej: EURUSD, AAPL, BTC/USD"
                      className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Action & Quantity */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-200">
                        Acción
                      </label>
                      <select
                        name="action"
                        //  value={formData.action}
                        //  onChange={handleInputChange}
                        className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      >
                        <option value="buy">Compra</option>
                        <option value="sell">Venta</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-200">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        //  value={formData.quantity}
                        //  onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Entry Price */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-200">
                      Precio de Entrada
                    </label>
                    <input
                      type="number"
                      name="entryPrice"
                      //    value={formData.entryPrice}
                      //    onChange={handleInputChange}
                      placeholder="0.00000"
                      step="0.00001"
                      className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-200">
                      Notas de Trading
                    </label>
                    <textarea
                      name="notes"
                      //    value={formData.notes}
                      //    onChange={handleInputChange}
                      placeholder="Estrategia utilizada, setup, razón de entrada..."
                      rows={3}
                      className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  {/* Timestamp Info */}
                  <div className="flex items-center justify-between text-sm text-neutral-400 bg-neutral-700/30 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Hoy</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date().toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    //onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-neutral-800 shadow-lg"
                  >
                    🚀 Crear Primera Entrada
                  </button>
                </div>

                <div className="text-center pt-4">
                  <p className="text-xs text-neutral-500">
                    Al crear tu entrada, aceptas comenzar tu journey hacia un
                    trading más disciplinado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-900 to-transparent"></div>
      </div>
    </>
  );
}
