import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ModuleService from "@/services/moduleService";
import { UserDetailContext } from "@/context/UserDetailContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EditTradeModal from "@/components/entries/EditTrade";
import { SidebarInset } from "@/components/ui/sidebar";
import { BreadcrumbCf } from "@/components/Breadcrumb";

const Portfolio = () => {
  const [trades, setTrades] = useState(null as any);
  const [editingTrade, setEditingTrade] = useState(null as any);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [hasChange, setHasChange] = useState(0);
  const context = useContext(UserDetailContext);
  const [accounts, setAccounts] = useState(null as any);
  const [selectedAccountId, setSelectedAccountId] = useState("all");
  const [searchParams] = useSearchParams();

  if (!context) {
    throw new Error(
      "UserDetailContext debe usarse dentro de un UserDetailProvider"
    );
  }

  const { userDetail } = context;

  useEffect(() => {
    const initials = async () => {
      const results = await ModuleService.trades.byUser("user", userDetail?.id);
      const accounts: any = await ModuleService.accounts.byUser();
      setAccounts(accounts.data);
      const sorted = results.results.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setTrades(sorted);
      
      // Verificar si hay un accountId en la URL
      const accountIdFromUrl = searchParams.get('accountId');
      if (accountIdFromUrl) {
        setSelectedAccountId(accountIdFromUrl);
      }
    };
    initials();
  }, [hasChange, searchParams]);

  const onHandleDelete = async (id: string) => {
    try {
      await ModuleService.trades.delete(id);
      const newTrades = trades.filter((trade: any) => trade.id !== id);
      setTrades(newTrades);
    } catch (error) {
      console.log(error);
    }
  };

  const onHandleEdit = (trade: any) => {
    setEditingTrade(trade);
    setIsEditModalOpen(true);
  };

  const onTradeUpdated = (updatedTrade: any) => {
    const updatedTrades = trades.map((trade: any) =>
      trade.id === updatedTrade.id ? updatedTrade : trade
    );
    setTrades(updatedTrades);
    setIsEditModalOpen(false);
    setEditingTrade(null);
    setHasChange(hasChange + 1);
  };

  // Función para calcular el porcentaje basado en el resultado vs balance de cuenta
  const calculatePercentage = (resultUsd: number, accountId: string) => {
    if (!resultUsd || !accounts || !accountId) return "0.00";
    
    const account = accounts.find((acc: any) => acc.id === accountId);
    if (!account || !account.currentBalance) return "0.00";
    
    const percentage = (resultUsd / account.currentBalance) * 100;
    return percentage.toFixed(2);
  };

  const filteredTrades = trades ? trades.filter((trade: any) => 
    selectedAccountId === "all" || trade.step1.accountId === selectedAccountId
  ) : [];

  return (
    <SidebarInset className="text-yellow-500">
      <BreadcrumbCf firstPage="Trades" secondPage="Listado de Trades" />
      <div className="min-h-screen w-full bg-black p-6 text-yellow-500 overflow-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
            📊 Portfolio de Trades
          </h1>
          <p className="text-neutral-400 text-sm">
            Gestiona y analiza tu historial de operaciones
          </p>
        </div>

        {/* Filtro por cuenta */}
        <div className="mb-8 flex justify-center">
          <div className="flex flex-col items-center space-y-3 w-full max-w-xs">
            <label className="text-sm text-yellow-400 font-medium text-center">
              {searchParams.get('accountId') ? 'Mostrando trades de la cuenta seleccionada:' : 'Filtrar trades por cuenta:'}
            </label>
            <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
              <SelectTrigger className="bg-neutral-950 border-yellow-600/30 text-yellow-100 w-full">
                <SelectValue placeholder="Seleccionar cuenta" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-950 border-yellow-600/30">
                <SelectItem value="all" className="text-yellow-100 focus:bg-yellow-500/20">
                  Todas las cuentas
                </SelectItem>
                {accounts?.map((account: any) => (
                  <SelectItem 
                    key={account.id} 
                    value={account.id}
                    className="text-yellow-100 focus:bg-yellow-500/20"
                  >
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredTrades && filteredTrades.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTrades.map((trade: any) => {
              const isProfit = trade.step2.resultUsd > 0;
              const calculatedPercentage = calculatePercentage(
                trade.step2.resultUsd,
                trade.step1.accountId
              );
              
              return (
                <div
                  key={trade.id}
                  className="bg-neutral-900 border border-yellow-600/30 rounded-xl p-6 hover:border-yellow-400/70 transition-all duration-300 shadow-lg hover:shadow-xl h-full flex flex-col"
                >
                  {/* Header profesional */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                        <span className="text-black font-bold text-sm">
                          {trade.step1.asset.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {trade.step1.asset.toUpperCase()}
                        </h3>
                        <p className="text-xs text-neutral-400">
                          {new Date(trade.step1.date).toLocaleDateString('es-ES')} • {trade.step1.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          trade.step1.tradeType === 'compra' || trade.step1.tradeType === 'largo'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {trade.step1.tradeType === 'compra' ? 'LONG' : 
                         trade.step1.tradeType === 'venta' ? 'SHORT' :
                         trade.step1.tradeType === 'largo' ? 'LONG' : 'SHORT'}
                      </span>
                      <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded font-medium border border-yellow-600/30">
                        {trade.step1.setup}
                      </span>
                    </div>
                  </div>

                  {/* Métricas principales */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
                      <p className="text-xs text-neutral-400 mb-1">Ganancia total</p>
                      <p className={`text-xl font-bold ${
                        isProfit ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {isProfit ? '+' : ''}${trade.step2.resultUsd}
                      </p>
                    </div>
                    <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
                      <p className="text-xs text-neutral-400 mb-1">Rendimiento</p>
                      <p className={`text-xl font-bold ${
                        parseFloat(calculatedPercentage) > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {parseFloat(calculatedPercentage) > 0 ? '+' : ''}{calculatedPercentage}%
                      </p>
                    </div>
                  </div>

                  {/* Precios de ejecución */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-xs text-neutral-400 mb-1">Entrada</p>
                      <p className="font-mono text-white font-semibold">{trade.step2.entryPrice}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-neutral-400 mb-1">Salida</p>
                      <p className="font-mono text-white font-semibold">{trade.step2.exitPrice}</p>
                    </div>
                  </div>

                  {/* Risk Management */}
                  <div className="bg-neutral-800/30 rounded-lg p-3 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-yellow-400 font-medium">RISK MANAGEMENT</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-xs text-red-400 mb-1">Stop Loss</p>
                        <p className="text-sm font-mono text-red-300">{trade.step2.stopLoss} pips</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-green-400 mb-1">Take Profit</p>
                        <p className="text-sm font-mono text-green-300">{trade.step2.takeProfit} pips</p>
                      </div>
                    </div>
                  </div>

                  {/* Imágenes del trade */}
                  {trade.step4?.uploadedFiles?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-yellow-400 font-medium mb-2">IMÁGENES</p>
                      <div className="flex flex-wrap gap-2">
                        {trade.step4.uploadedFiles.map((file: any, index: number) => (
                          <button
                            key={file.key || index}
                            onClick={() => window.open(file.url, '_blank')}
                            className="w-12 h-12 rounded border border-yellow-600/30 hover:border-yellow-400 transition-colors overflow-hidden"
                          >
                            <img
                              src={file.url}
                              alt={`Imagen ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                              loading="lazy"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notas/Comentarios */}
                  {trade.step4?.notes && (
                    <div className="mb-4">
                      <p className="text-xs text-yellow-400 font-medium mb-2">NOTAS</p>
                      <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
                        <p className="text-sm text-neutral-300 leading-relaxed">
                          {trade.step4.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Información adicional */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {trade.step4?.followedPlan !== undefined && (
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${
                            trade.step4.followedPlan ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className="text-xs text-neutral-300">
                            {trade.step4.followedPlan ? 'Plan seguido' : 'Plan no seguido'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {trade.step4?.mediaUrl && (
                        <a
                          href={trade.step4.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </svg>
                        </a>
                      )}
                      {trade.step4?.notes && (
                        <svg className="w-4 h-4 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {trade.step4?.tags?.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {trade.step4.tags.slice(0, 3).map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20"
                          >
                            {tag.replace('#', '')}
                          </span>
                        ))}
                        {trade.step4.tags.length > 3 && (
                          <span className="px-2 py-1 bg-neutral-700 text-neutral-300 text-xs rounded">
                            +{trade.step4.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Botones de acción - Siempre al final */}
                  <div className="flex space-x-2 mt-auto">
                    <Button
                      onClick={() => onHandleEdit(trade)}
                      className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white border border-yellow-600/30 hover:border-yellow-400/50 transition-all duration-200"
                      size="sm"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white border border-red-500/30 hover:border-red-400/50 transition-all duration-200"
                          size="sm"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-neutral-900 border-yellow-600/30">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-red-400">
                            Confirmar eliminación
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-neutral-300">
                            Esta acción no se puede deshacer. El trade será eliminado permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-neutral-700 text-white border-neutral-600 hover:bg-neutral-600">
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={() => onHandleDelete(trade.id)}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-lg">
              No tienes trades registrados aún
            </p>
          </div>
        )}

        {/* Modal de edición */}
        <EditTradeModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTrade(null);
          }}
          trade={editingTrade}
          onTradeUpdated={onTradeUpdated}
        />
      </div>
    </SidebarInset>
  );
};

export default Portfolio;