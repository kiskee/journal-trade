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
    setup: string;
    accountId: string;
  };
  step2: {
    entryPrice: number;
    exitPrice: number;
    stopLoss: number;
    takeProfit: number;
    resultUsd: number;
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
  netPnL: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  largestWin: number;
  largestLoss: number;
  
  // Métricas de riesgo
  averageRiskReward: number;
  maxDrawdown: number;
  expectancy: number;
  sharpeRatio: number;
  sortinoRatio: number;
  recoveryFactor: number;
  
  // Métricas de consistencia
  longestWinStreak: number;
  longestLossStreak: number;
  currentStreak: { type: 'win' | 'loss' | 'none'; count: number };
  volatility: number;
  
  // Métricas psicológicas
  averageConfidenceBefore: number;
  averageDiscipline: number;
  planFollowRate: number;
  confidenceCorrelation: number;
  disciplineCorrelation: number;
  emotionalPatterns: {
    [key: string]: number;
  };
  
  // Métricas de trading
  assetDistribution: { [key: string]: number };
  setupDistribution: { [key: string]: number };
  tradeTypeDistribution: { [key: string]: number };
  bestAsset: { name: string; winRate: number; pnl: number };
  bestSetup: { name: string; winRate: number; pnl: number };
  worstAsset: { name: string; winRate: number; pnl: number };
  worstSetup: { name: string; winRate: number; pnl: number };
  
  // Métricas de gestión de riesgo
  averageRiskPerTrade: number;
  averageRewardPerTrade: number;
  riskRewardDistribution: { [key: string]: number };
  
  // Métricas temporales
  tradesPerMonth: { [key: string]: number };
  performanceByDayOfWeek: { [key: string]: { trades: number; pnl: number; winRate: number } };
  
  // Métricas de tags
  mostUsedTags: Array<{ tag: string; count: number }>;
  mostProfitableTags: Array<{ tag: string; pnl: number; winRate: number }>;
}

