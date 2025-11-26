import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, FileText } from "lucide-react";
import mt1 from "../assets/mt1.png"
import mt2 from "../assets/mt2.png"
import mt3 from "../assets/mt3.png"
import mt4 from "../assets/mt4.png"


export const MTInstructions = () => {
    const steps = [
        {
            step: 1,
            title: "Abrir MetaTrader",
            description: "Abre tu plataforma MetaTrader 4 o MetaTrader 5",
            image: mt1
        },
        {
            step: 2,
            title: "Ir a Historial de Cuenta",
            description: "Ve a la pestaña 'Historial de Cuenta' en la parte inferior",
            image: mt2
        },
        {
            step: 3,
            title: "Seleccionar Período",
            description: "Haz clic derecho y selecciona el período que deseas exportar",
            image: mt3
        },
        {
            step: 4,
            title: "Exportar Reporte",
            description: "Selecciona 'Guardar como Reporte' y guarda el archivo Excel (.xlsx)",
            image: mt4
        }
    ];

    return (
        <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="text-center space-y-6">
                    <div className="relative">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-yellow-500 drop-shadow-lg">
                            INSTRUCCIONES METATRADER
                        </h1>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-yellow-400 rounded-full"></div>
                    </div>
                    <p className="text-lg sm:text-xl text-white max-w-3xl mx-auto leading-relaxed">
                        Sigue estos pasos detallados para exportar tu historial de trades desde MetaTrader 
                        y poder analizarlos en nuestra plataforma de manera profesional.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {steps.map((step) => (
                        <Card key={step.step} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-yellow-400/20 shadow-lg bg-black backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-4">
                                    <Badge className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg shadow-lg">
                                        {step.step}
                                    </Badge>
                                    <CardTitle className="text-xl sm:text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                                        {step.title}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="relative aspect-video bg-black border border-yellow-400/30 rounded-xl overflow-hidden shadow-inner">
                                    <img 
                                        src={step.image} 
                                        alt={step.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        onError={(e: any) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div className="hidden items-center justify-center text-yellow-400 absolute inset-0">
                                        <div className="text-center space-y-2">
                                            <FileText className="w-16 h-16 mx-auto" />
                                            <p className="text-sm font-medium">Imagen no disponible</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-black border border-yellow-400/30 p-4 rounded-lg border-l-4 border-l-yellow-400">
                                    <p className="text-white font-medium leading-relaxed">{step.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Next Step Card */}
                <Card className="bg-black border-2 border-yellow-400 shadow-2xl text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                    <CardHeader className="relative z-10">
                        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                            <div className="p-2 bg-white/20 rounded-full">
                                <Upload className="w-6 h-6" />
                            </div>
                            ¡Siguiente Paso!
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 space-y-4">
                        <p className="text-lg leading-relaxed">
                            Una vez que hayas exportado tu archivo Excel desde MetaTrader, dirígete a la sección 
                            <span className="font-bold bg-white/20 px-2 py-1 rounded mx-1">"Importar de MT"</span> 
                            para subir tu archivo y comenzar el análisis profesional de tus trades.
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white/10 p-4 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Download className="w-5 h-5" />
                                <span className="font-semibold">Formatos soportados:</span>
                            </div>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                                .xlsx (Reporte Excel de MT4/MT5)
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}