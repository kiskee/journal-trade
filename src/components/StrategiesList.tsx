
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface Strategy {
  date: string;
  exitType: string;
  user: string;
  update: string;
  id: string;
  strategyName: string;
  entryType: string;
}

interface StrategiesListProps {
  strategies?: Strategy[];
}

export const StrategiesList: React.FC<StrategiesListProps> = ({ strategies = [] }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (strategies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-black via-gray-900 to-yellow-900 p-4">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-yellow-700/20 flex items-center justify-center">
            <TrendingUp className="w-10 h-10 text-yellow-400" />
          </div>
          <p className="text-white text-xl font-medium">No hay estrategias disponibles</p>
          <p className="text-gray-400 text-sm">Crea tu primera estrategia para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-yellow-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-yellow-600 to-yellow-800 flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">Estrategias</h1>
              <p className="text-gray-400 text-sm mt-1">{strategies.length} estrategias activas</p>
            </div>
          </div>
        </div>
        
        {/* Grid de Estrategias */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {strategies.map((strategy) => (
            <Card 
              key={strategy.id} 
              className="group bg-linear-to-br from-gray-900 to-gray-950 border-gray-800 hover:border-yellow-600 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-900/20 hover:-translate-y-1 cursor-pointer overflow-hidden relative"
            >
              {/* Decorative gradient */}
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-yellow-600 via-yellow-700 to-yellow-600"></div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-white text-xl font-bold group-hover:text-yellow-300 transition-colors line-clamp-2">
                    {strategy.strategyName}
                  </CardTitle>
                  <div className="w-10 h-10 rounded-lg bg-yellow-700/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-yellow-400" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-5">
                {/* Entry Type */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Entrada</p>
                  </div>
                  <div className="bg-black/40 rounded-lg p-3 border border-gray-800">
                    <p className="text-white text-sm leading-relaxed">{strategy.entryType}</p>
                  </div>
                </div>
                
                {/* Exit Type */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Salida</p>
                  </div>
                  <div className="bg-black/40 rounded-lg p-3 border border-gray-800">
                    <p className="text-white text-sm leading-relaxed">{strategy.exitType}</p>
                  </div>
                </div>
                
                {/* Date & Time */}
                <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-yellow-400" />
                    <Badge variant="secondary" className="bg-yellow-700/20 text-yellow-300 hover:bg-yellow-700/30 border-yellow-700/30 font-medium">
                      {formatDate(strategy.date)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400 text-xs font-medium">
                      {formatTime(strategy.date)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};