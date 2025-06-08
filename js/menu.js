// Обновленный файл меню
export class MenuManager {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    init() {
        this.setupMenuHighlight();
        this.setupDropdownMenus();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
    }

        getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page.replace('.html', '');
    }

    setupMenuHighlight() {
        const menuItems = document.querySelectorAll('.header-menu a');
        menuItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href && href.includes(this.currentPage)) {
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
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('a');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (!trigger || !menu) return;

            // Показать меню при наведении
            dropdown.addEventListener('mouseenter', () => {
                menu.style.display = 'block';
                menu.style.opacity = '0';
                menu.style.transform = 'translateY(-10px)';
                
                requestAnimationFrame(() => {
                    menu.style.transition = 'all 0.3s ease';
                    menu.style.opacity = '1';
                    menu.style.transform = 'translateY(0)';
                });
            });

            // Скрыть меню при уходе курсора
            dropdown.addEventListener('mouseleave', () => {
                menu.style.transition = 'all 0.3s ease';
                menu.style.opacity = '0';
                menu.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    menu.style.display = 'none';
                }, 300);
            });

            // Обработка клика для мобильных устройств
            trigger.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const isVisible = menu.style.display === 'block';
                    
                    // Закрываем все другие меню
                    document.querySelectorAll('.dropdown-menu').forEach(m => {
                        if (m !== menu) {
                            m.style.display = 'none';
                        }
                    });
                    
                    // Переключаем текущее меню
                    menu.style.display = isVisible ? 'none' : 'block';
                }
            });
        });
    }

    setupMobileMenu() {
        // Создаем кнопку мобильного меню если её нет
        if (!document.querySelector('.mobile-menu-toggle')) {
            this.createMobileMenuToggle();
        }

        const toggle = document.querySelector('.mobile-menu-toggle');
        const menu = document.querySelector('.header-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                const isOpen = menu.classList.contains('mobile-open');
                
                if (isOpen) {
                    this.closeMobileMenu();
                } else {
                    this.openMobileMenu();
                }
            });

            // Закрытие меню при клике вне его
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.header-menu') && !e.target.closest('.mobile-menu-toggle')) {
                    this.closeMobileMenu();
                }
            });

            // Закрытие меню при изменении размера окна
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    createMobileMenuToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'mobile-menu-toggle';
        toggle.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        toggle.setAttribute('aria-label', 'Открыть меню');
        
        const header = document.querySelector('.main-header');
        if (header) {
            header.appendChild(toggle);
        }
    }

    openMobileMenu() {
        const menu = document.querySelector('.header-menu');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        if (menu) {
            menu.classList.add('mobile-open');
            document.body.style.overflow = 'hidden';
        }
        
        if (toggle) {
            toggle.classList.add('active');
            toggle.setAttribute('aria-label', 'Закрыть меню');
        }
    }

    closeMobileMenu() {
        const menu = document.querySelector('.header-menu');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        if (menu) {
            menu.classList.remove('mobile-open');
            document.body.style.overflow = '';
        }
        
        if (toggle) {
            toggle.classList.remove('active');
            toggle.setAttribute('aria-label', 'Открыть меню');
        }

        // Закрываем все dropdown меню
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }

    setupSmoothScrolling() {
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

    // Добавление активного состояния при скролле
    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const menuLinks = document.querySelectorAll('.header-menu a[href^="#"]');
        
        if (sections.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    // Убираем активный класс со всех ссылок
                    menuLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Добавляем активный класс к соответствующей ссылке
                    const activeLink = document.querySelector(`.header-menu a[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
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
        // Добавляем дополнительные пункты меню для страницы автора
        const menu = document.querySelector('.header-menu ul');
        if (menu && !document.querySelector('.author-menu-items')) {
            const authorMenuItems = document.createElement('div');
            authorMenuItems.className = 'author-menu-items';
            authorMenuItems.innerHTML = `
                <li><a href="#profile">Профиль</a></li>
                <li><a href="#projects">Проекты</a></li>
                <li><a href="#skills">Навыки</a></li>
                <li><a href="#contacts">Контакты</a></li>
            `;
            
            // Вставляем перед последним элементом (Автор)
            const lastItem = menu.lastElementChild;
            menu.insertBefore(authorMenuItems, lastItem);
        }

        // Настраиваем scroll spy для страницы автора
        this.setupScrollSpy();
    }

    setupOSSelectionMenu() {
        // Специфичные настройки для страницы выбора ОС
        console.log('Setting up OS Selection page menu');
    }

    setupRemoteManagementMenu() {
        // Специфичные настройки для страницы удаленного управления
        console.log('Setting up Remote Management page menu');
    }

    setupDiagnostManagementMenu() {
        // Специфичные настройки для страницы диагностики
        console.log('Setting up Diagnostic Management page menu');
    }

    // Добавление breadcrumbs
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

    // Поиск по сайту
    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchResults = document.querySelector('.search-results');
        
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
        // Простой поиск по содержимому страниц
        const searchableContent = [
            { title: 'Главная страница', url: 'index.html', content: 'системное администрирование курсовой проект' },
            { title: 'Автор', url: 'author.html', content: 'студент университет контакты профиль' },
            { title: 'Выбор ОС', url: 'os-selection.html', content: 'операционная система windows linux' },
            { title: 'Удаленное управление', url: 'remote-management.html', content: 'teamviewer anydesk удаленный доступ' },
            { title: 'Диагностика', url: 'diagnost-management.html', content: 'мониторинг система диагностика' }
        ];

        const results = searchableContent.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.content.toLowerCase().includes(query.toLowerCase())
        );

        this.showSearchResults(results, query);
    }

    showSearchResults(results, query) {
        const searchResults = document.querySelector('.search-results');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    Ничего не найдено по запросу "${query}"
                </div>
            `;
        } else {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result-item">
                    <a href="${result.url}">
                        <h4>${result.title}</h4>
                        <p>${result.content}</p>
                    </a>
                </div>
            `).join('');
        }

        searchResults.style.display = 'block';
    }

    hideSearchResults() {
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }
}

// CSS стили для меню
const menuStyles = `
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
    
    .header-menu a.active {
        color: #c5a47e;
        position: relative;
    }
    
    .header-menu a.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        right: 0;
        height: 2px;
        background: #c5a47e;
        border-radius: 1px;
    }
    
        .breadcrumbs {
        padding: 10px 0;
        color: #b0b0b0;
        font-size: 0.9rem;
    }
    
    .breadcrumbs a {
        color: #c5a47e;
        text-decoration: none;
        transition: color 0.3s ease;
    }
    
    .breadcrumbs a:hover {
        color: #fff;
    }
    
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
    }
    
    .search-input:focus {
        outline: none;
        border-color: #c5a47e;
        box-shadow: 0 0 10px rgba(197, 164, 126, 0.3);
        width: 250px;
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
    }
    
    .search-result-item {
        padding: 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
    
    @media (max-width: 768px) {
        .mobile-menu-toggle {
            display: flex;
        }
        
        .header-menu {
            position: fixed;
            top: 0;
            left: -100%;
            width: 80%;
            height: 100vh;
            background: rgba(20, 20, 20, 0.98);
            backdrop-filter: blur(20px);
            transition: left 0.3s ease;
            z-index: 1000;
            padding-top: 80px;
        }
        
        .header-menu.mobile-open {
            left: 0;
        }
        
        .header-menu ul {
            flex-direction: column;
            padding: 20px;
        }
        
        .header-menu li {
            margin: 10px 0;
        }
        
        .header-menu a {
            font-size: 1.2rem;
            padding: 15px 0;
            display: block;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .dropdown-menu {
            position: static;
            background: rgba(0, 0, 0, 0.3);
            margin-top: 10px;
            border-radius: 5px;
        }
        
        .dropdown-menu li {
            margin: 5px 0;
        }
        
        .dropdown-menu a {
            padding: 10px 15px;
            font-size: 1rem;
            border-bottom: none;
        }
        
        .search-container {
            margin: 20px;
        }
        
        .search-input {
            width: 100%;
        }
        
        .search-input:focus {
            width: 100%;
        }
    }
`;

// Добавляем стили в документ
const styleSheet = document.createElement('style');
styleSheet.textContent = menuStyles;
document.head.appendChild(styleSheet);

// Инициализация меню
const menuManager = new MenuManager();

// Обновляем меню для текущей страницы
menuManager.updateMenuForPage();

// Настраиваем поиск
menuManager.setupSearch();

// Добавляем breadcrumbs
menuManager.addBreadcrumbs();

// Экспорт для использования в других модулях
export default MenuManager;
