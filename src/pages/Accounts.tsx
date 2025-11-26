import { BreadcrumbCf } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";
import ModuleService from "@/services/moduleService";
import { Eye, EyeOff, Loader2, Plus, Star, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

interface ShowBalances {
  [key: string]: boolean;
}

export default function Acccounts() {
  const navigate = useNavigate();
  const [showBalances, setShowBalances] = useState<ShowBalances>({});
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAccounts = async (): Promise<void> => {
      try {
        setLoading(true);
        const accountFetch: any = await ModuleService.accounts.byUser();
        setAccounts(accountFetch.data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const toggleBalance = (id: string): void => {
    setShowBalances(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffDays === 1) {
      return 'Hace 1 día';
    } else {
      return `Hace ${diffDays} días`;
    }
  };

  const calculateChange = (current: number, initial: number): { change: number; percentage: string } => {
    const change = current - initial;
    const percentage = ((change / initial) * 100).toFixed(2);
    return { change, percentage };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
          <p className="text-zinc-400">Cargando cuentas...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <SidebarInset className="text-yellow-500">
       <BreadcrumbCf firstPage="Cuentas" secondPage="Listado" />
      <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-400 mb-8">Gestión de cuentas</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Botón de crear cuenta */}
          <div className="lg:col-span-1">
            <Card 
              className={`bg-zinc-900 border-zinc-800 h-full flex items-center justify-center transition-colors ${
                accounts.length >= 2 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:border-yellow-400 cursor-pointer group'
              }`}
              onClick={() => accounts.length < 2 && navigate('/create-account')}
            >
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className={`w-20 h-20 rounded-full bg-yellow-400/10 flex items-center justify-center mb-4 transition-colors ${
                  accounts.length < 2 ? 'group-hover:bg-yellow-400/20' : ''
                }`}>
                  <Plus className="w-10 h-10 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">Nueva Cuenta</h3>
                <p className="text-zinc-400 text-center text-sm">
                  {accounts.length >= 2 
                    ? 'Máximo 2 cuentas permitidas'
                    : 'Crea una nueva cuenta para organizar tus finanzas'
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Cards de cuentas */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {accounts.map((account) => {
              const isVisible = showBalances[account.id] !== false;
              const { change, percentage } = calculateChange(account.currentBalance, account.initialBalance);
              const isPositive = change >= 0;

              return (
                <Card key={account.id} className="bg-zinc-900 border-zinc-800 hover:border-yellow-400/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                          <Wallet className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-white text-lg">{account.name}</CardTitle>
                            {account.isprimary && (
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            )}
                          </div>
                          <p className="text-zinc-500 text-sm">Balance inicial: ${account.initialBalance.toLocaleString()}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleBalance(account.id)}
                        className="text-zinc-400 hover:text-yellow-400 transition-colors"
                      >
                        {isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-zinc-400 text-sm mb-1">Balance actual</p>
                        <p className="text-3xl font-bold text-white">
                          {isVisible 
                            ? `$${account.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                            : '••••••'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <p className="text-zinc-500 text-xs">{account.currency}</p>
                          {isVisible && (
                            <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                              {isPositive ? '+' : ''}{change.toLocaleString()} ({isPositive ? '+' : ''}{percentage}%)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                          <TrendingUp className="w-4 h-4" />
                          <span>{formatDate(account.updatedAt)}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
                        >
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </SidebarInset>
    </>
  );
}
