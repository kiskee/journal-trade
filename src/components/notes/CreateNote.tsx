import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { useContext, useState } from "react";
import Loading from "../utils/Loading";
import { UserDetailContext } from "@/context/UserDetailContext";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import NoteForm from "./NoteForm";
import ModuleService from "@/services/moduleService";

const notesSchema = z.object({
  title: z
    .string({
      required_error: "El título es un campo obligatorio.",
      invalid_type_error: "El título debe ser texto.",
    })
    .min(3, { message: "El título debe tener al menos 3 caracteres." })
    .max(100, { message: "El título no debe exceder los 100 caracteres." }),

  content: z
    .string({
      required_error: "El contenido es un campo obligatorio.",
      invalid_type_error: "El contenido debe ser texto.",
    })
    .min(10, { message: "El contenido debe tener al menos 10 caracteres." }),

  sentiment: z
    .string({
      required_error: "El sentimiento es un campo obligatorio.",
      invalid_type_error: "El sentimiento debe ser una cadena.",
    })
    .refine(
      (val) =>
        [
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
        ].includes(val),
      {
        message: "El sentimiento seleccionado no es válido.",
      }
    ),

  tags: z
    .array(
      z.string().max(25, {
        message: "Cada etiqueta no debe exceder los 25 caracteres.",
      })
    )
    .optional(),
});

type NoteFormType = z.infer<typeof notesSchema>;

interface NoteResponse {
  content: string;
  sentiment: string;
  tags: string[];
  title: string;
  date: string
  user: string
}

interface CreateNoteProps {
  onNoteCreated?: (success: boolean) => void; // El "?" lo hace opcional
}

const CreateNote = ({ onNoteCreated }: CreateNoteProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(UserDetailContext);
  if (!context) {
    throw new Error(
      "UserDetailContext debe usarse dentro de un UserDetailProvider"
    );
  }
  const { userDetail } = context;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<NoteFormType>({
    resolver: zodResolver(notesSchema),
    defaultValues: {
      title: "",
      content: "",
      sentiment: "", // Puedes cambiar este a uno que tenga más sentido por defecto
      tags: [],
    },
  });

  const onSubmit = async (data: NoteResponse) => {
    try {
      setIsLoading(true);
      data.user = userDetail?.id;
      data.date = new Date().toISOString();
      
      await ModuleService.notes.create(data);
      
      // Notificar éxito
      if (onNoteCreated) {
        onNoteCreated(true);
      }
      
      setOpen(false);
      reset();
    } catch (error) {
      console.log(error);
      
      // Notificar error
      if (onNoteCreated) {
        onNoteCreated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="fixed bottom-6 right-6 z-50">
          <Button className="flex flex-col items-center justify-center gap-1 w-18 h-18 rounded-full shadow-lg text-xs hover:w-25 hover:h-25 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-black duration-200 ease-in">
            <Plus className="h-15 w-15  hover:w-20 hover:h-20" />
            <span className="text-center leading-tight">
              Crear
              <br />
              Nota
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-black border-yellow-600 shadow-xl shadow-yellow-600">
          {isLoading ? (
            <Loading text="Guardando Nota" />
          ) : (
            <NoteForm
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              register={register}
              errors={errors}
              setValue={setValue}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateNote;
