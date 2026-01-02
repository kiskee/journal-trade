import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

export const useNotifications = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const subscribe = async () => {
    console.log('🔔 Iniciando suscripción...');
    setIsLoading(true);
    try {
      const subscription = await notificationService.subscribeToPush();
      console.log('🔔 Resultado suscripción:', subscription);
      if (subscription) {
        setIsSubscribed(true);
        setPermission('granted');
        console.log('✅ Suscripción exitosa');
      } else {
        console.log('❌ Suscripción falló');
      }
    } catch (error) {
      console.error('❌ Error al suscribirse:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestNotification = async (message: string = 'Notificación de prueba') => {
    console.log('🔔 Enviando notificación de prueba...');
    try {
      await notificationService.sendNotification(message);
      console.log('✅ Notificación enviada');
    } catch (error) {
      console.error('❌ Error al enviar notificación:', error);
    }
  };

  return {
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    sendTestNotification,
    isSupported: 'Notification' in window && 'serviceWorker' in navigator
  };
};