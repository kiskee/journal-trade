import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface RelateAccountDialogProps {
  accounts: { id: string; name: string }[];
  trade: any;
  onRelate: (accountId: string, trade: any) => Promise<void> | void;
}

export default function RelateAccountDialog({
  accounts,
  trade,
  onRelate,
}: RelateAccountDialogProps) {
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;

    setLoading(true);
    try {
      await onRelate(selectedAccount, trade);
      setSelectedAccount(""); // Resetear selección
      setOpen(false);
      setShow(false);
    } catch (error) {
      console.error("Error al relacionar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {show && (
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-yellow-600 m-2">
            Relacionar con cuenta
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Relacionar cuenta</DialogTitle>
            <DialogDescription>
              Selecciona una cuenta para asociar este trade.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Select
              onValueChange={(value) => setSelectedAccount(value)}
              value={selectedAccount}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una cuenta" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
