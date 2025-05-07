
export const AnnualCostsComparison = () => {
  return (
    <div className="grid grid-cols-3 border-b bg-gray-50">
      <div className="p-6">
        <p className="font-bold text-shopify-black">Annual Processing Costs</p>
        <p className="text-sm text-shopify-muted">(Based on $1.56M annual sales)</p>
      </div>
      <div className="p-6 border-l text-center">
        <p className="font-bold text-xl text-shopify-black">$45,631.76</p>
        <p className="text-sm text-shopify-muted mt-1">+ $468/year plan cost</p>
      </div>
      <div className="p-6 border-l text-center bg-blue-50">
        <p className="font-bold text-xl text-shopify-blue">$37,816.99</p>
        <p className="text-sm text-shopify-muted mt-1">+ $27,600/year plan cost</p>
      </div>
    </div>
  );
};
