
import { Card, CardContent } from "@/components/ui/card";
import { useCalculatorContext } from "@/contexts/CalculatorContext";
import { ArrowDown, ChevronDown, ChevronUp } from "lucide-react";
import { ShopifyAudiencesTable } from "./ShopifyAudiencesTable";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

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
    formatCurrency,
    plusMonthlyCost,
    basicMonthlyCost,
    processingRates,
    selectedPlan,
    annualSales
  } = calculatorState;

  // State for the collapsible section
  const [isAudiencesOpen, setIsAudiencesOpen] = useState(false);

  // Get the uplift percentages from context
  const { 
    lowUpliftPercentage, 
    averageUpliftPercentage, 
    goodUpliftPercentage,
    basicFeeRate,
    plusFeeRate
  } = useCalculatorContext();

  // Calculate checkout drop-off metrics if available
  const showCheckoutMetrics = reachedCheckout > 0;
  const dropOffRate = reachedCheckout > 0 
    ? ((reachedCheckout - completedCheckout) / reachedCheckout) * 100 
    : 0;
  const potentialRevenueLost = (reachedCheckout - completedCheckout) * currentAOV;

  // Calculate the annual plan cost difference
  const annualPlanDifference = (plusMonthlyCost - basicMonthlyCost) * 12;
  
  // Calculate net annual savings (fee savings minus plan cost difference)
  const netAnnualSavings = feeSavings - annualPlanDifference;

  // Calculate current and projected processing fees
  const basePlan = selectedPlan.split('-')[0];
  const currentProcessingFees = annualSales * (basicFeeRate / 100);
  const projectedProcessingFees = annualSales * (plusFeeRate / 100);
  const processingFeesDifference = currentProcessingFees - projectedProcessingFees;
  const processingFeesPercentReduction = ((basicFeeRate - plusFeeRate) / basicFeeRate) * 100;

  // Determine if we should show the processing fee comparison (only when fees are calculated)
  const showProcessingComparison = basicFeeRate > 0 && plusFeeRate > 0;

  return (
    <Card className="border-gray-100 shadow-md bg-gray-50">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-6">ROI Results</h3>
        
        <div className="mb-8">
          {showProcessingComparison && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-4">
              <h4 className="text-lg font-medium mb-2">Processing Fee Comparison</h4>
              <div className="grid grid-cols-2 gap-6 mb-2">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Current Processing Fees</p>
                  <p className="text-2xl font-bold text-shopify-black">
                    {formatCurrency(currentProcessingFees)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {basicFeeRate.toFixed(2)}% rate
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Plus Processing Fees</p>
                  <p className="text-2xl font-bold text-shopify-green">
                    {formatCurrency(projectedProcessingFees)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {plusFeeRate.toFixed(2)}% rate
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded mt-3 flex items-center justify-between">
                <span className="text-sm font-medium">Fee Reduction</span>
                <div className="flex items-center">
                  <ArrowDown className="h-4 w-4 mr-1 text-green-600" />
                  <span className="text-green-600 font-semibold">{processingFeesPercentReduction.toFixed(2)}%</span>
                  <span className="ml-2 text-gray-500">({formatCurrency(processingFeesDifference)} savings)</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-4">
            <h4 className="text-lg font-medium mb-2">Annual Processing Fee Savings</h4>
            <p className="text-3xl font-bold text-shopify-green">{formatCurrency(feeSavings)}</p>
            <p className="text-sm text-shopify-muted mt-1">Difference in transaction fees only</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-4">
            <h4 className="text-lg font-medium mb-2">
              {netAnnualSavings >= 0 ? "Net Annual Savings" : "Annual Cost to Upgrade"}
            </h4>
            <p className={`text-3xl font-bold ${netAnnualSavings >= 0 ? 'text-shopify-green' : 'text-shopify-black'}`}>
              {formatCurrency(Math.abs(netAnnualSavings))}
            </p>
            <p className="text-sm text-shopify-muted mt-1">
              {netAnnualSavings >= 0 
                ? "Annual fee savings minus higher plan costs" 
                : "Annual cost after subtracting processing fee savings"}
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
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-4">
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
          
          {/* Collapsible Shopify Audiences section */}
          <Collapsible
            open={isAudiencesOpen}
            onOpenChange={setIsAudiencesOpen}
            className="mt-4"
          >
            <CollapsibleTrigger className="bg-white w-full p-4 rounded-lg border border-gray-200 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <h4 className="text-lg font-medium">Margin Impact due to Shopify Audiences</h4>
              {isAudiencesOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <ShopifyAudiencesTable currentAOV={currentAOV} />
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
};
