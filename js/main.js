// Обновленный main.js с улучшенной инициализацией
import { FullPageSlider } from './slider.js';
import { AnimationManager } from './animations.js';
import { MobileMenu } from './mobile-menu.js';
import { MenuManager } from './menu.js';
import { Utils, MenuStateManager } from './utils.js';

class App {
    constructor() {
        this.components = {};
        this.isSliderPage = document.querySelector('.slider-container') !== null;
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        console.log('App starting...', {
            isSliderPage: this.isSliderPage,
            isTouchDevice: this.isTouchDevice,
            userAgent: navigator.userAgent
        });
        
        this.init();
    }

    init() {
        // Проверяем готовность DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents();
            });
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            console.log('Initializing components...');
            
            // 1. Инициализируем утилиты первыми
            this.components.utils = new Utils();
            this.components.menuStateManager = new MenuStateManager();
            
            // 2. Небольшая задержка для корректной инициализации touch detection
            setTimeout(() => {
                this.initializeMenus();
                this.initializeOtherComponents();
            }, 100);
            
        } catch (error) {
            console.error('Error initializing components:', error);
            this.handleInitializationError(error);
        }
    }

    initializeMenus() {
        try {
            // 3. Инициализируем менеджер меню (только десктопное)
            if (!this.isTouchDevice) {
                this.components.menuManager = new MenuManager();
            }
            
            // 4. Инициализируем мобильное меню
            this.components.mobileMenu = new MobileMenu();
            
            console.log('Menus initialized successfully');
        } catch (error) {
            console.error('Error initializing menus:', error);
        }
    }

    initializeOtherComponents() {
        try {
            // 5. Инициализируем анимации
            this.components.animationManager = new AnimationManager();
            
            // 6. Инициализируем слайдер только на страницах со слайдером
            if (this.isSliderPage) {
                this.components.slider = new FullPageSlider();
                console.log('Slider initialized');
            }
            
            // Добавляем компоненты в глобальную область для отладки
            window.app = this;
            window.mobileMenu = this.components.mobileMenu;
            if (this.components.menuManager) {
                window.menuManager = this.components.menuManager;
            }
            if (this.components.slider) {
                window.slider = this.components.slider;
            }
            
            console.log('All components initialized successfully');
            this.setupGlobalErrorHandling();
            this.setupAppEventListeners();
            
        } catch (error) {
            console.error('Error initializing other components:', error);
        }
    }

    handleInitializationError(error) {
        // Показываем пользователю уведомление об ошибке
        const errorElement = document.createElement('div');
        errorElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            max-width: 300px;
        `;
        errorElement.innerHTML = `
            <strong>Ошибка инициализации:</strong><br>
            Некоторые функции могут работать неправильно.<br>
            <small>Обновите страницу или обратитесь к администратору.</small>
        `;
        
        document.body.appendChild(errorElement);
        
        // Автоматически скрываем через 10 секунд
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.parentNode.removeChild(errorElement);
            }
        }, 10000);
    }

    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.logError('Global Error', event.error);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.logError('Unhandled Promise', event.reason);
        });
    }

    setupAppEventListeners() {
        // Слушаем события изменения ориентации устройства
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });

        // Слушаем события visibility API
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Слушаем события touch для мобильных устройств
        if (this.isTouchDevice) {
            this.setupMobileTouchHandling();
        }
    }

    setupMobileTouchHandling() {
        let touchMoved = false;
        
        document.addEventListener('touchstart', () => {
            touchMoved = false;
        }, { passive: true });
        
        document.addEventListener('touchmove', () => {
            touchMoved = true;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            // Если это был простой tap без движения
            if (!touchMoved) {
                // Добавляем класс для CSS стилизации
                const target = e.target;
                target.classList.add('touch-tapped');
                setTimeout(() => {
                    target.classList.remove('touch-tapped');
                }, 150);
            }
        }, { passive: true });
    }

    handleOrientationChange() {
        console.log('Orientation changed');
        
        // Закрываем мобильное меню при повороте экрана
        if (this.components.mobileMenu && this.components.mobileMenu.isMenuOpen) {
            this.components.mobileMenu.forceClose();
        }
        
        // Пересчитываем размеры для слайдера
        if (this.components.slider) {
            this.components.slider.updateSlidesPosition();
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Страница скрыта - паузим анимации
            if (this.components.animationManager) {
                this.components.animationManager.pauseAllAnimations();
            }
        } else {
            // Страница видима - возобновляем анимации
            if (this.components.animationManager) {
                this.components.animationManager.resumeAllAnimations();
            }
        }
    }

    logError(type, error) {
        // Логирование ошибок для дебаггинга
        const errorInfo = {
            type,
            error: error.toString(),
            stack: error.stack,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString()
        };
        
        console.log('Error logged:', errorInfo);
        
        // Здесь можно отправить ошибку на сервер для мониторинга
        // this.sendErrorToServer(errorInfo);
    }

    // Методы для управления компонентами
    getComponent(name) {
        return this.components[name];
    }

    callComponent(componentName, methodName, ...args) {
        const component = this.components[componentName];
        if (component && typeof component[methodName] === 'function') {
            try {
                return component[methodName](...args);
            } catch (error) {
                console.error(`Error calling ${componentName}.${methodName}:`, error);
            }
        } else {
            console.warn(`Component ${componentName} or method ${methodName} not found`);
        }
    }

    getStatus() {
        return {
            isSliderPage: this.isSliderPage,
            isTouchDevice: this.isTouchDevice,
            components: Object.keys(this.components),
            mobileMenuOpen: this.components.mobileMenu?.isMenuOpen || false,
            currentSlide: this.components.slider?.getCurrentSlide() || 0
        };
    }

    // Методы для управления состоянием страницы
    enableScrolling() {
        if (!this.isSliderPage) {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    }

    disableScrolling() {
        if (!this.isSliderPage) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        }
    }

    // Методы для отладки
    enableDebugMode() {
        document.body.classList.add('debug-mode');
        
        // Добавляем визуальные индикаторы для touch областей
        if (this.isTouchDevice) {
            const style = document.createElement('style');
            style.innerHTML = `
                .debug-mode .mobile-menu-toggle,
                .debug-mode .sidebar-menu a,
                .debug-mode .sidebar-menu .dropdown-toggle {
                    border: 2px dashed #c5a47e !important;
                    box-sizing: border-box !important;
                }
                
                .debug-mode .touch-tapped {
                    background: rgba(197, 164, 126, 0.3) !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        console.log('Debug mode enabled');
    }

    disableDebugMode() {
        document.body.classList.remove('debug-mode');
        console.log('Debug mode disabled');
    }

    // Методы для мониторинга производительности
    startPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 100) { // Логируем только долгие операции
                        console.warn('Long task detected:', entry);
                    }
                }
            });
            
            observer.observe({ entryTypes: ['longtask'] });
            this.performanceObserver = observer;
        }
    }

    stopPerformanceMonitoring() {
        if (this.performanceObserver) {
            this.performanceObserver.disconnect();
            this.performanceObserver = null;
        }
    }

    // Cleanup при необходимости
    destroy() {
        console.log('Destroying app...');
        
        // Останавливаем мониторинг производительности
        this.stopPerformanceMonitoring();
        
        // Очищаем компоненты
        Object.values(this.components).forEach(component => {
            if (component && typeof component.destroy === 'function') {
                try {
                    component.destroy();
                } catch (error) {
                    console.error('Error destroying component:', error);
                }
            }
        });
        
        this.components = {};
        
        // Очищаем глобальные ссылки
        delete window.app;
        delete window.mobileMenu;
        delete window.menuManager;
        delete window.slider;
        
        console.log('App destroyed');
    }

    // Методы для работы с localStorage
    saveState() {
        try {
            const state = {
                currentPage: this.components.menuStateManager?.getCurrentPage(),
                timestamp: Date.now()
            };
            localStorage.setItem('app-state', JSON.stringify(state));
        } catch (error) {
            console.warn('Could not save state to localStorage:', error);
        }
    }

    loadState() {
        try {
            const stateString = localStorage.getItem('app-state');
            if (stateString) {
                const state = JSON.parse(stateString);
                console.log('Loaded state:', state);
                return state;
            }
        } catch (error) {
            console.warn('Could not load state from localStorage:', error);
        }
        return null;
    }

    // Методы для аналитики (заглушки)
    trackEvent(eventName, properties = {}) {
        console.log('Event tracked:', eventName, properties);
        // Здесь можно добавить интеграцию с Google Analytics, Yandex.Metrica и т.д.
    }

    trackPageView(pageName) {
        console.log('Page view tracked:', pageName);
        // Аналогично для отслеживания просмотров страниц
    }
}

