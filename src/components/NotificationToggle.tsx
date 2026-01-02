import { Bell, BellOff } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

export const NotificationToggle = () => {
  const { isSubscribed, isLoading, subscribe, sendTestNotification, isSupported } = useNotifications();

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-xs">
        <BellOff size={14} />
        <span>No soportado</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {!isSubscribed ? (
        <button
          onClick={subscribe}
          disabled={isLoading}
          className="flex items-center gap-2 px-2 py-1 bg-yellow-600 text-black rounded text-xs hover:bg-yellow-500 disabled:opacity-50"
        >
          <Bell size={12} />
          {isLoading ? 'Activando...' : 'Activar Push'}
        </button>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-green-400 text-xs">
            <Bell size={12} />
            <span>Push activo</span>
          </div>
          <button
            onClick={() => sendTestNotification()}
            className="px-2 py-1 text-xs bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
          >
            Probar
          </button>
        </div>
      )}
    </div>
  );
};