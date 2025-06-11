// Класс для управления анимациями
export class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupParticleEffects();
        this.setupDividerEffects();
        this.setupRippleEffects();
        this.setupTouchEffects();
    }

    setupParticleEffects() {
        // Эффект частиц при клике (исключаем элементы меню)
        document.addEventListener('click', (e) => {
            const isMenuElement = e.target.closest('.mobile-menu-toggle') || 
                                e.target.closest('.sidebar-menu') || 
                                e.target.closest('.menu-overlay') ||
                                e.target.closest('a:not(.dropdown-toggle)'); // Исключаем только НЕ dropdown-toggle
            
            if (!isMenuElement) {
                this.createParticles(e.clientX, e.clientY);
            }
        });
    }

    createParticles(x, y) {
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: #c5a47e;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${x}px;
                top: ${y}px;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / 6;
            const velocity = 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(1)', 
                    opacity: 1 
                },
                { 
                    transform: `translate(${vx}px, ${vy}px) scale(0)`, 
                    opacity: 0 
                }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }

    setupDividerEffects() {
        // Эффект мерцания для разделителя
        const dividers = document.querySelectorAll('.divider-gold');
        dividers.forEach(divider => {
            divider.addEventListener('mouseenter', () => {
                divider.style.animation = 'shine 0.5s ease-in-out';
            });
            
            divider.addEventListener('animationend', () => {
                divider.style.animation = '';
            });
        });
    }

    setupRippleEffects() {
        // Добавляем эффект ripple для кнопок меню
        const addRippleEffect = (element) => {
            element.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(197, 164, 126, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        };

        // Применяем эффект ripple к кнопкам меню
        const menuButtons = document.querySelectorAll('.sidebar-menu a, .mobile-menu-toggle');
        menuButtons.forEach(addRippleEffect);
    }

    setupTouchEffects() {
        // Определяем поддержку touch событий
        const isTouchDevice = () => {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        };

        // Добавляем специальные стили для touch устройств
        if (isTouchDevice()) {
            document.body.classList.add('touch-device');
        }
    }
}
