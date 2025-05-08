
import { useCalculatorContext } from "@/contexts/CalculatorContext";
import { FeaturesTableProps } from "./types";
import { allPlans } from "./PlanData";
import { RegularPlanCard } from "./RegularPlanCard";
import { PlusPlanCard } from "./PlusPlanCard";

export const FeaturesTable = ({ selectedPlan }: FeaturesTableProps) => {
  const { processingFeeSavings } = useCalculatorContext();
  
  // Get the current plan and Plus plan
  const currentPlan = allPlans[selectedPlan];
  const plusPlan = allPlans.plus;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Current plan card */}
      <RegularPlanCard plan={currentPlan} />

      {/* Plus plan card */}
      <PlusPlanCard plan={plusPlan} />
    </div>
  );
};
