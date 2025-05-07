
import React from 'react';
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="border-b border-gray-200 py-4 bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-shopify-blue">Dually ROI</span>
        </div>
        <Button className="bg-shopify-blue text-white hover:bg-blue-600">Get Started</Button>
      </div>
    </nav>
  );
};

export default Navigation;
