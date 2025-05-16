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
            window.addEventListener('wheel', this.handleScroll.bind(this), { passive: false });
        }

        handleScroll(e) {
            e.preventDefault();
            const delta = Math.sign(e.deltaY);
            const now = Date.now();

            // Обработка скрытия меню
            if (delta > 0) {
                this.header.classList.add('header-hidden');
            } else {
                this.header.classList.remove('header-hidden');
            }

            // Обработка слайдера
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
            }
        }

        prev() {
            if (this.currentSlide > 0) {
                this.currentSlide--;
                this.updateSlidesPosition();
            }
        }

        updateSlidesPosition() {
            this.slides.forEach((slide, index) => {
                const offset = (index - this.currentSlide) * 100;
                slide.style.transform = `translateY(${offset}%)`;
            });
        }
    }

    new FullPageSlider();
    
    let lastScroll = 0;
    const header = document.querySelector('.main-header');
    const scrollThreshold = 50; // Порог прокрутки для скрытия (в пикселях)

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            // Скролл вниз
            header.classList.add('header-hidden');
        } else {
            // Скролл вверх
            header.classList.remove('header-hidden');
        }
        
        lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    });

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Показываем меню
        const header = document.querySelector('.main-header');
        header.classList.remove('header-hidden');
        
        // Сбрасываем состояние скролла
        lastScroll = 0;
        
        // Возврат к первому слайду
        const slider = new FullPageSlider();
        slider.currentSlide = 0;
        slider.updateSlidesPosition();
        
        return false;
    }