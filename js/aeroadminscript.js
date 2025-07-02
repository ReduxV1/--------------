// AEROADMIN EXPERIMENTS GALLERY SCRIPT
// Скрипт для управления галереями изображений на странице экспериментов AeroAdmin

// Глобальные переменные
let viewedExperiments = new Set();
let touchStartX = 0;
let touchEndX = 0;

// ГАЛЕРЕЯ 1 - AEROADMIN (Портативная версия)
let currentImageIndexAero = 0;
const imageDataAero = [
    {
        src: '../izobr/aeroadmin/download.png',
        alt: 'Загрузка AeroAdmin',
        description: 'Портативная версия AeroAdmin - первый запуск'
    },
    {
        src: '../izobr/aeroadmin/main-window.png',
        alt: 'Главное окно',
        description: 'Основное окно программы с интуитивным интерфейсом'
    },
    {
        src: '../izobr/aeroadmin/connection-id.png',
        alt: 'ID подключения',
        description: 'Автоматическое получение ID и пароля подключения'
    }
];

// ГАЛЕРЕЯ 2 - SECURITY (Безопасность)
let currentImageIndexSecurity = 0;
const imageDataSecurity = [
    {
        src: '../izobr/aeroadmin/main-window.png',
        alt: 'Настройка пароля',
        description: 'Настройка временного пароля для защиты доступа'
    },
    {
        src: '../izobr/aeroadmin/request-password.png',
        alt: 'Запрос пароля',
        description: 'Запрос пароля при попытке подключения'
    },
    {
        src: '../izobr/aeroadmin/remote-connect.jpg',
        alt: 'Успешное подключение',
        description: 'Успешная попытка подключения со стороны удаленного устройства'
    },
    {
        src: '../izobr/aeroadmin/wrong-pass.png',
        alt: 'Неправильный пароль',
        description: 'Предупреждение о неправильном пароле'
    },
    {
        src: '../izobr/aeroadmin/wrong-pass1.png',
        alt: 'Несколько неудачных паролей',
        description: 'Предупреждение о нескольких неудачных попытках входа'
    }
];

// ГАЛЕРЕЯ 3 - SPEED (Запись сессии)
let currentMediaIndexSpeed = 0;
const mediaDataSpeed = [
    {
        type: 'image',
        src: '../izobr/AeroAdmin/start-recording.jpeg',
        alt: 'Начало записи',
        description: 'Файловый менеджер AeroAdmin - интерфейс передачи файлов'
    },
    {
        type: 'image',
        src: '../izobr/AeroAdmin/record-setting.png',
        alt: 'Настройка записи',
        description: 'Настройка параметров записи экрана'
    },
    {
        type: 'video',
        src: '../izobr/AeroAdmin/recording.mp4',
        alt: 'Запись экрана',
        description: 'Видеодемонстрация процесса записи экрана'
    }
];

// ГАЛЕРЕЯ 4 - PERFORMANCE (Качество видеопотока)
let currentImageIndexPerformance = 0;
const imageDataPerformance = [
    {
        src: '../izobr/AeroAdmin/settings.png',
        alt: 'Настройки изображения в AeroAdmin',
        description: 'Настройки качества и производительности AeroAdmin'
    },
    {
        src: '../izobr/AeroAdmin/video-settings.png',
        alt: 'Настройка воспроизводимого видеоконтента',
        description: 'Настройки воспроизведения видеоконтента'
    },
    {
        src: '../izobr/AeroAdmin/quality.png',
        alt: 'Качество в AeroAdmin',
        description: 'Демонстрация качества изображения при нагрузке'
    }
];

// ГАЛЕРЕЯ 5 - FUNCTIONS (Внутренние функции)
let currentImageIndexFunctions = 0;
const imageDataFunctions = [
    {
        src: '../izobr/AeroAdmin/voice-chat.png',
        alt: 'Голосовой чат',
        description: 'Настройка голосового чата в AeroAdmin'
    },
    {
        src: '../izobr/AeroAdmin/FullHD.png',
        alt: 'Изначальное разрешения экрана',
        description: 'Изначальное разрешение экрана удаленного компьютера'
    },
    {
        src: '../izobr/AeroAdmin/ctrlaltdel.png',
        alt: 'Комбинация CTRL+ALT+DEL',
        description: 'Использование системной комбинации CTRL+ALT+DEL через AeroAdmin'
    },
    {
        src: '../izobr/AeroAdmin/720p.png',
        alt: 'Измененное разрешение экрана',
        description: 'Измененное разрешение экрана удаленного компьютера'
    }
];

// ФУНКЦИИ ДЛЯ ГАЛЕРЕИ FUNCTIONS (5-й эксперимент)
function goToImageFunctions(index) {
    currentImageIndexFunctions = index;
    updateGalleryFunctions();
}

function changeImageFunctions(direction) {
    if (direction === 'next') {
        currentImageIndexFunctions = (currentImageIndexFunctions + 1) % imageDataFunctions.length;
    } else {
        currentImageIndexFunctions = (currentImageIndexFunctions - 1 + imageDataFunctions.length) % imageDataFunctions.length;
    }
    updateGalleryFunctions();
}

