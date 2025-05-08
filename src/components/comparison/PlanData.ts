
import { Plan } from "./types";

export const allPlans: Record<string, Plan> = {
  basic: {
    name: "Shopify Basic",
    description: "For solo entrepreneurs",
    price: "$39",
    billing: "/month",
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
    billing: "/month",
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
    billing: "/month",
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
