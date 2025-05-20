
import { useCalculatorContext } from "@/contexts/CalculatorContext";
import { formatCurrency } from "@/utils/formatters";

export const AnnualCostsComparison = () => {
  const { 
    annualSales,
    basicFeeRate,
    plusFeeRate,
    basicMonthlyCost,
    plusMonthlyCost,
    effectivePlusMonthlyCost,
    selectedPlan,
    plans,
    processingRates
  } = useCalculatorContext();

  // Get the base plan name (removing any billing suffix)
  const basePlan = selectedPlan.split('-')[0];

  // Get current transaction fees
  const basicTransactionFee = processingRates[basePlan]?.transactionFee || 0.30;
  const plusTransactionFee = processingRates.plus?.transactionFee || 0.30;

  // Calculate approximate transactions count (use AOV of 50 if not available)
  const estimatedTransactions = annualSales / 50;

  // Calculate processing costs based on annual sales and the selected plan's rate
  const basicProcessingCost = (annualSales * (basicFeeRate / 100)) + (estimatedTransactions * basicTransactionFee);
  const plusProcessingCost = (annualSales * (plusFeeRate / 100)) + (estimatedTransactions * plusTransactionFee);
  
  // Calculate annual plan costs
  const basicAnnualPlanCost = basicMonthlyCost * 12;
  const plusAnnualPlanCost = effectivePlusMonthlyCost * 12;

  return (
    <div className="grid grid-cols-3 border-b bg-gray-50">
      <div className="p-6">
        <p className="font-bold text-shopify-black">Annual Processing Costs</p>
        <p className="text-sm text-shopify-muted">
          {annualSales > 0 
            ? `(Based on ${formatCurrency(annualSales)} annual sales)`
            : "(Based on your annual sales volume)"}
        </p>
      </div>
      <div className="p-6 border-l text-center">
        <p className="font-bold text-xl text-shopify-black">
          {formatCurrency(basicProcessingCost)}
        </p>
        <p className="text-sm text-shopify-muted mt-1">
          + {formatCurrency(basicAnnualPlanCost)}/year plan cost
        </p>
        <p className="text-xs text-shopify-muted mt-1">
          ({basicFeeRate.toFixed(2)}% + ${basicTransactionFee.toFixed(2)} per transaction)
        </p>
      </div>
      <div className="p-6 border-l text-center bg-shopify-light">
        <p className="font-bold text-xl text-shopify-blue">
          {formatCurrency(plusProcessingCost)}
        </p>
        <p className="text-sm text-shopify-muted mt-1">
          + {formatCurrency(plusAnnualPlanCost)}/year plan cost
        </p>
        <p className="text-xs text-shopify-muted mt-1">
          ({plusFeeRate.toFixed(2)}% + ${plusTransactionFee.toFixed(2)} per transaction)
        </p>
      </div>
    </div>
  );
};
