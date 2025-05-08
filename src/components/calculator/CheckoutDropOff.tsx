
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface CheckoutDropOffProps {
  calculatorState: any;
}

export const CheckoutDropOff = ({ calculatorState }: CheckoutDropOffProps) => {
  const {
    reachedCheckout,
    setReachedCheckout,
    completedCheckout,
    setCompletedCheckout,
    currentAOV,
    handleCheckoutChange,
    formatCurrency
  } = calculatorState;

  // Calculate checkout drop-off rate
  const dropOffRate = reachedCheckout > 0 
    ? ((reachedCheckout - completedCheckout) / reachedCheckout) * 100 
    : 0;
  
  // Calculate potential revenue lost
  const potentialRevenueLost = (reachedCheckout - completedCheckout) * currentAOV;

  return (
    <div className="mb-6">
      <h4 className="text-md font-semibold mb-4">Checkout Drop-Off Analysis</h4>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="reached-checkout" className="mb-2 block">Reached Checkout Sessions</Label>
          <Input 
            id="reached-checkout" 
            type="number" 
            value={reachedCheckout}
            onChange={(e) => handleCheckoutChange(e, setReachedCheckout)}
            min="0"
          />
        </div>
        <div>
          <Label htmlFor="completed-checkout" className="mb-2 block">Completed Checkout Sessions</Label>
          <Input 
            id="completed-checkout" 
            type="number" 
            value={completedCheckout}
            onChange={(e) => handleCheckoutChange(e, setCompletedCheckout)}
            min="0"
            max={reachedCheckout}
          />
        </div>
      </div>
      
      {reachedCheckout > 0 && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-4 pb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Drop-Off Rate</p>
                <p className="text-lg font-semibold">{dropOffRate.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Potential Revenue Lost</p>
                <p className="text-lg font-semibold text-red-500">{formatCurrency(potentialRevenueLost)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
