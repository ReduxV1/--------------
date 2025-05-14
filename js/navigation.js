class Navigation {
    constructor() {
        this.initNavigation();
        this.setActiveLink();
    }

    initNavigation() {
        document.querySelectorAll('.header-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                if (href.endsWith('.html')) {
                    window.location.href = href;
                } else {
                    this.loadContent(href);
                }
            });
        });
    }

    setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop();
        document.querySelectorAll('.header-menu a').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }
}
window.Navigation = Navigation;