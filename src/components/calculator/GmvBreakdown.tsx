
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

interface GmvBreakdownProps {
  calculatorState: any;
}

export const GmvBreakdown = ({ calculatorState }: GmvBreakdownProps) => {
  const { 
    plusTerm,
    handleTermChange,
    d2cPercentage,
    b2bPercentage,
    retailPercentage,
    d2cRate,
    b2bRate,
    retailRate,
    handleD2CChange,
    handleB2BChange,
    handleRateChange,
    formatCurrency,
    d2cVpf,
    b2bVpf,
    retailVpf,
    vpfMonthly,
    plusMonthlyCost,
    effectivePlusMonthlyCost
  } = calculatorState;

  return (
    <Tabs defaultValue="standard" className="mb-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="standard">Standard</TabsTrigger>
        <TabsTrigger value="variable">Variable Platform Fee</TabsTrigger>
      </TabsList>
      <TabsContent value="standard">
        <div className="mb-6">
          <Label htmlFor="plus-term" className="mb-2 block">Plus Plan Term</Label>
          <Select value={plusTerm} onValueChange={handleTermChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Plus plan term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3year">3 Year Term ($2,300/month)</SelectItem>
              <SelectItem value="1year">1 Year Term ($2,500/month)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>
      <TabsContent value="variable">
        <div className="mb-6 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Plus Plan Term & VPF Rates</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Variable platform fee is calculated as a percentage of your monthly GMV, broken down by channel.</p>
                    <p className="mt-2">Plus pricing will be the monthly minimum fee OR the VPF, whichever is greater.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select value={plusTerm} onValueChange={handleTermChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Plus plan term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3year">
                  3 Year Term ($2,300/mo min or VPF)
                </SelectItem>
                <SelectItem value="1year">
                  1 Year Term ($2,500/mo min or VPF)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label>D2C Sales</Label>
              <span className="text-sm">{d2cPercentage}%</span>
            </div>
            <Slider
              defaultValue={[70]}
              max={100}
              min={0}
              step={1}
              value={[d2cPercentage]}
              onValueChange={(val) => handleD2CChange(val[0])}
            />
            <div className="flex items-center justify-between mt-1">
              <Label htmlFor="d2c-rate" className="text-sm">D2C Rate (%)</Label>
              <Input
                id="d2c-rate"
                type="number"
                value={d2cRate}
                onChange={(e) => handleRateChange(e, setD2cRate)}
                className="w-20 text-right"
                step="0.01"
              />
            </div>
            <div className="text-xs text-right mt-1 text-gray-500">
              VPF: {formatCurrency(d2cVpf)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label>B2B Sales</Label>
              <span className="text-sm">{b2bPercentage}%</span>
            </div>
            <Slider
              defaultValue={[20]}
              max={100-d2cPercentage}
              min={0}
              step={1}
              value={[b2bPercentage]}
              onValueChange={(val) => handleB2BChange(val[0])}
            />
            <div className="flex items-center justify-between mt-1">
              <Label htmlFor="b2b-rate" className="text-sm">B2B Rate (%)</Label>
              <Input
                id="b2b-rate"
                type="number"
                value={b2bRate}
                onChange={(e) => handleRateChange(e, setB2bRate)}
                className="w-20 text-right"
                step="0.01"
              />
            </div>
            <div className="text-xs text-right mt-1 text-gray-500">
              VPF: {formatCurrency(b2bVpf)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label>Retail Sales</Label>
              <span className="text-sm">{retailPercentage}%</span>
            </div>
            <Input
              type="text"
              value={retailPercentage + "%"}
              disabled
              className="bg-gray-100"
            />
            <div className="flex items-center justify-between mt-1">
              <Label htmlFor="retail-rate" className="text-sm">Retail Rate (%)</Label>
              <Input
                id="retail-rate"
                type="number"
                value={retailRate}
                onChange={(e) => handleRateChange(e, setRetailRate)}
                className="w-20 text-right"
                step="0.01"
              />
            </div>
            <div className="text-xs text-right mt-1 text-gray-500">
              VPF: {formatCurrency(retailVpf)}
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Calculated VPF (Monthly):</span>
            <span className="font-medium">{formatCurrency(vpfMonthly)}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm font-medium">Monthly Minimum:</span>
            <span className="font-medium">{formatCurrency(plusMonthlyCost)}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm font-medium">Effective Monthly Cost:</span>
            <span className="font-semibold text-shopify-green">{formatCurrency(effectivePlusMonthlyCost)}</span>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
