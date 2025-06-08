// Класс для управления анимациями и интерактивностью страницы автора
class AuthorPageController {
    constructor() {
        this.init();
    }

    init() {
        this.hidePreloader();
        this.initScrollAnimations();
        this.initProgressBars();
        this.initContactForm();
        this.initRippleEffect();
        this.initTypewriterEffect();
        this.initParallaxEffect();
        this.initKeyboardShortcuts();
        this.initPerformanceOptimizations();
        this.initErrorHandling();
    }

    // Скрытие прелоадера
    hidePreloader() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const preloader = document.getElementById('preloader');
                if (preloader) {
                    preloader.classList.add('hidden');
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 500);
                }
            }, 1000);
        });
    }

    // Анимации при скролле
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Наблюдаем за элементами с классом scroll-animate
        document.querySelectorAll('.scroll-animate').forEach(el => {
            observer.observe(el);
        });
    }

    // Анимация прогресс-баров
    initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.getAttribute('data-width');
                    
                    setTimeout(() => {
                        progressBar.style.width = width + '%';
                    }, 300);
                    
                    progressObserver.unobserve(progressBar);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });
    }

    // Обработка формы обратной связи
    initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Получаем данные формы
            const inputs = form.querySelectorAll('.form-input');
            const data = {};
            const fieldNames = ['name', 'email', 'subject', 'message'];
            
            // Валидация всех полей
            let isValid = true;
            inputs.forEach((input, index) => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
                data[fieldNames[index]] = input.value;
            });

            if (isValid) {
                // Показываем уведомление об отправке
                this.showNotification('Сообщение отправлено!', 'success');
                
                // Очищаем форму
                form.reset();
                
                // В реальном проекте здесь был бы AJAX запрос на сервер
                console.log('Данные формы:', data);
            } else {
                this.showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
            }
        });

        // Валидация полей в реальном времени
        const inputs = form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    // Валидация поля
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Удаляем предыдущие ошибки
        this.clearFieldError(field);

        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Введите корректный email адрес';
            }
        }

        if (field.required && !value) {
            isValid = false;
            errorMessage = 'Это поле обязательно для заполнения';
        }

        if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Сообщение должно содержать минимум 10 символов';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    // Показать ошибку поля
    showFieldError(field, message) {
        field.classList.add('error');
        
        // Создаем элемент с ошибкой
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }

    // Очистить ошибку поля
    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Эффект волны для кнопок
    initRippleEffect() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                `;
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Эффект печатной машинки для имени
    initTypewriterEffect() {
        const nameElement = document.querySelector('.profile-name');
        if (!nameElement) return;

        const text = nameElement.textContent;
        nameElement.textContent = '';
        nameElement.classList.add('typewriter-effect');
        
        let index = 0;
        const typeSpeed = 100;
        
        setTimeout(() => {
            const typeWriter = () => {
                if (index < text.length) {
                    nameElement.textContent += text.charAt(index);
                    index++;
                    setTimeout(typeWriter, typeSpeed);
                } else {
                    // Убираем курсор после завершения печати
                    setTimeout(() => {
                        nameElement.classList.remove('typewriter-effect');
                    }, 1000);
                }
            };
            typeWriter();
        }, 1200); // Задержка перед началом печати
    }

    // Параллакс эффект
    initParallaxEffect() {
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.profile-image');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    // Обработка клавиатурных сокращений
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + Enter для отправки формы
            if (e.ctrlKey && e.key === 'Enter') {
                const form = document.getElementById('contactForm');
                if (form && document.activeElement.closest('#contactForm')) {
                    form.dispatchEvent(new Event('submit'));
                }
            }

            // Escape для закрытия уведомлений
            if (e.key === 'Escape') {
                const notifications = document.querySelectorAll('.notification');
                notifications.forEach(notification => {
                    notification.style.animation = 'slideOutRight 0.3s ease';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 300);
                });
            }
        });
    }

    // Оптимизация производительности
    initPerformanceOptimizations() {
        // Ленивая загрузка изображений
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Отслеживание времени на странице
        this.startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
            console.log(`Время на странице: ${timeSpent} секунд`);
        });
    }

    // Обработка ошибок
    initErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Ошибка на странице:', e.error);
            this.showNotification('Произошла ошибка. Пожалуйста, обновите страницу.', 'error');
        });

        // Обработка ошибок промисов
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Необработанная ошибка промиса:', e.reason);
        });
    }

    // Показать уведомление
    showNotification(message, type = 'info') {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Стили для уведомления
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            max-width: 300px;
            word-wrap: break-word;
        `;

        // Цвета в зависимости от типа
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        
        // Добавляем в DOM
        document.body.appendChild(notification);
        
        // Автоматическое удаление
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Дополнительные утилиты
class AuthorPageUtils {
    // Плавная прокрутка для якорных ссылок
    static initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Добавление дополнительных CSS анимаций
    static addAdditionalStyles() {
        const additionalStyles = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutRight {
                            from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            .form-input.error {
                border-color: #ff6b6b !important;
                box-shadow: 0 0 10px rgba(255, 107, 107, 0.3) !important;
            }

            .contact-item {
                cursor: pointer;
            }

            .skill-category {
                position: relative;
                overflow: hidden;
            }

            .profile-image {
                filter: grayscale(20%);
                transition: all 0.3s ease;
            }

            .profile-image:hover {
                filter: grayscale(0%);
            }

            /* Дополнительные эффекты для мобильных устройств */
            @media (max-width: 768px) {
                .contact-item:hover {
                    transform: none;
                }
                
                .skill-category:hover {
                    transform: none;
                }
                
                .profile-image:hover {
                    transform: scale(1);
                }
            }
        `;

        // Добавляем дополнительные стили
        const styleSheet = document.createElement('style');
        styleSheet.textContent = additionalStyles;
        document.head.appendChild(styleSheet);
    }

    // Обработка контактных элементов
    static initContactInteractions() {
        const contactItems = document.querySelectorAll('.contact-item');
        
        contactItems.forEach(item => {
            item.addEventListener('click', () => {
                const link = item.querySelector('a');
                if (link) {
                    // Добавляем небольшую анимацию при клике
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.transform = '';
                    }, 150);
                }
            });
        });
    }

    // Инициализация всех утилит
    static init() {
        this.initSmoothScroll();
        this.addAdditionalStyles();
        this.initContactInteractions();
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    new AuthorPageController();
    AuthorPageUtils.init();
});

// Экспорт для использования в других модулях
export { AuthorPageController, AuthorPageUtils };

