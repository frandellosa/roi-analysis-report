
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { allPlans } from '@/components/comparison/PlanData';
import { Plan } from '@/components/comparison/types';

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
  // Add plan data and methods to update features
  plans: Record<string, Plan>;
  updateCalculatorValues: (values: Partial<Omit<CalculatorContextType, 'updateCalculatorValues' | 'updateSelectedPlan' | 'plans' | 'updatePlanFeature'>>) => void;
  updateSelectedPlan: (plan: string) => void;
  updatePlanFeature: (planId: string, featureIndex: number, newText: string) => void;
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
  plans: allPlans,
  updateCalculatorValues: () => {},
  updateSelectedPlan: () => {},
  updatePlanFeature: () => {},
};

const CalculatorContext = createContext<CalculatorContextType>(defaultValues);

export const useCalculatorContext = () => useContext(CalculatorContext);

export const CalculatorProvider = ({ children }: { children: ReactNode }) => {
  const [calculatorValues, setCalculatorValues] = useState<Omit<CalculatorContextType, 'updateCalculatorValues' | 'updateSelectedPlan' | 'updatePlanFeature'>>(
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
      plans: JSON.parse(JSON.stringify(allPlans)), // Deep clone to avoid mutations
    }
  );

  const updateCalculatorValues = (values: Partial<Omit<CalculatorContextType, 'updateCalculatorValues' | 'updateSelectedPlan' | 'plans' | 'updatePlanFeature'>>) => {
    setCalculatorValues(prev => ({ ...prev, ...values }));
  };
  
  const updateSelectedPlan = (plan: string) => {
    setCalculatorValues(prev => ({ ...prev, selectedPlan: plan }));
  };

  const updatePlanFeature = (planId: string, featureIndex: number, newText: string) => {
    setCalculatorValues(prev => {
      const newPlans = { ...prev.plans };
      if (newPlans[planId] && newPlans[planId].features && featureIndex >= 0 && featureIndex < newPlans[planId].features.length) {
        newPlans[planId] = { 
          ...newPlans[planId], 
          features: [...newPlans[planId].features]
        };
        newPlans[planId].features[featureIndex] = newText;
      }
      return { ...prev, plans: newPlans };
    });
  };

  return (
    <CalculatorContext.Provider value={{ 
      ...calculatorValues, 
      updateCalculatorValues,
      updateSelectedPlan,
      updatePlanFeature
    }}>
      {children}
    </CalculatorContext.Provider>
  );
};