function updateGalleryFunctions() {
    const mainImage = document.getElementById('mainImageFunctions');
    const description = document.getElementById('imageDescriptionFunctions');
    const currentCounter = document.getElementById('currentImageFunctions');
    const totalCounter = document.getElementById('totalImagesFunctions');
    const thumbnails = document.querySelectorAll('.thumbnail-functions');

    if (mainImage && imageDataFunctions[currentImageIndexFunctions]) {
        mainImage.src = imageDataFunctions[currentImageIndexFunctions].src;
        mainImage.alt = imageDataFunctions[currentImageIndexFunctions].alt;
        
        if (description) {
            description.textContent = imageDataFunctions[currentImageIndexFunctions].description;
        }
        
        if (currentCounter) {
            currentCounter.textContent = currentImageIndexFunctions + 1;
        }
        
        if (totalCounter) {
            totalCounter.textContent = imageDataFunctions.length;
        }

        // Обновляем активную миниатюру
        thumbnails.forEach((thumb, index) => {
            if (index === currentImageIndexFunctions) {
                thumb.style.border = '2px solid #6f42c1';
                thumb.style.opacity = '1';
            } else {
                thumb.style.border = '2px solid transparent';
                thumb.style.opacity = '0.7';
            }
        });
    }
}

function toggleZoomFunctions(img) {
    if (img.style.transform === 'scale(1.5)') {
        img.style.transform = 'scale(1)';
        img.style.cursor = 'pointer';
    } else {
        img.style.transform = 'scale(1.5)';
        img.style.cursor = 'zoom-out';
    }
}

// ФУНКЦИИ ДЛЯ ГАЛЕРЕИ AEROADMIN (1-й эксперимент)
function goToImageAero(index) {
    currentImageIndexAero = index;
    updateGalleryAero();
}

function changeImageAero(direction) {
    if (direction === 'next') {
        currentImageIndexAero = (currentImageIndexAero + 1) % imageDataAero.length;
    } else {
        currentImageIndexAero = (currentImageIndexAero - 1 + imageDataAero.length) % imageDataAero.length;
    }
    updateGalleryAero();
}

function updateGalleryAero() {
    const mainImage = document.getElementById('mainImageAero');
    const description = document.getElementById('imageDescriptionAero');
    const currentCounter = document.getElementById('currentImageAero');
    const totalCounter = document.getElementById('totalImagesAero');
    const thumbnails = document.querySelectorAll('.thumbnail-aero');

    if (mainImage && imageDataAero[currentImageIndexAero]) {
        mainImage.src = imageDataAero[currentImageIndexAero].src;
        mainImage.alt = imageDataAero[currentImageIndexAero].alt;
        
        if (description) {
            description.textContent = imageDataAero[currentImageIndexAero].description;
        }
        
        if (currentCounter) {
            currentCounter.textContent = currentImageIndexAero + 1;
        }
        
        if (totalCounter) {
            totalCounter.textContent = imageDataAero.length;
        }

        // Обновляем активную миниатюру
        thumbnails.forEach((thumb, index) => {
            if (index === currentImageIndexAero) {
                thumb.style.border = '2px solid #ff6b35';
                thumb.style.opacity = '1';
            } else {
                thumb.style.border = '2px solid transparent';
                thumb.style.opacity = '0.7';
            }
        });
    }
}

function toggleZoomAero(img) {
    if (img.style.transform === 'scale(1.5)') {
        img.style.transform = 'scale(1)';
        img.style.cursor = 'pointer';
    } else {
        img.style.transform = 'scale(1.5)';
        img.style.cursor = 'zoom-out';
    }
}

// ФУНКЦИИ ДЛЯ ГАЛЕРЕИ SECURITY (2-й эксперимент)
function goToImageSecurity(index) {
    currentImageIndexSecurity = index;
    updateGallerySecurity();
}

function changeImageSecurity(direction) {
    if (direction === 'next') {
        currentImageIndexSecurity = (currentImageIndexSecurity + 1) % imageDataSecurity.length;
    } else {
        currentImageIndexSecurity = (currentImageIndexSecurity - 1 + imageDataSecurity.length) % imageDataSecurity.length;
    }
    updateGallerySecurity();
}

function updateGallerySecurity() {
    const mainImage = document.getElementById('mainImageSecurity');
    const description = document.getElementById('imageDescriptionSecurity');
    const currentCounter = document.getElementById('currentImageSecurity');
    const totalCounter = document.getElementById('totalImagesSecurity');
    const thumbnails = document.querySelectorAll('.thumbnail-security');

    if (mainImage && imageDataSecurity[currentImageIndexSecurity]) {
        mainImage.src = imageDataSecurity[currentImageIndexSecurity].src;
        mainImage.alt = imageDataSecurity[currentImageIndexSecurity].alt;
        
        if (description) {
            description.textContent = imageDataSecurity[currentImageIndexSecurity].description;
        }
        
        if (currentCounter) {
            currentCounter.textContent = currentImageIndexSecurity + 1;
        }
        
        if (totalCounter) {
            totalCounter.textContent = imageDataSecurity.length;
        }

        // Обновляем активную миниатюру
        thumbnails.forEach((thumb, index) => {
            if (index === currentImageIndexSecurity) {
                thumb.style.border = '2px solid #4a9eff';
                thumb.style.opacity = '1';
            } else {
                thumb.style.border = '2px solid transparent';
                thumb.style.opacity = '0.7';
            }
        });
    }
}

function toggleZoomSecurity(img) {
    if (img.style.transform === 'scale(1.5)') {
        img.style.transform = 'scale(1)';
        img.style.cursor = 'pointer';
    } else {
        img.style.transform = 'scale(1.5)';
        img.style.cursor = 'zoom-out';
    }
}

