
import { processingRatesType } from "@/types/calculator";

/**
 * Calculate processing fees using the rates table data
 */
export const calculateProcessingFees = (
  annualSales: number,
  selectedPlan: string,
  processingRates: processingRatesType,
  currentAOV: number,
  fileData: any | null
) => {
  // Get the base plan name for accessing processing rates
  const basePlan = selectedPlan.split('-')[0];
  
  // If we have file data, use it for calculations
  if (fileData) {
    // Simple example - in a real implementation this would parse and analyze the file data
    return {
      basicProcessingFee: fileData.totalAmount * (processingRates[basePlan].standardDomestic / 100) + (fileData.transactions * processingRates[basePlan].transactionFee),
      plusProcessingFee: fileData.totalAmount * (processingRates.plus.standardDomestic / 100) + (fileData.transactions * processingRates.plus.transactionFee),
    };
  } else {
    // No file uploaded - use the standard calculation based on annual sales
    const avgOrderValue = currentAOV > 0 ? currentAOV : 50; // Use current AOV if available, otherwise default to $50
    const transactionsCount = annualSales / avgOrderValue;
    
    // Get dynamic transaction fees from the processing rates
    const basicTransactionFee = processingRates[basePlan].transactionFee;
    const plusTransactionFee = processingRates.plus.transactionFee;
    
    // Use the selected plan's standard domestic rate and Plus plan's rate
    const basicRate = processingRates[basePlan].standardDomestic;
    const plusRate = processingRates.plus.standardDomestic;
    
    const basicProcessingFee = (annualSales * basicRate / 100) + (basicTransactionFee * transactionsCount);
    const plusProcessingFee = (annualSales * plusRate / 100) + (plusTransactionFee * transactionsCount);
    
    return {
      basicProcessingFee,
      plusProcessingFee
    };
  }
};

/**
 * Calculate Revenue Uplift with different scenarios using completed checkout sessions
 * Using annual metrics throughout with monthly output
 */
export const calculateRevenueUplift = (
  reachedCheckout: number,
  completedCheckout: number,
  currentConversionRate: number,
  currentAOV: number,
  annualSales: number,
  lowUpliftPercentage: number,
  averageUpliftPercentage: number,
  goodUpliftPercentage: number,
  setMonthlyUpliftLow: (value: number) => void,
  setMonthlyUpliftAverage: (value: number) => void,
  setMonthlyUpliftGood: (value: number) => void
) => {
  // Ensure we have valid input values to prevent NaN results
  const validConversionRate = currentConversionRate > 0 ? currentConversionRate : 1;
  const validAOV = currentAOV > 0 ? currentAOV : 100;
  const validAnnualSales = annualSales > 0 ? annualSales : 1000000;
  
  // If we have checkout data, use it as the baseline
  if (reachedCheckout > 0 && completedCheckout > 0) {
    // Convert annual checkout metrics to monthly
    const monthlyReachedCheckout = reachedCheckout / 12;
    const monthlyCompletedCheckout = completedCheckout / 12;
    
    // Use configurable percentages for uplift scenarios
    // Low uplift scenario
    const lowCR = validConversionRate * (1 + lowUpliftPercentage / 100);
    const lowAOV = validAOV * (1 + lowUpliftPercentage / 100);
    
    // Calculate projected monthly revenue with improved CR
    const currentCRRevenue = monthlyReachedCheckout * (validConversionRate / 100) * validAOV;
    const improvedCRRevenue = monthlyReachedCheckout * (lowCR / 100) * validAOV;
    const crLowImpact = improvedCRRevenue - currentCRRevenue;
    
    // Calculate AOV impact on current completed checkouts
    const currentAOVRevenue = monthlyCompletedCheckout * validAOV;
    const improvedAOVRevenue = monthlyCompletedCheckout * lowAOV;
    const aovLowImpact = improvedAOVRevenue - currentAOVRevenue;
    
    // Combined impact (CR + AOV)
    const lowMonthlyUplift = crLowImpact + aovLowImpact;
    
    // Average uplift scenario - calculate both CR and AOV impacts
    const avgCR = validConversionRate * (1 + averageUpliftPercentage / 100);
    const avgAOV = validAOV * (1 + averageUpliftPercentage / 100);
    
    const improvedAvgCRRevenue = monthlyReachedCheckout * (avgCR / 100) * validAOV;
    const crAvgImpact = improvedAvgCRRevenue - currentCRRevenue;
    
    const improvedAvgAOVRevenue = monthlyCompletedCheckout * avgAOV;
    const aovAvgImpact = improvedAvgAOVRevenue - currentAOVRevenue;
    
    const avgMonthlyUplift = crAvgImpact + aovAvgImpact;
    
    // Good uplift scenario - calculate both CR and AOV impacts
    const goodCR = validConversionRate * (1 + goodUpliftPercentage / 100);
    const goodAOV = validAOV * (1 + goodUpliftPercentage / 100);
    
    const improvedGoodCRRevenue = monthlyReachedCheckout * (goodCR / 100) * validAOV;
    const crGoodImpact = improvedGoodCRRevenue - currentCRRevenue;
    
    const improvedGoodAOVRevenue = monthlyCompletedCheckout * goodAOV;
    const aovGoodImpact = improvedGoodAOVRevenue - currentAOVRevenue;
    
    const goodMonthlyUplift = crGoodImpact + aovGoodImpact;
    
    // Set the monthly uplift values
    setMonthlyUpliftLow(lowMonthlyUplift);
    setMonthlyUpliftAverage(avgMonthlyUplift);
    setMonthlyUpliftGood(goodMonthlyUplift);
    
    // Return annual uplift (average scenario) for the existing total calculation
    return avgMonthlyUplift * 12;
  } else {
    // Fallback to original calculation when no checkout data is available
    // Calculate base metrics (annual)
    const annualVisitors = (validAnnualSales) / (validAOV * (validConversionRate / 100));
    
    // Monthly visitors
    const monthlyVisitors = annualVisitors / 12;
    const currentMonthlyRevenue = monthlyVisitors * validConversionRate / 100 * validAOV;

    // Low uplift scenario - Calculate CR impact
    const lowCR = validConversionRate * (1 + lowUpliftPercentage / 100);
    const lowCRRevenue = monthlyVisitors * lowCR / 100 * validAOV;
    const lowCRImpact = lowCRRevenue - currentMonthlyRevenue;
    
    // Low uplift scenario - Calculate AOV impact
    const lowAOV = validAOV * (1 + lowUpliftPercentage / 100);
    const lowAOVRevenue = monthlyVisitors * validConversionRate / 100 * lowAOV;
    const lowAOVImpact = lowAOVRevenue - currentMonthlyRevenue;
    
    // Combined low uplift
    const lowMonthlyUplift = lowCRImpact + lowAOVImpact;
    
    // Average uplift scenario - Similar calculations
    const avgCR = validConversionRate * (1 + averageUpliftPercentage / 100);
    const avgCRRevenue = monthlyVisitors * avgCR / 100 * validAOV;
    const avgCRImpact = avgCRRevenue - currentMonthlyRevenue;
    
    const avgAOV = validAOV * (1 + averageUpliftPercentage / 100);
    const avgAOVRevenue = monthlyVisitors * validConversionRate / 100 * avgAOV;
    const avgAOVImpact = avgAOVRevenue - currentMonthlyRevenue;
    
    const avgMonthlyUplift = avgCRImpact + avgAOVImpact;
    
    // Good uplift scenario - Similar calculations
    const goodCR = validConversionRate * (1 + goodUpliftPercentage / 100);
    const goodCRRevenue = monthlyVisitors * goodCR / 100 * validAOV;
    const goodCRImpact = goodCRRevenue - currentMonthlyRevenue;
    
    const goodAOV = validAOV * (1 + goodUpliftPercentage / 100);
    const goodAOVRevenue = monthlyVisitors * validConversionRate / 100 * goodAOV;
    const goodAOVImpact = goodAOVRevenue - currentMonthlyRevenue;
    
    const goodMonthlyUplift = goodCRImpact + goodAOVImpact;
    
    // Set the monthly uplift values
    setMonthlyUpliftLow(lowMonthlyUplift);
    setMonthlyUpliftAverage(avgMonthlyUplift);
    setMonthlyUpliftGood(goodMonthlyUplift);
    
    // Return annual uplift (average scenario) for the existing total calculation
    return avgMonthlyUplift * 12;
  }
};

