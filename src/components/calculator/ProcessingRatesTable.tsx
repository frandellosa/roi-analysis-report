
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useCalculatorContext } from "@/contexts/CalculatorContext";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { processingRatesType, ProcessingRate } from "@/types/calculator";

interface ProcessingRatesTableProps {
  processingRates: processingRatesType;
  selectedPlan: string;
}

export const ProcessingRatesTable = ({ processingRates, selectedPlan }: ProcessingRatesTableProps) => {
  // Extract the base plan name (removing any billing suffix)
  const basePlan = selectedPlan.split('-')[0];
  
  // Get context values to ensure we're using the correct rates
  const { basicFeeRate, plusFeeRate, updateProcessingRate } = useCalculatorContext();

  // State for tracking which cell is being edited
  const [editingCell, setEditingCell] = useState<{ plan: string, rate: string } | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  
  const formatPlanName = (plan: string): string => {
    switch(plan) {
      case 'basic': return 'Basic';
      case 'shopify': return 'Grow';
      case 'advanced': return 'Advanced';
      default: return plan.charAt(0).toUpperCase() + plan.slice(1);
    }
  };

  const handleCellClick = (plan: string, rate: keyof ProcessingRate) => {
    setEditingCell({ plan, rate });
    setEditValue(processingRates[plan][rate].toString());
  };

  const handleBlur = () => {
    if (editingCell) {
      const { plan, rate } = editingCell;
      const newValue = parseFloat(editValue);
      
      if (!isNaN(newValue) && newValue >= 0 && newValue <= 10) {
        updateProcessingRate(plan, rate, newValue);
        toast.success(`Updated ${rate} rate for ${formatPlanName(plan)}`);
      } else {
        toast.error("Please enter a valid rate between 0 and 10");
        setEditValue(processingRates[plan][rate as keyof ProcessingRate].toString());
      }
      
      setEditingCell(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  // Render a cell with either the value or an input field
  const renderRateCell = (plan: string, rate: keyof ProcessingRate) => {
    const isEditing = editingCell?.plan === plan && editingCell?.rate === rate;
    
    if (isEditing) {
      return (
        <Input
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          min="0"
          max="10"
          step="0.05"
          className="w-24 h-7 p-1 text-sm"
        />
      );
    }
    
    return (
      <span 
        className="cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded transition-colors"
        onClick={() => handleCellClick(plan, rate)}
      >
        {processingRates[plan][rate]}% + 30¢
      </span>
    );
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
                <td className="px-4 py-2 text-sm">{renderRateCell(basePlan, 'standardDomestic')}</td>
                <td className="px-4 py-2 text-sm">{renderRateCell('plus', 'standardDomestic')}</td>
                <td className="px-4 py-2 text-sm text-green-600">{(processingRates[basePlan].standardDomestic - processingRates.plus.standardDomestic).toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">Standard International</td>
                <td className="px-4 py-2 text-sm">{renderRateCell(basePlan, 'standardInternational')}</td>
                <td className="px-4 py-2 text-sm">{renderRateCell('plus', 'standardInternational')}</td>
                <td className="px-4 py-2 text-sm text-green-600">{(processingRates[basePlan].standardInternational - processingRates.plus.standardInternational).toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">Premium Domestic</td>
                <td className="px-4 py-2 text-sm">{renderRateCell(basePlan, 'premiumDomestic')}</td>
                <td className="px-4 py-2 text-sm">{renderRateCell('plus', 'premiumDomestic')}</td>
                <td className="px-4 py-2 text-sm text-green-600">{(processingRates[basePlan].premiumDomestic - processingRates.plus.premiumDomestic).toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">Premium International</td>
                <td className="px-4 py-2 text-sm">{renderRateCell(basePlan, 'premiumInternational')}</td>
                <td className="px-4 py-2 text-sm">{renderRateCell('plus', 'premiumInternational')}</td>
                <td className="px-4 py-2 text-sm text-green-600">{(processingRates[basePlan].premiumInternational - processingRates.plus.premiumInternational).toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">Shop Pay Installments</td>
                <td className="px-4 py-2 text-sm">{renderRateCell(basePlan, 'shopPayInstallments')}</td>
                <td className="px-4 py-2 text-sm">{renderRateCell('plus', 'shopPayInstallments')}</td>
                <td className="px-4 py-2 text-sm text-green-600">{(processingRates[basePlan].shopPayInstallments - processingRates.plus.shopPayInstallments).toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <p>* Additional rates for Shop Pay Express and other payment methods apply.</p>
          <p>* All rates shown are for USA market.</p>
          <p>* Rates used for calculations: {basicFeeRate.toFixed(1)}% ({formatPlanName(basePlan)}) and {plusFeeRate.toFixed(1)}% (Plus)</p>
          <p className="mt-1 italic">Click on any rate to edit it. Changes will be reflected in calculations.</p>
        </div>
      </CardContent>
    </Card>
  );
};
