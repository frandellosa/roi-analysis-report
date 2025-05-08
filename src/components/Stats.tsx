
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  BadgeDollarSign, 
  ChartBarIncreasing, 
  Wallet,
  ShoppingCart
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
  
  // Calculate 90-day savings (quarterly)
  const quarterlySavings = annualNetSavings / 4;
  
  // Calculate quarterly uplift (90-day uplift)
  const quarterlyUplift = monthlyUpliftAverage * 3;
  
  // Combined quarterly savings + uplift
  const combinedQuarterlySavings = quarterlySavings + quarterlyUplift;

  // Calculate checkout drop-off metrics
  const dropOffRate = reachedCheckout > 0 
    ? ((reachedCheckout - completedCheckout) / reachedCheckout) * 100 
    : 0;
  const potentialRevenueLost = (reachedCheckout - completedCheckout) * currentAOV;

  return (
    <div className="bg-white py-16" id="business-stats">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="shopify-heading">Your Business at a Glance</h2>
          <p className="shopify-subheading">
            Based on your actual sales data and transaction history, we've analyzed the potential impact of switching to Shopify Plus.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            icon={ChartBarIncreasing} 
            title="Fee Savings Rate" 
            value={`${(basicFeeRate - plusFeeRate).toFixed(2)}%`}
            previousValue="Plus vs Basic Plan Difference"
            valueColor="text-shopify-green"
          />
          
          <StatCard 
            icon={Wallet} 
            title="Last 90 Days Savings + Uplift" 
            value={formatCurrency(combinedQuarterlySavings)}
            previousValue="Fee savings and revenue gain"
            valueColor={combinedQuarterlySavings >= 0 ? "text-shopify-green" : "text-shopify-black"}
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
