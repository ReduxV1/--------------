import FullPageSlider from './slider.js';
import Navigation from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.slider-container')) {
        new FullPageSlider();
    }
    new Navigation();
});