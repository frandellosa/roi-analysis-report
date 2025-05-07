
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Upload, File, Calculator, Info } from 'lucide-react';
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

const ROICalculator = () => {
  // Basic inputs
  const [annualSales, setAnnualSales] = useState(1562954);
  const [basicFeeRate, setBasicFeeRate] = useState(2.9);
  const [plusFeeRate, setPlusFeeRate] = useState(2.25);
  const [basicMonthlyCost, setBasicMonthlyCost] = useState(39);
  const [plusMonthlyCost, setPlusMonthlyCost] = useState(2300);
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [plusTerm, setPlusTerm] = useState("3year");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  
  // GMV breakdown inputs
  const [d2cPercentage, setD2cPercentage] = useState(70);
  const [b2bPercentage, setB2bPercentage] = useState(20);
  const [retailPercentage, setRetailPercentage] = useState(10);
  const [useVpf, setUseVpf] = useState(false);

  // Variable platform fee rates
  const vpfRates = {
    '1year': {
      d2c: 0.4,
      b2b: 0.18,
      retail: 0.25,
      transaction: 0.20
    },
    '3year': {
      d2c: 0.35,
      b2b: 0.18,
      retail: 0.25,
      transaction: 0.20
    }
  };
  
  // Calculated values
  const [basicAnnualCost, setBasicAnnualCost] = useState(0);
  const [plusAnnualCost, setPlusAnnualCost] = useState(0);
  const [annualSavings, setAnnualSavings] = useState(0);
  const [feeSavings, setFeeSavings] = useState(0);
  const [vpfMonthly, setVpfMonthly] = useState(0);
  const [effectivePlusMonthlyCost, setEffectivePlusMonthlyCost] = useState(plusMonthlyCost);
  
  // Processing rates based on the image
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
      standardDomestic: 2.25,
      standardInternational: 3.25,
      premiumDomestic: 2.95,
      premiumInternational: 3.95,
      shopPayInstallments: 5.0
    }
  };

  // Monthly costs by plan
  const monthlyCosts = {
    basic: 39,
    shopify: 79,
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
      setPlusMonthlyCost(2300);
    } else if (plusTerm === "1year") {
      setPlusMonthlyCost(2500);
    }
  }, [plusTerm]);

  // Calculate Variable Platform Fee
  useEffect(() => {
    const monthlyGMV = annualSales / 12;
    const d2cGMV = monthlyGMV * (d2cPercentage / 100);
    const b2bGMV = monthlyGMV * (b2bPercentage / 100);
    const retailGMV = monthlyGMV * (retailPercentage / 100);

    const rates = vpfRates[plusTerm as keyof typeof vpfRates];
    
    const vpfAmount = (
      (d2cGMV * rates.d2c / 100) + 
      (b2bGMV * rates.b2b / 100) + 
      (retailGMV * rates.retail / 100)
    );
    
    setVpfMonthly(vpfAmount);

    // Apply the pricing rule: VPF or minimum monthly, whichever is greater
    if (useVpf && vpfAmount > plusMonthlyCost) {
      setEffectivePlusMonthlyCost(vpfAmount);
    } else {
      setEffectivePlusMonthlyCost(plusMonthlyCost);
    }
  }, [plusTerm, annualSales, d2cPercentage, b2bPercentage, retailPercentage, plusMonthlyCost, useVpf]);

  // Calculate ROI
  const calculateROI = () => {
    // Calculate processing fees
    const basicProcessingFee = (annualSales * basicFeeRate / 100) + (0.30 * (annualSales / 50)); // Assuming $50 avg order
    const plusProcessingFee = (annualSales * plusFeeRate / 100) + (0.30 * (annualSales / 50));
    
    // Calculate total annual costs
    const basicAnnual = basicProcessingFee + (basicMonthlyCost * 12);
    const plusAnnual = plusProcessingFee + (effectivePlusMonthlyCost * 12);
    
    // Calculate savings
    const processingFeeSavings = basicProcessingFee - plusProcessingFee;
    const totalSavings = basicAnnual - plusAnnual;
    
    setBasicAnnualCost(basicAnnual);
    setPlusAnnualCost(plusAnnual);
    setFeeSavings(processingFeeSavings);
    setAnnualSavings(totalSavings);

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
                    <SelectItem value="shopify">Shopify ($79/month)</SelectItem>
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
                              <p className="mt-2">Plus pricing will be either the monthly minimum fee OR the VPF, whichever is greater.</p>
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
                        <Label>D2C Sales ({plusTerm === '3year' ? '0.35%' : '0.40%'})</Label>
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
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <Label>B2B Sales (0.18%)</Label>
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
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <Label>Retail Sales (0.25%)</Label>
                        <span className="text-sm">{retailPercentage}%</span>
                      </div>
                      <Input
                        type="text"
                        value={retailPercentage + "%"}
                        disabled
                        className="bg-gray-100"
                      />
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
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="use-vpf"
                        checked={useVpf}
                        onChange={(e) => setUseVpf(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="use-vpf" className="text-sm">
                        Use Variable Platform Fee in calculations
                      </Label>
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
                    <h4 className="text-lg font-medium mb-2">Net Annual Savings</h4>
                    <p className={`text-3xl font-bold ${annualSavings > 0 ? 'text-shopify-green' : 'text-red-500'}`}>
                      {formatCurrency(annualSavings)}
                    </p>
                    <p className="text-sm text-shopify-muted mt-1">After subtracting higher plan costs</p>
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
