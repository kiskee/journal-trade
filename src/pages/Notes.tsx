import CreateNote from "@/components/notes/CreateNote";
import { useContext, useEffect, useState } from "react";
import ModuleService from "@/services/moduleService";
import { UserDetailContext } from "@/context/UserDetailContext";
import Loading from "@/components/Loading";
import { PlusCircle, FileText } from "lucide-react";

import EditNoteModal from "@/components/notes/EditNote";
import NotesCalendar from "@/components/notes/NewNotes";

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
        console.log(sorted);
        setNotes(sorted);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    inital();
  }, [hasChange, userDetail?.id]);

  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString("es-ES", {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // };

  // const getSentimentColor = (sentiment: string) => {
  //   const colors: any = {
  //     "Desapego emocional": "bg-slate-500",
  //     Esperanza: "bg-green-500",
  //     Miedo: "bg-red-500",
  //     Codicia: "bg-purple-500",
  //   };
  //   return colors[sentiment] || "bg-gray-500";
  // };

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

        <NotesCalendar
          data={notes}
          onNoteUpdated={onNoteUpdated}
          onHabdleDelete={onHabdleDelete}
          onHandleEdit={onHandleEdit}
        />

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
