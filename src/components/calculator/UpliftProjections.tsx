
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, DollarSign } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    formatCurrency
  } = calculatorState;

  return (
    <div className="mb-6 border-t border-gray-200 pt-6">
      <h4 className="text-lg font-semibold mb-4">Projected Uplift</h4>
      
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
          />
        </div>
      </div>
      
      <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-4">
        <h5 className="font-medium mb-2">Projected Monthly Revenue Uplift</h5>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-amber-500" />
                Low Estimate (5% CR & AOV Improvement):
              </span>
              <div className="text-xs text-gray-500 ml-5">
                CR: {(currentConversionRate * 1.05).toFixed(2)}% | AOV: ${(currentAOV * 1.05).toFixed(0)}
              </div>
            </div>
            <span className="font-medium text-amber-500">{formatCurrency(monthlyUpliftLow)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-blue-500" />
                Average Estimate (10% CR & AOV Improvement):
              </span>
              <div className="text-xs text-gray-500 ml-5">
                CR: {(currentConversionRate * 1.1).toFixed(2)}% | AOV: ${(currentAOV * 1.1).toFixed(0)}
              </div>
            </div>
            <span className="font-medium text-blue-500">{formatCurrency(monthlyUpliftAverage)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                Good Estimate (20% CR & AOV Improvement):
              </span>
              <div className="text-xs text-gray-500 ml-5">
                CR: {(currentConversionRate * 1.2).toFixed(2)}% | AOV: ${(currentAOV * 1.2).toFixed(0)}
              </div>
            </div>
            <span className="font-medium text-green-600">{formatCurrency(monthlyUpliftGood)}</span>
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            Based on your current monthly traffic and projected improvements in conversion rate and average order value.
          </div>
        </div>
      </div>
    </div>
  );
};
