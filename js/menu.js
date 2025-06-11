// Обновленный файл меню
export class MenuManager {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.isSliderPage = this.checkIfSliderPage();
        this.init();
    }

    init() {
        this.setupMenuHighlight();
        this.setupDropdownMenus();
        // УБИРАЕМ this.setupMobileMenu(); - теперь это в mobile-menu.js
        
        if (!this.isSliderPage) {
            this.setupSmoothScrolling();
            this.setupScrollSpy();
            this.enableNormalScrolling();
        } else {
            this.disableNormalScrolling();
        }
        
        this.updateMenuForPage();
        this.setupSearch();
        this.addBreadcrumbs();
    }
        
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page.replace('.html', '');
    }

    // Исправленная проверка страницы со слайдером
    checkIfSliderPage() {
        // Проверяем только наличие слайдера в DOM, а не название страницы
        return document.querySelector('.slider-container') !== null;
    }

    // Включаем обычную прокрутку для страниц без слайдера
    enableNormalScrolling() {
        document.body.style.overflow = '';
        document.body.classList.remove('slider-page');
        document.documentElement.style.overflow = '';
    }

    // Отключаем обычную прокрутку для страниц со слайдером
    disableNormalScrolling() {
        document.body.style.overflow = 'hidden';
        document.body.classList.add('slider-page');
        document.documentElement.style.overflow = 'hidden';
    }

    setupMenuHighlight() {
        const menuItems = document.querySelectorAll('.header-menu a');
        menuItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href && (href.includes(this.currentPage) || 
                (this.currentPage === 'index' && href === 'index.html'))) {
                item.classList.add('active');
                // Подсвечиваем родительский dropdown если нужно
                const dropdown = item.closest('.dropdown');
                if (dropdown) {
                    dropdown.querySelector('a').classList.add('active');
                }
            }
        });
    }

    setupDropdownMenus() {
        // Обрабатываем только ДЕСКТОПНЫЕ dropdown'ы
        const dropdowns = document.querySelectorAll('.desktop-menu .dropdown');
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('a');
            const menu = dropdown.querySelector('.dropdown-menu');
                       
            if (!trigger || !menu) return;

            let hoverTimeout;

            // Показать меню при наведении (только на десктопе)
            dropdown.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    clearTimeout(hoverTimeout);
                    menu.style.display = 'block';
                    menu.style.opacity = '0';
                    menu.style.transform = 'translateY(-10px)';
                                   
                    requestAnimationFrame(() => {
                        menu.style.transition = 'all 0.3s ease';
                        menu.style.opacity = '1';
                        menu.style.transform = 'translateY(0)';
                    });
                }
            });

            // Скрыть меню при уходе курсора с задержкой
            dropdown.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    hoverTimeout = setTimeout(() => {
                        menu.style.transition = 'all 0.3s ease';
                        menu.style.opacity = '0';
                        menu.style.transform = 'translateY(-10px)';
                        
                        setTimeout(() => {
                            menu.style.display = 'none';
                        }, 300);
                    }, 100);
                }
            });

            // Предотвращаем закрытие при наведении на само меню
            menu.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
            });

            // Обработка клика для мобильных устройств и десктопа
            trigger.addEventListener('click', (e) => {
                // Если это ссылка с якорем, не блокируем переход
                const href = trigger.getAttribute('href');
                if (href && href.startsWith('#') && href !== '#sections' && href !== '#ssilki') {
                    return; // Позволяем обычное поведение ссылки
                }

                e.preventDefault();
                const isVisible = menu.style.display === 'block';
                                   
                // Закрываем все другие меню
                document.querySelectorAll('.desktop-menu .dropdown-menu').forEach(m => {
                    if (m !== menu) {
                        m.style.display = 'none';
                    }
                });
                                   
                // Переключаем текущее меню
                menu.style.display = isVisible ? 'none' : 'block';
                if (!isVisible) {
                    menu.style.opacity = '1';
                    menu.style.transform = 'translateY(0)';
                }
            });
        });

        // Закрытие dropdown при клике вне меню
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.desktop-menu .dropdown')) {
                document.querySelectorAll('.desktop-menu .dropdown-menu').forEach(menu => {
                    menu.style.display = 'none';
                });
            }
        });
    }

    setupSmoothScrolling() {
        // Только для страниц без слайдера
        if (this.isSliderPage) return;

        const anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#' || href.length <= 1) return;
                               
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                                       
                    const headerHeight = document.querySelector('.main-header')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                                       
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                                       
                    // Закрываем мобильное меню если открыто
                    this.closeMobileMenu();
                }
            });
        });
    }

    // Добавление активного состояния при скролле (только для обычных страниц)
    setupScrollSpy() {
        if (this.isSliderPage) return;

        const sections = document.querySelectorAll('section[id], [id]');
        const menuLinks = document.querySelectorAll('.header-menu a[href^="#"]');
               
        if (sections.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                                       
                    // Убираем активный класс со всех ссылок
                    menuLinks.forEach(link => {
                        link.classList.remove('scroll-active');
                    });
                                       
                    // Добавляем активный класс к соответствующей ссылке
                    const activeLink = document.querySelector(`.header-menu a[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('scroll-active');
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Обновление меню для разных страниц
    updateMenuForPage() {
        const pageSpecificMenus = {
            'author': this.setupAuthorPageMenu,
            'os-selection': this.setupOSSelectionMenu,
            'remote-management': this.setupRemoteManagementMenu,
            'diagnost-management': this.setupDiagnostManagementMenu
        };

        const setupFunction = pageSpecificMenus[this.currentPage];
        if (setupFunction) {
            setupFunction.call(this);
        }
    }

    setupAuthorPageMenu() {
        console.log('Setting up Author page menu - scrolling enabled');
        // Убеждаемся, что скролл включен для страницы автора
        this.enableNormalScrolling();
    }

    setupOSSelectionMenu() {
        console.log('Setting up OS Selection page menu');
        this.enableNormalScrolling();
    }

    setupRemoteManagementMenu() {
        console.log('Setting up Remote Management page menu');
        this.enableNormalScrolling();
    }

    setupDiagnostManagementMenu() {
        console.log('Setting up Diagnostic Management page menu');
        this.enableNormalScrolling();
    }

    // Остальные методы...
    addBreadcrumbs() {
        const breadcrumbsContainer = document.querySelector('.breadcrumbs');
        if (!breadcrumbsContainer) return;

        const breadcrumbs = this.generateBreadcrumbs();
        breadcrumbsContainer.innerHTML = breadcrumbs.map(crumb =>
            crumb.url ?
                `<a href="${crumb.url}">${crumb.title}</a>` :
                `<span>${crumb.title}</span>`
        ).join(' / ');
    }

    generateBreadcrumbs() {
        const breadcrumbs = [
            { title: 'Главная', url: 'index.html' }
        ];

        const pageTitles = {
            'author': 'Автор',
            'os-selection': 'Выбор операционной системы',
            'remote-management': 'Средства удаленного управления',
            'diagnost-management': 'Средства диагностики'
        };

        if (this.currentPage !== 'index') {
            breadcrumbs.push({
                title: pageTitles[this.currentPage] || 'Страница',
                url: null
            });
        }

        return breadcrumbs;
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        if (!searchInput) return;

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
                       
            if (query.length < 2) {
                this.hideSearchResults();
                return;
            }

            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });

        // Закрытие результатов поиска при клике вне
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSearchResults();
            }
        });
    }

    performSearch(query) {
        const searchableContent = [
            { title: 'Главная страница', url: 'index.html', content: 'системное администрирование курсовой проект' },
            { title: 'Автор', url: 'author.html', content: 'студент университет контакты профиль' },
            { title: 'Выбор ОС', url: 'os-selection.html', content: 'операционная система windows linux' },
            { title: 'Удаленное управление', url: 'remote-management.html', content: 'teamviewer anydesk удаленный доступ' },
            { title: 'Диагностика системы', url: 'diagnost-management.html', content: 'мониторинг диагностика контроль системы' }
        ];

        const results = searchableContent.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.content.toLowerCase().includes(query.toLowerCase())
        );

        this.showSearchResults(results, query);
    }

    showSearchResults(results, query) {
        let resultsContainer = document.querySelector('.search-results');
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.className = 'search-results';
            document.querySelector('.search-container').appendChild(resultsContainer);
        }

        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="search-no-results">Ничего не найдено</div>';
        } else {
            resultsContainer.innerHTML = results.map(result => `
                <div class="search-result-item">
                    <a href="${result.url}">
                        <h4>${this.highlightQuery(result.title, query)}</h4>
                        <p>${this.highlightQuery(result.content, query)}</p>
                    </a>
                </div>
            `).join('');
        }

        resultsContainer.style.display = 'block';
    }

    hideSearchResults() {
        const resultsContainer = document.querySelector('.search-results');
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
    }

    highlightQuery(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
}

// Стили для меню (встроенные)
// В разделе стилей меню найдите и замените эти стили:

const menuStyles = `
    /* Основные стили меню */
    .main-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: transparent; /* Убираем темный фон */
        backdrop-filter: none; /* Убираем размытие */
        border-bottom: none; /* Убираем границу */
        z-index: 1000;
        transition: all 0.3s ease;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 70px;
    }

    .header-logo {
        flex-shrink: 0;
    }

    .logo-img {
        height: 40px;
        width: auto;
        filter: brightness(1.2);
        transition: filter 0.3s ease;
    }

    .logo-img:hover {
        filter: brightness(1.4);
    }

    .header-menu {
        display: flex;
        align-items: center;
    }

    .header-menu ul {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        align-items: center;
        gap: 30px;
    }

    .header-menu li {
        position: relative;
    }

    .header-menu a {
        color: #fff;
        text-decoration: none;
        font-size: 1rem;
        font-weight: 400;
        padding: 10px 15px;
        border-radius: 5px;
        transition: all 0.3s ease;
        display: block;
        white-space: nowrap;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.7); /* Добавляем тень для читаемости */
    }

    .header-menu a:hover {
        color: #c5a47e;
        background: rgba(197, 164, 126, 0.1);
        transform: translateY(-2px);
    }

    .mobile-menu-toggle {
        display: none;
        flex-direction: column;
        background: none;
        border: none;
        cursor: pointer;
        padding: 5px;
        z-index: 1001;
    }

    .mobile-menu-toggle span {
        width: 25px;
        height: 3px;
        background: #c5a47e;
        margin: 3px 0;
        transition: all 0.3s ease;
        border-radius: 2px;
        box-shadow: 1px 1px 2px rgba(0,0,0,0.5); /* Тень для видимости */
    }

    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
    }

    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }

    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
    }

    .header-menu a.active,
    .header-menu a.scroll-active {
        color: #c5a47e;
        position: relative;
    }

    .header-menu a.active::after,
    .header-menu a.scroll-active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 2px;
        background: #c5a47e;
        border-radius: 1px;
    }

    /* Dropdown стили */
    .dropdown {
        position: relative;
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        background: rgba(30, 30, 30, 0.95); /* Оставляем фон только для dropdown */
        backdrop-filter: blur(15px);
        min-width: 250px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(197, 164, 126, 0.2);
        display: none;
        z-index: 1001;
        overflow: hidden;
        margin-top: 5px;
    }

    .dropdown-menu li {
        margin: 0;
    }

    .dropdown-menu a {
        padding: 12px 20px;
        border-radius: 0;
        border-bottom: 1px solid rgba(197, 164, 126, 0.1);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        font-size: 0.9rem;
        text-shadow: none; /* Убираем тень в dropdown */
    }

    .dropdown-menu a:hover {
        background: rgba(197, 164, 126, 0.1);
        padding-left: 25px;
        color: #c5a47e;
        transform: none;
    }

    .dropdown-menu a::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 3px;
        background: #c5a47e;
        transform: scaleY(0);
        transition: transform 0.3s ease;
    }

    .dropdown-menu a:hover::before {
        transform: scaleY(1);
    }

    .dropdown-menu li:last-child a {
        border-bottom: none;
    }

    /* Поиск */
    .search-container {
        position: relative;
        margin: 0 20px;
    }

    .search-input {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(197, 164, 126, 0.3);
        border-radius: 20px;
        padding: 8px 15px;
        color: #fff;
        font-size: 0.9rem;
        width: 200px;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    }

    .search-input:focus {
        outline: none;
        border-color: #c5a47e;
        box-shadow: 0 0 10px rgba(197, 164, 126, 0.3);
        width: 250px;
        background: rgba(255, 255, 255, 0.15);
    }

    .search-input::placeholder {
        color: #b0b0b0;
    }

    .search-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(40, 40, 40, 0.95);
        border: 1px solid rgba(197, 164, 126, 0.3);
        border-radius: 10px;
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
        backdrop-filter: blur(10px);
        margin-top: 5px;
    }

    .search-result-item {
        padding: 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        transition: background 0.3s ease;
    }

    .search-result-item:last-child {
        border-bottom: none;
    }

    .search-result-item a {
        color: #fff;
        text-decoration: none;
        display: block;
    }

    .search-result-item h4 {
        color: #c5a47e;
        margin: 0 0 5px 0;
        font-size: 1rem;
    }

    .search-result-item p {
        color: #b0b0b0;
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.4;
    }

    .search-result-item:hover {
        background: rgba(197, 164, 126, 0.1);
    }

    .search-no-results {
        padding: 20px;
        text-align: center;
        color: #b0b0b0;
        font-style: italic;
    }

    mark {
        background: rgba(197, 164, 126, 0.3);
        color: #c5a47e;
        padding: 0 2px;
        border-radius: 2px;
    }

    /* Breadcrumbs */
    .breadcrumbs {
        padding: 10px 0;
        color: #b0b0b0;
        font-size: 0.9rem;
        margin-top: 80px;
    }

    .breadcrumbs a {
        color: #c5a47e;
        text-decoration: none;
        transition: color 0.3s ease;
    }

    .breadcrumbs a:hover {
        color: #fff;
    }

    /* Mobile overlay */
    .mobile-menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    .mobile-menu-overlay.active {
        opacity: 1;
        visibility: visible;
    }

    /* Стили для обычных страниц (не слайдер) */
    body:not(.slider-page) {
        padding-top: 70px;
        overflow-x: hidden;
        overflow-y: auto;
    }

    /* Стили для страниц со слайдером */
    body.slider-page {
        overflow: hidden;
        padding-top: 0;
    }

    /* Убираем темный фон для страниц со слайдером */
    body.slider-page .main-header {
        background: transparent;
        backdrop-filter: none;
        border-bottom: none;
    }

    body:not(.slider-page) .main-header.scrolled .header-menu a {
        text-shadow: none;
    }

    /* Адаптивность */
    @media (max-width: 768px) {
        .mobile-menu-toggle {
            display: flex;
        }

        .header-menu {
            position: fixed;
            top: 0;
            left: -100%;
            width: 80%;
            max-width: 300px;
            height: 100vh;
            
            backdrop-filter: blur(20px);
            transition: left 0.3s ease;
            z-index: 1000;
            padding-top: 80px;
            overflow-y: auto;
        }

        .header-menu.mobile-open {
            left: 0;
            box-shadow: 2px 0 20px rgba(0, 0, 0, 0.5);
        }

        .header-menu ul {
            flex-direction: column;
            padding: 20px;
            gap: 10px;
        }

        .header-menu li {
            width: 100%;
        }

        .header-menu a {
            font-size: 1.1rem;
            padding: 15px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0;
            text-shadow: none; /* Убираем тень в мобильном меню */
        }

        .header-menu a:hover {
            background: rgba(197, 164, 126, 0.1);
            padding-left: 10px;
            transform: none;
        }

        .dropdown-menu {
            position: static;
            background: rgba(0, 0, 0, 0.3);
            margin: 10px 0;
            border-radius: 5px;
            box-shadow: none;
            border: 1px solid rgba(197, 164, 126, 0.2);
        }

        .dropdown-menu a {
            padding: 10px 15px;
            font-size: 1rem;
            border-bottom: none;
        }

        .dropdown-menu a:hover {
            padding-left: 20px;
        }

        .search-container {
            margin: 20px;
            order: -1;
        }

        .search-input {
            width: 100%;
        }

        .search-input:focus {
            width: 100%;
        }

        .search-results {
            left: 20px;
            right: 20px;
        }

        /* Для мобильных страниц без слайдера */
        body:not(.slider-page) {
            padding-top: 70px;
        }
    }

    @media (max-width: 480px) {
        .main-header {
            padding: 0 15px;
            min-height: 60px;
        }

        .header-menu {
            width: 90%;
        }

        .header-menu a {
            font-size: 1rem;
            padding: 12px 0;
        }

        .dropdown-menu a {
            font-size: 0.9rem;
            padding: 8px 12px;
        }

        body:not(.slider-page) {
            padding-top: 60px;
        }

        .breadcrumbs {
            margin-top: 70px;
        }
    }

    /* Стили для улучшения производительности */
    .main-header {
        will-change: transform;
        transform: translateZ(0);
    }

    .dropdown-menu {
        will-change: opacity, transform;
    }

    /* Стили для фокуса (доступность) */
    .header-menu a:focus,
    .mobile-menu-toggle:focus,
    .search-input:focus {
        outline: 2px solid #c5a47e;
        outline-offset: 2px;
    }

    /* Анимации */
    .header-menu a {
        position: relative;
        overflow: hidden;
    }

    .header-menu a::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(197, 164, 126, 0.1), transparent);
                transition: left 0.5s ease;
    }

    .header-menu a:hover::before {
        left: 100%;
    }

    /* Стили для предотвращения конфликтов */
    .main-header * {
        pointer-events: auto;
    }

    .dropdown-menu * {
        pointer-events: auto;
    }
`;


// Добавляем стили в документ
const styleSheet = document.createElement('style');
styleSheet.textContent = menuStyles;
document.head.appendChild(styleSheet);

// Создаем overlay для мобильного меню
function createMobileOverlay() {
    if (!document.querySelector('.mobile-menu-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', () => {
            if (window.menuManager) {
                window.menuManager.closeMobileMenu();
            }
        });
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing menu...');
    
    // Создаем overlay для мобильного меню
    createMobileOverlay();
    
    // Инициализируем менеджер меню
    window.menuManager = new MenuManager();
    
    console.log('Menu manager initialized:', {
        currentPage: window.menuManager.currentPage,
        isSliderPage: window.menuManager.isSliderPage,
        hasSliderContainer: !!document.querySelector('.slider-container')
    });
    
    // Обработка скролла для фиксированного заголовка (только для обычных страниц)
    if (!window.menuManager.isSliderPage) {
        console.log('Setting up scroll handler for regular page');
        let lastScrollTop = 0;
        const header = document.querySelector('.main-header');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Добавляем полупрозрачный фон только при скролле на обычных страницах
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        }, { passive: true });
    } else {
        console.log('Skipping scroll handler for slider page');
    }
});

// Экспорт для использования в других модулях
export default MenuManager;

