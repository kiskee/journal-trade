import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ModuleService from "@/services/moduleService";

interface EditTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trade: any;
  onTradeUpdated: (updatedTrade: any) => void;
}

export default function EditTradeModal({
  isOpen,
  onClose,
  trade,
  onTradeUpdated,
}: EditTradeModalProps) {
  const [formData, setFormData] = useState({
    // Step 1
    asset: "",
    setup: "",
    date: "",
    time: "",
    tradeType: "",
    duration: "",
    durationUnit: "",
    positionSize: "",

    // Step 2
    entryPrice: "",
    exitPrice: "",
    takeProfit: "",
    stopLoss: "",
    resultUsd: "",
    resultPercent: "",

    // Step 3
    emotionBefore: "",
    emotionAfter: "",
    confidenceLevel: "",
    disciplineLevel: "",

    // Step 4
    notes: "",
    tags: [] as string[],
    followedPlan: false,
    mediaUrl: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Cargar datos del trade cuando se abre el modal
  useEffect(() => {
    if (trade) {
      setFormData({
        asset: trade.step1.asset || "",
        setup: trade.step1.setup || "",
        date: trade.step1.date || "",
        time: trade.step1.time || "",
        tradeType: trade.step1.tradeType || "",
        duration: trade.step1.duration || "",
        durationUnit: trade.step1.durationUnit || "",
        positionSize: trade.step1.positionSize || "",

        entryPrice: trade.step2.entryPrice || "",
        exitPrice: trade.step2.exitPrice || "",
        takeProfit: trade.step2.takeProfit || "",
        stopLoss: trade.step2.stopLoss || "",
        resultUsd: trade.step2.resultUsd || "",
        resultPercent: trade.step2.resultPercent || "",

        emotionBefore: trade.step3.emotionBefore || "",
        emotionAfter: trade.step3.emotionAfter || "",
        confidenceLevel: trade.step3.confidenceLevel || "",
        disciplineLevel: trade.step3.disciplineLevel || "",

        notes: trade.step4.notes || "",
        tags: trade.step4.tags || [],
        followedPlan: trade.step4.followedPlan || false,
        mediaUrl: trade.step4.mediaUrl || "",
      });
    }
  }, [trade]);

  // Opciones de emociones
  const emotionBeforeOptions = [
    "Confianza",
    "Ansiedad",
    "Duda",
    "Impaciencia",
    "Euforia",
    "Miedo",
    "Seguridad",
    "Tensión",
    "Apatía",
    "Motivación",
  ] as const;

  const emotionAfterOptions = [
    "Satisfacción",
    "Frustración",
    "Alivio",
    "Enojo",
    "Desilusión",
    "Orgullo",
    "Remordimiento",
    "Indiferencia",
    "Euforia",
  ] as const;

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Estructura del trade actualizado
      const updatedTrade = {
        ...trade,
        step1: {
          asset: formData.asset,
          setup: formData.setup,
          date: formData.date,
          time: formData.time,
          tradeType: formData.tradeType,
          duration: formData.duration,
          durationUnit: formData.durationUnit,
          positionSize: formData.positionSize,
        },
        step2: {
          entryPrice: parseFloat(formData.entryPrice) || 0,
          exitPrice: parseFloat(formData.exitPrice) || 0,
          takeProfit: parseFloat(formData.takeProfit) || 0,
          stopLoss: parseFloat(formData.stopLoss) || 0,
          resultUsd: parseFloat(formData.resultUsd) || 0,
          resultPercent: parseFloat(formData.resultPercent) || 0,
          fees: 0,
        },
        step3: {
          emotionBefore: formData.emotionBefore,
          emotionAfter: formData.emotionAfter,
          confidenceLevel: parseInt(formData.confidenceLevel) || 0,
          disciplineLevel: parseInt(formData.disciplineLevel) || 0,
        },
        step4: {
          notes: formData.notes,
          tags: formData.tags,
          followedPlan: formData.followedPlan,
          mediaUrl: formData.mediaUrl,
          uploadedFiles: trade.step4.uploadedFiles || [],
        },
      };

      delete updatedTrade.id;
      updatedTrade.updated = new Date().toISOString();

      await ModuleService.trades.update(trade.id, updatedTrade);

      // Notificar al componente padre
      onTradeUpdated(updatedTrade);
    } catch (error) {
      console.error("Error updating trade:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-950 border-2 border-yellow-600/30 text-yellow-100 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-yellow-400 text-xl font-bold">
            Editar Trade
          </DialogTitle>
          <DialogDescription className="text-neutral-400 mt-2">
            Modifica los datos de tu trade
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Información básica */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-yellow-400 border-b border-yellow-600/30 pb-3 mb-5">
              Información Básica
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="asset"
                  className="text-yellow-300 text-sm font-medium block"
                >
                  Asset
                </Label>
                <Input
                  id="asset"
                  value={formData.asset}
                  onChange={(e) => handleInputChange("asset", e.target.value)}
                  className="bg-neutral-900 border-yellow-600/30 text-yellow-100 h-11 px-4 rounded-md focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600"
                  placeholder="BTC, ETH, EUR/USD..."
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="setup"
                  className="text-yellow-300 text-sm font-medium block"
                >
                  Setup
                </Label>
                <Input
                  id="setup"
                  value={formData.setup}
                  onChange={(e) => handleInputChange("setup", e.target.value)}
                  className="bg-neutral-900 border-yellow-600/30 text-yellow-100 h-11 px-4 rounded-md focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600"
                  placeholder="Breakout, Support/Resistance..."
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="date"
                  className="text-yellow-300 text-sm font-medium block"
                >
                  Fecha
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="bg-neutral-900 border-yellow-600/30 text-yellow-100 h-11 px-4 rounded-md focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="time"
                  className="text-yellow-300 text-sm font-medium block"
                >
                  Hora
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  className="bg-neutral-900 border-yellow-600/30 text-yellow-100 h-11 px-4 rounded-md focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="tradeType"
                  className="text-yellow-300 text-sm font-medium block"
                >
                  Tipo de Trade
                </Label>
                <Select
                  value={formData.tradeType}
                  onValueChange={(value) =>
                    handleInputChange("tradeType", value)
                  }
                >
                  <SelectTrigger className="bg-neutral-900 border-yellow-600/30 text-yellow-100 h-11 focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-yellow-600/30">
                    <SelectItem
                      value="compra"
                      className="text-yellow-100 focus:bg-yellow-600/20"
                    >
                      Compra
                    </SelectItem>
                    <SelectItem
                      value="venta"
                      className="text-yellow-100 focus:bg-yellow-600/20"
                    >
                      Venta
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="positionSize"
                  className="text-yellow-300 text-sm font-medium block"
                >
                  Tamaño de Posición
                </Label>
                <Input
                  id="positionSize"
                  value={formData.positionSize}
                  onChange={(e) =>
                    handleInputChange("positionSize", e.target.value)
                  }
                  className="bg-neutral-900 border-yellow-600/30 text-yellow-100 h-11 px-4 rounded-md focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600"
                  placeholder="1 BTC, 100 EUR..."
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label className="text-yellow-300 text-sm font-medium block">
                  Duración
                </Label>
                <div className="flex gap-3">
                  <Input
                    value={formData.duration}
                    onChange={(e) =>
                      handleInputChange("duration", e.target.value)
                    }
                    className="bg-neutral-900 border-yellow-600/30 text-yellow-100 h-11 px-4 rounded-md focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600"
                    placeholder="5"
                  />
                  <Select
                    value={formData.durationUnit}
                    onValueChange={(value) =>
                      handleInputChange("durationUnit", value)
                    }
                  >
                    <SelectTrigger className="bg-neutral-900 border-yellow-600/30 text-yellow-100 h-11 w-36 focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600">
                      <SelectValue placeholder="Unidad" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-yellow-600/30">
                      <SelectItem
                        value="minutos"
                        className="text-yellow-100 focus:bg-yellow-600/20"
                      >
                        Minutos
                      </SelectItem>
                      <SelectItem
                        value="horas"
                        className="text-yellow-100 focus:bg-yellow-600/20"
                      >
                        Horas
                      </SelectItem>
                      <SelectItem
                        value="días"
                        className="text-yellow-100 focus:bg-yellow-600/20"
                      >
                        Días
                      </SelectItem>
                      <SelectItem
                        value="semanas"
                        className="text-yellow-100 focus:bg-yellow-600/20"
                      >
                        Semanas
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Resultados */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-yellow-400 border-b border-yellow-600/30 pb-3 mb-5">
              Resultados
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="entryPrice"
                  className="text-yellow-300 text-sm font-medium block"
                >
                  Precio de Entrada
                </Label>
                <Input
                  id="entryPrice"
                  type="number"
                  step="0.01"
                  value={formData.entryPrice}
                  onChange={(e) =>
                    handleInputChange("entryPrice", e.target.value)
                  }
                  className="bg-neutral-900 border-yellow-600/30 text-yellow-100 h-11 px-4 rounded-md focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="exitPrice"
                  className="text-yellow-300 text-sm font-medium block"
                >
                  Precio de Salida
                </Label>
                <Input
                  id="exitPrice"
                  type="number"
                  step="0.01"
                  value={formData.exitPrice}
                  onChange={(e) =>
                    handleInputChange("exitPrice", e.target.value)
                  }
                  className="bg-neutral-900 border-yellow-600/30 text-yellow-100 h-11 px-4 rounded-md focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="takeProfit"
                  className="text-yellow-300 text-sm font-medium block"
                >
                  Take Profit
                </Label>
                <Input
                  id="takeProfit"
                  type="number"
                  step="0.01"
                  value={formData.takeProfit}
                  onChange={(e) =>
                    handleInputChange("takeProfit", e.target.value)
                  }
                  className="bg-neutral-900 border-yellow-600/30 text-yellow-100 h-11 px-4 rounded-md focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="stopLoss"
                  className="text-yellow-300 text-sm font-medium block"
                >
                  Stop Loss
                </Label>
                <Input
                  id="stopLoss"
                  type="number"
                  step="0.01"
                  value={formData.stopLoss}
                  onChange={(e) =>
                    handleInputChange("stopLoss", e.target.value)
                  }
                  className="bg-neutral-900 border-yellow-600/30 text-yellow-100 h-11 px-4 rounded-md focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="resultUsd"
                  className="text-yellow-300 text-sm font-medium block"
                >
                  Resultado (USD)
                </Label>
                <Input
                  id="resultUsd"
                  type="number"
                  step="0.01"
                  value={formData.resultUsd}
                  onChange={(e) =>
                    handleInputChange("resultUsd", e.target.value)
                  }
                  className="bg-neutral-900 border-yellow-600/30 text-yellow-100 h-11 px-4 rounded-md focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="resultPercent"
                  className="text-yellow-300 text-sm font-medium block"
                >
                  Resultado (%)
                </Label>
                <Input
                  id="resultPercent"
                  type="number"
                  step="0.01"
                  value={formData.resultPercent}
                  onChange={(e) =>
                    handleInputChange("resultPercent", e.target.value)
                  }
                  className="bg-neutral-900 border-yellow-600/30 text-yellow-100 h-11 px-4 rounded-md focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Psicología */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-400 border-b border-yellow-600/30 pb-2">
              Psicología
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emotionBefore" className="text-yellow-300 py-2">
                  Emoción Antes
                </Label>
                <Select
                  value={formData.emotionBefore}
                  onValueChange={(value) =>
                    handleInputChange("emotionBefore", value)
                  }
                >
                  <SelectTrigger className="bg-neutral-900 border-yellow-600/30 text-yellow-100">
                    <SelectValue placeholder="Seleccionar emoción" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-yellow-600/30 text-white">
                    {emotionBeforeOptions.map((emotion) => (
                      <SelectItem key={emotion} value={emotion.toLowerCase()}>
                        {emotion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="emotionAfter" className="text-yellow-300 py-2">
                  Emoción Después
                </Label>
                <Select
                  value={formData.emotionAfter}
                  onValueChange={(value) =>
                    handleInputChange("emotionAfter", value)
                  }
                >
                  <SelectTrigger className="bg-neutral-900 border-yellow-600/30 text-yellow-100">
                    <SelectValue placeholder="Seleccionar emoción" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-yellow-600/30 text-white">
                    {emotionAfterOptions.map((emotion) => (
                      <SelectItem key={emotion} value={emotion.toLowerCase()}>
                        {emotion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="confidenceLevel"
                  className="text-yellow-300 py-2"
                >
                  Nivel de Confianza (1-10)
                </Label>
                <Input
                  id="confidenceLevel"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.confidenceLevel}
                  onChange={(e) =>
                    handleInputChange("confidenceLevel", e.target.value)
                  }
                  className="bg-neutral-900 border-yellow-600/30 text-yellow-100"
                />
              </div>

              <div>
                <Label
                  htmlFor="disciplineLevel"
                  className="text-yellow-300 py-2"
                >
                  Nivel de Disciplina (1-10)
                </Label>
                <Input
                  id="disciplineLevel"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.disciplineLevel}
                  onChange={(e) =>
                    handleInputChange("disciplineLevel", e.target.value)
                  }
                  className="bg-neutral-900 border-yellow-600/30 text-yellow-100"
                />
              </div>
            </div>
          </div>

          {/* Step 4: Notas y configuración */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-yellow-400 border-b border-yellow-600/30 pb-3 mb-5">
              Notas y Configuración
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="notes"
                  className="text-yellow-300 text-sm font-medium block"
                >
                  Notas
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e: any) =>
                    handleInputChange("notes", e.target.value)
                  }
                  className="bg-neutral-900 border-yellow-600/30 text-yellow-100 min-h-[100px] px-4 py-3 rounded-md focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 resize-none"
                  placeholder="Escribe tus observaciones sobre el trade..."
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="mediaUrl"
                  className="text-yellow-300 text-sm font-medium block"
                >
                  URL del Gráfico
                </Label>
                <Input
                  id="mediaUrl"
                  type="url"
                  value={formData.mediaUrl}
                  onChange={(e) =>
                    handleInputChange("mediaUrl", e.target.value)
                  }
                  className="bg-neutral-900 border-yellow-600/30 text-yellow-100 h-11 px-4 rounded-md focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600"
                  placeholder="https://example.com/chart.png"
                />
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <Label className="text-yellow-300 text-sm font-medium block">
                  Tags
                </Label>
                <div className="flex gap-3">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="bg-neutral-900 border-yellow-600/30 text-yellow-100 h-11 px-4 rounded-md focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 flex-1"
                    placeholder="Agregar tag..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    className="bg-yellow-600 text-black hover:bg-yellow-700 font-medium px-6 h-11 rounded-md transition-colors"
                  >
                    Agregar
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-yellow-500/20 text-yellow-300 text-sm rounded-md border border-yellow-600/30 flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-red-400 hover:text-red-300 text-lg leading-none transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Seguimiento del plan */}
              <div className="flex items-center space-x-3 pt-2">
                <Checkbox
                  id="followedPlan"
                  checked={formData.followedPlan}
                  onCheckedChange={(checked: any) =>
                    handleInputChange("followedPlan", checked)
                  }
                  className="border-yellow-600/30 data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600 h-5 w-5"
                />
                <Label
                  htmlFor="followedPlan"
                  className="text-yellow-300 text-sm font-medium cursor-pointer"
                >
                  Siguió el plan de trading
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-3 pt-6 border-t border-yellow-600/30">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-neutral-800 border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-white hover:border-neutral-500 transition-colors"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-yellow-600 text-black hover:bg-yellow-700 disabled:opacity-50 font-medium"
            >
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
