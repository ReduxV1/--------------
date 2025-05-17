    class FullPageSlider {
        constructor() {
            this.slides = document.querySelectorAll('.slide');
            this.currentSlide = 0;
            this.header = document.querySelector('.main-header');
            this.lastScrollTime = Date.now();
            this.init();
        }

        init() {
            this.updateSlidesPosition();
            this.initNavigation();
            this.updateHeaderVisibility();
            window.addEventListener('wheel', this.handleScroll.bind(this), { passive: false });
        }

        initNavigation() {
            const navContainer = document.querySelector('.slide-nav');
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'nav-dot';
                dot.addEventListener('click', () => {
                    this.currentSlide = index;
                    this.updateSlidesPosition();
                    this.updateNavigation();
                    this.updateHeaderVisibility();
                });
                navContainer.appendChild(dot);
            });
            this.updateNavigation();
        }

         updateHeaderVisibility() {
            if (this.currentSlide === 0) {
                this.header.classList.remove('header-hidden');
            } else {
                this.header.classList.add('header-hidden');
            }
        }

        updateNavigation() {
            const dots = document.querySelectorAll('.nav-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentSlide);
            });
        }

        handleScroll(e) {
            e.preventDefault();
            const delta = Math.sign(e.deltaY);
            const now = Date.now();

            if (now - this.lastScrollTime > 800) {
                if (delta > 0) this.next();
                else this.prev();
                this.lastScrollTime = now;
            }
        }

        next() {
            if (this.currentSlide < this.slides.length - 1) {
                this.currentSlide++;
                this.updateSlidesPosition();
                this.updateNavigation();
                this.updateHeaderVisibility();
            }
        }

        prev() {
            if (this.currentSlide > 0) {
                this.currentSlide--;
                this.updateSlidesPosition();
                this.updateNavigation();
                this.updateHeaderVisibility();
            }
        }

        updateSlidesPosition() {
            this.slides.forEach((slide, index) => {
                const offset = (index - this.currentSlide) * 100;
                slide.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                slide.style.transform = `translateY(${offset}%)`;
            });
        }
    }

    const slider = new FullPageSlider();

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        slider.currentSlide = 0;
        slider.updateSlidesPosition();
        slider.updateNavigation();
        slider.updateHeaderVisibility();
        
        return false;
    }
