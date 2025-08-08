export async function runOptimizationAgent(aiData) {
  // Very simple rules-based placeholder.
  const suggestions = [];
  const fp = aiData?.footprint ?? 0;
  if (fp > 50) suggestions.push('Switch to renewable energy plan (est. -20%)');
  if (fp > 20) suggestions.push('Optimize device standby schedules (est. -10%)');
  if (fp > 10) suggestions.push('Enable smart thermostat eco-mode (est. -5%)');
  return suggestions;
}
