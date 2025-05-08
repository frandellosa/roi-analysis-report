
import { Card, CardContent } from "@/components/ui/card";
import { useCalculatorContext } from "@/contexts/CalculatorContext";
import { FeaturesTable } from "./comparison/FeaturesTable";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const ComparisonTable = () => {
  const { selectedPlan, updateSelectedPlan } = useCalculatorContext();
  
  const handlePlanChange = (value: string) => {
    updateSelectedPlan(value);
  };
  
  return (
    <div className="bg-gradient-to-b from-white to-gray-100 py-16">
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
            <Select value={selectedPlan} onValueChange={handlePlanChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Monthly billing</SelectLabel>
                  <SelectItem value="basic">Basic ($39/month)</SelectItem>
                  <SelectItem value="shopify">Grow ($105/month)</SelectItem>
                  <SelectItem value="advanced">Advanced ($399/month)</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Annual billing (paid upfront)</SelectLabel>
                  <SelectItem value="basic-annual">Basic Annual ($348/year - $29/month)</SelectItem>
                  <SelectItem value="shopify-annual">Grow Annual ($948/year - $79/month)</SelectItem>
                  <SelectItem value="advanced-annual">Advanced Annual ($3,588/year - $299/month)</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Biennial billing (2 years)</SelectLabel>
                  <SelectItem value="basic-biennial">Basic Biennial ($558/2years)</SelectItem>
                  <SelectItem value="shopify-biennial">Grow Biennial ($1,518/2years)</SelectItem>
                  <SelectItem value="advanced-biennial">Advanced Biennial ($5,640/2years)</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Triennial billing (3 years)</SelectLabel>
                  <SelectItem value="basic-triennial">Basic Triennial ($783/3years)</SelectItem>
                  <SelectItem value="shopify-triennial">Grow Triennial ($2,133/3years)</SelectItem>
                  <SelectItem value="advanced-triennial">Advanced Triennial ($7,884/3years)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card className="border-gray-100 shadow-md overflow-hidden relative">
          <CardContent className="p-0">
            <FeaturesTable selectedPlan={selectedPlan.split('-')[0]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComparisonTable;
