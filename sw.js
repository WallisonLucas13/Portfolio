// Service Worker para PWA - Portfolio Wallison Lucas
const CACHE_NAME = 'wallison-portfolio-v1.0.0';
const STATIC_CACHE_NAME = 'wallison-static-v1.0.0';

// Arquivos para cache offline
const STATIC_FILES = [
  './',
  './index.html',
  './portfolio-styles.css',
  './portfolio-script.js',
  './manifest.json',
  './favicon.svg',
  './favicon-16x16.svg',
  './apple-touch-icon.svg',
  './icon.svg',
  // Adicione outros arquivos estáticos necessários
];

// Recursos externos essenciais
const EXTERNAL_RESOURCES = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('🚀 Service Worker instalando...');
  
  event.waitUntil(
    Promise.all([
      // Cache arquivos estáticos
      caches.open(STATIC_CACHE_NAME)
        .then(cache => {
          console.log('📦 Cacheando arquivos estáticos...');
          return cache.addAll(STATIC_FILES);
        }),
      // Cache recursos externos
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log('🌐 Cacheando recursos externos...');
          return cache.addAll(EXTERNAL_RESOURCES.map(url => new Request(url, { mode: 'cors' })));
        })
    ])
    .then(() => {
      console.log('✅ Cache inicial completo!');
      return self.skipWaiting();
    })
    .catch(error => {
      console.error('❌ Erro durante instalação:', error);
    })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  console.log('🔄 Service Worker ativando...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log('🗑️ Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker ativo!');
        return self.clients.claim();
      })
  );
});

// Estratégias de cache
self.addEventListener('fetch', event => {
  const { request } = event;
  const { url, method, destination } = request;

  // Apenas interceptar requisições GET
  if (method !== 'GET') return;

  // Estratégia para diferentes tipos de recursos
  if (destination === 'document') {
    // HTML - Network First com Cache Fallback
    event.respondWith(networkFirstWithCacheFallback(request));
  } else if (destination === 'style' || destination === 'script') {
    // CSS/JS - Cache First com Network Fallback
    event.respondWith(cacheFirstWithNetworkFallback(request));
  } else if (destination === 'image') {
    // Imagens - Cache First
    event.respondWith(cacheFirstWithNetworkFallback(request));
  } else if (url.includes('fonts.googleapis.com') || url.includes('cdnjs.cloudflare.com')) {
    // Recursos externos - Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request));
  } else {
    // Outros recursos - Network First
    event.respondWith(networkFirstWithCacheFallback(request));
  }
});

// Network First - tenta rede primeiro, cache como fallback
async function networkFirstWithCacheFallback(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🔄 Usando cache para:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback para página offline se disponível
    if (request.destination === 'document') {
      return caches.match('./index.html');
    }
    
    throw error;
  }
}

// Cache First - verifica cache primeiro, rede como fallback
async function cacheFirstWithNetworkFallback(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Erro ao buscar recurso:', request.url, error);
    throw error;
  }
}

// Stale While Revalidate - retorna cache imediatamente e atualiza em background
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Busca nova versão em background
  const networkResponsePromise = fetch(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(error => {
      console.log('🔄 Falha na atualização em background:', request.url);
    });
  
  // Retorna cache imediatamente ou aguarda rede se não houver cache
  return cachedResponse || networkResponsePromise;
}

// Notificações push (futuro)
self.addEventListener('push', event => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      tag: 'portfolio-notification',
      renotify: true,
      actions: [
        {
          action: 'view',
          title: 'Ver Portfolio'
        },
        {
          action: 'close',
          title: 'Fechar'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification('Portfolio Wallison Lucas', options)
    );
  }
});

// Clique em notificações
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});

// Sincronização em background (futuro)
self.addEventListener('sync', event => {
  if (event.tag === 'portfolio-sync') {
    event.waitUntil(
      console.log('🔄 Sincronização em background executada')
    );
  }
});

console.log('🎯 Service Worker carregado - Portfolio Wallison Lucas v1.0.0');