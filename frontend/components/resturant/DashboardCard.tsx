import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  count: number;
   icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export const DashboardCard = ({ 
  title, 
  count, 
   icon: Icon,
  iconColor = "text-yellow-600",
  iconBgColor = "bg-yellow-100"
}: DashboardCardProps) => {
  return (
    <div className=" bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:border-accent/20 transition-all duration-300 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <h2 className="text-3xl font-bold text-gray-900">{count}</h2>
        </div>
        <div className={`${iconBgColor} ${iconColor} p-3 rounded-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};