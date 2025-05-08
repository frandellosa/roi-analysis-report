
import { Card, CardContent } from "@/components/ui/card";
import { useCalculatorContext } from "@/contexts/CalculatorContext";

interface ROIResultsProps {
  calculatorState: any;
}

export const ROIResults = ({ calculatorState }: ROIResultsProps) => {
  const { 
    feeSavings, 
    annualSavings, 
    monthlyUpliftLow, 
    monthlyUpliftAverage, 
    monthlyUpliftGood,
    reachedCheckout,
    completedCheckout,
    currentAOV,
    formatCurrency
  } = calculatorState;

  // Get the uplift percentages from context
  const { lowUpliftPercentage, averageUpliftPercentage, goodUpliftPercentage } = useCalculatorContext();

  // Calculate checkout drop-off metrics if available
  const showCheckoutMetrics = reachedCheckout > 0;
  const dropOffRate = reachedCheckout > 0 
    ? ((reachedCheckout - completedCheckout) / reachedCheckout) * 100 
    : 0;
  const potentialRevenueLost = (reachedCheckout - completedCheckout) * currentAOV;

  return (
    <Card className="border-gray-100 shadow-md bg-gray-50">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-6">ROI Results</h3>
        
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-4">
            <h4 className="text-lg font-medium mb-2">Annual Processing Fee Savings</h4>
            <p className="text-3xl font-bold text-shopify-green">{formatCurrency(feeSavings)}</p>
            <p className="text-sm text-shopify-muted mt-1">Difference in transaction fees only</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-4">
            <h4 className="text-lg font-medium mb-2">
              {annualSavings >= 0 ? "Net Annual Savings" : "Annual Cost to Upgrade"}
            </h4>
            <p className={`text-3xl font-bold ${annualSavings >= 0 ? 'text-shopify-green' : 'text-shopify-black'}`}>
              {formatCurrency(Math.abs(annualSavings))}
            </p>
            <p className="text-sm text-shopify-muted mt-1">
              {annualSavings >= 0 
                ? "Annual savings after subtracting higher plan costs" 
                : "Annual cost after accounting for plan difference"}
            </p>
          </div>
          
          {showCheckoutMetrics && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-4">
              <h4 className="text-lg font-medium mb-2">Checkout Abandonment Impact</h4>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Drop-Off Rate</p>
                  <p className="text-2xl font-bold text-amber-600">{dropOffRate.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Lost Revenue</p>
                  <p className="text-2xl font-bold text-red-500">{formatCurrency(potentialRevenueLost)}</p>
                </div>
              </div>
              <p className="text-sm text-shopify-muted mt-1">
                Potential revenue lost to checkout abandonment
              </p>
            </div>
          )}
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="text-lg font-medium mb-2">Projected Revenue Uplift</h4>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="bg-gray-50 p-3 rounded text-center">
                <p className="text-sm font-semibold text-amber-600 mb-1">Low ({lowUpliftPercentage}%)</p>
                <p className="text-xl font-bold text-amber-600">{formatCurrency(monthlyUpliftLow)}</p>
                <p className="text-xs text-gray-500">Per Month</p>
              </div>
              <div className="bg-gray-50 p-3 rounded text-center">
                <p className="text-sm font-semibold text-blue-600 mb-1">Average ({averageUpliftPercentage}%)</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(monthlyUpliftAverage)}</p>
                <p className="text-xs text-gray-500">Per Month</p>
              </div>
              <div className="bg-gray-50 p-3 rounded text-center">
                <p className="text-sm font-semibold text-green-600 mb-1">Good ({goodUpliftPercentage}%)</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(monthlyUpliftGood)}</p>
                <p className="text-xs text-gray-500">Per Month</p>
              </div>
            </div>
            <p className="text-sm text-shopify-muted mt-1">
              Based on improved conversion rates applied to reached checkout sessions and improved AOV for completed checkouts
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
