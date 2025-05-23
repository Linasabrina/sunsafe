
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface AutoModeSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => Promise<void> | void;
  className?: string;
  disabled?: boolean;
}

const AutoModeSwitch: React.FC<AutoModeSwitchProps> = ({
  checked,
  onCheckedChange,
  className,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCheckedChange = async (newChecked: boolean) => {
    try {
      setIsLoading(true);
      await onCheckedChange(newChecked);
    } catch (error) {
      console.error("Error toggling auto mode:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex items-center space-x-4", className)}>
      <div className="flex-1">
        <Label htmlFor="auto-mode" className="font-medium text-lg">
          Aktifkan Mode Otomatis
        </Label>
        <p className="text-sm text-sunsafe-muted-text">
          Sistem akan beroperasi sesuai dengan kondisi cahaya dan hujan
        </p>
      </div>
      <div className="flex items-center">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Switch
            id="auto-mode"
            checked={checked}
            onCheckedChange={handleCheckedChange}
            disabled={disabled || isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default AutoModeSwitch;
