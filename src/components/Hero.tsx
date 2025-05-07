
import { useState } from 'react';
import { useCalculatorContext } from '@/contexts/CalculatorContext';
import { formatCurrency } from '@/utils/formatters';

const Hero = () => {
  const [companyName, setCompanyName] = useState("Dually Wheels");
  const [isEditing, setIsEditing] = useState(false);
  const { annualNetSavings, monthlyUpliftAverage } = useCalculatorContext();

  // Calculate the last 90 days savings (quarterly) based on annual savings and average monthly uplift
  const quarterlyValue = (annualNetSavings / 4) + (monthlyUpliftAverage * 3);

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
    <div className="bg-gradient-to-br from-white to-blue-50 py-20 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/f4f762b1-0283-4f61-9fc9-e55a43c895cd.png"
                alt="Dually Wheels Logo"
                className="h-12 mr-4"
              />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-shopify-black font-shopify mb-6 leading-tight">
              Maximize Your ROI with <span className="text-shopify-blue font-bold">Shopify Plus</span>
            </h1>
            <p className="text-lg text-shopify-muted mb-8 max-w-lg">
              Comprehensive analysis showing how upgrading to Shopify Plus can drive significant savings for{' '}
              {isEditing ? (
                <input
                  type="text"
                  value={companyName}
                  onChange={handleCompanyNameChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-shopify-blue px-1 inline-block w-40"
                />
              ) : (
                <span 
                  onClick={() => setIsEditing(true)} 
                  className="cursor-text hover:border-b hover:border-gray-200"
                >
                  {companyName}
                </span>
              )}{' '}
              through reduced processing fees and enhanced features.
            </p>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-shopify-black mb-2">Annual Savings Projection</h3>
                <p className="text-shopify-muted">Based on your transaction volume</p>
              </div>
              <div className="flex justify-center items-center mb-6">
                <div className="text-center">
                  <span className="block text-5xl font-bold text-shopify-green">
                    {formatCurrency(annualNetSavings)}
                  </span>
                  <span className="text-gray-500">Est. Annual Savings</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-shopify-blue">
                      {formatCurrency(quarterlyValue)}
                    </span>
                    <span className="text-sm text-gray-500">Last 90 Days Savings + Uplift</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-shopify-blue">0.65%</span>
                    <span className="text-sm text-gray-500">Processing Fee Reduction</span>
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
