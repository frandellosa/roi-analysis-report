
import { Card, CardContent } from "@/components/ui/card";
import { useCalculatorContext } from "@/contexts/CalculatorContext";
import { FeaturesTable } from "./comparison/FeaturesTable";

const ComparisonTable = () => {
  const { processingFeeSavings } = useCalculatorContext();
  
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="shopify-heading">Plan Comparison</h2>
          <p className="shopify-subheading">
            Compare the features and costs between different Shopify plans to see which one fits your business needs.
          </p>
        </div>
        
        <Card className="border-gray-100 shadow-md overflow-hidden">
          <CardContent className="p-0">
            <FeaturesTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComparisonTable;
