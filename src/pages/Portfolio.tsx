import { useContext, useEffect, useState } from "react";
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
import RelateAccountDialog from "@/components/RelateAccountDialog";
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
    };
    initials();
  }, [hasChange]);

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

  const onHandleAddAccount = async (accountId: string, trade: any) => {
    const tradeId = trade.id;
    delete trade.id;
    trade.updated = new Date().toISOString();
    trade.step1.accountId = accountId;
    if (!trade.step2.fees) {
      trade.step2.fees = 0;
    }
    await ModuleService.trades.update(tradeId, trade);
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
            Filtrar trades por cuenta:
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
        <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 justify-items-center">
          {filteredTrades.map((trade: any) => (
            <div
              key={trade.id}
              className="bg-neutral-950 text-white rounded-lg shadow-md shadow-yellow-500/10 p-6 border border-yellow-600/30 w-full h-full sm:min-w-xs min-w-xs backdrop-blur-sm"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-100">
                      {trade.step1.asset.toUpperCase()} - {trade.step1.setup}
                    </h3>
                    <p className="text-sm text-neutral-400">
                      {new Date(trade.date).toLocaleDateString("es-ES")} -{" "}
                      {trade.step1.time}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        trade.step2.resultUsd > 0
                          ? "bg-green-500 text-black"
                          : "bg-red-500 text-black"
                      }`}
                    >
                      {trade.step1.tradeType === "venta" ? "SELL" : "BUY"}
                    </span>
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  {/* Información */}
                  <div>
                    <h4 className="font-medium text-yellow-400 mb-2">
                      Información
                    </h4>
                    <p className="text-sm text-yellow-100">
                      Duración: {trade.step1.duration}{" "}
                      {trade.step1.durationUnit}
                    </p>
                    <p className="text-sm text-yellow-100">
                      Tamaño: {trade.step1.positionSize}
                    </p>
                    <p className="text-sm text-yellow-100">
                      Entrada: ${trade.step2.entryPrice}
                    </p>
                    <p className="text-sm text-yellow-100">
                      Salida: ${trade.step2.exitPrice}
                    </p>
                  </div>

                  {/* Resultados */}
                  <div>
                    <h4 className="font-medium text-yellow-400 mb-2">
                      Resultados
                    </h4>
                    <p
                      className={`text-sm ${
                        trade.step2.resultUsd > 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      USD: ${trade.step2.resultUsd}
                    </p>
                    <p
                      className={`text-sm ${
                        trade.step2.resultPercent > 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      %: {trade.step2.resultPercent}%
                    </p>
                    <p className="text-sm text-yellow-100">
                      TP: ${trade.step2.takeProfit}
                    </p>
                    <p className="text-sm text-yellow-100">
                      SL: ${trade.step2.stopLoss}
                    </p>
                  </div>

                  {/* Psicología */}
                  <div>
                    <h4 className="font-medium text-yellow-400 mb-2">
                      Psicología
                    </h4>
                    <p className="text-sm text-yellow-100">
                      Antes: {trade.step3.emotionBefore}
                    </p>
                    <p className="text-sm text-yellow-100">
                      Después: {trade.step3.emotionAfter}
                    </p>
                    <p className="text-sm text-yellow-100">
                      Confianza: {trade.step3.confidenceLevel}/10
                    </p>
                    <p className="text-sm text-yellow-100">
                      Disciplina: {trade.step3.disciplineLevel}/10
                    </p>
                  </div>
                </div>

                {/* Notas y Tags */}
                <p className="text-sm text-yellow-100">
                  Fecha del trade:
                  <p className="text-yellow-500">{trade.step1.date}</p>
                </p>
                <div className="border-t border-yellow-600/30 pt-4">
                  {trade.step4.notes && (
                    <div className="mb-3">
                      <h4 className="font-medium text-yellow-400 mb-1">
                        Notas
                      </h4>
                      <p className="text-sm text-yellow-100">
                        {trade.step4.notes}
                      </p>
                    </div>
                  )}

                  {trade.step4.tags?.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-medium text-yellow-400 mb-1">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {trade.step4.tags.map((tag: any, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded border border-yellow-600/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Imágenes subidas */}
                  {trade.step4.uploadedFiles?.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-medium text-yellow-400 mb-2">
                        Imágenes
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {trade.step4.uploadedFiles.map(
                          (file: any, index: number) => (
                            <a
                              key={file.key || index}
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:opacity-80 transition-opacity"
                            >
                              <img
                                src={file.url}
                                alt={`Imagen ${index + 1}`}
                                className="w-16 h-16 object-cover rounded border border-yellow-600/30 hover:border-yellow-400"
                                loading="lazy"
                              />
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Plan y media */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          trade.step4.followedPlan
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      <span className="text-sm text-yellow-100">
                        {trade.step4.followedPlan
                          ? "Siguió el plan"
                          : "No siguió el plan"}
                      </span>
                    </div>

                    {trade.step4.mediaUrl && (
                      <a
                        href={trade.step4.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline text-yellow-400 hover:text-yellow-300 transition-colors"
                      >
                        Ver gráfico
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="pt-4 flex gap-3">
                <Button
                  onClick={() => onHandleEdit(trade)}
                  className="bg-blue-500 text-white hover:bg-blue-600 transition-colors flex-1"
                >
                  Editar Trade
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-red-500 text-black hover:bg-red-600 transition-colors flex-1">
                      Eliminar Trade
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-neutral-950 border-2 border-red-600">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-red-500 text-center">
                        ¿Estás completamente segur@?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-yellow-100 text-center">
                        Esta acción no se puede devolver. Borraremos el trade
                        permanentemente de nuestra base de datos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-neutral-800 text-yellow-100 border-yellow-600/30 hover:bg-neutral-700">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 text-black hover:bg-red-600"
                        onClick={() => onHandleDelete(trade.id)}
                      >
                        Borrar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {!trade.step1.accountId && (
                <div className="flex justify-center">
                  <RelateAccountDialog
                    accounts={accounts}
                    trade={trade}
                    onRelate={onHandleAddAccount}
                  />
                </div>
              )}
            </div>
          ))}
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
