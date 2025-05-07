
import { Check, X } from "lucide-react";

export const FeaturesTable = () => {
  const features = [
    {
      name: "Credit Card Processing Fee",
      basic: {
        label: "Standard Domestic: 2.9% + 30¢ USD\nStandard International: 3.9% + 30¢ USD\nPremium Cards: 3.5% + 30¢ USD",
        isList: true
      },
      plus: {
        label: "Standard Domestic: 2.25% + 30¢ USD\nStandard International: 3.25% + 30¢ USD\nPremium Cards: 2.95% + 30¢ USD",
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
    <>
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
    </>
  );
};
