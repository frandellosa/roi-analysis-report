import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  BadgeDollarSign, 
  ChartBarIncreasing, 
  Wallet 
} from "lucide-react";
import { useCalculatorContext } from "@/contexts/CalculatorContext";
import { formatCurrency } from "@/utils/formatters";
import { StatCard } from "./stats/StatCard";

const Stats = () => {
  // Use values from calculator context
  const { 
    annualSales, 
    basicFeeRate, 
    plusFeeRate, 
    processingFeeSavings, 
    annualNetSavings 
  } = useCalculatorContext();
  
  // Calculate savings rate for display
  const savingsRate = ((basicFeeRate - plusFeeRate) * 100) / basicFeeRate;

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-shopify-black mb-4 font-shopify">Your Business at a Glance</h2>
          <p className="text-shopify-muted max-w-2xl mx-auto">
            Based on your actual sales data and transaction history, we've analyzed the potential impact of switching to Shopify Plus.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={BadgeDollarSign} 
            title="Total Sales (90 days)" 
            value="$468,559"
            previousValue="Previous Period: $356,389"
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
            title={annualNetSavings >= 0 ? "Annual Net Savings" : "Annual Cost to Upgrade"} 
            value={formatCurrency(Math.abs(annualNetSavings))}
            previousValue="After new plan costs"
            valueColor={annualNetSavings >= 0 ? "text-shopify-green" : "text-shopify-black"}
          />
        </div>
      </div>
    </div>
  );
};

export default Stats;
