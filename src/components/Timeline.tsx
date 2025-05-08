
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
import { 
  TrendingUp, 
  Calendar,
  ArrowRight,
} from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart"; 
import { formatCurrency } from "@/utils/formatters";

const Timeline = () => {
  // Use values from calculator context
  const { 
    annualSales, 
    basicFeeRate, 
    plusFeeRate,
    basicMonthlyCost,
    effectivePlusMonthlyCost,
    monthlyUpliftAverage,
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
          <h2 className="text-3xl font-bold text-shopify-black mb-4 font-shopify">Return on Investment Timeline</h2>
          <p className="text-shopify-muted max-w-3xl mx-auto">
            See exactly when your Shopify Plus investment starts paying for itself through reduced fees and improved conversion rates.
          </p>
        </div>
        
        <Card className="border-gray-100 shadow-md">
          <CardContent className="pt-6">
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-shopify-green mr-2" />
                <h3 className="text-xl font-semibold">When Will You Break Even?</h3>
              </div>
              <div className="flex items-center mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="mr-3 bg-blue-100 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-shopify-muted text-sm">
                  Based on your current sales volume of <span className="font-semibold">${(annualSales / 1000000).toFixed(1)}M annually</span>, 
                  this chart shows when your Shopify Plus investment begins to pay off.
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-medium mb-1 text-gray-600">Processing Savings Breakeven</h4>
                  <p className="text-2xl font-bold text-shopify-blue">
                    {breakevenMonth <= 0 || !isFinite(breakevenMonth) ? "Not Applicable" : `Month ${breakevenMonth}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Based on transaction fee savings only</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="font-medium mb-1 text-gray-600">Full ROI Breakeven</h4>
                  <p className="text-2xl font-bold text-shopify-green">
                    {breakevenWithUpliftMonth <= 0 ? "Immediate" : 
                     breakevenWithUpliftMonth >= 12 ? "Beyond Year 1" : 
                     `Month ${breakevenWithUpliftMonth}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Including revenue uplift benefits</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <h4 className="font-medium mb-1 text-gray-600">Monthly Revenue Increase</h4>
                  <p className="text-2xl font-bold text-amber-600">
                    {formatCurrency(Math.round(monthlyUpliftAverage))}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">From improved conversions & AOV</p>
                </div>
              </div>
            </div>
            
            <div className="h-[400px] w-full">
              <ChartContainer
                className="h-[400px]"
                config={{
                  savings: {
                    label: "Processing Savings Only",
                    color: "#008060"
                  },
                  withUplift: {
                    label: "With Revenue Uplift",
                    color: "#0069FF"
                  },
                  uplift: {
                    label: "Monthly Additional Revenue",
                    color: "#F49342"
                  }
                }}
              >
                <ComposedChart
                  data={data}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6B7280"
                    tickLine={false}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="left"
                    tickFormatter={(value) => {
                      const absValue = Math.abs(Number(value));
                      return value < 0 ? `-$${(absValue / 1000).toFixed(0)}k` : `$${(absValue / 1000).toFixed(0)}k`;
                    }}
                    stroke="#6B7280"
                    tickLine={false}
                    axisLine={{ stroke: '#E5E7EB' }}
                    label={{ 
                      value: "Net Investment / Savings", 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: '#6B7280', fontSize: 12 }
                    }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => `$${(Number(value) / 1000).toFixed(0)}k`}
                    stroke="#F49342"
                    tickLine={false}
                    axisLine={{ stroke: '#E5E7EB' }}
                    label={{ 
                      value: "Revenue Uplift", 
                      angle: 90, 
                      position: 'insideRight',
                      style: { textAnchor: 'middle', fill: '#F49342', fontSize: 12 }
                    }}
                  />
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
                            <p className="font-semibold mb-2">{payload[0].payload.month}</p>
                            {payload.map((entry, index) => {
                              const value = Math.abs(Number(entry.value));
                              if (entry.dataKey === "netCost") {
                                return (
                                  <p className="flex justify-between items-center text-xs mb-1" key={index}>
                                    <span className="flex items-center">
                                      <span className="w-2 h-2 inline-block rounded-full bg-[#008060] mr-1"></span>
                                      Fee Savings Only:
                                    </span>
                                    <span className="font-mono ml-4">
                                      {Number(entry.value) < 0 ? 
                                        <span className="text-shopify-green">${value.toLocaleString()} saved</span> : 
                                        <span className="text-red-500">${value.toLocaleString()} cost</span>
                                      }
                                    </span>
                                  </p>
                                );
                              } else if (entry.dataKey === "netWithUplift") {
                                return (
                                  <p className="flex justify-between items-center text-xs mb-1" key={index}>
                                    <span className="flex items-center">
                                      <span className="w-2 h-2 inline-block rounded-full bg-[#0069FF] mr-1"></span>
                                      With Revenue Uplift:
                                    </span>
                                    <span className="font-mono ml-4">
                                      {Number(entry.value) < 0 ? 
                                        <span className="text-shopify-green">${value.toLocaleString()} saved</span> : 
                                        <span className="text-red-500">${value.toLocaleString()} cost</span>
                                      }
                                    </span>
                                  </p>
                                );
                              } else if (entry.dataKey === "projectedRevenueUplift") {
                                return (
                                  <p className="flex justify-between items-center text-xs mb-1" key={index}>
                                    <span className="flex items-center">
                                      <span className="w-2 h-2 inline-block rounded-full bg-[#F49342] mr-1"></span>
                                      Monthly Revenue Increase:
                                    </span>
                                    <span className="font-mono font-semibold ml-4 text-amber-600">
                                      ${value.toLocaleString()}
                                    </span>
                                  </p>
                                );
                              }
                              return null;
                            })}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    align="center"
                    verticalAlign="top"
                    height={36}
                    formatter={(value) => {
                      if (value === "netCost") return "Processing Savings Only";
                      if (value === "netWithUplift") return "With Revenue Uplift";
                      if (value === "projectedRevenueUplift") return "Monthly Revenue Increase";
                      return value;
                    }}
                  />
                  <ReferenceLine yAxisId="left" y={0} stroke="#000" strokeWidth={2} />
                  {breakevenMonth > 0 && breakevenMonth <= 12 && isFinite(breakevenMonth) && (
                    <ReferenceLine 
                      yAxisId="left"
                      x={`Month ${breakevenMonth}`} 
                      stroke="#008060" 
                      strokeDasharray="3 3" 
                      label={{ 
                        value: "Fee Breakeven", 
                        position: "top", 
                        fill: "#008060",
                        fontSize: 12,
                        fontWeight: 500
                      }}
                    />
                  )}
                  {breakevenWithUpliftMonth > 0 && breakevenWithUpliftMonth < 12 && (
                    <ReferenceLine 
                      yAxisId="left"
                      x={`Month ${breakevenWithUpliftMonth}`}
                      stroke="#0069FF" 
                      strokeDasharray="3 3" 
                      label={{ 
                        value: "Full ROI Breakeven", 
                        position: "insideTopRight", 
                        fill: "#0069FF",
                        fontSize: 12,
                        fontWeight: 500
                      }}
                    />
                  )}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="netCost"
                    name="netCost"
                    stroke="#008060"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 1 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="netWithUplift"
                    name="netWithUplift"
                    stroke="#0069FF"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 1 }}
                    activeDot={{ r: 6 }}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="projectedRevenueUplift"
                    name="projectedRevenueUplift"
                    fill="#FFC859"
                    fillOpacity={0.6}
                    stroke="#F49342"
                  />
                </ComposedChart>
              </ChartContainer>
            </div>
            
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-3 flex items-center">
                <ArrowRight className="h-4 w-4 mr-1 text-shopify-green" />
                How to Read This Chart
              </h4>
              <ul className="text-sm space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full bg-[#008060] mt-1.5 mr-2"></span>
                  <span><b>Green Line:</b> Shows when processing fee savings alone cover the cost of upgrading</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full bg-[#0069FF] mt-1.5 mr-2"></span>
                  <span><b>Blue Line:</b> Shows when total benefits (fees + revenue uplift) cover the upgrade cost</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full bg-[#F49342] mt-1.5 mr-2"></span>
                  <span><b>Orange Area:</b> Shows projected monthly revenue increase from improved conversion rates</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full bg-black mt-1.5 mr-2"></span>
                  <span><b>Black Line:</b> Breakeven point - above this line is a cost, below is savings</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Timeline;
