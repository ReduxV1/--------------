// Класс для управления слайдером
export class FullPageSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.init();
    }

    init() {
        this.updateSlidesPosition();
        window.addEventListener('wheel', this.handleScroll.bind(this));
        
        document.addEventListener('click', (e) => {
            if (e.target.closest('a') && !e.target.closest('.dropdown-toggle')) { // Исключаем dropdown-toggle
                e.stopPropagation();
                return;
            }
        }, true);

        setTimeout(() => {
            this.triggerAnimations();
        }, 500);
    }

    handleScroll(e) {
        const delta = Math.sign(e.deltaY);
        if (delta > 0) this.next();
        else this.prev();
    }

    next() {
        if (this.currentSlide < this.slides.length - 1) {
            this.currentSlide++;
            this.updateSlidesPosition();
            setTimeout(() => {
                this.triggerAnimations();
            }, 300);
        }
    }

    prev() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateSlidesPosition();
            setTimeout(() => {
                this.triggerAnimations();
            }, 300);
        }
    }

    updateSlidesPosition() {
        this.slides.forEach((slide, index) => {
            const offset = (index - this.currentSlide) * 100;
            slide.style.transform = `translateY(${offset}%)`;
        });
    }

    triggerAnimations() {
        const allAnimatedElements = document.querySelectorAll('.animate');
        allAnimatedElements.forEach(el => {
            el.classList.remove('animate');
        });

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
}
