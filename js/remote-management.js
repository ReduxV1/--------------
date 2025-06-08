// Скрипт для страницы удаленного управления

document.addEventListener('DOMContentLoaded', function() {
    initPageAnimations();
    initToolButtons();
    initScrollToTop();
    initParticleEffect();
});

// Инициализация анимаций страницы
function initPageAnimations() {
    // Анимация появления элементов
    const animatedElements = document.querySelectorAll('.gold-frame, .tool-button');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Интерактивность кнопок инструментов
function initToolButtons() {
    const toolButtons = document.querySelectorAll('.tool-button');
    
    toolButtons.forEach((button, index) => {
        // Добавляем звуковой эффект при наведении (опционально)
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-8px) scale(1.02)';
            
            // Добавляем рябь при наведении
            createRippleEffect(button);
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
        
        // Эффект клика
        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(-4px) scale(1.01)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        // Добавляем задержку анимации
        button.style.animationDelay = `${index * 0.1}s`;
    });
}

// Создание эффекта ряби
function createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(197, 164, 126, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.marginLeft = -size / 2 + 'px';
    ripple.style.marginTop = -size / 2 + 'px';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Добавляем CSS для анимации ряби
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);

// Кнопка "Наверх"
function initScrollToTop() {
    const scrollButton = document.getElementById('scrollToTop');
    
    if (!scrollButton) return;

    function updateButtonVisibility() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
            scrollButton.style.transform = 'translateY(0)';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
            scrollButton.style.transform = 'translateY(20px)';
        }
    }

    window.addEventListener('scroll', updateButtonVisibility);
    updateButtonVisibility();
}

// Функция прокрутки наверх
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Эффект частиц в фоне
function initParticleEffect() {
    const overlay = document.querySelector('.overlay');
    if (!overlay) return;
    
    // Создаем контейнер для частиц
    const particlesContainer = document.createElement('div');
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
    `;
    
    overlay.appendChild(particlesContainer);
    
    // Создаем частицы
    for (let i = 0; i < 20; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(197, 164, 126, 0.3);
        border-radius: 50%;
        pointer-events: none;
    `;
    
    // Случайная позиция
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    container.appendChild(particle);
    
    // Анимация частицы
    animateParticle(particle);
}

function animateParticle(particle) {
    const duration = 10000 + Math.random() * 20000; // 10-30 секунд
    const startX = parseFloat(particle.style.left);
    const startY = parseFloat(particle.style.top);
    const endX = Math.random() * 100;
    const endY = Math.random() * 100;
    
    particle.animate([
        {
            left: startX + '%',
            top: startY + '%',
            opacity: 0
        },
        {
            left: endX + '%',
            top: endY + '%',
            opacity: 0.3
        },
        {
            left: (endX + Math.random() * 20 - 10) + '%',
            top: (endY + Math.random() * 20 - 10) + '%',
            opacity: 0
        }
    ], {
        duration: duration,
        easing: 'ease-in-out'
    }).addEventListener('finish', () => {
        // Перезапускаем анимацию
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        animateParticle(particle);
    });
}

// Добавляем стили для кнопки "Наверх"
const scrollButtonStyles = document.createElement('style');
scrollButtonStyles.textContent = `
    .scroll-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #c5a47e, #d4b896);
        color: #1a1f2e;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    
    .scroll-to-top:hover {
        transform: translateY(-3px) scale(1.1);
        box-shadow: 0 6px 20px rgba(197, 164, 126, 0.3);
        background: linear-gradient(135deg, #d4b896, #e3c7a5);
    }
    
    .scroll-to-top:active {
        transform: translateY(-1px) scale(1.05);
    }
    
    @media (max-width: 768px) {
        .scroll-to-top {
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
        }
    }
`;
document.head.appendChild(scrollButtonStyles);

// Добавляем обработчик для плавных переходов между страницами
document.querySelectorAll('.tool-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Проверяем, является ли ссылка внутренней
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
            e.preventDefault();
            
            // Добавляем эффект загрузки
            document.body.style.opacity = '0.8';
            document.body.style.transform = 'scale(0.98)';
            document.body.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        }
    });
});

// Экспортируем функции для глобального использования
window.scrollToTop = scrollToTop;
