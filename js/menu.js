export default class InteractiveMenu {
    constructor() {
        this.menuItems = document.querySelectorAll('.menu-item');
        this.dropdownItems = document.querySelectorAll('.dropdown');
        this.isMobile = this.detectMobile();
        this.activeDropdown = null;
        this.touchStartTime = 0;
        this.init();
    }

    // Определение мобильного устройства
    detectMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isMobileScreen = window.innerWidth <= 768;
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        return isMobileUA || isMobileScreen || isTouchDevice;
    }

    init() {
        console.log('InteractiveMenu initialized, isMobile:', this.isMobile);
        this.initMenuItems();
        this.initDropdownMenu();
        this.initOutsideClick();
        this.initResizeHandler();
    }

    initMenuItems() {
        this.menuItems.forEach(item => {
            item.addEventListener('click', this.handleClick.bind(this));
            
            // Добавляем поддержку клавиатуры
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleClick(e);
                }
            });
            
            // Делаем элементы фокусируемыми
            if (!item.hasAttribute('tabindex')) {
                item.setAttribute('tabindex', '0');
            }
        });
    }

    initDropdownMenu() {
        this.dropdownItems.forEach((dropdown, index) => {
            const dropdownLink = dropdown.querySelector('a');
            
            if (dropdownLink) {
                console.log(`Initializing dropdown ${index}:`, dropdownLink);
                
                // Основной обработчик клика
                dropdownLink.addEventListener('click', (e) => {
                    console.log('Click event triggered on dropdown:', index);
                    this.handleDropdownClick(e, dropdown);
                });

                // Для мобильных устройств добавляем touch события
                if (this.isMobile) {
                    dropdownLink.addEventListener('touchstart', (e) => {
                        this.touchStartTime = Date.now();
                        console.log('Touch start on dropdown:', index);
                    }, { passive: true });

                    dropdownLink.addEventListener('touchend', (e) => {
                        const touchDuration = Date.now() - this.touchStartTime;
                        
                        // Если это быстрый тап (не скролл)
                        if (touchDuration < 200) {
                            console.log('Touch end - quick tap on dropdown:', index);
                            e.preventDefault();
                            this.handleDropdownClick(e, dropdown);
                        }
                    }, { passive: false });
                }

                // Поддержка клавиатуры
                dropdownLink.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.handleDropdownClick(e, dropdown);
                    } else if (e.key === 'Escape') {
                        this.closeAllDropdowns();
                    }
                });

                // Предотвращаем стандартное поведение ссылки
                dropdownLink.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                });
            }
        });
    }

    handleDropdownClick(e, dropdown) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('handleDropdownClick called for:', dropdown);
        
        const isCurrentlyActive = dropdown.classList.contains('active');
        console.log('Currently active:', isCurrentlyActive);
        
        // Закрываем все меню
        this.closeAllDropdowns();
        
        // Если меню не было активным, открываем его
        if (!isCurrentlyActive) {
            dropdown.classList.add('active');
            this.activeDropdown = dropdown;
            console.log('Menu opened');
            
            // Добавляем небольшую задержку для CSS анимации
            setTimeout(() => {
                const menu = dropdown.querySelector('.dropdown-menu');
                if (menu) {
                    menu.style.display = 'block';
                }
            }, 10);
        } else {
            this.activeDropdown = null;
            console.log('Menu closed');
        }
    }

    handleClick(e) {
        const checkbox = e.currentTarget.querySelector('input[type="checkbox"]');
        
        if (!checkbox) return;
        
        checkbox.checked = !checkbox.checked;
        e.currentTarget.classList.toggle('active', checkbox.checked);
        
        const section = e.currentTarget.dataset.section;
        console.log(`Секция "${section}": ${checkbox.checked ? 'активна' : 'отключена'}`);
        
        // Анимация только для десктопа
        if (!this.isMobile) {
            e.currentTarget.style.transform = checkbox.checked
                ? 'translateX(10px)'
                : 'translateX(0)';
        }
    }

    initOutsideClick() {
        const handleOutsideInteraction = (e) => {
            // Проверяем, что клик не по dropdown элементу
            if (!e.target.closest('.dropdown')) {
                console.log('Outside click detected');
                this.closeAllDropdowns();
            }
        };
        
        // Обработчики для разных типов событий
        document.addEventListener('click', handleOutsideInteraction, true);
        
        if (this.isMobile) {
            document.addEventListener('touchstart', handleOutsideInteraction, { passive: true });
        }
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
            }
        });
    }

    initResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const wasMobile = this.isMobile;
                this.isMobile = this.detectMobile();
                
                if (wasMobile !== this.isMobile) {
                    console.log('Device type changed, reinitializing...');
                    this.closeAllDropdowns();
                }
            }, 250);
        });
    }

    closeAllDropdowns() {
        console.log('Closing all dropdowns');
        this.dropdownItems.forEach(dropdown => {
            dropdown.classList.remove('active');
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                // Небольшая задержка для плавного закрытия
                setTimeout(() => {
                    if (!dropdown.classList.contains('active')) {
                        menu.style.display = 'none';
                    }
                }, 300);
            }
        });
        this.activeDropdown = null;
    }

    // Публичные методы для программного управления
    toggleDropdown(index) {
        if (this.dropdownItems[index]) {
            const dropdown = this.dropdownItems[index];
            const isActive = dropdown.classList.contains('active');
            
            this.closeAllDropdowns();
            
            if (!isActive) {
                dropdown.classList.add('active');
                this.activeDropdown = dropdown;
            }
        }
    }

    openDropdown(index) {
        if (this.dropdownItems[index]) {
            this.closeAllDropdowns();
            this.dropdownItems[index].classList.add('active');
            this.activeDropdown = this.dropdownItems[index];
        }
    }

    closeDropdown(index) {
        if (this.dropdownItems[index]) {
            this.dropdownItems[index].classList.remove('active');
            if (this.activeDropdown === this.dropdownItems[index]) {
                this.activeDropdown = null;
            }
        }
    }

    // Получение состояния меню
    getActiveDropdown() {
        return this.activeDropdown;
    }

    isDropdownOpen(index) {
        return this.dropdownItems[index] && this.dropdownItems[index].classList.contains('active');
    }

    // Метод для отладки
    debug() {
        console.log('InteractiveMenu Debug Info:');
        console.log('isMobile:', this.isMobile);
        console.log('dropdownItems count:', this.dropdownItems.length);
        console.log('menuItems count:', this.menuItems.length);
        console.log('activeDropdown:', this.activeDropdown);
        
        this.dropdownItems.forEach((dropdown, index) => {
            console.log(`Dropdown ${index}:`, {
                element: dropdown,
                isActive: dropdown.classList.contains('active'),
                hasLink: !!dropdown.querySelector('a'),
                hasMenu: !!dropdown.querySelector('.dropdown-menu')
            });
        });
    }

    // Очистка обработчиков событий (для случая, если нужно удалить экземпляр)
    destroy() {
        // Удаляем все обработчики событий
        this.dropdownItems.forEach(dropdown => {
            const dropdownLink = dropdown.querySelector('a');
            if (dropdownLink) {
                dropdownLink.replaceWith(dropdownLink.cloneNode(true));
            }
        });

        this.menuItems.forEach(item => {
            item.replaceWith(item.cloneNode(true));
        });

        // Очищаем ссылки
        this.menuItems = null;
        this.dropdownItems = null;
        this.activeDropdown = null;
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    // Создаем глобальный экземпляр для возможности отладки
    window.interactiveMenu = new InteractiveMenu();
    
    // Добавляем команду для отладки в консоль
    console.log('InteractiveMenu loaded. Use window.interactiveMenu.debug() for debugging info.');
});
