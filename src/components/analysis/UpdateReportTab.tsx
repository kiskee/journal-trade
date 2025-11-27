
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useAnalysisManager } from './AnalysisManager';
import Loading from '@/components/utils/Loading';

interface UpdateReportTabProps {
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onUpload: () => void;
    selectedFile: File | null;
}

export const UpdateReportTab = ({ onFileChange, onUpload, selectedFile }: UpdateReportTabProps) => {
    const { hasExistingAnalysis, isLoading } = useAnalysisManager();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <Loading text="Cargando..." />
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6">
            <Card className="bg-gray-900 border-yellow-500">
                <CardHeader>
                    <CardTitle className="text-yellow-500 font-semibold">
                        {hasExistingAnalysis ? 'Actualizar Reporte' : 'Crear Nuevo Reporte'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {hasExistingAnalysis ? (
                        <p className="text-white mb-4">
                            Sube un nuevo archivo Excel para actualizar tu reporte de análisis existente.
                        </p>
                    ) : (
                        <p className="text-white mb-4">
                            Sube tu archivo Excel (.xlsx) con los datos de trading de MetaTrader.
                        </p>
                    )}
                    
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-yellow-500">
                            Seleccionar archivo Excel
                        </label>
                        <input
                            type="file"
                            accept=".xlsx"
                            onChange={onFileChange}
                            className="block w-full text-sm text-white bg-black border border-yellow-500 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-medium file:bg-yellow-500 file:text-black hover:file:bg-yellow-400 transition-all"
                        />
                        
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
                            onClick={onUpload}
                            disabled={!selectedFile}
                            className="w-full py-3 px-4 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {selectedFile ? (hasExistingAnalysis ? 'Actualizar Reporte' : 'Procesar Archivo') : 'Selecciona un archivo'}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};