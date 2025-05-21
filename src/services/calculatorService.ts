
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
    
    // Calculate projected monthly revenue with improved CR and AOV
    const lowProjectedRevenue = monthlyReachedCheckout * (lowCR / 100) * lowAOV;
    // Calculate current monthly revenue
    const currentMonthlyRevenue = monthlyReachedCheckout * (validConversionRate / 100) * validAOV;
    // Calculate monthly uplift
    const lowMonthlyUplift = lowProjectedRevenue - currentMonthlyRevenue;
    
    // Average uplift scenario
    const avgCR = validConversionRate * (1 + averageUpliftPercentage / 100);
    const avgAOV = validAOV * (1 + averageUpliftPercentage / 100);
    
    const avgProjectedRevenue = monthlyReachedCheckout * (avgCR / 100) * avgAOV;
    const avgMonthlyUplift = avgProjectedRevenue - currentMonthlyRevenue;
    
    // Good uplift scenario
    const goodCR = validConversionRate * (1 + goodUpliftPercentage / 100);
    const goodAOV = validAOV * (1 + goodUpliftPercentage / 100);
    
    const goodProjectedRevenue = monthlyReachedCheckout * (goodCR / 100) * goodAOV;
    const goodMonthlyUplift = goodProjectedRevenue - currentMonthlyRevenue;
    
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

    // Use configurable percentages
    // Low uplift scenario
    const lowCR = validConversionRate * (1 + lowUpliftPercentage / 100);
    const lowAOV = validAOV * (1 + lowUpliftPercentage / 100);
    const currentAnnualRevenue = annualVisitors * validConversionRate / 100 * validAOV;
    const lowAnnualRevenue = annualVisitors * lowCR / 100 * lowAOV;
    const lowUplift = lowAnnualRevenue - currentAnnualRevenue;
    
    // Average uplift scenario
    const avgCR = validConversionRate * (1 + averageUpliftPercentage / 100);
    const avgAOV = validAOV * (1 + averageUpliftPercentage / 100);
    const avgAnnualRevenue = annualVisitors * avgCR / 100 * avgAOV;
    const avgUplift = avgAnnualRevenue - currentAnnualRevenue;
    
    // Good uplift scenario
    const goodCR = validConversionRate * (1 + goodUpliftPercentage / 100);
    const goodAOV = validAOV * (1 + goodUpliftPercentage / 100);
    const goodAnnualRevenue = annualVisitors * goodCR / 100 * goodAOV;
    const goodUplift = goodAnnualRevenue - currentAnnualRevenue;
    
    // Convert annual uplift to monthly for display
    setMonthlyUpliftLow(lowUplift / 12);
    setMonthlyUpliftAverage(avgUplift / 12);
    setMonthlyUpliftGood(goodUplift / 12);
    
    // Return annual uplift (average scenario) for the existing total calculation
    return avgUplift;
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
