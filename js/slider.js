// Исправленный slider.js с улучшенной обработкой событий
export class FullPageSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.isAnimating = false;
        
        // Touch variables
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.minSwipeDistance = 30;
        this.touchStartTime = 0;
        this.maxSwipeTime = 1000;
        
        // Улучшенное определение устройств
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.hasMouseSupport = 'onmousedown' in window;
        
        console.log('FullPageSlider initialized', {
            isTouchDevice: this.isTouchDevice,
            hasMouseSupport: this.hasMouseSupport,
            maxTouchPoints: navigator.maxTouchPoints
        });
        
        this.init();
    }

    init() {
        if (this.slides.length === 0) {
            console.warn('No slides found');
            return;
        }

        // Добавляем touch класс если есть поддержка touch
        if (this.isTouchDevice) {
            document.body.classList.add('touch-device');
        }

        this.updateSlidesPosition();
        
        // Всегда добавляем wheel события если есть поддержка мыши
        if (this.hasMouseSupport) {
            console.log('Adding wheel event listener');
            window.addEventListener('wheel', this.handleScroll.bind(this), { passive: false });
        }
        
        // Touch события если есть поддержка touch
        if (this.isTouchDevice) {
            this.setupTouchEvents();
        }
        
        // Keyboard navigation
        this.setupKeyboardEvents();
        
        // Prevent conflicts with other click handlers
        document.addEventListener('click', (e) => {
            if (e.target.closest('a') && !e.target.closest('.dropdown-toggle')) {
                e.stopPropagation();
                return;
            }
        }, true);

        // Initial animations
        setTimeout(() => {
            this.triggerAnimations();
        }, 500);
    }

    setupTouchEvents() {
        const container = document.querySelector('.slider-container');
        
        if (!container) {
            console.warn('Slider container not found');
            return;
        }

        console.log('Setting up touch events');

        // Touch start
        container.addEventListener('touchstart', (e) => {
            if (this.isAnimating) return;
            
            this.touchStartY = e.touches[0].clientY;
            this.touchStartX = e.touches[0].clientX;
            this.touchStartTime = Date.now();
            
            console.log('Touch start:', this.touchStartY);
        }, { passive: true });

        // Touch move
        container.addEventListener('touchmove', (e) => {
            if (this.isAnimating) return;
            
            const currentY = e.touches[0].clientY;
            const currentX = e.touches[0].clientX;
            const deltaY = Math.abs(currentY - this.touchStartY);
            const deltaX = Math.abs(currentX - this.touchStartX);
            
            // Предотвращаем скролл только если это вертикальный свайп
            if (deltaY > deltaX && deltaY > 10) {
                e.preventDefault();
            }
        }, { passive: false });

        // Touch end
        container.addEventListener('touchend', (e) => {
            if (this.isAnimating) return;
            
            this.touchEndY = e.changedTouches[0].clientY;
            this.touchEndX = e.changedTouches[0].clientX;
            const touchEndTime = Date.now();
            
            console.log('Touch end:', this.touchEndY);
            
            // Проверяем время свайпа
            const swipeTime = touchEndTime - this.touchStartTime;
            if (swipeTime > this.maxSwipeTime) {
                console.log('Swipe too slow');
                return;
            }
            
            this.handleSwipe();
        }, { passive: true });
    }

    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (this.isAnimating) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    this.prev();
                    break;
                case 'ArrowDown':
                case 'PageDown':
                case ' ': // Spacebar
                    e.preventDefault();
                    this.next();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.slides.length - 1);
                    break;
            }
        });
    }

    handleScroll(e) {
        if (this.isAnimating) {
            e.preventDefault();
            return;
        }
        
        console.log('Wheel event detected:', {
            deltaY: e.deltaY,
            deltaX: e.deltaX,
            deltaMode: e.deltaMode
        });
        
        e.preventDefault();
        
        const delta = Math.sign(e.deltaY);
        
        if (delta > 0) {
            console.log('Scrolling down - next slide');
            this.next();
        } else if (delta < 0) {
            console.log('Scrolling up - previous slide');
            this.prev();
        }
    }

    handleSwipe() {
        const deltaY = this.touchStartY - this.touchEndY;
        const deltaX = Math.abs(this.touchStartX - this.touchEndX);
        
        console.log('Swipe deltaY:', deltaY, 'deltaX:', deltaX);
        
        // Проверяем, что это вертикальный свайп
        if (Math.abs(deltaY) < deltaX) {
            console.log('Horizontal swipe detected, ignoring');
            return;
        }
        
        if (Math.abs(deltaY) < this.minSwipeDistance) {
            console.log('Swipe too short:', Math.abs(deltaY));
            return;
        }
        
        if (deltaY > 0) {
            // Swipe up - go to next slide
            console.log('Swipe up - next slide');
            this.next();
        } else {
            // Swipe down - go to previous slide
            console.log('Swipe down - previous slide');
            this.prev();
        }
    }

    next() {
        if (this.isAnimating || this.currentSlide >= this.slides.length - 1) {
            console.log('Cannot go to next slide', {
                isAnimating: this.isAnimating,
                currentSlide: this.currentSlide,
                totalSlides: this.slides.length
            });
            return;
        }
        
        console.log('Going to next slide');
        this.goToSlide(this.currentSlide + 1);
    }

    prev() {
        if (this.isAnimating || this.currentSlide <= 0) {
            console.log('Cannot go to previous slide', {
                isAnimating: this.isAnimating,
                currentSlide: this.currentSlide
            });
            return;
        }
        
        console.log('Going to previous slide');  
        this.goToSlide(this.currentSlide - 1);
    }

    goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= this.slides.length || slideIndex === this.currentSlide) {
            console.log('Invalid slide index or same slide:', slideIndex);
            return;
        }
        
        console.log('Going to slide:', slideIndex);
        this.isAnimating = true;
        this.currentSlide = slideIndex;
        
        this.updateSlidesPosition();
        
        setTimeout(() => {
            this.triggerAnimations();
            this.isAnimating = false;
            console.log('Slide transition completed');
        }, 300);
    }

    updateSlidesPosition() {
        this.slides.forEach((slide, index) => {
            const offset = (index - this.currentSlide) * 100;
            slide.style.transform = `translateY(${offset}%)`;
            
            // Update aria-hidden for accessibility
            slide.setAttribute('aria-hidden', index !== this.currentSlide);
        });
    }

    triggerAnimations() {
        // Remove all existing animations
        const allAnimatedElements = document.querySelectorAll('.animate');
        allAnimatedElements.forEach(el => {
            el.classList.remove('animate');
        });

        // Trigger animations based on current slide
        if (this.currentSlide === 0) {
            setTimeout(() => {
                const contentBlock = document.getElementById('main-content-block');
                const divider = document.getElementById('main-divider');
                const discipline = document.getElementById('main-discipline');

                if (contentBlock) contentBlock.classList.add('animate');
                if (divider) divider.classList.add('animate');
                
                setTimeout(() => {
                    if (discipline) discipline.classList.add('animate');
                }, 800);
            }, 100);

        } else if (this.currentSlide === 1) {
            setTimeout(() => {
                const contentWindow = document.getElementById('content-window');
                const title = document.getElementById('main-title');
                const articleContent = document.getElementById('article-content');
                const topDivider = document.getElementById('top-divider');
                const bottomDivider = document.getElementById('bottom-divider');

                if (contentWindow) contentWindow.classList.add('animate');
                if (title) title.classList.add('animate');
                if (articleContent) articleContent.classList.add('animate');
                if (topDivider) topDivider.classList.add('animate');
                if (bottomDivider) bottomDivider.classList.add('animate');
            }, 100);
        }
    }

    // Public methods for external control
    getCurrentSlide() {
        return this.currentSlide;
    }

    getTotalSlides() {
        return this.slides.length;
    }

    // Disable/enable slider
    disable() {
        this.isAnimating = true;
    }

    enable() {
        this.isAnimating = false;
    }

    // Cleanup method
    destroy() {
        if (this.hasMouseSupport) {
            window.removeEventListener('wheel', this.handleScroll);
        }
        
        const container = document.querySelector('.slider-container');
        if (container && this.isTouchDevice) {
            // Удаляем только touch события, если они были добавлены
            container.removeEventListener('touchstart', this.handleTouchStart);
            container.removeEventListener('touchmove', this.handleTouchMove);
            container.removeEventListener('touchend', this.handleTouchEnd);
        }
    }
}
