// Основной скрипт для слайдера TeamViewer
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Инициализация слайдера
function initSlider() {
    // Создание навигационных точек
    const slideNav = document.querySelector('.slide-nav');
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'nav-dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        slideNav.appendChild(dot);
    }
    
    // Показать первый слайд
    showSlide(0);
    
    // Автоматическое переключение слайдов
    setInterval(nextSlide, 10000); // 10 секунд
}

// Показать конкретный слайд
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'flex' : 'none';
        slide.setAttribute('aria-hidden', i !== index);
    });
    
    // Обновить навигацию
    const dots = document.querySelectorAll('.nav-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    currentSlide = index;
}

// Переход к следующему слайду
function nextSlide() {
    const nextIndex = (currentSlide + 1) % totalSlides;
    showSlide(nextIndex);
}

// Переход к предыдущему слайду
function prevSlide() {
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(prevIndex);
}

// Переход к конкретному слайду
function goToSlide(index) {
    showSlide(index);
}

// Управление с клавиатуры
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// Функция плавной прокрутки наверх
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// CSS для слайдера (если нужно добавить динамически)
const sliderStyles = `
    .slide-nav {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
        z-index: 1000;
    }
    
    .nav-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .nav-dot.active {
        background: #c5a47e;
        transform: scale(1.2);
    }
    
    .nav-dot:hover {
        background: rgba(197, 164, 126, 0.8);
    }
`;

// Добавляем стили, если их нет
if (!document.querySelector('#slider-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'slider-styles';
    styleSheet.textContent = sliderStyles;
    document.head.appendChild(styleSheet);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initSlider);

// Функция скрытия прелоадера
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1500);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Скрыть прелоадер
    hidePreloader();
    
    // Инициализация анимаций прокрутки
    initScrollAnimations();
    
    // Инициализация счетчиков статистики  
    initCounters();
    
    // Инициализация FAQ
    initFAQ();
    
    // Обработчик закрытия модального окна по клику вне его
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
    
    // Обработчик клавиши Escape для закрытия модального окна
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('modalOverlay');
            if (modal && modal.classList.contains('active')) {
                closeModal();
            }
        }
    });
    
    // Показать кнопку "Наверх" при прокрутке
    window.addEventListener('scroll', function() {
        const scrollButton = document.getElementById('scrollToTop');
        if (scrollButton) {
            if (window.pageYOffset > 300) {
                scrollButton.classList.add('visible');
            } else {
                scrollButton.classList.remove('visible');
            }
        }
    });
});

// Инициализация анимаций при прокрутке
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.scroll-animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

// Инициализация счетчиков
function initCounters() {
    const counters = document.querySelectorAll('[data-target]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// Анимация счетчика
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (target >= 1000) {
            element.textContent = (current / 1000).toFixed(1) + 'K';
        } else if (target >= 1) {
            element.textContent = Math.floor(current);
        } else {
            element.textContent = current.toFixed(1);
        }
    }, stepTime);
}

// Инициализация FAQ
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Закрыть все FAQ
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Открыть текущий, если он не был активен
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// Функция переключения FAQ
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Закрыть все FAQ
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Открыть текущий, если он не был активен
    if (!isActive) {
        faqItem.classList.add('active');
    }
}
