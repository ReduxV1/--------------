// Утилиты и вспомогательные функции
export class Utils {
    constructor() {
        this.init();
    }

    init() {
        this.setupDeviceDetection();
        this.setupTouchHandling();
    }

    setupDeviceDetection() {
        // Определение типа устройства
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isMobile = window.innerWidth <= 768;
        
        document.body.classList.toggle('touch-device', isTouchDevice);
        document.body.classList.toggle('mobile-device', isMobile);
        
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
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
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
            intersectionObserver: 'IntersectionObserver' in window
        };

        return features;
    }
}

// Класс для управления состоянием меню
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
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page.replace('.html', '');
    }

    updateDesktopState(dropdown) {
        this.menuState.desktop.activeDropdown = dropdown;
    }

    updateMobileState(isOpen, dropdown = null) {
        this.menuState.mobile.isOpen = isOpen;
        this.menuState.mobile.activeDropdown = dropdown;
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
}
    