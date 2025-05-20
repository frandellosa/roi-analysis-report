
export interface CalculatorState {
  annualSales: number;
  setAnnualSales: (value: number) => void;
  effectivePlusMonthlyCost: number;
  selectedPlan: string;
  plusTerm: string;
  setPlusTerm: (value: string) => void;
  d2cPercentage: number;
  b2bPercentage: number;
  retailPercentage: number;
  d2cRate: number;
  setD2cRate: (value: number) => void;
  b2bRate: number;
  setB2bRate: (value: number) => void;
  retailRate: number;
  setRetailRate: (value: number) => void;
  d2cVpf: number;
  b2bVpf: number;
  retailVpf: number;
  vpfMonthly: number;
  currentConversionRate: number;
  setCurrentConversionRate: (value: number) => void;
  currentAOV: number;
  setCurrentAOV: (value: number) => void;
  monthlyUpliftLow: number;
  monthlyUpliftAverage: number;
  monthlyUpliftGood: number;
  reachedCheckout: number;
  setReachedCheckout: (value: number) => void;
  completedCheckout: number;
  setCompletedCheckout: (value: number) => void;
  basicAnnualCost: number;
  plusAnnualCost: number;
  feeSavings: number;
  annualSavings: number;
  plans: Record<string, any>;
  processingRates: processingRatesType;
  handlePlanChange: (value: string) => void;
  handleTermChange: (value: string) => void;
  handleSalesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSliderChange: (value: number[]) => void;
  handleD2CChange: (value: number) => void;
  handleB2BChange: (value: number) => void;
  handleRateChange: (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<number>>) => void;
  handleCheckoutChange: (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<number>>) => void;
  formatCurrency: (amount: number) => string;
  setMonthlyUpliftLow: (value: number) => void;
  setMonthlyUpliftAverage: (value: number) => void;
  setMonthlyUpliftGood: (value: number) => void;
  resetCalculator: () => void;
  calculateROI: () => void;
  basicMonthlyCost?: number;
  plusMonthlyCost?: number;
}

export interface ProcessingRate {
  standardDomestic: number;
  standardInternational: number;
  premiumDomestic: number;
  premiumInternational: number;
  shopPayInstallments: number;
  transactionFee: number; // Added transaction fee
}

export interface processingRatesType {
  [key: string]: ProcessingRate;
}

export interface DefaultValues {
  annualSales: number;
  basicMonthlyCost: number;
  plusMonthlyCost: number;
  d2cPercentage: number;
  b2bPercentage: number;
  retailPercentage: number;
  currentConversionRate: number;
  currentAOV: number;
  plusTerm: string;
  d2cRate: number;
  b2bRate: number;
  retailRate: number;
  reachedCheckout: number;
  completedCheckout: number;
}
