import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ModuleService from "@/services/moduleService";
import { UserDetailContext } from "@/context/UserDetailContext";
import Loading from "@/components/Loading";
import StrategyForm from "./StrategyForm";
import { useNavigate } from "react-router-dom";

const strategySchema = z.object({
  strategyName: z.string().min(1, "Nombre requerido"),
  entryType: z.string().min(1, "Entrada requerida"),
  exitType: z.string().min(1, "Salida requerida"),
});

type StrategyFormType = z.infer<typeof strategySchema>;

interface SimpleStrategyFormProps {
  onlyForm?: boolean;
  onStrategyCreated?: (success: boolean) => void; // Callback opcional con bandera de éxito
  isFromPage?: boolean;
}

const SimpleStrategyForm = ({ onlyForm = false, onStrategyCreated, isFromPage= false }: SimpleStrategyFormProps) => {
  const [open, setOpen] = useState(onlyForm);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 
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
      if (isFromPage) {
       navigate("/strategies", { replace: true });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!onlyForm && (
        <DialogTrigger asChild>
          <div className="px-3 xl:px-4 py-2 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 hover:from-yellow-700 hover:via-yellow-600 hover:to-yellow-500 text-black rounded-lg font-medium transition-all duration-200 text-sm cursor-pointer shadow-lg hover:shadow-yellow-500/25">
            Nueva Estrategia
          </div>
        </DialogTrigger>
      )}

      <DialogContent className="bg-black border-yellow-600 shadow-xl shadow-yellow-600">
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