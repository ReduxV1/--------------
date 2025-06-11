// Упрощенная версия без конфликтов
export class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('mobileMenuToggle');
        this.sidebarMenu = document.getElementById('sidebarMenu');
        this.menuOverlay = document.getElementById('menuOverlay');
        this.closeMenu = document.getElementById('closeMenu');
        this.dropdowns = document.querySelectorAll('.sidebar-menu .mobile-dropdown');
        this.isMenuOpen = false;
        
        this.init();
    }

    init() {
        if (!this.menuToggle || !this.sidebarMenu) {
            return;
        }

        // Открытие меню
        this.menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openMenu();
        });

        // Закрытие меню
        if (this.closeMenu) {
            this.closeMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeMenuHandler();
            });
        }

        if (this.menuOverlay) {
            this.menuOverlay.addEventListener('click', () => {
                this.closeMenuHandler();
            });
        }

        // Обработка dropdown только в мобильном меню
        this.dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleDropdown(dropdown);
                });
            }
        });

        // Обработка обычных ссылок
        const menuItems = document.querySelectorAll('.sidebar-menu .menu-item:not(.dropdown-toggle)');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                if (!item.getAttribute('href').startsWith('#')) {
                    this.closeMenuHandler();
                }
            });
        });

        // Закрытие при изменении размера
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMenuHandler();
            }
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenuHandler();
            }
        });
    }

    openMenu() {
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

// УБИРАЕМ дублированную инициализацию!
// Инициализация теперь только в main.js
