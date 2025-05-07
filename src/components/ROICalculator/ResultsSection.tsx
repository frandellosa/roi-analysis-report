
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useCalculatorContext } from '@/contexts/CalculatorContext';

const ResultsSection = () => {
  const { 
    annualSales, 
    basicFeeRate, 
    plusFeeRate, 
    basicMonthlyCost,
    effectivePlusMonthlyCost,
    processingFeeSavings, 
    annualNetSavings
  } = useCalculatorContext();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <Card className="border-gray-100 shadow-md bg-gray-50">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-6">ROI Results</h3>
        
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-4">
            <h4 className="text-lg font-medium mb-2">Annual Processing Fee Savings</h4>
            <p className="text-3xl font-bold text-shopify-green">{formatCurrency(processingFeeSavings)}</p>
            <p className="text-sm text-shopify-muted mt-1">Difference in transaction fees only</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-4">
            <h4 className="text-lg font-medium mb-2">Net Annual Savings</h4>
            <p className={`text-3xl font-bold ${annualNetSavings > 0 ? 'text-shopify-green' : 'text-red-500'}`}>
              {formatCurrency(annualNetSavings)}
            </p>
            <p className="text-sm text-shopify-muted mt-1">After subtracting higher plan costs</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsSection;
