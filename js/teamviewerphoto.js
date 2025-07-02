// TEAMVIEWER EXPERIMENTS GALLERY SCRIPT
console.log('🚀 Загрузка TeamViewer Experiments Script...');

// ДАННЫЕ ГАЛЕРЕЙ
// Галерея 1 - Буфер обмена (2 изображения)
let currentImageIndexClipboard = 0;
const imageDataClipboard = [
    {
        src: '../izobr/teamviewer/copy-local.png',
        alt: 'Копирование в буфер обмена',
        description: 'Копирование текста в буфер обмена на локальном компьютере'
    },
    {
        src: '../izobr/teamviewer/copy-remote.png',
        alt: 'Вставка из буфера обмена',
        description: 'Вставка текста из буфера обмена на удаленном компьютере через TeamViewer'
    }
];

// Галерея 2 - Передача файлов (3 изображения)
let currentImageIndexFileTransfer = 0;
const imageDataFileTransfer = [
    {
        src: '../izobr/teamviewer/before-drag.png',
        alt: 'Перед перетаскиванием',
        description: 'Перед перетаскиванием файла в TeamViewer'
    },
    {
        src: '../izobr/teamviewer/after-drag.png',
        alt: 'После перетаскивания',
        description: 'После перетаскивания файла между локальным и удаленным компьютером'
    },
    {
        src: '../izobr/teamviewer/all-file.png',
        alt: 'Завершение передачи файла',
        description: 'Успешное завершение передачи файла с подтверждением'
    }
];

// Галерея 3 - Файловый менеджер (2 изображения)
let currentImageIndexFileManager = 0;
const imageDataFileManager = [
    {
        src: '../izobr/teamviewer/file-interface.png',
        alt: 'Интерфейс файлового менеджера',
        description: 'Интерфейс встроенного файлового менеджера TeamViewer'
    },
    {
        src: '../izobr/teamviewer/proceed.png',
        alt: 'Прогресс массовой передачи',
        description: 'Индикатор прогресса при массовой передаче файлов'
    }
];

// Галерея 4 - Комбинации клавиш (4 изображения)
let currentImageIndexKeyCombo = 0;
const imageDataKeyCombo = [
    {
        src: '../izobr/teamviewer/hotkey-menu.png',
        alt: 'Меню горячих клавиш',
        description: 'Меню "Горячие клавиши" в TeamViewer для отправки системных комбинаций клавиш'
    },
    {
        src: '../izobr/teamviewer/afterctrl-al-del.png',
        alt: 'Срабатывание команды Ctrl+Alt+Del',
        description: 'Срабатывание комбинации Ctrl+Alt+Del на удаленном компьютере'
    },
    {
        src: '../izobr/teamviewer/lock-menu.png',
        alt: 'Выбор блокировки Windows',
        description: 'Выбор блокировки Windows на удаленном компьютере'
    },
    {
        src: '../izobr/teamviewer/lock-screen.png',
        alt: 'Блокировка экрана',
        description: 'Блокировка экрана на удаленном компьютере'
    }
];

// Галерея 5 - Безопасность (3 изображения)
let currentImageIndexSecurity = 0;
const imageDataSecurity = [
    {
        src: '../izobr/teamviewer/easy-connect.png',
        alt: 'Быстрое подключение к известному ПК',
        description: 'Быстрое подключение к известному ПК'
    },
    {
        src: '../izobr/teamviewer/random-password.png',
        alt: 'Случайный пароль',
        description: 'Случайный пароль для доступа к удаленному компьютеру'
    },
    {
        src: '../izobr/teamviewer/white-list.png',
        alt: 'Белый список',
        description: 'Белый список для ограничения доступа к удаленному компьютеру'
    }
];

// ФУНКЦИИ ДЛЯ ГАЛЕРЕИ SECURITY (5-й эксперимент)
function goToImageSecurity(index) {
    if (index >= 0 && index < imageDataSecurity.length) {
        currentImageIndexSecurity = index;
        updateGallerySecurity();
        console.log('Security галерея: переход к изображению', index + 1);
    }
}

function changeImageSecurity(direction) {
    if (direction === 'next') {
        currentImageIndexSecurity = (currentImageIndexSecurity + 1) % imageDataSecurity.length;
    } else {
        currentImageIndexSecurity = (currentImageIndexSecurity - 1 + imageDataSecurity.length) % imageDataSecurity.length;
    }
    updateGallerySecurity();
    console.log('Security галерея: изменение на', direction, '- текущий индекс:', currentImageIndexSecurity);
}

