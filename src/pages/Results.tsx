
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/Footer";
import Stats from "@/components/Stats";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCalculatorContext } from "@/contexts/CalculatorContext";
import { ROIResults } from "@/components/calculator/ROIResults";
import { ProcessingRatesTable } from "@/components/calculator/ProcessingRatesTable";
import Timeline from "@/components/Timeline";
import { ArrowLeft } from "lucide-react";

const Results = () => {
  const navigate = useNavigate();
  const calculatorContext = useCalculatorContext();
  
  // Extract necessary properties from context
  const { 
    processingRates, 
    selectedPlan, 
    formatCurrency = (val: number) => new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val)
  } = calculatorContext;

  // Create a simplified calculatorState object with just what ROIResults needs
  const calculatorState = {
    ...calculatorContext,
    formatCurrency
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white font-shopify">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={handleBackClick} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Calculator
        </Button>
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-shopify-black mb-4 font-shopify">ROI Analysis Results</h2>
          <p className="text-shopify-muted max-w-2xl mx-auto">
            Here's your potential savings with Shopify Plus based on your specific sales volume.
          </p>
        </div>
      </div>
      
      <Stats />
      
      <Separator className="max-w-7xl mx-auto my-6 bg-gray-200" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-gray-100 shadow-md p-6">
            <h3 className="text-xl font-semibold mb-6">Your Business Summary</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700">Annual Sales Volume</h4>
                <p className="text-2xl font-bold">{formatCurrency(calculatorContext.annualSales || 0)}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700">Current Processing Rate</h4>
                <p className="text-2xl font-bold">{calculatorContext.basicFeeRate?.toFixed(2)}%</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700">Shopify Plus Processing Rate</h4>
                <p className="text-2xl font-bold text-shopify-green">{calculatorContext.plusFeeRate?.toFixed(2)}%</p>
              </div>
              
              {calculatorContext.currentConversionRate > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Current Conversion Rate</h4>
                  <p className="text-2xl font-bold">{calculatorContext.currentConversionRate?.toFixed(2)}%</p>
                </div>
              )}
              
              {calculatorContext.currentAOV > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Average Order Value</h4>
                  <p className="text-2xl font-bold">{formatCurrency(calculatorContext.currentAOV || 0)}</p>
                </div>
              )}
            </div>
          </Card>
          
          <div className="flex flex-col gap-6">
            <ROIResults calculatorState={calculatorState} />
            
            <ProcessingRatesTable 
              processingRates={processingRates}
              selectedPlan={selectedPlan}
            />
          </div>
        </div>
      </div>
      
      <Timeline />
      
      <Footer />
    </div>
  );
};

export default Results;
