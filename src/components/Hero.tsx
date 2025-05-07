
const Hero = () => {
  return (
    <div 
      className="py-20 px-6 relative"
    >
      {/* Background image with opacity overlay */}
      <div 
        className="absolute inset-0 z-0 bg-black"
        style={{ 
          backgroundImage: "url('/lovable-uploads/03b66191-3d85-43e3-9a45-db5d75e0f410.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: "0.3"
        }}
      />
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/f4f762b1-0283-4f61-9fc9-e55a43c895cd.png"
                alt="Dually Wheels Logo"
                className="h-12 mr-4"
              />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-shopify mb-6 leading-tight">
              Maximize Your ROI with <span className="text-shopify-green font-bold">Shopify Plus</span>
            </h1>
            <p className="text-lg text-gray-200 mb-8 max-w-lg">
              Comprehensive analysis showing how upgrading to Shopify Plus can drive significant savings for Dually Wheels through reduced processing fees and enhanced features.
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
                  <span className="block text-5xl font-bold text-shopify-green">$10,158.70</span>
                  <span className="text-gray-500">Est. Annual Savings</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-shopify-blue">$3,045.64</span>
                    <span className="text-sm text-gray-500">Last 90 Days Savings</span>
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
