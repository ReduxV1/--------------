// Основной скрипт для страницы выбора операционной системы

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initPreloader();
    initScrollAnimations();
    initStatCounters();
    initRequirementsTabs();
    initFAQ();
    initScrollToTop();
    initVersionSelection();
    initModalHandlers();
    initHeaderScroll();
});

function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (!header) {
        console.warn('Header not found');
        return;
    }

    let lastScrollTop = 0;
    let isScrolling = false;

    function handleScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Показываем хедер в самом верху страницы
                if (scrollTop <= 10) {
                    header.style.transform = 'translateY(0)';
                    header.classList.remove('header-hidden');
                    header.classList.add('header-visible');
                }
                // Скрываем при скролле вниз (после 100px)
                else if (scrollTop > lastScrollTop && scrollTop > 100) {
                    header.style.transform = 'translateY(-100%)';
                    header.classList.add('header-hidden');
                    header.classList.remove('header-visible');
                }
                // Показываем при скролле вверх
                else if (scrollTop < lastScrollTop) {
                    header.style.transform = 'translateY(0)';
                    header.classList.remove('header-hidden');
                    header.classList.add('header-visible');
                }
                
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
                isScrolling = false;
            });
        }
        isScrolling = true;
    }

    // Добавляем обработчик скролла
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Инициализируем начальное состояние
    header.classList.add('header-visible');
}
function initModalHandlers() {
    const modal = document.getElementById('modalOverlay');
    if (!modal) return;

    // Убеждаемся, что модальное окно изначально скрыто
    modal.classList.remove('active');
    
    // Добавляем обработчик для кнопки закрытия
    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
}

// Прелоадер
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    // Скрываем прелоадер через 2 секунды
    setTimeout(() => {
        preloader.classList.add('hidden');
        
        // Удаляем прелоадер из DOM через 0.5 секунды после скрытия
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }, 2000);
}

// Анимации при скролле
function initScrollAnimations() {
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

    // Наблюдаем за всеми элементами с классом scroll-animate
    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
}

// Счетчики статистики в героической секции
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateCounters = () => {
        if (animated) return;
        animated = true;

        statNumbers.forEach(stat => {
            const target = parseFloat(stat.dataset.target);
            const duration = 2000; // 2 секунды
            const step = target / (duration / 16); // 60 FPS
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Форматирование числа
                if (target === 1.4) {
                    stat.textContent = current.toFixed(1);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 16);
        });
    };

    // Запускаем анимацию когда героическая секция видна
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateCounters, 1000);
            }
        });
    }, { threshold: 0.5 });

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
}

// Табы системных требований
function initRequirementsTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Убираем активный класс со всех кнопок и контента
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Добавляем активный класс к выбранной кнопке и контенту
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// FAQ аккордеон
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Закрываем все FAQ элементы
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });

            // Если элемент не был активным, открываем его
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Глобальная функция для FAQ (вызывается из HTML)
function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');

    // Закрываем все FAQ элементы
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // Если элемент не был активным, открываем его
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Кнопка "Наверх"
// Исправленная функция initScrollToTop
function initScrollToTop() {
    const scrollButton = document.getElementById('scrollToTop');
    
    if (!scrollButton) {
        console.error('Scroll to top button not found');
        return;
    }

    // Функция для обновления видимости кнопки
    function updateButtonVisibility() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    }

    // Добавляем обработчик скролла
    window.addEventListener('scroll', updateButtonVisibility);
    
    // Проверяем начальное состояние
    updateButtonVisibility();
    
    // Добавляем обработчик клика
    scrollButton.addEventListener('click', scrollToTop);
}

