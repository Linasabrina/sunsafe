
// This service handles all interaction with Blynk IoT platform

// Replace these values with your actual Blynk configuration
const BLYNK_AUTH_TOKEN = "YourBlynkAuthToken";
const BLYNK_SERVER = "blynk.cloud";

// Virtual pin assignments
export const VIRTUAL_PINS = {
  LIGHT_INTENSITY: "v0",
  RAIN_INTENSITY: "v1", 
  CLOTHESLINE_STATUS: "v2",
  KELUAR_CONTROL: "v3",
  MASUK_CONTROL: "v4",
  AUTO_MODE: "v5"
};

// Fetch data from a specific virtual pin
export const getVirtualPinValue = async (pin: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://${BLYNK_SERVER}/external/api/get?token=${BLYNK_AUTH_TOKEN}&${pin}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get value from pin ${pin}`);
    }
    
    const data = await response.text();
    return data;
  } catch (error) {
    console.error(`Error getting data from pin ${pin}:`, error);
    throw error;
  }
};

// Update value on a specific virtual pin
export const updateVirtualPin = async (pin: string, value: number | string): Promise<void> => {
  try {
    const response = await fetch(
      `https://${BLYNK_SERVER}/external/api/update?token=${BLYNK_AUTH_TOKEN}&${pin}=${value}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to update pin ${pin}`);
    }
  } catch (error) {
    console.error(`Error updating pin ${pin}:`, error);
    throw error;
  }
};

// Define types for sensor data
export interface SensorData {
  lightIntensity: number;
  rainIntensity: number;
  clotheslineStatus: string;
  autoModeActive: boolean;
}

// Get all sensor data in one call
export const getSensorData = async (): Promise<SensorData> => {
  try {
    const lightIntensity = await getVirtualPinValue(VIRTUAL_PINS.LIGHT_INTENSITY);
    const rainIntensity = await getVirtualPinValue(VIRTUAL_PINS.RAIN_INTENSITY);
    const clotheslineStatus = await getVirtualPinValue(VIRTUAL_PINS.CLOTHESLINE_STATUS);
    const autoModeStatus = await getVirtualPinValue(VIRTUAL_PINS.AUTO_MODE);
    
    return {
      lightIntensity: parseInt(lightIntensity),
      rainIntensity: parseInt(rainIntensity),
      clotheslineStatus: clotheslineStatus,
      autoModeActive: autoModeStatus === "1"
    };
  } catch (error) {
    console.error("Error getting sensor data:", error);
    throw error;
  }
};

// Control actions
export const controlActions = {
  keluarClothesline: async (): Promise<void> => {
    await updateVirtualPin(VIRTUAL_PINS.KELUAR_CONTROL, 1);
    // Add to history after successful control action
    saveHistoryEntry("Manual - Keluar");
  },
  
  masukClothesline: async (): Promise<void> => {
    await updateVirtualPin(VIRTUAL_PINS.MASUK_CONTROL, 1);
    // Add to history after successful control action
    saveHistoryEntry("Manual - Masuk");
  },
  
  toggleAutoMode: async (enable: boolean): Promise<void> => {
    await updateVirtualPin(VIRTUAL_PINS.AUTO_MODE, enable ? 1 : 0);
    // Add to history after successful control action
    saveHistoryEntry(enable ? "Auto mode enabled" : "Auto mode disabled");
  }
};

// History entries (will be replaced with Supabase integration later)
export interface HistoryEntry {
  action: string;
  timestamp: Date;
  lightLevel?: number;
  rainLevel?: number;
  systemStatus?: string;
}

let historyEntries: HistoryEntry[] = [];

// Save history entry
export const saveHistoryEntry = (action: string, lightLevel?: number, rainLevel?: number, systemStatus?: string): void => {
  const entry: HistoryEntry = {
    action,
    timestamp: new Date(),
    lightLevel,
    rainLevel,
    systemStatus
  };
  
  historyEntries = [entry, ...historyEntries];
  
  // Eventually, this will connect to Supabase to store history
  console.log("Saved history entry:", entry);
};

// Get history entries
export const getHistoryEntries = (): HistoryEntry[] => {
  return historyEntries;
};

// This will be replaced with real-time updates using WebSockets in the future
export const setupRealtimeUpdates = (callback: (data: SensorData) => void) => {
  // Poll for updates every 5 seconds
  const interval = setInterval(async () => {
    try {
      const data = await getSensorData();
      callback(data);
    } catch (error) {
      console.error("Error in real-time updates:", error);
    }
  }, 5000);
  
  return () => clearInterval(interval); // Return cleanup function
};
