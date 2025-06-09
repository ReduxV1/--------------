// AeroAdmin JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initPreloader();
    initScrollAnimations();
    initScrollToTop();
    initStatCounters();
    initFAQ();
    initBackToTools();
});

// Прелоадер
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        });
    }
}

// Анимации при скролле
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
}

// Инициализация кнопки "Наверх"
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        // Показ/скрытие кнопки при скролле
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        // Обработчик клика
        scrollToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToTop();
        });
    }
}

// Инициализация кнопки "К списку инструментов"
function initBackToTools() {
    const backToToolsBtn = document.querySelector('.back-to-tools');
    
    if (backToToolsBtn) {
        backToToolsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            goBackToTools();
        });
    }
}

// Функция прокрутки наверх
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Возврат к списку инструментов
function goBackToTools() {
    window.location.href = 'remote-management.html';
}

// Анимация счетчиков статистики
function initStatCounters() {
    const statNumbers = document.querySelectorAll('[data-target]');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseFloat(target.getAttribute('data-target'));
                
                animateCounter(target, 0, finalValue, 2000);
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// Анимация счетчика
function animateCounter(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = start + (range * easeOutCubic);
        
        if (end >= 100) {
            element.textContent = Math.floor(current);
        } else {
            element.textContent = current.toFixed(1);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// FAQ аккордеон
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Закрываем все остальные FAQ
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Открываем текущий, если он не был активен
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// FAQ Toggle функция (для onclick в HTML)
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    faqItem.classList.toggle('active');
}

// Модальное окно
function openModal(title, content) {
    const modal = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (modal && modalTitle && modalBody) {
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('modalOverlay');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Закрытие модального окна по клику вне его
document.addEventListener('click', function(e) {
    const modal = document.getElementById('modalOverlay');
    if (e.target === modal) {
        closeModal();
    }
});

// Закрытие по Escape
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

// Глобальные функции для доступа из HTML
window.scrollToTop = scrollToTop;
window.goBackToTools = goBackToTools;
window.toggleFAQ = toggleFAQ;
window.openModal = openModal;
window.closeModal = closeModal;