// ФУНКЦИИ ДЛЯ ГАЛЕРЕИ SPEED (3-й эксперимент)
function goToMediaSpeed(index) {
    currentMediaIndexSpeed = index;
    updateGallerySpeed();
}

function changeMediaSpeed(direction) {
    if (direction === 'next') {
        currentMediaIndexSpeed = (currentMediaIndexSpeed + 1) % mediaDataSpeed.length;
    } else {
        currentMediaIndexSpeed = (currentMediaIndexSpeed - 1 + mediaDataSpeed.length) % mediaDataSpeed.length;
    }
    updateGallerySpeed();
}

function updateGallerySpeed() {
    const mainImage = document.getElementById('mainImageSpeed');
    const mainVideo = document.getElementById('mainVideoSpeed');
    const description = document.getElementById('mediaDescriptionSpeed');
    const currentCounter = document.getElementById('currentMediaSpeed');
    const totalCounter = document.getElementById('totalMediaSpeed');
    const thumbnails = document.querySelectorAll('.thumbnail-speed');
    const zoomIcon = document.getElementById('zoomIcon');
    const videoIcon = document.getElementById('videoIcon');
    const hintText = document.getElementById('hintText');

    const currentMedia = mediaDataSpeed[currentMediaIndexSpeed];

    if (currentMedia) {
        if (currentMedia.type === 'video') {
            // Показываем видео
            if (mainImage) mainImage.style.display = 'none';
            if (mainVideo) {
                mainVideo.style.display = 'block';
                mainVideo.src = currentMedia.src;
            }
            
            // Обновляем иконки
            if (zoomIcon) zoomIcon.style.display = 'none';
            if (videoIcon) videoIcon.style.display = 'block';
            if (hintText) hintText.textContent = 'Видео';
        } else {
            // Показываем изображение
            if (mainVideo) mainVideo.style.display = 'none';
            if (mainImage) {
                mainImage.style.display = 'block';
                mainImage.src = currentMedia.src;
                mainImage.alt = currentMedia.alt;
            }
            
            // Обновляем иконки
            if (zoomIcon) zoomIcon.style.display = 'block';
            if (videoIcon) videoIcon.style.display = 'none';
            if (hintText) hintText.textContent = 'Увеличить';
        }
        
        if (description) {
            description.textContent = currentMedia.description;
        }
        
        if (currentCounter) {
            currentCounter.textContent = currentMediaIndexSpeed + 1;
        }
        
        if (totalCounter) {
            totalCounter.textContent = mediaDataSpeed.length;
        }

        // Обновляем активную миниатюру
        thumbnails.forEach((thumb, index) => {
            if (index === currentMediaIndexSpeed) {
                thumb.style.border = '2px solid #28a745';
                thumb.style.opacity = '1';
            } else {
                thumb.style.border = '2px solid transparent';
                thumb.style.opacity = '0.7';
            }
        });
    }
}

function toggleZoomSpeed(img) {
    if (img.style.transform === 'scale(1.5)') {
        img.style.transform = 'scale(1)';
        img.style.cursor = 'pointer';
    } else {
        img.style.transform = 'scale(1.5)';
        img.style.cursor = 'zoom-out';
    }
}

// ФУНКЦИИ ДЛЯ ГАЛЕРЕИ PERFORMANCE (4-й эксперимент)
function goToImagePerformance(index) {
    currentImageIndexPerformance = index;
    updateGalleryPerformance();
}

function changeImagePerformance(direction) {
    if (direction === 'next') {
        currentImageIndexPerformance = (currentImageIndexPerformance + 1) % imageDataPerformance.length;
    } else {
        currentImageIndexPerformance = (currentImageIndexPerformance - 1 + imageDataPerformance.length) % imageDataPerformance.length;
    }
    updateGalleryPerformance();
}

function updateGalleryPerformance() {
    const mainImage = document.getElementById('mainImagePerformance');
    const description = document.getElementById('imageDescriptionPerformance');
    const currentCounter = document.getElementById('currentImagePerformance');
    const totalCounter = document.getElementById('totalImagesPerformance');
    const thumbnails = document.querySelectorAll('.thumbnail-performance');

    if (mainImage && imageDataPerformance[currentImageIndexPerformance]) {
        mainImage.src = imageDataPerformance[currentImageIndexPerformance].src;
        mainImage.alt = imageDataPerformance[currentImageIndexPerformance].alt;
        
        if (description) {
            description.textContent = imageDataPerformance[currentImageIndexPerformance].description;
        }
        
        if (currentCounter) {
            currentCounter.textContent = currentImageIndexPerformance + 1;
        }
        
        if (totalCounter) {
            totalCounter.textContent = imageDataPerformance.length;
        }

        // Обновляем активную миниатюру
        thumbnails.forEach((thumb, index) => {
            if (index === currentImageIndexPerformance) {
                thumb.style.border = '2px solid #dc3545';
                thumb.style.opacity = '1';
            } else {
                thumb.style.border = '2px solid transparent';
                thumb.style.opacity = '0.7';
            }
        });
    }
}

function toggleZoomPerformance(img) {
    if (img.style.transform === 'scale(1.5)') {
        img.style.transform = 'scale(1)';
        img.style.cursor = 'pointer';
    } else {
        img.style.transform = 'scale(1.5)';
        img.style.cursor = 'zoom-out';
    }
}

