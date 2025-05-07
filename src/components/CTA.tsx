
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <div className="bg-shopify-blue py-20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-shopify">
            Ready to Maximize Your ROI?
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Based on your current sales volume, upgrading to Shopify Plus could save you $7,814.77 annually in processing fees, providing significant ROI despite the higher monthly plan cost.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button className="bg-white text-shopify-blue hover:bg-gray-100 px-8 py-6 text-lg font-medium">
              Schedule a Consultation
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-blue-700 px-8 py-6 text-lg">
              Download Full Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
