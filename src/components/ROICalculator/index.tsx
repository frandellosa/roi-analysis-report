
import React from 'react';
import InputSection from './InputSection';
import ResultsSection from './ResultsSection';
import ProcessingRateTable from './ProcessingRateTable';
import { Card, CardContent } from "@/components/ui/card";

const ROICalculator = () => {
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
          <InputSection />
          
          <div className="flex flex-col gap-6">
            <ResultsSection />
            <ProcessingRateTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
