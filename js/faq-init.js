// FAQ System Initialization
(function() {
    'use strict';
    
    // Проверка совместимости браузера
    const checkBrowserSupport = () => {
        const requiredFeatures = [
            'querySelector',
            'addEventListener',
            'localStorage',
            'JSON',
            'Promise'
        ];
        
               const missingFeatures = requiredFeatures.filter(feature => {
            if (feature === 'querySelector') return !document.querySelector;
            if (feature === 'addEventListener') return !window.addEventListener;
            if (feature === 'localStorage') return !window.localStorage;
            if (feature === 'JSON') return !window.JSON;
            if (feature === 'Promise') return !window.Promise;
            return false;
        });
        
        if (missingFeatures.length > 0) {
            console.warn('FAQ System: Browser missing features:', missingFeatures);
            return false;
        }
        
        return true;
    };
    
    // Конфигурация по умолчанию
    const defaultConfig = {
        // Основные настройки
        searchDelay: 300,
        animationDuration: 400,
        autoSave: true,
        enableAnalytics: true,
        enableKeyboardShortcuts: true,
        
        // Настройки поиска
        searchMinLength: 2,
        searchHighlight: true,
        searchSuggestions: true,
        
        // Настройки уведомлений
        notificationDuration: 4000,
        notificationPosition: 'top-right',
        
        // Настройки производительности
        virtualScrolling: false,
        lazyLoading: true,
        preloadImages: false,
        
        // Настройки доступности
        highContrast: false,
        reducedMotion: false,
        screenReaderSupport: true,
        
        // Настройки локализации
        language: 'ru',
        dateFormat: 'DD.MM.YYYY',
        timeFormat: '24h'
    };
    
    // Загрузка конфигурации из localStorage
    const loadConfig = () => {
        try {
            const savedConfig = localStorage.getItem('faq_config');
            if (savedConfig) {
                return { ...defaultConfig, ...JSON.parse(savedConfig) };
            }
        } catch (error) {
            console.warn('FAQ System: Error loading config:', error);
        }
        return defaultConfig;
    };
    
    // Сохранение конфигурации
    const saveConfig = (config) => {
        try {
            localStorage.setItem('faq_config', JSON.stringify(config));
        } catch (error) {
            console.warn('FAQ System: Error saving config:', error);
        }
    };
    
    // Определение возможностей устройства
    const detectDeviceCapabilities = () => {
        return {
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            hasHover: window.matchMedia('(hover: hover)').matches,
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
            prefersDarkTheme: window.matchMedia('(prefers-color-scheme: dark)').matches,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            pixelRatio: window.devicePixelRatio || 1,
            connectionType: navigator.connection?.effectiveType || 'unknown',
            memoryLimit: navigator.deviceMemory || 'unknown'
        };
    };
    
    // Применение настроек устройства
    const applyDeviceOptimizations = (capabilities, config) => {
        // Отключаем анимации на медленных устройствах
        if (capabilities.prefersReducedMotion || capabilities.memoryLimit <= 2) {
            config.animationDuration = 0;
            document.body.classList.add('reduced-motion');
        }
        
        // Включаем виртуальный скроллинг на мобильных устройствах с большим количеством FAQ
        if (capabilities.isMobile && document.querySelectorAll('.faq-item').length > 50) {
            config.virtualScrolling = true;
        }
        
        // Настройки для медленного интернета
        if (['slow-2g', '2g'].includes(capabilities.connectionType)) {
            config.preloadImages = false;
            config.lazyLoading = true;
        }
        
        // Высококонтрастная тема
        if (capabilities.prefersHighContrast) {
            document.body.classList.add('high-contrast');
        }
        
        // Темная тема
        if (capabilities.prefersDarkTheme) {
            document.body.classList.add('dark-theme');
        }
        
        // Touch-оптимизация
        if (capabilities.isTouchDevice) {
            document.body.classList.add('touch-device');
        }
        
        return config;
    };
    
    // Инициализация системы событий
    const setupEventSystem = () => {
        const eventBus = {
            events: {},
            
            on(event, callback) {
                if (!this.events[event]) {
                    this.events[event] = [];
                }
                this.events[event].push(callback);
            },
            
            off(event, callback) {
                if (this.events[event]) {
                    this.events[event] = this.events[event].filter(cb => cb !== callback);
                }
            },
            
            emit(event, data) {
                if (this.events[event]) {
                    this.events[event].forEach(callback => {
                        try {
                            callback(data);
                        } catch (error) {
                            console.error(`FAQ System: Error in event handler for ${event}:`, error);
                        }
                    });
                }
            }
        };
        
        window.faqEventBus = eventBus;
        return eventBus;
    };
    
    // Загрузка дополнительных модулей
    const loadOptionalModules = async (config) => {
        const modules = [];
        
        // Модуль аналитики
        if (config.enableAnalytics) {
            try {
                // В реальном проекте здесь был бы динамический импорт
                modules.push('analytics');
            } catch (error) {
                console.warn('FAQ System: Analytics module failed to load:', error);
            }
        }
        
        // Модуль A/B тестирования
        if (config.enableABTesting) {
            try {
                modules.push('ab-testing');
            } catch (error) {
                console.warn('FAQ System: A/B testing module failed to load:', error);
            }
        }
        
        return modules;
    };
    
    // Инициализация базовых компонентов
    const initializeCoreComponents = (config, eventBus) => {
        const components = {};
        
        // Менеджер производительности
        components.performanceManager = {
            startTime: performance.now(),
            metrics: {},
            
            measure(name, fn) {
                const start = performance.now();
                const result = fn();
                const end = performance.now();
                this.metrics[name] = end - start;
                return result;
            },
            
            getReport() {
                return {
                    totalInitTime: performance.now() - this.startTime,
                    metrics: this.metrics,
                    memory: performance.memory ? {
                        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
                    } : null
                };
            }
        };
        
        // Менеджер ошибок
        components.errorManager = {
            errors: [],
            
            logError(error, context = {}) {
                const errorInfo = {
                    message: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString(),
                    context,
                    url: window.location.href,
                    userAgent: navigator.userAgent
                };
                
                this.errors.push(errorInfo);
                console.error('FAQ System Error:', errorInfo);
                
                // Уведомляем об ошибке
                eventBus.emit('error', errorInfo);
                
                // Отправляем в аналитику
                if (window.faqAnalytics) {
                    window.faqAnalytics.logInteraction('error', errorInfo);
                }
            },
            
            getErrorReport() {
                return {
                    totalErrors: this.errors.length,
                    recentErrors: this.errors.slice(-10),
                    errorTypes: this.errors.reduce((acc, error) => {
                        const type = error.message.split(':')[0];
                        acc[type] = (acc[type] || 0) + 1;
                        return acc;
                    }, {})
                };
            }
        };
        
        // Менеджер состояния
        components.stateManager = {
            state: {
                isInitialized: false,
                currentFilter: 'all',
                searchTerm: '',
                openFAQs: [],
                userPreferences: {}
            },
            
            setState(newState) {
                const oldState = { ...this.state };
                this.state = { ...this.state, ...newState };
                eventBus.emit('stateChanged', { oldState, newState: this.state });
            },
            
            getState() {
                return { ...this.state };
            }
        };
        
        return components;
    };
    
    // Проверка готовности DOM
    const waitForDOM = () => {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    };
    
    // Основная функция инициализации
    const initializeFAQSystem = async () => {
        try {
            // Проверяем совместимость браузера
            if (!checkBrowserSupport()) {
                throw new Error('Browser not supported');
            }
            
            // Ждем готовности DOM
            await waitForDOM();
            
            // Загружаем конфигурацию
            let config = loadConfig();
            
            // Определяем возможности устройства и применяем оптимизации
            const capabilities = detectDeviceCapabilities();
            config = applyDeviceOptimizations(capabilities, config);
            
            // Сохраняем обновленную конфигурацию
            saveConfig(config);
            
            // Настраиваем систему событий
            const eventBus = setupEventSystem();
            
            // Инициализируем базовые компоненты
            const components = initializeCoreComponents(config, eventBus);
            
            // Загружаем дополнительные модули
            const loadedModules = await loadOptionalModules(config);
            
            // Создаем глобальный объект системы
            window.FAQSystem = {
                config,
                capabilities,
                eventBus,
                components,
                loadedModules,
                version: '1.0.0',
                
                // Публичные методы
                getConfig: () => config,
                updateConfig: (newConfig) => {
                    config = { ...config, ...newConfig };
                    saveConfig(config);
                    eventBus.emit('configUpdated', config);
                },
                
                getCapabilities: () => capabilities,
                getComponents: () => components,
                
                // Методы для отладки
                debug: {
                    getPerformanceReport: () => components.performanceManager.getReport(),
                    getErrorReport: () => components.errorManager.getErrorReport(),
                    getState: () => components.stateManager.getState(),
                    clearErrors: () => { components.errorManager.errors = []; },
                    resetConfig: () => {
                        config = { ...defaultConfig };
                        saveConfig(config);
                        eventBus.emit('configReset', config);
                    }
                }
            };
            
            // Обновляем состояние
            components.stateManager.setState({ isInitialized: true });
            
            // Уведомляем о завершении инициализации
            eventBus.emit('systemInitialized', {
                config,
                capabilities,
                loadedModules,
                initTime: performance.now() - components.performanceManager.startTime
            });
            
            console.log('✅ FAQ System Core initialized successfully', {
                version: '1.0.0',
                config,
                capabilities,
                loadedModules,
                initTime: Math.round(performance.now() - components.performanceManager.startTime) + 'ms'
            });
            
        } catch (error) {
            console.error('❌ FAQ System initialization failed:', error);
            
            // Показываем fallback интерфейс
            showFallbackInterface(error);
        }
    };
    
    // Fallback интерфейс при ошибках
    const showFallbackInterface = (error) => {
        const fallbackHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #e74c3c;
                color: white;
                padding: 20px;
                border-radius: 8px;
                z-index: 10000;
                max-width: 400px;
                font-family: Arial, sans-serif;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ">
                <h3 style="margin: 0 0 10px 0;">⚠️ Ошибка FAQ системы</h3>
                <p style="margin: 0 0 15px 0;">
                    Произошла ошибка при инициализации FAQ системы. 
                    Базовая функциональность может быть ограничена.
                </p>
                <details style="margin-bottom: 15px;">
                    <summary style="cursor: pointer;">Техническая информация</summary>
                    <pre style="
                        background: rgba(0,0,0,0.2);
                        padding: 10px;
                        border-radius: 4px;
                        font-size: 12px;
                        margin-top: 10px;
                        overflow: auto;
                        max-height: 100px;
                    ">${error.stack || error.message}</pre>
                </details>
                <div style="text-align: right;">
                    <button onclick="location.reload()" style="
                        background: #c0392b;
                        border: none;
                        color: white;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        margin-right: 10px;
                    ">Перезагрузить</button>
                                        <button onclick="this.closest('div').remove()" style="
                        background: transparent;
                        border: 1px solid white;
                        color: white;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Закрыть</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', fallbackHTML);
        
        // Автоматически скрываем через 30 секунд
        setTimeout(() => {
            const fallbackElement = document.querySelector('[style*="position: fixed"][style*="background: #e74c3c"]');
            if (fallbackElement) {
                fallbackElement.remove();
            }
        }, 30000);
    };
    
    // Обработчики глобальных событий
    const setupGlobalEventHandlers = () => {
        // Обработка изменения размера окна
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.FAQSystem) {
                    window.FAQSystem.eventBus.emit('windowResized', {
                        width: window.innerWidth,
                        height: window.innerHeight
                    });
                }
            }, 250);
        });
        
        // Обработка изменения ориентации
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (window.FAQSystem) {
                    window.FAQSystem.eventBus.emit('orientationChanged', {
                        orientation: screen.orientation?.angle || 0
                    });
                }
            }, 100);
        });
        
        // Обработка изменения видимости страницы
        document.addEventListener('visibilitychange', () => {
            if (window.FAQSystem) {
                window.FAQSystem.eventBus.emit('visibilityChanged', {
                    hidden: document.hidden
                });
            }
        });
        
        // Обработка глобальных ошибок
        window.addEventListener('error', (event) => {
            if (window.FAQSystem?.components?.errorManager) {
                window.FAQSystem.components.errorManager.logError(event.error, {
                    type: 'global',
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno
                });
            }
        });
        
        // Обработка необработанных промисов
        window.addEventListener('unhandledrejection', (event) => {
            if (window.FAQSystem?.components?.errorManager) {
                window.FAQSystem.components.errorManager.logError(
                    new Error(event.reason), 
                    { type: 'promise_rejection' }
                );
            }
        });
        
        // Обработка изменения подключения к интернету
        window.addEventListener('online', () => {
            if (window.FAQSystem) {
                window.FAQSystem.eventBus.emit('connectionChanged', { online: true });
            }
        });
        
        window.addEventListener('offline', () => {
            if (window.FAQSystem) {
                window.FAQSystem.eventBus.emit('connectionChanged', { online: false });
            }
        });
    };
    
    // Функция для отложенной инициализации
    const deferredInit = () => {
        // Инициализируем после основных компонентов
        if (window.requestIdleCallback) {
            window.requestIdleCallback(() => {
                initializeOptionalFeatures();
            });
        } else {
            setTimeout(initializeOptionalFeatures, 100);
        }
    };
    
    // Инициализация дополнительных функций
    const initializeOptionalFeatures = () => {
        try {
            // Service Worker для кеширования
            if ('serviceWorker' in navigator && window.FAQSystem?.config?.enableServiceWorker) {
                navigator.serviceWorker.register('/faq-sw.js')
                    .then(registration => {
                        console.log('FAQ SW registered:', registration);
                        window.FAQSystem.eventBus.emit('serviceWorkerRegistered', registration);
                    })
                    .catch(error => {
                        console.warn('FAQ SW registration failed:', error);
                    });
            }
            
            // Web Push уведомления
            if ('Notification' in window && window.FAQSystem?.config?.enablePushNotifications) {
                if (Notification.permission === 'default') {
                    // Не запрашиваем разрешения автоматически, только по запросу пользователя
                    window.FAQSystem.requestNotificationPermission = () => {
                        return Notification.requestPermission();
                    };
                }
            }
            
            // Периодическая синхронизация данных
            if (window.FAQSystem?.config?.enablePeriodicSync) {
                setInterval(() => {
                    window.FAQSystem.eventBus.emit('periodicSync');
                }, 5 * 60 * 1000); // каждые 5 минут
            }
            
            // Автосохранение пользовательских данных
            if (window.FAQSystem?.config?.autoSave) {
                window.addEventListener('beforeunload', () => {
                    if (window.FAQSystem?.components?.stateManager) {
                        const state = window.FAQSystem.components.stateManager.getState();
                        try {
                            localStorage.setItem('faq_user_state', JSON.stringify({
                                searchTerm: state.searchTerm,
                                currentFilter: state.currentFilter,
                                openFAQs: state.openFAQs,
                                timestamp: Date.now()
                            }));
                        } catch (error) {
                            console.warn('FAQ System: Error saving user state:', error);
                        }
                    }
                });
            }
            
        } catch (error) {
            console.warn('FAQ System: Error initializing optional features:', error);
        }
    };
    
    // Функция восстановления состояния пользователя
    const restoreUserState = () => {
        try {
            const savedState = localStorage.getItem('faq_user_state');
            if (savedState) {
                const state = JSON.parse(savedState);
                
                // Проверяем, что данные не слишком старые (24 часа)
                if (Date.now() - state.timestamp < 24 * 60 * 60 * 1000) {
                    if (window.FAQSystem?.components?.stateManager) {
                        window.FAQSystem.components.stateManager.setState({
                            searchTerm: state.searchTerm || '',
                            currentFilter: state.currentFilter || 'all',
                            openFAQs: state.openFAQs || []
                        });
                        
                        // Применяем восстановленное состояние
                        if (state.searchTerm && window.faqManager) {
                            window.faqManager.searchFAQ(state.searchTerm);
                        }
                        
                        if (state.currentFilter !== 'all' && window.faqManager) {
                            window.faqManager.filterByCategory(state.currentFilter);
                        }
                        
                        // Открываем ранее открытые FAQ
                        if (state.openFAQs.length > 0) {
                            setTimeout(() => {
                                state.openFAQs.forEach(index => {
                                    if (window.faqManager) {
                                        window.faqManager.openFAQByIndex(index);
                                    }
                                });
                            }, 500);
                        }
                    }
                }
            }
        } catch (error) {
            console.warn('FAQ System: Error restoring user state:', error);
        }
    };
    
    // Основная точка входа
    const bootstrap = async () => {
        try {
            console.log('🚀 Starting FAQ System initialization...');
            
            // Настраиваем глобальные обработчики событий
            setupGlobalEventHandlers();
            
            // Инициализируем основную систему
            await initializeFAQSystem();
            
            // Восстанавливаем состояние пользователя
            restoreUserState();
            
            // Отложенная инициализация дополнительных функций
            deferredInit();
            
            // Добавляем команды для консоли разработчика
            if (typeof window !== 'undefined') {
                window.faqSystemCommands = {
                    getSystem: () => window.FAQSystem,
                    getConfig: () => window.FAQSystem?.getConfig(),
                    getPerformance: () => window.FAQSystem?.debug?.getPerformanceReport(),
                    getErrors: () => window.FAQSystem?.debug?.getErrorReport(),
                    resetConfig: () => window.FAQSystem?.debug?.resetConfig(),
                    exportState: () => {
                        const state = window.FAQSystem?.components?.stateManager?.getState();
                        console.log('Current FAQ System State:', state);
                        return state;
                    },
                    help: () => {
                        console.log(`
FAQ System Developer Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 System Information:
   faqSystemCommands.getSystem()      - Get system instance
   faqSystemCommands.getConfig()      - Get current configuration
   faqSystemCommands.getPerformance() - Get performance metrics
   faqSystemCommands.getErrors()      - Get error report

🔧 System Control:
   faqSystemCommands.resetConfig()    - Reset to default config
   faqSystemCommands.exportState()    - Export current state

💡 Help:
   faqSystemCommands.help()           - Show this help

FAQ System v1.0.0 - Ready for development!
                        `);
                    }
                };
                
                // Автоматически показываем помощь в dev режиме
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    setTimeout(() => {
                        console.log('%c🔧 FAQ System Developer Mode Active!', 'color: #3498db; font-size: 14px; font-weight: bold;');
                        console.log('Type faqSystemCommands.help() for available commands');
                    }, 1000);
                }
            }
            
        } catch (error) {
            console.error('❌ FAQ System bootstrap failed:', error);
            showFallbackInterface(error);
        }
    };
    
    // Запускаем инициализацию
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        // DOM уже загружен, запускаем немедленно
        bootstrap();
    }
    
    // Экспорт для модульных систем
    if (typeof exports !== 'undefined') {
        exports.initializeFAQSystem = initializeFAQSystem;
        exports.defaultConfig = defaultConfig;
    }
    
    // AMD поддержка
    if (typeof define === 'function' && define.amd) {
        define('faq-init', [], function() {
            return {
                initializeFAQSystem,
                defaultConfig
            };
        });
    }

})();

// Предотвращаем множественную инициализацию
if (!window.faqSystemInitialized) {
    window.faqSystemInitialized = true;
    
    // Логируем информацию о системе
    console.log(`
%c🎯 FAQ System Loading...
%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

%c📦 Version: 1.0.0
%c🌐 Environment: ${window.location.hostname}
%c🔧 Browser: ${navigator.userAgent.split(' ').pop()}
%c💾 Local Storage: ${localStorage ? '✅ Available' : '❌ Not Available'}
%c🔄 Service Worker: ${'serviceWorker' in navigator ? '✅ Supported' : '❌ Not Supported'}

%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
%cInitializing components...
    `, 
    'color: #3498db; font-size: 16px; font-weight: bold;',
    'color: #95a5a6;',
    'color: #2ecc71;',
    'color: #f39c12;',
    'color: #9b59b6;',
    'color: #1abc9c;',
    'color: #e74c3c;',
    'color: #34495e;',
    'color: #95a5a6;',
    'color: #3498db;'
    );
}
