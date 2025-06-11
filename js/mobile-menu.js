// Класс для управления мобильным меню
export class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('mobileMenuToggle');
        this.sidebarMenu = document.getElementById('sidebarMenu');
        this.menuOverlay = document.getElementById('menuOverlay');
        this.closeMenu = document.getElementById('closeMenu');
        this.dropdowns = document.querySelectorAll('.sidebar-menu .dropdown');
        this.isMenuOpen = false;
        
        this.init();
    }

    init() {
        // Открытие меню
        this.menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openMenu();
        });

        // Закрытие меню
        this.closeMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeMenuHandler();
        });

        this.menuOverlay.addEventListener('click', () => {
            this.closeMenuHandler();
        });

        // Обработка выпадающих меню
        this.dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.dropdown-toggle');
            if (link) {
                link.addEventListener('click', (e) => {
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
        this.menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isMenuOpen = true;
        
        // Анимация иконки меню
        this.menuToggle.style.transform = 'rotate(90deg)';
    }

    closeMenuHandler() {
        this.sidebarMenu.classList.remove('active');
        this.menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        this.isMenuOpen = false;
        
        // Возвращаем иконку меню в исходное положение
        this.menuToggle.style.transform = 'rotate(0deg)';
        
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
                    const otherItems = otherMenu.querySelectorAll('li');
                    otherItems.forEach(li => {
                        li.style.transitionDelay = '0s';
                    });
                }
            }
        });
                if (isCurrentlyActive) {
            // Закрываем текущее меню
            dropdown.classList.remove('active');
            dropdownMenu.style.maxHeight = '0px';
            
            // Убираем задержки анимации
            const items = dropdownMenu.querySelectorAll('li');
            items.forEach(li => {
                li.style.transitionDelay = '0s';
            });
        } else {
            // Открываем текущее меню
            dropdown.classList.add('active');
            
            // Вычисляем высоту содержимого
            const items = dropdownMenu.querySelectorAll('li');
            let totalHeight = 0;
            
            items.forEach((item, index) => {
                // Временно делаем элемент видимым для измерения
                const originalDisplay = item.style.display;
                const originalVisibility = item.style.visibility;
                const originalPosition = item.style.position;
                
                item.style.display = 'block';
                item.style.visibility = 'hidden';
                item.style.position = 'absolute';
                
                totalHeight += item.offsetHeight;
                
                // Возвращаем исходные стили
                item.style.display = originalDisplay;
                item.style.visibility = originalVisibility;
                item.style.position = originalPosition;
                
                // Устанавливаем задержки для плавного появления
                item.style.transitionDelay = `${(index + 1) * 0.1}s`;
            });
            
            // Добавляем немного дополнительного пространства для границ и отступов
            totalHeight += items.length * 2;
            
            // Устанавливаем высоту с небольшим запасом
            dropdownMenu.style.maxHeight = (totalHeight + 20) + 'px';
            
            // Прокручиваем к активному элементу, если он не виден
            setTimeout(() => {
                const dropdownRect = dropdown.getBoundingClientRect();
                const menuRect = this.sidebarMenu.getBoundingClientRect();
                
                if (dropdownRect.bottom > menuRect.bottom - 50) {
                    dropdown.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
            }, 200);
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


