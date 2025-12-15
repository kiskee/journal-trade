interface TradeResponse {
  count: number;
  results: Trade[];
}

interface Trade {
  id: string;
  date: string;
  user: string;
  step1: {
    date: string;
    time: string;
    asset: string;
    tradeType: string;
    positionSize: number;
    leverage: number;
    setup: string;
    duration: number;
    durationUnit: string;
    accountId: string;
  };
  step2: {
    entryPrice: number;
    exitPrice: number;
    stopLoss: number;
    takeProfit: number;
    resultUsd: number;
    resultPercent: number;
    fees: number;
  };
  step3: {
    emotionBefore: string;
    emotionAfter: string;
    confidenceLevel: number;
    disciplineLevel: number;
  };
  step4: {
    followedPlan: boolean;
    tags: string[];
    notes?: string;
    mediaUrl?: string;
  };
}

interface TradingMetrics {
  // Métricas generales
  totalTrades: number;
  profitableTrades: number;
  losingTrades: number;
  winRate: number;
  
  // Métricas financieras
  totalPnL: number;
  totalFees: number;
  netPnL: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  largestWin: number;
  largestLoss: number;
  
  // Métricas de riesgo
  averageRiskReward: number;
  maxDrawdown: number;
  
  // Métricas psicológicas
  averageConfidenceBefore: number;
  averageDiscipline: number;
  planFollowRate: number;
  emotionalPatterns: {
    [key: string]: number;
  };
  
  // Métricas de trading
  assetDistribution: { [key: string]: number };
  setupDistribution: { [key: string]: number };
  tradeTypeDistribution: { [key: string]: number };
  averageDuration: number;
  
  // Métricas de tags
  mostUsedTags: Array<{ tag: string; count: number }>;
}

