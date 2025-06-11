// Класс для управления мобильным меню
export class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('mobileMenuToggle');
        this.sidebarMenu = document.getElementById('sidebarMenu');
        this.menuOverlay = document.getElementById('menuOverlay');
        this.closeMenu = document.getElementById('closeMenu');
        this.dropdowns = document.querySelectorAll('.sidebar-menu .dropdown');
        this.isMenuOpen = false;
        
        console.log('MobileMenu initialized');
        console.log('Found dropdowns:', this.dropdowns.length);
        
        // Проверяем все клики по документу
        document.addEventListener('click', (e) => {
            console.log('Global click detected on:', e.target);
            if (e.target.closest('.dropdown-toggle')) {
                console.log('Click on dropdown-toggle detected!');
            }
        }, true); // true = capture phase
        
        this.init();
    }

    init() {
        if (!this.menuToggle || !this.sidebarMenu) {
            console.log('Menu elements not found');
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

        // Обработка выпадающих меню через глобальный обработчик
        
        document.addEventListener('click', (e) => {
            if (e.target.closest('.dropdown-toggle') && e.target.closest('.sidebar-menu')) {
                console.log('Dropdown toggle clicked via global handler');
                e.preventDefault();
                e.stopPropagation();
                
                const dropdown = e.target.closest('.dropdown');
                if (dropdown) {
                    this.toggleDropdown(dropdown);
                }
            }
        }, true); // capture phase

        // Обработка обычных ссылок
        const menuItems = document.querySelectorAll('.sidebar-menu .menu-item:not(.dropdown-toggle)');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                if (!item.getAttribute('href').startsWith('#')) {
                    this.closeMenuHandler();
                }
            });
        });

        // Обработка внешних ссылок в подменю
        const externalLinks = document.querySelectorAll('.sidebar-menu .dropdown-menu a[target="_blank"]');
        externalLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => {
                    this.closeMenuHandler();
                }, 100);
            });
        });

        // Закрытие меню при изменении размера экрана
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMenuHandler();
            }
        });

        // Закрытие меню при нажатии Escape
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
        document.body.style.overflow = 'hidden';
        this.isMenuOpen = true;
    }

    closeMenuHandler() {
        this.sidebarMenu.classList.remove('active');
        if (this.menuOverlay) {
            this.menuOverlay.classList.remove('active');
        }
        this.menuToggle.classList.remove('active');
        document.body.style.overflow = '';
        this.isMenuOpen = false;
        
        // Закрываем все выпадающие меню с задержкой
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

        // Закрываем все другие выпадающие меню
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
            // Закрываем текущее меню
            dropdown.classList.remove('active');
            dropdownMenu.style.maxHeight = '0px';
        } else {
            // Открываем текущее меню
            dropdown.classList.add('active');
            
            // Простой расчет высоты
            const items = dropdownMenu.querySelectorAll('li');
            let totalHeight = 0;
            
            items.forEach(item => {
                totalHeight += item.scrollHeight + 2; // +2 для отступов
            });
            
            // Устанавливаем высоту
            dropdownMenu.style.maxHeight = (totalHeight + 20) + 'px';
        }
    }

    // Метод для программного закрытия меню
    forceClose() {
        this.closeMenuHandler();
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // Скрываем элементы мобильного меню на десктопе
    function checkScreenSize() {
        const isMobile = window.innerWidth <= 768;
        const mobileElements = [
            document.getElementById('mobileMenuToggle'),
            document.getElementById('sidebarMenu'),
            document.getElementById('menuOverlay')
        ];
        
        mobileElements.forEach(element => {
            if (element) {
                element.style.display = isMobile ? '' : 'none';
            }
        });
    }
    
    // Проверяем при загрузке и изменении размера окна
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeMenu = document.getElementById('closeMenu');

    // Открытие меню
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebarMenu.classList.add('active');
            menuOverlay.classList.add('active');
            mobileMenuToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Закрытие меню
    function closeMobileMenu() {
        sidebarMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', closeMobileMenu);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMobileMenu);
    }

    // Обработка выпадающих меню в боковом меню
    const mobileDropdowns = document.querySelectorAll('.mobile-dropdown .dropdown-toggle');
    mobileDropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.closest('.mobile-dropdown');
            parent.classList.toggle('active');
        });
    });
});

