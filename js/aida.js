// Основной JavaScript для страницы AnyDesk
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initPreloader();
    initScrollAnimations();
    initCounterAnimations();
    initFAQ();
    initScrollToTop();
    initBackToTools();
});

// Прелоадер
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    });
}

// Добавить в начало файла
let scrollObserver = null;

// Изменить функцию initScrollAnimations
function initScrollAnimations() {
    // Отключаем предыдущий observer если он существует
    if (scrollObserver) {
        scrollObserver.disconnect();
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    scrollObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Наблюдаем за всеми элементами с классом scroll-animate
    document.querySelectorAll('.scroll-animate').forEach(el => {
        scrollObserver.observe(el);
    });
}


// Анимация счетчиков в hero секции
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateCounters = () => {
        if (animated) return;
        animated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 16);
        });
    };

    // Запускаем анимацию когда hero секция видна
    const heroObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
}

// FAQ аккордеон
function initFAQ() {
    // Функция для переключения FAQ элементов
    window.toggleFAQ = function(element) {
        const faqItem = element.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Закрываем все открытые FAQ
        document.querySelectorAll('.faq-item.active').forEach(item => {
            item.classList.remove('active');
        });
        
        // Открываем текущий, если он не был активен
        if (!isActive) {
            faqItem.classList.add('active');
        }
    };
}

// Кнопка "Наверх"
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    window.scrollToTop = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
}

// Кнопка возврата к инструментам
function initBackToTools() {
    const backBtn = document.querySelector('.back-to-tools');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            backBtn.classList.add('visible');
        } else {
            backBtn.classList.remove('visible');
        }
    });

    window.goBackToTools = function() {
        window.location.href = 'remote-management.html';
    };
}

// Модальное окно
function openModal(title, content) {
    const modal = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.classList.add('active');
    
    // Блокируем скролл страницы
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('modalOverlay');
    modal.classList.remove('active');
    
    // Разблокируем скролл страницы
    document.body.style.overflow = '';
}

// Закрытие модального окна по клику вне его
document.addEventListener('click', function(e) {
    const modal = document.getElementById('modalOverlay');
    if (e.target === modal) {
        closeModal();
    }
});

// Закрытие модального окна по Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// Обработка форм обратной связи (если есть)
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Простая валидация
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#f44336';
            } else {
                input.style.borderColor = '';
            }
        });
        
        if (isValid) {
            // Здесь можно добавить отправку данных
            alert('Спасибо за ваше сообщение!');
            form.reset();
        }
    });
});

// Ленивая загрузка изображений
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Инициализация ленивой загрузки
initLazyLoading();

/// Переместить в функцию инициализации или обернуть в DOMContentLoaded
function initImageErrorHandling() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            // Можно добавить placeholder изображение
            // this.src = 'path/to/placeholder.jpg';
        });
    });
}

// Добавить в основную функцию инициализации
document.addEventListener('DOMContentLoaded', function() {
    initPreloader();
    initScrollAnimations();
    initCounterAnimations();
    initFAQ();
    initScrollToTop();
    initBackToTools();
    initImageErrorHandling(); // Добавить эту строку
});

// Улучшение производительности скролла
let ticking = false;

function updateOnScroll() {
    // Здесь можно добавить дополнительную логику для скролла
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
});

// Адаптивное меню для мобильных устройств
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const headerMenu = document.querySelector('.header-menu');
    
    if (menuToggle && headerMenu) {
        menuToggle.addEventListener('click', function() {
            headerMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

initMobileMenu();

// Сохранение предпочтений пользователя
function saveUserPreference(key, value) {
    localStorage.setItem(`anydesk-${key}`, JSON.stringify(value));
}

function getUserPreference(key, defaultValue = null) {
    const stored = localStorage.getItem(`anydesk-${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
}

// Отслеживание времени на странице
let startTime = Date.now();

window.addEventListener('beforeunload', function() {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    saveUserPreference('timeSpent', timeSpent);
});

// Простая аналитика взаимодействий
function trackInteraction(action, element) {
    const interactions = getUserPreference('interactions', []);
    interactions.push({
        action: action,
        element: element,
        timestamp: Date.now()
    });
    
    // Сохраняем только последние 100 взаимодействий
    if (interactions.length > 100) {
        interactions.splice(0, interactions.length - 100);
    }
    
    saveUserPreference('interactions', interactions);
}

// Отслеживание кликов по важным элементам
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-primary, .btn-secondary, .feature-card, .pricing-card')) {
        trackInteraction('click', e.target.className);
    }
});

// Печать страницы
function printPage() {
    window.print();
}

// Поделиться страницей
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: window.location.href
        });
    } else {
        // Fallback для браузеров без поддержки Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('Ссылка скопирована в буфер обмена');
        });
    }
}

// Проверка поддержки браузера
function checkBrowserSupport() {
    const features = {
        intersectionObserver: 'IntersectionObserver' in window,
        localStorage: typeof Storage !== 'undefined',
        requestAnimationFrame: 'requestAnimationFrame' in window
    };
    
    const unsupported = Object.keys(features).filter(key => !features[key]);
    
    if (unsupported.length > 0) {
        console.warn('Некоторые функции могут не работать:', unsupported);
    }
}

checkBrowserSupport();

// Обработка изменения размера окна
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Пересчитываем размеры элементов при необходимости
        initScrollAnimations();
    }, 250);
});

// Обработка видимости страницы
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Страница скрыта - можно приостановить анимации
        document.body.classList.add('page-hidden');
    } else {
        // Страница видима - возобновляем анимации
        document.body.classList.remove('page-hidden');
    }
});

// Инициализация завершена
console.log('AnyDesk page initialized successfully');


