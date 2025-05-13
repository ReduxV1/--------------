export default class InteractiveMenu {
    constructor() {
        this.menuItems = document.querySelectorAll('.menu-item');
        this.init();
    }

    init() {
        this.menuItems.forEach(item => {
            item.addEventListener('click', this.handleClick.bind(this));
        });
    }

    handleClick(e) {
        const checkbox = e.currentTarget.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
        
        e.currentTarget.classList.toggle('active', checkbox.checked);
        const section = e.currentTarget.dataset.section;
        console.log(`Секция "${section}": ${checkbox.checked ? 'активна' : 'отключена'}`);
        
        e.currentTarget.style.transform = checkbox.checked 
            ? 'translateX(10px)' 
            : 'translateX(0)';
    }
}