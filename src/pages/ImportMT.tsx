import { BreadcrumbCf } from '@/components/Breadcrumb';
import { SidebarInset } from '@/components/ui/sidebar';
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, BarChart, Bar } from 'recharts';
import Loading from '@/components/utils/Loading';
import { useAnalysisManager } from '@/components/analysis/AnalysisManager';
import { UpdateReportTab } from '@/components/analysis/UpdateReportTab';

interface Trade {
    date: string;
    ticket: string;
    instrument: string;
    type: string;
    action: string;
    volume: number;
    price: number;
    profit: number;
    balance: number;
    comment?: string;
}

interface TradeMetrics {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    totalProfit: number;
    totalLoss: number;
    netProfit: number;
    finalBalance: number;
    initialBalance: number;
    instruments: { [key: string]: { trades: number; profit: number } };
    largestWin: number;
    largestLoss: number;
    avgWin: number;
    avgLoss: number;
    profitFactor: number;
    maxDrawdown: number;
    trades: Trade[];
    balanceHistory: { date: string; balance: number }[];
    monthlyStats: { month: string; profit: number; trades: number }[];
    dailyStats: { day: string; profit: number; trades: number }[];
}

export const ImportMT = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [metrics, setMetrics] = useState<TradeMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { saveAnalysis, loadLatestAnalysis, hasExistingAnalysis, isLoading: analysisLoading } = useAnalysisManager();

    useEffect(() => {
        const loadExistingReport = async () => {
            if (hasExistingAnalysis && !metrics) {
                const analysisData = await loadLatestAnalysis();
                if (analysisData) {
                    setMetrics(analysisData);
                }
            }
        };
        if (!analysisLoading) {
            loadExistingReport();
        }
    }, [hasExistingAnalysis, analysisLoading, metrics]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const analyzeData = (data: any[]): TradeMetrics => {
        const closedTrades = data.filter(trade => trade.__EMPTY_3 === 'out' && trade.__EMPTY_10 !== undefined);
        
        const trades: Trade[] = closedTrades.map(trade => ({
            date: trade['Trade History Report'] || '',
            ticket: trade.__EMPTY || '',
            instrument: trade.__EMPTY_1 || '',
            type: trade.__EMPTY_2 || '',
            action: trade.__EMPTY_3 || '',
            volume: parseFloat(trade.__EMPTY_4) || 0,
            price: parseFloat(trade.__EMPTY_5) || 0,
            profit: parseFloat(trade.__EMPTY_10) || 0,
            balance: parseFloat(trade.__EMPTY_11) || 0,
            comment: trade.__EMPTY_12 || ''
        }));
        
        const profits = trades.map(trade => trade.profit);
        const winningTrades = profits.filter(p => p > 0);
        const losingTrades = profits.filter(p => p < 0);
        
        const instruments: { [key: string]: { trades: number; profit: number } } = {};
        trades.forEach(trade => {
            if (trade.instrument) {
                if (!instruments[trade.instrument]) {
                    instruments[trade.instrument] = { trades: 0, profit: 0 };
                }
                instruments[trade.instrument].trades += 1;
                instruments[trade.instrument].profit += trade.profit;
            }
        });
        
        const balanceHistory = data.map(trade => ({
            date: trade['Trade History Report'] || '',
            balance: parseFloat(trade.__EMPTY_11) || 0
        })).filter(item => item.balance > 0);
        
        const monthlyStats: { [key: string]: { profit: number; trades: number } } = {};
        const dailyStats: { [key: string]: { profit: number; trades: number } } = {};
        
        trades.forEach(trade => {
            const date = new Date(trade.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const dayKey = trade.date.split(' ')[0];
            
            if (!monthlyStats[monthKey]) monthlyStats[monthKey] = { profit: 0, trades: 0 };
            if (!dailyStats[dayKey]) dailyStats[dayKey] = { profit: 0, trades: 0 };
            
            monthlyStats[monthKey].profit += trade.profit;
            monthlyStats[monthKey].trades += 1;
            dailyStats[dayKey].profit += trade.profit;
            dailyStats[dayKey].trades += 1;
        });
        
        const initialBalance = balanceHistory.length > 0 ? balanceHistory[0].balance - profits.reduce((sum, p) => sum + p, 0) : 0;
        const finalBalance = balanceHistory.length > 0 ? balanceHistory[balanceHistory.length - 1].balance : 0;
        
        let maxDrawdown = 0;
        let peak = initialBalance;
        balanceHistory.forEach(item => {
            if (item.balance > peak) peak = item.balance;
            const drawdown = ((peak - item.balance) / peak) * 100;
            if (drawdown > maxDrawdown) maxDrawdown = drawdown;
        });
        
        const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, p) => sum + p, 0) / winningTrades.length : 0;
        const avgLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, p) => sum + p, 0)) / losingTrades.length : 0;
        const profitFactor = avgLoss > 0 ? (winningTrades.reduce((sum, p) => sum + p, 0) / Math.abs(losingTrades.reduce((sum, p) => sum + p, 0))) : 0;
        
        return {
            totalTrades: trades.length,
            winningTrades: winningTrades.length,
            losingTrades: losingTrades.length,
            winRate: trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0,
            totalProfit: winningTrades.reduce((sum, p) => sum + p, 0),
            totalLoss: Math.abs(losingTrades.reduce((sum, p) => sum + p, 0)),
            netProfit: profits.reduce((sum, p) => sum + p, 0),
            finalBalance,
            initialBalance,
            instruments,
            largestWin: Math.max(...profits, 0),
            largestLoss: Math.abs(Math.min(...profits, 0)),
            avgWin,
            avgLoss,
            profitFactor,
            maxDrawdown,
            trades,
            balanceHistory: balanceHistory.slice(0, 50),
            monthlyStats: Object.entries(monthlyStats).map(([month, stats]) => ({ month, ...stats })),
            dailyStats: Object.entries(dailyStats).slice(-30).map(([day, stats]) => ({ day, ...stats }))
        };
    };

    const handleUpload = () => {
        if (selectedFile) {
            setIsLoading(true);
            const reader = new FileReader();
            reader.onload = async (e) => {
                setTimeout(async () => {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);
                    const analyzedMetrics = analyzeData(jsonData);
                    setMetrics(analyzedMetrics);
                    
                    // Save analysis to backend
                    await saveAnalysis(
                        selectedFile.name,
                        selectedFile.size,
                        analyzedMetrics
                    );
                    
                    setIsLoading(false);
                }, 1500);
            };
            reader.readAsArrayBuffer(selectedFile);
        }
    };

    return (
        <SidebarInset>
            <BreadcrumbCf firstPage="Trades" secondPage="Importar desde MT" />
            <div className="min-h-screen bg-black p-6">
                {(isLoading || analysisLoading) ? (
                    <div className="flex items-center justify-center min-h-[80vh]">
                        <Loading text="Procesando archivo..." />
                    </div>
                ) : !metrics ? (
                    <div className="flex items-center justify-center min-h-[80vh]">
                        <div className="max-w-md w-full">
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-bold text-white mb-4">
                                    Análisis de Trading <span className="text-yellow-500">MT</span>
                                </h1>
                                <p className="text-white leading-relaxed">
                                    Sube tu archivo Excel (.xlsx) con los datos de trading de MetaTrader para obtener un análisis completo y profesional.
                                </p>
                            </div>
                            
                            <Card className="bg-gray-900 border-yellow-500">
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-yellow-500">
                                            Seleccionar archivo Excel
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept=".xlsx"
                                                onChange={handleFileChange}
                                                className="block w-full text-sm text-white bg-black border border-yellow-500 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-medium file:bg-yellow-500 file:text-black hover:file:bg-yellow-400 transition-all"
                                            />
                                        </div>
                                        
                                        {selectedFile && (
                                            <div className="mt-4 p-4 bg-black rounded-lg border border-yellow-500">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                                                        <p className="text-xs text-white">
                                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <button
                                            onClick={handleUpload}
                                            disabled={!selectedFile}
                                            className="w-full py-3 px-4 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                                        >
                                            {selectedFile ? 'Procesar Archivo' : 'Selecciona un archivo'}
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Análisis Completo de <span className="text-yellow-500">Trading</span>
                            </h1>
                            <p className="text-white">Resultados del análisis de tu historial de MetaTrader</p>
                        </div>
                        
                        <Tabs defaultValue="overview" className="w-full">
                            <div className="w-full bg-gray-900 border border-yellow-500 p-1 rounded-lg overflow-x-auto">
                                <TabsList className="flex sm:grid sm:grid-cols-6 sm:w-full w-max bg-transparent">
                                    <TabsTrigger value="overview" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black data-[state=inactive]:text-white font-medium transition-all whitespace-nowrap px-3 py-2 text-xs sm:px-4 sm:text-sm min-w-[60px] sm:min-w-0">Resumen</TabsTrigger>
                                    <TabsTrigger value="charts" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black data-[state=inactive]:text-white font-medium transition-all whitespace-nowrap px-3 py-2 text-xs sm:px-4 sm:text-sm min-w-[60px] sm:min-w-0">Gráficos</TabsTrigger>
                                    <TabsTrigger value="trades" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black data-[state=inactive]:text-white font-medium transition-all whitespace-nowrap px-3 py-2 text-xs sm:px-4 sm:text-sm min-w-[50px] sm:min-w-0">Trades</TabsTrigger>
                                    <TabsTrigger value="instruments" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black data-[state=inactive]:text-white font-medium transition-all whitespace-nowrap px-3 py-2 text-xs sm:px-4 sm:text-sm min-w-[80px] sm:min-w-0">Instrumentos</TabsTrigger>
                                    <TabsTrigger value="risk" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black data-[state=inactive]:text-white font-medium transition-all whitespace-nowrap px-3 py-2 text-xs sm:px-4 sm:text-sm min-w-[50px] sm:min-w-0">Riesgo</TabsTrigger>
                                    <TabsTrigger value="update" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black data-[state=inactive]:text-white font-medium transition-all whitespace-nowrap px-3 py-2 text-xs sm:px-4 sm:text-sm min-w-[70px] sm:min-w-0">Actualizar</TabsTrigger>
                                </TabsList>
                            </div>
                            
                            <TabsContent value="overview" className="space-y-6 mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Card className="bg-gray-900 border-yellow-500 hover:bg-gray-800 transition-all">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-yellow-500 text-sm font-medium">Total Trades</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-white">{metrics.totalTrades}</div>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card className="bg-gray-900 border-yellow-500 hover:bg-gray-800 transition-all">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-yellow-500 text-sm font-medium">Win Rate</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-white">{metrics.winRate.toFixed(1)}%</div>
                                            <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-yellow-500 transition-all duration-300" 
                                                    style={{ width: `${metrics.winRate}%` }}
                                                ></div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card className="bg-gray-900 border-yellow-500 hover:bg-gray-800 transition-all">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-yellow-500 text-sm font-medium">Balance Final</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-white">${metrics.finalBalance.toFixed(2)}</div>
                                            <div className="text-sm text-white">Inicial: ${metrics.initialBalance.toFixed(2)}</div>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card className="bg-gray-900 border-yellow-500 hover:bg-gray-800 transition-all">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-yellow-500 text-sm font-medium">Ganancia Neta</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-white">
                                                ${metrics.netProfit.toFixed(2)}
                                            </div>
                                            <div className="text-sm text-white">
                                                {((metrics.netProfit / metrics.initialBalance) * 100).toFixed(1)}% ROI
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Card className="bg-gray-900 border-yellow-500">
                                        <CardHeader>
                                            <CardTitle className="text-yellow-500 font-semibold">Estadísticas de Trades</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-white">Ganadores:</span>
                                                <span className="text-yellow-500 font-semibold">{metrics.winningTrades}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-white">Perdedores:</span>
                                                <span className="text-white font-semibold">{metrics.losingTrades}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-white">Ganancia Promedio:</span>
                                                <span className="text-white font-semibold">${metrics.avgWin.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-white">Pérdida Promedio:</span>
                                                <span className="text-white font-semibold">${metrics.avgLoss.toFixed(2)}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card className="bg-gray-900 border-yellow-500">
                                        <CardHeader>
                                            <CardTitle className="text-yellow-500 font-semibold">Métricas de Rendimiento</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-white">Profit Factor:</span>
                                                <span className="text-yellow-500 font-semibold">{metrics.profitFactor.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-white">Mayor Ganancia:</span>
                                                <span className="text-white font-semibold">${metrics.largestWin.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-white">Mayor Pérdida:</span>
                                                <span className="text-white font-semibold">${metrics.largestLoss.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-white">Max Drawdown:</span>
                                                <span className="text-white font-semibold">{metrics.maxDrawdown.toFixed(2)}%</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card className="bg-gray-900 border-yellow-500">
                                        <CardHeader>
                                            <CardTitle className="text-yellow-500 font-semibold">Distribución Win/Loss</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ResponsiveContainer width="100%" height={150}>
                                                <PieChart>
                                                    <Pie
                                                        data={[
                                                            { name: 'Ganadores', value: metrics.winningTrades, fill: '#eab308' },
                                                            { name: 'Perdedores', value: metrics.losingTrades, fill: '#ffffff' }
                                                        ]}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={30}
                                                        outerRadius={60}
                                                        dataKey="value"
                                                    />
                                                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #eab308', borderRadius: '8px', color: '#ffffff' }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                            
                            <TabsContent value="charts" className="space-y-6 mt-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card className="bg-gray-900 border-yellow-500">
                                        <CardHeader>
                                            <CardTitle className="text-yellow-500 font-semibold">Evolución del Balance</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <LineChart data={metrics.balanceHistory}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                    <XAxis dataKey="date" stroke="#ffffff" fontSize={12} />
                                                    <YAxis stroke="#ffffff" fontSize={12} />
                                                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #eab308', borderRadius: '8px', color: '#ffffff' }} />
                                                    <Line type="monotone" dataKey="balance" stroke="#eab308" strokeWidth={2} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card className="bg-gray-900 border-yellow-500">
                                        <CardHeader>
                                            <CardTitle className="text-yellow-500 font-semibold">Ganancias por Mes</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={metrics.monthlyStats}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                    <XAxis dataKey="month" stroke="#ffffff" fontSize={12} />
                                                    <YAxis stroke="#ffffff" fontSize={12} />
                                                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #eab308', borderRadius: '8px', color: '#ffffff' }} />
                                                    <Bar dataKey="profit" fill="#eab308" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                </div>
                                
                                <Card className="bg-gray-900 border-yellow-500">
                                    <CardHeader>
                                        <CardTitle className="text-yellow-500 font-semibold">Rendimiento Diario (Últimos 30 días)</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={metrics.dailyStats}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                <XAxis dataKey="day" stroke="#ffffff" fontSize={10} angle={-45} textAnchor="end" />
                                                <YAxis stroke="#ffffff" fontSize={12} />
                                                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #eab308', borderRadius: '8px', color: '#ffffff' }} />
                                                <Bar dataKey="profit" fill="#eab308" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            
                            <TabsContent value="trades" className="mt-6">
                                <Card className="bg-gray-900 border-yellow-500">
                                    <CardHeader>
                                        <CardTitle className="text-yellow-500 font-semibold">Historial de Trades</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="max-h-96 overflow-y-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="border-yellow-500">
                                                        <TableHead className="text-yellow-500 font-medium">Fecha</TableHead>
                                                        <TableHead className="text-yellow-500 font-medium">Instrumento</TableHead>
                                                        <TableHead className="text-yellow-500 font-medium">Tipo</TableHead>
                                                        <TableHead className="text-yellow-500 font-medium">Volumen</TableHead>
                                                        <TableHead className="text-yellow-500 font-medium">Precio</TableHead>
                                                        <TableHead className="text-yellow-500 font-medium">P&L</TableHead>
                                                        <TableHead className="text-yellow-500 font-medium">Balance</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {metrics.trades.reverse().map((trade, index) => (
                                                        <TableRow key={index} className="border-yellow-500 hover:bg-gray-800">
                                                            <TableCell className="text-white text-xs">{trade.date}</TableCell>
                                                            <TableCell className="text-white font-medium">{trade.instrument}</TableCell>
                                                            <TableCell className="text-white">{trade.type}</TableCell>
                                                            <TableCell className="text-white">{trade.volume}</TableCell>
                                                            <TableCell className="text-white">{trade.price}</TableCell>
                                                            <TableCell className={trade.profit >= 0 ? 'text-yellow-500 font-semibold' : 'text-white'}>
                                                                ${trade.profit.toFixed(2)}
                                                            </TableCell>
                                                            <TableCell className="text-white">${trade.balance.toFixed(2)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            
                            <TabsContent value="instruments" className="mt-6">
                                <Card className="bg-gray-900 border-yellow-500">
                                    <CardHeader>
                                        <CardTitle className="text-yellow-500 font-semibold">Análisis por Instrumento</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-yellow-500">
                                                    <TableHead className="text-yellow-500 font-medium">Instrumento</TableHead>
                                                    <TableHead className="text-yellow-500 font-medium">Trades</TableHead>
                                                    <TableHead className="text-yellow-500 font-medium">Ganancia Total</TableHead>
                                                    <TableHead className="text-yellow-500 font-medium">Ganancia Promedio</TableHead>
                                                    <TableHead className="text-yellow-500 font-medium">% del Total</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {Object.entries(metrics.instruments).map(([instrument, data]) => (
                                                    <TableRow key={instrument} className="border-yellow-500 hover:bg-gray-800">
                                                        <TableCell className="text-white font-medium">{instrument}</TableCell>
                                                        <TableCell className="text-white">{data.trades}</TableCell>
                                                        <TableCell className="text-white">
                                                            ${data.profit.toFixed(2)}
                                                        </TableCell>
                                                        <TableCell className="text-white">
                                                            ${(data.profit / data.trades).toFixed(2)}
                                                        </TableCell>
                                                        <TableCell className="text-white">
                                                            {((data.trades / metrics.totalTrades) * 100).toFixed(1)}%
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            
                            <TabsContent value="risk" className="mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="bg-gray-900 border-yellow-500">
                                        <CardHeader>
                                            <CardTitle className="text-yellow-500 font-semibold">Métricas de Riesgo</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-white">Drawdown Máximo:</span>
                                                <span className="text-white font-semibold">{metrics.maxDrawdown.toFixed(2)}%</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-white">Profit Factor:</span>
                                                <span className="text-yellow-500 font-semibold">
                                                    {metrics.profitFactor.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-white">Ratio Ganancia/Pérdida:</span>
                                                <span className="text-white font-semibold">{(metrics.avgWin / metrics.avgLoss).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-white">Expectativa por Trade:</span>
                                                <span className="text-white font-semibold">
                                                    ${(metrics.netProfit / metrics.totalTrades).toFixed(2)}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card className="bg-gray-900 border-yellow-500">
                                        <CardHeader>
                                            <CardTitle className="text-yellow-500 font-semibold">Evaluación de Riesgo</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-white">Win Rate</span>
                                                    <span className="text-white">{metrics.winRate.toFixed(1)}%</span>
                                                </div>
                                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-yellow-500 transition-all duration-300" 
                                                        style={{ width: `${metrics.winRate}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-xs text-white mt-1">
                                                    {metrics.winRate >= 60 ? 'Excelente' : metrics.winRate >= 50 ? 'Bueno' : 'Necesita mejorar'}
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-white">Profit Factor</span>
                                                    <span className="text-white">{metrics.profitFactor.toFixed(2)}</span>
                                                </div>
                                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-yellow-500 transition-all duration-300" 
                                                        style={{ width: `${Math.min(metrics.profitFactor * 33.33, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-xs text-white mt-1">
                                                    {metrics.profitFactor >= 1.5 ? 'Excelente' : metrics.profitFactor >= 1 ? 'Aceptable' : 'Riesgoso'}
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-white">Control de Drawdown</span>
                                                    <span className="text-white">{(100 - metrics.maxDrawdown).toFixed(1)}%</span>
                                                </div>
                                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-yellow-500 transition-all duration-300" 
                                                        style={{ width: `${100 - metrics.maxDrawdown}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-xs text-white mt-1">
                                                    {metrics.maxDrawdown <= 10 ? 'Excelente' : metrics.maxDrawdown <= 20 ? 'Bueno' : 'Alto riesgo'}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                            
                            <TabsContent value="update">
                                <UpdateReportTab 
                                    onFileChange={handleFileChange}
                                    onUpload={handleUpload}
                                    selectedFile={selectedFile}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </div>
        </SidebarInset>
    );
};