// Исправленная функция scrollToTop
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Выбор версии Windows
function initVersionSelection() {
    // Добавляем обработчики для карточек версий
    const versionCards = document.querySelectorAll('.version-card');
    
    versionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            if (card.classList.contains('featured')) {
                card.style.transform = 'scale(1.05)';
            } else {
                card.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

// Функция выбора версии (вызывается из HTML)
function selectVersion(version) {
    const versionNames = {
        'home': 'Windows 11 Home',
        'pro': 'Windows 11 Pro',
        'enterprise': 'Windows 11 Enterprise'
    };

    const selectedVersion = versionNames[version];
    
    // Показываем уведомление о выборе
    showNotification(`Вы выбрали ${selectedVersion}`, 'success');
    
    // Здесь можно добавить логику для перехода к следующему шагу
    console.log(`Выбрана версия: ${selectedVersion}`);
}

// Функция показа деталей версии (вызывается из HTML)
function showDetails(version) {
    const versionDetails = {
        'home': {
            title: 'Windows 11 Home - Подробности',
            content: `
                <h4>Идеально для домашнего использования</h4>
                <p>Windows 11 Home предоставляет все необходимые функции для повседневных задач, развлечений и творчества.</p>
                
                <h5>Основные возможности:</h5>
                <ul>
                    <li>Новый дизайн интерфейса с центрированным меню "Пуск"</li>
                    <li>Улучшенная многозадачность с функцией Snap Layouts</li>
                    <li>Интеграция с Microsoft Teams</li>
                    <li>Новый Microsoft Store с поддержкой Android-приложений</li>
                    <li>Улучшенная производительность игр</li>
                    <li>Голосовой помощник Cortana</li>
                </ul>
                
                <h5>Системные требования:</h5>
                <ul>
                    <li>Процессор: 1 ГГц, 64-бит, совместимый</li>
                    <li>ОЗУ: 4 ГБ</li>
                    <li>Хранилище: 64 ГБ</li>
                    <li>TPM: версия 2.0</li>
                    <li>UEFI, поддержка Secure Boot</li>
                </ul>
                
                <p><strong>Цена:</strong> от $139</p>
            `
        },
        'pro': {
            title: 'Windows 11 Pro - Подробности',
            content: `
                <h4>Для бизнеса и профессионалов</h4>
                <p>Windows 11 Pro включает все функции Home версии плюс расширенные возможности безопасности и управления.</p>
                
                <h5>Дополнительные возможности Pro:</h5>
                <ul>
                    <li>BitLocker - шифрование диска для защиты данных</li>
                    <li>Windows Information Protection - защита корпоративных данных</li>
                    <li>Удаленный рабочий стол для доступа к ПК из любой точки</li>
                    <li>Hyper-V для создания виртуальных машин</li>
                    <li>Групповые политики для централизованного управления</li>
                    <li>Присоединение к домену Azure Active Directory</li>
                    <li>Windows Update for Business</li>
                </ul>
                
                <h5>Идеально подходит для:</h5>
                <ul>
                    <li>Малого и среднего бизнеса</li>
                    <li>Профессиональных пользователей</li>
                    <li>Разработчиков и IT-специалистов</li>
                    <li>Удаленной работы</li>
                </ul>
                
                <p><strong>Цена:</strong> от $199</p>
            `
        },
        'enterprise': {
            title: 'Windows 11 Enterprise - Подробности',
            content: `
                <h4>Для крупных организаций</h4>
                <p>Windows 11 Enterprise предоставляет максимальный уровень безопасности, управления и функциональности для крупных предприятий.</p>
                
                <h5>Корпоративные функции:</h5>
                <ul>
                    <li>Windows Defender Advanced Threat Protection - расширенная защита от угроз</li>
                    <li>AppLocker - контроль запуска приложений</li>
                    <li>BranchCache - кэширование контента в филиалах</li>
                    <li>DirectAccess - прозрачный доступ к корпоративной сети</li>
                    <li>Windows To Go - мобильная рабочая среда</li>
                    <li>Credential Guard - защита учетных данных</li>
                    <li>Device Guard - защита от вредоносного ПО</li>
                    <li>Long Term Servicing Channel (LTSC)</li>
                </ul>
                
                <h5>Преимущества для предприятий:</h5>
                <ul>
                    <li>Централизованное управление через System Center</li>
                    <li>Расширенная аналитика и отчетность</li>
                    <li>Поддержка виртуализации приложений</li>
                    <li>Интеграция с Microsoft 365</li>
                    <li>Расширенные возможности развертывания</li>
                </ul>
                
                <p><strong>Лицензирование:</strong> По подписке через Volume Licensing</p>
            `
        }
    };

    const details = versionDetails[version];
    if (details) {
        showModal(details.title, details.content);
    }
}

// Глобальные переменные для отслеживания обработчиков
let modalClickHandler = null;
let escapeKeyHandler = null;

// Исправленная функция showModal
function showModal(title, content) {
    const modal = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    if (!modal || !modalTitle || !modalBody) {
        console.error('Modal elements not found');
        return;
    }

    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.classList.add('active');

    // Удаляем старые обработчики если они есть
    if (modalClickHandler) {
        modal.removeEventListener('click', modalClickHandler);
    }
    if (escapeKeyHandler) {
        document.removeEventListener('keydown', escapeKeyHandler);
    }

    // Создаем новые обработчики
    modalClickHandler = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    };

    escapeKeyHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    };

    // Добавляем обработчики
    modal.addEventListener('click', modalClickHandler);
    document.addEventListener('keydown', escapeKeyHandler);
}

