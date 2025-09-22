"use client"
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
//import { cn } from "@/lib/utils"

type CalendarData = {
  date: string;     // formato YYYY-MM-DD
  value: number;    // valor numérico para el día
}

type Props = {
  data: CalendarData[];
}

export function CalendarWithData({ data }: Props) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date())
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date())

  // Calcular el rango de fechas basado en la data
  const dateRange = React.useMemo(() => {
    if (!data || data.length === 0) {
      return { startDate: new Date(), endDate: new Date() }
    }

    const dates = data.map(item => new Date(item.date)).sort((a, b) => a.getTime() - b.getTime())
    const startDate = dates[0]
    const endDate = new Date() // Fecha actual

    return { startDate, endDate }
  }, [data])

  // Crear un mapa de fechas con valores para fácil acceso
  const dataMap = React.useMemo(() => {
    const map = new Map<string, number>()
    data.forEach(item => {
      map.set(item.date, item.value)
    })
    return map
  }, [data])

  // Inicializar el mes actual con la primera fecha de la data
  React.useEffect(() => {
    if (dateRange.startDate) {
      setCurrentMonth(dateRange.startDate)
    }
  }, [dateRange.startDate])

  // Navegar al mes anterior
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() - 1)
      
      // No permitir ir antes de la primera fecha de la data
      if (newDate < dateRange.startDate) {
        return dateRange.startDate
      }
      
      return newDate
    })
  }

  // Navegar al mes siguiente
  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + 1)
      
      // No permitir ir después de la fecha actual
      if (newDate > dateRange.endDate) {
        return dateRange.endDate
      }
      
      return newDate
    })
  }

  // Ir al primer mes con data
  const goToFirstMonth = () => {
    setCurrentMonth(dateRange.startDate)
  }

  // Ir al mes actual
  const goToCurrentMonth = () => {
    setCurrentMonth(new Date())
  }

  // Verificar si podemos navegar
  const canGoPrevious = currentMonth > dateRange.startDate
  const canGoNext = currentMonth < new Date()

  // Formatear el mes y año actual
  const formatCurrentMonth = () => {
    return currentMonth.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    })
  }

  // Obtener información del día seleccionado
  const getSelectedDateInfo = () => {
    if (!selectedDate) return null
    
    const dateKey = selectedDate.toISOString().split('T')[0]
    const value = dataMap.get(dateKey)
    
    return {
      date: selectedDate,
      value: value,
      hasData: value !== undefined
    }
  }

  // Función para personalizar el estilo de cada día
//   const modifyDay = (day: Date) => {
//     const dateKey = day.toISOString().split('T')[0]
//     const value = dataMap.get(dateKey)
    
//     if (value === undefined) return {}
    
//     return {
//       className: cn(
//         "relative",
//         value > 0 ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"
//       )
//     }
//   }

  const selectedInfo = getSelectedDateInfo()

  return (
    <div className="space-y-4 p-4">
      {/* Header principal */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-yellow-500" />
          <h1 className="text-2xl font-semibold text-yellow-500">Calendar con Data</h1>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToFirstMonth}
            disabled={!canGoPrevious}
          >
            Primer mes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToCurrentMonth}
            disabled={!canGoNext}
          >
            Mes actual
          </Button>
        </div>
      </div>

      {/* Información del rango de fechas */}
      <div className=" p-3 rounded-md bg-yellow-600/50">
        <p className="text-md">
          <strong>Rango de datos:</strong> {dateRange.startDate.toLocaleDateString('es-ES')} - {dateRange.endDate.toLocaleDateString('es-ES')}
        </p>
        <p className="text-md  text-white">
          Total de registros: {data.length}
        </p>
      </div>

      {/* Controles de navegación */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousMonth}
          disabled={!canGoPrevious}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        
        <h2 className="text-lg font-semibold capitalize text-yellow-500">
          {formatCurrentMonth()}
        </h2>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextMonth}
          disabled={!canGoNext}
          className="flex items-center gap-2"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-white">Valores positivos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
          <span className="text-white">Valores negativos</span>
        </div>
      </div>

      {/* Calendar */}
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        className="rounded-md border shadow-md mx-auto w-120 bg-neutral-800 text-white shadow-yellow-400"
        captionLayout="dropdown"
        modifiers={{
          hasData: (date) => {
            const dateKey = date.toISOString().split('T')[0]
            return dataMap.has(dateKey)
          },
          positive: (date) => {
            const dateKey = date.toISOString().split('T')[0]
            const value = dataMap.get(dateKey)
            return value !== undefined && value > 0
          },
          negative: (date) => {
            const dateKey = date.toISOString().split('T')[0]
            const value = dataMap.get(dateKey)
            return value !== undefined && value < 0
          }
        }}
        modifiersStyles={{
          positive: { 
            backgroundColor: 'rgb(220 252 231)', 
            color: 'rgb(22 101 52)',
            fontWeight: 'bold'
          },
          negative: { 
            backgroundColor: 'rgb(254 226 226)', 
            color: 'rgb(153 27 27)',
            fontWeight: 'bold'
          }
        }}
        disabled={(date) => {
          return date < dateRange.startDate || date > dateRange.endDate
        }}
      />

      {/* Información de la fecha seleccionada */}
      {selectedInfo && (
        <div className="bg-muted/50 p-4 rounded-md">
          <p className="text-sm font-medium mb-2">Información del día seleccionado:</p>
          <div className="space-y-2">
            <p className="text-lg capitalize">
              {selectedInfo.date.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            
            {selectedInfo.hasData ? (
              <div className="flex items-center gap-2">
                <Badge 
                  variant={selectedInfo.value! > 0 ? "default" : "destructive"}
                  className="text-sm"
                >
                  ${selectedInfo.value!.toFixed(2)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {selectedInfo.value! > 0 ? "Ganancia" : "Pérdida"}
                </span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay datos para este día
              </p>
            )}
          </div>
        </div>
      )}

      {/* Resumen estadístico */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-3 rounded-md">
          <p className="text-sm text-green-700 font-medium">Días positivos</p>
          <p className="text-lg font-bold text-green-800">
            {data.filter(d => d.value > 0).length}
          </p>
        </div>
        <div className="bg-red-50 p-3 rounded-md">
          <p className="text-sm text-red-700 font-medium">Días negativos</p>
          <p className="text-lg font-bold text-red-800">
            {data.filter(d => d.value < 0).length}
          </p>
        </div>
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm text-blue-700 font-medium">Total ganancia</p>
          <p className="text-lg font-bold text-blue-800">
            ${data.filter(d => d.value > 0).reduce((sum, d) => sum + d.value, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-orange-50 p-3 rounded-md">
          <p className="text-sm text-orange-700 font-medium">Total pérdida</p>
          <p className="text-lg font-bold text-orange-800">
            ${data.filter(d => d.value < 0).reduce((sum, d) => sum + d.value, 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}