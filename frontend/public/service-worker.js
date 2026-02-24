// Service Worker for Scholarship Portal PWA
const CACHE_NAME = 'scholarship-portal-v1';
const API_CACHE_NAME = 'scholarship-api-v1';

// Static assets to cache immediately
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // API requests - Network first, fallback to cache
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirstStrategy(request));
    }
    // Static assets - Cache first, fallback to network
    else {
        event.respondWith(cacheFirstStrategy(request));
    }
});

// Network-first strategy (for API calls)
async function networkFirstStrategy(request) {
    // Don't cache non-GET requests (POST, PUT, DELETE)
    if (request.method !== 'GET') {
        return fetch(request);
    }

    try {
        const response = await fetch(request);

        // Cache successful GET requests only
        if (request.method === 'GET' && response.ok) {
            const cache = await caches.open(API_CACHE_NAME);
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        console.log('Network request failed, trying cache:', request.url);
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline page or error response
        return new Response(
            JSON.stringify({
                error: 'Offline',
                message: 'You are currently offline. Please check your internet connection.'
            }),
            {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({ 'Content-Type': 'application/json' })
            }
        );
    }
}

// Cache-first strategy (for static assets)
async function cacheFirstStrategy(request) {
    // Skip caching for non-GET requests
    if (request.method !== 'GET') {
        return fetch(request);
    }

    // Skip caching for chrome-extension and other unsupported schemes
    const url = new URL(request.url);
    if (!url.protocol.startsWith('http')) {
        return fetch(request);
    }

    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        console.log('Serving from cache:', request.url);
        return cachedResponse;
    }

    try {
        const response = await fetch(request);

        // Cache the new resource if it's a successful GET request
        if (response.ok && request.method === 'GET') {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        console.error('Fetch failed:', error);
        throw error;
    }
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-applications') {
        event.waitUntil(syncApplications());
    }
});

async function syncApplications() {
    // Get pending applications from IndexedDB or other storage
    console.log('Background sync: Syncing offline applications');
    // Implementation depends on your offline storage strategy
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Scholarship Portal';
    const options = {
        body: data.body || 'You have a new notification',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        data: data.url
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.notification.data) {
        event.waitUntil(
            clients.openWindow(event.notification.data)
        );
    }
});
