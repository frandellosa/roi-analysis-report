
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
import { useEffect, useState } from "react";

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
    completedCheckout,
    reachedCheckout,
    calculateROI,
    annualSales
  } = calculatorState;
  
  // Get the configurable percentages from the context
  const { 
    lowUpliftPercentage,
    averageUpliftPercentage,
    goodUpliftPercentage,
    updateCalculatorValues
  } = useCalculatorContext();

  // Local state to store calculated uplift values
  const [crImpactLow, setCrImpactLow] = useState(0);
  const [crImpactAvg, setCrImpactAvg] = useState(0);
  const [crImpactGood, setCrImpactGood] = useState(0);
  const [aovImpactLow, setAovImpactLow] = useState(0);
  const [aovImpactAvg, setAovImpactAvg] = useState(0);
  const [aovImpactGood, setAovImpactGood] = useState(0);
  const [combinedMonthlyLow, setCombinedMonthlyLow] = useState(0);
  const [combinedMonthlyAvg, setCombinedMonthlyAvg] = useState(0);
  const [combinedMonthlyGood, setCombinedMonthlyGood] = useState(0);
  
  // Recalculate uplift when necessary inputs change
  useEffect(() => {
    if (currentConversionRate > 0 && currentAOV > 0 && (reachedCheckout > 0 || completedCheckout > 0 || annualSales > 0)) {
      calculateROI();
    }
  }, [currentConversionRate, currentAOV, reachedCheckout, completedCheckout, annualSales, lowUpliftPercentage, averageUpliftPercentage, goodUpliftPercentage]);
  
  // Calculate individual uplift metrics for conversion rate and AOV
  const getLowUpliftCR = () => currentConversionRate * (1 + lowUpliftPercentage / 100);
  const getAvgUpliftCR = () => currentConversionRate * (1 + averageUpliftPercentage / 100);
  const getGoodUpliftCR = () => currentConversionRate * (1 + goodUpliftPercentage / 100);
  
  const getLowUpliftAOV = () => currentAOV * (1 + lowUpliftPercentage / 100);
  const getAvgUpliftAOV = () => currentAOV * (1 + averageUpliftPercentage / 100);
  const getGoodUpliftAOV = () => currentAOV * (1 + goodUpliftPercentage / 100);
  
  // Calculate the monthly revenue difference for CR improvement only - Based on annual metrics
  const getCROnlyUplift = (improvedCR: number) => {
    if (reachedCheckout > 0) {
      // Calculate using monthly reached checkout sessions
      const monthlyReachedCheckout = reachedCheckout / 12;
      
      // Calculate projected revenue using improved CR
      const projectedMonthlyRevenue = monthlyReachedCheckout * (improvedCR / 100) * currentAOV;
      
      // Calculate current revenue using current CR
      const currentMonthlyRevenue = monthlyReachedCheckout * (currentConversionRate / 100) * currentAOV;
      
      // Return the difference
      return projectedMonthlyRevenue - currentMonthlyRevenue;
    } else {
      const annualVisitors = currentConversionRate > 0 && currentAOV > 0 && annualSales > 0
        ? (annualSales) / (currentAOV * (currentConversionRate / 100))
        : 0;
      
      const monthlyVisitors = annualVisitors / 12;
      const currentMonthlyRevenue = monthlyVisitors * (currentConversionRate / 100) * currentAOV;
      const improvedMonthlyRevenue = monthlyVisitors * (improvedCR / 100) * currentAOV;
      
      return improvedMonthlyRevenue - currentMonthlyRevenue;
    }
  };
  
  // Revenue impact from AOV improvement only - Monthly metrics
  const getAOVOnlyUplift = (improvedAOV: number) => {
    if (completedCheckout > 0) {
      // Convert annual completed checkouts to monthly
      const monthlyCompletedCheckout = completedCheckout / 12;
      
      // Monthly revenue uplift from existing completions at improved AOV
      const currentMonthlyRevenue = monthlyCompletedCheckout * currentAOV;
      const improvedMonthlyRevenue = monthlyCompletedCheckout * improvedAOV;
      
      return improvedMonthlyRevenue - currentMonthlyRevenue;
    } else {
      const annualVisitors = currentConversionRate > 0 && currentAOV > 0 && annualSales > 0
        ? (annualSales) / (currentAOV * (currentConversionRate / 100))
        : 0;
      
      const monthlyVisitors = annualVisitors / 12;
      const monthlyTransactions = monthlyVisitors * (currentConversionRate / 100);
      
      const currentMonthlyRevenue = monthlyTransactions * currentAOV;
      const improvedMonthlyRevenue = monthlyTransactions * improvedAOV;
      
      return improvedMonthlyRevenue - currentMonthlyRevenue;
    }
  };
  
  // Calculate the true combined monthly uplift (CR impact + AOV impact)
  useEffect(() => {
    // Calculate CR impacts
    const crLowImpact = getCROnlyUplift(getLowUpliftCR());
    const crAvgImpact = getCROnlyUplift(getAvgUpliftCR());
    const crGoodImpact = getCROnlyUplift(getGoodUpliftCR());
    
    // Calculate AOV impacts
    const aovLowImpact = getAOVOnlyUplift(getLowUpliftAOV());
    const aovAvgImpact = getAOVOnlyUplift(getAvgUpliftAOV());
    const aovGoodImpact = getAOVOnlyUplift(getGoodUpliftAOV());
    
    // Set the individual impact values
    setCrImpactLow(crLowImpact);
    setCrImpactAvg(crAvgImpact);
    setCrImpactGood(crGoodImpact);
    setAovImpactLow(aovLowImpact);
    setAovImpactAvg(aovAvgImpact);
    setAovImpactGood(aovGoodImpact);
    
    // Calculate the true combined monthly uplift (CR impact + AOV impact)
    const combinedLow = crLowImpact + aovLowImpact;
    const combinedAvg = crAvgImpact + aovAvgImpact;
    const combinedGood = crGoodImpact + aovGoodImpact;
    
    // Update the combined monthly values
    setCombinedMonthlyLow(combinedLow);
    setCombinedMonthlyAvg(combinedAvg);
    setCombinedMonthlyGood(combinedGood);
    
  }, [currentConversionRate, currentAOV, lowUpliftPercentage, averageUpliftPercentage, goodUpliftPercentage, reachedCheckout, completedCheckout, annualSales]);
  
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
    setTimeout(() => {
      calculateROI();
    }, 100);
  };

  // Calculate annual uplift values from monthly values
  const annualLowUplift = combinedMonthlyLow * 12;
  const annualAverageUplift = combinedMonthlyAvg * 12;
  const annualGoodUplift = combinedMonthlyGood * 12;

  return (
    <div className="mb-6 border-t border-gray-200 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold">Projected Revenue Uplift</h4>
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
        <div className="flex items-center justify-between mb-2">
          <h5 className="font-medium">Projected Monthly Revenue Uplift</h5>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Monthly revenue projections calculated from annual checkout data.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-4">
          {/* Monthly reached checkout info if available */}
          {reachedCheckout > 0 && (
            <div className="bg-white p-3 rounded border border-gray-100 mb-2">
              <p className="text-sm font-medium">Based on {reachedCheckout.toLocaleString()} annual reached checkout sessions</p>
              <p className="text-xs text-gray-500">Monthly reached checkout sessions: {(reachedCheckout / 12).toLocaleString()}</p>
              {completedCheckout > 0 && (
                <p className="text-xs text-gray-500">Current annual revenue: {formatCurrency(completedCheckout * currentAOV)}</p>
              )}
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
                  +{formatCurrency(crImpactLow)}/mo
                </p>
              </div>
              
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-600">AOV Impact</p>
                <p className="text-sm">
                  <span className="font-medium">${currentAOV.toFixed(0)}</span> → 
                  <span className="font-medium text-amber-500"> ${getLowUpliftAOV().toFixed(0)}</span>
                </p>
                <p className="text-xs font-medium text-amber-500 mt-1">
                  +{formatCurrency(aovImpactLow)}/mo
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-100 pt-2 mt-2">
              <p className="text-xs text-gray-600">Combined Monthly Uplift:</p>
              <p className="text-sm font-semibold text-amber-500">{formatCurrency(combinedMonthlyLow)}/mo</p>
            </div>
            <div className="flex justify-between items-center pt-1">
              <p className="text-xs text-gray-600">Annual Total:</p>
              <p className="text-xs font-semibold text-amber-500">{formatCurrency(annualLowUplift)}/year</p>
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
                  +{formatCurrency(crImpactAvg)}/mo
                </p>
              </div>
              
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-600">AOV Impact</p>
                <p className="text-sm">
                  <span className="font-medium">${currentAOV.toFixed(0)}</span> → 
                  <span className="font-medium text-blue-500"> ${getAvgUpliftAOV().toFixed(0)}</span>
                </p>
                <p className="text-xs font-medium text-blue-500 mt-1">
                  +{formatCurrency(aovImpactAvg)}/mo
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-100 pt-2 mt-2">
              <p className="text-xs text-gray-600">Combined Monthly Uplift:</p>
              <p className="text-sm font-semibold text-blue-500">{formatCurrency(combinedMonthlyAvg)}/mo</p>
            </div>
            <div className="flex justify-between items-center pt-1">
              <p className="text-xs text-gray-600">Annual Total:</p>
              <p className="text-xs font-semibold text-blue-500">{formatCurrency(annualAverageUplift)}/year</p>
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
                  +{formatCurrency(crImpactGood)}/mo
                </p>
              </div>
              
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-600">AOV Impact</p>
                <p className="text-sm">
                  <span className="font-medium">${currentAOV.toFixed(0)}</span> → 
                  <span className="font-medium text-green-600"> ${getGoodUpliftAOV().toFixed(0)}</span>
                </p>
                <p className="text-xs font-medium text-green-600 mt-1">
                  +{formatCurrency(aovImpactGood)}/mo
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-100 pt-2 mt-2">
              <p className="text-xs text-gray-600">Combined Monthly Uplift:</p>
              <p className="text-sm font-semibold text-green-600">{formatCurrency(combinedMonthlyGood)}/mo</p>
            </div>
            <div className="flex justify-between items-center pt-1">
              <p className="text-xs text-gray-600">Annual Total:</p>
              <p className="text-xs font-semibold text-green-600">{formatCurrency(annualGoodUplift)}/year</p>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            <p>Based on your annual checkout metrics divided by 12 for monthly projections.</p>
            <p className="mt-1">Conversion rate impact applies to monthly reached checkout sessions, and AOV impact applies to completed checkouts.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
