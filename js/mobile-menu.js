// Полностью переписанный mobile-menu.js с правильной обработкой touch
export class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('mobileMenuToggle');
        this.sidebarMenu = document.getElementById('sidebarMenu');
        this.menuOverlay = document.getElementById('menuOverlay');
        this.closeMenu = document.getElementById('closeMenu');
        this.dropdowns = document.querySelectorAll('.sidebar-menu .mobile-dropdown');
        this.isMenuOpen = false;
        
        // Touch обработка
        this.touchStartY = 0;
        this.touchStartX = 0;
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        console.log('MobileMenu initialized, touch device:', this.isTouchDevice);
        this.init();
    }

    init() {
        if (!this.menuToggle || !this.sidebarMenu) {
            console.log('Menu elements not found');
            return;
        }

        // Добавляем touch класс для CSS
        if (this.isTouchDevice) {
            document.body.classList.add('touch-device');
        }

        this.setupMenuToggle();
        this.setupMenuClosing();
        this.setupDropdowns();
        this.setupMenuLinks();
        this.setupKeyboardEvents();
        this.setupResizeHandler();
    }

    setupMenuToggle() {
        // Используем и click и touch события для надежности
        this.menuToggle.addEventListener('click', this.handleMenuToggle.bind(this));
        
        if (this.isTouchDevice) {
            this.menuToggle.addEventListener('touchstart', this.handleMenuToggleTouch.bind(this), { passive: true });
            this.menuToggle.addEventListener('touchend', this.handleMenuToggleTouch.bind(this), { passive: true });
        }
    }

    handleMenuToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Menu toggle clicked');
        this.openMenu();
    }

    handleMenuToggleTouch(e) {
        if (e.type === 'touchstart') {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        } else if (e.type === 'touchend') {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            // Проверяем, что это тап, а не свайп
            const deltaX = Math.abs(touchEndX - this.touchStartX);
            const deltaY = Math.abs(touchEndY - this.touchStartY);
            
            if (deltaX < 10 && deltaY < 10) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Menu toggle touched');
                this.openMenu();
            }
        }
    }

    setupMenuClosing() {
        // Кнопка закрытия
        if (this.closeMenu) {
            this.closeMenu.addEventListener('click', this.handleCloseMenu.bind(this));
            if (this.isTouchDevice) {
                this.closeMenu.addEventListener('touchend', this.handleCloseMenu.bind(this));
            }
        }

        // Оверлей
        if (this.menuOverlay) {
            this.menuOverlay.addEventListener('click', this.handleCloseMenu.bind(this));
            if (this.isTouchDevice) {
                this.menuOverlay.addEventListener('touchend', this.handleCloseMenu.bind(this));
            }
        }
    }

    handleCloseMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Menu close triggered');
        this.closeMenuHandler();
    }

    setupDropdowns() {
        this.dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) {
                // Обычный клик
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Dropdown clicked');
                    this.toggleDropdown(dropdown);
                });

                // Touch события для мобильных
                if (this.isTouchDevice) {
                    let touchStartTime = 0;
                    
                    toggle.addEventListener('touchstart', (e) => {
                        touchStartTime = Date.now();
                        this.touchStartX = e.touches[0].clientX;
                        this.touchStartY = e.touches[0].clientY;
                    }, { passive: true });

                    toggle.addEventListener('touchend', (e) => {
                        const touchEndTime = Date.now();
                        const touchEndX = e.changedTouches[0].clientX;
                        const touchEndY = e.changedTouches[0].clientY;
                        
                        const deltaX = Math.abs(touchEndX - this.touchStartX);
                        const deltaY = Math.abs(touchEndY - this.touchStartY);
                        const deltaTime = touchEndTime - touchStartTime;
                        
                        // Проверяем, что это быстрый тап
                        if (deltaX < 15 && deltaY < 15 && deltaTime < 500) {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Dropdown touched');
                            this.toggleDropdown(dropdown);
                        }
                    }, { passive: false });
                }
            }
        });
    }

    setupMenuLinks() {
        const menuItems = document.querySelectorAll('.sidebar-menu .menu-item:not(.dropdown-toggle)');
        menuItems.forEach(item => {
            const handleLinkClick = () => {
                if (!item.getAttribute('href').startsWith('#')) {
                    this.closeMenuHandler();
                }
            };

            item.addEventListener('click', handleLinkClick);
            
            if (this.isTouchDevice) {
                item.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    handleLinkClick();
                    // Программно кликаем по ссылке
                    setTimeout(() => {
                        window.location.href = item.getAttribute('href');
                    }, 100);
                });
            }
        });

        // Обработка внешних ссылок
        const externalLinks = document.querySelectorAll('.sidebar-menu .dropdown-menu a[target="_blank"]');
        externalLinks.forEach(link => {
            const handleExternalLink = () => {
                setTimeout(() => {
                    this.closeMenuHandler();
                }, 100);
            };

            link.addEventListener('click', handleExternalLink);
            
            if (this.isTouchDevice) {
                link.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    handleExternalLink();
                    window.open(link.getAttribute('href'), '_blank');
                });
            }
        });
    }

    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenuHandler();
            }
        });
    }

    setupResizeHandler() {
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMenuHandler();
            }
        });
    }

    openMenu() {
        console.log('Opening menu');
        this.sidebarMenu.classList.add('active');
        if (this.menuOverlay) {
            this.menuOverlay.classList.add('active');
        }
        this.menuToggle.classList.add('active');
        
        // Проверяем, не слайдер ли это страница
        const isSliderPage = document.querySelector('.slider-container') !== null;
        if (!isSliderPage) {
            document.body.style.overflow = 'hidden';
        }
        
        this.isMenuOpen = true;
    }

    closeMenuHandler() {
        console.log('Closing menu');
        this.sidebarMenu.classList.remove('active');
        if (this.menuOverlay) {
            this.menuOverlay.classList.remove('active');
        }
        this.menuToggle.classList.remove('active');
        
        // Восстанавливаем скролл только если не слайдер
        const isSliderPage = document.querySelector('.slider-container') !== null;
        if (!isSliderPage) {
            document.body.style.overflow = '';
        }
        
        this.isMenuOpen = false;
        
        // Закрываем dropdown с задержкой
        setTimeout(() => {
            this.dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.style.maxHeight = '0px';
                }
            });
        }, 300);
    }

    toggleDropdown(dropdown) {
        console.log('Toggling dropdown');
        const isCurrentlyActive = dropdown.classList.contains('active');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
        if (!dropdownMenu) return;

        // Закрываем все другие
        this.dropdowns.forEach(item => {
            if (item !== dropdown && item.classList.contains('active')) {
                item.classList.remove('active');
                const otherMenu = item.querySelector('.dropdown-menu');
                if (otherMenu) {
                    otherMenu.style.maxHeight = '0px';
                }
            }
        });

        if (isCurrentlyActive) {
            dropdown.classList.remove('active');
            dropdownMenu.style.maxHeight = '0px';
        } else {
            dropdown.classList.add('active');
            
            // Вычисляем высоту
            const items = dropdownMenu.querySelectorAll('li');
            let totalHeight = 0;
            
            items.forEach(item => {
                totalHeight += item.scrollHeight + 2;
            });
            
            dropdownMenu.style.maxHeight = (totalHeight + 20) + 'px';
        }
    }

    forceClose() {
        this.closeMenuHandler();
    }
}
