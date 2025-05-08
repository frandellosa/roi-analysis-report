
import { useState } from 'react';
import { useCalculatorContext } from '@/contexts/CalculatorContext';
import { formatCurrency } from '@/utils/formatters';

const Hero = () => {
  const [companyName, setCompanyName] = useState("[BRAND NAME]");
  const [isEditing, setIsEditing] = useState(false);
  const { processingFeeSavings, monthlyUpliftAverage } = useCalculatorContext();

  // Calculate the last 90 days savings (quarterly) based on annual savings and average monthly uplift
  const quarterlyValue = (processingFeeSavings / 4) + (monthlyUpliftAverage * 3);

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-shopify-teal-dark to-shopify-teal py-20 px-6 text-white">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/159ace76-cc26-4d1f-8264-fea974b64662.png"
                alt="Shopify Plus Logo"
                className="h-16 mr-4"
              />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-shopify mb-6 leading-tight">
              Maximize Your ROI with <span className="text-shopify-green font-bold">Shopify Plus</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              Comprehensive analysis showing how upgrading to Shopify Plus can drive significant savings + grow revenue for{' '}
              {isEditing ? (
                <input
                  type="text"
                  value={companyName}
                  onChange={handleCompanyNameChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="bg-transparent border-b border-gray-500 focus:outline-none focus:border-shopify-green px-1 inline-block w-40 text-white"
                />
              ) : (
                <span 
                  onClick={() => setIsEditing(true)} 
                  className="cursor-text hover:border-b hover:border-gray-400 font-semibold"
                >
                  {companyName}
                </span>
              )}{' '}
              through reduced processing fees and enhanced features.
            </p>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-shopify-teal rounded-xl shadow-2xl p-8 border border-gray-700 hover:shadow-[0_0_15px_rgba(122,181,92,0.3)] transition-shadow">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-white mb-2">Annual Savings Projection</h3>
                <p className="text-gray-400">Based on your transaction volume</p>
              </div>
              <div className="flex justify-center items-center mb-6">
                <div className="text-center">
                  <span className="block text-5xl font-bold text-shopify-green">
                    {formatCurrency(processingFeeSavings)}
                  </span>
                  <span className="text-gray-400">Est. Annual Processing Fee Savings</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-shopify-teal-dark p-4 rounded-lg">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-[#95D374]">
                      {formatCurrency(quarterlyValue)}
                    </span>
                    <span className="text-sm text-gray-400">Last 90 Days Savings + Uplift</span>
                  </div>
                </div>
                <div className="bg-shopify-teal-dark p-4 rounded-lg">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-[#95D374]">0.65%</span>
                    <span className="text-sm text-gray-400">Processing Fee Reduction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
