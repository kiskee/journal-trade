import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Tag,
  Heart,
  Edit,
  Trash2,
} from "lucide-react";
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
} from "../ui/alert-dialog";
import EditNoteModal from "./EditNote";

type NoteData = {
  content: string;
  updated: string;
  date: string;
  sentiment: string;
  user: string;
  update: string;
  id: string;
  tags: string[];
  title: string;
};

type Props = {
  data: NoteData[];
  onNoteUpdated: (updatedNote: any) => void;
  onHabdleDelete: (id: string) => void;
  onHandleEdit: (trade: any) => void;
};

// Colores para diferentes sentimientos
const sentimentColors: Record<string, string> = {
  culpa: "bg-red-100 text-red-800",
  vergüenza: "bg-orange-100 text-orange-800",
  alegría: "bg-green-100 text-green-800",
  tristeza: "bg-blue-100 text-blue-800",
  ansiedad: "bg-purple-100 text-purple-800",
  ira: "bg-red-200 text-red-900",
  miedo: "bg-gray-100 text-gray-800",
  sorpresa: "bg-yellow-100 text-yellow-800",
  default: "bg-slate-100 text-slate-800",
};

export default function NotesCalendar({
  data = [],
  onNoteUpdated,
  onHabdleDelete,
  onHandleEdit,
}: Props) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingNote, setEditingNote] = React.useState(null as any);

  // Calcular el rango de fechas basado en la data
  const dateRange = React.useMemo(() => {
    if (!data || data.length === 0) {
      return { startDate: new Date(), endDate: new Date() };
    }

    const dates = data
      .map((item) => new Date(item.date))
      .sort((a, b) => a.getTime() - b.getTime());
    const startDate = dates[0];
    const endDate = new Date(); // Fecha actual

    return { startDate, endDate };
  }, [data]);

  // Crear un mapa de fechas con notas para fácil acceso
  const notesMap = React.useMemo(() => {
    const map = new Map<string, NoteData[]>();
    data.forEach((note) => {
      // Crear fecha en UTC para evitar problemas de zona horaria
      const noteDate = new Date(note.date);
      const dateKey = noteDate.toISOString().split("T")[0];
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(note);
    });
    return map;
  }, [data]);

  // Inicializar el mes actual con la primera fecha de la data si existe
  React.useEffect(() => {
    if (dateRange.startDate && data.length > 0) {
      setCurrentMonth(dateRange.startDate);
    }
  }, [dateRange.startDate, data.length]);

  // Navegar al mes anterior
  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);

      if (data.length > 0 && newDate < dateRange.startDate) {
        return dateRange.startDate;
      }

      return newDate;
    });
  };

  // Navegar al mes siguiente
  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);

      if (newDate > dateRange.endDate) {
        return dateRange.endDate;
      }

      return newDate;
    });
  };

  // Ir al primer mes con data
  const goToFirstMonth = () => {
    if (data.length > 0) {
      setCurrentMonth(dateRange.startDate);
    }
  };

  // Ir al mes actual
  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  // Verificar si podemos navegar
  const canGoPrevious =
    data.length > 0 ? currentMonth > dateRange.startDate : true;
  const canGoNext = currentMonth < new Date();

  // Formatear el mes y año actual
  const formatCurrentMonth = () => {
    return currentMonth.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });
  };

  // Obtener información del día seleccionado
  const getSelectedDateInfo = () => {
    if (!selectedDate) return null;

    // Asegurar que usamos la misma lógica para la clave de fecha
    const dateKey = selectedDate.toISOString().split("T")[0];
    const notes = notesMap.get(dateKey) || [];

    return {
      date: selectedDate,
      notes: notes,
      hasNotes: notes.length > 0,
    };
  };

  // Obtener todos los sentimientos únicos
  const uniqueSentiments = React.useMemo(() => {
    const sentiments = new Set<string>();
    data.forEach((note) => {
      if (note.sentiment) {
        sentiments.add(note.sentiment.toLowerCase());
      }
    });
    return Array.from(sentiments);
  }, [data]);

  const selectedInfo = getSelectedDateInfo();

  return (
    <div className="w-full min-h-screen  text-white p-4">
      <div className="w-full max-w-[1600px] mx-auto space-y-4">
        {/* Header principal */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-yellow-500" />
            <h1 className="text-2xl font-semibold text-yellow-500">
              Calendario de Notas
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToFirstMonth}
              disabled={!canGoPrevious || data.length === 0}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Primer mes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToCurrentMonth}
              disabled={!canGoNext}
              className="border-gray-600 text-black hover:bg-gray-800"
            >
              Mes actual
            </Button>
          </div>
        </div>

        {/* Información del rango de fechas */}
        {data.length > 0 && (
          <div className="bg-yellow-600/20 p-3 rounded-md border border-yellow-500/30">
            <p className="text-md">
              <strong>Rango de notas:</strong>{" "}
              {dateRange.startDate.toLocaleDateString("es-ES")} -{" "}
              {dateRange.endDate.toLocaleDateString("es-ES")}
            </p>
            <p className="text-md text-gray-300">
              Total de notas: {data.length}
            </p>
          </div>
        )}

        {/* Controles de navegación */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousMonth}
            disabled={!canGoPrevious}
            className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          <h2 className="text-lg font-semibold capitalize text-yellow-500 text-center">
            {formatCurrentMonth()}
          </h2>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextMonth}
            disabled={!canGoNext}
            className="flex items-center gap-2  border-gray-600 text-black hover:bg-gray-800"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Leyenda de sentimientos */}
        {uniqueSentiments.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Heart className="h-4 w-4 text-pink-400" />
            <span className="text-gray-300 mr-2">Sentimientos:</span>
            {uniqueSentiments.map((sentiment) => (
              <div key={sentiment} className="flex items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-full ${
                    sentimentColors[sentiment] || sentimentColors.default
                  }`}
                ></div>
                <span className="text-gray-300 capitalize">{sentiment}</span>
              </div>
            ))}
          </div>
        )}

        {/* Calendar */}
        <div className="w-full overflow-x-auto">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="rounded-md border border-yellow-600 shadow-md bg-neutral-800 text-white shadow-yellow-400/20 w-full max-w-4xl mx-auto"
            captionLayout="dropdown"
            modifiers={{
              hasNotes: (date) => {
                const dateKey = date.toISOString().split("T")[0];
                return notesMap.has(dateKey);
              },
            }}
            modifiersStyles={{
              hasNotes: {
                backgroundColor: "rgb(59 130 246 / 0.3)",
                color: "rgb(147 197 253)",
                fontWeight: "bold",
                border: "1px solid rgb(59 130 246 / 0.5)",
              },
            }}
            disabled={data.length > 0 ? (date) => date > new Date() : undefined}
          />
        </div>

        {/* Información de la fecha seleccionada */}
        {selectedInfo && (
          <div className="bg-neutral-800 p-4 rounded-md border border-yellow-600">
            <p className="text-sm font-medium mb-2 text-yellow-500">
              Notas del día seleccionado:
            </p>
            <div className="space-y-3">
              <p className="text-lg capitalize text-gray-200">
                {selectedInfo.date.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              {selectedInfo.hasNotes ? (
                <div className="space-y-3">
                  {selectedInfo.notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-neutral-800 p-3 rounded-md border border-yellow-600"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-white">{note.title}</h3>
                        <Badge
                          className={`text-xs ${
                            sentimentColors[note.sentiment?.toLowerCase()] ||
                            sentimentColors.default
                          }`}
                        >
                          {note.sentiment}
                        </Badge>
                      </div>
                      <div className="flex gap-1 ">
                        <button
                          onClick={() => onHandleEdit(note)}
                          className="p-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-md transition-colors"
                          title="Editar nota"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              //onClick={() => handleDelete(note.id)}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-md transition-colors"
                              title="Eliminar nota"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-neutral-950 border-2 border-red-600">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-red-500 text-center">
                                Estas complemante segur@??
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-yellow-100 text-center">
                                Esta accion no se puedo devolver. Borraremos la
                                Nota permanentemente de nuestra base de datos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-neutral-800 text-yellow-100 border-yellow-600/30 hover:bg-neutral-700">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 text-black hover:bg-red-600"
                                onClick={() => onHabdleDelete(note.id)}
                              >
                                Borrar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <p className="text-sm text-gray-300 mb-2 line-clamp-3">
                        {note.content}
                      </p>

                      {note.tags && note.tags.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <Tag className="h-3 w-3 text-gray-400" />
                          {note.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs border-gray-500 text-gray-300"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-gray-400 mt-2">
                        Actualizado:{" "}
                        {new Date(note.updated).toLocaleString("es-ES")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  No hay notas para este día
                </p>
              )}
            </div>
          </div>
        )}

        {/* Resumen estadístico */}
        {data.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-900/30 p-3 rounded-md border border-blue-500/30">
              <p className="text-sm text-blue-300 font-medium">Total notas</p>
              <p className="text-lg font-bold text-blue-200">{data.length}</p>
            </div>
            <div className="bg-green-900/30 p-3 rounded-md border border-green-500/30">
              <p className="text-sm text-green-300 font-medium">
                Días con notas
              </p>
              <p className="text-lg font-bold text-green-200">
                {notesMap.size}
              </p>
            </div>
            <div className="bg-purple-900/30 p-3 rounded-md border border-purple-500/30">
              <p className="text-sm text-purple-300 font-medium">Tags únicos</p>
              <p className="text-lg font-bold text-purple-200">
                {new Set(data.flatMap((note) => note.tags || [])).size}
              </p>
            </div>
            <div className="bg-pink-900/30 p-3 rounded-md border border-pink-500/30">
              <p className="text-sm text-pink-300 font-medium">Sentimientos</p>
              <p className="text-lg font-bold text-pink-200">
                {uniqueSentiments.length}
              </p>
            </div>
          </div>
        )}
      </div>
      <EditNoteModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingNote(null);
        }}
        note={editingNote}
        onNoteUpdated={onNoteUpdated}
      />
    </div>
  );
}
