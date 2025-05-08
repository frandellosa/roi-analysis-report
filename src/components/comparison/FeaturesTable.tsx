import { Check } from "lucide-react";
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
  cta: string;
  ctaLink: string;
  secondaryCta?: string;
  secondaryCtaLink?: string;
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
      
      // Card rates from the provided reference image
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
      cta: "Try for free",
      ctaLink: "#",
      highlight: false
    },
    shopify: {
      name: "Shopify Grow",
      description: "For small teams",
      price: "$105",
      billing: "/month billed once yearly",
      isPopular: true,
      
      // Card rates from the provided reference image
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
      cta: "Try for free",
      ctaLink: "#",
      highlight: false
    },
    advanced: {
      name: "Shopify Advanced",
      description: "As your business scales",
      price: "$399",
      billing: "/month billed once yearly",
      isPopular: false,
      
      // Card rates from the provided reference image
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
      cta: "Try for free",
      ctaLink: "#",
      highlight: false
    },
    plus: {
      name: "Shopify Plus",
      description: "For more complex businesses",
      price: "US$2,300",
      billing: "/month on a 3-year term",
      isPopular: false,
      
      // Card rates from the provided reference image
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
      cta: "Get started",
      ctaLink: "#",
      secondaryCta: "Get in touch",
      secondaryCtaLink: "#",
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
            <span className="bg-green-400 text-xs text-black font-semibold py-1 px-3 rounded-full">
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
            <p className="font-medium mb-1">Premium cards (Commercial & Amex)</p>
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
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">In-person rate: {currentPlan.inPersonRate}</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">3rd-party payment providers: {currentPlan.thirdPartyProviderRate}</span>
            </li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Standout features</h4>
          <ul className="space-y-2">
            {currentPlan.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-auto space-y-3">
          <a 
            href={currentPlan.ctaLink}
            className={`w-full py-3 px-4 rounded-full text-center font-medium block bg-black hover:bg-gray-800 text-white`}
          >
            {currentPlan.cta}
          </a>
          
          {currentPlan.secondaryCta && (
            <a 
              href={currentPlan.secondaryCtaLink}
              className="w-full py-3 px-4 rounded-full text-center font-medium block border border-gray-300 hover:bg-gray-50"
            >
              {currentPlan.secondaryCta}
            </a>
          )}
        </div>
      </div>

      {/* Plus plan card - always shown */}
      <div className="rounded-2xl border border-shopify-blue p-6 flex flex-col h-full shadow-md">
        <h3 className="text-xl font-bold mb-1">{plusPlan.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{plusPlan.description}</p>
        
        <div className="mb-6">
          <div className="text-sm text-gray-500">Starting at</div>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">{plusPlan.price}</span>
            <span className="text-sm text-gray-500 ml-1">{plusPlan.billing}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Online payment rates</h4>
          <div className="bg-blue-50 p-4 rounded-lg mb-2">
            <p className="font-medium mb-1">Standard cards (Consumer)</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-600">Domestic</p>
                <p className="font-medium">{plusPlan.standardDomestic}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">International</p>
                <p className="font-medium">{plusPlan.standardInternational}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="font-medium mb-1">Premium cards (Commercial & Amex)</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-600">Domestic</p>
                <p className="font-medium">{plusPlan.premiumDomestic}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">International</p>
                <p className="font-medium">{plusPlan.premiumInternational}</p>
              </div>
            </div>
          </div>
          
          <ul className="space-y-2">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">In-person rate: {plusPlan.inPersonRate}</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">3rd-party payment providers: {plusPlan.thirdPartyProviderRate}</span>
            </li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Standout features</h4>
          <ul className="space-y-2">
            {plusPlan.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-auto space-y-3">
          <a 
            href={plusPlan.ctaLink}
            className="w-full py-3 px-4 rounded-full text-center font-medium block bg-black hover:bg-gray-800 text-white"
          >
            {plusPlan.cta}
          </a>
          
          {plusPlan.secondaryCta && (
            <a 
              href={plusPlan.secondaryCtaLink}
              className="w-full py-3 px-4 rounded-full text-center font-medium block border border-gray-300 hover:bg-gray-50"
            >
              {plusPlan.secondaryCta}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
