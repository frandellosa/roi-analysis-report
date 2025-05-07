
import React, { useState, useRef, useEffect } from 'react';
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
import { Upload, Calculator } from 'lucide-react';
import { toast } from 'sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useCalculatorContext } from '@/contexts/CalculatorContext';
import VPFCalculator from './VPFCalculator';

const InputSection = () => {
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
  const [effectivePlusMonthlyCost, setEffectivePlusMonthlyCost] = useState(plusMonthlyCost);
  
  // Access calculator context for updating values
  const { updateCalculatorValues } = useCalculatorContext();
  
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
  
  // Calculate processing fees
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
  
  // Calculate ROI
  const calculateROI = () => {
    // Use the consistent processing fee calculation
    const { basicProcessingFee, plusProcessingFee, processingFeeSavings } = calculateProcessingFees();
    
    // Calculate total annual costs
    const basicAnnual = basicProcessingFee + (basicMonthlyCost * 12);
    const plusAnnual = plusProcessingFee + (effectivePlusMonthlyCost * 12);
    
    // Calculate savings
    const totalSavings = basicAnnual - plusAnnual;

    // Update the context with new values
    updateCalculatorValues({
      annualSales,
      basicFeeRate,
      plusFeeRate,
      basicMonthlyCost,
      plusMonthlyCost,
      effectivePlusMonthlyCost,
      processingFeeSavings,
      annualNetSavings: totalSavings
    });

    toast.success("ROI calculation complete", {
      description: `Annual savings with Shopify Plus: ${formatCurrency(totalSavings)}`
    });
  };

  // Calculate values on initial load
  useEffect(() => {
    calculateROI();
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

  // Callback to update effective plus monthly cost from VPFCalculator
  const updateEffectiveCost = (cost: number) => {
    setEffectivePlusMonthlyCost(cost);
  };
  
  return (
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
            <VPFCalculator 
              annualSales={annualSales}
              plusTerm={plusTerm}
              plusMonthlyCost={plusMonthlyCost}
              updateEffectiveCost={updateEffectiveCost}
            />
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
  );
};

export default InputSection;