function updateGallerySecurity() {
    const mainImage = document.getElementById('mainImageSecurity');
    const description = document.getElementById('imageDescriptionSecurity');
    const currentCounter = document.getElementById('currentImageSecurity');
    const thumbnails = document.querySelectorAll('.thumbnail-security');

    if (mainImage && imageDataSecurity[currentImageIndexSecurity]) {
        // Плавная смена изображения
        mainImage.style.opacity = '0.3';
        setTimeout(() => {
            mainImage.src = imageDataSecurity[currentImageIndexSecurity].src;
            mainImage.alt = imageDataSecurity[currentImageIndexSecurity].alt;
            mainImage.style.opacity = '1';
        }, 150);
        
        if (description) {
            description.textContent = imageDataSecurity[currentImageIndexSecurity].description;
        }
        
        if (currentCounter) {
            currentCounter.textContent = currentImageIndexSecurity + 1;
        }

        // Обновляем активную миниатюру
        thumbnails.forEach((thumb, index) => {
            if (index === currentImageIndexSecurity) {
                thumb.style.border = '2px solid #fd7e14';
                thumb.style.opacity = '1';
                thumb.classList.add('active');
            } else {
                thumb.style.border = '2px solid transparent';
                thumb.style.opacity = '0.7';
                thumb.classList.remove('active');
            }
        });
    }
}

function toggleZoomSecurity(img) {
    if (img.style.transform === 'scale(1.8)') {
        img.style.transform = 'scale(1)';
        img.style.cursor = 'pointer';
        img.style.zIndex = '1';
    } else {
        img.style.transform = 'scale(1.8)';
        img.style.cursor = 'zoom-out';
        img.style.zIndex = '100';
        img.style.transformOrigin = 'center';
    }
}

// ФУНКЦИИ ДЛЯ ГАЛЕРЕИ KEY COMBO (4-й эксперимент)
function goToImageKeyCombo(index) {
    if (index >= 0 && index < imageDataKeyCombo.length) {
        currentImageIndexKeyCombo = index;
        updateGalleryKeyCombo();
        console.log('KeyCombo галерея: переход к изображению', index + 1);
    }
}

function changeImageKeyCombo(direction) {
    if (direction === 'next') {
        currentImageIndexKeyCombo = (currentImageIndexKeyCombo + 1) % imageDataKeyCombo.length;
    } else {
        currentImageIndexKeyCombo = (currentImageIndexKeyCombo - 1 + imageDataKeyCombo.length) % imageDataKeyCombo.length;
    }
    updateGalleryKeyCombo();
    console.log('KeyCombo галерея: изменение на', direction, '- текущий индекс:', currentImageIndexKeyCombo);
}

function updateGalleryKeyCombo() {
    const mainImage = document.getElementById('mainImageKeyCombo');
    const description = document.getElementById('imageDescriptionKeyCombo');
    const currentCounter = document.getElementById('currentImageKeyCombo');
    const thumbnails = document.querySelectorAll('.thumbnail-keycombo');

    if (mainImage && imageDataKeyCombo[currentImageIndexKeyCombo]) {
        // Плавная смена изображения
        mainImage.style.opacity = '0.3';
        setTimeout(() => {
            mainImage.src = imageDataKeyCombo[currentImageIndexKeyCombo].src;
            mainImage.alt = imageDataKeyCombo[currentImageIndexKeyCombo].alt;
            mainImage.style.opacity = '1';
        }, 150);
        
        if (description) {
            description.textContent = imageDataKeyCombo[currentImageIndexKeyCombo].description;
        }
        
        if (currentCounter) {
            currentCounter.textContent = currentImageIndexKeyCombo + 1;
        }

        // Обновляем активную миниатюру
        thumbnails.forEach((thumb, index) => {
            if (index === currentImageIndexKeyCombo) {
                thumb.style.border = '2px solid #17a2b8';
                thumb.style.opacity = '1';
                thumb.classList.add('active');
            } else {
                thumb.style.border = '2px solid transparent';
                thumb.style.opacity = '0.7';
                thumb.classList.remove('active');
            }
        });
    }
}

function toggleZoomKeyCombo(img) {
    if (img.style.transform === 'scale(1.8)') {
        img.style.transform = 'scale(1)';
        img.style.cursor = 'pointer';
        img.style.zIndex = '1';
    } else {
        img.style.transform = 'scale(1.8)';
        img.style.cursor = 'zoom-out';
        img.style.zIndex = '100';
        img.style.transformOrigin = 'center';
    }
}

