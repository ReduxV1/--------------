// Главный файл для инициализации всех компонентов
import { FullPageSlider } from './slider.js';
import { AnimationManager } from './animations.js';
import { MobileMenu } from './mobile-menu.js';
import { MenuManager } from './menu.js';
import { Utils, MenuStateManager } from './utils.js';

class App {
    constructor() {
        this.components = {};
        this.isSliderPage = document.querySelector('.slider-container') !== null;
        this.init();
    }

    init() {
        console.log('App initialization started');
        
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
            // 1. Инициализируем утилиты первыми
            this.components.utils = new Utils();
            this.components.menuStateManager = new MenuStateManager();
            
            // 2. Инициализируем менеджер меню (только десктопное)
            this.components.menuManager = new MenuManager();
            
            // 3. Инициализируем мобильное меню отдельно
            this.components.mobileMenu = new MobileMenu();
            
            // 4. Инициализируем анимации
            this.components.animationManager = new AnimationManager();
            
            // 5. Инициализируем слайдер только на страницах со слайдером
            if (this.isSliderPage) {
                this.components.slider = new FullPageSlider();
            }
            
            // Добавляем компоненты в глобальную область для отладки
            window.app = this;
            window.mobileMenu = this.components.mobileMenu;
            window.menuManager = this.components.menuManager;
            
            console.log('All components initialized successfully');
            this.setupGlobalErrorHandling();
            
        } catch (error) {
            console.error('Error initializing components:', error);
        }
    }

    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
        });
    }

    // Методы для управления компонентами
    getComponent(name) {
        return this.components[name];
    }

    // Метод для безопасного вызова методов компонентов
    callComponent(componentName, methodName, ...args) {
        const component = this.components[componentName];
        if (component && typeof component[methodName] === 'function') {
            return component[methodName](...args);
        } else {
            console.warn(`Component ${componentName} or method ${methodName} not found`);
        }
    }

    // Метод для проверки состояния приложения
    getStatus() {
        return {
            isSliderPage: this.isSliderPage,
            components: Object.keys(this.components),
            mobileMenuOpen: this.components.mobileMenu?.isMenuOpen || false
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

    // Cleanup при необходимости
    destroy() {
        Object.values(this.components).forEach(component => {
            if (component && typeof component.destroy === 'function') {
                component.destroy();
            }
        });
        this.components = {};
    }
}

// Глобальная инициализация
const app = new App();

// Экспортируем для использования в других модулях
export default app;
