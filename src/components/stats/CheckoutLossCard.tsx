
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

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
  return (
    <Card className="border-red-100 shadow-md bg-red-50">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-red-600" />
          <CardTitle className="text-xl font-bold text-red-700">Checkout Drop-Off Analysis</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="col-span-4 md:col-span-2">
            <div className="bg-white p-5 rounded-lg border border-red-100 h-full">
              <h3 className="text-lg font-medium mb-4">Revenue Lost at Checkout</h3>
              <p className="text-3xl font-bold text-red-600">{formatCurrency(potentialRevenueLost)}</p>
              <p className="text-sm text-gray-500 mt-2">
                Potential revenue lost due to abandoned checkouts
              </p>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white p-5 rounded-lg border border-red-100 h-full">
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
            <div className="bg-white p-5 rounded-lg border border-red-100 h-full">
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
        <div className="mt-3 text-sm text-red-700 font-semibold">
          Shopify Plus can help reduce checkout abandonment with optimized checkout flows.
        </div>
      </CardContent>
    </Card>
  );
};
