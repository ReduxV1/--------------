// Основной скрипт для страницы файловых систем и разметки диска

// Состояние приложения
const appState = {
    selectedDisk: null,
    selectedFilesystem: 'ext4',
    partitionScheme: 'auto',
    manualPartitions: [],
    diskCapacity: 500 // GB
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initPreloader();
    initScrollAnimations();  
    initStatCounters();
    initDiskSelection();
    initFilesystemSelection();
    initPartitioningOptions();
    initFAQ();
    initScrollToTop();
    initModalHandlers();
    initHeaderScroll();
    initTooltips();
    loadPageState();
});

// Функции инициализации
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }, 2000);
}

function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (!header) return;

    let lastScrollTop = 0;
    let isScrolling = false;

    function handleScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop <= 10) {
                    header.style.transform = 'translateY(0)';
                    header.classList.remove('header-hidden');
                    header.classList.add('header-visible');
                } else if (scrollTop > lastScrollTop && scrollTop > 100) {
                    header.style.transform = 'translateY(-100%)';
                    header.classList.add('header-hidden');
                    header.classList.remove('header-visible');
                } else if (scrollTop < lastScrollTop) {
                    header.style.transform = 'translateY(0)';
                    header.classList.remove('header-hidden');
                    header.classList.add('header-visible');
                }
                
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
                isScrolling = false;
            });
        }
        isScrolling = true;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    header.classList.add('header-visible');
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
}

function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateCounters = () => {
        if (animated) return;
        animated = true;

        statNumbers.forEach(stat => {
            const target = parseFloat(stat.dataset.target);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (target >= 100) {
                    stat.textContent = Math.floor(current);
                } else {
                    stat.textContent = current.toFixed(1);
                }
            }, 16);
        });
    };

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateCounters, 1000);
            }
        });
    }, { threshold: 0.5 });

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
}

// Выбор диска
function initDiskSelection() {
    const diskCards = document.querySelectorAll('.disk-card');
    
    diskCards.forEach(card => {
        card.addEventListener('click', () => {
            selectDisk(card.dataset.disk);
        });
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectDisk(card.dataset.disk);
            }
        });

        // Добавляем tabindex для доступности
        card.setAttribute('tabindex', '0');
    });
}

function selectDisk(diskId) {
    // Снимаем выделение с всех дисков
    document.querySelectorAll('.disk-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Выделяем выбранный диск
    const selectedCard = document.querySelector(`[data-disk="${diskId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        appState.selectedDisk = diskId;
        
        // Обновляем информацию о диске в предварительном просмотре
        updateDiskInfo(diskId);
        
        // Показываем уведомление
        showNotification(`Выбран диск: ${getDiskName(diskId)}`, 'success');
        
        // Сохраняем состояние
        savePageState();
    }
}

function getDiskName(diskId) {
    const diskNames = {
        'sda': 'Samsung 970 EVO Plus (500 GB)',
        'nvme0n1': 'WD Black SN750 (1 TB)',
        'sdb': 'Seagate Barracuda (2 TB)'
    };
    return diskNames[diskId] || diskId;
}

function updateDiskInfo(diskId) {
    const diskNameElement = document.getElementById('selected-disk-name');
    if (diskNameElement) {
        diskNameElement.textContent = `/dev/${diskId} - ${getDiskName(diskId)}`;
    }
    
    // Обновляем размеры разделов в зависимости от диска
    const diskSizes = {
        'sda': 500,
        'nvme0n1': 1000,  
        'sdb': 2000
    };
    
    const capacity = diskSizes[diskId] || 500;
    appState.diskCapacity = capacity;
    
    updatePartitionVisualization();
}

// Выбор файловой системы
function initFilesystemSelection() {
    const fsCards = document.querySelectorAll('.fs-card');
    
    fsCards.forEach(card => {
        card.addEventListener('click', () => {
            selectFilesystem(card.dataset.filesystem);
        });
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectFilesystem(card.dataset.filesystem);
            }
        });

        // Добавляем tabindex для доступности
        card.setAttribute('tabindex', '0');
    });
}

function selectFilesystem(fsType) {
    // Снимаем выделение с всех файловых систем
    document.querySelectorAll('.fs-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Выделяем выбранную файловую систему
    const selectedCard = document.querySelector(`[data-filesystem="${fsType}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        appState.selectedFilesystem = fsType;
        
        // Показываем уведомление
        showNotification(`Выбрана файловая система: ${getFilesystemName(fsType)}`, 'success');
        
        // Обновляем предварительный просмотр
        updatePartitionVisualization();
        
        // Сохраняем состояние
        savePageState();
    }
}

function getFilesystemName(fsType) {
    const fsNames = {
        'ext4': 'EXT4',
        'btrfs': 'Btrfs',
        'xfs': 'XFS',
        'f2fs': 'F2FS'
    };
    return fsNames[fsType] || fsType.toUpperCase();
}

// Выбор схемы разметки
function initPartitioningOptions() {
    const partitionOptions = document.querySelectorAll('.partition-option');
    
    partitionOptions.forEach(option => {
        option.addEventListener('click', () => {
            selectPartitionScheme(option.dataset.scheme);
        });
        
        option.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectPartitionScheme(option.dataset.scheme);
            }
        });

        // Добавляем tabindex для доступности
        option.setAttribute('tabindex', '0');
    });
    
    // Инициализируем кнопки ручной разметки
    initManualPartitioning();
}

function selectPartitionScheme(scheme) {
    // Снимаем выделение с всех опций
    document.querySelectorAll('.partition-option').forEach(option => {
        option.classList.remove('active');
    });
    
    // Выделяем выбранную опцию
    const selectedOption = document.querySelector(`[data-scheme="${scheme}"]`);
    if (selectedOption) {
        selectedOption.classList.add('active');
        appState.partitionScheme = scheme;
        
        // Показываем/скрываем секции в зависимости от выбора
        toggleSections(scheme);
        
        // Обновляем предварительный просмотр
        updatePartitionVisualization();
        
        // Показываем уведомление
        showNotification(`Выбрана схема разметки: ${getSchemeDisplayName(scheme)}`, 'success');
        
        // Сохраняем состояние
        savePageState();
    }
}

function getSchemeDisplayName(scheme) {
    const schemeNames = {
        'auto': 'Автоматическая разметка',
        'manual': 'Ручная разметка'
    };
    return schemeNames[scheme] || scheme;
}

function toggleSections(scheme) {
    const previewSection = document.querySelector('.partition-preview-section');
    const manualSection = document.querySelector('.manual-partitioning-section');
    
    if (scheme === 'manual') {
        if (manualSection) manualSection.style.display = 'block';
        if (previewSection) previewSection.classList.add('manual-mode');
    } else {
        if (manualSection) manualSection.style.display = 'none';
        if (previewSection) previewSection.classList.remove('manual-mode');
    }
}

// Ручная разметка
function initManualPartitioning() {
    const addButton = document.querySelector('.btn-add-partition');
    const resetButton = document.querySelector('.btn-reset-partitions');
    const autoButton = document.querySelector('.btn-auto-partition');
    
    if (addButton) {
        addButton.addEventListener('click', addPartition);
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetPartitions);
    }
    
    if (autoButton) {
        autoButton.addEventListener('click', autoPartition);
    }
}

function addPartition() {
    const partitionModal = createPartitionModal();
    document.body.appendChild(partitionModal);
    partitionModal.classList.add('active');
}

function createPartitionModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay partition-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Добавить раздел</h3>
                <button class="modal-close" onclick="closePartitionModal()" type="button">×</button>
            </div>
            <div class="modal-body">
                <form id="partition-form">
                    <div class="form-group">
                        <label for="partition-size">Размер (GB)</label>
                        <input type="number" id="partition-size" min="1" max="${appState.diskCapacity}" value="20" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="partition-type">Тип раздела</label>
                        <select id="partition-type" required>
                            <option value="primary">Основной</option>
                            <option value="logical">Логический</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="mount-point">Точка монтирования</label>
                        <select id="mount-point" required>
                            <option value="/">/ (корень)</option>
                            <option value="/home">/home</option>
                            <option value="/var">/var</option>
                            <option value="/tmp">/tmp</option>
                            <option value="/boot">/boot</option>
                            <option value="swap">swap</option>
                            <option value="custom">Другая...</option>
                        </select>
                    </div>
                    
                    <div class="form-group" id="custom-mount-group" style="display: none;">
                        <label for="custom-mount">Пользовательская точка монтирования</label>
                        <input type="text" id="custom-mount" placeholder="/custom/path">
                    </div>
                    
                    <div class="form-group">
                        <label for="partition-fs">Файловая система</label>
                        <select id="partition-fs">
                            <option value="ext4">EXT4</option>
                            <option value="btrfs">Btrfs</option>
                            <option value="xfs">XFS</option>
                            <option value="f2fs">F2FS</option>
                            <option value="swap">swap</option>
                        </select>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Добавить раздел</button>
                        <button type="button" class="btn-secondary" onclick="closePartitionModal()">Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Добавляем обработчики событий
    const form = modal.querySelector('#partition-form');
    const mountSelect = modal.querySelector('#mount-point');
    const customMountGroup = modal.querySelector('#custom-mount-group');
    
    mountSelect.addEventListener('change', (e) => {
        if (e.target.value === 'custom') {
            customMountGroup.style.display = 'block';
        } else {
            customMountGroup.style.display = 'none';
        }
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const partition = {
            size: parseInt(form.querySelector('#partition-size').value),
            type: form.querySelector('#partition-type').value,
            mountPoint: form.querySelector('#mount-point').value === 'custom' 
                ? form.querySelector('#custom-mount').value 
                : form.querySelector('#mount-point').value,
            filesystem: form.querySelector('#partition-fs').value,
            id: Date.now()
        };
        
        if (validatePartition(partition)) {
            appState.manualPartitions.push(partition);
            updatePartitionVisualization();
            updatePartitionTable();
            closePartitionModal();
            showNotification('Раздел добавлен', 'success');
        }
    });
    
    return modal;
}

function validatePartition(partition) {
    // Проверяем, не превышает ли общий размер разделов размер диска
    const totalSize = appState.manualPartitions.reduce((sum, p) => sum + p.size, 0) + partition.size;
    
    if (totalSize > appState.diskCapacity) {
        showNotification('Недостаточно места на диске', 'error');
        return false;
    }
    
    // Проверяем уникальность точки монтирования
    if (appState.manualPartitions.some(p => p.mountPoint === partition.mountPoint)) {
        showNotification('Точка монтирования уже используется', 'error');
        return false;
    }
    
    return true;
}

