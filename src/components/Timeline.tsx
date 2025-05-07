
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
  Legend,
  Area,
  ComposedChart,
} from "recharts";
import { useCalculatorContext } from "@/contexts/CalculatorContext";

const Timeline = () => {
  // Use values from calculator context
  const { 
    annualSales, 
    basicFeeRate, 
    plusFeeRate,
    basicMonthlyCost,
    effectivePlusMonthlyCost,
    monthlyUpliftAverage
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
  
  // Create data for the chart, now incorporating uplift
  const data = Array.from({ length: 13 }, (_, i) => {
    const month = i;
    const basicCost = month * (basicMonthlyCost + basicMonthlyProcessingFee);
    const plusCost = month * (effectivePlusMonthlyCost + plusMonthlyProcessingFee);
    const netCost = plusCost - basicCost;
    const uplift = month * monthlyUpliftAverage;
    const netWithUplift = netCost - uplift;
    const projectedRevenueUplift = month > 0 ? monthlyUpliftAverage : 0;
    
    return {
      month: month === 0 ? "Start" : `Month ${month}`,
      netCost: Math.round(netCost),
      uplift: Math.round(uplift),
      netWithUplift: Math.round(netWithUplift),
      savings: Math.round(month * monthlyProcessingSavings),
      projectedRevenueUplift: Math.round(projectedRevenueUplift),
    };
  });
  
  // Find breakeven point without uplift
  const monthlyAdditionalCost = effectivePlusMonthlyCost - basicMonthlyCost;
  const breakevenMonth = Math.ceil(monthlyAdditionalCost / monthlyProcessingSavings);
  
  // Find breakeven point with uplift
  const breakevenWithUpliftMonth = data.findIndex(item => item.netWithUplift <= 0);
  
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-shopify-black mb-4 font-shopify">ROI Timeline</h2>
          <p className="text-shopify-muted max-w-2xl mx-auto">
            See how your investment in Shopify Plus pays off over time as transaction fee savings and conversion uplift accumulate.
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
                <ComposedChart
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
                    yAxisId="left"
                    tickFormatter={(value) => `$${Math.abs(Number(value) / 1000)}k`}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => `$${Math.abs(Number(value) / 1000)}k`}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === "Projected Monthly Revenue Uplift") {
                        return [`$${Math.abs(Number(value)).toLocaleString()}`, name];
                      }
                      return [`$${Math.abs(Number(value)).toLocaleString()}`, Number(value) < 0 ? "Net Savings" : "Net Cost"];
                    }}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Legend />
                  <ReferenceLine yAxisId="left" y={0} stroke="#000" strokeDasharray="3 3" />
                  <ReferenceLine 
                    yAxisId="left"
                    x={`Month ${breakevenMonth}${breakevenMonth <= 0 || !isFinite(breakevenMonth) ? ' (N/A)' : ''}`} 
                    stroke="#008060" 
                    strokeDasharray="3 3" 
                    label={{ value: breakevenMonth <= 0 || !isFinite(breakevenMonth) ? "No Breakeven" : "Breakeven Point", position: "top", fill: "#008060" }}
                  />
                  {breakevenWithUpliftMonth > 0 && breakevenWithUpliftMonth < 12 && (
                    <ReferenceLine 
                      yAxisId="left"
                      x={`Month ${breakevenWithUpliftMonth}`}
                      stroke="#0069FF" 
                      strokeDasharray="3 3" 
                      label={{ value: "Breakeven With Uplift", position: "insideTopRight", fill: "#0069FF" }}
                    />
                  )}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="netCost"
                    stroke="#008060"
                    name="Processing Savings Only"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="netWithUplift"
                    stroke="#0069FF"
                    name="With Conversion Uplift"
                    strokeWidth={2}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="projectedRevenueUplift"
                    fill="#FFC859"
                    fillOpacity={0.6}
                    stroke="#F49342"
                    name="Projected Monthly Revenue Uplift"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-1">Breakeven Point</h4>
                <p className="text-2xl font-bold text-shopify-blue">
                  {breakevenMonth <= 0 || !isFinite(breakevenMonth) ? "Not Applicable" : `Month ${breakevenMonth}`}
                </p>
                <p className="text-xs text-gray-500 mt-1">Based on processing savings only</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium mb-1">Breakeven With Uplift</h4>
                <p className="text-2xl font-bold text-shopify-green">
                  {breakevenWithUpliftMonth <= 0 ? "Immediate" : 
                   breakevenWithUpliftMonth >= 12 ? "Beyond 1 Year" : 
                   `Month ${breakevenWithUpliftMonth}`}
                </p>
                <p className="text-xs text-gray-500 mt-1">Including conversion rate improvements</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-medium mb-1">Monthly Uplift</h4>
                <p className="text-2xl font-bold text-amber-600">
                  ${Math.round(monthlyUpliftAverage).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">From improved conversion rate & AOV</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Timeline;
