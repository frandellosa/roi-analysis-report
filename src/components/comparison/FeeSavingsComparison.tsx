
import { useCalculatorContext } from "@/contexts/CalculatorContext";
import { formatCurrency } from "@/utils/formatters";

interface FeeSavingsComparisonProps {
  processingFeeSavings: number;
}

export const FeeSavingsComparison = ({ processingFeeSavings }: FeeSavingsComparisonProps) => {
  const { 
    basicFeeRate, 
    plusFeeRate, 
    processingRates, 
    selectedPlan 
  } = useCalculatorContext();
  
  // Get the base plan name (removing any billing suffix)
  const basePlan = selectedPlan.split('-')[0];
  
  // Calculate percentage savings on the rate with null checks
  const savingsPercentage = basicFeeRate && plusFeeRate ? 
    ((basicFeeRate - plusFeeRate) / basicFeeRate * 100).toFixed(2) : "0.00";
  
  // Get transaction fee savings - with null checks
  const basicTransactionFee = processingRates[basePlan]?.transactionFee || 0.30;
  const plusTransactionFee = processingRates.plus?.transactionFee || 0.30;
  const transactionFeeSavings = basicTransactionFee - plusTransactionFee;
  
  return (
    <div className="grid grid-cols-3 bg-gray-50">
      <div className="p-6">
        <p className="font-bold text-shopify-black">Fee Savings</p>
        <p className="text-sm text-shopify-muted">
          ({savingsPercentage}% rate reduction
          {transactionFeeSavings > 0 ? ` + $${transactionFeeSavings.toFixed(2)} per transaction` : ""})
        </p>
      </div>
      <div className="p-6 border-l text-center">
        <p className="font-bold text-xl text-shopify-black">$0</p>
      </div>
      <div className="p-6 border-l text-center bg-shopify-light">
        <p className="font-bold text-xl text-shopify-green">{formatCurrency(processingFeeSavings)}</p>
        <p className="text-sm text-shopify-muted mt-1">Annual processing fee savings</p>
      </div>
    </div>
  );
};
