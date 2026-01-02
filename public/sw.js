self.addEventListener('push', function(event) {
  console.log('Push recibido:', event);
  
  let notificationData;
  try {
    notificationData = event.data ? event.data.json() : {};
  } catch (e) {
    notificationData = { title: 'Journal Trade', body: event.data ? event.data.text() : 'Nueva notificación' };
  }

  const options = {
    body: notificationData.body || 'Nueva notificación',
    icon: '/toro.png',
    badge: '/toro.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1',
      url: notificationData.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title || 'Journal Trade', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notificación clickeada:', event);
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

self.addEventListener('install', function(event) {
  console.log('Service Worker instalado');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activado');
  event.waitUntil(self.clients.claim());
});