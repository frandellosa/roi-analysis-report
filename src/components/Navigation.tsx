
import React from 'react';

const Navigation = () => {
  return (
    <nav className="border-b border-gray-200 py-4 bg-white">
      <div className="container mx-auto flex justify-center items-center">
        {/* Logo is now centered */}
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/4d7ebcea-986b-41ce-9dca-3cb9194c2aa6.png" 
            alt="Dually Wheels Logo" 
            className="h-16" 
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