// Исправленная функция closeModal
function closeModal() {
    const modal = document.getElementById('modalOverlay');
    if (!modal) return;

    modal.classList.remove('active');
    
    // Удаляем обработчики событий
    if (modalClickHandler) {
        modal.removeEventListener('click', modalClickHandler);
        modalClickHandler = null;
    }
    if (escapeKeyHandler) {
        document.removeEventListener('keydown', escapeKeyHandler);
        escapeKeyHandler = null;
    }
}


function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

// Система уведомлений
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" type="button">×</button>
        </div>
    `;

    // Добавляем обработчик закрытия
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.remove();
    });

    // Добавляем стили для уведомлений если их еще нет
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(40, 40, 40, 0.95);
                border: 1px solid rgba(197, 164, 126, 0.3);
                border-radius: 8px;
                padding: 15px;
                z-index: 10001;
                min-width: 300px;
                animation: slideInRight 0.3s ease;
            }
            
            .notification-success {
                border-color: #4CAF50;
            }
            
            .notification-error {
                border-color: #f44336;
            }
            
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 15px;
            }
            
            .notification-message {
                color: #ffffff;
                font-size: 0.9rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #c5a47e;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-close:hover {
                color: #ffffff;
            }
            
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
        `;
        document.head.appendChild(styles);
    }

    // Добавляем уведомление на страницу
    document.body.appendChild(notification);

    // Автоматически удаляем уведомление через 5 секунд
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Дополнительные функции для улучшения UX

// Плавная прокрутка к якорям
function initSmoothScrolling() {
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

// Параллакс эффект для героической секции
function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    const windowsParticles = document.querySelector('.windows-particles');
    
    if (heroSection && windowsParticles) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            windowsParticles.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Проверка системных требований
function checkSystemRequirements() {
    const requirements = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        memory: navigator.deviceMemory || 'Неизвестно',
        cores: navigator.hardwareConcurrency || 'Неизвестно',
        connection: navigator.connection ? navigator.connection.effectiveType : 'Неизвестно'
    };

    console.log('Информация о системе:', requirements);
    return requirements;
}

// Функция для показа информации о системе
function showSystemInfo() {
    const systemInfo = checkSystemRequirements();
    const content = `
        <h4>Информация о вашей системе</h4>
        <div style="margin: 20px 0;">
            <p><strong>Платформа:</strong> ${systemInfo.platform}</p>
            <p><strong>Память:</strong> ${systemInfo.memory} ГБ</p>
            <p><strong>Процессорные ядра:</strong> ${systemInfo.cores}</p>
            <p><strong>Тип соединения:</strong> ${systemInfo.connection}</p>
        </div>
        <p style="color: #c5a47e; font-size: 0.9rem;">
            <em>Примечание: Некоторые данные могут быть недоступны из-за ограничений браузера.</em>
        </p>
    `;
    
    showModal('Системная информация', content);
}

