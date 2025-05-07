
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useCalculatorContext } from '@/contexts/CalculatorContext';

const ProcessingRateTable = () => {
  const { basicFeeRate } = useCalculatorContext();
  const [selectedPlan, setSelectedPlan] = useState("basic");
  
  // Processing rates based on the image
  const processingRates = {
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
  
  // Determine selected plan based on basic fee rate
  React.useEffect(() => {
    if (basicFeeRate === 2.9) {
      setSelectedPlan("basic");
    } else if (basicFeeRate === 2.7) {
      setSelectedPlan("shopify");
    } else if (basicFeeRate === 2.5) {
      setSelectedPlan("advanced");
    }
  }, [basicFeeRate]);

  return (
    <Card className="border-gray-100 shadow-md">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Processing Rate Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plus</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm">Standard Domestic</td>
                <td className="px-4 py-2 text-sm">{processingRates[selectedPlan as keyof typeof processingRates].standardDomestic}% + 30¢</td>
                <td className="px-4 py-2 text-sm">{processingRates.plus.standardDomestic}% + 30¢</td>
                <td className="px-4 py-2 text-sm text-green-600">{(processingRates[selectedPlan as keyof typeof processingRates].standardDomestic - processingRates.plus.standardDomestic).toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">Standard International</td>
                <td className="px-4 py-2 text-sm">{processingRates[selectedPlan as keyof typeof processingRates].standardInternational}% + 30¢</td>
                <td className="px-4 py-2 text-sm">{processingRates.plus.standardInternational}% + 30¢</td>
                <td className="px-4 py-2 text-sm text-green-600">{(processingRates[selectedPlan as keyof typeof processingRates].standardInternational - processingRates.plus.standardInternational).toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">Premium Domestic</td>
                <td className="px-4 py-2 text-sm">{processingRates[selectedPlan as keyof typeof processingRates].premiumDomestic}% + 30¢</td>
                <td className="px-4 py-2 text-sm">{processingRates.plus.premiumDomestic}% + 30¢</td>
                <td className="px-4 py-2 text-sm text-green-600">{(processingRates[selectedPlan as keyof typeof processingRates].premiumDomestic - processingRates.plus.premiumDomestic).toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">Premium International</td>
                <td className="px-4 py-2 text-sm">{processingRates[selectedPlan as keyof typeof processingRates].premiumInternational}% + 30¢</td>
                <td className="px-4 py-2 text-sm">{processingRates.plus.premiumInternational}% + 30¢</td>
                <td className="px-4 py-2 text-sm text-green-600">{(processingRates[selectedPlan as keyof typeof processingRates].premiumInternational - processingRates.plus.premiumInternational).toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">Shop Pay Installments</td>
                <td className="px-4 py-2 text-sm">{processingRates[selectedPlan as keyof typeof processingRates].shopPayInstallments}% + 30¢</td>
                <td className="px-4 py-2 text-sm">{processingRates.plus.shopPayInstallments}% + 30¢</td>
                <td className="px-4 py-2 text-sm text-green-600">{(processingRates[selectedPlan as keyof typeof processingRates].shopPayInstallments - processingRates.plus.shopPayInstallments).toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <p>* Additional rates for Shop Pay Express and other payment methods apply.</p>
          <p>* All rates shown are for USA market.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingRateTable;
