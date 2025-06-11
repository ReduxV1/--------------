// Класс для управления анимациями
export class AnimationManager {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupClickEffects();
        this.setupLoadAnimations();
    }

    setupScrollAnimations() {
        // Проверяем поддержку Intersection Observer
        if (!('IntersectionObserver' in window)) {
            console.warn('Intersection Observer not supported');
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Находим все элементы для анимации
        const animatableElements = document.querySelectorAll(
            '.scroll-animate, .fade-up, .fade-in, .slide-up, .bounce-in'
        );

        animatableElements.forEach(el => {
            observer.observe(el);
        });

        this.observers.set('scroll', observer);
    }

    animateElement(element) {
        if (this.animatedElements.has(element)) return;

        element.classList.add('animated');
        this.animatedElements.add(element);

        // Добавляем задержку для последовательной анимации
        const delay = element.dataset.delay || 0;
        setTimeout(() => {
            element.classList.add('visible');
        }, parseInt(delay));
    }

    setupHoverEffects() {
        // Только для не-touch устройств
        if (!document.body.classList.contains('touch-device')) {
            const hoverElements = document.querySelectorAll('.hover-effect');
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', this.handleHoverIn.bind(this));
                el.addEventListener('mouseleave', this.handleHoverOut.bind(this));
            });
        }
    }

    handleHoverIn(event) {
        const element = event.currentTarget;
        element.classList.add('hovered');
        
        // Создаем ripple эффект
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    handleHoverOut(event) {
        const element = event.currentTarget;
        element.classList.remove('hovered');
    }

    setupClickEffects() {
        // Эффект нажатия для кнопок и ссылок
        const clickableElements = document.querySelectorAll(
            'button, .btn, a[href], .clickable'
        );

        clickableElements.forEach(el => {
            // Избегаем конфликтов с dropdown и мобильным меню
            if (el.closest('.dropdown-toggle') || el.closest('.mobile-menu-toggle')) {
                return;
            }

            el.addEventListener('click', this.handleClickEffect.bind(this));
        });
    }

    handleClickEffect(event) {
        const element = event.currentTarget;
        
        // Создаем волновой эффект
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('click-ripple');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setupLoadAnimations() {
        // Анимации при загрузке страницы
        const loadElements = document.querySelectorAll('.load-animate');
        
        loadElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('loaded');
            }, index * 100);
        });
    }

    // Методы для управления анимациями
    pauseAllAnimations() {
        document.body.classList.add('animations-paused');
    }

    resumeAllAnimations() {
        document.body.classList.remove('animations-paused');
    }

    // Cleanup
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        this.animatedElements.clear();
    }
}
