// Обновленный JavaScript для страницы файловых систем
// (добавляем в начало существующего кода)

document.addEventListener('DOMContentLoaded', function() {
    // Подключаем функционал меню
    if (typeof window.initMenu === 'function') {
        window.initMenu();
    }
    
    // FAQ функциональность
    window.toggleFAQ = function(element) {
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
    };

    // Кнопка "Наверх" - показывать только когда меню скрыто
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #64b5f6, #42a5f5);
        color: #1a1a2e;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Показать/скрыть кнопку "Наверх"
    function toggleScrollToTop() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    }
    
    // Прокрутка наверх при клике
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Отслеживать скролл для кнопки "Наверх"
    window.addEventListener('scroll', toggleScrollToTop, { passive: true });

    // Анимация при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдать за элементами для анимации
    document.querySelectorAll('.fs-card, .scheme-card, .recommendation-card, .faq-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // Плавная прокрутка для якорных ссылок
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

    // Подсветка рекомендуемых карточек при наведении
    document.querySelectorAll('.fs-card, .scheme-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (this.classList.contains('featured')) {
                this.style.boxShadow = '0 15px 40px rgba(100, 181, 246, 0.3)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });

    // Функция для копирования текста в буфер обмена
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(function() {
            showNotification('Скопировано в буфер обмена');
        });
    };

    // Показать уведомление
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #64b5f6;
            color: #1a1a2e;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Показать уведомление
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Скрыть уведомление через 3 секунды
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Добавить интерактивность к диаграммам разделов
    document.querySelectorAll('.rec-partition').forEach(partition => {
        partition.addEventListener('click', function() {
            const partitionName = this.querySelector('.partition-name').textContent;
            const partitionSize = this.querySelector('.partition-size').textContent;
            const partitionFs = this.querySelector('.partition-fs').textContent;
            
            showNotification(`${partitionName}: ${partitionSize} (${partitionFs})`);
        });
    });

    // Улучшенная работа с таблицей сравнения на мобильных устройствах
    const comparisonTable = document.querySelector('.comparison-table');
    if (comparisonTable && window.innerWidth <= 768) {
        const tableContainer = comparisonTable.parentElement;
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.innerHTML = '← Прокрутите таблицу →';
        scrollIndicator.style.cssText = `
            text-align: center;
            color: #64b5f6;
            font-size: 0.8rem;
            padding: 10px;
            background: rgba(100, 181, 246, 0.1);
            border-radius: 0 0 10px 10px;
            transition: opacity 0.3s ease;
        `;
        
        tableContainer.appendChild(scrollIndicator);
        
        // Скрыть индикатор после первой прокрутки
        tableContainer.addEventListener('scroll', function() {
            if (this.scrollLeft > 0) {
                scrollIndicator.style.opacity = '0';
                setTimeout(() => {
                    if (scrollIndicator.parentElement) {
                        scrollIndicator.parentElement.removeChild(scrollIndicator);
                    }
                }, 300);
            }
        }, { once: true });
    }

    // Дополнительные функции для улучшения UX
    
    // Анимация чисел в статистике (если есть)
    function animateNumbers() {
        const numbers = document.querySelectorAll('.stat-number');
        numbers.forEach(number => {
            const target = parseInt(number.getAttribute('data-target')) || parseInt(number.textContent);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                number.textContent = Math.floor(current);
            }, 16);
        });
    }

    // Запуск анимации чисел при появлении элементов
    const numberObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                numberObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.hero-stats, .advantage-stats').forEach(el => {
        numberObserver.observe(el);
    });

    // Подсветка синтаксиса для технических терминов
    document.querySelectorAll('.spec-value, .partition-fs').forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.color = '#64b5f6';
            this.style.transition = 'color 0.2s ease';
        });
        
        el.addEventListener('mouseleave', function() {
            this.style.color = '';
        });
    });

    // Улучшенная доступность для клавиатурной навигации
    document.querySelectorAll('.faq-question').forEach(question => {
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Обновление aria-expanded для FAQ
    document.addEventListener('click', function(e) {
        if (e.target.closest('.faq-question')) {
            const question = e.target.closest('.faq-question');
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            question.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        }
    });

    // Прелоадер изображений для плавной загрузки
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Обработка ошибок JavaScript
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        // Можно добавить отправку ошибок на сервер или показ пользователю
    });

    // Уведомление о подключении к интернету
    window.addEventListener('online', function() {
        showNotification('Подключение восстановлено');
    });

    window.addEventListener('offline', function() {
        showNotification('Отсутствует подключение к интернету');
    });

    console.log('Filesystem page loaded successfully');
});
