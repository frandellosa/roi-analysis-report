
import { Check } from "lucide-react";
import { Plan } from "./types";

type RegularPlanCardProps = {
  plan: Plan;
};

export const RegularPlanCard = ({ plan }: RegularPlanCardProps) => {
  return (
    <div className={`rounded-2xl border p-6 flex flex-col h-full ${plan.highlight ? 'border-shopify-blue shadow-md' : 'border-gray-200'}`}>
      {plan.isPopular && (
        <div className="mb-2">
          <span className="bg-gray-400 text-xs text-black font-semibold py-1 px-3 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      
      <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
      
      <div className="mb-6">
        <div className="text-sm text-gray-500">Starting at</div>
        <div className="flex items-baseline">
          <span className="text-4xl font-bold">{plan.price}</span>
          <span className="text-sm text-gray-500 ml-1">/month</span>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Online payment rates</h4>
        <div className="bg-gray-50 p-4 rounded-lg mb-2">
          <p className="font-medium mb-1">Standard cards (Consumer)</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-600">Domestic</p>
              <p className="font-medium">{plan.standardDomestic}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">International</p>
              <p className="font-medium">{plan.standardInternational}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="font-medium mb-1">Exclusive cards (Commercial & Amex)</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-600">Domestic</p>
              <p className="font-medium">{plan.premiumDomestic}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">International</p>
              <p className="font-medium">{plan.premiumInternational}</p>
            </div>
          </div>
        </div>
        
        <ul className="space-y-2">
          <li className="flex items-start">
            <Check className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">In-person rate: {plan.inPersonRate}</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">3rd-party payment providers: {plan.thirdPartyProviderRate}</span>
          </li>
        </ul>
      </div>
      
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Standout features</h4>
        <ul className="space-y-2">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
