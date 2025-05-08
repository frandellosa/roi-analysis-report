
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightCircle, ShoppingCart, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CheckoutLossCardProps {
  dropOffRate: number;
  potentialRevenueLost: number;
  reachedCheckout: number;
  completedCheckout: number;
}

export const CheckoutLossCard = ({
  dropOffRate,
  potentialRevenueLost,
  reachedCheckout,
  completedCheckout
}: CheckoutLossCardProps) => {
  const navigate = useNavigate();
  
  const hasData = reachedCheckout > 0;
  
  const goToCalculator = () => {
    navigate('/#roi-calculator');
    setTimeout(() => {
      document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <Card className="border-gray-200 shadow-md bg-gray-100">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-red-600" />
          <CardTitle className="text-xl font-bold text-gray-700">Checkout Drop-Off Analysis</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="grid md:grid-cols-4 gap-4">
            <div className="col-span-4 md:col-span-2">
              <div className="bg-white p-5 rounded-lg border border-gray-200 h-full">
                <h3 className="text-lg font-medium mb-4">Revenue Lost at Checkout</h3>
                <p className="text-3xl font-bold text-red-600">{formatCurrency(potentialRevenueLost)}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Potential revenue lost due to abandoned checkouts
                </p>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-white p-5 rounded-lg border border-gray-200 h-full">
                <h3 className="text-base font-medium mb-2">Drop-Off Rate</h3>
                <div className="flex items-center">
                  <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-2xl font-bold text-red-500">{dropOffRate.toFixed(1)}%</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Percentage of customers who abandon checkout
                </p>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-white p-5 rounded-lg border border-gray-200 h-full">
                <h3 className="text-base font-medium mb-2">Checkout Stats</h3>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Started:</span>
                    <span className="text-lg font-semibold">{reachedCheckout}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Completed:</span>
                    <span className="text-lg font-semibold">{completedCheckout}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Lost:</span>
                    <span className="text-lg font-semibold text-red-500">{reachedCheckout - completedCheckout}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl font-medium text-gray-700 mb-4">Analyze Your Checkout Drop-Off</p>
            <p className="text-gray-600 mb-6">
              Enter your checkout data to see how much revenue you're losing to checkout abandonment
            </p>
            <Button 
              onClick={goToCalculator}
              className="bg-red-600 hover:bg-red-700"
            >
              Enter Checkout Data <ArrowRightCircle className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
