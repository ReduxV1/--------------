// Главный файл для инициализации всех компонентов
import { FullPageSlider } from './slider.js';
import { MobileMenu } from './mobile-menu.js';
import { AnimationManager } from './animations.js';
import { Utils, MenuStateManager } from './utils.js';

class App {
    constructor() {
        this.init();
    }

    init() {
        // Ждем загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents();
            });
        } else {
            this.initializeComponents();
        }

        // Инициализируем компоненты после полной загрузки
        window.addEventListener('load', () => {
            this.setupPostLoadFeatures();
        });
    }

    initializeComponents() {
        // Инициализируем основные компоненты
        this.slider = new FullPageSlider();
        this.mobileMenu = new MobileMenu();
        this.animationManager = new AnimationManager();

        // Делаем мобильное меню доступным глобально
        window.mobileMenu = this.mobileMenu;

        // Настраиваем обработчики событий
        this.setupEventHandlers();

        // Восстанавливаем состояние меню
        setTimeout(() => {
            MenuStateManager.restoreMenuState();
            MenuStateManager.markActiveMenuItem();
        }, 1000);

        // Показываем уведомление при первом посещении
        this.showWelcomeMessage();
    }

    setupEventHandlers() {
        // Оптимизированный обработчик изменения размера окна
        const optimizedResize = Utils.debounce(() => {
            if (this.mobileMenu && this.mobileMenu.isMenuOpen && window.innerWidth > 768) {
                this.mobileMenu.forceClose();
            }
        }, 250);

        window.addEventListener('resize', optimizedResize);

        // Обработчик изменения ориентации устройства
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (this.mobileMenu && this.mobileMenu.isMenuOpen) {
                    this.recalculateDropdownHeights();
                }
            }, 500);
        });

                // Сохранение состояния меню при изменении
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('dropdown-toggle')) {
                setTimeout(() => {
                    MenuStateManager.saveMenuState();
                }, 100);
            }
        });

        // Обработчик клавиатурной навигации
        this.setupKeyboardNavigation();

        // Предотвращение скролла страницы при открытом меню
        this.setupScrollPrevention();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.mobileMenu || !this.mobileMenu.isMenuOpen) return;
            
            const focusableElements = document.querySelectorAll('.sidebar-menu a, .close-menu');
            const focusedIndex = Array.from(focusableElements).indexOf(document.activeElement);
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = (focusedIndex + 1) % focusableElements.length;
                    focusableElements[nextIndex].focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = (focusedIndex - 1 + focusableElements.length) % focusableElements.length;
                    focusableElements[prevIndex].focus();
                    break;
                case 'Enter':
                case ' ':
                    if (document.activeElement.classList.contains('dropdown-toggle')) {
                        e.preventDefault();
                        document.activeElement.click();
                    }
                    break;
            }
        });
    }

    setupScrollPrevention() {
        // Предотвращаем случайное закрытие меню при скролле внутри него
        document.getElementById('sidebarMenu').addEventListener('touchmove', (e) => {
            e.stopPropagation();
        }, { passive: true });

        // Добавляем обработчик для предотвращения скролла страницы при открытом меню
        document.addEventListener('touchmove', (e) => {
            if (this.mobileMenu && this.mobileMenu.isMenuOpen) {
                const isInsideMenu = e.target.closest('.sidebar-menu');
                if (!isInsideMenu) {
                    e.preventDefault();
                }
            }
        }, { passive: false });
    }

    recalculateDropdownHeights() {
        const activeDropdowns = document.querySelectorAll('.sidebar-menu .dropdown.active');
        activeDropdowns.forEach(dropdown => {
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                // Временно сбрасываем высоту
                dropdownMenu.style.maxHeight = 'none';
                const newHeight = dropdownMenu.scrollHeight;
                dropdownMenu.style.maxHeight = '0px';
                
                // Применяем новую высоту с анимацией
                setTimeout(() => {
                    dropdownMenu.style.maxHeight = (newHeight + 20) + 'px';
                }, 50);
            }
        });
    }

    setupPostLoadFeatures() {
        // Предзагрузка ресурсов
        Utils.preloadResources();

        // Обработка ошибок изображений
        Utils.handleImageErrors();

        // Настройка service worker
        Utils.setupServiceWorker();

        // Настройка наблюдателя за изменениями DOM для автоскролла
        this.setupMutationObserver();
    }

    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('dropdown') && target.classList.contains('active')) {
                        setTimeout(() => {
                            const sidebarMenu = document.getElementById('sidebarMenu');
                            const targetRect = target.getBoundingClientRect();
                            const menuRect = sidebarMenu.getBoundingClientRect();
                            
                            if (targetRect.bottom > menuRect.bottom - 100) {
                                Utils.smoothScrollTo(target);
                            }
                        }, 100);
                    }
                }
            });
        });

        // Наблюдаем за изменениями классов у выпадающих меню
        const dropdowns = document.querySelectorAll('.sidebar-menu .dropdown');
        dropdowns.forEach(dropdown => {
            observer.observe(dropdown, { attributes: true });
        });
    }

    showWelcomeMessage() {
        if (!localStorage.getItem('firstVisit')) {
            setTimeout(() => {
                Utils.showNotification('Добро пожаловать! Используйте меню для навигации по сайту.', 'info', 5000);
                localStorage.setItem('firstVisit', 'true');
            }, 2000);
        }
    }
}

// Инициализируем приложение
new App();

