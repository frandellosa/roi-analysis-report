
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  BadgeDollarSign, 
  ChartBarIncreasing, 
  Wallet 
} from "lucide-react";

const Stats = () => {
  // Use the same constants as in ROICalculator for consistency
  const annualSales = 1562954;
  const basicFeeRate = 2.9;
  const plusFeeRate = 2.25;
  
  // Calculate processing fee savings using the same logic
  const avgOrderValue = 50;
  const transactionsCount = annualSales / avgOrderValue;
  const transactionFee = 0.30;
  
  const basicProcessingFee = (annualSales * basicFeeRate / 100) + (transactionFee * transactionsCount);
  const plusProcessingFee = (annualSales * plusFeeRate / 100) + (transactionFee * transactionsCount);
  const processingFeeSavings = basicProcessingFee - plusProcessingFee;
  
  // Calculate savings rate for display
  const savingsRate = ((basicFeeRate - plusFeeRate) * 100) / basicFeeRate;
  
  // Calculate annual net savings (after considering monthly costs)
  const basicMonthlyCost = 39;
  const plusMonthlyCost = 2300;
  const annualNetSavings = processingFeeSavings - ((plusMonthlyCost - basicMonthlyCost) * 12);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

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
          <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="bg-blue-50 p-3 rounded-full mb-4">
                  <BadgeDollarSign className="h-6 w-6 text-shopify-blue" />
                </div>
                <h3 className="text-lg font-medium mb-1">Total Sales (90 days)</h3>
                <p className="text-3xl font-bold text-shopify-black">$468,559</p>
                <p className="text-shopify-muted mt-2 text-sm">Previous Period: $356,389</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="bg-blue-50 p-3 rounded-full mb-4">
                  <TrendingUp className="h-6 w-6 text-shopify-blue" />
                </div>
                <h3 className="text-lg font-medium mb-1">Annual Sales</h3>
                <p className="text-3xl font-bold text-shopify-black">{formatCurrency(annualSales)}</p>
                <p className="text-shopify-muted mt-2 text-sm">Based on last 365 days</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="bg-green-50 p-3 rounded-full mb-4">
                  <ChartBarIncreasing className="h-6 w-6 text-shopify-green" />
                </div>
                <h3 className="text-lg font-medium mb-1">Fee Savings Rate</h3>
                <p className="text-3xl font-bold text-shopify-green">{(basicFeeRate - plusFeeRate).toFixed(2)}%</p>
                <p className="text-shopify-muted mt-2 text-sm">Plus vs Basic Plan Difference</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="bg-green-50 p-3 rounded-full mb-4">
                  <Wallet className="h-6 w-6 text-shopify-green" />
                </div>
                <h3 className="text-lg font-medium mb-1">Annual Net Savings</h3>
                <p className="text-3xl font-bold text-shopify-green">{formatCurrency(annualNetSavings)}</p>
                <p className="text-shopify-muted mt-2 text-sm">After monthly plan costs</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Stats;