/**
 * Extract monthly cost for any plan, including non-monthly plans
 */
export const getPlanMonthlyCost = (
  planId: string,
  billingType: string = 'monthly',
  plans: any
) => {
  if (billingType === 'monthly') {
    const priceString = plans[planId].price;
    const priceMatch = priceString.match(/\$(\d+)/);
    
    if (priceMatch && priceMatch[1]) {
      return parseInt(priceMatch[1], 10);
    }
    return 0;
  } 
  else {
    // Annual billing prices
    if (billingType === 'annual') {
      if (planId === 'basic') return 29;
      if (planId === 'shopify') return 79;
      if (planId === 'advanced') return 299;
    }
    // Biennial billing prices
    else if (billingType === 'biennial') {
      if (planId === 'basic') return Math.round(558 / 24);
      if (planId === 'shopify') return Math.round(1518 / 24);
      if (planId === 'advanced') return Math.round(5640 / 24);
    }
    // Triennial billing prices
    else if (billingType === 'triennial') {
      if (planId === 'basic') return Math.round(783 / 36);
      if (planId === 'shopify') return Math.round(2133 / 36);
      if (planId === 'advanced') return Math.round(7884 / 36);
    }
    
    // Fallback to regular monthly price
    return getPlanMonthlyCost(planId, 'monthly', plans);
  }
};

/**
 * Format currency in USD format
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Parse uploaded payment file and extract data
 */
export const parsePaymentFile = (file: File, annualSales: number, currentAOV: number) => {
  // For demo purposes, we'll create a simplified mock parsing
  // In a real app, you would use Papa Parse or ExcelJS to parse CSV/Excel files
  
  // Mock file analysis result - this would come from actual file parsing
  const mockData = {
    totalAmount: annualSales > 0 ? annualSales : 1000000, // Use entered amount or default to $1M
    transactions: 5000,
    avgOrderValue: currentAOV || 200,
    paymentTypes: {
      standard: 0.7,
      premium: 0.2,
      international: 0.1
    }
  };
  
  return mockData;
};