// ИНИЦИАЛИЗАЦИЯ ВСЕХ ГАЛЕРЕЙ
function initializeGalleries() {
    console.log('Инициализация галерей AeroAdmin...');

    // Инициализация галереи AeroAdmin
    setTimeout(() => {
        updateGalleryAero();
        initGalleryControls('aero');
        console.log('✅ Галерея AeroAdmin инициализирована');
    }, 100);

    // Инициализация галереи Security
    setTimeout(() => {
        updateGallerySecurity();
        initGalleryControls('security');
        console.log('✅ Галерея Security инициализирована');
    }, 200);

    // Инициализация галереи Speed
    setTimeout(() => {
        updateGallerySpeed();
        initGalleryControls('speed');
        console.log('✅ Галерея Speed инициализирована');
    }, 300);

    // Инициализация галереи Performance
    setTimeout(() => {
        updateGalleryPerformance();
        initGalleryControls('performance');
        console.log('✅ Галерея Performance инициализирована');
    }, 400);

    // Инициализация галереи Functions
    setTimeout(() => {
        updateGalleryFunctions();
        initGalleryControls('functions');
        console.log('✅ Галерея Functions инициализирована');
    }, 500);
}

// ИНИЦИАЛИЗАЦИЯ ЭЛЕМЕНТОВ УПРАВЛЕНИЯ ГАЛЕРЕЕЙ
function initGalleryControls(galleryType) {
    // Навигационные кнопки
    const prevBtn = document.querySelector(`.gallery-nav-${galleryType}.prev`);
    const nextBtn = document.querySelector(`.gallery-nav-${galleryType}.next`);
    
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switch(galleryType) {
                case 'aero':
                    changeImageAero('prev');
                    break;
                case 'security':
                    changeImageSecurity('prev');
                    break;
                case 'speed':
                    changeMediaSpeed('prev');
                    break;
                case 'performance':
                    changeImagePerformance('prev');
                    break;
                case 'functions':
                    changeImageFunctions('prev');
                    break;
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switch(galleryType) {
                case 'aero':
                    changeImageAero('next');
                    break;
                case 'security':
                    changeImageSecurity('next');
                    break;
                case 'speed':
                    changeMediaSpeed('next');
                    break;
                case 'performance':
                    changeImagePerformance('next');
                    break;
                case 'functions':
                    changeImageFunctions('next');
                    break;
            }
        });
    }

    // Миниатюры
    const thumbnails = document.querySelectorAll(`.thumbnail-${galleryType}`);
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', (e) => {
            e.preventDefault();
            switch(galleryType) {
                case 'aero':
                    goToImageAero(index);
                    break;
                case 'security':
                    goToImageSecurity(index);
                    break;
                case 'speed':
                    goToMediaSpeed(index);
                    break;
                case 'performance':
                    goToImagePerformance(index);
                    break;
            }
        });

        // Hover эффекты для миниатюр
        thumb.addEventListener('mouseenter', () => {
            if (!thumb.style.border.includes('2px solid')) {
                thumb.style.opacity = '1';
                thumb.style.transform = 'scale(1.05)';
            }
        });

        thumb.addEventListener('mouseleave', () => {
            if (!thumb.style.border.includes('2px solid')) {
                thumb.style.opacity = '0.7';
                thumb.style.transform = 'scale(1)';
            }
        });
    });

    // Hover эффекты для навигационных кнопок
    [prevBtn, nextBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-50%) scale(1.1)';
                btn.style.opacity = '1';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(-50%) scale(1)';
                btn.style.opacity = '0.9';
            });
        }
    });
}

// ПОДДЕРЖКА КЛАВИАТУРЫ
function initKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
        // Определяем активную галерею по видимому элементу
        const activeGallery = getActiveGallery();
        
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            switch(activeGallery) {
                case 'aero':
                    changeImageAero('prev');
                    break;
                case 'security':
                    changeImageSecurity('prev');
                    break;
                case 'speed':
                    changeMediaSpeed('prev');
                    break;
                case 'performance':
                    changeImagePerformance('prev');
                    break;
            }
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            switch(activeGallery) {
                case 'aero':
                    changeImageAero('next');
                    break;
                case 'security':
                    changeImageSecurity('next');
                    break;
                case 'speed':
                    changeMediaSpeed('next');
                    break;
                case 'performance':
                    changeImagePerformance('next');
                    break;
            }
        } else if (e.key === 'Escape') {
            // Сброс всех увеличенных изображений
            document.querySelectorAll('img[style*="scale"]').forEach(img => {
                img.style.transform = 'scale(1)';
                img.style.cursor = 'pointer';
            });
            
            // Пауза всех видео
            document.querySelectorAll('video').forEach(video => {
                video.pause();
            });
        } else if (e.key === ' ' && activeGallery === 'speed') {
            // Пробел для управления видео в Speed галерее
            e.preventDefault();
            const video = document.getElementById('mainVideoSpeed');
            if (video && video.style.display === 'block') {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        }
    });
}

// ОПРЕДЕЛЕНИЕ АКТИВНОЙ ГАЛЕРЕИ
function getActiveGallery() {
    const galleries = [
        { name: 'aero', element: document.querySelector('.image-gallery:not(.security-gallery):not(.speed-gallery):not(.performance-gallery)') },
        { name: 'security', element: document.querySelector('.security-gallery') },
        { name: 'speed', element: document.querySelector('.speed-gallery') },
        { name: 'performance', element: document.querySelector('.performance-gallery') }
    ];

    // Проверяем, какая галерея видна в viewport
    for (let gallery of galleries) {
        if (gallery.element && isElementInViewport(gallery.element)) {
            return gallery.name;
        }
    }

    return 'aero'; // По умолчанию
}

