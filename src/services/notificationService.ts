import { apiService } from './apiService';

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export const notificationService = {
  async getVapidPublicKey(): Promise<string> {
    console.log('🔑 Obteniendo clave VAPID...');
    console.log('🌐 URL completa:', `${import.meta.env.VITE_API_URL}/notifications/vapid-public-key`);
    
    try {
      const response = await apiService.get<{ publicKey: string }>('/notifications/vapid-public-key');
      console.log('🔑 Clave VAPID obtenida:', response.publicKey?.substring(0, 20) + '...');
      return response.publicKey;
    } catch (error) {
      console.error('❌ Error obteniendo VAPID key:', error);
      throw error;
    }
  },

  async subscribe(subscription: PushSubscription): Promise<void> {
    console.log('📝 Enviando suscripción al backend...');
    await apiService.withAuth('POST', '/notifications/subscribe', subscription);
    console.log('✅ Suscripción enviada al backend');
  },

  async sendNotification(message: string): Promise<void> {
    console.log('📨 Enviando notificación:', message);
    
    // Verificar si estamos en localhost
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isLocalhost) {
      console.log('💻 Modo desarrollo: mostrando notificación local');
      
      // Intentar notificación del navegador
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          const notification = new Notification('Journal Trade', {
            body: message,
            icon: '/toro.png',
            requireInteraction: true
          });
          
          // Auto cerrar después de 5 segundos
          setTimeout(() => notification.close(), 5000);
          
          console.log('✅ Notificación del navegador creada');
        } catch (error) {
          console.error('Error creando notificación:', error);
          // Fallback: mostrar alert
          alert(`🔔 Journal Trade\n\n${message}`);
        }
      } else {
        // Fallback: mostrar alert si no hay permisos
        alert(`🔔 Journal Trade\n\n${message}`);
      }
      
      console.log('✅ Notificación local mostrada');
      return;
    }
    
    // Código original para producción
    await apiService.withAuth('POST', '/notifications/send', { message });
    console.log('✅ Notificación enviada al backend');
  },

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Este navegador no soporta notificaciones');
    }
    console.log('🔔 Solicitando permisos...');
    const permission = await Notification.requestPermission();
    console.log('🔔 Permiso otorgado:', permission);
    return permission;
  },

  async registerServiceWorker(): Promise<ServiceWorkerRegistration> {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker no soportado');
    }
    console.log('⚙️ Registrando Service Worker...');
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('✅ Service Worker registrado');
    return registration;
  },

  async subscribeToPush(): Promise<PushSubscription | null> {
    try {
      console.log('🚀 Iniciando proceso de suscripción...');
      
      // Verificar si estamos en localhost
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      if (isLocalhost) {
        console.log('💻 Modo desarrollo: usando notificaciones locales');
        // En desarrollo, simular suscripción exitosa
        const mockSubscription = {
          endpoint: 'mock-endpoint-localhost',
          keys: {
            p256dh: 'mock-p256dh-key',
            auth: 'mock-auth-key'
          }
        };
        
        // Solo registrar el service worker para notificaciones locales
        await this.registerServiceWorker();
        const permission = await this.requestPermission();
        
        if (permission !== 'granted') {
          throw new Error('Permiso de notificaciones denegado');
        }
        
        console.log('✅ Suscripción simulada para desarrollo');
        return mockSubscription;
      }
      
      // Código original para producción
      const registration = await this.registerServiceWorker();
      const permission = await this.requestPermission();
      
      if (permission !== 'granted') {
        console.log('❌ Permiso denegado:', permission);
        throw new Error('Permiso de notificaciones denegado');
      }

      console.log('🔑 Obteniendo clave VAPID...');
      const vapidPublicKey = await this.getVapidPublicKey();
      
      if (!vapidPublicKey || vapidPublicKey.length < 80) {
        throw new Error('Clave VAPID inválida');
      }
      
      console.log('📝 Creando suscripción push...');
      console.log('🔑 Longitud clave VAPID:', vapidPublicKey.length);
      
      const applicationServerKey: any = this.urlBase64ToUint8Array(vapidPublicKey);
      console.log('🔑 ApplicationServerKey length:', applicationServerKey.length);
      
      console.log('🚀 Intentando suscribirse al pushManager...');
      const subscription: any = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });
      console.log('✅ Suscripción push creada exitosamente');

      const subscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
          auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!)))
        }
      };

      console.log('📤 Datos de suscripción:', { endpoint: subscriptionData.endpoint.substring(0, 50) + '...' });
      
      await this.subscribe(subscriptionData);
      console.log('✅ Proceso completo exitoso');
      return subscriptionData;
    } catch (error) {
      console.error('❌ Error en subscribeToPush:', error);
      return null;
    }
  },

  urlBase64ToUint8Array(base64String: string): Uint8Array {
    console.log('🔧 Convirtiendo clave VAPID:', base64String.substring(0, 20) + '...');
    
    // Verificar que la clave no esté vacía
    if (!base64String || base64String.length < 80) {
      throw new Error(`Clave VAPID inválida: longitud ${base64String?.length || 0}`);
    }
    
    try {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      
      console.log('✅ Clave convertida exitosamente, longitud:', outputArray.length);
      return outputArray;
    } catch (error) {
      console.error('❌ Error convirtiendo clave VAPID:', error);
      throw new Error('Error al procesar la clave VAPID');
    }
  }
};