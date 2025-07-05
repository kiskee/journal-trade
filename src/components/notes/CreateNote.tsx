import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {  useState } from "react";
//import { UserDetailContext } from "@/context/UserDetailContext";

const CreateNote = () => {
  const [open, setOpen] = useState(false);
  //const [isLoading, setIsLoading] = useState(false);
//   const context = useContext(UserDetailContext);
//   if (!context) {
//     throw new Error(
//       "UserDetailContext debe usarse dentro de un UserDetailProvider"
//     );
//   }
//   const { userDetail } = context;
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="fixed bottom-6 right-6 z-50">
          <Button className="flex flex-col items-center justify-center gap-1 w-20 h-20 rounded-full shadow-lg text-xs hover:w-30 hover:h-30 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-black">
            <Plus className="h-15 w-15  hover:w-20 hover:h-20" />
            <span className="text-center leading-tight">
              Crear
              <br />
              Nota
            </span>
          </Button> 
        </DialogTrigger>
        <DialogContent className="bg-black border-yellow-600 shadow-xl shadow-yellow-600">
            
        </DialogContent>
      </Dialog>
      
    </>
  );
};

export default CreateNote;