// ФУНКЦИИ ДЛЯ ГАЛЕРЕИ CLIPBOARD (1-й эксперимент)
function goToImageClipboard(index) {
    if (index >= 0 && index < imageDataClipboard.length) {
        currentImageIndexClipboard = index;
        updateGalleryClipboard();
        console.log('Clipboard галерея: переход к изображению', index + 1);
    }
}

function changeImageClipboard(direction) {
    if (direction === 'next') {
        currentImageIndexClipboard = (currentImageIndexClipboard + 1) % imageDataClipboard.length;
    } else {
        currentImageIndexClipboard = (currentImageIndexClipboard - 1 + imageDataClipboard.length) % imageDataClipboard.length;
    }
    updateGalleryClipboard();
    console.log('Clipboard галерея: изменение на', direction, '- текущий индекс:', currentImageIndexClipboard);
}

function updateGalleryClipboard() {
    const mainImage = document.getElementById('mainImageClipboard');
    const description = document.getElementById('imageDescriptionClipboard');
    const currentCounter = document.getElementById('currentImageClipboard');
    const thumbnails = document.querySelectorAll('.thumbnail-clipboard');

    if (mainImage && imageDataClipboard[currentImageIndexClipboard]) {
        // Плавная смена изображения
        mainImage.style.opacity = '0.3';
        setTimeout(() => {
            mainImage.src = imageDataClipboard[currentImageIndexClipboard].src;
            mainImage.alt = imageDataClipboard[currentImageIndexClipboard].alt;
            mainImage.style.opacity = '1';
        }, 150);
        
        if (description) {
            description.textContent = imageDataClipboard[currentImageIndexClipboard].description;
        }
        
        if (currentCounter) {
            currentCounter.textContent = currentImageIndexClipboard + 1;
        }

        // Обновляем активную миниатюру
        thumbnails.forEach((thumb, index) => {
            if (index === currentImageIndexClipboard) {
                thumb.style.border = '2px solid #28a745';
                thumb.style.opacity = '1';
                thumb.classList.add('active');
            } else {
                thumb.style.border = '2px solid transparent';
                thumb.style.opacity = '0.7';
                thumb.classList.remove('active');
            }
        });
    }
}

function toggleZoomClipboard(img) {
    if (img.style.transform === 'scale(1.8)') {
        img.style.transform = 'scale(1)';
        img.style.cursor = 'pointer';
        img.style.zIndex = '1';
    } else {
        img.style.transform = 'scale(1.8)';
        img.style.cursor = 'zoom-out';
        img.style.zIndex = '100';
        img.style.transformOrigin = 'center';
    }
}

// ФУНКЦИИ ДЛЯ ГАЛЕРЕИ FILE TRANSFER (2-й эксперимент)
function goToImageFileTransfer(index) {
    if (index >= 0 && index < imageDataFileTransfer.length) {
         currentImageIndexFileTransfer = index;
        updateGalleryFileTransfer();
        console.log('FileTransfer галерея: переход к изображению', index + 1);
    }
}

function changeImageFileTransfer(direction) {
    if (direction === 'next') {
        currentImageIndexFileTransfer = (currentImageIndexFileTransfer + 1) % imageDataFileTransfer.length;
    } else {
        currentImageIndexFileTransfer = (currentImageIndexFileTransfer - 1 + imageDataFileTransfer.length) % imageDataFileTransfer.length;
    }
    updateGalleryFileTransfer();
    console.log('FileTransfer галерея: изменение на', direction, '- текущий индекс:', currentImageIndexFileTransfer);
}

function updateGalleryFileTransfer() {
    const mainImage = document.getElementById('mainImageFileTransfer');
    const description = document.getElementById('imageDescriptionFileTransfer');
    const currentCounter = document.getElementById('currentImageFileTransfer');
    const thumbnails = document.querySelectorAll('.thumbnail-filetransfer');

    if (mainImage && imageDataFileTransfer[currentImageIndexFileTransfer]) {
        // Плавная смена изображения
        mainImage.style.opacity = '0.3';
        setTimeout(() => {
            mainImage.src = imageDataFileTransfer[currentImageIndexFileTransfer].src;
            mainImage.alt = imageDataFileTransfer[currentImageIndexFileTransfer].alt;
            mainImage.style.opacity = '1';
        }, 150);
        
        if (description) {
            description.textContent = imageDataFileTransfer[currentImageIndexFileTransfer].description;
        }
        
        if (currentCounter) {
            currentCounter.textContent = currentImageIndexFileTransfer + 1;
        }

        // Обновляем активную миниатюру
        thumbnails.forEach((thumb, index) => {
            if (index === currentImageIndexFileTransfer) {
                thumb.style.border = '2px solid #dc3545';
                thumb.style.opacity = '1';
                thumb.classList.add('active');
            } else {
                thumb.style.border = '2px solid transparent';
                thumb.style.opacity = '0.7';
                thumb.classList.remove('active');
            }
        });
    }
}

