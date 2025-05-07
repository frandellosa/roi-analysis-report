
import { formatCurrency } from "@/utils/formatters";

interface FeeSavingsComparisonProps {
  processingFeeSavings: number;
}

export const FeeSavingsComparison = ({ processingFeeSavings }: FeeSavingsComparisonProps) => {
  return (
    <div className="grid grid-cols-3 bg-gray-50">
      <div className="p-6">
        <p className="font-bold text-shopify-black">Fee Savings</p>
      </div>
      <div className="p-6 border-l text-center">
        <p className="font-bold text-xl text-shopify-black">$0</p>
      </div>
      <div className="p-6 border-l text-center bg-blue-50">
        <p className="font-bold text-xl text-shopify-green">{formatCurrency(processingFeeSavings)}</p>
        <p className="text-sm text-shopify-muted mt-1">Annual processing fee savings</p>
      </div>
    </div>
  );
};