// Функция сравнения версий
function compareVersions(version1, version2) {
    const versionFeatures = {
        'home': [
            'Новый дизайн Start Menu',
            'Microsoft Edge',
            'Windows Hello',
            'Microsoft Store',
            'Xbox Game Pass'
        ],
        'pro': [
            'Новый дизайн Start Menu',
            'Microsoft Edge',
            'Windows Hello',
            'Microsoft Store',
            'Xbox Game Pass',
            'BitLocker шифрование',
            'Удаленный рабочий стол',
            'Hyper-V',
            'Групповые политики',
            'Windows Information Protection'
        ],
        'enterprise': [
            'Новый дизайн Start Menu',
            'Microsoft Edge',
            'Windows Hello',
            'Microsoft Store',
            'Xbox Game Pass',
            'BitLocker шифрование',
            'Удаленный рабочий стол',
            'Hyper-V',
            'Групповые политики',
            'Windows Information Protection',
            'Windows Defender ATP',
            'AppLocker',
            'BranchCache',
            'DirectAccess'
        ]
    };

    const features1 = versionFeatures[version1] || [];
    const features2 = versionFeatures[version2] || [];

    return {
        version1: {
            name: version1,
            features: features1,
            uniqueFeatures: features1.filter(f => !features2.includes(f))
        },
        version2: {
            name: version2,
            features: features2,
            uniqueFeatures: features2.filter(f => !features1.includes(f))
        }
    };
}

// Функция для создания интерактивной диаграммы требований
function createRequirementsChart() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    // Простая диаграмма системных требований
    const requirements = [
        { name: 'CPU', min: 1, rec: 2.5, opt: 3.0, color: '#c5a47e' },
        { name: 'RAM', min: 4, rec: 8, opt: 16, color: '#d4b896' },
        { name: 'Storage', min: 64, rec: 256, opt: 1000, color: '#e3c7a5' }
    ];

    // Отрисовка диаграммы
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.fillText('Системные требования', 10, 20);

    requirements.forEach((req, index) => {
        const y = 50 + index * 80;
        
        // Название компонента
        ctx.fillStyle = '#ffffff';
        ctx.fillText(req.name, 10, y);
        
        // Минимальные требования
        ctx.fillStyle = req.color;
        ctx.fillRect(80, y - 15, req.min * 20, 15);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Min: ${req.min}`, 80, y - 20);
        
        // Рекомендуемые требования
        ctx.fillStyle = req.color;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(80, y, req.rec * 10, 15);
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Rec: ${req.rec}`, 80, y + 30);
        
        // Оптимальные требования
        ctx.fillStyle = req.color;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(80, y + 15, req.opt * 5, 15);
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Opt: ${req.opt}`, 80, y + 45);
    });

    return canvas;
}

// Функция для экспорта сравнения версий
function exportComparison() {
    const comparisonData = {
        timestamp: new Date().toISOString(),
        versions: {
            home: {
                price: '$139',
                features: [
                    'Новый дизайн Start Menu',
                    'Microsoft Edge',
                    'Windows Hello',
                    'Microsoft Store',
                    'Xbox Game Pass'
                ]
            },
            pro: {
                price: '$199',
                features: [
                    'Все функции Home',
                    'BitLocker шифрование',
                    'Удаленный рабочий стол',
                    'Hyper-V',
                    'Групповые политики',
                    'Windows Information Protection'
                ]
            },
            enterprise: {
                price: 'По подписке',
                features: [
                    'Все функции Pro',
                    'Windows Defender ATP',
                    'AppLocker',
                    'BranchCache',
                    'DirectAccess'
                ]
            }
        }
    };

    const dataStr = JSON.stringify(comparisonData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'windows11-comparison.json';
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Сравнение экспортировано', 'success');
}

// Функция для поиска по странице
function initSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Поиск по странице...';
    searchInput.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        padding: 10px;
        border: 1px solid rgba(197, 164, 126, 0.3);
        border-radius: 5px;
        background: rgba(40, 40, 40, 0.9);
        color: #ffffff;
        z-index: 1000;
        display: none;
    `;

    document.body.appendChild(searchInput);

    // Показать/скрыть поиск по Ctrl+F
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            searchInput.style.display = searchInput.style.display === 'none' ? 'block' : 'none';
            if (searchInput.style.display === 'block') {
                searchInput.focus();
            }
        }
    });

    // Поиск по вводу
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td');
        
        textElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (searchTerm && text.includes(searchTerm)) {
                element.style.backgroundColor = 'rgba(197, 164, 126, 0.3)';
            } else {
                element.style.backgroundColor = '';
            }
        });
    });
}