function toggleZoomFileTransfer(img) {
    if (img.style.transform === 'scale(1.8)') {
        img.style.transform = 'scale(1)';
        img.style.cursor = 'pointer';
        img.style.zIndex = '1';
    } else {
        img.style.transform = 'scale(1.8)';
        img.style.cursor = 'zoom-out';
        img.style.zIndex = '100';
        img.style.transformOrigin = 'center';
    }
}

// ФУНКЦИИ ДЛЯ ГАЛЕРЕИ FILE MANAGER (3-й эксперимент)
function goToImageFileManager(index) {
    if (index >= 0 && index < imageDataFileManager.length) {
        currentImageIndexFileManager = index;
        updateGalleryFileManager();
        console.log('FileManager галерея: переход к изображению', index + 1);
    }
}

function changeImageFileManager(direction) {
    if (direction === 'next') {
        currentImageIndexFileManager = (currentImageIndexFileManager + 1) % imageDataFileManager.length;
    } else {
        currentImageIndexFileManager = (currentImageIndexFileManager - 1 + imageDataFileManager.length) % imageDataFileManager.length;
    }
    updateGalleryFileManager();
    console.log('FileManager галерея: изменение на', direction, '- текущий индекс:', currentImageIndexFileManager);
}

function updateGalleryFileManager() {
    const mainImage = document.getElementById('mainImageFileManager');
    const description = document.getElementById('imageDescriptionFileManager');
    const currentCounter = document.getElementById('currentImageFileManager');
    const thumbnails = document.querySelectorAll('.thumbnail-filemanager');

    if (mainImage && imageDataFileManager[currentImageIndexFileManager]) {
        // Плавная смена изображения
        mainImage.style.opacity = '0.3';
        setTimeout(() => {
            mainImage.src = imageDataFileManager[currentImageIndexFileManager].src;
            mainImage.alt = imageDataFileManager[currentImageIndexFileManager].alt;
            mainImage.style.opacity = '1';
        }, 150);
        
        if (description) {
            description.textContent = imageDataFileManager[currentImageIndexFileManager].description;
        }
        
        if (currentCounter) {
            currentCounter.textContent = currentImageIndexFileManager + 1;
        }

        // Обновляем активную миниатюру
        thumbnails.forEach((thumb, index) => {
            if (index === currentImageIndexFileManager) {
                thumb.style.border = '2px solid #6f42c1';
                thumb.style.opacity = '1';
                thumb.classList.add('active');
            } else {
                thumb.style.border = '2px solid transparent';
                thumb.style.opacity = '0.7';
                thumb.classList.remove('active');
            }
        });
    }
}

function toggleZoomFileManager(img) {
    if (img.style.transform === 'scale(1.8)') {
        img.style.transform = 'scale(1)';
        img.style.cursor = 'pointer';
        img.style.zIndex = '1';
    } else {
        img.style.transform = 'scale(1.8)';
        img.style.cursor = 'zoom-out';
        img.style.zIndex = '100';
        img.style.transformOrigin = 'center';
    }
}

// ИНИЦИАЛИЗАЦИЯ ГАЛЕРЕЙ
function initializeTeamViewerGalleries() {
    console.log('🔧 Инициализация TeamViewer галерей...');

    // Инициализация галереи Clipboard
    setTimeout(() => {
        updateGalleryClipboard();
        initGalleryControls('clipboard');
        console.log('✅ Галерея Clipboard инициализирована');
    }, 100);

    // Инициализация галереи FileTransfer
    setTimeout(() => {
        updateGalleryFileTransfer();
        initGalleryControls('filetransfer');
        console.log('✅ Галерея FileTransfer инициализирована');
    }, 200);

    // Инициализация галереи FileManager
    setTimeout(() => {
        updateGalleryFileManager();
        initGalleryControls('filemanager');
        console.log('✅ Галерея FileManager инициализирована');
    }, 300);

    // Инициализация галереи KeyCombo
    setTimeout(() => {
        updateGalleryKeyCombo();
        initGalleryControls('keycombo');
        console.log('✅ Галерея KeyCombo инициализирована');
    }, 400);

    // Инициализация галереи Security
    setTimeout(() => {
        updateGallerySecurity();
        initGalleryControls('security');
        console.log('✅ Галерея Security инициализирована');
    }, 500);
}

