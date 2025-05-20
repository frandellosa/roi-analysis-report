
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
    // Make sure the plan and rate exist before setting editing state
    if (processingRates[plan] && rate in processingRates[plan]) {
      setEditingCell({ plan, rate });
      setEditValue(processingRates[plan][rate].toString());
    }
  };

  const handleBlur = () => {
    if (editingCell) {
      const { plan, rate } = editingCell;
      const newValue = parseFloat(editValue);
      
      if (!isNaN(newValue) && newValue >= 0) {
        // Apply different validation based on rate type
        if (rate === 'transactionFee') {
          // For transaction fees, allow values between 0 and 1
          if (newValue <= 1) {
            updateProcessingRate(plan, rate, newValue);
            toast.success(`Updated ${rate} for ${formatPlanName(plan)}`);
          } else {
            toast.error("Please enter a valid transaction fee between 0 and 1");
            // Only set if the value exists
            if (processingRates[plan] && processingRates[plan][rate as keyof ProcessingRate]) {
              setEditValue(processingRates[plan][rate as keyof ProcessingRate].toString());
            }
          }
        } else {
          // For percentage rates, allow values between 0 and 10
          if (newValue <= 10) {
            updateProcessingRate(plan, rate, newValue);
            toast.success(`Updated ${rate} for ${formatPlanName(plan)}`);
          } else {
            toast.error("Please enter a valid rate between 0 and 10");
            // Only set if the value exists
            if (processingRates[plan] && processingRates[plan][rate as keyof ProcessingRate]) {
              setEditValue(processingRates[plan][rate as keyof ProcessingRate].toString());
            }
          }
        }
      } else {
        toast.error("Please enter a valid number");
        // Only set if the value exists
        if (processingRates[plan] && processingRates[plan][rate as keyof ProcessingRate]) {
          setEditValue(processingRates[plan][rate as keyof ProcessingRate].toString());
        }
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
    // Check if the plan and rate exist in processingRates
    if (!processingRates[plan] || !(rate in processingRates[plan])) {
      return <span>N/A</span>;
    }
    
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
          max={rate === 'transactionFee' ? "1" : "10"}
          step={rate === 'transactionFee' ? "0.01" : "0.05"}
          className="w-24 h-7 p-1 text-sm"
        />
      );
    }
    
    // Display with appropriate format based on rate type
    if (rate === 'transactionFee') {
      return (
        <span 
          className="cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded transition-colors"
          onClick={() => handleCellClick(plan, rate)}
        >
          ${processingRates[plan][rate]?.toFixed(2) || "0.00"}
        </span>
      );
    }
    
    // Make sure to check if transactionFee exists before accessing it
    const transactionFee = processingRates[plan].transactionFee;
    const formattedTransactionFee = transactionFee !== undefined ? transactionFee.toFixed(2) : "0.00";
    
    return (
      <span 
        className="cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded transition-colors"
        onClick={() => handleCellClick(plan, rate)}
      >
        {processingRates[plan][rate]}% + ${formattedTransactionFee}
      </span>
    );
  };

  // Render transaction fee cell separately
  const renderTransactionFeeCell = (plan: string) => {
    const rate = 'transactionFee';
    
    // Check if the plan and rate exist in processingRates
    if (!processingRates[plan] || !(rate in processingRates[plan])) {
      return <span>N/A</span>;
    }
    
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
          max="1"
          step="0.01"
          className="w-24 h-7 p-1 text-sm"
        />
      );
    }
    
    return (
      <span 
        className="cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded transition-colors"
        onClick={() => handleCellClick(plan, rate)}
      >
        ${processingRates[plan][rate]?.toFixed(2) || "0.00"}
      </span>
    );
  };

  // Calculate savings for display
  const calculateSavings = (rate: keyof ProcessingRate) => {
    if (!processingRates[basePlan] || !processingRates.plus || 
        !(rate in processingRates[basePlan]) || !(rate in processingRates.plus)) {
      return 'N/A';
    }

    if (rate === 'transactionFee') {
      const basicRate = processingRates[basePlan][rate];
      const plusRate = processingRates.plus[rate];
      
      if (basicRate !== undefined && plusRate !== undefined) {
        return '$' + (basicRate - plusRate).toFixed(2);
      }
      return 'N/A';
    } else {
      const basicRate = processingRates[basePlan][rate];
      const plusRate = processingRates.plus[rate];
      
      if (basicRate !== undefined && plusRate !== undefined) {
        return (basicRate - plusRate).toFixed(2) + '%';
      }
      return 'N/A';
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
                <td className="px-4 py-2 text-sm">{renderRateCell(basePlan, 'standardDomestic')}</td>
                <td className="px-4 py-2 text-sm">{renderRateCell('plus', 'standardDomestic')}</td>
                <td className="px-4 py-2 text-sm text-green-600">
                  {calculateSavings('standardDomestic')}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">Standard International</td>
                <td className="px-4 py-2 text-sm">{renderRateCell(basePlan, 'standardInternational')}</td>
                <td className="px-4 py-2 text-sm">{renderRateCell('plus', 'standardInternational')}</td>
                <td className="px-4 py-2 text-sm text-green-600">
                  {calculateSavings('standardInternational')}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">Premium Domestic</td>
                <td className="px-4 py-2 text-sm">{renderRateCell(basePlan, 'premiumDomestic')}</td>
                <td className="px-4 py-2 text-sm">{renderRateCell('plus', 'premiumDomestic')}</td>
                <td className="px-4 py-2 text-sm text-green-600">
                  {calculateSavings('premiumDomestic')}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">Premium International</td>
                <td className="px-4 py-2 text-sm">{renderRateCell(basePlan, 'premiumInternational')}</td>
                <td className="px-4 py-2 text-sm">{renderRateCell('plus', 'premiumInternational')}</td>
                <td className="px-4 py-2 text-sm text-green-600">
                  {calculateSavings('premiumInternational')}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">Shop Pay Installments</td>
                <td className="px-4 py-2 text-sm">{renderRateCell(basePlan, 'shopPayInstallments')}</td>
                <td className="px-4 py-2 text-sm">{renderRateCell('plus', 'shopPayInstallments')}</td>
                <td className="px-4 py-2 text-sm text-green-600">
                  {calculateSavings('shopPayInstallments')}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-2 text-sm font-medium">Transaction Fee</td>
                <td className="px-4 py-2 text-sm">{renderTransactionFeeCell(basePlan)}</td>
                <td className="px-4 py-2 text-sm">{renderTransactionFeeCell('plus')}</td>
                <td className="px-4 py-2 text-sm text-green-600">
                  {calculateSavings('transactionFee')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <p>* Additional rates for Shop Pay Express and other payment methods apply.</p>
          <p>* All rates shown are for USA market.</p>
          <p>* Rates used for calculations: {basicFeeRate?.toFixed(1) || "0.0"}% ({formatPlanName(basePlan)}) and {plusFeeRate?.toFixed(1) || "0.0"}% (Plus)</p>
          <p className="mt-1 italic">Click on any rate to edit it. Changes will be reflected in calculations.</p>
        </div>
      </CardContent>
    </Card>
  );
};