// Функция для создания закладок
function initBookmarks() {
    const bookmarkButton = document.createElement('button');
    bookmarkButton.innerHTML = '🔖';
    bookmarkButton.title = 'Добавить в закладки';
    bookmarkButton.style.cssText = `
        position: fixed;
        top: 80px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #c5a47e, #d4b896);
        color: #1a1f2e;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        z-index: 1000;
        transition: all 0.3s ease;
    `;

    bookmarkButton.addEventListener('click', () => {
        if (typeof(Storage) !== "undefined") {
            const bookmark = {
                title: document.title,
                url: window.location.href,
                timestamp: new Date().toISOString()
            };
            
            let bookmarks = JSON.parse(localStorage.getItem('windowsBookmarks') || '[]');
            bookmarks.push(bookmark);
            localStorage.setItem('windowsBookmarks', JSON.stringify(bookmarks));
            
            showNotification('Страница добавлена в закладки', 'success');
        } else {
            showNotification('Локальное хранилище не поддерживается', 'error');
        }
    });

    document.body.appendChild(bookmarkButton);
}

// Функция для отслеживания времени на странице
function initTimeTracking() {
    const startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        console.log(`Время на странице: ${timeSpent} секунд`);
        
        // Сохраняем статистику
        if (typeof(Storage) !== "undefined") {
            const stats = JSON.parse(localStorage.getItem('pageStats') || '{}');
            stats[window.location.pathname] = (stats[window.location.pathname] || 0) + timeSpent;
            localStorage.setItem('pageStats', JSON.stringify(stats));
        }
    });
}

// Функция для создания мини-карты страницы
function createPageMinimap() {
    const minimap = document.createElement('div');
    minimap.style.cssText = `
        position: fixed;
        top: 50%;
        right: 10px;
        width: 4px;
        height: 200px;
        background: rgba(40, 40, 40, 0.8);
        border-radius: 2px;
        z-index: 1000;
        transform: translateY(-50%);
    `;

    const indicator = document.createElement('div');
    indicator.style.cssText = `
        width: 100%;
        height: 20px;
        background: #c5a47e;
        border-radius: 2px;
        transition: top 0.1s ease;
    `;

    minimap.appendChild(indicator);
    document.body.appendChild(minimap);

    // Обновляем позицию индикатора при скролле
    window.addEventListener('scroll', () => {
        const scrollPercent = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);
        const indicatorTop = scrollPercent * (200 - 20);
        indicator.style.top = `${indicatorTop}px`;
    });

    // Клик по мини-карте для быстрого перехода
    minimap.addEventListener('click', (e) => {
        const rect = minimap.getBoundingClientRect();
        const clickPercent = (e.clientY - rect.top) / rect.height;
        const targetScroll = clickPercent * (document.body.scrollHeight - window.innerHeight);
        
                window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    });
}