// ИНИЦИАЛИЗАЦИЯ ЭЛЕМЕНТОВ УПРАВЛЕНИЯ
function initGalleryControls(galleryType) {
    const prevBtn = document.querySelector(`.gallery-nav-${galleryType}.prev`);
    const nextBtn = document.querySelector(`.gallery-nav-${galleryType}.next`);

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switch(galleryType) {
                case 'clipboard':
                    changeImageClipboard('prev');
                    break;
                case 'filetransfer':
                    changeImageFileTransfer('prev');
                    break;
                case 'filemanager':
                    changeImageFileManager('prev');
break;
                case 'keycombo':
                    changeImageKeyCombo('prev');
                    break;
                case 'security':
                    changeImageSecurity('prev');
                    break;
            }
        });

        // Hover эффекты для кнопок
        prevBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-50%) scale(1.1)';
        });
        prevBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-50%) scale(1)';
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switch(galleryType) {
                case 'clipboard':
                    changeImageClipboard('next');
                    break;
                case 'filetransfer':
                    changeImageFileTransfer('next');
                    break;
                case 'filemanager':
                    changeImageFileManager('next');
                    break;
                case 'keycombo':
                    changeImageKeyCombo('next');
                    break;
                case 'security':
                    changeImageSecurity('next');
                    break;
            }
        });

        // Hover эффекты для кнопок
        nextBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-50%) scale(1.1)';
        });
        nextBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-50%) scale(1)';
        });
    }

    // Hover эффекты для миниатюр
    document.querySelectorAll(`.thumbnail-${galleryType}`).forEach((thumb, index) => {
        thumb.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.opacity = '1';
                this.style.transform = 'scale(1.05)';
            }
        });

        thumb.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.opacity = '0.7';
                this.style.transform = 'scale(1)';
            }
        });
    });
}

// ПОДДЕРЖКА КЛАВИАТУРЫ
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Закрытие всех увеличенных изображений
        const zoomedImages = document.querySelectorAll('img[style*="scale(1.8)"]');
        zoomedImages.forEach(img => {
            img.style.transform = 'scale(1)';
            img.style.cursor = 'pointer';
            img.style.zIndex = '1';
        });
        console.log('Закрыты все увеличенные изображения');
        return;
    }

    // Определяем активную галерею
    const activeElement = document.activeElement;
    let activeGallery = null;

    if (activeElement.closest('.clipboard-gallery') || activeElement.classList.contains('gallery-nav-clipboard') || activeElement.classList.contains('thumbnail-clipboard')) {
        activeGallery = 'clipboard';
    } else if (activeElement.closest('.filetransfer-gallery') || activeElement.classList.contains('gallery-nav-filetransfer') || activeElement.classList.contains('thumbnail-filetransfer')) {
        activeGallery = 'filetransfer';
    } else if (activeElement.closest('.filemanager-gallery') || activeElement.classList.contains('gallery-nav-filemanager') || activeElement.classList.contains('thumbnail-filemanager')) {
        activeGallery = 'filemanager';
    }

    if (activeGallery) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            switch(activeGallery) {
                case 'clipboard':
                    changeImageClipboard('prev');
                    break;
                case 'filetransfer':
                    changeImageFileTransfer('prev');
                    break;
                case 'filemanager':
                    changeImageFileManager('prev');
                    break;
            }
            console.log(`Клавиша ВЛЕВО - ${activeGallery} галерея`);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            switch(activeGallery) {
                case 'clipboard':
                    changeImageClipboard('next');
                    break;
                case 'filetransfer':
                    changeImageFileTransfer('next');
                    break;
                case 'filemanager':
                    changeImageFileManager('next');
                    break;
            }
            console.log(`Клавиша ВПРАВО - ${activeGallery} галерея`);
        }
    }
});

// ПОДДЕРЖКА СЕНСОРНЫХ ЖЕСТОВ
let touchStartX = 0;
let touchEndX = 0;
let activeGalleryForTouch = null;

