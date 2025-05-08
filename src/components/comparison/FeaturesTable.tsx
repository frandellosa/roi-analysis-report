
import { useCalculatorContext } from "@/contexts/CalculatorContext";
import { FeaturesTableProps } from "./types";
import { RegularPlanCard } from "./RegularPlanCard";
import { PlusPlanCard } from "./PlusPlanCard";

export const FeaturesTable = ({ selectedPlan }: FeaturesTableProps) => {
  const { plans } = useCalculatorContext();
  
  // Get the base plan name (removing any billing suffix)
  const basePlan = selectedPlan.split('-')[0];
  
  // Get the current plan and Plus plan
  const currentPlan = plans[basePlan];
  const plusPlan = plans.plus;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Current plan card */}
      <RegularPlanCard plan={currentPlan} planId={basePlan} />

      {/* Plus plan card */}
      <PlusPlanCard plan={plusPlan} planId="plus" />
    </div>
  );
};
