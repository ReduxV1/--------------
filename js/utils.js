// Утилиты и вспомогательные функции
export class Utils {
    constructor() {
        this.init();
    }

    init() {
        this.setupDeviceDetection();
        this.setupTouchHandling();
        this.setupDebugInfo();
    }

    setupDeviceDetection() {
        // Более точное определение touch устройств
        const isTouchDevice = (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0 ||
            window.DocumentTouch && document instanceof DocumentTouch
        );
        
        const isMobile = window.innerWidth <= 768;
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        document.body.classList.toggle('touch-device', isTouchDevice);
        document.body.classList.toggle('mobile-device', isMobile);
        document.body.classList.toggle('ios-device', isIOS);
        document.body.classList.toggle('android-device', isAndroid);
        
        console.log('Device detection:', {
            isTouchDevice,
            isMobile,
            isIOS,
            isAndroid,
            userAgent: navigator.userAgent,
            maxTouchPoints: navigator.maxTouchPoints
        });
        
        // Обновляем при изменении размера
        window.addEventListener('resize', () => {
            const newIsMobile = window.innerWidth <= 768;
            document.body.classList.toggle('mobile-device', newIsMobile);
        });
    }

    setupTouchHandling() {
        // Предотвращаем двойное касание для масштабирования
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });

        // Предотвращаем контекстное меню на долгое нажатие
        document.addEventListener('contextmenu', (e) => {
            if (document.body.classList.contains('touch-device')) {
                e.preventDefault();
            }
        });

        // Добавляем класс при первом touch взаимодействии
        let firstTouchHandled = false;
        document.addEventListener('touchstart', () => {
            if (!firstTouchHandled) {
                document.body.classList.add('touch-interacted');
                const sliderContainer = document.querySelector('.slider-container');
                if (sliderContainer) {
                    sliderContainer.classList.add('interacted');
                }
                firstTouchHandled = true;
            }
        }, { once: true, passive: true });
    }

    setupDebugInfo() {
        // Отладочная информация для мобильных устройств
        if (window.location.search.includes('debug=1')) {
            const debugInfo = document.createElement('div');
            debugInfo.id = 'debug-info';
            debugInfo.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px;
                font-size: 12px;
                z-index: 9999;
                border-radius: 5px;
                font-family: monospace;
                max-width: 300px;
                word-wrap: break-word;
            `;
            
            const updateDebugInfo = () => {
                debugInfo.innerHTML = `
                    <strong>Debug Info:</strong><br>
                    Touch Device: ${document.body.classList.contains('touch-device')}<br>
                    Mobile: ${document.body.classList.contains('mobile-device')}<br>
                    iOS: ${document.body.classList.contains('ios-device')}<br>
                    Android: ${document.body.classList.contains('android-device')}<br>
                    Screen: ${window.innerWidth}x${window.innerHeight}<br>
                    Max Touch Points: ${navigator.maxTouchPoints}<br>
                    User Agent: ${navigator.userAgent.substring(0, 50)}...
                `;
            };
            
            document.body.appendChild(debugInfo);
            updateDebugInfo();
            
            window.addEventListener('resize', updateDebugInfo);
        }
    }

    // Утилиты для работы с DOM
    static createElement(tag, className, innerHTML) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Проверка поддержки браузера
    static checkBrowserSupport() {
        const features = {
            flexbox: 'flex' in document.documentElement.style,
            grid: 'grid' in document.documentElement.style,
            es6: typeof Symbol !== 'undefined',
            customProperties: window.CSS && CSS.supports('color', 'var(--test)'),
            intersectionObserver: 'IntersectionObserver' in window,
            touchEvents: 'ontouchstart' in window
        };

        console.log('Browser support:', features);
        return features;
    }

    // Утилита для безопасного вызова функций
    static safeCall(fn, context = null, ...args) {
        try {
            if (typeof fn === 'function') {
                return fn.apply(context, args);
            }
        } catch (error) {
            console.error('Error in safeCall:', error);
        }
    }

    // Утилита для определения направления свайпа
    static getSwipeDirection(startX, startY, endX, endY, threshold = 30) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
            return 'tap';
        }
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            return deltaX > 0 ? 'right' : 'left';
        } else {
            return deltaY > 0 ? 'down' : 'up';
        }
    }
}

export class MenuStateManager {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.menuState = {
            desktop: {
                activeDropdown: null
            },
            mobile: {
                isOpen: false,
                activeDropdown: null
            }
        };
        
        this.setupEventListeners();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page.replace('.html', '');
    }

    setupEventListeners() {
        // Слушаем события от компонентов
        document.addEventListener('menuStateChanged', (e) => {
            console.log('Menu state changed:', e.detail);
        });
        
        document.addEventListener('mobileMenuToggle', (e) => {
            this.updateMobileState(e.detail.isOpen, e.detail.activeDropdown);
        });
    }

    updateDesktopState(dropdown) {
        this.menuState.desktop.activeDropdown = dropdown;
        this.syncState();
    }

    updateMobileState(isOpen, dropdown = null) {
        this.menuState.mobile.isOpen = isOpen;
        this.menuState.mobile.activeDropdown = dropdown;
        this.syncState();
    }

    getState() {
        return { ...this.menuState };
    }

    // Синхронизация состояния между компонентами
    syncState() {
        // Отправляем событие об изменении состояния
        const event = new CustomEvent('menuStateChanged', {
            detail: this.getState()
        });
        document.dispatchEvent(event);
    }

    // Проверка конфликтов между компонентами
    checkConflicts() {
        const { mobile } = this.menuState;
        
        // Если мобильное меню открыто, блокируем другие взаимодействия
        if (mobile.isOpen) {
            document.body.classList.add('mobile-menu-active');
        } else {
            document.body.classList.remove('mobile-menu-active');
        }
    }
}