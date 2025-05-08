
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatters";

interface ShopifyAudiencesTableProps {
  currentAOV?: number;
}

export const ShopifyAudiencesTable = ({ currentAOV = 200 }: ShopifyAudiencesTableProps) => {
  // Current values (editable) - all set to 0 by default
  const [digitalAdSpend, setDigitalAdSpend] = useState(0);
  const [retargetingPercent, setRetargetingPercent] = useState(0);
  const [prospectingCPA, setProspectingCPA] = useState(0);
  const [retargetingCPA, setRetargetingCPA] = useState(0);
  const [prospectingOrders, setProspectingOrders] = useState(0);
  const [retargetingOrders, setRetargetingOrders] = useState(0);
  const [ltv, setLtv] = useState(currentAOV);
  const [operatingMargin, setOperatingMargin] = useState(0);

  // Calculated values
  const [prospectingSpend, setProspectingSpend] = useState(0);
  const [retargetingSpend, setRetargetingSpend] = useState(0);
  const [currentTotalOrders, setCurrentTotalOrders] = useState(0);

  // Future projection values (low, medium, high)
  const scenarios = {
    low: {
      retargetingPercent: 30,
      retargetingCPAReduction: 1,
      prospectingCPAReduction: 0,
    },
    medium: {
      retargetingPercent: 30,
      retargetingCPAReduction: 24,
      prospectingCPAReduction: 5,
    },
    high: {
      retargetingPercent: 30,
      retargetingCPAReduction: 50,
      prospectingCPAReduction: 15,
    },
  };
  
  // Calculate derived values based on current inputs
  useEffect(() => {
    // Calculate prospecting and retargeting spend
    const retargetingSpendValue = digitalAdSpend * (retargetingPercent / 100);
    const prospectingSpendValue = digitalAdSpend - retargetingSpendValue;
    
    setProspectingSpend(prospectingSpendValue);
    setRetargetingSpend(retargetingSpendValue);
    
    // Calculate total orders
    setCurrentTotalOrders(prospectingOrders + retargetingOrders);
  }, [digitalAdSpend, retargetingPercent, prospectingOrders, retargetingOrders]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
    if (!isNaN(value)) {
      setter(value);
    }
  };

  // Calculate future projections
  const calculateProjections = (scenario: 'low' | 'medium' | 'high') => {
    const { retargetingPercent: futureRetargetingPercent, retargetingCPAReduction, prospectingCPAReduction } = scenarios[scenario];
    
    // Calculate future ad spend distribution
    let futureAdSpend = digitalAdSpend;
    if (scenario === 'medium') futureAdSpend = digitalAdSpend * 1.4; // 40% increase
    if (scenario === 'high') futureAdSpend = digitalAdSpend * 2; // 100% increase
    
    const futureRetargetingSpend = futureAdSpend * (futureRetargetingPercent / 100);
    const futureProspectingSpend = futureAdSpend - futureRetargetingSpend;
    
    // Calculate future CPAs - handle zero values to prevent NaN
    const futureProspectingCPA = prospectingCPA === 0 ? 0 : prospectingCPA * (1 - (prospectingCPAReduction / 100));
    const futureRetargetingCPA = retargetingCPA === 0 ? 0 : retargetingCPA * (1 - (retargetingCPAReduction / 100));
    
    // Calculate future orders - handle zero CPAs to prevent division by zero
    const futureProspectingOrders = futureProspectingCPA === 0 ? 0 : Math.round(futureProspectingSpend / futureProspectingCPA);
    const futureRetargetingOrders = futureRetargetingCPA === 0 ? 0 : Math.round(futureRetargetingSpend / futureRetargetingCPA);
    const futureTotalOrders = futureProspectingOrders + futureRetargetingOrders;
    
    // Calculate increased orders due to Shopify Audiences
    const increasedOrders = futureTotalOrders - currentTotalOrders;
    
    // Calculate revenue impact
    const revenueImpact = increasedOrders * ltv;
    
    // Calculate margin impact
    const marginImpact = revenueImpact * (operatingMargin / 100);
    
    return {
      adSpend: futureAdSpend,
      retargetingPercent: futureRetargetingPercent,
      prospectingSpend: futureProspectingSpend,
      retargetingSpend: futureRetargetingSpend,
      retargetingCPAReduction,
      prospectingCPAReduction,
      prospectingCPA: futureProspectingCPA,
      retargetingCPA: futureRetargetingCPA,
      prospectingOrders: futureProspectingOrders,
      retargetingOrders: futureRetargetingOrders,
      totalOrders: futureTotalOrders,
      increasedOrders,
      ltv,
      revenueImpact,
      operatingMargin,
      marginImpact,
    };
  };

  // Calculate all scenarios
  const lowScenario = calculateProjections('low');
  const medScenario = calculateProjections('medium');
  const highScenario = calculateProjections('high');

  return (
    <Card className="border-gray-100 shadow-md">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Margin Impact due to Shopify Audiences (Annual)</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-1/3">Increased Retargeting w/ Shopify Audiences</TableHead>
                <TableHead className="w-1/6 bg-gray-100">Current</TableHead>
                <TableHead className="w-1/6 bg-gray-200 text-center">Low</TableHead>
                <TableHead className="w-1/6 bg-gray-200 text-center">Med</TableHead>
                <TableHead className="w-1/6 bg-gray-200 text-center">High</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="bg-gray-50">Digital Ad Spend (Annual)</TableCell>
                <TableCell className="bg-green-50">
                  <Input 
                    type="text" 
                    value={`$${digitalAdSpend.toLocaleString()}`} 
                    onChange={(e) => handleInputChange(e, setDigitalAdSpend)} 
                    className="w-full border-none bg-transparent text-right"
                  />
                </TableCell>
                <TableCell className="bg-yellow-50 text-right">{formatCurrency(lowScenario.adSpend)}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{formatCurrency(medScenario.adSpend)}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{formatCurrency(highScenario.adSpend)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="bg-gray-50">Retargeting %</TableCell>
                <TableCell className="bg-green-50">
                  <Input 
                    type="text" 
                    value={`${retargetingPercent}%`} 
                    onChange={(e) => handleInputChange(e, setRetargetingPercent)} 
                    className="w-full border-none bg-transparent text-right"
                  />
                </TableCell>
                <TableCell className="bg-yellow-50 text-right">{lowScenario.retargetingPercent}%</TableCell>
                <TableCell className="bg-yellow-50 text-right">{medScenario.retargetingPercent}%</TableCell>
                <TableCell className="bg-yellow-50 text-right">{highScenario.retargetingPercent}%</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="bg-gray-50">Prospecting Spend</TableCell>
                <TableCell className="bg-yellow-50 text-right">{formatCurrency(prospectingSpend)}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{formatCurrency(lowScenario.prospectingSpend)}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{formatCurrency(medScenario.prospectingSpend)}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{formatCurrency(highScenario.prospectingSpend)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="bg-gray-50">Retargeting Spend</TableCell>
                <TableCell className="bg-yellow-50 text-right">{formatCurrency(retargetingSpend)}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{formatCurrency(lowScenario.retargetingSpend)}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{formatCurrency(medScenario.retargetingSpend)}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{formatCurrency(highScenario.retargetingSpend)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="bg-gray-50">% Reduction in Retargeting CPA</TableCell>
                <TableCell className="bg-blue-50 text-right">0%</TableCell>
                <TableCell className="bg-blue-50 text-right">{lowScenario.retargetingCPAReduction}%</TableCell>
                <TableCell className="bg-blue-50 text-right">{medScenario.retargetingCPAReduction}%</TableCell>
                <TableCell className="bg-blue-50 text-right">{highScenario.retargetingCPAReduction}%</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="bg-gray-50">% Reduction in Prospecting CPA</TableCell>
                <TableCell className="bg-green-50 text-right"></TableCell>
                <TableCell className="bg-green-50 text-right">{lowScenario.prospectingCPAReduction}%</TableCell>
                <TableCell className="bg-green-50 text-right">{medScenario.prospectingCPAReduction}%</TableCell>
                <TableCell className="bg-green-50 text-right">{highScenario.prospectingCPAReduction}%</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="bg-gray-50">Prospecting CPA</TableCell>
                <TableCell className="bg-green-50">
                  <Input 
                    type="text" 
                    value={`$${prospectingCPA}`} 
                    onChange={(e) => handleInputChange(e, setProspectingCPA)} 
                    className="w-full border-none bg-transparent text-right"
                  />
                </TableCell>
                <TableCell className="bg-yellow-50 text-right">{formatCurrency(lowScenario.prospectingCPA)}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{formatCurrency(medScenario.prospectingCPA)}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{formatCurrency(highScenario.prospectingCPA)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="bg-gray-50">Retargeting CPA</TableCell>
                <TableCell className="bg-green-50">
                  <Input 
                    type="text" 
                    value={`$${retargetingCPA}`} 
                    onChange={(e) => handleInputChange(e, setRetargetingCPA)} 
                    className="w-full border-none bg-transparent text-right"
                  />
                </TableCell>
                <TableCell className="bg-yellow-50 text-right">{formatCurrency(lowScenario.retargetingCPA)}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{formatCurrency(medScenario.retargetingCPA)}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{formatCurrency(highScenario.retargetingCPA)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="bg-gray-50">Prospecting Orders</TableCell>
                <TableCell className="bg-green-50">
                  <Input 
                    type="text" 
                    value={prospectingOrders.toString()} 
                    onChange={(e) => handleInputChange(e, setProspectingOrders)} 
                    className="w-full border-none bg-transparent text-right"
                  />
                </TableCell>
                <TableCell className="bg-yellow-50 text-right">{lowScenario.prospectingOrders}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{medScenario.prospectingOrders}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{highScenario.prospectingOrders}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="bg-gray-50">Retargeting Orders</TableCell>
                <TableCell className="bg-green-50">
                  <Input 
                    type="text" 
                    value={retargetingOrders.toString()} 
                    onChange={(e) => handleInputChange(e, setRetargetingOrders)} 
                    className="w-full border-none bg-transparent text-right"
                  />
                </TableCell>
                <TableCell className="bg-yellow-50 text-right">{lowScenario.retargetingOrders}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{medScenario.retargetingOrders}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{highScenario.retargetingOrders}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="bg-gray-50">Total Orders</TableCell>
                <TableCell className="bg-yellow-50 text-right">{currentTotalOrders}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{lowScenario.totalOrders}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{medScenario.totalOrders}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{highScenario.totalOrders}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="bg-gray-50">Increased Orders due to Shopify Audiences</TableCell>
                <TableCell className="bg-gray-100"></TableCell>
                <TableCell className="bg-yellow-50 text-right">{lowScenario.increasedOrders}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{medScenario.increasedOrders}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{highScenario.increasedOrders}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="bg-gray-50">LTV</TableCell>
                <TableCell className="bg-green-50">
                  <Input 
                    type="text" 
                    value={`$${ltv}`} 
                    onChange={(e) => handleInputChange(e, setLtv)} 
                    className="w-full border-none bg-transparent text-right"
                  />
                </TableCell>
                <TableCell className="bg-green-50 text-right">{formatCurrency(lowScenario.ltv)}</TableCell>
                <TableCell className="bg-green-50 text-right">{formatCurrency(medScenario.ltv)}</TableCell>
                <TableCell className="bg-green-50 text-right">{formatCurrency(highScenario.ltv)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="bg-gray-50">Revenue Impact due to Shopify Audiences</TableCell>
                <TableCell className="bg-gray-100"></TableCell>
                <TableCell className="bg-yellow-50 text-right">{formatCurrency(lowScenario.revenueImpact)}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{formatCurrency(medScenario.revenueImpact)}</TableCell>
                <TableCell className="bg-yellow-50 text-right">{formatCurrency(highScenario.revenueImpact)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="bg-gray-50">Operating Margin</TableCell>
                <TableCell className="bg-green-50">
                  <Input 
                    type="text" 
                    value={`${operatingMargin}%`} 
                    onChange={(e) => handleInputChange(e, setOperatingMargin)} 
                    className="w-full border-none bg-transparent text-right"
                  />
                </TableCell>
                <TableCell className="bg-green-50 text-right">{lowScenario.operatingMargin}%</TableCell>
                <TableCell className="bg-green-50 text-right">{medScenario.operatingMargin}%</TableCell>
                <TableCell className="bg-green-50 text-right">{highScenario.operatingMargin}%</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="bg-gray-50 font-bold">Margin Impact due to Shopify Audiences (Annual)</TableCell>
                <TableCell className="bg-gray-100"></TableCell>
                <TableCell className="bg-black text-white text-right font-bold">{formatCurrency(lowScenario.marginImpact)}</TableCell>
                <TableCell className="bg-black text-white text-right font-bold">{formatCurrency(medScenario.marginImpact)}</TableCell>
                <TableCell className="bg-black text-white text-right font-bold">{formatCurrency(highScenario.marginImpact)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <p>Note: CAC Reduction only applies to a max ad spend of $320K per month</p>
          <p>Most merchants at least double the size of their retargeting ad sets with Shopify Audiences</p>
          <p className="mt-2">Audiences retargeting data: 25th percentile see 50% reduction, on average see 24% reduction; some merchants may see negligeable impact to CAC</p>
          <p>Audiences prospecting data: 75th percentile see 15% reduction; much more likely for merchants to see zero improvement on this metric vs. retargeting CPA.</p>
        </div>
      </CardContent>
    </Card>
  );
};
