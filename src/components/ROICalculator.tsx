import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator } from 'lucide-react';
import { toast } from 'sonner';
import { useCalculatorContext } from '@/contexts/CalculatorContext';
import { BasicInputs } from './calculator/BasicInputs';
import { GmvBreakdown } from './calculator/GmvBreakdown';
import { UpliftProjections } from './calculator/UpliftProjections';
import { FileUpload } from './calculator/FileUpload';
import { ROIResults } from './calculator/ROIResults';
import { ProcessingRatesTable } from './calculator/ProcessingRatesTable';

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
  
  // Variable platform fee rates
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
  
  // Processing rates based on Shopify's website
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
    shopify: 105, // Updated to reflect Grow plan at $105
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
  }, [selectedPlan]);

  // Update Plus monthly cost based on term selection
  useEffect(() => {
    if (plusTerm === "3year") {
      setPlusMonthlyCost(2300);
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

  // Shared calculator state and methods to pass to child components
  const calculatorState = {
    annualSales,
    setAnnualSales,
    basicFeeRate,
    setBasicFeeRate,
    plusFeeRate,
    setPlusFeeRate,
    basicMonthlyCost,
    setBasicMonthlyCost,
    plusMonthlyCost,
    setPlusMonthlyCost,
    effectivePlusMonthlyCost,
    selectedPlan,
    setSelectedPlan,
    plusTerm,
    setPlusTerm,
    d2cPercentage,
    b2bPercentage,
    retailPercentage,
    d2cRate,
    setD2cRate,
    b2bRate,
    setB2bRate,
    retailRate,
    setRetailRate,
    d2cVpf,
    b2bVpf,
    retailVpf,
    vpfMonthly,
    currentConversionRate,
    setCurrentConversionRate,
    currentAOV,
    setCurrentAOV,
    monthlyUpliftLow,
    monthlyUpliftAverage,
    monthlyUpliftGood,
    basicAnnualCost,
    plusAnnualCost,
    feeSavings,
    annualSavings,
    monthlyCosts,
    processingRates,
    handlePlanChange,
    handleTermChange,
    handleSalesChange,
    handleSliderChange,
    handleD2CChange,
    handleB2BChange,
    handleRateChange,
    formatCurrency,
    setMonthlyUpliftLow,
    setMonthlyUpliftAverage,
    setMonthlyUpliftGood,
    currentConversionRate,
    currentAOV
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
              
              <BasicInputs 
                calculatorState={calculatorState} 
              />

              <GmvBreakdown 
                calculatorState={calculatorState} 
              />

              <FileUpload 
                fileInputRef={fileInputRef}
                fileName={fileName}
                handleFileUpload={handleFileUpload}
                triggerFileUpload={triggerFileUpload}
              />

              <UpliftProjections 
                calculatorState={calculatorState}
              />

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
            <ROIResults 
              calculatorState={calculatorState}
            />

            <ProcessingRatesTable 
              processingRates={processingRates}
              selectedPlan={selectedPlan}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