// Глобальная инициализация с дополнительными проверками
const initializeApp = () => {
    try {
        // Проверяем поддержку необходимых API
        const requiredFeatures = ['addEventListener', 'querySelector', 'classList'];
        const missingFeatures = requiredFeatures.filter(feature => 
            !(feature in document) && !(feature in Element.prototype)
        );
        
        if (missingFeatures.length > 0) {
            console.error('Missing required browser features:', missingFeatures);
            // Показываем сообщение о необходимости обновления браузера
            showBrowserUpdateMessage();
            return;
        }
        
        // Создаем экземпляр приложения
        const app = new App();
        
        // Включаем debug режим при наличии параметра в URL
        if (window.location.search.includes('debug=1')) {
            app.enableDebugMode();
            app.startPerformanceMonitoring();
        }
        
        // Автосохранение состояния при уходе со страницы
        window.addEventListener('beforeunload', () => {
            app.saveState();
        });
        
        console.log('App initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showErrorMessage('Ошибка инициализации приложения. Пожалуйста, обновите страницу.');
    }
};

// Функция для показа сообщения об обновлении браузера
const showBrowserUpdateMessage = () => {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: #ff4444;
        color: white;
        padding: 15px;
        text-align: center;
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;
    message.innerHTML = `
        <strong>Ваш браузер устарел!</strong> 
        Для корректной работы сайта обновите браузер до последней версии.
    `;
    document.body.appendChild(message);
};

// Функция для показа общих ошибок
const showErrorMessage = (text) => {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        max-width: 350px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    message.innerHTML = `
        <div style="margin-bottom: 10px;">${text}</div>
        <button onclick="this.parentNode.remove()" style="
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
        ">Закрыть</button>
    `;
    document.body.appendChild(message);
    
    // Автоматически скрываем через 10 секунд
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 10000);
};

// Запускаем инициализацию
initializeApp();

// Экспортируем для использования в других модулях
export default null; // App создается внутри функции initializeApp
