import CreateNote from "@/components/notes/CreateNote";
import { useContext, useEffect, useState } from "react";
import ModuleService from "@/services/moduleService";
import { UserDetailContext } from "@/context/UserDetailContext";
import Loading from "@/components/Loading";
import {
  Calendar,
  Tag,
  Heart,
  Edit3,
  Clock,
  Trash2,
  Edit,
  PlusCircle,
  FileText,
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
} from "@/components/ui/alert-dialog";
import EditNoteModal from "@/components/notes/EditNote";

const Notes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState(null as any);
  const [hasChange, setHasChange] = useState(0);
  const [editingNote, setEditingNote] = useState(null as any);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const context = useContext(UserDetailContext);
  if (!context) {
    throw new Error(
      "UserDetailContext debe usarse dentro de un UserDetailProvider"
    );
  }
  const { userDetail } = context;
  useEffect(() => {
    const inital = async () => {
      try {
        const notes = await ModuleService.notes.byUser(userDetail?.id);
        const sorted = notes.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setNotes(sorted);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    inital();
  }, [hasChange, userDetail?.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSentimentColor = (sentiment: string) => {
    const colors: any = {
      "Desapego emocional": "bg-slate-500",
      Esperanza: "bg-green-500",
      Miedo: "bg-red-500",
      Codicia: "bg-purple-500",
    };
    return colors[sentiment] || "bg-gray-500";
  };

  const handleNoteCreated = (success: boolean) => {
    if (success) {
      setHasChange(hasChange + 1);
    }
  };

  const onHabdleDelete = async (id: string) => {
    try {
      await ModuleService.notes.delete(id);
      const newNotes = notes.filter((note: any) => note.id !== id);
      setNotes(newNotes);
    } catch (error) {
      console.log(error);
    }
  };

  const onHandleEdit = (trade: any) => {
    setEditingNote(trade);
    setIsEditModalOpen(true);
  };

  const onNoteUpdated = (updatedNote: any) => {
    const updatedNotes = notes.map((note: any) =>
      note.id === updatedNote.id ? updatedNote : note
    );
    setNotes(updatedNotes);
    setIsEditModalOpen(false);
    setEditingNote(null);
    setHasChange(hasChange + 1);
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-neutral-900">
        <Loading text="Obteniendo tus notas..." />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">N</span>
            </div>
            <h1 className="text-2xl font-bold text-yellow-500">
              NOTAS Tracker
            </h1>
          </div>
          <p className="text-gray-400">Gestiona tus notas y pensamientos</p>
        </div>

        {/* Stats Cards - Solo mostrar si hay notas */}
        {notes && notes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Edit3 className="w-5 h-5 text-yellow-500" />
                <span className="text-yellow-500 font-medium">Total Notas</span>
              </div>
              <p className="text-2xl font-bold text-white">{notes.length}</p>
            </div>
            <div className="bg-gray-900 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-yellow-500" />
                <span className="text-yellow-500 font-medium">
                  Sentimientos
                </span>
              </div>
              <p className="text-2xl font-bold text-white">
                {new Set(notes.map((n: any) => n.sentiment)).size}
              </p>
            </div>
            <div className="bg-gray-900 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-5 h-5 text-yellow-500" />
                <span className="text-yellow-500 font-medium">Tags</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {notes.flatMap((n: any) => n.tags).length}
              </p>
            </div>
            <div className="bg-gray-900 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-yellow-500" />
                <span className="text-yellow-500 font-medium">Recientes</span>
              </div>
              <p className="text-2xl font-bold text-white">2</p>
            </div>
          </div>
        )}

        {/* Empty State - Mostrar cuando no hay notas */}
        {notes && notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-gray-900 border border-yellow-500/20 rounded-lg p-8 max-w-md text-center">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-yellow-500" />
              </div>
              <h2 className="text-xl font-semibold text-yellow-500 mb-2">
                ¡Aún no tienes notas!
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Comienza a capturar tus pensamientos, ideas y sentimientos. Cada
                nota es una oportunidad para reflexionar y crecer.
              </p>
              <div className="flex items-center justify-center gap-2 text-yellow-500 font-medium">
                <PlusCircle className="w-5 h-5" />
                <span>Crea tu primera nota</span>
              </div>
            </div>
          </div>
        )}

        {/* Notes Grid - Solo mostrar si hay notas */}
        {notes && notes.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {notes.map((note: any) => (
              <div
                key={note.id}
                className="bg-gray-900 border border-yellow-500/20 rounded-lg p-6 hover:border-yellow-500/40 transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-yellow-500 group-hover:text-yellow-400 transition-colors flex-1 mr-4">
                    {note.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getSentimentColor(
                        note.sentiment
                      )}`}
                    >
                      {note.sentiment}
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
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {note.content}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {note.tags.map((tag: any, index: any) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-md text-xs font-medium border border-yellow-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(note.date)}</span>
                  </div>
                  {note.update && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Editado: {formatDate(note.update)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Note Button */}
        <CreateNote onNoteCreated={handleNoteCreated} />
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
    </>
  );
};

export default Notes;
