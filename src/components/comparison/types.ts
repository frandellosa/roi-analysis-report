export type Plan = {
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

export type FeaturesTableProps = {
  selectedPlan: string;
};
