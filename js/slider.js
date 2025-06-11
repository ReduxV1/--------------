// Класс для управления слайдером с поддержкой touch
export class FullPageSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.isAnimating = false;
        
        // Touch variables
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50;
        
        this.init();
    }

    init() {
        if (this.slides.length === 0) {
            console.warn('No slides found');
            return;
        }

        this.updateSlidesPosition();
        
        // Desktop wheel events
        window.addEventListener('wheel', this.handleScroll.bind(this), { passive: false });
        
        // Mobile touch events
        this.setupTouchEvents();
        
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
        
        if (!container) return;

        // Touch start
        container.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
        }, { passive: true });

        // Touch move - prevent default scrolling
        container.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });

        // Touch end
        container.addEventListener('touchend', (e) => {
            this.touchEndY = e.changedTouches[0].clientY;
            this.handleSwipe();
        }, { passive: true });
    }

    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
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
        if (this.isAnimating) return;
        
        e.preventDefault();
        
        const delta = Math.sign(e.deltaY);
        if (delta > 0) {
            this.next();
        } else {
            this.prev();
        }
    }

    handleSwipe() {
        if (this.isAnimating) return;
        
        const deltaY = this.touchStartY - this.touchEndY;
        
        if (Math.abs(deltaY) < this.minSwipeDistance) {
            return; // Swipe too short
        }
        
        if (deltaY > 0) {
            // Swipe up - go to next slide
            this.next();
        } else {
            // Swipe down - go to previous slide
            this.prev();
        }
    }

    next() {
        if (this.isAnimating || this.currentSlide >= this.slides.length - 1) {
            return;
        }
        
        this.goToSlide(this.currentSlide + 1);
    }

    prev() {
        if (this.isAnimating || this.currentSlide <= 0) {
            return;
        }
        
        this.goToSlide(this.currentSlide - 1);
    }

    goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= this.slides.length || slideIndex === this.currentSlide) {
            return;
        }
        
        this.isAnimating = true;
        this.currentSlide = slideIndex;
        
        this.updateSlidesPosition();
        
        setTimeout(() => {
            this.triggerAnimations();
            this.isAnimating = false;
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
        window.removeEventListener('wheel', this.handleScroll);
        document.removeEventListener('keydown', this.setupKeyboardEvents);
        
        const container = document.querySelector('.slider-container');
        if (container) {
            container.removeEventListener('touchstart', this.handleTouchStart);
            container.removeEventListener('touchmove', this.handleTouchMove);
            container.removeEventListener('touchend', this.handleTouchEnd);
        }
    }
}
