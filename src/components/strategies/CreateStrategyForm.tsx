import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ModuleService from "@/services/moduleService";
import { UserDetailContext } from "@/context/UserDetailContext";
import Loading from "@/components/Loading";
import StrategyForm from "./strategyForm";

const strategySchema = z.object({
  strategyName: z.string().min(1, "Nombre requerido"),
  entryType: z.string().min(1, "Entrada requerida"),
  exitType: z.string().min(1, "Salida requerida"),
});

type StrategyFormType = z.infer<typeof strategySchema>;

interface SimpleStrategyFormProps {
  onlyForm?: boolean;
  onStrategyCreated?: (success: boolean) => void; // Callback opcional con bandera de éxito
}

const SimpleStrategyForm = ({ onlyForm = false, onStrategyCreated }: SimpleStrategyFormProps) => {
  const [open, setOpen] = useState(onlyForm);
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
    formState: { errors },
    reset,
  } = useForm<StrategyFormType>({
    resolver: zodResolver(strategySchema),
    defaultValues: {
      strategyName: "",
      entryType: "",
      exitType: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      data.user = userDetail?.id;
      data.date = new Date().toISOString();
      
      await ModuleService.strategies.create(data);
      
      // Notificar éxito si hay callback
      if (onStrategyCreated) {
        onStrategyCreated(true);
      }
      
    } catch (error) {
      console.log(error);
      
      // Notificar error si hay callback
      if (onStrategyCreated) {
        onStrategyCreated(false);
      }
      
    } finally {
      setIsLoading(false);
      setOpen(false);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!onlyForm && (
        <DialogTrigger asChild>
          <div className="bg-gradient-to-r from-neutral-600 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-black px-6 py-3 rounded-lg text-lg font-semibold text-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block">
            Crea tu Primera estrategia
          </div>
        </DialogTrigger>
      )}

      <DialogContent className="bg-black">
        {isLoading ? (
          <Loading text="Guardando Estrategia" />
        ) : (
          <StrategyForm
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            register={register}
            errors={errors}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SimpleStrategyForm;