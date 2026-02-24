// Service Worker Registration
// This file handles the registration and lifecycle of the service worker

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        registerServiceWorker();
    });
}

async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
            scope: '/'
        });

        console.log('✅ Service Worker registered successfully:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('📥 Service Worker update found');

            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New service worker available, notify user
                    showUpdateNotification();
                }
            });
        });

        // Check for updates every hour
        setInterval(() => {
            registration.update();
        }, 60 * 60 * 1000);

    } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
    }
}

function showUpdateNotification() {
    // Show a notification to the user that an update is available
    const updateBanner = document.createElement('div');
    updateBanner.id = 'pwa-update-banner';
    updateBanner.innerHTML = `
    <style>
      #pwa-update-banner {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #1e40af;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 16px;
        font-family: system-ui, -apple-system, sans-serif;
        animation: slideUp 0.3s ease-out;
      }
      
      @keyframes slideUp {
        from {
          transform: translate(-50%, 100px);
          opacity: 0;
        }
        to {
          transform: translateX(-50%);
          opacity: 1;
        }
      }
      
      #pwa-update-banner button {
        background: white;
        color: #1e40af;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s;
      }
      
      #pwa-update-banner button:hover {
        opacity: 0.9;
      }
    </style>
    <span>🎉 A new version is available!</span>
    <button onclick="window.location.reload()">Update Now</button>
    <button onclick="this.parentElement.remove()" style="background: transparent; color: white;">Later</button>
  `;

    document.body.appendChild(updateBanner);
}

// Handle offline/online events
window.addEventListener('online', () => {
    console.log('🌐 Back online');
    showConnectionStatus('You are back online!', 'success');
});

window.addEventListener('offline', () => {
    console.log('📡 Offline mode');
    showConnectionStatus('You are offline. Some features may be limited.', 'warning');
});

function showConnectionStatus(message, type) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : '#f59e0b'};
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    z-index: 10000;
    font-family: system-ui;
    animation: slideIn 0.3s ease-out;
  `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Request notification permission (for future features)
export async function requestNotificationPermission() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
        return permission === 'granted';
    }
    return false;
}

// Install prompt handler
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show custom install button
    showInstallButton();
});

function showInstallButton() {
    const installButton = document.createElement('button');
    installButton.id = 'pwa-install-button';
    installButton.innerHTML = `
    <style>
      #pwa-install-button {
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: #1e40af;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(30, 64, 175, 0.4);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s;
        animation: pulse 2s infinite;
      }
      
      #pwa-install-button:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(30, 64, 175, 0.5);
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }
    </style>
    📱 Install App
  `;

    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            deferredPrompt = null;
            installButton.remove();
        }
    });

    document.body.appendChild(installButton);
}

// Track successful installation
window.addEventListener('appinstalled', () => {
    console.log('✅ PWA was installed successfully');
    deferredPrompt = null;

    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
        installButton.remove();
    }
});