// Función para calcular correlación
const calculateCorrelation = (x: number[], y: number[]): number => {
  const n = x.length;
  if (n === 0) return 0;
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
};

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
  const netPnL = totalPnL;

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

  // Expectancy
  const expectancy = (winRate / 100) * averageWin - ((100 - winRate) / 100) * averageLoss;

  // Sharpe Ratio (simplificado)
  const returns = results.map(trade => trade.step2.resultUsd);
  const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  const sharpeRatio = stdDev !== 0 ? avgReturn / stdDev : 0;

  // Sortino Ratio (solo considera volatilidad negativa)
  const negativeReturns = returns.filter(ret => ret < avgReturn);
  const downwardVariance = negativeReturns.length > 0 
    ? negativeReturns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / negativeReturns.length
    : 0;
  const downwardStdDev = Math.sqrt(downwardVariance);
  const sortinoRatio = downwardStdDev !== 0 ? avgReturn / downwardStdDev : 0;

  // Recovery Factor
  const recoveryFactor = maxDrawdown !== 0 ? netPnL / maxDrawdown : 0;

  // Volatilidad
  const volatility = stdDev;

  // Rachas ganadoras y perdedoras
  let longestWinStreak = 0;
  let longestLossStreak = 0;
  let currentWinStreak = 0;
  let currentLossStreak = 0;
  let currentStreak = { type: 'none' as 'win' | 'loss' | 'none', count: 0 };

  results.forEach((trade, index) => {
    if (trade.step2.resultUsd > 0) {
      currentWinStreak++;
      currentLossStreak = 0;
      if (index === results.length - 1) {
        currentStreak = { type: 'win', count: currentWinStreak };
      }
    } else {
      currentLossStreak++;
      currentWinStreak = 0;
      if (index === results.length - 1) {
        currentStreak = { type: 'loss', count: currentLossStreak };
      }
    }
    
    longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
    longestLossStreak = Math.max(longestLossStreak, currentLossStreak);
  });

  // Correlaciones psicológicas
  const confidenceCorrelation = calculateCorrelation(
    results.map(t => t.step3.confidenceLevel),
    results.map(t => t.step2.resultUsd)
  );
  
  const disciplineCorrelation = calculateCorrelation(
    results.map(t => t.step3.disciplineLevel),
    results.map(t => t.step2.resultUsd)
  );

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

  // Mejor activo y setup
  const assetPerformance = Object.keys(assetDistribution).map(asset => {
    const assetTrades = results.filter(t => t.step1.asset === asset);
    const assetWins = assetTrades.filter(t => t.step2.resultUsd > 0).length;
    const assetPnL = assetTrades.reduce((sum, t) => sum + t.step2.resultUsd, 0);
    return {
      name: asset,
      winRate: (assetWins / assetTrades.length) * 100,
      pnl: assetPnL
    };
  });
  
  const setupPerformance = Object.keys(setupDistribution).map(setup => {
    const setupTrades = results.filter(t => t.step1.setup === setup);
    const setupWins = setupTrades.filter(t => t.step2.resultUsd > 0).length;
    const setupPnL = setupTrades.reduce((sum, t) => sum + t.step2.resultUsd, 0);
    return {
      name: setup,
      winRate: (setupWins / setupTrades.length) * 100,
      pnl: setupPnL
    };
  });

  const bestAsset = assetPerformance.reduce((best, current) => 
    current.pnl > best.pnl ? current : best, assetPerformance[0] || { name: 'N/A', winRate: 0, pnl: 0 }
  );
  
  const bestSetup = setupPerformance.reduce((best, current) => 
    current.pnl > best.pnl ? current : best, setupPerformance[0] || { name: 'N/A', winRate: 0, pnl: 0 }
  );

  const worstAsset = assetPerformance.reduce((worst, current) => 
    current.pnl < worst.pnl ? current : worst, assetPerformance[0] || { name: 'N/A', winRate: 0, pnl: 0 }
  );
  
  const worstSetup = setupPerformance.reduce((worst, current) => 
    current.pnl < worst.pnl ? current : worst, setupPerformance[0] || { name: 'N/A', winRate: 0, pnl: 0 }
  );

  // Métricas de gestión de riesgo
  const averageRiskPerTrade = results.reduce((sum, trade) => {
    const risk = Math.abs(trade.step2.entryPrice - trade.step2.stopLoss);
    return sum + risk;
  }, 0) / totalTrades;

  const averageRewardPerTrade = results.reduce((sum, trade) => {
    const reward = Math.abs(trade.step2.takeProfit - trade.step2.entryPrice);
    return sum + reward;
  }, 0) / totalTrades;

  // Distribución de Risk/Reward
  const riskRewardDistribution = results.reduce((acc, trade) => {
    const risk = Math.abs(trade.step2.entryPrice - trade.step2.stopLoss);
    const reward = Math.abs(trade.step2.takeProfit - trade.step2.entryPrice);
    const ratio = risk !== 0 ? Math.round(reward / risk) : 0;
    const key = `1:${ratio}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Métricas temporales
  const tradesPerMonth = results.reduce((acc, trade) => {
    const month = new Date(trade.step1.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const performanceByDayOfWeek = results.reduce((acc, trade) => {
    const dayOfWeek = new Date(trade.step1.date).toLocaleDateString('es-ES', { weekday: 'long' });
    if (!acc[dayOfWeek]) {
      acc[dayOfWeek] = { trades: 0, pnl: 0, winRate: 0 };
    }
    acc[dayOfWeek].trades++;
    acc[dayOfWeek].pnl += trade.step2.resultUsd;
    return acc;
  }, {} as { [key: string]: { trades: number; pnl: number; winRate: number } });

  // Calcular win rate por día de la semana
  Object.keys(performanceByDayOfWeek).forEach(day => {
    const dayTrades = results.filter(trade => 
      new Date(trade.step1.date).toLocaleDateString('es-ES', { weekday: 'long' }) === day
    );
    const wins = dayTrades.filter(trade => trade.step2.resultUsd > 0).length;
    performanceByDayOfWeek[day].winRate = (wins / dayTrades.length) * 100;
  });

  // Tags más rentables
  const tagPerformance = {} as { [key: string]: { pnl: number; trades: number; wins: number } };
  results.forEach(trade => {
    trade.step4.tags.forEach(tag => {
      if (!tagPerformance[tag]) {
        tagPerformance[tag] = { pnl: 0, trades: 0, wins: 0 };
      }
      tagPerformance[tag].pnl += trade.step2.resultUsd;
      tagPerformance[tag].trades++;
      if (trade.step2.resultUsd > 0) tagPerformance[tag].wins++;
    });
  });

  const mostProfitableTags = Object.entries(tagPerformance)
    .map(([tag, data]) => ({
      tag,
      pnl: data.pnl,
      winRate: (data.wins / data.trades) * 100
    }))
    .sort((a, b) => b.pnl - a.pnl)
    .slice(0, 5);

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
    netPnL: Math.round(netPnL * 100) / 100,
    averageWin: Math.round(averageWin * 100) / 100,
    averageLoss: Math.round(averageLoss * 100) / 100,
    profitFactor: Math.round(profitFactor * 100) / 100,
    largestWin: Math.round(largestWin * 100) / 100,
    largestLoss: Math.round(largestLoss * 100) / 100,

    // Métricas de riesgo
    averageRiskReward: Math.round(averageRiskReward * 100) / 100,
    maxDrawdown: Math.round(maxDrawdown * 100) / 100,
    expectancy: Math.round(expectancy * 100) / 100,
    sharpeRatio: Math.round(sharpeRatio * 100) / 100,
    sortinoRatio: Math.round(sortinoRatio * 100) / 100,
    recoveryFactor: Math.round(recoveryFactor * 100) / 100,

    // Métricas de consistencia
    longestWinStreak,
    longestLossStreak,
    currentStreak,
    volatility: Math.round(volatility * 100) / 100,

    // Métricas psicológicas
    averageConfidenceBefore: Math.round(averageConfidenceBefore * 100) / 100,
    averageDiscipline: Math.round(averageDiscipline * 100) / 100,
    planFollowRate: Math.round(planFollowRate * 100) / 100,
    confidenceCorrelation: Math.round(confidenceCorrelation * 100) / 100,
    disciplineCorrelation: Math.round(disciplineCorrelation * 100) / 100,
    emotionalPatterns,

    // Métricas de trading
    assetDistribution,
    setupDistribution,
    tradeTypeDistribution,
    bestAsset: {
      name: bestAsset.name,
      winRate: Math.round(bestAsset.winRate * 100) / 100,
      pnl: Math.round(bestAsset.pnl * 100) / 100
    },
    bestSetup: {
      name: bestSetup.name,
      winRate: Math.round(bestSetup.winRate * 100) / 100,
      pnl: Math.round(bestSetup.pnl * 100) / 100
    },
    worstAsset: {
      name: worstAsset.name,
      winRate: Math.round(worstAsset.winRate * 100) / 100,
      pnl: Math.round(worstAsset.pnl * 100) / 100
    },
    worstSetup: {
      name: worstSetup.name,
      winRate: Math.round(worstSetup.winRate * 100) / 100,
      pnl: Math.round(worstSetup.pnl * 100) / 100
    },

    // Métricas de gestión de riesgo
    averageRiskPerTrade: Math.round(averageRiskPerTrade * 100) / 100,
    averageRewardPerTrade: Math.round(averageRewardPerTrade * 100) / 100,
    riskRewardDistribution,

    // Métricas temporales
    tradesPerMonth,
    performanceByDayOfWeek,

    // Métricas de tags
    mostUsedTags,
    mostProfitableTags
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
- Ganancia promedio: $${metricas.averageWin}
- Pérdida promedio: $${metricas.averageLoss}
- Factor de beneficio: ${metricas.profitFactor}

🧠 Métricas Psicológicas:
- Confianza promedio: ${metricas.averageConfidenceBefore}/10
- Disciplina promedio: ${metricas.averageDiscipline}/10
- Siguió el plan: ${metricas.planFollowRate}%

📈 Trading:
- Risk/Reward promedio: 1:${metricas.averageRiskReward}
- Drawdown máximo: $${metricas.maxDrawdown}
  `;
};


export { dataAnalisis, mostrarResumenMetricas, type TradingMetrics, type TradeResponse };