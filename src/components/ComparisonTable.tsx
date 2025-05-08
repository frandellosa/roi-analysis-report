
import { Card, CardContent } from "@/components/ui/card";
import { useCalculatorContext } from "@/contexts/CalculatorContext";
import { FeaturesTable } from "./comparison/FeaturesTable";
import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const ComparisonTable = () => {
  const { processingFeeSavings } = useCalculatorContext();
  const [selectedPlan, setSelectedPlan] = useState("basic");
  
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="shopify-heading">Plan Comparison</h2>
          <p className="shopify-subheading">
            Compare the features and costs between different Shopify plans to see which one fits your business needs.
          </p>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-xs">
            <p className="text-sm text-gray-600 mb-2">Select your current plan:</p>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Shopify Basic</SelectItem>
                <SelectItem value="shopify">Shopify Grow</SelectItem>
                <SelectItem value="advanced">Shopify Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card className="border-gray-100 shadow-md overflow-hidden">
          <CardContent className="p-0">
            <FeaturesTable selectedPlan={selectedPlan} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComparisonTable;
