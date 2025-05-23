
import React from "react";
import { cn } from "@/lib/utils";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface StatusCardProps {
  status: string;
  className?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ status, className }) => {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case "keluar":
        return {
          icon: ShieldCheck,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          label: "Clothesline Extended",
          description: "Your laundry is currently outside"
        };
      case "masuk":
        return {
          icon: Shield,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
          label: "Clothesline Retracted",
          description: "Your laundry is currently protected"
        };
      case "moving":
        return {
          icon: ShieldAlert,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
          label: "Clothesline Moving",
          description: "The system is changing position"
        };
      default:
        return {
          icon: ShieldAlert,
          color: "text-gray-500",
          bgColor: "bg-gray-500/10",
          label: "Status Unknown",
          description: "Cannot determine current status"
        };
    }
  };

  const { icon: Icon, color, bgColor, label, description } = getStatusConfig();

  return (
    <div className={cn("p-6 rounded-lg transition-all", bgColor, className)}>
      <div className="flex items-center space-x-4">
        <div className={cn("p-3 rounded-full", bgColor)}>
          <Icon className={cn("h-8 w-8", color)} />
        </div>
        <div>
          <h3 className={cn("text-lg font-medium", color)}>{label}</h3>
          <p className="text-sunsafe-muted-text">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
