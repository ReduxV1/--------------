// Инициализация переменных
let currentSection = 0;
const sections = document.querySelectorAll('.content-section section');

// Показать предыдущий раздел
function showPrevSection() {
    if (currentSection > 0) {
        hideSection(currentSection);
        currentSection--;
        showSection(currentSection);
        updateButtonState();
    }
}

// Показать следующий раздел
function showNextSection() {
    if (currentSection < sections.length - 1) {
        hideSection(currentSection);
        currentSection++;
        showSection(currentSection);
        updateButtonState();
    }
}

// Скрыть раздел с анимацией
function hideSection(index) {
    sections[index].style.opacity = '0';
    setTimeout(() => {
        sections[index].style.display = 'none';
    }, 300); // Длительность анимации
}

// Показать раздел с анимацией
function showSection(index) {
    sections[index].style.display = 'block';
    setTimeout(() => {
        sections[index].style.opacity = '1';
    }, 10);
}

// Обновить состояние кнопок
function updateButtonState() {
    const prevButton = document.querySelector('.nav-button.prev');
    const nextButton = document.querySelector('.nav-button.next');

    // Блокировка кнопок на границах
    prevButton.disabled = (currentSection === 0);
    nextButton.disabled = (currentSection === sections.length - 1);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const prevButton = document.querySelector('.nav-button.prev');
    const nextButton = document.querySelector('.nav-button.next');
    
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', showPrevSection);
        nextButton.addEventListener('click', showNextSection);
        updateButtonState();
    } 
}); 