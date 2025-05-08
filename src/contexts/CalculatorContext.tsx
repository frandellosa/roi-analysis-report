
import React, { createContext, useState, useContext, ReactNode } from 'react';

type CalculatorContextType = {
  annualSales: number;
  basicFeeRate: number;
  plusFeeRate: number;
  basicMonthlyCost: number;
  plusMonthlyCost: number;
  effectivePlusMonthlyCost: number;
  processingFeeSavings: number;
  annualNetSavings: number;
  projectedUplift: number; 
  monthlyUpliftLow: number;
  monthlyUpliftAverage: number;
  monthlyUpliftGood: number;
  currentConversionRate: number;
  currentAOV: number;
  selectedPlan: string;
  reachedCheckout: number;
  completedCheckout: number;
  // Adding the percentage configurable values
  lowUpliftPercentage: number;
  averageUpliftPercentage: number;
  goodUpliftPercentage: number;
  updateCalculatorValues: (values: Partial<Omit<CalculatorContextType, 'updateCalculatorValues' | 'updateSelectedPlan'>>) => void;
  updateSelectedPlan: (plan: string) => void;
};

const defaultValues: CalculatorContextType = {
  annualSales: 0,
  basicFeeRate: 0,
  plusFeeRate: 0,
  basicMonthlyCost: 0,
  plusMonthlyCost: 0,
  effectivePlusMonthlyCost: 0,
  processingFeeSavings: 0,
  annualNetSavings: 0,
  projectedUplift: 0,
  monthlyUpliftLow: 0,
  monthlyUpliftAverage: 0,
  monthlyUpliftGood: 0,
  currentConversionRate: 0,
  currentAOV: 0,
  selectedPlan: 'basic',
  reachedCheckout: 0,
  completedCheckout: 0,
  lowUpliftPercentage: 5,
  averageUpliftPercentage: 10,
  goodUpliftPercentage: 15, // Changed from 20 to 15
  updateCalculatorValues: () => {},
  updateSelectedPlan: () => {},
};

const CalculatorContext = createContext<CalculatorContextType>(defaultValues);

export const useCalculatorContext = () => useContext(CalculatorContext);

export const CalculatorProvider = ({ children }: { children: ReactNode }) => {
  const [calculatorValues, setCalculatorValues] = useState<Omit<CalculatorContextType, 'updateCalculatorValues' | 'updateSelectedPlan'>>(
    {
      annualSales: defaultValues.annualSales,
      basicFeeRate: defaultValues.basicFeeRate,
      plusFeeRate: defaultValues.plusFeeRate,
      basicMonthlyCost: defaultValues.basicMonthlyCost,
      plusMonthlyCost: defaultValues.plusMonthlyCost,
      effectivePlusMonthlyCost: defaultValues.effectivePlusMonthlyCost,
      processingFeeSavings: defaultValues.processingFeeSavings,
      annualNetSavings: defaultValues.annualNetSavings,
      projectedUplift: defaultValues.projectedUplift,
      monthlyUpliftLow: defaultValues.monthlyUpliftLow,
      monthlyUpliftAverage: defaultValues.monthlyUpliftAverage,
      monthlyUpliftGood: defaultValues.monthlyUpliftGood,
      currentConversionRate: defaultValues.currentConversionRate,
      currentAOV: defaultValues.currentAOV,
      selectedPlan: defaultValues.selectedPlan,
      reachedCheckout: defaultValues.reachedCheckout,
      completedCheckout: defaultValues.completedCheckout,
      lowUpliftPercentage: defaultValues.lowUpliftPercentage,
      averageUpliftPercentage: defaultValues.averageUpliftPercentage,
      goodUpliftPercentage: defaultValues.goodUpliftPercentage,
    }
  );

  const updateCalculatorValues = (values: Partial<Omit<CalculatorContextType, 'updateCalculatorValues' | 'updateSelectedPlan'>>) => {
    setCalculatorValues(prev => ({ ...prev, ...values }));
  };
  
  const updateSelectedPlan = (plan: string) => {
    setCalculatorValues(prev => ({ ...prev, selectedPlan: plan }));
  };

  return (
    <CalculatorContext.Provider value={{ 
      ...calculatorValues, 
      updateCalculatorValues,
      updateSelectedPlan
    }}>
      {children}
    </CalculatorContext.Provider>
  );
};
