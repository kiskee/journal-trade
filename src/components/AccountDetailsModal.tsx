import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Calendar, DollarSign, Edit2, Save, Star, TrendingUp, Trash2, Wallet, X } from "lucide-react";
import { useState } from "react";

interface Account {
  id: string;
  name: string;
  initialBalance: number;
  currentBalance: number;
  currency: string;
  isprimary: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface AccountDetailsModalProps {
  account: Account | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateAccount?: (accountId: string, newName: string) => void;
  onDeleteAccount?: (accountId: string) => void;
}

export function AccountDetailsModal({ account, isOpen, onClose, onUpdateAccount, onDeleteAccount }: AccountDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");

  if (!account) return null;

  const change = account.currentBalance - account.initialBalance;
  const percentage = ((change / account.initialBalance) * 100).toFixed(2);
  const isPositive = change >= 0;

  const handleEditClick = () => {
    setEditedName(account.name);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedName.trim() && onUpdateAccount) {
      onUpdateAccount(account.id, editedName.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName("");
  };

  const handleDelete = () => {
    if (onDeleteAccount) {
      onDeleteAccount(account.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-yellow-400">
            <Wallet className="w-6 h-6" />
            Detalles de la cuenta
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Nombre y estado */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              {isEditing ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Nombre de la cuenta"
                  />
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    className="border-zinc-700 hover:bg-zinc-800"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold">{account.name}</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleEditClick}
                    className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
            {account.isprimary && (
              <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20 w-fit">
                <Star className="w-3 h-3 mr-1 fill-yellow-400" />
                Principal
              </Badge>
            )}
          </div>

          <Separator className="bg-zinc-800" />

          {/* Balance actual */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-400">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Balance actual</span>
            </div>
            <p className="text-3xl font-bold">
              ${account.currentBalance.toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </p>
            <p className="text-sm text-zinc-500">{account.currency}</p>
          </div>

          {/* Balance inicial */}
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Balance inicial</p>
            <p className="text-lg font-semibold">
              ${account.initialBalance.toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </p>
          </div>

          {/* Cambio y porcentaje */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Rendimiento</span>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-lg font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}${change.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </span>
              <Badge 
                variant="outline" 
                className={`${isPositive ? 'border-green-400/20 text-green-400' : 'border-red-400/20 text-red-400'}`}
              >
                {isPositive ? '+' : ''}{percentage}%
              </Badge>
            </div>
          </div>

          <Separator className="bg-zinc-800" />

          {/* Fechas */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Información temporal</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-zinc-500">Creada</p>
                <p className="text-sm">{formatDate(account.createdAt)}</p>
              </div>
              
              <div>
                <p className="text-xs text-zinc-500">Última actualización</p>
                <p className="text-sm">{formatDate(account.updatedAt)}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-zinc-800" />

          {/* Botón de eliminar */}
          <div className="pt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={account.isprimary}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {account.isprimary ? "No se puede eliminar cuenta principal" : "Eliminar cuenta"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-neutral-950 border-2 border-red-600">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-500 text-center">
                    ¿Estás completamente segur@?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-yellow-100 text-center">
                    Esta acción no se puede devolver. Borraremos la cuenta y los TRADES relacionados con ella
                    permanentemente de nuestra base de datos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-neutral-800 text-yellow-100 border-yellow-600/30 hover:bg-neutral-700">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 text-black hover:bg-red-600"
                    onClick={handleDelete}
                  >
                    Borrar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}