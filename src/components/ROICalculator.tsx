
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const ROICalculator = () => {
  const [annualSales, setAnnualSales] = useState(1562954);
  const [basicFeeRate, setBasicFeeRate] = useState(2.9);
  const [plusFeeRate, setPlusFeeRate] = useState(2.4);
  const [basicMonthlyCost, setBasicMonthlyCost] = useState(39);
  const [plusMonthlyCost, setPlusMonthlyCost] = useState(2300);
  
  // Calculated values
  const [basicAnnualCost, setBasicAnnualCost] = useState(0);
  const [plusAnnualCost, setPlusAnnualCost] = useState(0);
  const [annualSavings, setAnnualSavings] = useState(0);
  const [feeSavings, setFeeSavings] = useState(0);
  
  // Calculate values when inputs change
  useEffect(() => {
    // Calculate processing fees
    const basicProcessingFee = (annualSales * basicFeeRate / 100) + (0.30 * (annualSales / 50)); // Assuming $50 avg order
    const plusProcessingFee = (annualSales * plusFeeRate / 100) + (0.30 * (annualSales / 50));
    
    // Calculate total annual costs
    const basicAnnual = basicProcessingFee + (basicMonthlyCost * 12);
    const plusAnnual = plusProcessingFee + (plusMonthlyCost * 12);
    
    // Calculate savings
    const processingFeeSavings = basicProcessingFee - plusProcessingFee;
    const totalSavings = basicAnnual - plusAnnual;
    
    setBasicAnnualCost(basicAnnual);
    setPlusAnnualCost(plusAnnual);
    setFeeSavings(processingFeeSavings);
    setAnnualSavings(totalSavings);
  }, [annualSales, basicFeeRate, plusFeeRate, basicMonthlyCost, plusMonthlyCost]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Handle sales input change
  const handleSalesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/,/g, ''), 10);
    if (!isNaN(value)) {
      setAnnualSales(value);
    }
  };
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setAnnualSales(value[0]);
  };
  
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-shopify-black mb-4 font-shopify">ROI Calculator</h2>
          <p className="text-shopify-muted max-w-2xl mx-auto">
            Adjust the values below to calculate your potential savings with Shopify Plus based on your specific sales volume.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-gray-100 shadow-md">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-6">Input Your Numbers</h3>
              
              <div className="mb-6">
                <Label htmlFor="annual-sales" className="mb-2 block">Annual Sales Volume</Label>
                <Input 
                  id="annual-sales"
                  type="text"
                  value={annualSales.toLocaleString()}
                  onChange={handleSalesChange}
                  className="mb-2"
                />
                <div className="py-4">
                  <Slider 
                    defaultValue={[1562954]} 
                    max={5000000}
                    min={100000}
                    step={50000}
                    value={[annualSales]}
                    onValueChange={handleSliderChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-shopify-muted mt-2">
                    <span>$100k</span>
                    <span>$2.5M</span>
                    <span>$5M</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="basic-fee" className="mb-2 block">Basic Plan Fee Rate (%)</Label>
                  <Input 
                    id="basic-fee" 
                    type="number" 
                    value={basicFeeRate} 
                    onChange={(e) => setBasicFeeRate(parseFloat(e.target.value))}
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor="plus-fee" className="mb-2 block">Plus Plan Fee Rate (%)</Label>
                  <Input 
                    id="plus-fee" 
                    type="number" 
                    value={plusFeeRate} 
                    onChange={(e) => setPlusFeeRate(parseFloat(e.target.value))}
                    step="0.1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="basic-monthly" className="mb-2 block">Basic Monthly Cost ($)</Label>
                  <Input 
                    id="basic-monthly" 
                    type="number" 
                    value={basicMonthlyCost} 
                    onChange={(e) => setBasicMonthlyCost(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="plus-monthly" className="mb-2 block">Plus Monthly Cost ($)</Label>
                  <Input 
                    id="plus-monthly" 
                    type="number" 
                    value={plusMonthlyCost} 
                    onChange={(e) => setPlusMonthlyCost(parseFloat(e.target.value))}
                  />
                </div>
              </div>
              
              <Button className="w-full bg-shopify-blue text-white hover:bg-blue-700">
                Calculate ROI
              </Button>
            </CardContent>
          </Card>
          
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
                  <h4 className="text-lg font-medium mb-2">Net Annual Savings</h4>
                  <p className={`text-3xl font-bold ${annualSavings > 0 ? 'text-shopify-green' : 'text-red-500'}`}>
                    {formatCurrency(annualSavings)}
                  </p>
                  <p className="text-sm text-shopify-muted mt-1">After subtracting higher plan costs</p>
                </div>
              </div>
              
              <Button className="w-full bg-shopify-green text-white hover:bg-green-700">
                Download Full ROI Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