const dataAnalisis = (data: TradeResponse): TradingMetrics => {
  const { results } = data;
  
  if (!results || results.length === 0) {
    throw new Error('No hay datos de trades para analizar');
  }

  // Métricas básicas
  const totalTrades = results.length;
  const profitableTrades = results.filter(trade => trade.step2.resultUsd > 0).length;
  const losingTrades = results.filter(trade => trade.step2.resultUsd < 0).length;
  const winRate = (profitableTrades / totalTrades) * 100;

  // Métricas financieras
  const totalPnL = results.reduce((sum, trade) => sum + trade.step2.resultUsd, 0);
 
  let totalFees = results.reduce((sum, trade) => sum + trade.step2.fees, 0);
  if (Number.isNaN(totalFees)){
    totalFees = 0
  }

  const netPnL = totalPnL - totalFees;

  const winningTrades = results.filter(trade => trade.step2.resultUsd > 0);
  const losingTradesArray = results.filter(trade => trade.step2.resultUsd < 0);

  const averageWin = winningTrades.length > 0 
    ? winningTrades.reduce((sum, trade) => sum + trade.step2.resultUsd, 0) / winningTrades.length 
    : 0;

  const averageLoss = losingTradesArray.length > 0 
    ? Math.abs(losingTradesArray.reduce((sum, trade) => sum + trade.step2.resultUsd, 0) / losingTradesArray.length)
    : 0;

  const profitFactor = averageLoss !== 0 ? averageWin / averageLoss : 0;
  const largestWin = Math.max(...results.map(trade => trade.step2.resultUsd));
  const largestLoss = Math.min(...results.map(trade => trade.step2.resultUsd));

  // Métricas de riesgo
  const riskRewardRatios = results.map(trade => {
    const risk = Math.abs(trade.step2.entryPrice - trade.step2.stopLoss);
    const reward = Math.abs(trade.step2.takeProfit - trade.step2.entryPrice);
    return risk !== 0 ? reward / risk : 0;
  });
  const averageRiskReward = riskRewardRatios.reduce((sum, rr) => sum + rr, 0) / riskRewardRatios.length;

  // Cálculo simple de drawdown (necesitaría orden cronológico para ser preciso)
  const cumulativePnL = results.reduce((acc, trade, index) => {
    const runningTotal = index === 0 ? trade.step2.resultUsd : acc[index - 1] + trade.step2.resultUsd;
    acc.push(runningTotal);
    return acc;
  }, [] as number[]);
  
  let maxDrawdown = 0;
  let peak = cumulativePnL[0];
  for (const value of cumulativePnL) {
    if (value > peak) peak = value;
    const drawdown = peak - value;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }

  // Métricas psicológicas
  const averageConfidenceBefore = results.reduce((sum, trade) => sum + trade.step3.confidenceLevel, 0) / totalTrades;
  const averageDiscipline = results.reduce((sum, trade) => sum + trade.step3.disciplineLevel, 0) / totalTrades;
  const planFollowRate = (results.filter(trade => trade.step4.followedPlan).length / totalTrades) * 100;

  // Patrones emocionales
  const emotionsBefore = results.map(trade => trade.step3.emotionBefore);
  const emotionsAfter = results.map(trade => trade.step3.emotionAfter);
  const allEmotions = [...emotionsBefore, ...emotionsAfter];
  
  const emotionalPatterns = allEmotions.reduce((acc, emotion) => {
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Distribuciones
  const assetDistribution = results.reduce((acc, trade) => {
    acc[trade.step1.asset] = (acc[trade.step1.asset] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const setupDistribution = results.reduce((acc, trade) => {
    acc[trade.step1.setup] = (acc[trade.step1.setup] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const tradeTypeDistribution = results.reduce((acc, trade) => {
    acc[trade.step1.tradeType] = (acc[trade.step1.tradeType] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const averageDuration = results.reduce((sum, trade) => sum + trade.step1.duration, 0) / totalTrades;

  // Tags más usados
  const allTags = results.flatMap(trade => trade.step4.tags);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const mostUsedTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    // Métricas generales
    totalTrades,
    profitableTrades,
    losingTrades,
    winRate: Math.round(winRate * 100) / 100,

    // Métricas financieras
    totalPnL: Math.round(totalPnL * 100) / 100,
    totalFees: Math.round(totalFees * 100) / 100,
    netPnL: Math.round(netPnL * 100) / 100,
    averageWin: Math.round(averageWin * 100) / 100,
    averageLoss: Math.round(averageLoss * 100) / 100,
    profitFactor: Math.round(profitFactor * 100) / 100,
    largestWin: Math.round(largestWin * 100) / 100,
    largestLoss: Math.round(largestLoss * 100) / 100,

    // Métricas de riesgo
    averageRiskReward: Math.round(averageRiskReward * 100) / 100,
    maxDrawdown: Math.round(maxDrawdown * 100) / 100,

    // Métricas psicológicas
    averageConfidenceBefore: Math.round(averageConfidenceBefore * 100) / 100,
    averageDiscipline: Math.round(averageDiscipline * 100) / 100,
    planFollowRate: Math.round(planFollowRate * 100) / 100,
    emotionalPatterns,

    // Métricas de trading
    assetDistribution,
    setupDistribution,
    tradeTypeDistribution,
    averageDuration: Math.round(averageDuration * 100) / 100,

    // Métricas de tags
    mostUsedTags
  };
};

// Función para mostrar un resumen de las métricas
const mostrarResumenMetricas = (metricas: TradingMetrics): string => {
  return `
📊 RESUMEN DE TRADING METRICS

🎯 Rendimiento General:
- Total de trades: ${metricas.totalTrades}
- Tasa de éxito: ${metricas.winRate}%
- Trades ganadores: ${metricas.profitableTrades}
- Trades perdedores: ${metricas.losingTrades}

💰 Métricas Financieras:
- PnL Total: $${metricas.totalPnL}
- PnL Neto: $${metricas.netPnL}
- Comisiones: $${metricas.totalFees}
- Ganancia promedio: $${metricas.averageWin}
- Pérdida promedio: $${metricas.averageLoss}
- Factor de beneficio: ${metricas.profitFactor}

🧠 Métricas Psicológicas:
- Confianza promedio: ${metricas.averageConfidenceBefore}/10
- Disciplina promedio: ${metricas.averageDiscipline}/10
- Siguió el plan: ${metricas.planFollowRate}%

📈 Trading:
- Duración promedio: ${metricas.averageDuration} min
- Risk/Reward promedio: 1:${metricas.averageRiskReward}
- Drawdown máximo: $${metricas.maxDrawdown}
  `;
};


export { dataAnalisis, mostrarResumenMetricas, type TradingMetrics, type TradeResponse };