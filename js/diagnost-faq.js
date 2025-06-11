class FAQManager {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.searchInput = document.getElementById('searchInput');
        this.filterTabs = document.querySelectorAll('.filter-tab');
        this.noResults = document.getElementById('noResults');
        this.scrollToTopBtn = document.getElementById('scrollToTop');
        this.loadingBar = document.querySelector('.loading-bar');
        
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.isSearching = false;
        
        this.init();
    }

    init() {
        console.log('FAQ Manager initialized');
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupKeyboardShortcuts();
        this.loadUserPreferences();
        this.setupIntersectionObserver();
        
        // Анимация загрузки
        setTimeout(() => {
            this.showLoadingComplete();
        }, 1000);
    }

    setupEventListeners() {
        // FAQ аккордеон
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => this.toggleFAQ(item));
            }
        });

        // Поиск с debouncing
        if (this.searchInput) {
            let searchTimeout;
            this.searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });

            // Очистка поиска
            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.clearSearch();
                }
            });
        }

        // Фильтры
        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', () => this.handleFilter(tab));
        });

        // Скролл
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 100));

        // Кнопка "Наверх"
        if (this.scrollToTopBtn) {
            this.scrollToTopBtn.addEventListener('click', () => {
                this.scrollToTop();
            });
        }

        // Сохранение состояния при закрытии
        window.addEventListener('beforeunload', () => {
            this.saveUserPreferences();
        });

        // Обработка изменения размера экрана
        window.addEventListener('resize', this.throttle(() => {
            this.handleResize();
        }, 250));
    }

    toggleFAQ(item) {
        const isActive = item.classList.contains('active');
        
        // Закрываем все другие FAQ если нужно (accordion mode)
        if (!isActive && this.isAccordionMode()) {
            this.faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    this.closeFAQ(otherItem);
                }
            });
        }

        // Переключаем текущий FAQ
        if (isActive) {
            this.closeFAQ(item);
        } else {
            this.openFAQ(item);
        }

        // Отслеживание для аналитики
        this.trackFAQInteraction(item, !isActive);
    }

    openFAQ(item) {
        item.classList.add('active');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle i');
        
        if (answer) {
            // Плавная анимация открытия
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
        
        if (toggle) {
            toggle.classList.remove('fa-plus');
            toggle.classList.add('fa-minus');
        }

        // Анимация для контента внутри
        setTimeout(() => {
            const content = item.querySelector('.answer-content');
            if (content) {
                content.classList.add('fade-in');
            }
        }, 200);
    }

    closeFAQ(item) {
        item.classList.remove('active');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle i');
        
        if (answer) {
            answer.style.maxHeight = '0px';
        }
        
        if (toggle) {
            toggle.classList.remove('fa-minus');
            toggle.classList.add('fa-plus');
        }
    }

    handleSearch(term) {
        this.searchTerm = term.toLowerCase().trim();
        this.isSearching = this.searchTerm.length > 0;
        
        if (this.loadingBar) {
            this.showLoadingBar();
        }

        setTimeout(() => {
            this.filterFAQs();
            this.hideLoadingBar();
        }, 500);

        // Сохраняем поисковый запрос
        localStorage.setItem('faq_search', this.searchTerm);
    }

    handleFilter(clickedTab) {
        // Обновляем активный таб
        this.filterTabs.forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');
        
        this.currentFilter = clickedTab.dataset.category;
        this.filterFAQs();

        // Сохраняем выбранный фильтр
        localStorage.setItem('faq_filter', this.currentFilter);

        // Анимация переключения
        this.animateFilterChange();
    }

    filterFAQs() {
        let visibleCount = 0;
        
        this.faqItems.forEach((item, index) => {
            let isVisible = true;

            // Фильтр по категории
            if (this.currentFilter !== 'all') {
                const itemCategory = item.dataset.category;
                if (itemCategory !== this.currentFilter) {
                    isVisible = false;
                }
            }

            // Поиск по тексту
            if (this.isSearching && isVisible) {
                const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
                const answer = item.querySelector('.answer-content').textContent.toLowerCase();
                const keywords = item.dataset.keywords || '';
                
                const searchableText = `${question} ${answer} ${keywords}`.toLowerCase();
                
                if (!searchableText.includes(this.searchTerm)) {
                    isVisible = false;
                }
            }

            // Показываем/скрываем элемент с анимацией
            if (isVisible) {
                this.showFAQItem(item, index);
                visibleCount++;
            } else {
                this.hideFAQItem(item);
            }
        });

        // Показываем сообщение если ничего не найдено
        this.toggleNoResults(visibleCount === 0);

        // Обновляем URL с параметрами поиска
        this.updateURL();
    }

    showFAQItem(item, index) {
        item.style.display = 'block';
        item.classList.remove('hidden');
        
        // Анимация появления с задержкой
        setTimeout(() => {
            item.classList.add('fade-in');
        }, index * 50);
    }

    hideFAQItem(item) {
        item.classList.remove('fade-in');
        
        setTimeout(() => {
            item.style.display = 'none';
            item.classList.add('hidden');
        }, 200);
    }

    toggleNoResults(show) {
        if (this.noResults) {
            if (show) {
                this.noResults.style.display = 'block';
                setTimeout(() => {
                    this.noResults.classList.add('fade-in');
                }, 100);
            } else {
                this.noResults.classList.remove('fade-in');
                setTimeout(() => {
                    this.noResults.style.display = 'none';
                }, 200);
            }
        }
    }

    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        this.searchTerm = '';
        this.isSearching = false;
        this.filterFAQs();
        
        // Убираем из localStorage
        localStorage.removeItem('faq_search');
        
        // Фокус на поиск
        if (this.searchInput) {
            this.searchInput.focus();
        }
    }

    handleScroll() {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollTop / documentHeight) * 100;

        // Обновляем прогресс бар
        if (this.loadingBar) {
            this.loadingBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
        }

        // Показываем/скрываем кнопку "Наверх"
        if (this.scrollToTopBtn) {
            if (scrollTop > 300) {
                this.scrollToTopBtn.classList.add('visible');
            } else {
                this.scrollToTopBtn.classList.remove('visible');
            }
        }

        // Обновляем активный раздел в навигации
        this.updateActiveSection();
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.scroll-animation');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    setupIntersectionObserver() {
        // Ленивая загрузка изображений
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

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K для фокуса на поиск
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (this.searchInput) {
                    this.searchInput.focus();
                }
            }

            // Escape для закрытия всех FAQ
            if (e.key === 'Escape') {
                this.closeAllFAQs();
            }

            // Ctrl/Cmd + Enter для открытия всех FAQ
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.openAllFAQs();
            }
        });
    }

    closeAllFAQs() {
        this.faqItems.forEach(item => this.closeFAQ(item));
    }

    openAllFAQs() {
        this.faqItems.forEach(item => this.openFAQ(item));
    }

    loadUserPreferences() {
        // Загружаем сохранённый поиск
        const savedSearch = localStorage.getItem('faq_search');
        if (savedSearch && this.searchInput) {
            this.searchInput.value = savedSearch;
            this.handleSearch(savedSearch);
        }

        // Загружаем сохранённый фильтр
        const savedFilter = localStorage.getItem('faq_filter');
        if (savedFilter) {
            const filterTab = document.querySelector(`[data-category="${savedFilter}"]`);
            if (filterTab) {
                this.handleFilter(filterTab);
            }
        }

        // Загружаем открытые FAQ
        const openFAQs = JSON.parse(localStorage.getItem('faq_open') || '[]');
        openFAQs.forEach(index => {
            if (this.faqItems[index]) {
                this.openFAQ(this.faqItems[index]);
            }
        });
    }

    saveUserPreferences() {
        // Сохраняем открытые FAQ
        const openFAQs = [];
        this.faqItems.forEach((item, index) => {
            if (item.classList.contains('active')) {
                openFAQs.push(index);
            }
        });
        localStorage.setItem('faq_open', JSON.stringify(openFAQs));
    }

    updateURL() {
        const url = new URL(window.location);
        
        // Обновляем параметры URL
        if (this.searchTerm) {
            url.searchParams.set('search', this.searchTerm);
        } else {
            url.searchParams.delete('search');
        }

        if (this.currentFilter !== 'all') {
            url.searchParams.set('filter', this.currentFilter);
        } else {
            url.searchParams.delete('filter');
        }

        // Обновляем URL без перезагрузки страницы
        window.history.replaceState({}, '', url);
    }

    showLoadingBar() {
        if (this.loadingBar) {
            this.loadingBar.style.width = '30%';
        }
    }

    hideLoadingBar() {
        if (this.loadingBar) {
            this.loadingBar.style.width = '100%';
            setTimeout(() => {
                this.loadingBar.style.width = '0%';
            }, 200);
        }
    }

    showLoadingComplete() {
        // Анимация завершения загрузки
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');
        }

        // Показываем контент с анимацией
        document.body.classList.add('loaded');
    }

    animateFilterChange() {
        // Анимация при смене фильтра
        const container = document.querySelector('.faq-container');
        if (container) {
            container.style.opacity = '0.7';
            container.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                container.style.opacity = '1';
                                container.style.transform = 'translateY(0)';
            }, 300);
        }
    }

    updateActiveSection() {
        const sections = document.querySelectorAll('.faq-category');
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.id;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Обновляем активную навигацию если есть
                this.updateActiveNavItem(sectionId);
            }
        });
    }

    updateActiveNavItem(activeId) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${activeId}`) {
                item.classList.add('active');
            }
        });
    }

    isAccordionMode() {
        // Проверяем, включен ли режим аккордеона
        return window.innerWidth < 768 || document.body.classList.contains('accordion-mode');
    }

    handleResize() {
        // Пересчитываем высоты открытых FAQ при изменении размера
        this.faqItems.forEach(item => {
            if (item.classList.contains('active')) {
                const answer = item.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            }
        });
    }

    trackFAQInteraction(item, isOpening) {
        // Отслеживание взаимодействий для аналитики
        const question = item.querySelector('.faq-question h3').textContent;
        const category = item.dataset.category;
        
        // Можно отправить данные в аналитику
        console.log('FAQ Interaction:', {
            action: isOpening ? 'open' : 'close',
            question: question,
            category: category,
            timestamp: new Date().toISOString()
        });

        // Пример отправки в Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'faq_interaction', {
                event_category: 'FAQ',
                event_label: question,
                value: isOpening ? 1 : 0
            });
        }
    }

    // Утилиты
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Публичные методы для внешнего использования
    searchFAQ(term) {
        if (this.searchInput) {
            this.searchInput.value = term;
        }
        this.handleSearch(term);
    }

    filterByCategory(category) {
        const filterTab = document.querySelector(`[data-category="${category}"]`);
        if (filterTab) {
            this.handleFilter(filterTab);
        }
    }

    openFAQByIndex(index) {
        if (this.faqItems[index]) {
            this.openFAQ(this.faqItems[index]);
        }
    }

    closeFAQByIndex(index) {
        if (this.faqItems[index]) {
            this.closeFAQ(this.faqItems[index]);
        }
    }

    getSearchStats() {
        return {
            totalFAQs: this.faqItems.length,
            visibleFAQs: document.querySelectorAll('.faq-item:not(.hidden)').length,
            currentFilter: this.currentFilter,
            searchTerm: this.searchTerm,
            isSearching: this.isSearching
        };
    }
}

// Дополнительные функции для FAQ
class FAQEnhancer {
    constructor(faqManager) {
        this.faqManager = faqManager;
        this.setupEnhancements();
    }

    setupEnhancements() {
        this.setupReadingTime();
        this.setupShareButtons();
        this.setupBookmarks();
        this.setupPrintFriendly();
        this.setupHighlighting();
    }

    setupReadingTime() {
        // Подсчет времени чтения для каждого FAQ
        this.faqManager.faqItems.forEach(item => {
            const content = item.querySelector('.answer-content');
            if (content) {
                const wordCount = content.textContent.split(/\s+/).length;
                const readingTime = Math.ceil(wordCount / 200); // 200 слов в минуту
                
                const timeElement = document.createElement('span');
                timeElement.className = 'reading-time';
                timeElement.textContent = `${readingTime} мин чтения`;
                
                const question = item.querySelector('.faq-question');
                if (question) {
                    question.appendChild(timeElement);
                }
            }
        });
    }

    setupShareButtons() {
        // Добавляем кнопки шаринга
        this.faqManager.faqItems.forEach((item, index) => {
            const shareContainer = document.createElement('div');
            shareContainer.className = 'faq-share';
            shareContainer.innerHTML = `
                <button class="share-btn" data-type="copy" data-index="${index}" title="Копировать ссылку">
                    <i class="fas fa-link"></i>
                </button>
                <button class="share-btn" data-type="twitter" data-index="${index}" title="Поделиться в Twitter">
                    <i class="fab fa-twitter"></i>
                </button>
                <button class="share-btn" data-type="facebook" data-index="${index}" title="Поделиться в Facebook">
                    <i class="fab fa-facebook"></i>
                </button>
            `;
            
            const answerContent = item.querySelector('.answer-content');
            if (answerContent) {
                answerContent.appendChild(shareContainer);
            }
        });

        // Обработчики для кнопок шаринга
        document.addEventListener('click', (e) => {
            if (e.target.closest('.share-btn')) {
                const btn = e.target.closest('.share-btn');
                const type = btn.dataset.type;
                const index = btn.dataset.index;
                this.handleShare(type, index);
            }
        });
    }

    handleShare(type, index) {
        const item = this.faqManager.faqItems[index];
        const question = item.querySelector('.faq-question h3').textContent;
        const url = `${window.location.origin}${window.location.pathname}#faq-${index}`;
        
        switch (type) {
            case 'copy':
                navigator.clipboard.writeText(url).then(() => {
                    this.showNotification('Ссылка скопирована в буфер обмена');
                });
                break;
            case 'twitter':
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(question)}&url=${encodeURIComponent(url)}`;
                window.open(twitterUrl, '_blank');
                break;
            case 'facebook':
                const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                window.open(facebookUrl, '_blank');
                break;
        }
    }

    setupBookmarks() {
        // Система закладок для FAQ
        this.bookmarks = JSON.parse(localStorage.getItem('faq_bookmarks') || '[]');
        
        this.faqManager.faqItems.forEach((item, index) => {
            const bookmarkBtn = document.createElement('button');
            bookmarkBtn.className = 'bookmark-btn';
            bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
            bookmarkBtn.title = 'Добавить в закладки';
            bookmarkBtn.addEventListener('click', () => this.toggleBookmark(index));
            
            const question = item.querySelector('.faq-question');
            if (question) {
                question.appendChild(bookmarkBtn);
            }
            
            // Устанавливаем состояние закладки
            if (this.bookmarks.includes(index)) {
                bookmarkBtn.classList.add('bookmarked');
                bookmarkBtn.title = 'Удалить из закладок';
            }
        });
    }

    toggleBookmark(index) {
        const bookmarkIndex = this.bookmarks.indexOf(index);
        const btn = this.faqManager.faqItems[index].querySelector('.bookmark-btn');
        
        if (bookmarkIndex > -1) {
            // Удаляем из закладок
            this.bookmarks.splice(bookmarkIndex, 1);
            btn.classList.remove('bookmarked');
            btn.title = 'Добавить в закладки';
            this.showNotification('Удалено из закладок');
        } else {
            // Добавляем в закладки
            this.bookmarks.push(index);
            btn.classList.add('bookmarked');
            btn.title = 'Удалить из закладок';
            this.showNotification('Добавлено в закладки');
        }
        
        localStorage.setItem('faq_bookmarks', JSON.stringify(this.bookmarks));
    }

    setupPrintFriendly() {
        // Добавляем кнопку печати
        const printBtn = document.createElement('button');
        printBtn.className = 'print-btn';
        printBtn.innerHTML = '<i class="fas fa-print"></i> Версия для печати';
        printBtn.addEventListener('click', () => this.generatePrintVersion());
        
        const header = document.querySelector('.page-header');
        if (header) {
            header.appendChild(printBtn);
        }
    }

    generatePrintVersion() {
        const printWindow = window.open('', '_blank');
        const visibleFAQs = document.querySelectorAll('.faq-item:not(.hidden)');
        
        let printContent = `
            <html>
            <head>
                <title>FAQ - Версия для печати</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .faq-item { margin-bottom: 30px; border-bottom: 1px solid #ccc; padding-bottom: 20px; }
                    .faq-question { font-weight: bold; font-size: 18px; margin-bottom: 10px; }
                    .faq-answer { margin-left: 20px; line-height: 1.6; }
                    .page-break { page-break-before: always; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                <h1>FAQ - Диагностика и мониторинг системы</h1>
                <p>Дата печати: ${new Date().toLocaleDateString('ru-RU')}</p>
        `;
        
        visibleFAQs.forEach(item => {
            const question = item.querySelector('.faq-question h3').textContent;
            const answer = item.querySelector('.answer-content').innerHTML;
            
            printContent += `
                <div class="faq-item">
                    <div class="faq-question">${question}</div>
                    <div class="faq-answer">${answer}</div>
                </div>
            `;
        });
        
        printContent += '</body></html>';
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }

    setupHighlighting() {
        // Подсветка поискового запроса
        this.originalContents = new Map();
        
        // Сохраняем оригинальный контент
        this.faqManager.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3');
            const answer = item.querySelector('.answer-content');
            
            if (question) this.originalContents.set(question, question.innerHTML);
            if (answer) this.originalContents.set(answer, answer.innerHTML);
        });
    }

    highlightSearchTerm(term) {
        if (!term) {
            this.clearHighlights();
            return;
        }
        
        const regex = new RegExp(`(${term})`, 'gi');
        
        this.faqManager.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3');
            const answer = item.querySelector('.answer-content');
            
            if (question) {
                const original = this.originalContents.get(question);
                question.innerHTML = original.replace(regex, '<mark>$1</mark>');
            }
            
            if (answer) {
                const original = this.originalContents.get(answer);
                answer.innerHTML = original.replace(regex, '<mark>$1</mark>');
            }
        });
    }

    clearHighlights() {
        this.originalContents.forEach((original, element) => {
            element.innerHTML = original;
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Инициализация FAQ системы
document.addEventListener('DOMContentLoaded', () => {
    // Основной менеджер FAQ
    const faqManager = new FAQManager();
    
    // Дополнительные улучшения
    const faqEnhancer = new FAQEnhancer(faqManager);
    
    // Глобальный доступ для отладки
    window.faqManager = faqManager;
    window.faqEnhancer = faqEnhancer;
    
    // Обработка URL параметров при загрузке
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
        const filterParam = urlParams.get('filter');
    
    if (searchParam) {
        faqManager.searchFAQ(searchParam);
    }
    
    if (filterParam) {
        faqManager.filterByCategory(filterParam);
    }
    
    // Обработка якорных ссылок
    const hash = window.location.hash;
    if (hash && hash.startsWith('#faq-')) {
        const index = parseInt(hash.replace('#faq-', ''));
        if (faqManager.faqItems[index]) {
            setTimeout(() => {
                faqManager.openFAQByIndex(index);
                faqManager.faqItems[index].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 500);
        }
    }
    
    console.log('✅ FAQ System fully initialized');
});

// Дополнительные утилиты для FAQ
class FAQAnalytics {
    constructor() {
        this.interactions = [];
        this.sessionStart = Date.now();
        this.setupTracking();
    }
    
    setupTracking() {
        // Отслеживание времени на странице
        this.trackTimeOnPage();
        
        // Отслеживание скролла
        this.trackScrollDepth();
        
        // Отслеживание кликов
        this.trackClicks();
    }
    
    trackTimeOnPage() {
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - this.sessionStart;
            this.logInteraction('page_time', { duration: timeSpent });
        });
    }
    
    trackScrollDepth() {
        let maxScroll = 0;
        const trackingPoints = [25, 50, 75, 100];
        const trackedPoints = new Set();
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            maxScroll = Math.max(maxScroll, scrollPercent);
            
            trackingPoints.forEach(point => {
                if (scrollPercent >= point && !trackedPoints.has(point)) {
                    trackedPoints.add(point);
                    this.logInteraction('scroll_depth', { percent: point });
                }
            });
        });
    }
    
    trackClicks() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button, a, .clickable');
            if (target) {
                this.logInteraction('click', {
                    element: target.tagName,
                    class: target.className,
                    text: target.textContent.trim().substring(0, 50)
                });
            }
        });
    }
    
    logInteraction(type, data) {
        const interaction = {
            type,
            timestamp: Date.now(),
            data,
            url: window.location.href
        };
        
        this.interactions.push(interaction);
        
        // Отправляем в консоль для отладки
        console.log('FAQ Analytics:', interaction);
        
        // Здесь можно добавить отправку на сервер аналитики
        this.sendToAnalytics(interaction);
    }
    
    sendToAnalytics(interaction) {
        // Пример отправки в Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', interaction.type, {
                custom_parameter: JSON.stringify(interaction.data),
                page_location: interaction.url
            });
        }
        
        // Пример отправки в собственную аналитику
        // fetch('/api/analytics', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(interaction)
        // }).catch(console.error);
    }
    
    getAnalyticsReport() {
        return {
            sessionDuration: Date.now() - this.sessionStart,
            totalInteractions: this.interactions.length,
            interactionTypes: this.interactions.reduce((acc, int) => {
                acc[int.type] = (acc[int.type] || 0) + 1;
                return acc;
            }, {}),
            interactions: this.interactions
        };
    }
}

// Система уведомлений
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.container = this.createContainer();
    }
    
    createContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
        return container;
    }
    
    show(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${this.getBackgroundColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: all 0.3s ease;
            pointer-events: auto;
            cursor: pointer;
            max-width: 350px;
            word-wrap: break-word;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas ${this.getIcon(type)}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; margin-left: auto;">
                    ×
                </button>
            </div>
        `;
        
        this.container.appendChild(notification);
        this.notifications.push(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Автоматическое скрытие
        if (duration > 0) {
            setTimeout(() => {
                this.hide(notification);
            }, duration);
        }
        
        // Клик для закрытия
        notification.addEventListener('click', () => {
            this.hide(notification);
        });
        
        return notification;
    }
    
    hide(notification) {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }
    
    getBackgroundColor(type) {
        const colors = {
            info: '#3498db',
            success: '#2ecc71',
            warning: '#f39c12',
            error: '#e74c3c'
        };
        return colors[type] || colors.info;
    }
    
    getIcon(type) {
        const icons = {
            info: 'fa-info-circle',
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle'
        };
        return icons[type] || icons.info;
    }
    
    clear() {
        this.notifications.forEach(notification => this.hide(notification));
    }
}

// Система горячих клавиш
class KeyboardShortcuts {
    constructor(faqManager) {
        this.faqManager = faqManager;
        this.shortcuts = new Map();
        this.setupDefaultShortcuts();
        this.setupEventListeners();
    }
    
    setupDefaultShortcuts() {
        // Регистрируем горячие клавиши
        this.register('ctrl+k', () => this.focusSearch());
        this.register('ctrl+/', () => this.showShortcutsHelp());
        this.register('escape', () => this.handleEscape());
        this.register('ctrl+enter', () => this.expandAllFAQs());
        this.register('ctrl+shift+enter', () => this.collapseAllFAQs());
        this.register('alt+1', () => this.faqManager.filterByCategory('overview'));
        this.register('alt+2', () => this.faqManager.filterByCategory('installation'));
        this.register('alt+3', () => this.faqManager.filterByCategory('troubleshooting'));
        this.register('alt+4', () => this.faqManager.filterByCategory('advanced'));
    }
    
    register(shortcut, callback) {
        this.shortcuts.set(shortcut, callback);
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            const shortcut = this.getShortcutString(e);
            const callback = this.shortcuts.get(shortcut);
            
            if (callback && !this.isTyping(e)) {
                e.preventDefault();
                callback();
            }
        });
    }
    
    getShortcutString(e) {
        const parts = [];
        
        if (e.ctrlKey || e.metaKey) parts.push('ctrl');
        if (e.altKey) parts.push('alt');
        if (e.shiftKey) parts.push('shift');
        
        const key = e.key.toLowerCase();
        if (key !== 'control' && key !== 'alt' && key !== 'shift' && key !== 'meta') {
            parts.push(key);
        }
        
        return parts.join('+');
    }
    
    isTyping(e) {
        const activeElement = document.activeElement;
        const typingElements = ['INPUT', 'TEXTAREA', 'SELECT'];
        const isContentEditable = activeElement && activeElement.contentEditable === 'true';
        
        return typingElements.includes(activeElement.tagName) || isContentEditable;
    }
    
    focusSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    handleEscape() {
        // Закрываем все открытые элементы
        this.faqManager.closeAllFAQs();
        this.faqManager.clearSearch();
        
        // Убираем фокус с активного элемента
        if (document.activeElement) {
            document.activeElement.blur();
        }
    }
    
    expandAllFAQs() {
        this.faqManager.openAllFAQs();
        window.notificationSystem?.show('Все FAQ развернуты', 'info', 2000);
    }
    
    collapseAllFAQs() {
        this.faqManager.closeAllFAQs();
        window.notificationSystem?.show('Все FAQ свернуты', 'info', 2000);
    }
    
    showShortcutsHelp() {
        const shortcuts = [
            { key: 'Ctrl+K', description: 'Фокус на поиск' },
            { key: 'Escape', description: 'Закрыть все FAQ и очистить поиск' },
            { key: 'Ctrl+Enter', description: 'Развернуть все FAQ' },
            { key: 'Ctrl+Shift+Enter', description: 'Свернуть все FAQ' },
            { key: 'Alt+1-4', description: 'Переключение между категориями' },
            { key: 'Ctrl+/', description: 'Показать эту справку' }
        ];
        
        let helpContent = '<div style="max-width: 400px;"><h3>Горячие клавиши</h3><ul style="list-style: none; padding: 0;">';
        
        shortcuts.forEach(shortcut => {
            helpContent += `
                <li style="display: flex; justify-content: space-between; margin: 10px 0; padding: 8px; background: rgba(0,0,0,0.1); border-radius: 4px;">
                    <kbd style="background: #333; color: #fff; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${shortcut.key}</kbd>
                    <span style="margin-left: 10px; flex: 1;">${shortcut.description}</span>
                </li>
            `;
        });
        
        helpContent += '</ul></div>';
        
        this.showModal('Горячие клавиши', helpContent);
    }
    
    showModal(title, content) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
        `;
        
        modal.innerHTML = `
            <div style="background: #fff; color: #333; padding: 30px; border-radius: 10px; max-width: 90vw; max-height: 90vh; overflow: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0;">${title}</h2>
                    <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
                </div>
                ${content}
            </div>
        `;
        
        modal.className = 'modal';
        document.body.appendChild(modal);
        
        // Закрытие по клику вне модала
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Закрытие по Escape
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
}

// Инициализация дополнительных систем
document.addEventListener('DOMContentLoaded', () => {
    // Система уведомлений
    window.notificationSystem = new NotificationSystem();
    
    // Аналитика
       window.faqAnalytics = new FAQAnalytics();
    
    // Горячие клавиши (инициализируем после создания faqManager)
    setTimeout(() => {
        if (window.faqManager) {
            window.keyboardShortcuts = new KeyboardShortcuts(window.faqManager);
        }
    }, 100);
    
    // Показываем уведомление о готовности
    setTimeout(() => {
        window.notificationSystem?.show('FAQ система готова к работе! Нажмите Ctrl+/ для справки по горячим клавишам', 'success', 5000);
    }, 1500);
});

// Дополнительные утилиты
const FAQUtils = {
    // Экспорт FAQ в различные форматы
    exportToJSON() {
        const faqData = [];
        
        document.querySelectorAll('.faq-item').forEach(item => {
            const question = item.querySelector('.faq-question h3')?.textContent || '';
            const answer = item.querySelector('.answer-content')?.textContent || '';
            const category = item.dataset.category || '';
            const keywords = item.dataset.keywords || '';
            
            faqData.push({
                question,
                answer,
                category,
                keywords: keywords.split(' ').filter(k => k.length > 0)
            });
        });
        
        const blob = new Blob([JSON.stringify(faqData, null, 2)], { type: 'application/json' });
        this.downloadFile(blob, 'faq-export.json');
    },
    
    exportToCSV() {
        let csvContent = 'Question,Answer,Category,Keywords\n';
        
        document.querySelectorAll('.faq-item').forEach(item => {
            const question = this.escapeCsv(item.querySelector('.faq-question h3')?.textContent || '');
            const answer = this.escapeCsv(item.querySelector('.answer-content')?.textContent.replace(/\s+/g, ' ').trim() || '');
            const category = item.dataset.category || '';
            const keywords = item.dataset.keywords || '';
            
            csvContent += `"${question}","${answer}","${category}","${keywords}"\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        this.downloadFile(blob, 'faq-export.csv');
    },
    
    escapeCsv(text) {
        return text.replace(/"/g, '""');
    },
    
    downloadFile(blob, filename) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    },
    
    // Генерация RSS фида
    generateRSSFeed() {
        const rssItems = [];
        
        document.querySelectorAll('.faq-item').forEach((item, index) => {
            const question = item.querySelector('.faq-question h3')?.textContent || '';
            const answer = item.querySelector('.answer-content')?.innerHTML || '';
            const category = item.dataset.category || '';
            
            rssItems.push(`
                <item>
                    <title><![CDATA[${question}]]></title>
                    <description><![CDATA[${answer}]]></description>
                    <category>${category}</category>
                    <guid>faq-${index}</guid>
                    <pubDate>${new Date().toUTCString()}</pubDate>
                </item>
            `);
        });
        
        const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
            <channel>
                <title>FAQ - Диагностика и мониторинг системы</title>
                <description>Часто задаваемые вопросы по системам диагностики</description>
                <link>${window.location.href}</link>
                <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
                ${rssItems.join('')}
            </channel>
        </rss>`;
        
        const blob = new Blob([rssContent], { type: 'application/rss+xml' });
        this.downloadFile(blob, 'faq-feed.xml');
    },
    
    // Поиск дубликатов вопросов
    findDuplicateQuestions() {
        const questions = {};
        const duplicates = [];
        
        document.querySelectorAll('.faq-item').forEach((item, index) => {
            const question = item.querySelector('.faq-question h3')?.textContent.toLowerCase().trim();
            
            if (questions[question]) {
                duplicates.push({
                    question,
                    indices: [questions[question], index]
                });
            } else {
                questions[question] = index;
            }
        });
        
        return duplicates;
    },
    
    // Анализ качества контента
    analyzeContentQuality() {
        const analysis = {
            totalFAQs: 0,
            averageQuestionLength: 0,
            averageAnswerLength: 0,
            shortAnswers: [], // меньше 50 символов
            longQuestions: [], // больше 200 символов
            missingKeywords: [],
            categoriesDistribution: {}
        };
        
        let totalQuestionLength = 0;
        let totalAnswerLength = 0;
        
        document.querySelectorAll('.faq-item').forEach((item, index) => {
            const question = item.querySelector('.faq-question h3')?.textContent || '';
            const answer = item.querySelector('.answer-content')?.textContent || '';
            const category = item.dataset.category || 'uncategorized';
            const keywords = item.dataset.keywords || '';
            
            analysis.totalFAQs++;
            totalQuestionLength += question.length;
            totalAnswerLength += answer.length;
            
            // Анализ коротких ответов
            if (answer.length < 50) {
                analysis.shortAnswers.push({ index, question, answerLength: answer.length });
            }
            
            // Анализ длинных вопросов
            if (question.length > 200) {
                analysis.longQuestions.push({ index, question, questionLength: question.length });
            }
            
            // Анализ отсутствующих ключевых слов
            if (!keywords.trim()) {
                analysis.missingKeywords.push({ index, question });
            }
            
            // Распределение по категориям
            analysis.categoriesDistribution[category] = (analysis.categoriesDistribution[category] || 0) + 1;
        });
        
        analysis.averageQuestionLength = Math.round(totalQuestionLength / analysis.totalFAQs);
        analysis.averageAnswerLength = Math.round(totalAnswerLength / analysis.totalFAQs);
        
        return analysis;
    },
    
    // Генерация отчета о производительности
    generatePerformanceReport() {
        const startTime = performance.now();
        
        // Тестируем скорость поиска
        const searchTerms = ['система', 'установка', 'ошибка', 'настройка', 'мониторинг'];
        let searchTimes = [];
        
        searchTerms.forEach(term => {
            const searchStart = performance.now();
            window.faqManager?.searchFAQ(term);
            const searchEnd = performance.now();
            searchTimes.push(searchEnd - searchStart);
        });
        
        // Тестируем скорость фильтрации
        const categories = ['overview', 'installation', 'troubleshooting', 'advanced'];
        let filterTimes = [];
        
        categories.forEach(category => {
            const filterStart = performance.now();
            window.faqManager?.filterByCategory(category);
            const filterEnd = performance.now();
            filterTimes.push(filterEnd - filterStart);
        });
        
        const endTime = performance.now();
        
        return {
            totalTestTime: endTime - startTime,
            searchPerformance: {
                averageTime: searchTimes.reduce((a, b) => a + b, 0) / searchTimes.length,
                minTime: Math.min(...searchTimes),
                maxTime: Math.max(...searchTimes)
            },
            filterPerformance: {
                averageTime: filterTimes.reduce((a, b) => a + b, 0) / filterTimes.length,
                minTime: Math.min(...filterTimes),
                maxTime: Math.max(...filterTimes)
            },
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + ' MB',
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + ' MB',
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + ' MB'
            } : 'Недоступно',
            recommendations: this.getPerformanceRecommendations(searchTimes, filterTimes)
        };
    },
    
    getPerformanceRecommendations(searchTimes, filterTimes) {
        const recommendations = [];
        const avgSearchTime = searchTimes.reduce((a, b) => a + b, 0) / searchTimes.length;
        const avgFilterTime = filterTimes.reduce((a, b) => a + b, 0) / filterTimes.length;
        
        if (avgSearchTime > 50) {
            recommendations.push('Рекомендуется оптимизировать алгоритм поиска - добавить индексацию');
        }
        
        if (avgFilterTime > 30) {
            recommendations.push('Фильтрация работает медленно - рассмотрите кеширование результатов');
        }
        
        if (document.querySelectorAll('.faq-item').length > 100) {
            recommendations.push('Большое количество FAQ - рекомендуется виртуализация или пагинация');
        }
        
        return recommendations.length > 0 ? recommendations : ['Производительность в норме'];
    }
};

// Глобальный доступ к утилитам
window.FAQUtils = FAQUtils;

// Команды для консоли разработчика
window.faqCommands = {
    search: (term) => window.faqManager?.searchFAQ(term),
    filter: (category) => window.faqManager?.filterByCategory(category),
    openAll: () => window.faqManager?.openAllFAQs(),
    closeAll: () => window.faqManager?.closeAllFAQs(),
    exportJSON: () => FAQUtils.exportToJSON(),
    exportCSV: () => FAQUtils.exportToCSV(),
    analyze: () => console.table(FAQUtils.analyzeContentQuality()),
    performance: () => console.log(FAQUtils.generatePerformanceReport()),
    shortcuts: () => window.keyboardShortcuts?.showShortcutsHelp(),
    stats: () => console.log(window.faqManager?.getSearchStats()),
    analytics: () => console.log(window.faqAnalytics?.getAnalyticsReport())
};

// Информация для разработчиков
console.log(`
🔧 FAQ System Developer Console Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 Basic Commands:
   faqCommands.search('term')     - Search FAQ
   faqCommands.filter('category') - Filter by category
   faqCommands.openAll()          - Open all FAQs
   faqCommands.closeAll()         - Close all FAQs

📊 Analytics & Stats:
   faqCommands.stats()            - Show search statistics  
   faqCommands.analytics()        - Show user analytics
   faqCommands.performance()      - Performance report
   faqCommands.analyze()          - Content quality analysis

💾 Export Options:
   faqCommands.exportJSON()       - Export to JSON
   faqCommands.exportCSV()        - Export to CSV

🎹 Keyboard Shortcuts:
   faqCommands.shortcuts()        - Show shortcuts help
   
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// Обработка ошибок
window.addEventListener('error', (e) => {
    const errorInfo = {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    console.error('FAQ System Error:', errorInfo);
    
    // Показываем пользователю уведомление об ошибке
    if (window.notificationSystem) {
        window.notificationSystem.show(
            'Произошла ошибка в работе FAQ системы. Обновите страницу или обратитесь к администратору.',
            'error',
            0 // Не скрывать автоматически
        );
    }
    
    // Отправляем ошибку в аналитику (если настроено)
    if (window.faqAnalytics) {
        window.faqAnalytics.logInteraction('error', errorInfo);
    }
});

// Обработка неперехваченных промисов
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    
    if (window.faqAnalytics) {
        window.faqAnalytics.logInteraction('promise_rejection', {
            reason: e.reason?.toString(),
            timestamp: new Date().toISOString()
        });
    }
});

// Финальная проверка системы
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const systemCheck = {
            faqManager: !!window.faqManager,
            notificationSystem: !!window.notificationSystem,
            analytics: !!window.faqAnalytics,
            shortcuts: !!window.keyboardShortcuts,
            utils: !!window.FAQUtils
        };
        
        const allSystemsReady = Object.values(systemCheck).every(Boolean);
        
        if (allSystemsReady) {
            console.log('✅ All FAQ systems initialized successfully');
        } else {
            console.warn('⚠️ Some FAQ systems failed to initialize:', systemCheck);
        }
        
        // Логируем для аналитики
        if (window.faqAnalytics) {
            window.faqAnalytics.logInteraction('system_check', systemCheck);
        }
    }, 2000);
});

// Экспорт для модульной системы (если используется)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FAQManager,
        FAQEnhancer,
        FAQAnalytics,
        NotificationSystem,
        KeyboardShortcuts,
        FAQUtils
    };
}

// AMD модули
if (typeof define === 'function' && define.amd) {
    define('faq-functionality', [], function() {
        return {
            FAQManager,
            FAQEnhancer,
            FAQAnalytics,
            NotificationSystem,
            KeyboardShortcuts,
            FAQUtils
        };
    });
}



