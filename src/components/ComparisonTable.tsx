
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { useCalculatorContext } from "@/contexts/CalculatorContext";

const ComparisonTable = () => {
  const { processingFeeSavings, annualNetSavings } = useCalculatorContext();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const features = [
    {
      name: "Transaction Fee",
      basic: {
        label: "Credit card rates: 2.9% + 30¢ USD online\nAdditional fees using all payment providers other than Shopify Payments",
        isList: true
      },
      plus: {
        label: "Credit card rates: 2.25% + 30¢ USD online\nNo additional fees using all payment providers other than Shopify Payments",
        isList: true
      },
      highlight: true
    },
    {
      name: "Monthly Cost",
      basic: "$39",
      plus: "$2,300",
      highlight: true
    },
    {
      name: "Additional Staff Accounts",
      basic: "2 staff accounts",
      plus: "Unlimited staff accounts",
      highlight: false
    },
    {
      name: "Shipping Discount",
      basic: "Up to 77%",
      plus: "Up to 88%",
      highlight: false
    },
    {
      name: "Custom Automation",
      basic: false,
      plus: true,
      highlight: false
    },
    {
      name: "Advanced Report Builder",
      basic: false,
      plus: true,
      highlight: false
    },
    {
      name: "Dedicated Support",
      basic: false,
      plus: true,
      highlight: false
    }
  ];

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
            <div className="grid grid-cols-3 border-b">
              <div className="p-6 bg-gray-50">
                <h3 className="text-xl font-bold text-shopify-black">Features</h3>
              </div>
              <div className="p-6 border-l text-center">
                <h3 className="text-xl font-medium text-shopify-black">Shopify Basic</h3>
                <p className="text-shopify-muted mt-1">Current Plan</p>
              </div>
              <div className="p-6 border-l text-center bg-blue-50">
                <h3 className="text-xl font-bold text-shopify-blue">Shopify Plus</h3>
                <p className="text-shopify-muted mt-1">Recommended</p>
              </div>
            </div>
            
            {features.map((feature, index) => (
              <div key={index} className={`grid grid-cols-3 border-b ${feature.highlight ? 'bg-yellow-50' : ''}`}>
                <div className="p-6">
                  <p className={`font-medium ${feature.highlight ? 'text-shopify-black' : ''}`}>{feature.name}</p>
                </div>
                <div className="p-6 border-l flex items-center justify-center">
                  {typeof feature.basic === 'boolean' ? (
                    feature.basic ? (
                      <Check className="h-5 w-5 text-shopify-green" />
                    ) : (
                      <X className="h-5 w-5 text-red-400" />
                    )
                  ) : typeof feature.basic === 'object' && feature.basic.isList ? (
                    <div className="text-sm text-shopify-muted">
                      {feature.basic.label.split('\n').map((item, i) => (
                        <p key={i} className="mb-1">{item}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-shopify-muted">{String(feature.basic)}</p>
                  )}
                </div>
                <div className="p-6 border-l flex items-center justify-center bg-blue-50">
                  {typeof feature.plus === 'boolean' ? (
                    feature.plus ? (
                      <Check className="h-5 w-5 text-shopify-green" />
                    ) : (
                      <X className="h-5 w-5 text-red-400" />
                    )
                  ) : typeof feature.plus === 'object' && feature.plus.isList ? (
                    <div className="text-sm font-medium text-shopify-blue">
                      {feature.plus.label.split('\n').map((item, i) => (
                        <p key={i} className="mb-1">{item}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="font-medium text-shopify-blue">{String(feature.plus)}</p>
                  )}
                </div>
              </div>
            ))}
            
            <div className="grid grid-cols-3 border-b bg-gray-50">
              <div className="p-6">
                <p className="font-bold text-shopify-black">Annual Processing Costs</p>
                <p className="text-sm text-shopify-muted">(Based on $1.56M annual sales)</p>
              </div>
              <div className="p-6 border-l text-center">
                <p className="font-bold text-xl text-shopify-black">$45,631.76</p>
                <p className="text-sm text-shopify-muted mt-1">+ $468/year plan cost</p>
              </div>
              <div className="p-6 border-l text-center bg-blue-50">
                <p className="font-bold text-xl text-shopify-blue">$37,816.99</p>
                <p className="text-sm text-shopify-muted mt-1">+ $27,600/year plan cost</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 bg-gray-50">
              <div className="p-6">
                <p className="font-bold text-shopify-black">Fee Savings</p>
              </div>
              <div className="p-6 border-l text-center">
                <p className="font-bold text-xl text-shopify-black">$0</p>
              </div>
              <div className="p-6 border-l text-center bg-blue-50">
                <p className="font-bold text-xl text-shopify-green">{formatCurrency(processingFeeSavings)}</p>
                <p className="text-sm text-shopify-muted mt-1">Annual processing fee savings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComparisonTable;
