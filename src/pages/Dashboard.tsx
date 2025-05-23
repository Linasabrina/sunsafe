
import React, { useEffect, useState } from "react";
import { ArrowRight, Umbrella, Sun } from "lucide-react";
import CircularProgress from "@/components/CircularProgress";
import StatusCard from "@/components/StatusCard";
import ActionButton from "@/components/ActionButton";
import AutoModeSwitch from "@/components/AutoModeSwitch";
import { 
  getSensorData, 
  controlActions, 
  SensorData,
  setupRealtimeUpdates,
  saveHistoryEntry 
} from "@/services/BlynkService";
import { useToast } from "@/hooks/use-toast";

const Dashboard: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    lightIntensity: 0,
    rainIntensity: 0,
    clotheslineStatus: "unknown",
    autoModeActive: false
  });
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Initial data fetch
    fetchSensorData();
    
    // Set up real-time updates
    const cleanupRealtimeUpdates = setupRealtimeUpdates((data) => {
      setSensorData(data);
      
      // Save periodic readings to history
      saveHistoryEntry(
        "Sensor Reading", 
        data.lightIntensity, 
        data.rainIntensity, 
        data.clotheslineStatus
      );
    });
    
    return () => {
      cleanupRealtimeUpdates();
    };
  }, []);

  const fetchSensorData = async () => {
    try {
      setLoading(true);
      const data = await getSensorData();
      setSensorData(data);
      
      // Save initial reading to history
      saveHistoryEntry(
        "Initial Reading", 
        data.lightIntensity, 
        data.rainIntensity, 
        data.clotheslineStatus
      );
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch sensor data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeluarAction = async () => {
    try {
      await controlActions.keluarClothesline();
      setSensorData(prev => ({ ...prev, clotheslineStatus: "keluar" }));
      toast({
        title: "Success",
        description: "Clothesline is being extended"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extend clothesline",
        variant: "destructive"
      });
    }
  };

  const handleMasukAction = async () => {
    try {
      await controlActions.masukClothesline();
      setSensorData(prev => ({ ...prev, clotheslineStatus: "masuk" }));
      toast({
        title: "Success",
        description: "Clothesline is being retracted"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to retract clothesline",
        variant: "destructive"
      });
    }
  };

  const handleAutoModeToggle = async (enabled: boolean) => {
    try {
      await controlActions.toggleAutoMode(enabled);
      setSensorData(prev => ({ ...prev, autoModeActive: enabled }));
      toast({
        title: enabled ? "Auto Mode Activated" : "Auto Mode Deactivated",
        description: enabled 
          ? "The system will now respond automatically to weather conditions" 
          : "You can now control the clothesline manually"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle auto mode",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container px-4 pb-24 pt-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Status Card */}
      <StatusCard 
        status={sensorData.clotheslineStatus} 
        className="mb-8"
      />
      
      {/* Sensor Readings */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <CircularProgress
          value={sensorData.lightIntensity}
          max={100}
          label="Light Intensity"
          color="bg-sunsafe-cyan"
          unit="%"
        />
        <CircularProgress
          value={sensorData.rainIntensity}
          max={100}
          label="Rain Intensity"
          color="bg-sunsafe-purple"
          unit="%"
        />
      </div>
      
      {/* Manual Controls */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Manual Control</h2>
        <div className="grid grid-cols-2 gap-4">
          <ActionButton
            icon={Sun}
            label="Keluar"
            onClick={handleKeluarAction}
            disabled={sensorData.autoModeActive}
            className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500"
          />
          <ActionButton
            icon={Umbrella}
            label="Masuk"
            onClick={handleMasukAction}
            disabled={sensorData.autoModeActive}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
          />
        </div>
      </div>
      
      {/* Auto Mode Toggle */}
      <div className="bg-sunsafe-blue p-4 rounded-lg">
        <AutoModeSwitch
          checked={sensorData.autoModeActive}
          onCheckedChange={handleAutoModeToggle}
        />
      </div>
      
      {/* Refresh Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={fetchSensorData}
          disabled={loading}
          className="text-sunsafe-muted-text text-sm flex items-center hover:text-white transition-colors"
        >
          Refresh Data
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
