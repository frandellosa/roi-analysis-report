
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectLabel,
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useCalculatorContext } from '@/contexts/CalculatorContext';

interface BasicInputsProps {
  calculatorState: any;
}

export const BasicInputs = ({ calculatorState }: BasicInputsProps) => {
  const { 
    annualSales, 
    handleSalesChange,
    effectivePlusMonthlyCost
  } = calculatorState;
  
  // Use shared context instead of local state
  const { selectedPlan, updateSelectedPlan, plans } = useCalculatorContext();
  
  // Get the base plan name (removing any billing suffix)
  const basePlan = selectedPlan.split('-')[0];
  
  // Function to extract monthly cost from plan price string, accounting for billing period
  const getPlanMonthlyCost = (planId: string) => {
    // Extract billing period from the selected plan
    const billingPeriod = selectedPlan.includes('-') ? selectedPlan.split('-')[1] : 'monthly';
    
    // For monthly plans, use the price directly
    if (!billingPeriod || billingPeriod === 'monthly') {
      const priceString = plans[planId].price;
      const priceMatch = priceString.match(/\$(\d+)/);
      
      if (priceMatch && priceMatch[1]) {
        return parseInt(priceMatch[1], 10);
      }
      return 0;
    } 
    // For non-monthly plans, extract from the SelectItem values
    else {
      // Annual billing prices (stored as monthly equivalent)
      if (billingPeriod === 'annual') {
        if (planId === 'basic') return 29;
        if (planId === 'shopify') return 79;
        if (planId === 'advanced') return 299;
      }
      // Biennial billing prices (stored as monthly equivalent)
      else if (billingPeriod === 'biennial') {
        // Calculate monthly equivalent (divide by 24 months)
        if (planId === 'basic') return Math.round(558 / 24);
        if (planId === 'shopify') return Math.round(1518 / 24);
        if (planId === 'advanced') return Math.round(5640 / 24);
      }
      // Triennial billing prices (stored as monthly equivalent)
      else if (billingPeriod === 'triennial') {
        // Calculate monthly equivalent (divide by 36 months)
        if (planId === 'basic') return Math.round(783 / 36);
        if (planId === 'shopify') return Math.round(2133 / 36);
        if (planId === 'advanced') return Math.round(7884 / 36);
      }
      
      // Fallback to regular monthly price
      const priceString = plans[planId].price;
      const priceMatch = priceString.match(/\$(\d+)/);
      
      if (priceMatch && priceMatch[1]) {
        return parseInt(priceMatch[1], 10);
      }
      return 0;
    }
  };
  
  // Set the current monthly cost from the selected plan
  const basicMonthlyCost = getPlanMonthlyCost(basePlan);
  
  const handlePlanChange = (value: string) => {
    updateSelectedPlan(value);
    // Also call the calculatorState's handler if it exists 
    // to maintain backward compatibility
    if (calculatorState.handlePlanChange) {
      calculatorState.handlePlanChange(value);
    }
  };

  return (
    <>
      <div className="mb-6">
        <Label htmlFor="current-plan" className="mb-2 block">Current Plan</Label>
        <Select value={selectedPlan} onValueChange={handlePlanChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your current plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Monthly billing</SelectLabel>
              <SelectItem value="basic">Basic ({plans.basic.price}/month)</SelectItem>
              <SelectItem value="shopify">Grow ({plans.shopify.price}/month)</SelectItem>
              <SelectItem value="advanced">Advanced ({plans.advanced.price}/month)</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Annual billing (paid upfront)</SelectLabel>
              <SelectItem value="basic-annual">Basic Annual ($348/year - $29/month)</SelectItem>
              <SelectItem value="shopify-annual">Grow Annual ($948/year - $79/month)</SelectItem>
              <SelectItem value="advanced-annual">Advanced Annual ($3,588/year - $299/month)</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Biennial billing (2 years)</SelectLabel>
              <SelectItem value="basic-biennial">Basic Biennial ($558/2years)</SelectItem>
              <SelectItem value="shopify-biennial">Grow Biennial ($1,518/2years)</SelectItem>
              <SelectItem value="advanced-biennial">Advanced Biennial ($5,640/2years)</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Triennial billing (3 years)</SelectLabel>
              <SelectItem value="basic-triennial">Basic Triennial ($783/3years)</SelectItem>
              <SelectItem value="shopify-triennial">Grow Triennial ($2,133/3years)</SelectItem>
              <SelectItem value="advanced-triennial">Advanced Triennial ($7,884/3years)</SelectItem>
            </SelectGroup>
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
