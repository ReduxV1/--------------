export default class FullPageSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.isAnimating = false;
        this.init();
        window.slider = this; // Делаем экземпляр глобально доступным
    }

    init() {
        this.addEventListeners();
        this.updateSlidesPosition(true); // Инициализация без анимации
    }

    addEventListeners() {
        this.handleScroll = this.handleScroll.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        
        window.addEventListener('wheel', this.handleScroll);
        window.addEventListener('keydown', this.handleKeydown);
    }

    removeEventListeners() {
        window.removeEventListener('wheel', this.handleScroll);
        window.removeEventListener('keydown', this.handleKeydown);
    }

    handleScroll(e) {
        if (this.isAnimating) return;
        
        e.preventDefault();
        const delta = Math.sign(e.deltaY);
        delta > 0 ? this.next() : this.prev();
    }

    handleKeydown(e) {
        if (this.isAnimating) return;

        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
                this.next();
                break;
            case 'ArrowUp':
            case 'PageUp':
                this.prev();
                break;
        }
    }

    next() {
        if (this.currentSlide < this.slides.length - 1) {
            this.currentSlide++;
            this.updateSlidesPosition();
        }
    }

    prev() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateSlidesPosition();
        }
    }

    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.currentSlide = index;
            this.updateSlidesPosition();
        }
    }

    updateSlidesPosition(initial = false) {
        this.isAnimating = true;

        this.slides.forEach((slide, index) => {
            const translateY = (index - this.currentSlide) * 100;
            slide.style.transition = initial ? 'none' : `transform ${this.settings.duration}ms ${this.settings.easing}`;
            slide.style.transform = `translateY(${translateY}%)`;
        });

        // Обработка завершения анимации
        const handleTransitionEnd = () => {
            this.isAnimating = false;
            this.slides[0].removeEventListener('transitionend', handleTransitionEnd);
        };

        if (!initial) {
            this.slides[0].addEventListener('transitionend', handleTransitionEnd);
        } else {
            this.isAnimating = false;
        }
    }

    destroy() {
        this.removeEventListeners();
        this.slides.forEach(slide => {
            slide.style.transition = '';
            slide.style.transform = '';
        });
    }
}