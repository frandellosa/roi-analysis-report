import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { toast } from 'sonner';
import { useCalculatorContext } from '@/contexts/CalculatorContext';
import { ROIResults } from './calculator/ROIResults';
import { ProcessingRatesTable } from './calculator/ProcessingRatesTable';
import { CalculatorControls } from './calculator/CalculatorControls';
import { 
  calculateProcessingFees, 
  calculateRevenueUplift, 
  getPlanMonthlyCost, 
  formatCurrency, 
  parsePaymentFile 
} from '@/services/calculatorService';
import { DefaultValues } from '@/types/calculator';

const ROICalculator = () => {
  // Default values
  const defaultValues: DefaultValues = {
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
  
  // Get context values
  const { 
    selectedPlan, 
    updateSelectedPlan, 
    updateCalculatorValues, 
    plans,
    lowUpliftPercentage, 
    averageUpliftPercentage, 
    goodUpliftPercentage,
    processingRates
  } = useCalculatorContext();
  
  // Basic inputs
  const [annualSales, setAnnualSales] = useState(defaultValues.annualSales);
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
  const [basicMonthlyCost, setBasicMonthlyCost] = useState(0); // Add state for basicMonthlyCost
  
  // Channel VPF values
  const [d2cVpf, setD2cVpf] = useState(0);
  const [b2bVpf, setB2bVpf] = useState(0);
  const [retailVpf, setRetailVpf] = useState(0);
  
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

  // Reset calculator to default values
  const resetCalculator = () => {
    setAnnualSales(defaultValues.annualSales);
    updateSelectedPlan("basic"); // Update through context
    setPlusMonthlyCost(defaultValues.plusMonthlyCost);
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
  
  // Update ROI calculation to ensure the proper fee rates are stored in context
  const calculateROI = () => {
    // Get the base plan name for accessing processing rates
    const basePlan = selectedPlan.split('-')[0];
    const billingPeriod = selectedPlan.includes('-') ? selectedPlan.split('-')[1] : 'monthly';
    
    // Get the current plan's monthly cost
    const currentBasicMonthlyCost = getPlanMonthlyCost(basePlan, billingPeriod, plans);
    
    // Update the state with the calculated monthly cost
    setBasicMonthlyCost(currentBasicMonthlyCost);
    
    // Get processing fees using the processing rates from context
    const { basicProcessingFee, plusProcessingFee } = calculateProcessingFees(
      annualSales,
      selectedPlan,
      processingRates,
      currentAOV,
      fileData
    );
    
    // Calculate the savings in processing fees
    const processingFeeSavings = basicProcessingFee - plusProcessingFee;
    
    // Calculate total annual costs
    const basicAnnual = basicProcessingFee + (currentBasicMonthlyCost * 12);
    const plusAnnual = plusProcessingFee + (effectivePlusMonthlyCost * 12);
    
    // Calculate savings
    const totalSavings = basicAnnual - plusAnnual;
    
    // Calculate projected revenue uplift
    const upliftRevenue = calculateRevenueUplift(
      reachedCheckout,
      completedCheckout,
      currentConversionRate,
      currentAOV,
      annualSales,
      lowUpliftPercentage,
      averageUpliftPercentage,
      goodUpliftPercentage,
      setMonthlyUpliftLow,
      setMonthlyUpliftAverage,
      setMonthlyUpliftGood
    );
    
    setBasicAnnualCost(basicAnnual);
    setPlusAnnualCost(plusAnnual);
    setFeeSavings(processingFeeSavings);
    setAnnualSavings(totalSavings);
    
    // Get the current plan's processing rate
    const currentRate = processingRates[basePlan]?.standardDomestic || 0;
    const plusRate = processingRates.plus?.standardDomestic || 0;

    // Update the context with new values, including uplift values
    updateCalculatorValues({
      annualSales,
      basicFeeRate: currentRate,
      plusFeeRate: plusRate,
      basicMonthlyCost: currentBasicMonthlyCost,
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

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      
      // Parse the file
      const data = parsePaymentFile(file, annualSales, currentAOV);
      setFileData(data);
      
      // Update current AOV if available from file
      if (data.avgOrderValue && currentAOV === 0) {
        setCurrentAOV(data.avgOrderValue);
      }
      
      // Trigger ROI calculation to update uplift projections
      setTimeout(() => {
        calculateROI();
      }, 100);
      
      toast.success(`File uploaded: ${file.name}`, {
        description: "Your payment data has been analyzed and ROI calculations updated."
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
    plans,
    processingRates, // Include processingRates in calculatorState
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
    calculateROI,
    basicMonthlyCost,
    plusMonthlyCost
  };
  
  // Add an effect to recalculate ROI when plan selection changes
  useEffect(() => {
    if (annualSales > 0) {
      calculateROI();
    }
  }, [selectedPlan]);
  
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
            <CalculatorControls
              calculatorState={calculatorState}
              fileInputRef={fileInputRef}
              fileName={fileName}
              handleFileUpload={handleFileUpload}
              triggerFileUpload={triggerFileUpload}
            />
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
