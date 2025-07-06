import { Check } from "lucide-react";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

interface Propis {
  handleSubmit: any;
  onSubmit: any;
  register: any;
  errors: any;
  setValue: any;
}

const NoteForm = ({
  handleSubmit,
  onSubmit,
  register,
  errors,
  setValue,
}: Propis) => {
  return (
    <div className="flex justify-center w-full items-center">
      <div className="flex flex-col p-4 text-center rounded-md items-center w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="text-yellow-500 text-2xl font-bold mb-4 tex-center">
            Nueva Nota
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Registra tus pensamientos en cualquier momento!
        </DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          {/* Título */}
          <div>
            <label className="block text-neutral-200 text-sm mb-1">
              Título:
            </label>
            <input
              {...register("title")}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
            />
            {errors.title && (
              <p className="text-rose-500 text-xs">{errors.title.message}</p>
            )}
          </div>

          {/* Contenido */}
          <div>
            <label className="block text-neutral-200 text-sm mb-1">
              Contenido:
            </label>
            <textarea
              {...register("content")}
              rows={4}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm resize-none"
            />
            {errors.content && (
              <p className="text-rose-500 text-xs">{errors.content.message}</p>
            )}
          </div>

          {/* Sentimiento */}
          <div>
            <label className="block text-neutral-200 text-sm mb-1">
              Sentimiento:
            </label>
            <select
              {...register("sentiment")}
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
            >
              <option value="">Selecciona un sentimiento</option>
              {[
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
              ].map((emotion) => (
                <option key={emotion} value={emotion}>
                  {emotion}
                </option>
              ))}
            </select>
            {errors.sentiment && (
              <p className="text-rose-500 text-xs">
                {errors.sentiment.message}
              </p>
            )}
          </div>

          {/* Etiquetas */}
          <div>
            <label className="block text-neutral-200 text-sm mb-1">
              Etiquetas (opcional):
            </label>
            <input
              placeholder="Separadas por comas"
              className="w-full p-2 rounded bg-neutral-800 text-neutral-50 border border-neutral-700 text-sm"
              onBlur={(e) => {
                const value = e.target.value;
                const tagsArray = value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag.length > 0);
                setValue("tags", tagsArray, { shouldValidate: true }); // ⬅️ esto transforma el string a array
                e.target.value = tagsArray.join(", ");
              }}
              defaultValue=""
            />
            {errors.tags && (
              <p className="text-rose-500 text-xs">
                {errors.tags.message as string}
              </p>
            )}
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full flex items-center justify-center px-3 xl:px-4 py-2 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 hover:from-yellow-700 hover:via-yellow-600 hover:to-yellow-500 text-black rounded-lg font-medium transition-all duration-200 text-sm cursor-pointer shadow-lg hover:shadow-yellow-500/25"
          >
            <Check size={18} className="mr-1" />
            Guardar Nota
          </button>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;
