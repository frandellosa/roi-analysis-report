
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

const Timeline = () => {
  // Calculate monthly costs and savings
  const basicMonthly = 39;
  const plusMonthly = 2300;
  const monthlySales = 1562954 / 12; // Annual sales divided by 12
  const monthlySavingRate = 0.005; // 0.5% savings
  
  // Create data for the chart
  const data = Array.from({ length: 13 }, (_, i) => {
    const month = i;
    const basicCost = month * basicMonthly;
    const plusCost = month * plusMonthly;
    const processingFeeSavings = month * (monthlySales * monthlySavingRate);
    const netCost = plusCost - basicCost - processingFeeSavings;
    
    return {
      month: month === 0 ? "Start" : `Month ${month}`,
      netCost: Math.round(netCost),
      savings: Math.round(processingFeeSavings),
    };
  });
  
  // Find breakeven point
  const breakevenMonth = Math.ceil((plusMonthly - basicMonthly) / (monthlySales * monthlySavingRate));
  
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
                Based on your current sales volume of $1.56M annually, this chart shows when you'll reach the breakeven point.
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
                    tickFormatter={(value) => `$${Math.abs(value / 1000)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${Math.abs(value).toLocaleString()}`, value < 0 ? "Net Savings" : "Net Cost"]}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />
                  <ReferenceLine 
                    x={`Month ${breakevenMonth}`} 
                    stroke="#008060" 
                    strokeDasharray="3 3" 
                    label={{ value: "Breakeven Point", position: "top", fill: "#008060" }}
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
                <p className="text-2xl font-bold text-shopify-blue">Month {breakevenMonth}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium mb-1">Monthly Savings</h4>
                <p className="text-2xl font-bold text-shopify-green">${Math.round(monthlySales * monthlySavingRate).toLocaleString()}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium mb-1">First Year Net Savings</h4>
                <p className="text-2xl font-bold text-amber-600">
                  ${Math.round((monthlySales * monthlySavingRate * 12) - ((plusMonthly - basicMonthly) * 12)).toLocaleString()}
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
