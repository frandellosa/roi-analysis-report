
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { allPlans } from '@/components/comparison/PlanData';
import { Plan } from '@/components/comparison/types';
import { processingRatesType } from '@/types/calculator';

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
  processingRates: processingRatesType;
  updateCalculatorValues: (values: Partial<Omit<CalculatorContextType, 'updateCalculatorValues' | 'updateSelectedPlan' | 'plans' | 'updatePlanFeature' | 'processingRates' | 'updateProcessingRate'>>) => void;
  updateSelectedPlan: (plan: string) => void;
  updatePlanFeature: (planId: string, featureIndex: number, newText: string) => void;
  updateProcessingRate: (planId: string, rateType: string, newValue: number) => void;
};

// Default processing rates
const defaultProcessingRates: processingRatesType = {
  basic: {
    standardDomestic: 2.9,
    standardInternational: 3.9,
    premiumDomestic: 3.5,
    premiumInternational: 4.5,
    shopPayInstallments: 5.9
  },
  shopify: {
    standardDomestic: 2.7,
    standardInternational: 3.7,
    premiumDomestic: 3.3,
    premiumInternational: 4.3,
    shopPayInstallments: 5.9
  },
  advanced: {
    standardDomestic: 2.5,
    standardInternational: 3.5,
    premiumDomestic: 3.1,
    premiumInternational: 4.1,
    shopPayInstallments: 5.9
  },
  plus: {
    standardDomestic: 2.25,
    standardInternational: 3.25,
    premiumDomestic: 2.95,
    premiumInternational: 3.95,
    shopPayInstallments: 5.0
  }
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
  processingRates: defaultProcessingRates,
  updateCalculatorValues: () => {},
  updateSelectedPlan: () => {},
  updatePlanFeature: () => {},
  updateProcessingRate: () => {},
};

const CalculatorContext = createContext<CalculatorContextType>(defaultValues);

export const useCalculatorContext = () => useContext(CalculatorContext);

export const CalculatorProvider = ({ children }: { children: ReactNode }) => {
  const [calculatorValues, setCalculatorValues] = useState<Omit<CalculatorContextType, 'updateCalculatorValues' | 'updateSelectedPlan' | 'updatePlanFeature' | 'updateProcessingRate'>>(
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
      processingRates: JSON.parse(JSON.stringify(defaultProcessingRates)), // Deep clone to avoid mutations
    }
  );

  const updateCalculatorValues = (values: Partial<Omit<CalculatorContextType, 'updateCalculatorValues' | 'updateSelectedPlan' | 'plans' | 'updatePlanFeature' | 'processingRates' | 'updateProcessingRate'>>) => {
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

  const updateProcessingRate = (planId: string, rateType: string, newValue: number) => {
    setCalculatorValues(prev => {
      const newRates = { ...prev.processingRates };
      if (newRates[planId] && rateType in newRates[planId]) {
        newRates[planId] = {
          ...newRates[planId],
          [rateType]: newValue
        };
      }
      return { ...prev, processingRates: newRates };
    });
  };

  return (
    <CalculatorContext.Provider value={{ 
      ...calculatorValues, 
      updateCalculatorValues,
      updateSelectedPlan,
      updatePlanFeature,
      updateProcessingRate
    }}>
      {children}
    </CalculatorContext.Provider>
  );
};
