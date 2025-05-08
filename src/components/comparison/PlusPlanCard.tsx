
import { Award, Check, Crown, Star } from "lucide-react";
import { Plan } from "./types";

type PlusPlanCardProps = {
  plan: Plan;
};

export const PlusPlanCard = ({ plan }: PlusPlanCardProps) => {
  return (
    <div className="relative rounded-2xl border-2 border-shopify-teal p-6 flex flex-col h-full shadow-lg shadow-shopify-teal-dark/20 bg-gradient-to-br from-shopify-teal-light to-shopify-teal">
      {/* Badge */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-700 to-gray-900 text-white text-xs font-bold py-1.5 px-6 rounded-full shadow-md flex items-center">
        <Crown className="h-3.5 w-3.5 mr-1.5" />
        RECOMMENDED
      </div>
      
      <div className="flex items-center mb-1">
        <h3 className="text-2xl font-bold text-white flex items-center">
          {plan.name}
          <Star className="h-5 w-5 ml-2 text-gray-300" fill="currentColor" />
        </h3>
      </div>
      <p className="text-sm text-gray-300 mb-6">{plan.description}</p>
      
      <div className="mb-6">
        <div className="text-sm text-gray-300">Starting at</div>
        <div className="flex items-baseline">
          <span className="text-4xl font-bold text-white">{plan.price}</span>
          <span className="text-sm text-gray-300 ml-1">{plan.billing}</span>
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
              <p className="font-medium text-gray-300">{plan.standardDomestic}</p>
            </div>
            <div>
              <p className="text-sm text-gray-300">International</p>
              <p className="font-medium text-gray-300">{plan.standardInternational}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-shopify-teal-dark p-4 rounded-lg mb-4 border border-gray-300/20">
          <p className="font-medium mb-1 text-white">Exclusive cards (Commercial & Amex)</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-300">Domestic</p>
              <p className="font-medium text-gray-300">{plan.premiumDomestic}</p>
            </div>
            <div>
              <p className="text-sm text-gray-300">International</p>
              <p className="font-medium text-gray-300">{plan.premiumInternational}</p>
            </div>
          </div>
        </div>
        
        <ul className="space-y-2">
          <li className="flex items-start">
            <Check className="h-5 w-5 text-gray-300 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-200">In-person rate: <span className="text-gray-300 font-medium">{plan.inPersonRate}</span></span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-gray-300 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-200">3rd-party providers: <span className="text-gray-300 font-medium">{plan.thirdPartyProviderRate}</span></span>
          </li>
        </ul>
      </div>
      
      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-white flex items-center">
          <Star className="h-4 w-4 mr-1.5 text-gray-300" fill="currentColor" stroke="none" />
          Exclusive features
        </h4>
        <ul className="space-y-3">
          {plan.features.map((feature, i) => (
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
  );
};
