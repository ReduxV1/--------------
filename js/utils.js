// Утилиты и вспомогательные функции
export class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff4444' : '#c5a47e'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }

    static smoothScrollTo(element, duration = 300) {
        const targetPosition = element.offsetTop;
        const startPosition = element.parentElement.scrollTop;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            element.parentElement.scrollTop = run;
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    }

    static easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    static preloadResources() {
        const criticalResources = [
            'css/main.css',
            'css/slider.css',
            'css/menu.css',
            'css/animations.css',
            'css/mobile.css'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = resource;
            document.head.appendChild(link);
        });
    }

    static handleImageErrors() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', () => {
                img.style.display = 'none';
                console.log(`Не удалось загрузить изображение: ${img.src}`);
            });
        });
    }

    static setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }
}

// Класс для управления состоянием меню
export class MenuStateManager {
    static saveMenuState() {
        const activeDropdowns = [];
        document.querySelectorAll('.sidebar-menu .dropdown.active').forEach(dropdown => {
            const link = dropdown.querySelector('.dropdown-toggle');
            if (link) {
                activeDropdowns.push(link.textContent.trim());
            }
        });
        localStorage.setItem('menuState', JSON.stringify(activeDropdowns));
    }

    static restoreMenuState() {
        try {
            const savedState = localStorage.getItem('menuState');
            if (savedState) {
                const activeDropdowns = JSON.parse(savedState);
                activeDropdowns.forEach(dropdownText => {
                    const dropdown = Array.from(document.querySelectorAll('.sidebar-menu .dropdown')).find(d => {
                        const link = d.querySelector('.dropdown-toggle');
                        return link && link.textContent.trim() === dropdownText;
                    });
                    if (dropdown && window.mobileMenu) {
                        setTimeout(() => {
                            window.mobileMenu.toggleDropdown(dropdown);
                        }, 500);
                    }
                });
            }
        } catch (e) {
            console.log('Не удалось восстановить состояние меню');
        }
    }

    static markActiveMenuItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const menuLinks = document.querySelectorAll('.sidebar-menu a[href]');
        
        menuLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
}
