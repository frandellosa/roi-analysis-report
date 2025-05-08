import { Check, Crown, Award, Star } from "lucide-react";
import { useCalculatorContext } from "@/contexts/CalculatorContext";

type Plan = {
  name: string;
  description: string;
  price: string;
  billing: string;
  isPopular: boolean;
  
  // Card rate information
  standardDomestic: string;
  standardInternational: string;
  premiumDomestic: string;
  premiumInternational: string;
  
  // Other rates
  inPersonRate: string;
  thirdPartyProviderRate: string;
  
  features: string[];
  highlight: boolean;
};

type FeaturesTableProps = {
  selectedPlan: string;
};

export const FeaturesTable = ({ selectedPlan }: FeaturesTableProps) => {
  const { processingFeeSavings } = useCalculatorContext();
  
  const allPlans: Record<string, Plan> = {
    basic: {
      name: "Shopify Basic",
      description: "For solo entrepreneurs",
      price: "$39",
      billing: "/month billed once yearly",
      isPopular: false,
      
      standardDomestic: "2.9% + $0.30",
      standardInternational: "3.9% + $0.30",
      premiumDomestic: "3.5% + $0.30",
      premiumInternational: "4.5% + $0.30",
      
      inPersonRate: "2.7% + $0",
      thirdPartyProviderRate: "2%",
      
      features: [
        "Up to 45% shipping discount",
        "10 inventory locations",
        "24/7 chat support",
        "Localized global selling (3 markets)",
        "POS Lite"
      ],
      highlight: false,
    },
    shopify: {
      name: "Shopify Grow",
      description: "For small teams",
      price: "$105",
      billing: "/month billed once yearly",
      isPopular: false,
      
      standardDomestic: "2.7% + $0.30",
      standardInternational: "3.7% + $0.30",
      premiumDomestic: "3.3% + $0.30",
      premiumInternational: "4.3% + $0.30",
      
      inPersonRate: "2.5% + $0",
      thirdPartyProviderRate: "1%",
      
      features: [
        "Up to 50% shipping discount and insurance",
        "10 inventory locations",
        "24/7 chat support",
        "Localized global selling (3 markets)",
        "5 additional staff accounts",
        "POS Lite"
      ],
      highlight: false,
    },
    advanced: {
      name: "Shopify Advanced",
      description: "As your business scales",
      price: "$399",
      billing: "/month billed once yearly",
      isPopular: false,
      
      standardDomestic: "2.5% + $0.30",
      standardInternational: "3.5% + $0.30",
      premiumDomestic: "3.1% + $0.30",
      premiumInternational: "4.1% + $0.30",
      
      inPersonRate: "2.4% + $0",
      thirdPartyProviderRate: "0.6%",
      
      features: [
        "Up to 53% shipping discount, insurance, 3rd-party calculated rates",
        "10 inventory locations",
        "Enhanced 24/7 chat support",
        "Localized global selling (3 markets) + add markets for $59 USD/mo each",
        "15 additional staff accounts",
        "10x checkout capacity",
        "POS Lite"
      ],
      highlight: false,
    },
    plus: {
      name: "Shopify Plus",
      description: "For more complex businesses",
      price: "US$2,300",
      billing: "/month on a 3-year term",
      isPopular: false,
      
      standardDomestic: "2.25% + $0.30",
      standardInternational: "3.25% + $0.30",
      premiumDomestic: "2.95% + $0.30",
      premiumInternational: "3.95% + $0.30",
      
      inPersonRate: "2.2% + $0",
      thirdPartyProviderRate: "0.5%",
      
      features: [
        "Up to 53% shipping discount, insurance, 3rd-party calculated rates",
        "200 inventory locations",
        "Priority 24/7 phone support",
        "Localized global selling (50 markets)",
        "Unlimited staff accounts",
        "Customizable checkout with 40x capacity",
        "Up to 200 POS Pro locations",
        "Sell wholesale/B2B"
      ],
      highlight: true
    }
  };

  // Get the current plan and Plus plan
  const currentPlan = allPlans[selectedPlan];
  const plusPlan = allPlans.plus;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Current plan card */}
      <div className={`rounded-2xl border p-6 flex flex-col h-full ${currentPlan.highlight ? 'border-shopify-blue shadow-md' : 'border-gray-200'}`}>
        {currentPlan.isPopular && (
          <div className="mb-2">
            <span className="bg-gray-400 text-xs text-black font-semibold py-1 px-3 rounded-full">
              Most Popular
            </span>
          </div>
        )}
        
        <h3 className="text-xl font-bold mb-1">{currentPlan.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{currentPlan.description}</p>
        
        <div className="mb-6">
          <div className="text-sm text-gray-500">Starting at</div>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">{currentPlan.price}</span>
            <span className="text-sm text-gray-500 ml-1">{currentPlan.billing}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Online payment rates</h4>
          <div className="bg-gray-50 p-4 rounded-lg mb-2">
            <p className="font-medium mb-1">Standard cards (Consumer)</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-600">Domestic</p>
                <p className="font-medium">{currentPlan.standardDomestic}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">International</p>
                <p className="font-medium">{currentPlan.standardInternational}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="font-medium mb-1">Exclusive cards (Commercial & Amex)</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-600">Domestic</p>
                <p className="font-medium">{currentPlan.premiumDomestic}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">International</p>
                <p className="font-medium">{currentPlan.premiumInternational}</p>
              </div>
            </div>
          </div>
          
          <ul className="space-y-2">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">In-person rate: {currentPlan.inPersonRate}</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">3rd-party payment providers: {currentPlan.thirdPartyProviderRate}</span>
            </li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Standout features</h4>
          <ul className="space-y-2">
            {currentPlan.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <Check className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Plus plan card - updated with dark gray instead of orange */}
      <div className="relative rounded-2xl border-2 border-shopify-teal p-6 flex flex-col h-full shadow-lg shadow-shopify-teal-dark/20 bg-gradient-to-br from-shopify-teal-light to-shopify-teal">
        {/* Updated badge with dark gray instead of orange */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-700 to-gray-900 text-white text-xs font-bold py-1.5 px-6 rounded-full shadow-md flex items-center">
          <Crown className="h-3.5 w-3.5 mr-1.5" />
          RECOMMENDED
        </div>
        
        <div className="flex items-center mb-1">
          <h3 className="text-2xl font-bold text-white flex items-center">
            {plusPlan.name}
            <Star className="h-5 w-5 ml-2 text-gray-300" fill="currentColor" />
          </h3>
        </div>
        <p className="text-sm text-gray-300 mb-6">{plusPlan.description}</p>
        
        <div className="mb-6">
          <div className="text-sm text-gray-300">Starting at</div>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-white">{plusPlan.price}</span>
            <span className="text-sm text-gray-300 ml-1">{plusPlan.billing}</span>
          </div>
          <div className="mt-2">
            <span className="text-xs font-medium bg-gray-700 text-gray-300 px-3 py-1 rounded-full inline-flex items-center">
              <Award className="h-3 w-3 mr-1" /> Best Value for High-Volume Merchants
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-white flex items-center">
            <Star className="h-4 w-4 mr-1.5 text-gray-300" fill="currentColor" stroke="none" />
            Exclusive payment rates
          </h4>
          <div className="bg-shopify-teal-dark p-4 rounded-lg mb-2 border border-gray-300/20">
            <p className="font-medium mb-1 text-white">Standard cards (Consumer)</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-300">Domestic</p>
                <p className="font-medium text-gray-300">{plusPlan.standardDomestic}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">International</p>
                <p className="font-medium text-gray-300">{plusPlan.standardInternational}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-shopify-teal-dark p-4 rounded-lg mb-4 border border-gray-300/20">
            <p className="font-medium mb-1 text-white">Exclusive cards (Commercial & Amex)</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-300">Domestic</p>
                <p className="font-medium text-gray-300">{plusPlan.premiumDomestic}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">International</p>
                <p className="font-medium text-gray-300">{plusPlan.premiumInternational}</p>
              </div>
            </div>
          </div>
          
          <ul className="space-y-2">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-gray-300 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-200">In-person rate: <span className="text-gray-300 font-medium">{plusPlan.inPersonRate}</span></span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-gray-300 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-200">3rd-party providers: <span className="text-gray-300 font-medium">{plusPlan.thirdPartyProviderRate}</span></span>
            </li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-white flex items-center">
            <Star className="h-4 w-4 mr-1.5 text-gray-300" fill="currentColor" stroke="none" />
            Exclusive features
          </h4>
          <ul className="space-y-3">
            {plusPlan.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <div className="bg-gray-700 rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                  <Check className="h-4 w-4 text-gray-300" />
                </div>
                <span className="text-sm text-gray-200">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
