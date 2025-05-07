
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { useCalculatorContext } from "@/contexts/CalculatorContext";
import { FeaturesTable } from "./comparison/FeaturesTable";
import { AnnualCostsComparison } from "./comparison/AnnualCostsComparison";
import { FeeSavingsComparison } from "./comparison/FeeSavingsComparison";

const ComparisonTable = () => {
  const { processingFeeSavings } = useCalculatorContext();
  
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-shopify-black mb-4 font-shopify">Plan Comparison</h2>
          <p className="text-shopify-muted max-w-2xl mx-auto">
            Compare the features and costs between Shopify Basic and Shopify Plus to see where you can benefit most.
          </p>
        </div>
        
        <Card className="border-gray-100 shadow-md overflow-hidden">
          <CardContent className="p-0">
            <FeaturesTable />
            <AnnualCostsComparison />
            <FeeSavingsComparison processingFeeSavings={processingFeeSavings} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComparisonTable;
