import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { getConnectionStatus, subscribeToConnectionStatus } from '@/services/stateService';
import { useModelStorage } from '@/contexts/ModelStorageContext';
import { isProduction } from '@/utils/env';
import { cn } from '@/lib/utils';

export const ConnectionStatus = () => {
  const { syncToBackend } = useModelStorage();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'unknown'>(
    getConnectionStatus()
  );
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Only show in production
    if (!isProduction()) {
      return;
    }

    const unsubscribe = subscribeToConnectionStatus((status) => {
      setConnectionStatus(status);
    });

    return unsubscribe;
  }, []);

  // Don't render in non-production
  if (!isProduction()) {
    return null;
  }

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await syncToBackend();
      // Status will be updated via the subscription
    } catch (error) {
      console.error('Manual sync retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  const isConnected = connectionStatus === 'connected';
  const isDisconnected = connectionStatus === 'disconnected';

  return (
    <button
      onClick={handleRetry}
      disabled={isRetrying}
      className={cn(
        "fixed bottom-4 right-4 z-50 p-2 rounded-full transition-all hover:scale-110",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        isConnected && "bg-green-500 hover:bg-green-600 focus:ring-green-500",
        isDisconnected && "bg-red-500 hover:bg-red-600 focus:ring-red-500",
        connectionStatus === 'unknown' && "bg-gray-400 hover:bg-gray-500 focus:ring-gray-400",
        isRetrying && "opacity-50 cursor-not-allowed"
      )}
      title={
        isConnected
          ? "Connected to backend"
          : isDisconnected
          ? "Backend connection failed - Click to retry"
          : "Connection status unknown"
      }
      aria-label={
        isConnected
          ? "Connected to backend"
          : isDisconnected
          ? "Backend connection failed - Click to retry"
          : "Connection status unknown"
      }
    >
      {isConnected ? (
        <Wifi className="h-5 w-5 text-white" />
      ) : (
        <WifiOff className="h-5 w-5 text-white" />
      )}
    </button>
  );
};