// Функция для создания контекстного меню
function initContextMenu() {
    const contextMenu = document.createElement('div');
    contextMenu.id = 'contextMenu';
    contextMenu.style.cssText = `
        position: fixed;
        background: rgba(40, 40, 40, 0.95);
        border: 1px solid rgba(197, 164, 126, 0.3);
        border-radius: 8px;
        padding: 10px 0;
        z-index: 10000;
        display: none;
        min-width: 150px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    `;

    const menuItems = [
        { text: 'Системная информация', action: showSystemInfo },
        { text: 'Экспорт сравнения', action: exportComparison },
        { text: 'Копировать ссылку', action: copyPageLink },
        { text: 'Поделиться', action: sharePage }
    ];

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.textContent = item.text;
        menuItem.style.cssText = `
            padding: 8px 15px;
            color: #ffffff;
            cursor: pointer;
            transition: background 0.2s ease;
        `;
        
        menuItem.addEventListener('mouseenter', () => {
            menuItem.style.background = 'rgba(197, 164, 126, 0.2)';
        });
        
        menuItem.addEventListener('mouseleave', () => {
            menuItem.style.background = 'transparent';
        });
        
        menuItem.addEventListener('click', () => {
            item.action();
            contextMenu.style.display = 'none';
        });
        
        contextMenu.appendChild(menuItem);
    });

    document.body.appendChild(contextMenu);

    // Показать контекстное меню по правому клику
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
        contextMenu.style.display = 'block';
    });

    // Скрыть контекстное меню по клику в другом месте
    document.addEventListener('click', () => {
        contextMenu.style.display = 'none';
    });
}

// Функция копирования ссылки на страницу
function copyPageLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showNotification('Ссылка скопирована в буфер обмена', 'success');
    }).catch(() => {
        showNotification('Не удалось скопировать ссылку', 'error');
    });
}

// Функция для поделиться страницей
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: 'Выбор операционной системы Windows',
            url: window.location.href
        }).then(() => {
            showNotification('Страница успешно отправлена', 'success');
        }).catch(() => {
            showNotification('Отмена отправки', 'info');
        });
    } else {
        // Fallback для браузеров без поддержки Web Share API
        copyPageLink();
    }
}

// Функция для создания прогресс-бара чтения
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #c5a47e, #d4b896);
        z-index: 10000;
        transition: width 0.1s ease;
    `;

    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollPercent = (window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    });
}

// Функция для ленивой загрузки изображений
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Функция для создания всплывающих подсказок
function initTooltips() {
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(40, 40, 40, 0.95);
        color: #ffffff;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.85rem;
        z-index: 10001;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
        max-width: 200px;
        border: 1px solid rgba(197, 164, 126, 0.3);
    `;

    document.body.appendChild(tooltip);

    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            tooltip.textContent = element.dataset.tooltip;
            tooltip.style.opacity = '1';
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            tooltip.style.transform = 'translateX(-50%)';
        });

        element.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });
}

// Функция для сохранения состояния страницы
function savePageState() {
    const state = {
        scrollPosition: window.pageYOffset,
        activeTab: document.querySelector('.tab-btn.active')?.dataset.tab,
        openFAQ: Array.from(document.querySelectorAll('.faq-item.active')).map(item => 
            Array.from(document.querySelectorAll('.faq-item')).indexOf(item)
        ),
        timestamp: Date.now()
    };

    sessionStorage.setItem('pageState', JSON.stringify(state));
}

