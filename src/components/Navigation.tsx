
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="border-b border-gray-200 py-4 bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-shopify-blue">Dually ROI</span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative group">
            <button className="flex items-center space-x-1 text-gray-600 hover:text-shopify-blue">
              <span>Analysis</span>
              <ChevronDown size={16} />
            </button>
          </div>
          <div className="relative group">
            <button className="flex items-center space-x-1 text-gray-600 hover:text-shopify-blue">
              <span>Comparison</span>
              <ChevronDown size={16} />
            </button>
          </div>
          <div className="relative group">
            <button className="flex items-center space-x-1 text-gray-600 hover:text-shopify-blue">
              <span>Calculator</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
        <Button className="bg-shopify-blue text-white hover:bg-blue-600">Get Started</Button>
      </div>
    </nav>
  );
};

export default Navigation;
