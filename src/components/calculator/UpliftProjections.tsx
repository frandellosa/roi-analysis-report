
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, DollarSign, Percent } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { useCalculatorContext } from "@/contexts/CalculatorContext";

interface UpliftProjectionsProps {
  calculatorState: any;
}

export const UpliftProjections = ({ calculatorState }: UpliftProjectionsProps) => {
  const { 
    currentConversionRate, 
    currentAOV, 
    monthlyUpliftLow, 
    monthlyUpliftAverage, 
    monthlyUpliftGood,
    handleRateChange,
    setCurrentConversionRate,
    setCurrentAOV,
    formatCurrency,
    completedCheckout
  } = calculatorState;
  
  // Get the configurable percentages from the context
  const { 
    lowUpliftPercentage,
    averageUpliftPercentage,
    goodUpliftPercentage,
    updateCalculatorValues
  } = useCalculatorContext();
  
  // Calculate individual uplift metrics for conversion rate and AOV
  const getLowUpliftCR = () => currentConversionRate * (1 + lowUpliftPercentage / 100);
  const getAvgUpliftCR = () => currentConversionRate * (1 + averageUpliftPercentage / 100);
  const getGoodUpliftCR = () => currentConversionRate * (1 + goodUpliftPercentage / 100);
  
  const getLowUpliftAOV = () => currentAOV * (1 + lowUpliftPercentage / 100);
  const getAvgUpliftAOV = () => currentAOV * (1 + averageUpliftPercentage / 100);
  const getGoodUpliftAOV = () => currentAOV * (1 + goodUpliftPercentage / 100);
  
  // Calculate the revenue difference for each improvement type using completed checkout sessions
  const calculateUpliftRevenue = (improvedCR: number, improvedAOV: number) => {
    // If we have completed checkout data, use it as the baseline for monthly calculations
    if (completedCheckout > 0) {
      // Current monthly revenue based on completed checkouts
      const currentMonthlyRevenue = completedCheckout * currentAOV;
      
      // Calculate the percentage increase in conversion rate
      const crImprovementFactor = improvedCR / currentConversionRate;
      
      // Improved monthly revenue based on improved conversion rate and AOV
      // More completed checkouts (due to improved CR) and higher AOV
      const improvedMonthlyRevenue = completedCheckout * crImprovementFactor * improvedAOV;
      
      return improvedMonthlyRevenue - currentMonthlyRevenue;
    } else {
      // Fallback to the original calculation if no checkout data
      const monthlyVisitors = currentConversionRate > 0 && currentAOV > 0 
        ? (calculatorState.annualSales / 12) / (currentAOV * (currentConversionRate / 100))
        : 0;
      
      const currentMonthlyRevenue = monthlyVisitors * currentConversionRate / 100 * currentAOV;
      const improvedMonthlyRevenue = monthlyVisitors * improvedCR / 100 * improvedAOV;
      
      return improvedMonthlyRevenue - currentMonthlyRevenue;
    }
  };
  
  // Revenue impact from CR improvement only
  const getCROnlyUplift = (improvedCR: number) => {
    if (completedCheckout > 0) {
      const currentMonthlyRevenue = completedCheckout * currentAOV;
      
      // Calculate the percentage increase in conversion rate
      const crImprovementFactor = improvedCR / currentConversionRate;
      
      // Only improving CR means more completed checkouts at the same AOV
      const improvedMonthlyRevenue = completedCheckout * crImprovementFactor * currentAOV;
      
      return improvedMonthlyRevenue - currentMonthlyRevenue;
    } else {
      const monthlyVisitors = currentConversionRate > 0 && currentAOV > 0 
        ? (calculatorState.annualSales / 12) / (currentAOV * (currentConversionRate / 100))
        : 0;
      
      const currentMonthlyRevenue = monthlyVisitors * currentConversionRate / 100 * currentAOV;
      const improvedMonthlyRevenue = monthlyVisitors * improvedCR / 100 * currentAOV;
      
      return improvedMonthlyRevenue - currentMonthlyRevenue;
    }
  };
  
  // Revenue impact from AOV improvement only
  const getAOVOnlyUplift = (improvedAOV: number) => {
    if (completedCheckout > 0) {
      const currentMonthlyRevenue = completedCheckout * currentAOV;
      
      // Only improving AOV means same number of completed checkouts but higher AOV
      const improvedMonthlyRevenue = completedCheckout * improvedAOV;
      
      return improvedMonthlyRevenue - currentMonthlyRevenue;
    } else {
      const monthlyVisitors = currentConversionRate > 0 && currentAOV > 0 
        ? (calculatorState.annualSales / 12) / (currentAOV * (currentConversionRate / 100))
        : 0;
      
      const currentMonthlyRevenue = monthlyVisitors * currentConversionRate / 100 * currentAOV;
      const improvedMonthlyRevenue = monthlyVisitors * currentConversionRate / 100 * improvedAOV;
      
      return improvedMonthlyRevenue - currentMonthlyRevenue;
    }
  };
  
  // Handle percentage changes
  const handlePercentageChange = (value: number, type: 'low' | 'average' | 'good') => {
    // Ensure values are within reasonable bounds and maintain proper ordering
    if (type === 'low') {
      updateCalculatorValues({ lowUpliftPercentage: Math.min(value, averageUpliftPercentage - 1) });
    } else if (type === 'average') {
      updateCalculatorValues({ 
        averageUpliftPercentage: Math.min(Math.max(value, lowUpliftPercentage + 1), goodUpliftPercentage - 1) 
      });
    } else if (type === 'good') {
      updateCalculatorValues({ goodUpliftPercentage: Math.max(value, averageUpliftPercentage + 1) });
    }
    
    // Recalculate uplift values with new percentages
    calculatorState.calculateROI();
  };

  // Calculate uplift values for display
  const lowUplift = calculateUpliftRevenue(getLowUpliftCR(), getLowUpliftAOV());
  const averageUplift = calculateUpliftRevenue(getAvgUpliftCR(), getAvgUpliftAOV());
  const goodUplift = calculateUpliftRevenue(getGoodUpliftCR(), getGoodUpliftAOV());

  return (
    <div className="mb-6 border-t border-gray-200 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold">Projected Uplift</h4>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <Label htmlFor="current-cr" className="text-sm">Current Conversion Rate (%)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Your store's current checkout conversion rate.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input 
            id="current-cr" 
            type="number" 
            value={currentConversionRate}
            onChange={(e) => handleRateChange(e, setCurrentConversionRate)}
            step="0.1"
            min="0"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <Label htmlFor="current-aov" className="text-sm">Current AOV ($)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Your store's current Average Order Value.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input 
            id="current-aov" 
            type="number" 
            value={currentAOV}
            onChange={(e) => handleRateChange(e, setCurrentAOV)}
            min="0"
          />
        </div>
      </div>

      {/* Configurable Uplift Percentages */}
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
        <h5 className="font-medium mb-3">Uplift Percentage Settings</h5>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-sm">Low Estimate Percentage</Label>
              <span className="text-sm font-medium">{lowUpliftPercentage}%</span>
            </div>
            <Slider 
              value={[lowUpliftPercentage]} 
              min={1} 
              max={30} 
              step={1} 
              className="mb-2"
              onValueChange={(value) => handlePercentageChange(value[0], 'low')}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-sm">Average Estimate Percentage</Label>
              <span className="text-sm font-medium">{averageUpliftPercentage}%</span>
            </div>
            <Slider 
              value={[averageUpliftPercentage]} 
              min={1} 
              max={30} 
              step={1} 
              className="mb-2"
              onValueChange={(value) => handlePercentageChange(value[0], 'average')}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-sm">Good Estimate Percentage</Label>
              <span className="text-sm font-medium">{goodUpliftPercentage}%</span>
            </div>
            <Slider 
              value={[goodUpliftPercentage]} 
              min={1} 
              max={30} 
              step={1} 
              className="mb-2"
              onValueChange={(value) => handlePercentageChange(value[0], 'good')}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-4">
        <h5 className="font-medium mb-2">Projected Monthly Revenue Uplift</h5>
        
        <div className="space-y-4">
          {/* Monthly completed checkouts info if available */}
          {completedCheckout > 0 && (
            <div className="bg-white p-3 rounded border border-gray-100 mb-2">
              <p className="text-sm font-medium">Based on {completedCheckout} completed checkout sessions per month</p>
              <p className="text-xs text-gray-500">Current monthly revenue: {formatCurrency(completedCheckout * currentAOV)}</p>
            </div>
          )}
          
          {/* Low estimate section */}
          <div className="bg-white p-3 rounded border border-gray-100">
            <h6 className="flex items-center text-sm font-semibold text-amber-500 mb-2">
              <DollarSign className="h-4 w-4 mr-1" />
              Low Estimate ({lowUpliftPercentage}% Improvement)
            </h6>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-600">Conversion Rate Impact</p>
                <p className="text-sm">
                  <span className="font-medium">{currentConversionRate.toFixed(2)}%</span> → 
                  <span className="font-medium text-amber-500"> {getLowUpliftCR().toFixed(2)}%</span>
                </p>
                <p className="text-xs font-medium text-amber-500 mt-1">
                  +{formatCurrency(getCROnlyUplift(getLowUpliftCR()))}
                </p>
              </div>
              
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-600">AOV Impact</p>
                <p className="text-sm">
                  <span className="font-medium">${currentAOV.toFixed(0)}</span> → 
                  <span className="font-medium text-amber-500"> ${getLowUpliftAOV().toFixed(0)}</span>
                </p>
                <p className="text-xs font-medium text-amber-500 mt-1">
                  +{formatCurrency(getAOVOnlyUplift(getLowUpliftAOV()))}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-100 pt-2 mt-2">
              <p className="text-xs text-gray-600">Combined Monthly Uplift:</p>
              <p className="text-sm font-semibold text-amber-500">{formatCurrency(lowUplift)}</p>
            </div>
          </div>
          
          {/* Average estimate section */}
          <div className="bg-white p-3 rounded border border-gray-100">
            <h6 className="flex items-center text-sm font-semibold text-blue-500 mb-2">
              <DollarSign className="h-4 w-4 mr-1" />
              Average Estimate ({averageUpliftPercentage}% Improvement)
            </h6>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-600">Conversion Rate Impact</p>
                <p className="text-sm">
                  <span className="font-medium">{currentConversionRate.toFixed(2)}%</span> → 
                  <span className="font-medium text-blue-500"> {getAvgUpliftCR().toFixed(2)}%</span>
                </p>
                <p className="text-xs font-medium text-blue-500 mt-1">
                  +{formatCurrency(getCROnlyUplift(getAvgUpliftCR()))}
                </p>
              </div>
              
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-600">AOV Impact</p>
                <p className="text-sm">
                  <span className="font-medium">${currentAOV.toFixed(0)}</span> → 
                  <span className="font-medium text-blue-500"> ${getAvgUpliftAOV().toFixed(0)}</span>
                </p>
                <p className="text-xs font-medium text-blue-500 mt-1">
                  +{formatCurrency(getAOVOnlyUplift(getAvgUpliftAOV()))}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-100 pt-2 mt-2">
              <p className="text-xs text-gray-600">Combined Monthly Uplift:</p>
              <p className="text-sm font-semibold text-blue-500">{formatCurrency(averageUplift)}</p>
            </div>
          </div>
          
          {/* Good estimate section */}
          <div className="bg-white p-3 rounded border border-gray-100">
            <h6 className="flex items-center text-sm font-semibold text-green-600 mb-2">
              <DollarSign className="h-4 w-4 mr-1" />
              Good Estimate ({goodUpliftPercentage}% Improvement)
            </h6>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-600">Conversion Rate Impact</p>
                <p className="text-sm">
                  <span className="font-medium">{currentConversionRate.toFixed(2)}%</span> → 
                  <span className="font-medium text-green-600"> {getGoodUpliftCR().toFixed(2)}%</span>
                </p>
                <p className="text-xs font-medium text-green-600 mt-1">
                  +{formatCurrency(getCROnlyUplift(getGoodUpliftCR()))}
                </p>
              </div>
              
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-600">AOV Impact</p>
                <p className="text-sm">
                  <span className="font-medium">${currentAOV.toFixed(0)}</span> → 
                  <span className="font-medium text-green-600"> ${getGoodUpliftAOV().toFixed(0)}</span>
                </p>
                <p className="text-xs font-medium text-green-600 mt-1">
                  +{formatCurrency(getAOVOnlyUplift(getGoodUpliftAOV()))}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-100 pt-2 mt-2">
              <p className="text-xs text-gray-600">Combined Monthly Uplift:</p>
              <p className="text-sm font-semibold text-green-600">{formatCurrency(goodUplift)}</p>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            <p>Based on your current metrics and projected improvements in conversion rate and average order value.</p>
            <p className="mt-1">Use the sliders above to adjust the improvement percentages for each scenario.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