function handleGesture(galleryType) {
    const threshold = 50;
    const diff = touchEndX - touchStartX;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            // Свайп вправо - предыдущее изображение
            switch(galleryType) {
                case 'clipboard':
                    changeImageClipboard('prev');
                    break;
                case 'filetransfer':
                    changeImageFileTransfer('prev');
                    break;
                case 'filemanager':
                    changeImageFileManager('prev');
                    break;
            }
            console.log(`Свайп ВПРАВО - ${galleryType} галерея`);
        } else {
            // Свайп влево - следующее изображение
            switch(galleryType) {
                case 'clipboard':
                    changeImageClipboard('next');
                    break;
                case 'filetransfer':
                    changeImageFileTransfer('next');
                    break;
                case 'filemanager':
                    changeImageFileManager('next');
                    break;
            }
            console.log(`Свайп ВЛЕВО - ${galleryType} галерея`);
        }
    }
}

// Добавляем обработчики touch событий
function initTouchSupport() {
    const galleries = [
        { selector: '.clipboard-gallery .image-wrapper', type: 'clipboard' },
        { selector: '.filetransfer-gallery .image-wrapper', type: 'filetransfer' },
        { selector: '.filemanager-gallery .image-wrapper', type: 'filemanager' }
    ];

    galleries.forEach(gallery => {
        const element = document.querySelector(gallery.selector);
        if (element) {
            element.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                activeGalleryForTouch = gallery.type;
            });

            element.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                if (activeGalleryForTouch === gallery.type) {
                    handleGesture(gallery.type);
                }
            });
        }
    });
}

// ПРЕДЗАГРУЗКА ИЗОБРАЖЕНИЙ
function preloadImages() {
    console.log('🖼️ Предзагрузка изображений TeamViewer...');
    
    const allImages = [
        ...imageDataClipboard,
        ...imageDataFileTransfer,
        ...imageDataFileManager
    ];

    let loadedCount = 0;
    const totalImages = allImages.length;

    allImages.forEach(imageData => {
        const img = new Image();
        img.onload = () => {
            loadedCount++;
            console.log(`✅ Загружено ${loadedCount}/${totalImages}: ${imageData.src}`);
            
            if (loadedCount === totalImages) {
                console.log('🎉 Все изображения TeamViewer предзагружены!');
            }
        };
        img.onerror = () => {
            console.warn(`❌ Ошибка загрузки: ${imageData.src}`);
            loadedCount++;
        };
        img.src = imageData.src;
    });
}
// ОПТИМИЗАЦИЯ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ
function optimizeForMobile() {
    if (window.innerWidth <= 768) {
        console.log('📱 Применение мобильной оптимизации...');
        
        // Увеличиваем размер кнопок навигации на мобильных
        document.querySelectorAll('.gallery-nav-clipboard, .gallery-nav-filetransfer, .gallery-nav-filemanager').forEach(btn => {
            btn.style.width = '60px';
            btn.style.height = '60px';
            btn.style.fontSize = '24px';
        });

        // Увеличиваем миниатюры
        document.querySelectorAll('.thumbnail-clipboard, .thumbnail-filetransfer, .thumbnail-filemanager').forEach(thumb => {
            thumb.style.width = '80px';
            thumb.style.height = '60px';
        });

        // Уменьшаем высоту галерей
        document.querySelectorAll('.image-wrapper').forEach(wrapper => {
            wrapper.style.minHeight = '300px';
        });

        // Адаптируем размер изображений
        document.querySelectorAll('#mainImageClipboard, #mainImageFileTransfer, #mainImageFileManager').forEach(img => {
            img.style.maxHeight = '250px';
        });
    }
}

// ДОБАВЛЕНИЕ ПОДСКАЗОК
function addTooltips() {
    console.log('💡 Добавление подсказок...');
    
    // Подсказки для кнопок навигации
    const tooltips = [
        { selector: '.gallery-nav-clipboard.prev', text: 'Предыдущий скриншот буфера обмена (←)' },
        { selector: '.gallery-nav-clipboard.next', text: 'Следующий скриншот буфера обмена (→)' },
        { selector: '.gallery-nav-filetransfer.prev', text: 'Предыдущий скриншот передачи файлов (←)' },
        { selector: '.gallery-nav-filetransfer.next', text: 'Следующий скриншот передачи файлов (→)' },
        { selector: '.gallery-nav-filemanager.prev', text: 'Предыдущий скриншот файлового менеджера (←)' },
        { selector: '.gallery-nav-filemanager.next', text: 'Следующий скриншот файлового менеджера (→)' }
    ];

    tooltips.forEach(tooltip => {
        const element = document.querySelector(tooltip.selector);
        if (element) {
            element.title = tooltip.text;
        }
    });

    // Подсказки для zoom hints
    document.querySelectorAll('.zoom-hint-clipboard, .zoom-hint-filetransfer, .zoom-hint-filemanager').forEach(hint => {
        hint.title = 'Нажмите на изображение для увеличения';
    });
}

