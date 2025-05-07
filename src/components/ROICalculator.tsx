import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, File, Calculator, Info, ArrowUp, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
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
import { useCalculatorContext } from '@/contexts/CalculatorContext';
import { Slider } from "@/components/ui/slider";

const ROICalculator = () => {
  // Basic inputs
  const [annualSales, setAnnualSales] = useState(1562954);
  const [basicFeeRate, setBasicFeeRate] = useState(2.9);
  const [plusFeeRate, setPlusFeeRate] = useState(2.4);
  const [basicMonthlyCost, setBasicMonthlyCost] = useState(39);
  const [plusMonthlyCost, setPlusMonthlyCost] = useState(2000);
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [plusTerm, setPlusTerm] = useState("3year");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  
  // GMV breakdown inputs
  const [d2cPercentage, setD2cPercentage] = useState(70);
  const [b2bPercentage, setB2bPercentage] = useState(20);
  const [retailPercentage, setRetailPercentage] = useState(10);
  
  // Variable platform fee rates - now using number inputs instead of toggles
  const [d2cRate, setD2cRate] = useState(plusTerm === '3year' ? 0.35 : 0.4);
  const [b2bRate, setB2bRate] = useState(0.18);
  const [retailRate, setRetailRate] = useState(0.25);
  const [transactionRate, setTransactionRate] = useState(0.2);

  // Project uplift metrics
  const [currentConversionRate, setCurrentConversionRate] = useState(2.5);
  const [currentAOV, setCurrentAOV] = useState(120);
  const [monthlyUpliftLow, setMonthlyUpliftLow] = useState(0);
  const [monthlyUpliftAverage, setMonthlyUpliftAverage] = useState(0);
  const [monthlyUpliftGood, setMonthlyUpliftGood] = useState(0);

  // Calculated values
  const [basicAnnualCost, setBasicAnnualCost] = useState(0);
  const [plusAnnualCost, setPlusAnnualCost] = useState(0);
  const [annualSavings, setAnnualSavings] = useState(0);
  const [feeSavings, setFeeSavings] = useState(0);
  const [vpfMonthly, setVpfMonthly] = useState(0);
  const [effectivePlusMonthlyCost, setEffectivePlusMonthlyCost] = useState(plusMonthlyCost);
  
  // Channel VPF values
  const [d2cVpf, setD2cVpf] = useState(0);
  const [b2bVpf, setB2bVpf] = useState(0);
  const [retailVpf, setRetailVpf] = useState(0);

  // Access calculator context for updating values
  const { updateCalculatorValues } = useCalculatorContext();
  
  // Processing rates based on the updated pricing from Shopify's website
  const processingRates = {
    basic: {
      standardDomestic: 2.9,
      standardInternational: 3.9,
      premiumDomestic: 3.5,
      premiumInternational: 4.5,
      shopPayInstallments: 5.9
    },
    shopify: {
      standardDomestic: 2.7,
      standardInternational: 3.7,
      premiumDomestic: 3.3,
      premiumInternational: 4.3,
      shopPayInstallments: 5.9
    },
    advanced: {
      standardDomestic: 2.5,
      standardInternational: 3.5,
      premiumDomestic: 3.1,
      premiumInternational: 4.1,
      shopPayInstallments: 5.9
    },
    plus: {
      standardDomestic: 2.4,
      standardInternational: 3.4,
      premiumDomestic: 2.8,
      premiumInternational: 3.8,
      shopPayInstallments: 5.0
    }
  };

  // Monthly costs by plan
  const monthlyCosts = {
    basic: 39,
    shopify: 105,
    advanced: 399
  };

  // Update fee rates and monthly cost when plan changes
  useEffect(() => {
    if (selectedPlan === "basic") {
      setBasicFeeRate(2.9);
      setBasicMonthlyCost(monthlyCosts.basic);
    } else if (selectedPlan === "shopify") {
      setBasicFeeRate(2.7);
      setBasicMonthlyCost(monthlyCosts.shopify);
    } else if (selectedPlan === "advanced") {
      setBasicFeeRate(2.5);
      setBasicMonthlyCost(monthlyCosts.advanced);
    }
    // Plus rate stays constant
  }, [selectedPlan]);

  // Update Plus monthly cost based on term selection
  useEffect(() => {
    if (plusTerm === "3year") {
      setPlusMonthlyCost(2000);
      setD2cRate(0.35); // Update D2C rate based on term
    } else if (plusTerm === "1year") {
      setPlusMonthlyCost(2500);
      setD2cRate(0.4);  // Update D2C rate based on term
    }
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
  }, [plusTerm, annualSales, d2cPercentage, b2bPercentage, retailPercentage, plusMonthlyCost, d2cRate, b2bRate, retailRate]);

  // Calculate processing fees - extracted as a separate function for consistency
  const calculateProcessingFees = () => {
    const avgOrderValue = 50; // Assuming $50 avg order
    const transactionsCount = annualSales / avgOrderValue;
    const transactionFee = 0.30;
    
    const basicProcessingFee = (annualSales * basicFeeRate / 100) + (transactionFee * transactionsCount);
    const plusProcessingFee = (annualSales * plusFeeRate / 100) + (transactionFee * transactionsCount);
    
    return {
      basicProcessingFee,
      plusProcessingFee,
      processingFeeSavings: basicProcessingFee - plusProcessingFee
    };
  };
  
  // Calculate Revenue Uplift with different scenarios
  const calculateRevenueUplift = () => {
    // Calculate monthly base metrics
    const monthlyVisitors = (annualSales / 12) / (currentAOV * (currentConversionRate / 100));

    // Low uplift scenario (5% improvement)
    const lowCR = currentConversionRate * 1.05;
    const lowAOV = currentAOV * 1.05;
    const currentMonthlyRevenue = monthlyVisitors * currentConversionRate / 100 * currentAOV;
    const lowMonthlyRevenue = monthlyVisitors * lowCR / 100 * lowAOV;
    const lowUplift = lowMonthlyRevenue - currentMonthlyRevenue;
    
    // Average uplift scenario (10% improvement)
    const avgCR = currentConversionRate * 1.1;
    const avgAOV = currentAOV * 1.1;
    const avgMonthlyRevenue = monthlyVisitors * avgCR / 100 * avgAOV;
    const avgUplift = avgMonthlyRevenue - currentMonthlyRevenue;
    
    // Good uplift scenario (20% improvement)
    const goodCR = currentConversionRate * 1.2;
    const goodAOV = currentAOV * 1.2;
    const goodMonthlyRevenue = monthlyVisitors * goodCR / 100 * goodAOV;
    const goodUplift = goodMonthlyRevenue - currentMonthlyRevenue;
    
    setMonthlyUpliftLow(lowUplift);
    setMonthlyUpliftAverage(avgUplift);
    setMonthlyUpliftGood(goodUplift);
    
    // Annualized uplift (average scenario * 12) for the existing total calculation
    const annualUplift = avgUplift * 12;
    
    return annualUplift;
  };
  
  // Calculate ROI
  const calculateROI = () => {
    // Use the consistent processing fee calculation
    const { basicProcessingFee, plusProcessingFee, processingFeeSavings } = calculateProcessingFees();
    
    // Calculate total annual costs
    const basicAnnual = basicProcessingFee + (basicMonthlyCost * 12);
    const plusAnnual = plusProcessingFee + (effectivePlusMonthlyCost * 12);
    
    // Calculate savings
    const totalSavings = basicAnnual - plusAnnual;
    
    // Calculate projected revenue uplift
    const upliftRevenue = calculateRevenueUplift();
    
    setBasicAnnualCost(basicAnnual);
    setPlusAnnualCost(plusAnnual);
    setFeeSavings(processingFeeSavings);
    setAnnualSavings(totalSavings);

    // Update the context with new values
    updateCalculatorValues({
      annualSales,
      basicFeeRate,
      plusFeeRate,
      basicMonthlyCost,
      plusMonthlyCost,
      effectivePlusMonthlyCost,
      processingFeeSavings,
      annualNetSavings: totalSavings,
      projectedUplift: upliftRevenue,
      monthlyUpliftLow: monthlyUpliftLow,
      monthlyUpliftAverage: monthlyUpliftAverage,
      monthlyUpliftGood: monthlyUpliftGood,
      currentConversionRate,
      currentAOV
    });

    toast.success("ROI calculation complete", {
      description: `Annual savings with Shopify Plus: ${formatCurrency(totalSavings)}`
    });
  };

  // Calculate values when inputs change
  useEffect(() => {
    // We'll only auto-calculate on initial load but not on every input change
    // User needs to click the Calculate ROI button for updates
    if (basicAnnualCost === 0) {
      calculateROI();
    }
  }, []);
  
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

  // Handle plan selection change
  const handlePlanChange = (value: string) => {
    setSelectedPlan(value);
  };

  // Handle term selection change
  const handleTermChange = (value: string) => {
    setPlusTerm(value);
  };

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

  // Calculate percentage increase
  const calculatePercentageIncrease = (current: number, projected: number) => {
    return ((projected - current) / current * 100).toFixed(1);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      toast.success(`File uploaded: ${file.name}`, {
        description: "Your payment data will be analyzed for ROI calculation."
      });
    }
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
                <Label htmlFor="current-plan" className="mb-2 block">Current Plan</Label>
                <Select value={selectedPlan} onValueChange={handlePlanChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your current plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic ($39/month)</SelectItem>
                    <SelectItem value="shopify">Shopify ($105/month)</SelectItem>
                    <SelectItem value="advanced">Advanced ($399/month)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                        <SelectItem value="3year">3 Year Term ($2,000/month)</SelectItem>
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
                            3 Year Term ($2,000/mo min or VPF)
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

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="file-upload">Upload Payment Data</Label>
                  {fileName && <span className="text-sm text-green-600">{fileName}</span>}
                </div>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={triggerFileUpload}
                >
                  <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept=".csv,.xlsx,.xls"
                  />
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Drag and drop your payment data file, or <span className="text-shopify-blue">browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports CSV, Excel (.xlsx, .xls)
                  </p>
                </div>
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
                  <Label htmlFor="basic-fee" className="mb-2 block">{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan Fee Rate (%)</Label>
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
                  <Label htmlFor="basic-monthly" className="mb-2 block">Current Plan Monthly Cost ($)</Label>
                  <Input 
                    id="basic-monthly" 
                    type="number" 
                    value={basicMonthlyCost} 
                    onChange={(e) => setBasicMonthlyCost(parseFloat(e.target.value))}
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

              <Button 
                onClick={calculateROI} 
                className="w-full"
                size="lg"
              >
                <Calculator className="mr-2" /> Calculate ROI
              </Button>
            </CardContent>
          </Card>
          
          <div className="flex flex-col gap-6">
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
                      {annualSavings >= 0 ? "Net Annual Savings" : "True Cost of Upgrade"}
                    </h4>
                    <p className={`text-3xl font-bold ${annualSavings >= 0 ? 'text-shopify-green' : 'text-shopify-black'}`}>
                      {formatCurrency(Math.abs(annualSavings))}
                    </p>
                    <p className="text-sm text-shopify-muted mt-1">After subtracting higher plan costs</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-medium mb-2">Projected Revenue Uplift</h4>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <p className="text-sm font-semibold text-amber-600 mb-1">Low</p>
                        <p className="text-xl font-bold text-amber-600">{formatCurrency(monthlyUpliftLow)}</p>
                        <p className="text-xs text-gray-500">Per Month</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <p className="text-sm font-semibold text-blue-600 mb-1">Average</p>
                        <p className="text-xl font-bold text-blue-600">{formatCurrency(monthlyUpliftAverage)}</p>
                        <p className="text-xs text-gray-500">Per Month</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <p className="text-sm font-semibold text-green-600 mb-1">Good</p>
                        <p className="text-xl font-bold text-green-600">{formatCurrency(monthlyUpliftGood)}</p>
                        <p className="text-xs text-gray-500">Per Month</p>
                      </div>
                    </div>
                    <p className="text-sm text-shopify-muted mt-1">
                      Based on your current metrics and projected improvements in conversion rate and AOV 
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-100 shadow-md">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Processing Rate Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plus</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Savings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-2 text-sm">Standard Domestic</td>
                        <td className="px-4 py-2 text-sm">{processingRates[selectedPlan as keyof typeof processingRates].standardDomestic}% + 30¢</td>
                        <td className="px-4 py-2 text-sm">{processingRates.plus.standardDomestic}% + 30¢</td>
                        <td className="px-4 py-2 text-sm text-green-600">{(processingRates[selectedPlan as keyof typeof processingRates].standardDomestic - processingRates.plus.standardDomestic).toFixed(2)}%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">Standard International</td>
                        <td className="px-4 py-2 text-sm">{processingRates[selectedPlan as keyof typeof processingRates].standardInternational}% + 30¢</td>
                        <td className="px-4 py-2 text-sm">{processingRates.plus.standardInternational}% + 30¢</td>
                        <td className="px-4 py-2 text-sm text-green-600">{(processingRates[selectedPlan as keyof typeof processingRates].standardInternational - processingRates.plus.standardInternational).toFixed(2)}%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">Premium Domestic</td>
                        <td className="px-4 py-2 text-sm">{processingRates[selectedPlan as keyof typeof processingRates].premiumDomestic}% + 30¢</td>
                        <td className="px-4 py-2 text-sm">{processingRates.plus.premiumDomestic}% + 30¢</td>
                        <td className="px-4 py-2 text-sm text-green-600">{(processingRates[selectedPlan as keyof typeof processingRates].premiumDomestic - processingRates.plus.premiumDomestic).toFixed(2)}%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">Premium International</td>
                        <td className="px-4 py-2 text-sm">{processingRates[selectedPlan as keyof typeof processingRates].premiumInternational}% + 30¢</td>
                        <td className="px-4 py-2 text-sm">{processingRates.plus.premiumInternational}% + 30¢</td>
                        <td className="px-4 py-2 text-sm text-green-600">{(processingRates[selectedPlan as keyof typeof processingRates].premiumInternational - processingRates.plus.premiumInternational).toFixed(2)}%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">Shop Pay Installments</td>
                        <td className="px-4 py-2 text-sm">{processingRates[selectedPlan as keyof typeof processingRates].shopPayInstallments}% + 30¢</td>
                        <td className="px-4 py-2 text-sm">{processingRates.plus.shopPayInstallments}% + 30¢</td>
                        <td className="px-4 py-2 text-sm text-green-600">{(processingRates[selectedPlan as keyof typeof processingRates].shopPayInstallments - processingRates.plus.shopPayInstallments).toFixed(2)}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  <p>* Additional rates for Shop Pay Express and other payment methods apply.</p>
                  <p>* All rates shown are for USA market.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