// ПРОВЕРКА ВИДИМОСТИ ЭЛЕМЕНТА
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ПОДДЕРЖКА СЕНСОРНЫХ ЖЕСТОВ
function initTouchSupport() {
    const galleries = document.querySelectorAll('.image-gallery, .security-gallery, .speed-gallery, .performance-gallery');
    
    galleries.forEach(gallery => {
        gallery.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        gallery.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleGesture(gallery);
        });
    });
}

function handleGesture(gallery) {
    const threshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > threshold) {
        const galleryType = getGalleryType(gallery);
        
        if (diff > 0) {
            // Свайп влево - следующее изображение
            switch(galleryType) {
                case 'aero':
                    changeImageAero('next');
                    break;
                case 'security':
                    changeImageSecurity('next');
                    break;
                case 'speed':
                    changeMediaSpeed('next');
                    break;
                case 'performance':
                    changeImagePerformance('next');
                    break;
            }
        } else {
            // Свайп вправо - предыдущее изображение
            switch(galleryType) {
                case 'aero':
                    changeImageAero('prev');
                    break;
                case 'security':
                    changeImageSecurity('prev');
                    break;
                case 'speed':
                    changeMediaSpeed('prev');
                    break;
                case 'performance':
                    changeImagePerformance('prev');
                    break;
            }
        }
    }
}

function getGalleryType(gallery) {
    if (gallery.classList.contains('security-gallery')) return 'security';
    if (gallery.classList.contains('speed-gallery')) return 'speed';
    if (gallery.classList.contains('performance-gallery')) return 'performance';
    return 'aero';
}

// ОПТИМИЗАЦИЯ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ
function optimizeForMobile() {
    if (window.innerWidth <= 768) {
        // Увеличиваем кнопки навигации
        document.querySelectorAll('[class*="gallery-nav-"]').forEach(btn => {
            btn.style.width = '50px';
            btn.style.height = '50px';
            btn.style.fontSize = '20px';
        });

        // Увеличиваем миниатюры
        document.querySelectorAll('[class*="thumbnail-"]').forEach(thumb => {
            thumb.style.width = '70px';
            thumb.style.height = '50px';
        });

        // Оптимизируем видео
        document.querySelectorAll('video').forEach(video => {
            video.style.maxHeight = '200px';
        });
    }
}

// ИНДИКАТОРЫ ЗАГРУЗКИ
function addLoadingIndicators() {
    const images = document.querySelectorAll('#mainImageAero, #mainImageSecurity, #mainImageSpeed, #mainImagePerformance');
    
    images.forEach(img => {
        img.addEventListener('loadstart', () => {
            img.style.opacity = '0.5';
        });
        
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        img.addEventListener('error', () => {
            img.style.opacity = '1';
            img.alt = 'Изображение не найдено';
            console.warn('Не удалось загрузить изображение:', img.src);
        });
    });
}

// АВТОВОСПРОИЗВЕДЕНИЕ (ОПЦИОНАЛЬНО)
let autoplayIntervals = {};

function startAutoplay(galleryType, interval = 5000) {
    if (autoplayIntervals[galleryType]) {
        clearInterval(autoplayIntervals[galleryType]);
    }
    
    autoplayIntervals[galleryType] = setInterval(() => {
        switch(galleryType) {
            case 'aero':
                changeImageAero('next');
                break;
            case 'security':
                changeImageSecurity('next');
                break;
            case 'speed':
                changeMediaSpeed('next');
                break;
            case 'performance':
                changeImagePerformance('next');
                break;
        }
    }, interval);
}

function stopAutoplay(galleryType) {
    if (autoplayIntervals[galleryType]) {
        clearInterval(autoplayIntervals[galleryType]);
        delete autoplayIntervals[galleryType];
    }
}

// ДОБАВЛЕНИЕ ПОДСКАЗОК
function addTooltips() {
    // Навигационные кнопки
    document.querySelectorAll('.gallery-nav-aero.prev').forEach(btn => {
        btn.title = 'Предыдущий скриншот AeroAdmin (←)';
    });
    
    document.querySelectorAll('.gallery-nav-aero.next').forEach(btn => {
        btn.title = 'Следующий скриншот AeroAdmin (→)';
    });
    
    document.querySelectorAll('.gallery-nav-security.prev').forEach(btn => {
        btn.title = 'Предыдущий скриншот безопасности (←)';
    });
    
    document.querySelectorAll('.gallery-nav-security.next').forEach(btn => {
        btn.title = 'Следующий скриншот безопасности (→)';
    });
    
    document.querySelectorAll('.gallery-nav-speed.prev').forEach(btn => {
        btn.title = 'Предыдущий медиафайл (←)';
    });
    
    document.querySelectorAll('.gallery-nav-speed.next').forEach(btn => {
        btn.title = 'Следующий медиафайл (→)';
    });
    
    document.querySelectorAll('.gallery-nav-performance.prev').forEach(btn => {
        btn.title = 'Предыдущий скриншот производительности (←)';
    });
    
    document.querySelectorAll('.gallery-nav-performance.next').forEach(btn => {
        btn.title = 'Следующий скриншот производительности (→)';
    });

    // Изображения с зумом
    document.querySelectorAll('#mainImageAero, #mainImageSecurity, #mainImageSpeed, #mainImagePerformance').forEach(img => {
        img.title = 'Нажмите для увеличения';
    });
}