// Функция для восстановления состояния страницы
function restorePageState() {
    const savedState = sessionStorage.getItem('pageState');
    if (!savedState) return;

    try {
        const state = JSON.parse(savedState);
        
        // Восстанавливаем позицию скролла
        if (state.scrollPosition) {
            setTimeout(() => {
                window.scrollTo(0, state.scrollPosition);
            }, 100);
        }

        // Восстанавливаем активную вкладку
        if (state.activeTab) {
            const tabButton = document.querySelector(`[data-tab="${state.activeTab}"]`);
            if (tabButton) {
                tabButton.click();
            }
        }

        // Восстанавливаем открытые FAQ
        if (state.openFAQ && state.openFAQ.length > 0) {
            const faqItems = document.querySelectorAll('.faq-item');
            state.openFAQ.forEach(index => {
                if (faqItems[index]) {
                    faqItems[index].classList.add('active');
                }
            });
        }
    } catch (error) {
        console.error('Ошибка при восстановлении состояния страницы:', error);
    }
}

// Функция для отслеживания производительности
function initPerformanceTracking() {
    // Отслеживаем время загрузки страницы
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Время загрузки страницы: ${loadTime.toFixed(2)}ms`);
        
        // Отслеживаем метрики производительности
        if ('getEntriesByType' in performance) {
            const navigationEntries = performance.getEntriesByType('navigation');
            if (navigationEntries.length > 0) {
                const nav = navigationEntries[0];
                console.log('Метрики производительности:', {
                    domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
                    loadComplete: nav.loadEventEnd - nav.loadEventStart,
                    totalTime: nav.loadEventEnd - nav.fetchStart
                });
            }
        }
    });
}

// Функция для создания горячих клавиш
function initHotkeys() {
    const hotkeys = {
        'KeyH': () => window.scrollTo({ top: 0, behavior: 'smooth' }), // H - Home
        'KeyE': () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), // E - End
        'KeyS': showSystemInfo, // S - System info
        'KeyC': () => compareVersions('home', 'pro'), // C - Compare
        'Escape': closeModal // Escape - Close modal
    };

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && hotkeys[e.code]) {
            e.preventDefault();
            hotkeys[e.code]();
        }
    });

    // Показываем подсказку о горячих клавишах
    const helpButton = document.createElement('button');
    helpButton.innerHTML = '?';
    helpButton.title = 'Горячие клавиши (Ctrl+?)';
    helpButton.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 30px;
        width: 40px;
        height: 40px;
        background: rgba(197, 164, 126, 0.8);
        color: #1a1f2e;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        z-index: 1000;
    `;

    helpButton.addEventListener('click', () => {
        const helpContent = `
            <h4>Горячие клавиши</h4>
            <div style="margin: 20px 0;">
                <p><kbd>Ctrl + H</kbd> - Перейти в начало страницы</p>
                <p><kbd>Ctrl + E</kbd> - Перейти в конец страницы</p>
                <p><kbd>Ctrl + S</kbd> - Показать системную информацию</p>
                <p><kbd>Ctrl + C</kbd> - Сравнить версии</p>
                <p><kbd>Escape</kbd> - Закрыть модальное окно</p>
            </div>
            <style>
                kbd {
                    background: rgba(197, 164, 126, 0.2);
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: monospace;
                    color: #c5a47e;
                }
            </style>
        `;
        showModal('Справка', helpContent);
    });

    document.body.appendChild(helpButton);
}

// Инициализация дополнительных функций
document.addEventListener('DOMContentLoaded', function() {
    // Основные функции уже инициализированы выше
    
    // Дополнительные функции
    setTimeout(() => {
        initSmoothScrolling();
        initParallax();
        initSearch();
        initBookmarks();
        initTimeTracking();
        createPageMinimap();
        initContextMenu();
        initReadingProgress();
        initLazyLoading();
        initTooltips();
        initPerformanceTracking();
        initHotkeys();
        
        // Восстанавливаем состояние страницы
        restorePageState();
        
        // Сохраняем состояние при уходе со страницы
        window.addEventListener('beforeunload', savePageState);
        
        console.log('Все дополнительные функции инициализированы');
    }, 1000);
});

// Экспортируем основные функции для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        selectVersion,
        showDetails,
        toggleFAQ,
        scrollToTop,
        closeModal,
        showSystemInfo,
        exportComparison,
        compareVersions
    };
}