// ЭФФЕКТЫ ЗАГРУЗКИ
function addLoadingEffects() {
    console.log('✨ Добавление эффектов загрузки...');
    
    // Индикаторы загрузки для изображений
    const mainImages = document.querySelectorAll('#mainImageClipboard, #mainImageFileTransfer, #mainImageFileManager');
    
    mainImages.forEach(img => {
        img.addEventListener('loadstart', function() {
            this.style.opacity = '0.5';
            console.log('🔄 Начало загрузки:', this.id);
        });
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            console.log('✅ Изображение загружено:', this.id);
        });
        
        img.addEventListener('error', function() {
            this.style.opacity = '1';
            this.alt = 'Изображение не загружено';
            console.log('❌ Ошибка загрузки:', this.id);
        });
    });
}

// СПЕЦИАЛЬНЫЕ ЭФФЕКТЫ ДЛЯ TEAMVIEWER
function addTeamViewerEffects() {
    console.log('🎨 Добавление специальных эффектов TeamViewer...');
    
    // Пульсирующий эффект для placeholder'ов
    let teamviewerPulseInterval;
    
    function startTeamViewerPulse() {
        const galleries = document.querySelectorAll('.clipboard-gallery, .filetransfer-gallery, .filemanager-gallery');
        let currentIndex = 0;
        
        teamviewerPulseInterval = setInterval(() => {
            // Убираем эффекты с предыдущих элементов
            galleries.forEach(gallery => {
                gallery.style.boxShadow = '0 4px 15px rgba(0, 114, 255, 0.3)';
            });
            
            // Добавляем TeamViewer эффект к текущему элементу
            if (galleries[currentIndex]) {
                galleries[currentIndex].style.boxShadow = '0 0 30px rgba(0, 114, 255, 0.8)';
                galleries[currentIndex].style.transition = 'all 0.4s ease';
            }
            
            currentIndex = (currentIndex + 1) % galleries.length;
        }, 3000);
    }

    // Запуск пульсации после загрузки
    setTimeout(startTeamViewerPulse, 2000);

    // Останавливаем пульсацию при взаимодействии
    document.querySelectorAll('.image-gallery').forEach(gallery => {
        gallery.addEventListener('mouseenter', () => {
            if (teamviewerPulseInterval) {
                clearInterval(teamviewerPulseInterval);
                document.querySelectorAll('.clipboard-gallery, .filetransfer-gallery, .filemanager-gallery').forEach(g => {
                    g.style.boxShadow = '0 4px 15px rgba(0, 114, 255, 0.3)';
                });
            }
        });
    });

    // Эффект "волны" для галерей при загрузке
    function createWaveEffect() {
        const galleries = document.querySelectorAll('.image-gallery');
        galleries.forEach((gallery, index) => {
            setTimeout(() => {
                gallery.style.boxShadow = '0 0 25px rgba(0, 114, 255, 0.6)';
                setTimeout(() => {
                    gallery.style.boxShadow = '0 4px 15px rgba(0, 114, 255, 0.3)';
                }, 600);
            }, index * 400);
        });
    }

    // Запуск волнового эффекта
    setTimeout(createWaveEffect, 1500);
}

// СЧЕТЧИК ПРОСМОТРЕННЫХ ЭКСПЕРИМЕНТОВ
let viewedTeamViewerExperiments = new Set();

function trackExperimentViewing() {
    const observerOptions = {
        threshold: 0.7,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const experimentCard = entry.target;
                const experimentNumber = experimentCard.querySelector('.experiment-number');
                if (experimentNumber) {
                    const number = experimentNumber.textContent.trim();
                    if (!viewedTeamViewerExperiments.has(number)) {
                        viewedTeamViewerExperiments.add(number);
                        
                        // TeamViewer эффект для просмотренного эксперимента
                        experimentNumber.style.backgroundColor = '#0072ff';
                        experimentNumber.style.boxShadow = '0 0 15px rgba(0, 114, 255, 0.7)';
                        experimentNumber.style.animation = 'teamviewer-glow 0.8s ease';
                        
                        console.log(`📊 Просмотрен эксперимент TeamViewer: ${number}`);
                        updateProgressIndicator();
                    }
                }
            }
        });
    }, observerOptions);

    // Наблюдение за карточками экспериментов
    document.querySelectorAll('.experiment-card').forEach(card => {
        observer.observe(card);
    });
}

