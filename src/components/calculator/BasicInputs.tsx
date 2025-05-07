
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface BasicInputsProps {
  calculatorState: any;
}

export const BasicInputs = ({ calculatorState }: BasicInputsProps) => {
  const { 
    selectedPlan, 
    handlePlanChange, 
    annualSales, 
    handleSalesChange,
    basicMonthlyCost,
    effectivePlusMonthlyCost
  } = calculatorState;

  return (
    <>
      <div className="mb-6">
        <Label htmlFor="current-plan" className="mb-2 block">Current Plan</Label>
        <Select value={selectedPlan} onValueChange={handlePlanChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your current plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic ($39/month)</SelectItem>
            <SelectItem value="shopify">Grow ($105/month)</SelectItem>
            <SelectItem value="advanced">Advanced ($399/month)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6">
        <Label htmlFor="annual-sales" className="mb-2 block">Annual Sales Volume</Label>
        <Input 
          id="annual-sales"
          type="text"
          value={annualSales.toLocaleString()}
          onChange={handleSalesChange}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="basic-monthly" className="mb-2 block">Current Plan Monthly Cost ($)</Label>
          <Input 
            id="basic-monthly" 
            type="number" 
            value={basicMonthlyCost} 
            disabled
            className="bg-gray-100"
          />
        </div>
        <div>
          <Label htmlFor="plus-monthly" className="mb-2 block">Plus Monthly Cost ($)</Label>
          <Input 
            id="plus-monthly" 
            type="number" 
            value={effectivePlusMonthlyCost.toFixed(2)} 
            disabled
            className="bg-gray-100"
          />
        </div>
      </div>
    </>
  );
};
