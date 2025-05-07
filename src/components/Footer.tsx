
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-shopify-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Dually ROI Insight</h3>
            <p className="text-gray-400 mb-4">
              Comprehensive ROI analysis for Dually Wheels on upgrading to Shopify Plus.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">ROI Calculator</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Plan Comparison</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Case Studies</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Contact</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Schedule a Call</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Email Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Dually ROI Insight. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
