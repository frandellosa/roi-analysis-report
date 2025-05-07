
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  previousValue?: string;
  valueColor?: string;
}

export const StatCard = ({
  icon: Icon,
  title,
  value,
  previousValue,
  valueColor = "text-shopify-black"
}: StatCardProps) => {
  return (
    <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="bg-blue-50 p-3 rounded-full mb-4">
            <Icon className="h-6 w-6 text-shopify-blue" />
          </div>
          <h3 className="text-lg font-medium mb-1">{title}</h3>
          <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
          {previousValue && (
            <p className="text-shopify-muted mt-2 text-sm">{previousValue}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
