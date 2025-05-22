
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw } from 'lucide-react';
import { BasicInputs } from './BasicInputs';
import { GmvBreakdown } from './GmvBreakdown';
import { UpliftProjections } from './UpliftProjections';
import { FileUpload } from './FileUpload';
import { CheckoutDropOff } from './CheckoutDropOff';
import { CalculatorState } from "@/types/calculator";

interface CalculatorControlsProps {
  calculatorState: CalculatorState;
  fileInputRef: React.RefObject<HTMLInputElement>;
  fileName: string | null;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileUpload: () => void;
}

export const CalculatorControls = ({ 
  calculatorState,
  fileInputRef,
  fileName,
  handleFileUpload,
  triggerFileUpload
}: CalculatorControlsProps) => {
  const navigate = useNavigate();
  
  const handleCalculateROI = () => {
    calculatorState.calculateROI();
    // Navigate to results page after calculation
    navigate('/results');
  };
  
  return (
    <CardContent className="pt-6">
      <h3 className="text-xl font-semibold mb-6">Input Your Numbers</h3>
      
      <BasicInputs calculatorState={calculatorState} />
      <GmvBreakdown calculatorState={calculatorState} />
      <CheckoutDropOff calculatorState={calculatorState} />

      <FileUpload 
        fileInputRef={fileInputRef}
        fileName={fileName}
        handleFileUpload={handleFileUpload}
        triggerFileUpload={triggerFileUpload}
      />

      <UpliftProjections calculatorState={calculatorState} />

      <Button 
        onClick={handleCalculateROI} 
        className="w-full mb-4"
        size="lg"
      >
        <Calculator className="mr-2" /> Calculate ROI
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={calculatorState.resetCalculator}
        className="w-full flex items-center justify-center gap-1 text-sm"
      >
        <RotateCcw className="h-4 w-4" /> Reset Values
      </Button>
    </CardContent>
  );
};
