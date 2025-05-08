
import { Card, CardContent } from "@/components/ui/card";
import { useCalculatorContext } from "@/contexts/CalculatorContext";

interface ProcessingRatesTableProps {
  processingRates: {
    [key: string]: {
      standardDomestic: number;
      standardInternational: number;
      premiumDomestic: number;
      premiumInternational: number;
      shopPayInstallments: number;
    }
  };
  selectedPlan: string;
}

export const ProcessingRatesTable = ({ processingRates, selectedPlan }: ProcessingRatesTableProps) => {
  // Extract the base plan name (removing any billing suffix)
  const basePlan = selectedPlan.split('-')[0];
  
  // Get context values to ensure we're using the correct rates
  const { basicFeeRate, plusFeeRate } = useCalculatorContext();
  
  const formatPlanName = (plan: string): string => {
    switch(plan) {
      case 'basic': return 'Basic';
      case 'shopify': return 'Grow';
      case 'advanced': return 'Advanced';
      default: return plan.charAt(0).toUpperCase() + plan.slice(1);
    }
  };

  return (
    <Card className="border-gray-100 shadow-md">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Credit Card Processing Rate Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{formatPlanName(basePlan)}</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plus</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm">Standard Domestic</td>
                <td className="px-4 py-2 text-sm">{processingRates[basePlan].standardDomestic}% + 30¢</td>
                <td className="px-4 py-2 text-sm">{processingRates.plus.standardDomestic}% + 30¢</td>
                <td className="px-4 py-2 text-sm text-green-600">{(processingRates[basePlan].standardDomestic - processingRates.plus.standardDomestic).toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">Standard International</td>
                <td className="px-4 py-2 text-sm">{processingRates[basePlan].standardInternational}% + 30¢</td>
                <td className="px-4 py-2 text-sm">{processingRates.plus.standardInternational}% + 30¢</td>
                <td className="px-4 py-2 text-sm text-green-600">{(processingRates[basePlan].standardInternational - processingRates.plus.standardInternational).toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">Premium Domestic</td>
                <td className="px-4 py-2 text-sm">{processingRates[basePlan].premiumDomestic}% + 30¢</td>
                <td className="px-4 py-2 text-sm">{processingRates.plus.premiumDomestic}% + 30¢</td>
                <td className="px-4 py-2 text-sm text-green-600">{(processingRates[basePlan].premiumDomestic - processingRates.plus.premiumDomestic).toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">Premium International</td>
                <td className="px-4 py-2 text-sm">{processingRates[basePlan].premiumInternational}% + 30¢</td>
                <td className="px-4 py-2 text-sm">{processingRates.plus.premiumInternational}% + 30¢</td>
                <td className="px-4 py-2 text-sm text-green-600">{(processingRates[basePlan].premiumInternational - processingRates.plus.premiumInternational).toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">Shop Pay Installments</td>
                <td className="px-4 py-2 text-sm">{processingRates[basePlan].shopPayInstallments}% + 30¢</td>
                <td className="px-4 py-2 text-sm">{processingRates.plus.shopPayInstallments}% + 30¢</td>
                <td className="px-4 py-2 text-sm text-green-600">{(processingRates[basePlan].shopPayInstallments - processingRates.plus.shopPayInstallments).toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <p>* Additional rates for Shop Pay Express and other payment methods apply.</p>
          <p>* All rates shown are for USA market.</p>
          <p>* Rates used for calculations: {basicFeeRate.toFixed(1)}% ({formatPlanName(basePlan)}) and {plusFeeRate.toFixed(1)}% (Plus)</p>
        </div>
      </CardContent>
    </Card>
  );
};
