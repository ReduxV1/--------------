export default class FullPageSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.isAnimating = false;
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.animationFrame = null;
        
        this.init();
    }

    init() {
        this.addEventListeners();
        this.updateSlidesPosition();
        this.animateBackground();
    }

    addEventListeners() {
        window.addEventListener('wheel', this.handleScroll.bind(this));
        window.addEventListener('keydown', this.handleKeydown.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    animateBackground() {
        const animate = () => {
            if (!this.isAnimating) {
                const activeSlide = this.slides[this.currentSlide];
                const bg = activeSlide.querySelector('.slide-bg');
                const moveX = (this.mouseX - window.innerWidth/2) * 0.02;
                const moveY = (this.mouseY - window.innerHeight/2) * 0.02;
                bg.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.03)`;
            }
            this.animationFrame = requestAnimationFrame(animate);
        };
        animate();
    }

    handleScroll(e) {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        const delta = Math.sign(e.deltaY);
        delta > 0 ? this.nextSlide() : this.prevSlide();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 1000);
    }

    handleKeydown(e) {
        if (this.isAnimating) return;
        if (e.key === 'ArrowDown') this.nextSlide();
        if (e.key === 'ArrowUp') this.prevSlide();
    }

    handleResize() {
        this.updateSlidesPosition();
    }

    nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.currentSlide++;
            this.updateSlidesPosition();
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateSlidesPosition();
        }
    }

    updateSlidesPosition() {
        this.slides.forEach((slide, index) => {
            const translateY = (index - this.currentSlide) * 100;
            slide.style.transform = `translateY(${translateY}%)`;
        });
    }
}