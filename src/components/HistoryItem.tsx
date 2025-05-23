
import React from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { HistoryEntry } from "@/services/BlynkService";
import { Clock, CloudRain, Sun, ShieldCheck } from "lucide-react";

interface HistoryItemProps {
  entry: HistoryEntry;
  className?: string;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ entry, className }) => {
  const getActionIcon = () => {
    if (entry.action.includes("Keluar")) return Sun;
    if (entry.action.includes("Masuk")) return CloudRain;
    if (entry.action.includes("Auto mode")) return Clock;
    return ShieldCheck;
  };
  
  const Icon = getActionIcon();

  return (
    <div className={cn("p-4 border-b border-slate-800 animate-fade-in", className)}>
      <div className="flex items-start">
        <div className="mr-4 mt-1">
          <Icon className="h-5 w-5 text-sunsafe-teal" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-white">{entry.action}</h4>
            <span className="text-xs text-sunsafe-muted-text">
              {format(entry.timestamp, "HH:mm:ss")}
            </span>
          </div>
          <p className="text-sm text-sunsafe-muted-text mt-1">
            {format(entry.timestamp, "dd MMM yyyy")}
          </p>
          
          {(entry.lightLevel !== undefined || entry.rainLevel !== undefined) && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {entry.lightLevel !== undefined && (
                <div className="bg-sunsafe-blue p-2 rounded text-xs">
                  <span className="text-sunsafe-muted-text">Light: </span>
                  <span className="font-medium">{entry.lightLevel}%</span>
                </div>
              )}
              {entry.rainLevel !== undefined && (
                <div className="bg-sunsafe-blue p-2 rounded text-xs">
                  <span className="text-sunsafe-muted-text">Rain: </span>
                  <span className="font-medium">{entry.rainLevel}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;