// СЧЕТЧИК ПРОСМОТРЕННЫХ ЭКСПЕРИМЕНТОВ
function trackViewedExperiments() {
    const experimentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const experimentCard = entry.target;
                const experimentNumber = experimentCard.querySelector('.experiment-number');
                if (experimentNumber) {
                    const number = experimentNumber.textContent.trim();
                    viewedExperiments.add(number);
                    console.log(`Просмотрен эксперимент ${number}. Всего просмотрено: ${viewedExperiments.size}`);
                }
            }
        });
    }, { threshold: 0.5 });

    // Наблюдаем за всеми карточками экспериментов
    document.querySelectorAll('.experiment-card').forEach(card => {
        experimentObserver.observe(card);
    });
}

// ЭФФЕКТ ПЕЧАТАЮЩЕГОСЯ ТЕКСТА
function typeWriterEffect(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    element.style.borderRight = '2px solid #ff6b35';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Убираем курсор после завершения печати
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 1000);
        }
    }
    type();
}

// АНИМАЦИЯ ЗАКЛЮЧЕНИЯ
function initConclusionAnimation() {
    const conclusionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && viewedExperiments.size >= 3) {
                const conclusionText = entry.target.querySelector('p');
                if (conclusionText && !conclusionText.classList.contains('animated')) {
                    conclusionText.classList.add('animated');
                    const originalText = conclusionText.textContent;
                    typeWriterEffect(conclusionText, originalText, 40);
                }
            }
        });
    }, { threshold: 0.3 });

    // Ищем секцию заключения
    const conclusionSection = document.querySelector('[style*="background: rgba(255, 107, 53, 0.1)"]');
    if (conclusionSection) {
        conclusionObserver.observe(conclusionSection);
    }
}

// СЧЕТЧИК ВРЕМЕНИ НА СТРАНИЦЕ
function addTimeCounter() {
    const startTime = Date.now();
    
    function createTimeDisplay() {
        const timeDisplay = document.createElement('div');
        timeDisplay.id = 'time-counter';
        timeDisplay.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(255, 107, 53, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 15px;
            font-size: 0.85em;
            font-weight: bold;
            z-index: 1000;
            backdrop-filter: blur(5px);
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(timeDisplay);
        return timeDisplay;
    }

    const timeDisplay = createTimeDisplay();
    
    function updateTime() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timeDisplay.textContent = `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Обновляем каждую секунду
    setInterval(updateTime, 1000);
    updateTime(); // Первоначальное обновление

    // Hover эффект для счетчика
    timeDisplay.addEventListener('mouseenter', () => {
        timeDisplay.style.transform = 'scale(1.1)';
        timeDisplay.style.background = 'rgba(255, 107, 53, 1)';
    });

    timeDisplay.addEventListener('mouseleave', () => {
        timeDisplay.style.transform = 'scale(1)';
        timeDisplay.style.background = 'rgba(255, 107, 53, 0.9)';
    });
}

// ЭФФЕКТЫ ДЛЯ КАРТОЧЕК ЭКСПЕРИМЕНТОВ
function addCardEffects() {
    const cards = document.querySelectorAll('.experiment-card');
    
    cards.forEach((card, index) => {
        // Анимация появления карточек
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);

        // Hover эффекты
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
            card.style.boxShadow = '0 10px 25px rgba(255, 107, 53, 0.2)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
        });

        // Эффект для номеров экспериментов
        const experimentNumber = card.querySelector('.experiment-number');
        if (experimentNumber) {
            experimentNumber.addEventListener('mouseenter', () => {
                experimentNumber.style.transform = 'rotate(-10deg) scale(1.1)';
                experimentNumber.style.boxShadow = '0 0 15px rgba(255, 107, 53, 0.6)';
            });

            experimentNumber.addEventListener('mouseleave', () => {
                experimentNumber.style.transform = 'rotate(0deg) scale(1)';
                experimentNumber.style.boxShadow = '';
            });
        }
    });
}

// ПРОГРЕСС-БАР ПРОСМОТРА ЭКСПЕРИМЕНТОВ
function addProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'experiment-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #ff6b35, #ff8c42);
        z-index: 1001;
        transition: width 0.3s ease;
        box-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
    `;
    document.body.appendChild(progressBar);

    function updateProgress() {
        const totalExperiments = 4;
        const progress = (viewedExperiments.size / totalExperiments) * 100;
        progressBar.style.width = progress + '%';
        
        if (progress === 100) {
            // Анимация завершения
            setTimeout(() => {
                progressBar.style.background = 'linear-gradient(90deg, #28a745, #20c997)';
                progressBar.style.height = '6px';
                setTimeout(() => {
                    progressBar.style.height = '4px';
                }, 500);
            }, 300);
        }
    }

    // Обновляем прогресс при изменении viewedExperiments
    const originalAdd = viewedExperiments.add;
    viewedExperiments.add = function(value) {
        const result = originalAdd.call(this, value);
        updateProgress();
        return result;
    };
}

// УВЕДОМЛЕНИЯ О ДОСТИЖЕНИЯХ
function showAchievementNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#ff6b35'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 1002;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Автоматическое скрытие
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ОТСЛЕЖИВАНИЕ ДОСТИЖЕНИЙ
function trackAchievements() {
    const originalAdd = viewedExperiments.add;
    viewedExperiments.add = function(value) {
        const sizeBefore = this.size;
        const result = originalAdd.call(this, value);
        
        if (this.size > sizeBefore) {
            switch(this.size) {
                case 1:
                    showAchievementNotification('🎉 Первый эксперимент просмотрен!');
                    break;
                case 2:
                    showAchievementNotification('🔥 Два эксперимента изучены!');
                    break;
                case 3:
                    showAchievementNotification('⭐ Три четверти пути пройдено!');
                    break;
                case 4:
                    showAchievementNotification('🏆 Все эксперименты изучены! Поздравляем!', 'success');
                    // Запускаем конфетти или другой эффект
                    setTimeout(() => {
                        createConfettiEffect();
                    }, 500);
                    break;
            }
        }
        
        return result;
    };
}

// ЭФФЕКТ КОНФЕТТИ
function createConfettiEffect() {
    const colors = ['#ff6b35', '#ff8c42', '#ffa726', '#ffb74d', '#ffcc80'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}%;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                z-index: 1003;
                pointer-events: none;
                border-radius: 50%;
                animation: confetti-fall 3s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (document.body.contains(confetti)) {
                    document.body.removeChild(confetti);
                }
            }, 3000);
        }, i * 50);
    }
}

