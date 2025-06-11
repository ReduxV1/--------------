// Класс для управления мобильным меню
export class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('mobileMenuToggle');
        this.sidebarMenu = document.getElementById('sidebarMenu');
        this.menuOverlay = document.getElementById('menuOverlay');
        this.closeMenu = document.getElementById('closeMenu');
        this.dropdowns = document.querySelectorAll('.sidebar-menu .mobile-dropdown');
        this.isMenuOpen = false;
        
        console.log('MobileMenu initialized');
        console.log('Found dropdowns:', this.dropdowns.length);
        
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

        // Обработка выпадающих меню
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

        // Обработка обычных ссылок меню
        const menuItems = document.querySelectorAll('.sidebar-menu .menu-item:not(.dropdown-toggle)');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                if (!item.getAttribute('href').startsWith('#')) {
                    this.closeMenuHandler();
                }
            });
        });

        // Обработка ссылок в подменю
        const submenuLinks = document.querySelectorAll('.sidebar-menu .dropdown-menu a');
        submenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Для внешних ссылок добавляем небольшую задержку
                if (link.hasAttribute('target') && link.getAttribute('target') === '_blank') {
                    setTimeout(() => {
                        this.closeMenuHandler();
                    }, 100);
                } else {
                    this.closeMenuHandler();
                }
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
        
        console.log('Menu opened');
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
                const arrow = dropdown.querySelector('.dropdown-arrow');
                if (arrow) {
                    arrow.style.transform = 'rotate(0deg)';
                }
            });
        }, 300);
        
        console.log('Menu closed');
    }

    toggleDropdown(dropdown) {
        const isCurrentlyActive = dropdown.classList.contains('active');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        const arrow = dropdown.querySelector('.dropdown-arrow');
        
        if (!dropdownMenu) return;

        console.log('Toggling dropdown:', dropdown, 'Currently active:', isCurrentlyActive);

        // Закрываем все другие выпадающие меню
        this.dropdowns.forEach(item => {
            if (item !== dropdown && item.classList.contains('active')) {
                item.classList.remove('active');
                const otherMenu = item.querySelector('.dropdown-menu');
                const otherArrow = item.querySelector('.dropdown-arrow');
                if (otherMenu) {
                    otherMenu.style.maxHeight = '0px';
                }
                if (otherArrow) {
                    otherArrow.style.transform = 'rotate(0deg)';
                }
            }
        });

        if (isCurrentlyActive) {
            // Закрываем текущее меню
            dropdown.classList.remove('active');
            dropdownMenu.style.maxHeight = '0px';
            if (arrow) {
                arrow.style.transform = 'rotate(0deg)';
            }
        } else {
            // Открываем текущее меню
            dropdown.classList.add('active');
            
            // Вычисляем высоту содержимого
            dropdownMenu.style.maxHeight = 'none'; // Временно убираем ограничение
            const height = dropdownMenu.scrollHeight;
            dropdownMenu.style.maxHeight = '0px'; // Возвращаем
            
            // Устанавливаем высоту с анимацией
            requestAnimationFrame(() => {
                dropdownMenu.style.maxHeight = height + 'px';
            });
            
            if (arrow) {
                arrow.style.transform = 'rotate(180deg)';
            }
        }
    }

    // Метод для программного закрытия меню
    forceClose() {
        this.closeMenuHandler();
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем размер экрана и показываем/скрываем элементы мобильного меню
    function updateMobileMenuVisibility() {
        const isMobile = window.innerWidth <= 768;
        const mobileElements = [
            document.getElementById('mobileMenuToggle'),
            document.getElementById('sidebarMenu'),
            document.getElementById('menuOverlay')
        ];
        
        mobileElements.forEach(element => {
            if (element) {
                if (isMobile) {
                    element.style.display = '';
                    element.style.visibility = '';
                } else {
                    element.style.display = 'none';
                }
            }
        });
    }
    
    // Проверяем при загрузке и изменении размера окна
    updateMobileMenuVisibility();
    window.addEventListener('resize', updateMobileMenuVisibility);
    
    // Инициализируем мобильное меню только один раз
    if (!window.mobileMenuInitialized) {
        const mobileMenu = new MobileMenu();
        window.mobileMenu = mobileMenu;
        window.mobileMenuInitialized = true;
    }
});