function closePartitionModal() {
    const modal = document.querySelector('.partition-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

function resetPartitions() {
    if (confirm('Вы уверены, что хотите сбросить все разделы?')) {
        appState.manualPartitions = [];
        updatePartitionVisualization();
        updatePartitionTable();
        showNotification('Разделы сброшены', 'success');
    }
}

function autoPartition() {
    // Создаем автоматическую схему разделов
    const capacity = appState.diskCapacity;
    
    appState.manualPartitions = [
        {
            id: 1,
            size: Math.min(512, Math.ceil(capacity * 0.01)), // EFI раздел
            type: 'primary',
            mountPoint: '/boot/efi',
            filesystem: 'fat32'
        },
        {
            id: 2,
            size: Math.min(8, Math.ceil(capacity * 0.02)), // SWAP
            type: 'primary',
            mountPoint: 'swap',
            filesystem: 'swap'
        },
        {
            id: 3,
            size: capacity - Math.min(520, Math.ceil(capacity * 0.03)), // Корневой раздел
            type: 'primary',
            mountPoint: '/',
            filesystem: appState.selectedFilesystem
        }
    ];
    
    updatePartitionVisualization();
    updatePartitionTable();
    showNotification('Автоматическая разметка применена', 'success');
}

// Обновление визуализации разделов
function updatePartitionVisualization() {
    const diskBar = document.querySelector('.disk-bar');
    const diskHeader = document.querySelector('.disk-visualization h4');
    
    if (!diskBar || !diskHeader) return;
    
    // Обновляем заголовок
    const diskName = appState.selectedDisk ? getDiskName(appState.selectedDisk) : 'Диск не выбран';
    diskHeader.textContent = `${diskName} (${appState.diskCapacity} GB)`;
    
    // Очищаем существующие сегменты
    diskBar.innerHTML = '';
    
    if (appState.partitionScheme === 'manual' && appState.manualPartitions.length > 0) {
        // Показываем ручные разделы
        appState.manualPartitions.forEach(partition => {
            const segment = createPartitionSegment(partition);
            diskBar.appendChild(segment);
        });
        
        // Добавляем свободное место если есть
        const usedSpace = appState.manualPartitions.reduce((sum, p) => sum + p.size, 0);
        const freeSpace = appState.diskCapacity - usedSpace;
        
        if (freeSpace > 0) {
            const freeSegment = createFreeSpaceSegment(freeSpace);
            diskBar.appendChild(freeSegment);
        }
    } else {
        // Показываем автоматическую схему
        createAutoPartitionVisualization();
    }
}

function createPartitionSegment(partition) {
    const segment = document.createElement('div');
    const percentage = (partition.size / appState.diskCapacity) * 100;
    
    segment.className = `partition-segment ${getPartitionClass(partition.mountPoint)}`;
    segment.style.width = `${percentage}%`;
    segment.innerHTML = `
        <div class="partition-label">${partition.mountPoint}</div>
        <div class="partition-size">${partition.size} GB</div>
    `;
    
    // Добавляем обработчик клика для редактирования
    segment.addEventListener('click', () => editPartition(partition.id));
    
    return segment;
}

function createFreeSpaceSegment(size) {
    const segment = document.createElement('div');
    const percentage = (size / appState.diskCapacity) * 100;
    
    segment.className = 'partition-segment free-space';
    segment.style.width = `${percentage}%`;
    segment.style.background = 'linear-gradient(135deg, #95a5a6, #7f8c8d)';
    segment.innerHTML = `
        <div class="partition-label">Свободно</div>
        <div class="partition-size">${size} GB</div>
    `;
    
    return segment;
}

function createAutoPartitionVisualization() {
    const diskBar = document.querySelector('.disk-bar');
    const capacity = appState.diskCapacity;
    
    // EFI раздел (512 MB)
    const efiSize = 0.5;
    const efiSegment = document.createElement('div');
    efiSegment.className = 'partition-segment efi';
    efiSegment.style.width = `${(efiSize / capacity) * 100}%`;
    efiSegment.innerHTML = `
        <div class="partition-label">EFI</div>
        <div class="partition-size">512 MB</div>
    `;
    diskBar.appendChild(efiSegment);
    
    // SWAP раздел (4 GB или 2% от диска)
    const swapSize = Math.min(8, Math.max(4, capacity * 0.02));
    const swapSegment = document.createElement('div');
    swapSegment.className = 'partition-segment swap';
    swapSegment.style.width = `${(swapSize / capacity) * 100}%`;
    swapSegment.innerHTML = `
        <div class="partition-label">SWAP</div>
        <div class="partition-size">${swapSize} GB</div>
    `;
    diskBar.appendChild(swapSegment);
    
    // Корневой раздел (остальное место)
    const rootSize = capacity - efiSize - swapSize;
    const rootSegment = document.createElement('div');
    rootSegment.className = 'partition-segment root';
    rootSegment.style.width = `${(rootSize / capacity) * 100}%`;
    rootSegment.innerHTML = `
        <div class="partition-label">/ (${appState.selectedFilesystem.toUpperCase()})</div>
        <div class="partition-size">${rootSize.toFixed(1)} GB</div>
    `;
    diskBar.appendChild(rootSegment);
}

function getPartitionClass(mountPoint) {
    const classes = {
        '/': 'root',
        '/boot': 'boot',
        '/boot/efi': 'efi',
        '/home': 'home',
        '/var': 'var',
        '/tmp': 'tmp',
        'swap': 'swap'
    };
    return classes[mountPoint] || 'other';
}

function updatePartitionTable() {
    const tableBody = document.querySelector('.partition-table tbody');
    if (!tableBody) return;
    
    // Очищаем таблицу
    tableBody.innerHTML = '';
    
    if (appState.partitionScheme === 'manual' && appState.manualPartitions.length > 0) {
        appState.manualPartitions.forEach((partition, index) => {
            const row = createTableRow(partition, index);
            tableBody.appendChild(row);
        });
    } else {
        // Показываем автоматическую схему в таблице
        createAutoPartitionTable();
    }
}

function createTableRow(partition, index) {
    const row = document.createElement('tr');
    row.className = 'table-row';
    row.innerHTML = `
        <td class="partition-name">/dev/${appState.selectedDisk}${index + 1}</td>
        <td>${partition.size} GB</td>
        <td>${partition.type}</td>
        <td>${partition.filesystem}</td>
        <td>${partition.mountPoint}</td>
        <td>
            <button class="btn-edit" onclick="editPartition(${partition.id})" title="Редактировать">✏️</button>
            <button class="btn-delete" onclick="deletePartition(${partition.id})" title="Удалить">🗑️</button>
        </td>
    `;
    
    return row;
}

function createAutoPartitionTable() {
    const tableBody = document.querySelector('.partition-table tbody');
    const capacity = appState.diskCapacity;
    
    const autoPartitions = [
        { name: `${appState.selectedDisk}1`, size: '512 MB', type: 'primary', fs: 'fat32', mount: '/boot/efi' },
        { name: `${appState.selectedDisk}2`, size: `${Math.min(8, capacity * 0.02).toFixed(1)} GB`, type: 'primary', fs: 'swap', mount: 'swap' },
        { name: `${appState.selectedDisk}3`, size: `${(capacity - 0.5 - Math.min(8, capacity * 0.02)).toFixed(1)} GB`, type: 'primary', fs: appState.selectedFilesystem, mount: '/' }
    ];
    
    autoPartitions.forEach(partition => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="partition-name">/dev/${partition.name}</td>
            <td>${partition.size}</td>
            <td>${partition.type}</td>
            <td>${partition.fs}</td>
            <td>${partition.mount}</td>
            <td>Авто</td>
        `;
        tableBody.appendChild(row);
    });
}

function editPartition(partitionId) {
    const partition = appState.manualPartitions.find(p => p.id === partitionId);
    if (!partition) return;
    
    // Создаем модальное окно для редактирования
    const modal = createEditPartitionModal(partition);
    document.body.appendChild(modal);
    modal.classList.add('active');
}

function createEditPartitionModal(partition) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay edit-partition-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Редактировать раздел</h3>
                <button class="modal-close" onclick="closeEditPartitionModal()" type="button">×</button>
            </div>
            <div class="modal-body">
                <form id="edit-partition-form">
                    <input type="hidden" id="partition-id" value="${partition.id}">
                    
                    <div class="form-group">
                        <label for="edit-partition-size">Размер (GB)</label>
                        <input type="number" id="edit-partition-size" min="1" max="${appState.diskCapacity}" value="${partition.size}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-partition-type">Тип раздела</label>
                        <select id="edit-partition-type" required>
                            <option value="primary" ${partition.type === 'primary' ? 'selected' : ''}>Основной</option>
                            <option value="logical" ${partition.type === 'logical' ? 'selected' : ''}>Логический</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-mount-point">Точка монтирования</label>
                        <input type="text" id="edit-mount-point" value="${partition.mountPoint}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-partition-fs">Файловая система</label>
                        <select id="edit-partition-fs">
                            <option value="ext4" ${partition.filesystem === 'ext4' ? 'selected' : ''}>EXT4</option>
                            <option value="btrfs" ${partition.filesystem === 'btrfs' ? 'selected' : ''}>Btrfs</option>
                            <option value="xfs" ${partition.filesystem === 'xfs' ? 'selected' : ''}>XFS</option>
                            <option value="f2fs" ${partition.filesystem === 'f2fs' ? 'selected' : ''}>F2FS</option>
                            <option value="swap" ${partition.filesystem === 'swap' ? 'selected' : ''}>swap</option>
                        </select>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Сохранить</button>
                        <button type="button" class="btn-secondary" onclick="closeEditPartitionModal()">Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    const form = modal.querySelector('#edit-partition-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const updatedPartition = {
            id: partition.id,
            size: parseInt(form.querySelector('#edit-partition-size').value),
            type: form.querySelector('#edit-partition-type').value,
            mountPoint: form.querySelector('#edit-mount-point').value,
            filesystem: form.querySelector('#edit-partition-fs').value
        };
        
        // Находим индекс раздела и обновляем его
        const index = appState.manualPartitions.findIndex(p => p.id === partition.id);
        if (index !== -1) {
            appState.manualPartitions[index] = updatedPartition;
            updatePartitionVisualization();
            updatePartitionTable();
            closeEditPartitionModal();
            showNotification('Раздел обновлен', 'success');
        }
    });
    
    return modal;
}

function closeEditPartitionModal() {
    const modal = document.querySelector('.edit-partition-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

function deletePartition(partitionId) {
    if (confirm('Вы уверены, что хотите удалить этот раздел?')) {
        appState.manualPartitions = appState.manualPartitions.filter(p => p.id !== partitionId);
        updatePartitionVisualization();
        updatePartitionTable();
        showNotification('Раздел удален', 'success');
    }
}

// FAQ функции
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Закрываем все FAQ элементы
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });

            // Если элемент не был активным, открываем его
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Кнопка "Наверх"
function initScrollToTop() {
    const scrollButton = document.getElementById('scrollToTop');
    
    if (!scrollButton) return;

    function updateButtonVisibility() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', updateButtonVisibility);
    updateButtonVisibility();
    
    scrollButton.addEventListener('click', scrollToTop);
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Модальные окна
function initModalHandlers() {
    const modal = document.getElementById('modalOverlay');
    if (!modal) return;

    modal.classList.remove('active');
    
    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
}

let modalClickHandler = null;
let escapeKeyHandler = null;

function showModal(title, content) {
    const modal = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    if (!modal || !modalTitle || !modalBody) return;

    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.classList.add('active');

    if (modalClickHandler) {
        modal.removeEventListener('click', modalClickHandler);
    }
    if (escapeKeyHandler) {
        document.removeEventListener('keydown', escapeKeyHandler);
    }

    modalClickHandler = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    };

    escapeKeyHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    };

    modal.addEventListener('click', modalClickHandler);
    document.addEventListener('keydown', escapeKeyHandler);
}

function closeModal() {
    const modal = document.getElementById('modalOverlay');
    if (!modal) return;

    modal.classList.remove('active');
    
    if (modalClickHandler) {
        modal.removeEventListener('click', modalClickHandler);
        modalClickHandler = null;
    }
    if (escapeKeyHandler) {
        document.removeEventListener('keydown', escapeKeyHandler);
        escapeKeyHandler = null;
    }
}

// Система уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" type="button">×</button>
        </div>
    `;

    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.remove();
    });

    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(40, 40, 40, 0.95);
                border: 1px solid rgba(197, 164, 126, 0.3);
                border-radius: 8px;
                padding: 15px;
                z-index: 10001;
                min-width: 300px;
                animation: slideInRight 0.3s ease;
            }
            
            .notification-success {
                border-color: #27ae60;
            }
            
            .notification-error {
                border-color: #e74c3c;
            }

                        .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 15px;
            }
            
            .notification-message {
                color: #ffffff;
                font-size: 0.9rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #c5a47e;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-close:hover {
                color: #ffffff;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Функции для работы с подсказками
function initTooltips() {
    const tooltip = document.createElement('div');
    tooltip.id = 'custom-tooltip';
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(40, 40, 40, 0.95);
        color: #ffffff;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.85rem;
        z-index: 10001;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
        max-width: 200px;
        border: 1px solid rgba(197, 164, 126, 0.3);
    `;

    document.body.appendChild(tooltip);

    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            tooltip.textContent = element.dataset.tooltip;
            tooltip.style.opacity = '1';
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            tooltip.style.transform = 'translateX(-50%)';
        });

        element.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });
}

// Функции сохранения и загрузки состояния
function savePageState() {
    const state = {
        selectedDisk: appState.selectedDisk,
        selectedFilesystem: appState.selectedFilesystem,
        partitionScheme: appState.partitionScheme,
        manualPartitions: appState.manualPartitions,
        diskCapacity: appState.diskCapacity,
        scrollPosition: window.pageYOffset,
        timestamp: Date.now()
    };

    sessionStorage.setItem('filesystemPageState', JSON.stringify(state));
}

function loadPageState() {
    const savedState = sessionStorage.getItem('filesystemPageState');
    if (!savedState) return;

    try {
        const state = JSON.parse(savedState);
        
        // Восстанавливаем состояние приложения
        Object.assign(appState, state);
        
        // Восстанавливаем UI
        if (state.selectedDisk) {
            const diskCard = document.querySelector(`[data-disk="${state.selectedDisk}"]`);
            if (diskCard) {
                diskCard.classList.add('selected');
            }
        }
        
        if (state.selectedFilesystem) {
            const fsCard = document.querySelector(`[data-filesystem="${state.selectedFilesystem}"]`);
            if (fsCard) {
                fsCard.classList.add('selected');
            }
        }
        
        if (state.partitionScheme) {
            const schemeOption = document.querySelector(`[data-scheme="${state.partitionScheme}"]`);
            if (schemeOption) {
                schemeOption.classList.add('active');
                toggleSections(state.partitionScheme);
            }
        }
        
        // Обновляем визуализацию
        updatePartitionVisualization();
        updatePartitionTable();
        
        // Восстанавливаем позицию скролла
        if (state.scrollPosition) {
            setTimeout(() => {
                window.scrollTo(0, state.scrollPosition);
            }, 100);
        }
        
        console.log('Состояние страницы восстановлено');
    } catch (error) {
        console.error('Ошибка при загрузке состояния страницы:', error);
    }
}

// Функции проверки совместимости
function checkDiskCompatibility(diskId) {
    const compatibility = {
        'sda': {
            minSize: 64,
            maxSize: 2000,
            supportedFS: ['ext4', 'btrfs', 'xfs', 'f2fs'],
            notes: 'SATA SSD - отличная производительность'
        },
        'nvme0n1': {
            minSize: 128,
            maxSize: 4000,
            supportedFS: ['ext4', 'btrfs', 'xfs', 'f2fs'],
            notes: 'NVMe SSD - максимальная производительность'
        },
        'sdb': {
            minSize: 500,
            maxSize: 8000,
            supportedFS: ['ext4', 'btrfs', 'xfs'],
            notes: 'HDD - подходит для хранения данных'
        }
    };
    
    return compatibility[diskId] || null;
}

function validateConfiguration() {
    const errors = [];
    const warnings = [];
    
    // Проверяем выбор диска
    if (!appState.selectedDisk) {
        errors.push('Не выбран диск для установки');
    }
    
    // Проверяем файловую систему
    if (!appState.selectedFilesystem) {
        errors.push('Не выбрана файловая система');
    }
    
    // Проверяем схему разметки
    if (appState.partitionScheme === 'manual') {
        if (appState.manualPartitions.length === 0) {
            errors.push('Не создано ни одного раздела');
        } else {
            // Проверяем наличие корневого раздела
            const hasRoot = appState.manualPartitions.some(p => p.mountPoint === '/');
            if (!hasRoot) {
                errors.push('Отсутствует корневой раздел (/)');
            }
            
            // Проверяем наличие EFI раздела для UEFI систем
            const hasEFI = appState.manualPartitions.some(p => p.mountPoint === '/boot/efi');
            if (!hasEFI) {
                warnings.push('Рекомендуется создать EFI раздел для UEFI систем');
            }
            
            // Проверяем размер swap
            const swapPartition = appState.manualPartitions.find(p => p.mountPoint === 'swap');
            if (!swapPartition) {
                warnings.push('Отсутствует SWAP раздел');
            } else if (swapPartition.size < 2) {
                warnings.push('Размер SWAP раздела менее 2 GB');
            }
        }
    }
    
    return { errors, warnings };
}

// Функции экспорта конфигурации
function exportConfiguration() {
    const config = {
        timestamp: new Date().toISOString(),
        disk: {
            device: appState.selectedDisk,
            capacity: appState.diskCapacity,
            name: getDiskName(appState.selectedDisk)
        },
        filesystem: {
            type: appState.selectedFilesystem,
            name: getFilesystemName(appState.selectedFilesystem)
        },
        partitioning: {
            scheme: appState.partitionScheme,
            partitions: appState.partitionScheme === 'manual' 
                ? appState.manualPartitions 
                : generateAutoPartitions()
        },
        validation: validateConfiguration()
    };

    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `disk-configuration-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Конфигурация экспортирована', 'success');
}

function generateAutoPartitions() {
    const capacity = appState.diskCapacity;
    return [
        {
            device: `${appState.selectedDisk}1`,
            size: 0.5,
            type: 'primary',
            mountPoint: '/boot/efi',
            filesystem: 'fat32',
            flags: ['boot', 'esp']
        },
        {
            device: `${appState.selectedDisk}2`,
            size: Math.min(8, capacity * 0.02),
            type: 'primary',
            mountPoint: 'swap',
            filesystem: 'swap',
            flags: ['swap']
        },
        {
            device: `${appState.selectedDisk}3`,
            size: capacity - 0.5 - Math.min(8, capacity * 0.02),
            type: 'primary',
            mountPoint: '/',
            filesystem: appState.selectedFilesystem,
            flags: []
        }
    ];
}

// Функции для работы с прогрессом
function updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (!progressFill || !progressText) return;
    
    let progress = 0;
    
    // Подсчитываем прогресс
    if (appState.selectedDisk) progress += 33;
    if (appState.selectedFilesystem) progress += 33;
    if (appState.partitionScheme === 'auto' || 
        (appState.partitionScheme === 'manual' && appState.manualPartitions.length > 0)) {
        progress += 34;
    }
    
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Шаг 2 из 4 - Настройка диска (${progress}%)`;
}

// Функции для демонстрации
function showFilesystemDetails(fsType) {
    const details = {
        'ext4': {
            title: 'EXT4 - Fourth Extended File System',
            content: `
                <h4>Преимущества EXT4:</h4>
                <ul>
                    <li>Высокая стабильность и надежность</li>
                    <li>Отличная производительность</li>
                    <li>Поддержка больших файлов (до 16 ТБ)</li>
                    <li>Журналирование для восстановления после сбоев</li>
                    <li>Обратная совместимость с EXT2/EXT3</li>
                    <li>Низкое потребление CPU</li>
                </ul>
                
                <h4>Недостатки:</h4>
                <ul>
                    <li>Отсутствие встроенного сжатия</li>
                    <li>Нет снимков файловой системы</li>
                    <li>Ограниченные возможности самовосстановления</li>
                </ul>
                
                <h4>Рекомендации:</h4>
                <p>Идеально подходит для большинства пользователей Linux. Отличный выбор для настольных систем и серверов.</p>
            `
        },
        'btrfs': {
            title: 'Btrfs - B-tree File System',
            content: `
                <h4>Преимущества Btrfs:</h4>
                <ul>
                    <li>Снимки файловой системы (snapshots)</li>
                    <li>Встроенное сжатие данных</li>
                    <li>Проверка целостности данных</li>
                    <li>Простое управление томами</li>
                    <li>Дедупликация данных</li>
                    <li>RAID на уровне файловой системы</li>
                </ul>
                
                <h4>Недостатки:</h4>
                <ul>
                    <li>Относительно новая (меньше тестирования)</li>
                    <li>Может быть медленнее EXT4 в некоторых задачах</li>
                    <li>Больше потребления RAM</li>
                </ul>
                
                <h4>Рекомендации:</h4>
                <p>Подходит для продвинутых пользователей, которым нужны современные функции файловой системы.</p>
            `
        },
        'xfs': {
            title: 'XFS - X File System',
            content: `
                <h4>Преимущества XFS:</h4>
                <ul>
                    <li>Высокая производительность для больших файлов</li>
                    <li>Отличное масштабирование</li>
                    <li>Поддержка очень больших файловых систем</li>
                    <li>Журналирование метаданных</li>
                    <li>Онлайн дефрагментация</li>
                    <li>Быстрое создание и удаление файлов</li>
                </ul>
                
                <h4>Недостатки:</h4>
                <ul>
                    <li>Нельзя уменьшить размер</li>
                    <li>Может быть медленнее для маленьких файлов</li>
                    <li>Менее распространена на десктопах</li>
                </ul>
                
                <h4>Рекомендации:</h4>
                <p>Отлично подходит для серверов и рабочих станций с большими объемами данных.</p>
            `
        },
                'f2fs': {
            title: 'F2FS - Flash Friendly File System',
            content: `
                <h4>Преимущества F2FS:</h4>
                <ul>
                    <li>Оптимизирована для SSD и флеш-накопителей</li>
                    <li>Уменьшает износ SSD</li>
                    <li>Высокая производительность записи</li>
                    <li>Эффективная сборка мусора</li>
                    <li>Поддержка TRIM команд</li>
                    <li>Адаптивное логирование</li>
                </ul>
                
                <h4>Недостатки:</h4>
                <ul>
                    <li>Относительно новая файловая система</li>
                    <li>Меньше инструментов для восстановления</li>
                    <li>Не оптимизирована для HDD</li>
                </ul>
                
                <h4>Рекомендации:</h4>
                <p>Идеально подходит для SSD накопителей, особенно в мобильных устройствах и системах с интенсивной записью.</p>
            `
        }
    };
    
    const fsInfo = details[fsType];
    if (fsInfo) {
        showModal(fsInfo.title, fsInfo.content);
    }
}

function showDiskDetails(diskId) {
    const details = {
        'sda': {
            title: 'Samsung 970 EVO Plus - NVMe SSD',
            content: `
                <h4>Характеристики:</h4>
                <ul>
                    <li><strong>Объем:</strong> 500 GB</li>
                    <li><strong>Интерфейс:</strong> PCIe 3.0 x4, NVMe 1.3</li>
                    <li><strong>Скорость чтения:</strong> до 3,500 МБ/с</li>
                    <li><strong>Скорость записи:</strong> до 3,200 МБ/с</li>
                    <li><strong>Тип памяти:</strong> 3D V-NAND TLC</li>
                    <li><strong>Ресурс:</strong> до 300 TBW</li>
                </ul>
                
                <h4>Преимущества для системы:</h4>
                <ul>
                    <li>Быстрая загрузка операционной системы</li>
                    <li>Мгновенный отклик приложений</li>
                    <li>Низкое энергопотребление</li>
                    <li>Бесшумная работа</li>
                    <li>Компактный форм-фактор M.2</li>
                </ul>
            `
        },
        'nvme0n1': {
            title: 'WD Black SN750 - High-Performance NVMe SSD',
            content: `
                <h4>Характеристики:</h4>
                <ul>
                    <li><strong>Объем:</strong> 1 TB</li>
                    <li><strong>Интерфейс:</strong> PCIe Gen3 8 Gb/s, NVMe</li>
                    <li><strong>Скорость чтения:</strong> до 3,430 МБ/с</li>
                    <li><strong>Скорость записи:</strong> до 3,000 МБ/с</li>
                    <li><strong>Тип памяти:</strong> 3D NAND</li>
                    <li><strong>Ресурс:</strong> до 600 TBW</li>
                </ul>
                
                <h4>Особенности:</h4>
                <ul>
                    <li>Оптимизирован для игр</li>
                    <li>Поддержка технологий WD Black Dashboard</li>
                    <li>Дополнительные радиаторы (опционально)</li>
                    <li>5-летняя гарантия</li>
                </ul>
            `
        },
        'sdb': {
            title: 'Seagate Barracuda - Классический HDD',
            content: `
                <h4>Характеристики:</h4>
                <ul>
                    <li><strong>Объем:</strong> 2 TB</li>
                    <li><strong>Интерфейс:</strong> SATA 6 Gb/s</li>
                    <li><strong>Скорость вращения:</strong> 7200 RPM</li>
                    <li><strong>Кэш:</strong> 256 MB</li>
                    <li><strong>Форм-фактор:</strong> 3.5"</li>
                </ul>
                
                <h4>Применение:</h4>
                <ul>
                    <li>Хранение больших объемов данных</li>
                    <li>Архивирование файлов</li>
                    <li>Мультимедийный контент</li>
                    <li>Резервные копии</li>
                </ul>
                
                <h4>Примечание:</h4>
                <p>HDD диски имеют меньшую скорость по сравнению с SSD, но предлагают больший объем за меньшие деньги.</p>
            `
        }
    };
    
    const diskInfo = details[diskId];
    if (diskInfo) {
        showModal(diskInfo.title, diskInfo.content);
    }
}

// Функции для создания комплексных разделов
function createComplexPartitionScheme() {
    const schemes = {
        'desktop': {
            name: 'Десктопная система',
            partitions: [
                { mountPoint: '/boot/efi', size: 0.5, filesystem: 'fat32', type: 'primary' },
                { mountPoint: '/', size: 50, filesystem: appState.selectedFilesystem, type: 'primary' },
                { mountPoint: '/home', size: appState.diskCapacity - 54.5, filesystem: appState.selectedFilesystem, type: 'primary' },
                { mountPoint: 'swap', size: 4, filesystem: 'swap', type: 'primary' }
            ]
        },
        'server': {
            name: 'Серверная система',
            partitions: [
                { mountPoint: '/boot/efi', size: 0.5, filesystem: 'fat32', type: 'primary' },
                { mountPoint: '/', size: 20, filesystem: appState.selectedFilesystem, type: 'primary' },
                { mountPoint: '/var', size: 30, filesystem: appState.selectedFilesystem, type: 'primary' },
                { mountPoint: '/home', size: appState.diskCapacity - 62.5, filesystem: appState.selectedFilesystem, type: 'primary' },
                { mountPoint: '/tmp', size: 10, filesystem: appState.selectedFilesystem, type: 'primary' },
                { mountPoint: 'swap', size: 2, filesystem: 'swap', type: 'primary' }
            ]
        },
        'developer': {
            name: 'Рабочая станция разработчика',
            partitions: [
                { mountPoint: '/boot/efi', size: 0.5, filesystem: 'fat32', type: 'primary' },
                { mountPoint: '/', size: 40, filesystem: appState.selectedFilesystem, type: 'primary' },
                { mountPoint: '/home', size: appState.diskCapacity - 58.5, filesystem: appState.selectedFilesystem, type: 'primary' },
                { mountPoint: '/var', size: 10, filesystem: appState.selectedFilesystem, type: 'primary' },
                { mountPoint: 'swap', size: 8, filesystem: 'swap', type: 'primary' }
            ]
        }
    };
    
    return schemes;
}

function applyPartitionScheme(schemeName) {
    const schemes = createComplexPartitionScheme();
    const scheme = schemes[schemeName];
    
    if (!scheme) return;
    
    appState.manualPartitions = scheme.partitions.map((partition, index) => ({
        id: Date.now() + index,
        ...partition
    }));
    
    updatePartitionVisualization();
    updatePartitionTable();
    showNotification(`Применена схема: ${scheme.name}`, 'success');
}

// Функции безопасности и валидации
function performSecurityCheck() {
    const checks = [];
    
    // Проверка шифрования
    if (appState.selectedFilesystem !== 'btrfs') {
        checks.push({
            type: 'warning',
            message: 'Рассмотрите возможность использования Btrfs для встроенного сжатия'
        });
    }
    
    // Проверка размера swap
    const swapPartition = appState.manualPartitions.find(p => p.mountPoint === 'swap');
    if (swapPartition && swapPartition.size < 4) {
        checks.push({
            type: 'info',
            message: 'Маленький размер SWAP может ограничить возможности гибернации'
        });
    }
    
    // Проверка отдельного раздела /home
    const hasHomePartition = appState.manualPartitions.some(p => p.mountPoint === '/home');
    if (!hasHomePartition && appState.partitionScheme === 'manual') {
        checks.push({
            type: 'info',
            message: 'Отдельный раздел /home облегчит переустановку системы'
        });
    }
    
    return checks;
}

// Функции резервного копирования конфигурации
function createBackupConfiguration() {
    const backup = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        configuration: {
            disk: appState.selectedDisk,
            filesystem: appState.selectedFilesystem,
            scheme: appState.partitionScheme,
            partitions: [...appState.manualPartitions],
            capacity: appState.diskCapacity
        },
        metadata: {
            userAgent: navigator.userAgent,
            url: window.location.href,
            checksum: generateConfigChecksum()
        }
    };
    
    return backup;
}

function generateConfigChecksum() {
    const configString = JSON.stringify({
        disk: appState.selectedDisk,
        filesystem: appState.selectedFilesystem,
        partitions: appState.manualPartitions
    });
    
    // Простая хеш-функция для проверки целостности
    let hash = 0;
    for (let i = 0; i < configString.length; i++) {
        const char = configString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Преобразование в 32-битное целое
    }
    return hash.toString(16);
}

// Функции импорта конфигурации
function importConfiguration(configFile) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const config = JSON.parse(e.target.result);
            
            if (validateImportedConfig(config)) {
                applyImportedConfiguration(config.configuration);
                showNotification('Конфигурация успешно импортирована', 'success');
            } else {
                showNotification('Неверный формат файла конфигурации', 'error');
            }
        } catch (error) {
            showNotification('Ошибка при импорте конфигурации', 'error');
            console.error('Import error:', error);
        }
    };
    
    reader.readAsText(configFile);
}

function validateImportedConfig(config) {
    return config && 
           config.version && 
           config.configuration && 
           config.configuration.disk && 
           config.configuration.filesystem;
}

function applyImportedConfiguration(config) {
    // Применяем импортированную конфигурацию
    appState.selectedDisk = config.disk;
    appState.selectedFilesystem = config.filesystem;
    appState.partitionScheme = config.scheme;
    appState.manualPartitions = config.partitions || [];
    appState.diskCapacity = config.capacity || 500;
    
    // Обновляем UI
    updateAllSelections();
    updatePartitionVisualization();
    updatePartitionTable();
}

function updateAllSelections() {
    // Обновляем выбор диска
    document.querySelectorAll('.disk-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.disk === appState.selectedDisk) {
            card.classList.add('selected');
        }
    });
    
    // Обновляем выбор файловой системы
    document.querySelectorAll('.fs-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.filesystem === appState.selectedFilesystem) {
            card.classList.add('selected');
        }
    });
    
    // Обновляем схему разметки
    document.querySelectorAll('.partition-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.scheme === appState.partitionScheme) {
            option.classList.add('active');
        }
    });
    
    toggleSections(appState.partitionScheme);
}

// Функции для работы с навигацией
function initNavigation() {
    const prevButton = document.querySelector('.btn-prev');
    const nextButton = document.querySelector('.btn-next');
    
    if (prevButton) {
        prevButton.addEventListener('click', goToPreviousStep);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', goToNextStep);
    }
    
    // Обновляем состояние кнопок при изменении конфигурации
    updateNavigationState();
}

function goToPreviousStep() {
    // Переход к предыдущему шагу (выбор ОС)
    window.location.href = 'os-selection.html';
}

function goToNextStep() {
    const validation = validateConfiguration();
    
    if (validation.errors.length > 0) {
        showValidationErrors(validation.errors);
        return;
    }
    
    // Сохраняем конфигурацию и переходим к следующему шагу
    savePageState();
    
    // Здесь будет переход к следующему шагу (средства удаленного управления)
    window.location.href = 'remote-management.html';
}

function showValidationErrors(errors) {
    const errorContent = `
        <h4>Обнаружены ошибки конфигурации:</h4>
        <ul style="color: #e74c3c; margin: 15px 0;">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
        <p>Пожалуйста, исправьте ошибки перед продолжением.</p>
    `;
    
    showModal('Ошибки конфигурации', errorContent);
}

function updateNavigationState() {
    const nextButton = document.querySelector('.btn-next');
    const validation = validateConfiguration();
    
    if (nextButton) {
        if (validation.errors.length > 0) {
            nextButton.disabled = true;
            nextButton.classList.add('disabled');
            nextButton.title = 'Исправьте ошибки конфигурации';
        } else {
            nextButton.disabled = false;
            nextButton.classList.remove('disabled');
            nextButton.title = 'Перейти к следующему шагу';
        }
    }
    
    updateProgress();
}

// Функции для работы с производительностью
function benchmarkFilesystem(fsType) {
    const benchmarks = {
        'ext4': {
            sequential_read: '520 MB/s',
            sequential_write: '480 MB/s',
            random_read: '45000 IOPS',
            random_write: '38000 IOPS',
            cpu_usage: 'Низкое',
            memory_usage: 'Низкое'
        },
        'btrfs': {
            sequential_read: '480 MB/s',
            sequential_write: '420 MB/s',
            random_read: '38000 IOPS',
            random_write: '32000 IOPS',
            cpu_usage: 'Среднее',
            memory_usage: 'Высокое'
        },
        'xfs': {
            sequential_read: '550 MB/s',
            sequential_write: '500 MB/s',
            random_read: '42000 IOPS',
            random_write: '35000 IOPS',
            cpu_usage: 'Низкое',
            memory_usage: 'Среднее'
        },
        'f2fs': {
            sequential_read: '490 MB/s',
            sequential_write: '510 MB/s',
            random_read: '48000 IOPS',
            random_write: '45000 IOPS',
            cpu_usage: 'Среднее',
            memory_usage: 'Среднее'
        }
    };
    
    const benchmark = benchmarks[fsType];
    if (benchmark) {
        const content = `
            <h4>Тесты производительности ${fsType.toUpperCase()}:</h4>
            <div style="margin: 20px 0;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div><strong>Последовательное чтение:</strong></div>
                    <div>${benchmark.sequential_read}</div>
                    
                    <div><strong>Последовательная запись:</strong></div>
                    <div>${benchmark.sequential_write}</div>
                    
                    <div><strong>Случайное чтение:</strong></div>
                    <div>${benchmark.random_read}</div>
                    
                    <div><strong>Случайная запись:</strong></div>
                    <div>${benchmark.random_write}</div>
                    
                    <div><strong>Использование CPU:</strong></div>
                    <div>${benchmark.cpu_usage}</div>
                    
                    <div><strong>Использование памяти:</strong></div>
                    <div>${benchmark.memory_usage}</div>
                </div>
            </div>
            <p style="font-size: 0.9rem; color: #888;">
                * Результаты получены на SSD Samsung 970 EVO в лабораторных условиях
            </p>
        `;
        
        showModal(`Производительность ${fsType.toUpperCase()}`, content);
    }
}

// Функции для создания инструкций по установке
function generateInstallationScript() {
    const script = {
        disk: appState.selectedDisk,
        filesystem: appState.selectedFilesystem,
        scheme: appState.partitionScheme,
        commands: []
    };
    
    // Добавляем команды разметки
    script.commands.push('# Разметка диска');
    script.commands.push(`parted /dev/${appState.selectedDisk} mklabel gpt`);
    
    if (appState.partitionScheme === 'manual' && appState.manualPartitions.length > 0) {
        appState.manualPartitions.forEach((partition, index) => {
            const partNum = index + 1;
            const start = index === 0 ? '1MiB' : 'previous';
            const end = `${partition.size}GiB`;
            
            script.commands.push(`parted /dev/${appState.selectedDisk} mkpart ${partition.type} ${start} ${end}`);
            
            if (partition.mountPoint === '/boot/efi') {
                script.commands.push(`parted /dev/${appState.selectedDisk} set ${partNum} esp on`);
            }
        });
        
        // Добавляем команды форматирования
        script.commands.push('');
        script.commands.push('# Форматирование разделов');
        appState.manualPartitions.forEach((partition, index) => {
            const partNum = index + 1;
            const device = `/dev/${appState.selectedDisk}${partNum}`;
            
            if (partition.filesystem === 'swap') {
                script.commands.push(`mkswap ${device}`);
                script.commands.push(`swapon ${device}`);
            } else if (partition.filesystem === 'fat32') {
                script.commands.push(`mkfs.fat -F32 ${device}`);
            } else {
                script.commands.push(`mkfs.${partition.filesystem} ${device}`);
            }
        });
        
        // Добавляем команды монтирования
        script.commands.push('');
        script.commands.push('# Монтирование разделов');
        
        const rootPartition = appState.manualPartitions.find(p => p.mountPoint === '/');
        if (rootPartition) {
            const rootIndex = appState.manualPartitions.indexOf(rootPartition);
            script.commands.push(`mount /dev/${appState.selectedDisk}${rootIndex + 1} /mnt`);
        }
        
        appState.manualPartitions.forEach((partition, index) => {
            if (partition.mountPoint !== '/' && partition.mountPoint !== 'swap') {
                const partNum = index + 1;
                const device = `/dev/${appState.selectedDisk}${partNum}`;
                script.commands.push(`mkdir -p /mnt${partition.mountPoint}`);
                script.commands.push(`mount ${device} /mnt${partition.mountPoint}`);
            }
        });
    } else {
        // Автоматическая разметка
        const autoCommands = [
            `parted /dev/${appState.selectedDisk} mkpart primary fat32 1MiB 513MiB`,
            `parted /dev/${appState.selectedDisk} set 1 esp on`,
            `parted /dev/${appState.selectedDisk} mkpart primary linux-swap 513MiB 4.5GiB`,
            `parted /dev/${appState.selectedDisk} mkpart primary ${appState.selectedFilesystem} 4.5GiB 100%`,
            '',
            '# Форматирование',
            `mkfs.fat -F32 /dev/${appState.selectedDisk}1`,
            `mkswap /dev/${appState.selectedDisk}2`,
            `swapon /dev/${appState.selectedDisk}2`,
            `mkfs.${appState.selectedFilesystem} /dev/${appState.selectedDisk}3`,
            '',
            '# Монтирование',
            `mount /dev/${appState.selectedDisk}3 /mnt`,
            `mkdir /mnt/boot`,
            `mount /dev/${appState.selectedDisk}1 /mnt/boot`
        ];
        
        script.commands.push(...autoCommands);
    }
    
    return script;
}

function showInstallationScript() {
    const script = generateInstallationScript();
    const content = `
        <h4>Скрипт установки</h4>
        <div style="background: #2d2d2d; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre style="color: #00ff00; font-family: 'Courier New', monospace; margin: 0; white-space: pre-wrap;">
${script.commands.join('\n')}
            </pre>
        </div>
        <div style="margin-top: 15px;">
            <button onclick="copyScriptToClipboard()" class="btn-secondary" style="margin-right: 10px;">Копировать</button>
            <button onclick="downloadScript()" class="btn-secondary">Скачать</button>
        </div>
        <p style="color: #888; font-size: 0.9rem; margin-top: 15px;">
            ⚠️ Внимание: Выполнение этих команд приведет к удалению всех данных на выбранном диске!
        </p>
    `;
    
    showModal('Инструкции по установке', content);
}

function copyScriptToClipboard() {
    const script = generateInstallationScript();
    const scriptText = script.commands.join('\n');
    
    navigator.clipboard.writeText(scriptText).then(() => {
        showNotification('Скрипт скопирован в буфер обмена', 'success');
    }).catch(() => {
        showNotification('Ошибка при копировании', 'error');
    });
}

function downloadScript() {
    const script = generateInstallationScript();
    const scriptText = `#!/bin/bash
# Автоматически сгенерированный скрипт разметки диска
# Создано: ${new Date().toLocaleString()}
# Диск: ${script.disk}
# Файловая система: ${script.filesystem}
# Схема: ${script.scheme}

${script.commands.join('\n')}
`;
    
    const blob = new Blob([scriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `partition-script-${Date.now()}.sh`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Скрипт загружен', 'success');
}

// Функции для создания диаграммы использования диска
function createDiskUsageChart() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;
    
    let currentAngle = 0;
    
    const colors = {
        '/': '#3498db',
        '/home': '#2ecc71',
        '/var': '#f39c12',
        '/boot': '#9b59b6',
        '/boot/efi': '#e67e22',
        'swap': '#e74c3c',
        'free': '#95a5a6'
    };
    
    const partitions = appState.partitionScheme === 'manual' && appState.manualPartitions.length > 0
        ? appState.manualPartitions
        : generateAutoPartitions().map(p => ({
            mountPoint: p.mountPoint,
            size: p.size,
            filesystem: p.filesystem
        }));
    
    partitions.forEach(partition => {
        const angle = (partition.size / appState.diskCapacity) * 2 * Math.PI;
        const color = colors[partition.mountPoint] || '#34495e';
        
        // Рисуем сектор
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Добавляем текст
        const labelAngle = currentAngle + angle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(partition.mountPoint, labelX, labelY);
        ctx.fillText(`${partition.size} GB`, labelX, labelY + 15);
        
        currentAngle += angle;
    });
    
    return canvas;
}

// Функции для продвинутых настроек
function showAdvancedOptions() {
    const content = `
        <h4>Дополнительные параметры</h4>
        <div class="advanced-options">
            <div class="option-group">
                <h5>Параметры файловой системы</h5>
                <label>
                    <input type="checkbox" id="enable-compression" ${appState.selectedFilesystem === 'btrfs' ? '' : 'disabled'}>
                    Включить сжатие (только для Btrfs)
                </label>
                <label>
                    <input type="checkbox" id="enable-quotas">
                    Включить квоты пользователей
                </label>
                <label>
                    <input type="checkbox" id="enable-acl">
                    Расширенные права доступа (ACL)
                </label>
            </div>
            
            <div class="option-group">
                <h5>Параметры безопасности</h5>
                <label>
                    <input type="checkbox" id="enable-encryption">
                    Шифрование диска (LUKS)
                </label>
                <label>
                    <input type="checkbox" id="secure-erase">
                    Безопасное удаление данных
                </label>
                <label>
                    <input type="checkbox" id="enable-trim">
                    Включить TRIM для SSD
                </label>
            </div>
            
            <div class="option-group">
                <h5>Параметры производительности</h5>
                <label>
                    Планировщик I/O:
                    <select id="io-scheduler">
                        <option value="mq-deadline">mq-deadline</option>
                        <option value="bfq">BFQ</option>
                        <option value="kyber">Kyber</option>
                        <option value="none">None</option>
                    </select>
                </label>
                <label>
                    <input type="number" id="readahead" min="128" max="8192" value="256">
                    Размер read-ahead (KB)
                </label>
            </div>
            
            <div class="option-group">
                <h5>Резервирование места</h5>
                <label>
                    <input type="number" id="reserved-blocks" min="0" max="10" value="5" step="0.1">
                    Резерв для root (%)
                </label>
            </div>
        </div>
        
        <div class="form-actions">
            <button onclick="applyAdvancedOptions()" class="btn-primary">Применить</button>
            <button onclick="closeModal()" class="btn-secondary">Отмена</button>
        </div>
        
        <style>
            .advanced-options {
                margin: 20px 0;
            }
            .option-group {
                margin-bottom: 25px;
                padding: 15px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
            }
            .option-group h5 {
                color: #c5a47e;
                margin-bottom: 10px;
                font-size: 1rem;
            }
            .option-group label {
                display: block;
                margin-bottom: 8px;
                color: #cccccc;
                cursor: pointer;
            }
            .option-group input, .option-group select {
                margin-right: 8px;
                background: rgba(40, 40, 40, 0.8);
                border: 1px solid rgba(197, 164, 126, 0.3);
                color: #ffffff;
                padding: 4px;
                border-radius: 4px;
            }
        </style>
    `;
    
    showModal('Дополнительные параметры', content);
}

function applyAdvancedOptions() {
    const options = {
        compression: document.getElementById('enable-compression')?.checked || false,
        quotas: document.getElementById('enable-quotas')?.checked || false,
        acl: document.getElementById('enable-acl')?.checked || false,
        encryption: document.getElementById('enable-encryption')?.checked || false,
        secureErase: document.getElementById('secure-erase')?.checked || false,
        trim: document.getElementById('enable-trim')?.checked || false,
        ioScheduler: document.getElementById('io-scheduler')?.value || 'mq-deadline',
        readahead: document.getElementById('readahead')?.value || 256,
        reservedBlocks: document.getElementById('reserved-blocks')?.value || 5
    };
    
    appState.advancedOptions = options;
    closeModal();
    showNotification('Дополнительные параметры применены', 'success');
}

// Функции для создания рекомендаций
function generateRecommendations() {
    const recommendations = [];
    
    // Рекомендации по диску
    if (appState.selectedDisk === 'sdb') { // HDD
        recommendations.push({
            type: 'info',
            title: 'Диск HDD',
            message: 'Для лучшей производительности рассмотрите использование SSD диска',
            priority: 'medium'
        });
    }
    
    // Рекомендации по файловой системе
    if (appState.selectedFilesystem === 'f2fs' && appState.selectedDisk === 'sdb') {
        recommendations.push({
            type: 'warning',
            title: 'Несовместимость',
            message: 'F2FS оптимизирована для SSD, не рекомендуется для HDD',
            priority: 'high'
        });
    }
    
    // Рекомендации по разделам
    if (appState.partitionScheme === 'manual') {
        const swapPartition = appState.manualPartitions.find(p => p.mountPoint === 'swap');
        if (!swapPartition) {
            recommendations.push({
                type: 'warning',
                title: 'Отсутствует SWAP',
                message: 'Рекомендуется создать SWAP раздел для стабильной работы системы',
                priority: 'medium'
            });
        }
        
        const homePartition = appState.manualPartitions.find(p => p.mountPoint === '/home');
        if (!homePartition) {
            recommendations.push({
                type: 'info',
                title: 'Отдельный /home',
                message: 'Отдельный раздел для /home упростит обновление системы',
                priority: 'low'
            });
        }
    }
    
    // Рекомендации по безопасности
    if (!appState.advancedOptions?.encryption) {
        recommendations.push({
            type: 'info',
            title: 'Шифрование диска',
            message: 'Включите шифрование для защиты конфиденциальных данных',
            priority: 'medium'
        });
    }
    
    return recommendations;
}

function showRecommendations() {
    const recommendations = generateRecommendations();
    
    if (recommendations.length === 0) {
        showNotification('Конфигурация оптимальна!', 'success');
        return;
    }
    
    const content = `
        <h4>Рекомендации по конфигурации</h4>
        <div class="recommendations-list">
            ${recommendations.map(rec => `
                <div class="recommendation-item ${rec.type} priority-${rec.priority}">
                    <div class="rec-icon">
                        ${rec.type === 'warning' ? '⚠️' : rec.type === 'error' ? '❌' : 'ℹ️'}
                    </div>
                    <div class="rec-content">
                        <h5>${rec.title}</h5>
                        <p>${rec.message}</p>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <style>
            .recommendations-list {
                margin: 20px 0;
            }
            .recommendation-item {
                display: flex;
                align-items: flex-start;
                margin-bottom: 15px;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid;
            }
            .recommendation-item.info {
                background: rgba(52, 152, 219, 0.1);
                border-color: #3498db;
            }
            .recommendation-item.warning {
                background: rgba(243, 156, 18, 0.1);
                border-color: #f39c12;
            }
            .recommendation-item.error {
                background: rgba(231, 76, 60, 0.1);
                border-color: #e74c3c;
            }
            .rec-icon {
                font-size: 1.5rem;
                margin-right: 15px;
                margin-top: 2px;
            }
            .rec-content h5 {
                margin: 0 0 8px 0;
                color: #ffffff;
                font-size: 1rem;
            }
            .rec-content p {
                margin: 0;
                color: #cccccc;
                line-height: 1.4;
            }
        </style>
    `;
    
    showModal('Рекомендации системы', content);
}

// Функции для работы с шаблонами
const partitionTemplates = {
    minimal: {
        name: 'Минимальная установка',
        description: 'Только необходимые разделы',
        partitions: [
            { mountPoint: '/boot/efi', size: 0.5, filesystem: 'fat32', type: 'primary' },
            { mountPoint: '/', size: 0, filesystem: 'auto', type: 'primary' }, // Остальное место
            { mountPoint: 'swap', size: 2, filesystem: 'swap', type: 'primary' }
        ]
    },
    
    standard: {
        name: 'Стандартная установка',
        description: 'Рекомендуемая конфигурация',
        partitions: [
            { mountPoint: '/boot/efi', size: 0.5, filesystem: 'fat32', type: 'primary' },
            { mountPoint: '/', size: 30, filesystem: 'auto', type: 'primary' },
            { mountPoint: '/home', size: 0, filesystem: 'auto', type: 'primary' }, // Остальное место
            { mountPoint: 'swap', size: 4, filesystem: 'swap', type: 'primary' }
        ]
    },
    
    advanced: {
        name: 'Продвинутая установка',
        description: 'Отдельные разделы для системных директорий',
        partitions: [
            { mountPoint: '/boot/efi', size: 0.5, filesystem: 'fat32', type: 'primary' },
            { mountPoint: '/', size: 20, filesystem: 'auto', type: 'primary' },
            { mountPoint: '/var', size: 15, filesystem: 'auto', type: 'primary' },
            { mountPoint: '/tmp', size: 5, filesystem: 'auto', type: 'primary' },
            { mountPoint: '/home', size: 0, filesystem: 'auto', type: 'primary' }, // Остальное место
            { mountPoint: 'swap', size: 8, filesystem: 'swap', type: 'primary' }
        ]
    }
};

function showPartitionTemplates() {
    const content = `
        <h4>Шаблоны разметки диска</h4>
        <div class="templates-list">
            ${Object.entries(partitionTemplates).map(([key, template]) => `
                <div class="template-item" onclick="applyTemplate('${key}')">
                    <h5>${template.name}</h5>
                    <p>${template.description}</p>
                    <div class="template-partitions">
                        ${template.partitions.map(p => 
                            `<span class="partition-tag">${p.mountPoint} (${p.size || 'остальное'} GB)</span>`
                        ).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <style>
            .templates-list {
                margin: 20px 0;
            }
            .template-item {
                padding: 20px;
                margin-bottom: 15px;
                background: rgba(40, 40, 40, 0.6);
                border-radius: 10px;
                border: 1px solid rgba(197, 164, 126, 0.2);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .template-item:hover {
                border-color: rgba(197, 164, 126, 0.5);
                background: rgba(40, 40, 40, 0.8);
            }
            .template-item h5 {
                color: #c5a47e;
                margin: 0 0 8px 0;
                font-size: 1.1rem;
            }
            .template-item p {
                color: #cccccc;
                margin: 0 0 15px 0;
                line-height: 1.4;
            }
            .template-partitions {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            .partition-tag {
                background: rgba(197, 164, 126, 0.2);
                color: #c5a47e;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 0.85rem;
            }
        </style>
    `;
    
    showModal('Шаблоны разметки', content);
}