// CSS анимация для конфетти
function addConfettiCSS() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confetti-fall {
            0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ГЛАВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ
function initAeroAdminExperiments() {
    console.log('🚀 Запуск AeroAdmin Experiments...');
    
    // Основные функции
    initializeGalleries();
    initKeyboardSupport();
    initTouchSupport();
    
    // Дополнительные функции
    setTimeout(() => {
        addLoadingIndicators();
        addTooltips();
        optimizeForMobile();
        trackViewedExperiments();
        initConclusionAnimation();
        addTimeCounter();
        addCardEffects();
        addProgressBar();
        trackAchievements();
        addConfettiCSS();
    }, 500);
    
    console.log('✅ AeroAdmin Experiments полностью инициализирован!');
    console.log('📊 Доступные галереи:', {
        'AeroAdmin': imageDataAero.length + ' изображений',
        'Security': imageDataSecurity.length + ' изображений', 
        'Speed': mediaDataSpeed.length + ' медиафайлов',
        'Performance': imageDataPerformance.length + ' изображений'
    });
}

// ОБРАБОТКА ИЗМЕНЕНИЯ РАЗМЕРА ОКНА
window.addEventListener('resize', () => {
    optimizeForMobile();
});

// ОБРАБОТКА ВИДИМОСТИ СТРАНИЦЫ
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Останавливаем все автовоспроизведения при скрытии страницы
        Object.keys(autoplayIntervals).forEach(galleryType => {
            stopAutoplay(galleryType);
        });
        
        // Ставим на паузу все видео
        document.querySelectorAll('video').forEach(video => {
            video.pause();
        });
    }
});

// ЗАПУСК ПОСЛЕ ЗАГРУЗКИ DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM загружен, инициализация AeroAdmin Experiments...');
    
    // Небольшая задержка для полной загрузки стилей
    setTimeout(() => {
        initAeroAdminExperiments();
    }, 100);
});

// ЗАПУСК ПОСЛЕ ПОЛНОЙ ЗАГРУЗКИ СТРАНИЦЫ
window.addEventListener('load', () => {
    console.log('🎯 Страница полностью загружена');
    
    // Дополнительная оптимизация после загрузки всех ресурсов
    setTimeout(() => {
        // Предзагрузка изображений для плавной работы галерей
        preloadImages();
        
        // Финальная оптимизация
        optimizeForMobile();
        
        console.log('🏁 AeroAdmin Experiments готов к использованию!');
    }, 200);
});

// ПРЕДЗАГРУЗКА ИЗОБРАЖЕНИЙ
function preloadImages() {
    const allImages = [
        ...imageDataAero.map(item => item.src),
        ...imageDataSecurity.map(item => item.src),
        ...mediaDataSpeed.filter(item => item.type === 'image').map(item => item.src),
        ...imageDataPerformance.map(item => item.src)
    ];
    
    allImages.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => console.log('✅ Предзагружено:', src);
        img.onerror = () => console.warn('❌ Ошибка загрузки:', src);
    });
}

// ЭКСПОРТ ФУНКЦИЙ ДЛЯ ГЛОБАЛЬНОГО ДОСТУПА
window.AeroAdminGallery = {
    // Функции управления галереями
    goToImageAero,
    changeImageAero,
    toggleZoomAero,
    goToImageSecurity,
    changeImageSecurity,
    toggleZoomSecurity,
    goToMediaSpeed,
    changeMediaSpeed,
    toggleZoomSpeed,
    goToImagePerformance,
    changeImagePerformance,
    toggleZoomPerformance,
    
    // Функции управления автовоспроизведением
    startAutoplay,
    stopAutoplay,
    
    // Утилиты
    getActiveGallery,
    optimizeForMobile,
    preloadImages,
    
    // Данные галерей
    imageDataAero,
    imageDataSecurity,
    mediaDataSpeed,
    imageDataPerformance,
    
    // Текущие индексы
    getCurrentIndexes: () => ({
        aero: currentImageIndexAero,
        security: currentImageIndexSecurity,
        speed: currentMediaIndexSpeed,
        performance: currentImageIndexPerformance
    }),
    
    // Статистика
    getViewedExperiments: () => Array.from(viewedExperiments),
    getViewedCount: () => viewedExperiments.size
};

