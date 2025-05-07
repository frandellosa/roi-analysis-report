
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VPFCalculatorProps {
  annualSales: number;
  plusTerm: string;
  plusMonthlyCost: number;
  updateEffectiveCost: (cost: number) => void;
}

const VPFCalculator: React.FC<VPFCalculatorProps> = ({ 
  annualSales, 
  plusTerm, 
  plusMonthlyCost, 
  updateEffectiveCost 
}) => {
  // GMV breakdown inputs
  const [d2cPercentage, setD2cPercentage] = useState(70);
  const [b2bPercentage, setB2bPercentage] = useState(20);
  const [retailPercentage, setRetailPercentage] = useState(10);
  
  // Variable platform fee rates
  const [d2cRate, setD2cRate] = useState(plusTerm === '3year' ? 0.35 : 0.4);
  const [b2bRate, setB2bRate] = useState(0.18);
  const [retailRate, setRetailRate] = useState(0.25);
  
  // Calculated values
  const [vpfMonthly, setVpfMonthly] = useState(0);
  const [effectivePlusMonthlyCost, setEffectivePlusMonthlyCost] = useState(plusMonthlyCost);
  
  // Channel VPF values
  const [d2cVpf, setD2cVpf] = useState(0);
  const [b2bVpf, setB2bVpf] = useState(0);
  const [retailVpf, setRetailVpf] = useState(0);

  // Update D2C rate based on term selection
  useEffect(() => {
    setD2cRate(plusTerm === '3year' ? 0.35 : 0.4);
  }, [plusTerm]);

  // Calculate Variable Platform Fee
  useEffect(() => {
    const monthlyGMV = annualSales / 12;
    const d2cGMV = monthlyGMV * (d2cPercentage / 100);
    const b2bGMV = monthlyGMV * (b2bPercentage / 100);
    const retailGMV = monthlyGMV * (retailPercentage / 100);
    
    // Calculate VPF for each channel
    const d2cVpfValue = (d2cGMV * d2cRate / 100);
    const b2bVpfValue = (b2bGMV * b2bRate / 100);
    const retailVpfValue = (retailGMV * retailRate / 100);
    
    setD2cVpf(d2cVpfValue);
    setB2bVpf(b2bVpfValue);
    setRetailVpf(retailVpfValue);
    
    const totalVpfAmount = d2cVpfValue + b2bVpfValue + retailVpfValue;
    
    setVpfMonthly(totalVpfAmount);

    // Apply the correct pricing rule:
    // Base price/month OR variable platform fee (VPF), whichever is greater
    if (totalVpfAmount > plusMonthlyCost) {
      setEffectivePlusMonthlyCost(totalVpfAmount);
    } else {
      setEffectivePlusMonthlyCost(plusMonthlyCost);
    }
    
    // Update the parent component
    updateEffectiveCost(totalVpfAmount > plusMonthlyCost ? totalVpfAmount : plusMonthlyCost);
  }, [plusTerm, annualSales, d2cPercentage, b2bPercentage, retailPercentage, plusMonthlyCost, d2cRate, b2bRate, retailRate, updateEffectiveCost]);

  // Handle GMV percentage changes
  const handleD2CChange = (value: number) => {
    const newD2C = Math.min(100, value);
    const remaining = 100 - newD2C;
    const ratio = b2bPercentage / (b2bPercentage + retailPercentage) || 0.5;
    
    setD2cPercentage(newD2C);
    setB2bPercentage(Math.round(remaining * ratio));
    setRetailPercentage(100 - newD2C - Math.round(remaining * ratio));
  };

  const handleB2BChange = (value: number) => {
    const newB2B = Math.min(100 - d2cPercentage, value);
    setB2bPercentage(newB2B);
    setRetailPercentage(100 - d2cPercentage - newB2B);
  };
  
  // Handle rate input changes
  const handleRateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setter(value);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
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
        <Select value={plusTerm} onValueChange={(value) => {}}>
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
    </div>
  );
};

export default VPFCalculator;
