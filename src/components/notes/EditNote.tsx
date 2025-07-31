import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ModuleService from "@/services/moduleService";

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: any;
  onNoteUpdated: (updatedNote: any) => void;
}

export default function EditNoteModal({
  isOpen,
  onClose,
  note,
  onNoteUpdated,
}: EditNoteModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    sentiment: "",
    tags: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || "",
        content: note.content || "",
        sentiment: note.sentiment || "",
        tags: note.tags || [],
      });
    }
  }, [note]);

  const emotions = [
    "Euforia",
    "Miedo",
    "Aversión al riesgo",
    "Codicia",
    "Esperanza",
    "Frustración",
    "Impaciencia",
    "Duda",
    "Ansiedad",
    "Culpa",
    "Arrepentimiento",
    "Confianza",
    "Desesperación",
    "Vergüenza",
    "Autoengaño",
    "Agotamiento mental",
    "Desapego emocional",
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
      const updatedNote = {
        ...note,
        title: formData.title,
        content: formData.content,
        sentiment: formData.sentiment,
        tags: formData.tags,
      };
      delete updatedNote.id;
      updatedNote.updated = new Date().toISOString();
      await ModuleService.notes.update(note.id, updatedNote);
      onNoteUpdated(updatedNote);
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
          <DialogTitle className="text-yellow-400 text-xl font-bold text-center">
            Editar Nota
          </DialogTitle>
          <DialogDescription className="text-neutral-400 mt-2 text-center">
            Modifica los datos de tu Nota
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="asset"
                  className="text-yellow-300 text-sm font-medium block"
                >
                  Titulo
                </Label>
                <Input
                  id="asset"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="bg-neutral-900 border-yellow-600/30 text-yellow-100 h-11 px-4 rounded-md focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600"
                  //placeholder="BTC, ETH, EUR/USD..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="content"
                className="text-yellow-300 text-sm font-medium block"
              >
                Notas
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e: any) =>
                  handleInputChange("content", e.target.value)
                }
                className="bg-neutral-900 border-yellow-600/30 text-yellow-100 min-h-[100px] px-4 py-3 rounded-md focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 resize-none"
                placeholder="Escribe tus observaciones sobre el trade..."
              />
            </div>
            <div>
              <Label htmlFor="emotionBefore" className="text-yellow-300 py-2">
                Sentimiento
              </Label>
              <Select
                value={formData.sentiment}
                onValueChange={(value) => handleInputChange("sentiment", value)}
              >
                <SelectTrigger className="bg-neutral-900 border-yellow-600/30 text-yellow-100">
                  <SelectValue placeholder="Seleccionar emoción" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-yellow-600/30 text-white">
                  {emotions.map((emotion) => (
                    <SelectItem key={emotion} value={emotion.toLowerCase()}>
                      {emotion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
