// FAQ System Service Worker
const CACHE_NAME = 'faq-system-v1.0.0';
const CACHE_URLS = [
    '/',
    '/css/main.css',
    '/css/menu.css', 
    '/css/mobile.css',
    '/css/faq-enhancements.css',
    '/js/main.js',
    '/js/mobile-menu.js',
    '/js/faq-functionality.js',
    '/js/faq-init.js',
    '/js/diagnost-faq.js',
    // Добавьте другие важные ресурсы
];

// Установка Service Worker
self.addEventListener('install', event => {
    console.log('FAQ SW: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('FAQ SW: Caching resources');
                return cache.addAll(CACHE_URLS);
            })
            .then(() => {
                console.log('FAQ SW: Installation complete');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('FAQ SW: Installation failed:', error);
            })
    );
});

// Активация Service Worker
self.addEventListener('activate', event => {
    console.log('FAQ SW: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('FAQ SW: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('FAQ SW: Activation complete');
                                return self.clients.claim();
            })
    );
});

// Обработка запросов
self.addEventListener('fetch', event => {
    // Игнорируем запросы не по HTTP/HTTPS
    if (!event.request.url.startsWith('http')) {
        return;
    }
    
    // Стратегия кеширования: Cache First для статических ресурсов, Network First для API
    if (event.request.url.includes('/api/')) {
        // Network First для API запросов
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Кешируем успешные ответы
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseClone);
                            });
                    }
                    return response;
                })
                .catch(() => {
                    // Если сеть недоступна, возвращаем из кеша
                    return caches.match(event.request);
                })
        );
    } else {
        // Cache First для статических ресурсов
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response;
                    }
                    
                    return fetch(event.request)
                        .then(response => {
                            // Кешируем только успешные ответы
                            if (response.status === 200) {
                                const responseClone = response.clone();
                                caches.open(CACHE_NAME)
                                    .then(cache => {
                                        cache.put(event.request, responseClone);
                                    });
                            }
                            return response;
                        });
                })
        );
    }
});

// Обработка фоновой синхронизации
self.addEventListener('sync', event => {
    if (event.tag === 'faq-analytics-sync') {
        event.waitUntil(syncAnalytics());
    }
});

// Функция синхронизации аналитики
const syncAnalytics = async () => {
    try {
        const analyticsData = await getStoredAnalytics();
        if (analyticsData.length > 0) {
            await sendAnalyticsToServer(analyticsData);
            await clearStoredAnalytics();
            console.log('FAQ SW: Analytics synced successfully');
        }
    } catch (error) {
        console.error('FAQ SW: Analytics sync failed:', error);
    }
};

// Получение сохраненных данных аналитики
const getStoredAnalytics = () => {
    return new Promise((resolve) => {
        // В реальном приложении здесь был бы IndexedDB
        resolve([]);
    });
};

// Отправка аналитики на сервер
const sendAnalyticsToServer = async (data) => {
    return fetch('/api/analytics', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
};

// Очистка сохраненной аналитики
const clearStoredAnalytics = () => {
    return Promise.resolve();
};

// Обработка push уведомлений
self.addEventListener('push', event => {
    const options = {
        body: 'Обновления FAQ доступны!',
        icon: '/icons/faq-icon-192.png',
        badge: '/icons/faq-badge-72.png',
        tag: 'faq-update',
        data: {
            url: '/'
        }
    };
    
    if (event.data) {
        try {
            const pushData = event.data.json();
            options.body = pushData.body || options.body;
            options.data = pushData.data || options.data;
        } catch (error) {
            console.error('FAQ SW: Error parsing push data:', error);
        }
    }
    
    event.waitUntil(
        self.registration.showNotification('FAQ System', options)
    );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    const targetUrl = event.notification.data?.url || '/';
    
    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then(clientList => {
                // Проверяем, есть ли уже открытая вкладка
                for (const client of clientList) {
                    if (client.url === targetUrl && 'focus' in client) {
                        return client.focus();
                    }
                }
                
                // Открываем новую вкладку
                if (clients.openWindow) {
                    return clients.openWindow(targetUrl);
                }
            })
    );
});

// Сообщения от основного потока
self.addEventListener('message', event => {
    if (event.data && event.data.type) {
        switch (event.data.type) {
            case 'CACHE_FAQ_DATA':
                handleCacheFAQData(event.data.payload);
                break;
            case 'GET_CACHE_INFO':
                handleGetCacheInfo(event);
                break;
            case 'CLEAR_CACHE':
                handleClearCache(event);
                break;
            default:
                console.log('FAQ SW: Unknown message type:', event.data.type);
        }
    }
});

// Кеширование данных FAQ
const handleCacheFAQData = async (data) => {
    try {
        const cache = await caches.open(CACHE_NAME);
        const response = new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });
        await cache.put('/api/faq-data', response);
        console.log('FAQ SW: FAQ data cached successfully');
    } catch (error) {
        console.error('FAQ SW: Error caching FAQ data:', error);
    }
};

// Получение информации о кеше
const handleGetCacheInfo = async (event) => {
    try {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        const cacheInfo = {
            name: CACHE_NAME,
            size: keys.length,
            urls: keys.map(request => request.url)
        };
        
        event.ports[0].postMessage({
            type: 'CACHE_INFO_RESPONSE',
            payload: cacheInfo
        });
    } catch (error) {
        event.ports[0].postMessage({
            type: 'CACHE_INFO_ERROR',
            error: error.message
        });
    }
};

// Очистка кеша
const handleClearCache = async (event) => {
    try {
        await caches.delete(CACHE_NAME);
        console.log('FAQ SW: Cache cleared successfully');
        
        event.ports[0].postMessage({
            type: 'CACHE_CLEARED'
        });
    } catch (error) {
        event.ports[0].postMessage({
            type: 'CACHE_CLEAR_ERROR',
            error: error.message
        });
    }
};

console.log('FAQ SW: Service Worker loaded');