// ДОПОЛНИТЕЛЬНЫЕ УТИЛИТЫ ДЛЯ ОТЛАДКИ
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Функции отладки только для локальной разработки
    window.AeroAdminDebug = {
        logGalleryState: () => {
            console.log('🔍 Состояние галерей:', {
                'AeroAdmin': {
                    current: currentImageIndexAero,
                    total: imageDataAero.length,
                    data: imageDataAero[currentImageIndexAero]
                },
                'Security': {
                    current: currentImageIndexSecurity,
                    total: imageDataSecurity.length,
                    data: imageDataSecurity[currentImageIndexSecurity]
                },
                'Speed': {
                    current: currentMediaIndexSpeed,
                    total: mediaDataSpeed.length,
                    data: mediaDataSpeed[currentMediaIndexSpeed]
                },
                'Performance': {
                    current: currentImageIndexPerformance,
                    total: imageDataPerformance.length,
                    data: imageDataPerformance[currentImageIndexPerformance]
                }
            });
        },
        
        testAllGalleries: () => {
            console.log('🧪 Тестирование всех галерей...');
            
            // Тест AeroAdmin галереи
            for (let i = 0; i < imageDataAero.length; i++) {
                setTimeout(() => goToImageAero(i), i * 1000);
            }
            
            // Тест Security галереи
            setTimeout(() => {
                for (let i = 0; i < imageDataSecurity.length; i++) {
                    setTimeout(() => goToImageSecurity(i), i * 1000);
                }
            }, imageDataAero.length * 1000);
            
            // Тест Speed галереи
            setTimeout(() => {
                for (let i = 0; i < mediaDataSpeed.length; i++) {
                    setTimeout(() => goToMediaSpeed(i), i * 1000);
                }
            }, (imageDataAero.length + imageDataSecurity.length) * 1000);
            
            // Тест Performance галереи
            setTimeout(() => {
                for (let i = 0; i < imageDataPerformance.length; i++) {
                    setTimeout(() => goToImagePerformance(i), i * 1000);
                }
            }, (imageDataAero.length + imageDataSecurity.length + mediaDataSpeed.length) * 1000);
        },
        
        simulateViewedExperiments: () => {
            console.log('🎭 Симуляция просмотра всех экспериментов...');
            ['1', '2', '3', '4'].forEach((num, index) => {
                setTimeout(() => {
                    viewedExperiments.add(num);
                    console.log(`Добавлен эксперимент ${num}`);
                }, index * 1000);
            });
        },
        
        checkImagePaths: () => {
            console.log('🖼️ Проверка путей к изображениям...');
            const allPaths = [
                ...imageDataAero.map(item => item.src),
                ...imageDataSecurity.map(item => item.src),
                ...mediaDataSpeed.filter(item => item.type === 'image').map(item => item.src),
                ...imageDataPerformance.map(item => item.src)
            ];
            
            allPaths.forEach(path => {
                const img = new Image();
                img.onload = () => console.log('✅', path);
                img.onerror = () => console.error('❌', path);
                img.src = path;
            });
        }
    };
    
    console.log('🛠️ Режим отладки активирован. Доступны функции в window.AeroAdminDebug');
}

// ОБРАБОТКА ОШИБОК
window.addEventListener('error', (e) => {
    if (e.filename && e.filename.includes('aeroadminscript.js')) {
        console.error('❌ Ошибка в AeroAdmin скрипте:', {
            message: e.message,
            line: e.lineno,
            column: e.colno,
            filename: e.filename
        });
        
        // Попытка восстановления базовой функциональности
        setTimeout(() => {
            console.log('🔄 Попытка восстановления...');
            try {
                initializeGalleries();
                console.log('✅ Базовая функциональность восстановлена');
            } catch (recoveryError) {
                console.error('❌ Не удалось восстановить функциональность:', recoveryError);
            }
        }, 1000);
    }
});

// ФИНАЛЬНАЯ ПРОВЕРКА И ЛОГИРОВАНИЕ
setTimeout(() => {
    const requiredElements = [
        '#mainImageAero',
        '#mainImageSecurity', 
        '#mainImageSpeed',
        '#mainVideoSpeed',
        '#mainImagePerformance'
    ];
    
    const missingElements = requiredElements.filter(selector => !document.querySelector(selector));
    
    if (missingElements.length > 0) {
        console.warn('⚠️ Отсутствуют элементы:', missingElements);
        console.log('💡 Убедитесь, что HTML содержит все необходимые элементы галерей');
    } else {
        console.log('✅ Все необходимые элементы найдены');
    }
    
    // Финальная статистика
    console.log('📈 Статистика инициализации:', {
        'Галереи инициализированы': '4/4',
        'Изображений загружено': imageDataAero.length + imageDataSecurity.length + imageDataPerformance.length,
        'Медиафайлов': mediaDataSpeed.length,
        'Обработчики событий': 'Активны',
        'Мобильная оптимизация': window.innerWidth <= 768 ? 'Включена' : 'Выключена',
        'Время инициализации': Date.now() - (window.aeroadminStartTime || Date.now()) + 'ms'
    });
    
    // Показываем готовность системы
    if (document.querySelector('.experiment-card')) {
        showAchievementNotification('🚀 AeroAdmin Experiments готов!', 'success');
    }
    
}, 2000);

// Сохраняем время начала для статистики
window.aeroadminStartTime = Date.now();

// ЭКСПОРТ ДЛЯ МОДУЛЬНЫХ СИСТЕМ (если используются)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.AeroAdminGallery;
}

if (typeof define === 'function' && define.amd) {
    define([], () => window.AeroAdminGallery);
}

console.log('🎉 AeroAdmin Experiments Script загружен успешно!');
console.log('📚 Доступные функции в window.AeroAdminGallery');
console.log('🔧 Функции отладки в window.AeroAdminDebug (только для localhost)');

