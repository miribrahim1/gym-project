export function calculatePlanPrice(monthlyPrice, cycle) {
  const months = cycle?.months || 1;
  const discountPct = cycle?.discountPct || 0;
  const effectiveMonthly = Math.round(monthlyPrice * (1 - discountPct / 100));
  const totalForCycle = effectiveMonthly * months;
  const fullPriceTotal = monthlyPrice * months;
  const savings = fullPriceTotal - totalForCycle;
  return { effectiveMonthly, totalForCycle, fullPriceTotal, savings, months, discountPct };
}
