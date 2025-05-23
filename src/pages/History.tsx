
import React, { useState, useEffect } from "react";
import { getHistoryEntries, HistoryEntry } from "@/services/BlynkService";
import HistoryItem from "@/components/HistoryItem";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadHistory();
    
    // Set up periodic refresh every 30 seconds
    const interval = setInterval(loadHistory, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadHistory = () => {
    setLoading(true);
    // In a real app, this would be a call to Supabase
    const entries = getHistoryEntries();
    setHistory(entries);
    setLoading(false);
  };

  const groupEntriesByDate = () => {
    const groups: { [key: string]: HistoryEntry[] } = {};
    
    history.forEach(entry => {
      const date = new Date(entry.timestamp);
      const dateString = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
      
      if (!groups[dateString]) {
        groups[dateString] = [];
      }
      
      groups[dateString].push(entry);
    });
    
    return groups;
  };

  const groupedEntries = groupEntriesByDate();
  const sortedDates = Object.keys(groupedEntries).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="container px-4 pb-24 pt-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Activity History</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadHistory} 
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {history.length === 0 ? (
        <div className="text-center py-8 text-sunsafe-muted-text">
          No history available yet
        </div>
      ) : (
        <>
          {sortedDates.map(dateString => {
            const date = new Date(dateString);
            const formattedDate = date.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            });
            
            return (
              <div key={dateString} className="mb-6">
                <div className="flex items-center mb-2">
                  <h3 className="text-sunsafe-muted-text font-medium">{formattedDate}</h3>
                  <Separator className="flex-grow ml-4" />
                </div>
                
                <div className="bg-sunsafe-blue rounded-lg overflow-hidden">
                  {groupedEntries[dateString].map((entry, index) => (
                    <HistoryItem 
                      key={`${dateString}-${index}`} 
                      entry={entry} 
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default History;
