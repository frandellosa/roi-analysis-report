import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useCalculatorContext } from '@/contexts/CalculatorContext';
import { BasicInputs } from './calculator/BasicInputs';
import { GmvBreakdown } from './calculator/GmvBreakdown';
import { UpliftProjections } from './calculator/UpliftProjections';
import { FileUpload } from './calculator/FileUpload';
import { ROIResults } from './calculator/ROIResults';
import { ProcessingRatesTable } from './calculator/ProcessingRatesTable';
import { ShopifyAudiencesTable } from './calculator/ShopifyAudiencesTable';
import { CheckoutDropOff } from './calculator/CheckoutDropOff';

const ROICalculator = () => {
  // Default values - changed to 0
  const defaultValues = {
    annualSales: 0,
    basicMonthlyCost: 0,
    plusMonthlyCost: 0,
    d2cPercentage: 0,
    b2bPercentage: 0,
    retailPercentage: 0,
    currentConversionRate: 0,
    currentAOV: 0,
    plusTerm: "3year",
    d2cRate: 0,
    b2bRate: 0,
    retailRate: 0,
    reachedCheckout: 0,
    completedCheckout: 0
  };
  
  // Get selectedPlan from context
  const { selectedPlan, updateSelectedPlan, updateCalculatorValues, lowUpliftPercentage, averageUpliftPercentage, goodUpliftPercentage } = useCalculatorContext();
  
  // Basic inputs
  const [annualSales, setAnnualSales] = useState(defaultValues.annualSales);
  const [basicMonthlyCost, setBasicMonthlyCost] = useState(defaultValues.basicMonthlyCost);
  const [plusMonthlyCost, setPlusMonthlyCost] = useState(defaultValues.plusMonthlyCost);
  const [plusTerm, setPlusTerm] = useState(defaultValues.plusTerm);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileData, setFileData] = useState<any>(null);
  
  // GMV breakdown inputs
  const [d2cPercentage, setD2cPercentage] = useState(defaultValues.d2cPercentage);
  const [b2bPercentage, setB2bPercentage] = useState(defaultValues.b2bPercentage);
  const [retailPercentage, setRetailPercentage] = useState(defaultValues.retailPercentage);
  
  // Variable platform fee rates
  const [d2cRate, setD2cRate] = useState(defaultValues.d2cRate);
  const [b2bRate, setB2bRate] = useState(defaultValues.b2bRate);
  const [retailRate, setRetailRate] = useState(defaultValues.retailRate);
  const [transactionRate, setTransactionRate] = useState(0.2);

  // Project uplift metrics
  const [currentConversionRate, setCurrentConversionRate] = useState(defaultValues.currentConversionRate);
  const [currentAOV, setCurrentAOV] = useState(defaultValues.currentAOV);
  const [monthlyUpliftLow, setMonthlyUpliftLow] = useState(0);
  const [monthlyUpliftAverage, setMonthlyUpliftAverage] = useState(0);
  const [monthlyUpliftGood, setMonthlyUpliftGood] = useState(0);
  
  // Checkout drop-off metrics
  const [reachedCheckout, setReachedCheckout] = useState(defaultValues.reachedCheckout);
  const [completedCheckout, setCompletedCheckout] = useState(defaultValues.completedCheckout);

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
  
  // Reset calculator to default values
  const resetCalculator = () => {
    setAnnualSales(defaultValues.annualSales);
    setBasicMonthlyCost(defaultValues.basicMonthlyCost);
    setPlusMonthlyCost(defaultValues.plusMonthlyCost);
    updateSelectedPlan("basic"); // Update through context
    setPlusTerm(defaultValues.plusTerm);
    setD2cPercentage(defaultValues.d2cPercentage);
    setB2bPercentage(defaultValues.b2bPercentage);
    setRetailPercentage(defaultValues.retailPercentage);
    setD2cRate(defaultValues.d2cRate);
    setB2bRate(defaultValues.b2bRate);
    setRetailRate(defaultValues.retailRate);
    setCurrentConversionRate(defaultValues.currentConversionRate);
    setCurrentAOV(defaultValues.currentAOV);
    setReachedCheckout(defaultValues.reachedCheckout);
    setCompletedCheckout(defaultValues.completedCheckout);
    setFileData(null);
    
    // Clear file upload
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFileName(null);
    
    // Recalculate with default values
    setTimeout(() => {
      calculateROI();
      toast.success("Calculator values have been reset to defaults");
    }, 100);
  };

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

  // Update monthly cost when plan changes
  useEffect(() => {
    // Extract the base plan name (removing any billing suffix)
    const basePlan = selectedPlan.split('-')[0];
    
    if (basePlan === "basic") {
      setBasicMonthlyCost(monthlyCosts.basic);
    } else if (basePlan === "shopify") {
      setBasicMonthlyCost(monthlyCosts.shopify);
    } else if (basePlan === "advanced") {
      setBasicMonthlyCost(monthlyCosts.advanced);
    }
  }, [selectedPlan]); // This now uses the context value

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

  // Calculate processing fees using the rates table data
  const calculateProcessingFees = () => {
    // If we have file data, use it for calculations
    if (fileData) {
      // Simple example - in a real implementation this would parse and analyze the file data
      // For now, we'll just use a placeholder implementation
      return {
        basicProcessingFee: fileData.totalAmount * (processingRates[selectedPlan].standardDomestic / 100) + (fileData.transactions * 0.30),
        plusProcessingFee: fileData.totalAmount * (processingRates.plus.standardDomestic / 100) + (fileData.transactions * 0.30),
      };
    } else {
      // No file uploaded - use the standard calculation based on annual sales
      const avgOrderValue = currentAOV > 0 ? currentAOV : 50; // Use current AOV if available, otherwise default to $50
      const transactionsCount = annualSales / avgOrderValue;
      const transactionFee = 0.30;
      
      // Use the selected plan's standard domestic rate and Plus plan's rate
      const basicRate = processingRates[selectedPlan as keyof typeof processingRates].standardDomestic;
      const plusRate = processingRates.plus.standardDomestic;
      
      const basicProcessingFee = (annualSales * basicRate / 100) + (transactionFee * transactionsCount);
      const plusProcessingFee = (annualSales * plusRate / 100) + (transactionFee * transactionsCount);
      
      return {
        basicProcessingFee,
        plusProcessingFee
      };
    }
  };
  
  // Calculate Revenue Uplift with different scenarios
  const calculateRevenueUplift = () => {
    // Calculate monthly base metrics
    const monthlyVisitors = (annualSales / 12) / (currentAOV * (currentConversionRate / 100));

    // Use configurable percentages from context instead of hardcoded values
    // Low uplift scenario
    const lowCR = currentConversionRate * (1 + lowUpliftPercentage / 100);
    const lowAOV = currentAOV * (1 + lowUpliftPercentage / 100);
    const currentMonthlyRevenue = monthlyVisitors * currentConversionRate / 100 * currentAOV;
    const lowMonthlyRevenue = monthlyVisitors * lowCR / 100 * lowAOV;
    const lowUplift = lowMonthlyRevenue - currentMonthlyRevenue;
    
    // Average uplift scenario
    const avgCR = currentConversionRate * (1 + averageUpliftPercentage / 100);
    const avgAOV = currentAOV * (1 + averageUpliftPercentage / 100);
    const avgMonthlyRevenue = monthlyVisitors * avgCR / 100 * avgAOV;
    const avgUplift = avgMonthlyRevenue - currentMonthlyRevenue;
    
    // Good uplift scenario (now 15% instead of 20%)
    const goodCR = currentConversionRate * (1 + goodUpliftPercentage / 100);
    const goodAOV = currentAOV * (1 + goodUpliftPercentage / 100);
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
    // Get processing fees using the processing rates
    const { basicProcessingFee, plusProcessingFee } = calculateProcessingFees();
    
    // Calculate the savings in processing fees
    const processingFeeSavings = basicProcessingFee - plusProcessingFee;
    
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

    // Update the context with new values, including selectedPlan
    updateCalculatorValues({
      annualSales,
      basicFeeRate: processingRates[selectedPlan as keyof typeof processingRates].standardDomestic,
      plusFeeRate: processingRates.plus.standardDomestic,
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
      currentAOV,
      selectedPlan,
      reachedCheckout,
      completedCheckout
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
    updateSelectedPlan(value); // Use context setter
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

  // Handle checkout input changes
  const handleCheckoutChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setter(value);
    }
  };

  // Parse the uploaded file and extract payment data
  const parsePaymentFile = (file: File) => {
    // For demo purposes, we'll create a simplified mock parsing
    // In a real app, you would use Papa Parse or ExcelJS to parse CSV/Excel files
    
    // Mock file analysis result - this would come from actual file parsing
    const mockData = {
      totalAmount: annualSales > 0 ? annualSales : 1000000, // Use entered amount or default to $1M
      transactions: 5000,
      avgOrderValue: 200,
      paymentTypes: {
        standard: 0.7,
        premium: 0.2,
        international: 0.1
      }
    };
    
    setFileData(mockData);
    
    // Update current AOV if available from file
    if (mockData.avgOrderValue && currentAOV === 0) {
      setCurrentAOV(mockData.avgOrderValue);
    }
    
    return mockData;
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      
      // Parse the file
      const data = parsePaymentFile(file);
      
      toast.success(`File uploaded: ${file.name}`, {
        description: "Your payment data has been analyzed for ROI calculation."
      });
    }
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Fixed function to update calculator values using the correct context function
  const updateCalculatorContext = (values: any) => {
    updateCalculatorValues(values);
  };

  // Shared calculator state and methods to pass to child components
  const calculatorState = {
    annualSales,
    setAnnualSales,
    basicMonthlyCost,
    setBasicMonthlyCost,
    plusMonthlyCost,
    setPlusMonthlyCost,
    effectivePlusMonthlyCost,
    selectedPlan,
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
    reachedCheckout,
    setReachedCheckout,
    completedCheckout,
    setCompletedCheckout,
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
    handleCheckoutChange,
    formatCurrency,
    setMonthlyUpliftLow,
    setMonthlyUpliftAverage,
    setMonthlyUpliftGood,
    resetCalculator,
    calculateROI // Add the calculateROI function to the state so it can be called from UpliftProjections
  };
  
  return (
    <div className="bg-white py-16" id="roi-calculator">
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

              <CheckoutDropOff
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
                className="w-full mb-4"
                size="lg"
              >
                <Calculator className="mr-2" /> Calculate ROI
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetCalculator}
                className="w-full flex items-center justify-center gap-1 text-sm"
              >
                <RotateCcw className="h-4 w-4" /> Reset Values
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

            <ShopifyAudiencesTable
              currentAOV={currentAOV}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
