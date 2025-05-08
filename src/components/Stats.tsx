
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  BadgeDollarSign, 
  ChartBarIncreasing, 
  Wallet,
  CreditCard
} from "lucide-react";
import { useCalculatorContext } from "@/contexts/CalculatorContext";
import { formatCurrency } from "@/utils/formatters";
import { StatCard } from "./stats/StatCard";
import { CheckoutLossCard } from "./stats/CheckoutLossCard";

const Stats = () => {
  // Use values from calculator context
  const { 
    annualSales, 
    basicFeeRate, 
    plusFeeRate, 
    processingFeeSavings,
    basicMonthlyCost,
    plusMonthlyCost,
    annualNetSavings,
    monthlyUpliftAverage,
    reachedCheckout,
    completedCheckout,
    currentAOV
  } = useCalculatorContext();
  
  // Calculate savings rate for display
  const savingsRate = ((basicFeeRate - plusFeeRate) * 100) / basicFeeRate;

  // Calculate quarterly sales (90 days) from annual sales
  const quarterlySales = annualSales / 4;
  
  // Calculate plan cost difference
  const annualPlanDifference = (plusMonthlyCost - basicMonthlyCost) * 12;
  
  // Calculate the correct net annual savings
  const netAnnualSavings = processingFeeSavings - annualPlanDifference;
  
  // Calculate checkout drop-off metrics
  const dropOffRate = reachedCheckout > 0 
    ? ((reachedCheckout - completedCheckout) / reachedCheckout) * 100 
    : 0;
  const potentialRevenueLost = (reachedCheckout - completedCheckout) * currentAOV;
  
  // Calculate current annual processing fees
  const currentAnnualProcessingFees = (annualSales * basicFeeRate / 100);

  return (
    <div className="bg-white py-16" id="business-stats">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="shopify-heading">Your Business at a Glance</h2>
          <p className="shopify-subheading">
            Based on your actual sales data and transaction history, we've analyzed the potential impact of switching to Shopify Plus.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            icon={BadgeDollarSign} 
            title="Quarterly Sales" 
            value={formatCurrency(quarterlySales)}
            previousValue="Based on quarterly average"
          />
          
          <StatCard 
            icon={TrendingUp} 
            title="Annual Sales" 
            value={formatCurrency(annualSales)}
            previousValue="Based on last 365 days"
          />
          
          <StatCard 
            icon={CreditCard} 
            title="Annual Processing Fees" 
            value={formatCurrency(currentAnnualProcessingFees)}
            previousValue="At current plan rate"
            valueColor="text-shopify-black"
          />
        </div>

        <div className="mt-12">
          <CheckoutLossCard
            dropOffRate={dropOffRate}
            potentialRevenueLost={potentialRevenueLost}
            reachedCheckout={reachedCheckout}
            completedCheckout={completedCheckout}
          />
        </div>
      </div>
    </div>
  );
};

export default Stats;