// ИНДИКАТОР ПРОГРЕССА
function updateProgressIndicator() {
    const totalExperiments = document.querySelectorAll('.experiment-card').length;
    const viewedCount = viewedTeamViewerExperiments.size;
    const progressPercent = (viewedCount / totalExperiments) * 100;
    
    let progressBar = document.getElementById('teamviewer-progress-bar');
    if (!progressBar && viewedCount > 0) {
        progressBar = document.createElement('div');
        progressBar.id = 'teamviewer-progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: ${progressPercent}%;
            height: 3px;
            background: linear-gradient(90deg, #0072ff, #4da6ff);
            z-index: 1000;
            transition: width 0.5s ease;
            box-shadow: 0 0 10px rgba(0, 114, 255, 0.5);
        `;
        document.body.appendChild(progressBar);
    } else if (progressBar) {
        progressBar.style.width = progressPercent + '%';
    }
    
    console.log(`📈 Прогресс TeamViewer: ${viewedCount}/${totalExperiments} (${Math.round(progressPercent)}%)`);
}

// СЧЕТЧИК ВРЕМЕНИ НА СТРАНИЦЕ
function addTimeCounter() {
    let startTime = Date.now();
    
    function updateTimeCounter() {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(timeSpent / 60);
        const seconds = timeSpent % 60;
        
        let timeDisplay = document.getElementById('teamviewer-time-display');
        if (!timeDisplay) {
            timeDisplay = document.createElement('div');
            timeDisplay.id = 'teamviewer-time-display';
            timeDisplay.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0, 114, 255, 0.9);
                color: white;
                padding: 10px 15px;
                border-radius: 20px;
                font-size: 0.9em;
                z-index: 999;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 15px rgba(0, 114, 255, 0.3);
            `;
            document.body.appendChild(timeDisplay);
        }
        
        timeDisplay.textContent = `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Обновляем счетчик каждую секунду
    setInterval(updateTimeCounter, 1000);
}

// ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 TeamViewer Experiments: DOM загружен, начинаем инициализацию...');
    
    // Последовательная инициализация всех компонентов
    setTimeout(() => {
        initializeTeamViewerGalleries();
        console.log('✅ Галереи инициализированы');
    }, 500);
    
    setTimeout(() => {
        initTouchSupport();
        console.log('✅ Поддержка touch добавлена');
    }, 700);
    
    setTimeout(() => {
        preloadImages();
        console.log('✅ Предзагрузка изображений запущена');
    }, 900);
    
    setTimeout(() => {
        optimizeForMobile();
        addTooltips();
        addLoadingEffects();
        console.log('✅ Оптимизация и эффекты применены');
    }, 1100);
    
    setTimeout(() => {
        addTeamViewerEffects();
        trackExperimentViewing();
        addTimeCounter();
        console.log('✅ Специальные эффекты TeamViewer активированы');
    }, 1300);
    
    setTimeout(() => {
        console.log('🎉 TeamViewer Experiments полностью инициализированы!');
        console.log('📊 Статистика:');
        console.log(`   • Галерей: 3`);
        console.log(`   • Изображений: ${imageDataClipboard.length + imageDataFileTransfer.length + imageDataFileManager.length}`);
        console.log(`   • Экспериментов: ${document.querySelectorAll('.experiment-card').length}`);
        console.log('🎯 Функции: навигация клавишами, touch жесты, zoom, прогресс трекинг');
    }, 1500);
});

// Оптимизация при изменении размера окна
window.addEventListener('resize', optimizeForMobile);

// Добавляем CSS анимации через JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes teamviewer-glow {
        0% { box-shadow: 0 0 5px rgba(0, 114, 255, 0.5); }
        50% { box-shadow: 0 0 25px rgba(0, 114, 255, 1), 0 0 35px rgba(0, 114, 255, 0.7); }
        100% { box-shadow: 0 0 15px rgba(0, 114, 255, 0.7); }
    }
    
    .image-gallery img {
        transition: transform 0.3s ease, opacity 0.3s ease;
    }
    
    .gallery-nav-clipboard:hover,
    .gallery-nav-filetransfer:hover,
    .gallery-nav-filemanager:hover {
        background: rgba(0, 114, 255, 1) !important;
    }
    
    .thumbnail-clipboard:hover,
    .thumbnail-filetransfer:hover,
    .thumbnail-filemanager:hover {
        transform: scale(1.05) !important;
        box-shadow: 0 4px 15px rgba(0, 114, 255, 0.4);
    }
`;
document.head.appendChild(style);

console.log('📝 TeamViewer Script загружен успешно!');

