
import { Check, Edit2, Save } from "lucide-react";
import { useState } from "react";
import { useCalculatorContext } from "@/contexts/CalculatorContext";

type EditablePlanFeatureProps = {
  feature: string;
  index: number;
  planId: string;
  isHighlighted?: boolean;
};

export const EditablePlanFeature = ({ 
  feature, 
  index, 
  planId, 
  isHighlighted = false 
}: EditablePlanFeatureProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFeature, setEditedFeature] = useState(feature);
  const { updatePlanFeature } = useCalculatorContext();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedFeature.trim()) {
      updatePlanFeature(planId, index, editedFeature.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditedFeature(feature);
      setIsEditing(false);
    }
  };

  return (
    <li className="flex items-start group">
      <div className={`h-5 w-5 mr-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${isHighlighted ? 'bg-gray-700 rounded-full p-1' : ''}`}>
        <Check className={`${isHighlighted ? 'h-4 w-4 text-gray-300' : 'h-5 w-5 text-gray-500'}`} />
      </div>
      
      {isEditing ? (
        <div className="flex-1 flex gap-1">
          <input
            type="text"
            value={editedFeature}
            onChange={(e) => setEditedFeature(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            autoFocus
            className="flex-1 bg-transparent border-b border-gray-400 focus:outline-none px-1 text-sm"
          />
          <button 
            onClick={handleSave} 
            className="opacity-70 hover:opacity-100 p-1"
            aria-label="Save feature"
          >
            <Save className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex-1 flex justify-between items-start">
          <span className={`text-sm ${isHighlighted ? 'text-gray-200' : ''}`}>{feature}</span>
          <button
            onClick={handleEdit}
            className="opacity-0 group-hover:opacity-70 hover:opacity-100 ml-2 p-1"
            aria-label="Edit feature"
          >
            <Edit2 className="h-3.5 w-3.5 text-gray-400" />
          </button>
        </div>
      )}
    </li>
  );
};
