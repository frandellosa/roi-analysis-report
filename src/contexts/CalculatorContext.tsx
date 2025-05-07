
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
  updateCalculatorValues: (values: Partial<Omit<CalculatorContextType, 'updateCalculatorValues'>>) => void;
};

const defaultValues: CalculatorContextType = {
  annualSales: 1562954,
  basicFeeRate: 2.9,
  plusFeeRate: 2.25,
  basicMonthlyCost: 39,
  plusMonthlyCost: 2300,
  effectivePlusMonthlyCost: 2300,
  processingFeeSavings: 0,
  annualNetSavings: 0,
  updateCalculatorValues: () => {},
};

const CalculatorContext = createContext<CalculatorContextType>(defaultValues);

export const useCalculatorContext = () => useContext(CalculatorContext);

export const CalculatorProvider = ({ children }: { children: ReactNode }) => {
  const [calculatorValues, setCalculatorValues] = useState<Omit<CalculatorContextType, 'updateCalculatorValues'>>(
    {
      annualSales: defaultValues.annualSales,
      basicFeeRate: defaultValues.basicFeeRate,
      plusFeeRate: defaultValues.plusFeeRate,
      basicMonthlyCost: defaultValues.basicMonthlyCost,
      plusMonthlyCost: defaultValues.plusMonthlyCost,
      effectivePlusMonthlyCost: defaultValues.effectivePlusMonthlyCost,
      processingFeeSavings: defaultValues.processingFeeSavings,
      annualNetSavings: defaultValues.annualNetSavings,
    }
  );

  const updateCalculatorValues = (values: Partial<Omit<CalculatorContextType, 'updateCalculatorValues'>>) => {
    setCalculatorValues(prev => ({ ...prev, ...values }));
  };

  return (
    <CalculatorContext.Provider value={{ ...calculatorValues, updateCalculatorValues }}>
      {children}
    </CalculatorContext.Provider>
  );
};
