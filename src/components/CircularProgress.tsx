
import React from "react";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  max: number;
  size?: "sm" | "md" | "lg";
  label: string;
  color?: string;
  unit?: string;
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max,
  size = "md",
  label,
  color = "bg-sunsafe-teal",
  unit = "%",
  className,
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  const strokeWidth = size === "sm" ? 8 : size === "md" ? 12 : 16;
  const radius = size === "sm" ? 40 : size === "md" ? 60 : 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const sizes = {
    sm: "w-24 h-24",
    md: "w-36 h-36",
    lg: "w-48 h-48"
  };
  
  const textSizes = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl"
  };
  
  const labelSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };
  
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className={cn("relative flex items-center justify-center", sizes[size])}>
        <svg className="w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            strokeWidth={strokeWidth}
            stroke="rgba(255, 255, 255, 0.1)"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            strokeWidth={strokeWidth}
            stroke={color.startsWith("bg-") ? color.replace("bg-", "stroke-") : color}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={cn(textSizes[size], "font-bold")}>
            {value}
            <span className="text-sunsafe-muted-text ml-1 text-sm">{unit}</span>
          </span>
          <span className={cn(labelSizes[size], "text-sunsafe-muted-text mt-1")}>
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CircularProgress;
