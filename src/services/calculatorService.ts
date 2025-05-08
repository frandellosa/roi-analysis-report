
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
      basicProcessingFee: fileData.totalAmount * (processingRates[basePlan].standardDomestic / 100) + (fileData.transactions * 0.30),
      plusProcessingFee: fileData.totalAmount * (processingRates.plus.standardDomestic / 100) + (fileData.transactions * 0.30),
    };
  } else {
    // No file uploaded - use the standard calculation based on annual sales
    const avgOrderValue = currentAOV > 0 ? currentAOV : 50; // Use current AOV if available, otherwise default to $50
    const transactionsCount = annualSales / avgOrderValue;
    const transactionFee = 0.30;
    
    // Use the selected plan's standard domestic rate and Plus plan's rate
    const basicRate = processingRates[basePlan].standardDomestic;
    const plusRate = processingRates.plus.standardDomestic;
    
    const basicProcessingFee = (annualSales * basicRate / 100) + (transactionFee * transactionsCount);
    const plusProcessingFee = (annualSales * plusRate / 100) + (transactionFee * transactionsCount);
    
    return {
      basicProcessingFee,
      plusProcessingFee
    };
  }
};

/**
 * Calculate Revenue Uplift with different scenarios using completed checkout sessions
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
  // If we have checkout data, use it as the baseline
  if (reachedCheckout > 0 && completedCheckout > 0) {
    // Calculate current revenue from completed checkouts
    const currentMonthlyRevenue = completedCheckout * currentAOV;
    
    // Use configurable percentages for uplift scenarios
    // Low uplift scenario
    const lowCR = currentConversionRate * (1 + lowUpliftPercentage / 100);
    const lowAOV = currentAOV * (1 + lowUpliftPercentage / 100);
    
    // Calculate improved completed checkouts based on improved CR
    const lowImprovedCompleted = reachedCheckout * (lowCR / 100);
    const lowMonthlyRevenue = lowImprovedCompleted * lowAOV;
    const lowUplift = lowMonthlyRevenue - currentMonthlyRevenue;
    
    // Average uplift scenario
    const avgCR = currentConversionRate * (1 + averageUpliftPercentage / 100);
    const avgAOV = currentAOV * (1 + averageUpliftPercentage / 100);
    
    const avgImprovedCompleted = reachedCheckout * (avgCR / 100);
    const avgMonthlyRevenue = avgImprovedCompleted * avgAOV;
    const avgUplift = avgMonthlyRevenue - currentMonthlyRevenue;
    
    // Good uplift scenario
    const goodCR = currentConversionRate * (1 + goodUpliftPercentage / 100);
    const goodAOV = currentAOV * (1 + goodUpliftPercentage / 100);
    
    const goodImprovedCompleted = reachedCheckout * (goodCR / 100);
    const goodMonthlyRevenue = goodImprovedCompleted * goodAOV;
    const goodUplift = goodMonthlyRevenue - currentMonthlyRevenue;
    
    setMonthlyUpliftLow(lowUplift);
    setMonthlyUpliftAverage(avgUplift);
    setMonthlyUpliftGood(goodUplift);
    
    // Annualized uplift (average scenario * 12) for the existing total calculation
    return avgUplift * 12;
  } else {
    // Fallback to original calculation when no checkout data is available
    // Calculate monthly base metrics
    const monthlyVisitors = (annualSales / 12) / (currentAOV * (currentConversionRate / 100));

    // Use configurable percentages
    // Low uplift scenario
    const lowCR = currentConversionRate * (1 + lowUpliftPercentage / 100);
    const lowAOV = currentAOV * (1 + lowUpliftPercentage / 100);
    const currentMonthlyRevenue = monthlyVisitors * currentConversionRate / 100 * currentAOV;
    const lowMonthlyRevenue = monthlyVisitors * lowCR / 100 * lowAOV;
    const lowUplift = lowMonthlyRevenue - currentMonthlyRevenue;
    
    // Average uplift scenario
    const avgCR = currentConversionRate * (1 + averageUpliftPercentage / 100);
    const avgAOV = currentAOV * (1 + averageUpliftPercentage / 100);
    const avgMonthlyRevenue = monthlyVisitors * avgCR / 100 * avgAOV;
    const avgUplift = avgMonthlyRevenue - currentMonthlyRevenue;
    
    // Good uplift scenario
    const goodCR = currentConversionRate * (1 + goodUpliftPercentage / 100);
    const goodAOV = currentAOV * (1 + goodUpliftPercentage / 100);
    const goodMonthlyRevenue = monthlyVisitors * goodCR / 100 * goodAOV;
    const goodUplift = goodMonthlyRevenue - currentMonthlyRevenue;
    
    setMonthlyUpliftLow(lowUplift);
    setMonthlyUpliftAverage(avgUplift);
    setMonthlyUpliftGood(goodUplift);
    
    // Annualized uplift (average scenario * 12) for the existing total calculation
    return avgUplift * 12;
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
