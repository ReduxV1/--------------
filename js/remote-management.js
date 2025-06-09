// Основной класс для страницы удаленного управления
class RemoteManagementPage {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        // Ожидание полной загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Основная инициализация
        this.setupEventListeners();
        this.createParticles();
        this.setupIntersectionObserver();
        this.setupKeyboardNavigation();
        this.setupAccessibility();
        this.initRippleEffect();
        
        // Сохранение настроек пользователя
        this.loadUserPreferences();
        
        this.isInitialized = true;
        console.log('✅ Remote Management Page initialized');
    }

    setupEventListeners() {
        // Обработчики прокрутки с дебаунсингом
        const debouncedScroll = this.debounce(() => {
            this.handleScroll();
            this.updateScrollButton();
        }, 16);
        
        const throttledResize = this.throttle(() => {
            this.handleResize();
        }, 250);

        window.addEventListener('scroll', debouncedScroll, { passive: true });
        window.addEventListener('resize', throttledResize);
        
        // Обработчики для кнопок
        this.setupButtonHandlers();
        
        // Обработка видимости страницы
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        // Сохранение настроек при закрытии
        window.addEventListener('beforeunload', () => {
            this.saveUserPreferences();
        });
    }

    setupButtonHandlers() {
        const toolButtons = document.querySelectorAll('.tool-button');
        const faqButton = document.querySelector('.faq-button');
        
        toolButtons.forEach((button, index) => {
            // Убираем анимацию следования за курсором
            button.addEventListener('mouseenter', (e) => {
                this.handleButtonHover(e.target, 'enter');
            });
            
            button.addEventListener('mouseleave', (e) => {
                this.handleButtonHover(e.target, 'leave');
            });
            
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e.target);
            });
            
            // Добавление описаний
            this.addButtonDescription(button, index);
        });
        
        if (faqButton) {
            faqButton.addEventListener('click', (e) => {
                this.trackUserInteraction('faq_click', 'FAQ Button');
            });
        }
    }

    addButtonDescription(button, index) {
        const descriptions = [
            'Популярное решение для удаленного доступа',
            'Быстрое и надежное подключение',
            'Простой и легкий инструмент',
            'Часто задаваемые вопросы'
        ];
        
        if (descriptions[index]) {
            button.setAttribute('data-description', descriptions[index]);
        }
    }

    handleButtonHover(button, type) {
        if (type === 'enter') {
            button.classList.add('hovered');
            this.trackUserInteraction('button_hover', button.querySelector('span')?.textContent);
            
            // Простая анимация без следования за курсором
            button.style.transform = 'translateY(-8px)';
        } else {
            button.classList.remove('hovered');
            button.style.transform = '';
        }
    }

    handleButtonClick(button) {
        // Эффект ripple
        this.createRipple(button, event);
        
        // Анимация клика
        button.style.transform = 'translateY(-4px) scale(0.98)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Трекинг
        const buttonText = button.querySelector('span')?.textContent;
        this.trackUserInteraction('button_click', buttonText);
        
        // Добавление состояния загрузки
        button.classList.add('loading');
        setTimeout(() => {
            button.classList.remove('loading');
        }, 1000);
    }

    createRipple(button, event) {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('div');
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.classList.add('ripple');
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    initRippleEffect() {
        const style = document.createElement('style');
        style.textContent = `
            .tool-button .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(197, 164, 126, 0.6);
                transform: scale(0);
                animation: rippleEffect 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes rippleEffect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createParticles() {
        // Создание частиц только если устройство не слабое
        if (this.isLowEndDevice()) return;
        
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        
        document.body.appendChild(particlesContainer);
        
        // Создание меньшего количества частиц
        for (let i = 0; i < 30; i++) {
            this.createParticle(particlesContainer);
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(197, 164, 126, 0.6);
            border-radius: 50%;
            pointer-events: none;
        `;
        
        // Случайное позиционирование
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Анимация
        const duration = 3000 + Math.random() * 2000;
        const delay = Math.random() * 2000;
        
        particle.style.animation = `particleFloat ${duration}ms linear ${delay}ms infinite`;
        
        container.appendChild(particle);
        
        // Добавление CSS анимации
        if (!document.querySelector('#particle-styles')) {
            const style = document.createElement('style');
            style.id = 'particle-styles';
            style.textContent = `
                @keyframes particleFloat {
                    0%, 100% { 
                        transform: translateY(0px) rotate(0deg); 
                        opacity: 0; 
                    }
                    50% { 
                        transform: translateY(-20px) rotate(180deg); 
                        opacity: 1; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible', 'loaded');
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Наблюдение за элементами
        const elementsToObserve = document.querySelectorAll('.tool-button, .faq-section, .gold-frame');
        elementsToObserve.forEach(el => observer.observe(el));
    }

    animateElement(element) {
        if (element.classList.contains('tool-button')) {
            element.style.animation = 'fadeInUp 0.6s ease-out forwards';
        } else if (element.classList.contains('gold-frame')) {
            element.style.animation = 'fadeInScale 0.8s ease-out forwards';
        }
    }

    setupKeyboardNavigation() {
        const focusableElements = document.querySelectorAll('.tool-button, .faq-button, .scroll-to-top');
        let currentFocusIndex = -1;
        
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Tab':
                    this.handleTabNavigation(e, focusableElements);
                    break;
                case 'Enter':
                case ' ':
                    if (e.target.classList.contains('tool-button') || e.target.classList.contains('faq-button')) {
                        e.preventDefault();
                        e.target.click();
                    }
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    this.focusNextElement(focusableElements);
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    this.focusPreviousElement(focusableElements);
                    break;
                case 'Home':
                    e.preventDefault();
                    focusableElements[0]?.focus();
                    break;
                case 'End':
                    e.preventDefault();
                    focusableElements[focusableElements.length - 1]?.focus();
                    break;
            }
        });
        
        // Индикатор клавиатурной навигации
        document.addEventListener('keydown', () => {
            document.body.classList.add('keyboard-navigation');
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    handleTabNavigation(e, elements) {
        const currentElement = document.activeElement;
        const currentIndex = Array.from(elements).indexOf(currentElement);
        
        if (e.shiftKey) {
            // Shift + Tab - назад
            if (currentIndex <= 0) {
                e.preventDefault();
                elements[elements.length - 1].focus();
            }
        } else {
            // Tab - вперед
            if (currentIndex === elements.length - 1) {
                e.preventDefault();
                elements[0].focus();
            }
        }
    }

    focusNextElement(elements) {
        const currentIndex = Array.from(elements).indexOf(document.activeElement);
        const nextIndex = (currentIndex + 1) % elements.length;
        elements[nextIndex].focus();
    }

    focusPreviousElement(elements) {
        const currentIndex = Array.from(elements).indexOf(document.activeElement);
        const prevIndex = currentIndex <= 0 ? elements.length - 1 : currentIndex - 1;
        elements[prevIndex].focus();
    }

    setupAccessibility() {
        // ARIA метки
        const toolButtons = document.querySelectorAll('.tool-button');
        toolButtons.forEach((button, index) => {
            const text = button.querySelector('span')?.textContent;
            button.setAttribute('role', 'button');
            button.setAttribute('aria-label', `Перейти к разделу ${text}`);
            button.setAttribute('tabindex', '0');
        });
        
        const faqButton = document.querySelector('.faq-button');
        if (faqButton) {
            faqButton.setAttribute('role', 'button');
            faqButton.setAttribute('aria-label', 'Открыть раздел часто задаваемых вопросов');
            faqButton.setAttribute('tabindex', '0');
        }
        
        // Skip link
        this.createSkipLink();
    }

    createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Перейти к основному содержимому';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #c5a47e;
            color: #000;
            padding: 8px;
            text-decoration: none;
            z-index: 1000;
            border-radius: 4px;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Добавление ID к основному контенту
        const mainContent = document.querySelector('.gold-frame');
        if (mainContent) {
            mainContent.id = 'main-content';
            mainContent.setAttribute('tabindex', '-1');
        }
    }

    handleScroll() {
        const scrollY = window.pageYOffset;
        
        // Параллакс для фона
        const overlay = document.querySelector('.overlay');
        if (overlay) {
            overlay.style.transform = `translateY(${scrollY * 0.1}px)`;
        }
        
        // Анимация появления элементов при прокрутке
        this.checkElementsInView();
    }

    checkElementsInView() {
        const elements = document.querySelectorAll('.tool-button:not(.visible)');
        elements.forEach(element => {
            if (this.isElementInView(element)) {
                element.classList.add('visible');
                this.animateElement(element);
            }
        });
    }

    isElementInView(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top <= windowHeight * 0.8 && rect.bottom >= windowHeight * 0.2;
    }

    updateScrollButton() {
        const scrollButton = document.querySelector('.scroll-to-top');
        if (!scrollButton) return;
        
        const scrollY = window.pageYOffset;
        const threshold = 300;
        
        if (scrollY > threshold) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    }

    handleResize() {
        // Обновление частиц при изменении размера
        if (window.innerWidth <= 768) {
            this.optimizeForMobile();
        }
        
        // Пересчет позиций элементов
        this.recalculateLayout();
    }

    optimizeForMobile() {
        // Удаление части частиц на мобильных
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index > 15) {
                particle.remove();
            }
        });
        
        // Упрощение анимаций
        document.body.classList.add('mobile-optimized');
    }

    recalculateLayout() {
        // Пересчет размеров и позиций для адаптивности
        const toolButtons = document.querySelectorAll('.tool-button');
        toolButtons.forEach(button => {
            // Сброс трансформаций для корректного пересчета
            button.style.transform = '';
        });
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Приостановка анимаций при скрытии страницы
            this.pauseAnimations();
        } else {
            // Возобновление анимаций
            this.resumeAnimations();
        }
    }

    pauseAnimations() {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.animationPlayState = 'paused';
        });
    }

    resumeAnimations() {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.animationPlayState = 'running';
        });
    }

    trackUserInteraction(action, label) {
        // Аналитика взаимодействий пользователя
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'remote_management',
                event_label: label,
                value: 1
            });
        }
        
        // Локальная аналитика
        const interaction = {
            action,
            label,
            timestamp: Date.now(),
            page: 'remote-management'
        };
        
        this.saveInteraction(interaction);
    }

    saveInteraction(interaction) {
        const interactions = JSON.parse(localStorage.getItem('user_interactions') || '[]');
                interactions.push(interaction);
        
        // Сохраняем только последние 100 взаимодействий
        if (interactions.length > 100) {
            interactions.splice(0, interactions.length - 100);
        }
        
        localStorage.setItem('user_interactions', JSON.stringify(interactions));
    }

    loadUserPreferences() {
        // Загрузка пользовательских настроек
        const preferences = JSON.parse(localStorage.getItem('user_preferences') || '{}');
        
        // Применение настроек темы
        if (preferences.theme) {
            document.body.setAttribute('data-theme', preferences.theme);
        }
        
        // Применение настроек анимаций
        if (preferences.reducedMotion) {
            document.body.classList.add('reduced-motion');
        }
        
        // Применение настроек звука
        if (preferences.soundEnabled !== undefined) {
            this.soundEnabled = preferences.soundEnabled;
        }
    }

    saveUserPreferences() {
        const preferences = {
            theme: document.body.getAttribute('data-theme') || 'auto',
            reducedMotion: document.body.classList.contains('reduced-motion'),
            soundEnabled: this.soundEnabled || false,
            lastVisit: Date.now()
        };
        
        localStorage.setItem('user_preferences', JSON.stringify(preferences));
    }

    isLowEndDevice() {
        // Определение слабых устройств для оптимизации
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return true;
        if (navigator.deviceMemory && navigator.deviceMemory < 4) return true;
        if (window.innerWidth < 768) return true;
        
        // Проверка через User Agent (мобильные устройства)
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = ['android', 'iphone', 'ipad', 'mobile', 'tablet'];
        return mobileKeywords.some(keyword => userAgent.includes(keyword));
    }

    // Утилиты
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
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

    // Публичные методы
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        this.trackUserInteraction('scroll_to_top', 'Scroll Button');
    }

    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme') || 'auto';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        this.trackUserInteraction('theme_toggle', newTheme);
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.trackUserInteraction('sound_toggle', this.soundEnabled ? 'enabled' : 'disabled');
    }

    // Cleanup при уничтожении
    destroy() {
        // Удаление обработчиков событий
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Очистка созданных элементов
        const particlesContainer = document.querySelector('.particles-container');
        if (particlesContainer) {
            particlesContainer.remove();
        }
        
        // Сохранение настроек
        this.saveUserPreferences();
        
        console.log('🗑️ Remote Management Page destroyed');
    }
}

// Класс для управления глобальными функциями
class GlobalUtilities {
    static scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    static createToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#c5a47e'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(toast);
        
        // Анимация появления
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Автоматическое скрытие
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
        
        return toast;
    }

    static copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text).then(() => {
                this.createToast('Скопировано в буфер обмена', 'success');
                return true;
            }).catch(() => {
                this.fallbackCopyTextToClipboard(text);
                return false;
            });
        } else {
            this.fallbackCopyTextToClipboard(text);
        }
    }

    static fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.createToast('Скопировано в буфер обмена', 'success');
        } catch (err) {
            this.createToast('Ошибка копирования', 'error');
        }
        
        document.body.removeChild(textArea);
    }

    static formatDate(date, locale = 'ru-RU') {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }

    static generateId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    static sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validateURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    static getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            screenWidth: screen.width,
            screenHeight: screen.height,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            colorDepth: screen.colorDepth,
            pixelRatio: window.devicePixelRatio || 1,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    static getPerformanceMetrics() {
        if (!performance) return null;
        
        return {
            navigationStart: performance.timing?.navigationStart,
            loadEventEnd: performance.timing?.loadEventEnd,
            domContentLoaded: performance.timing?.domContentLoadedEventEnd,
            firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
            firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime,
            memory: performance.memory ? {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            } : null
        };
    }
}

// Основная инициализация
let remoteManagementApp;

document.addEventListener('DOMContentLoaded', () => {
    // Создание экземпляра приложения
    remoteManagementApp = new RemoteManagementPage();
    
    // Инициализация кнопки "Наверх"
    initScrollToTopButton();
    
    // Глобальные обработчики
    setupGlobalEventHandlers();
    
    // Экспорт для глобального использования
    window.remoteManagementApp = remoteManagementApp;
    window.GlobalUtilities = GlobalUtilities;
    window.scrollToTop = GlobalUtilities.scrollToTop;
    
    // Логирование успешной инициализации
    console.log('🚀 Remote Management Page fully loaded');
    console.log('📊 Performance:', GlobalUtilities.getPerformanceMetrics());
    console.log('📱 Device Info:', GlobalUtilities.getDeviceInfo());
    
    // Показ приветственного сообщения (опционально)
    if (sessionStorage.getItem('welcome_shown') !== 'true') {
        setTimeout(() => {
            GlobalUtilities.createToast('Добро пожаловать! Выберите инструмент для удаленного управления', 'info', 4000);
            sessionStorage.setItem('welcome_shown', 'true');
        }, 1000);
    }
});

function initScrollToTopButton() {
    let scrollButton = document.querySelector('.scroll-to-top');
    
    if (!scrollButton) {
        scrollButton = document.createElement('button');
        scrollButton.className = 'scroll-to-top';
        scrollButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        scrollButton.setAttribute('aria-label', 'Прокрутить к началу страницы');
        scrollButton.setAttribute('title', 'Наверх');
        document.body.appendChild(scrollButton);
    }
    
    scrollButton.addEventListener('click', () => {
        if (remoteManagementApp) {
            remoteManagementApp.scrollToTop();
        } else {
            GlobalUtilities.scrollToTop();
        }
    });
}

function setupGlobalEventHandlers() {
    // Обработка ошибок JavaScript
    window.addEventListener('error', (event) => {
        console.error('JavaScript Error:', event.error);
        
        // Отправка в аналитику (если нужно)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: event.error?.message || 'Unknown error',
                fatal: false
            });
        }
    });
    
    // Обработка отклоненных промисов
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled Promise Rejection:', event.reason);
        
        // Предотвращение показа ошибки в консоли
        event.preventDefault();
    });
    
    // Обработка изменения соединения
    if ('connection' in navigator) {
        navigator.connection.addEventListener('change', () => {
            const connection = navigator.connection;
            console.log(`Connection changed: ${connection.effectiveType}, ${connection.downlink}Mbps`);
            
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                document.body.classList.add('slow-connection');
                GlobalUtilities.createToast('Обнаружено медленное соединение. Некоторые эффекты отключены.', 'info');
            } else {
                document.body.classList.remove('slow-connection');
            }
        });
    }
    
    // Обработка изменения онлайн/оффлайн статуса
    window.addEventListener('online', () => {
        GlobalUtilities.createToast('Соединение восстановлено', 'success');
        document.body.classList.remove('offline');
    });
    
    window.addEventListener('offline', () => {
        GlobalUtilities.createToast('Отсутствует интернет-соединение', 'error');
        document.body.classList.add('offline');
    });
    
    // Горячие клавиши
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K для поиска (если будет добавлен)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            console.log('Search hotkey pressed');
        }
        
        // Escape для закрытия модальных окон
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.active, .toast');
            modals.forEach(modal => {
                if (modal.classList.contains('toast')) {
                    modal.remove();
                } else {
                    modal.classList.remove('active');
                }
            });
        }
    });
}

// Очистка при закрытии страницы
window.addEventListener('beforeunload', () => {
    if (remoteManagementApp && typeof remoteManagementApp.destroy === 'function') {
        remoteManagementApp.destroy();
    }
});

// Экспорт модулей для ES6 (если используется)
export { RemoteManagementPage, GlobalUtilities };

// Fallback для старых браузеров
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RemoteManagementPage,
        GlobalUtilities
    };
}

// Дополнительные утилиты для отладки (только в development режиме)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.DEBUG = {
        logInteractions: () => {
            const interactions = JSON.parse(localStorage.getItem('user_interactions') || '[]');
            console.table(interactions.slice(-20)); // Последние 20 взаимодействий
        },
        
        clearData: () => {
            localStorage.removeItem('user_interactions');
            localStorage.removeItem('user_preferences');
            console.log('✅ User data cleared');
        },
        
        simulateSlowConnection: () => {
            document.body.classList.add('slow-connection');
            console.log('🐌 Slow connection mode enabled');
        },
        
        toggleDebugMode: () => {
            document.body.classList.toggle('debug-mode');
            console.log('🔍 Debug mode toggled');
        },
        
        getAppState: () => {
            return {
                initialized: remoteManagementApp?.isInitialized,
                deviceInfo: GlobalUtilities.getDeviceInfo(),
                performance: GlobalUtilities.getPerformanceMetrics(),
                preferences: JSON.parse(localStorage.getItem('user_preferences') || '{}'),
                interactions: JSON.parse(localStorage.getItem('user_interactions') || '[]').length
            };
        }
    };
    
    console.log('🔧 Debug utilities available in window.DEBUG');
}

