
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useCalculatorContext } from "@/contexts/CalculatorContext";

const Timeline = () => {
  // Use values from calculator context
  const { 
    annualSales, 
    basicFeeRate, 
    plusFeeRate,
    basicMonthlyCost,
    effectivePlusMonthlyCost
  } = useCalculatorContext();
  
  // Calculate monthly values
  const monthlySales = annualSales / 12;
  const avgOrderValue = 50;
  const monthlyTransactions = monthlySales / avgOrderValue;
  const transactionFee = 0.30;
  
  // Calculate monthly processing fees
  const basicMonthlyProcessingFee = (monthlySales * basicFeeRate / 100) + (transactionFee * monthlyTransactions);
  const plusMonthlyProcessingFee = (monthlySales * plusFeeRate / 100) + (transactionFee * monthlyTransactions);
  const monthlyProcessingSavings = basicMonthlyProcessingFee - plusMonthlyProcessingFee;
  
  // Create data for the chart
  const data = Array.from({ length: 13 }, (_, i) => {
    const month = i;
    const basicCost = month * (basicMonthlyCost + basicMonthlyProcessingFee);
    const plusCost = month * (effectivePlusMonthlyCost + plusMonthlyProcessingFee);
    const netCost = plusCost - basicCost;
    
    return {
      month: month === 0 ? "Start" : `Month ${month}`,
      netCost: Math.round(netCost),
      savings: Math.round(month * monthlyProcessingSavings),
    };
  });
  
  // Find breakeven point - the month where cumulative savings exceed the additional monthly cost
  const monthlyAdditionalCost = effectivePlusMonthlyCost - basicMonthlyCost;
  const breakevenMonth = Math.ceil(monthlyAdditionalCost / monthlyProcessingSavings);
  
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-shopify-black mb-4 font-shopify">ROI Timeline</h2>
          <p className="text-shopify-muted max-w-2xl mx-auto">
            See how your investment in Shopify Plus pays off over time as transaction fee savings accumulate.
          </p>
        </div>
        
        <Card className="border-gray-100 shadow-md">
          <CardContent className="pt-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Projected ROI Timeline</h3>
              <p className="text-shopify-muted">
                Based on your current sales volume of ${(annualSales / 1000000).toFixed(2)}M annually, this chart shows when you'll reach the breakeven point.
              </p>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => `$${Math.abs(Number(value) / 1000)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${Math.abs(Number(value)).toLocaleString()}`, Number(value) < 0 ? "Net Savings" : "Net Cost"]}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />
                  <ReferenceLine 
                    x={`Month ${breakevenMonth}${breakevenMonth <= 0 || !isFinite(breakevenMonth) ? ' (N/A)' : ''}`} 
                    stroke="#008060" 
                    strokeDasharray="3 3" 
                    label={{ value: breakevenMonth <= 0 || !isFinite(breakevenMonth) ? "No Breakeven" : "Breakeven Point", position: "top", fill: "#008060" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="netCost"
                    stroke="#0069FF"
                    name="ROI"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-1">Breakeven Point</h4>
                <p className="text-2xl font-bold text-shopify-blue">
                  {breakevenMonth <= 0 || !isFinite(breakevenMonth) ? "Not Applicable" : `Month ${breakevenMonth}`}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium mb-1">Monthly Savings</h4>
                <p className="text-2xl font-bold text-shopify-green">${Math.round(monthlyProcessingSavings).toLocaleString()}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium mb-1">First Year Net Savings</h4>
                <p className="text-2xl font-bold text-amber-600">
                  ${Math.round(monthlyProcessingSavings * 12 - (effectivePlusMonthlyCost - basicMonthlyCost) * 12).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Timeline;
