// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Скрыть прелоадер
    hidePreloader();
    
    // Инициализация анимаций прокрутки
    initScrollAnimations();
    
    // Инициализация счетчиков статистики  
    initCounters();
    
    // Инициализация FAQ
    initFAQ();
    
    // Обработчик для кнопки "К списку инструментов"
    const backButton = document.querySelector('.back-to-tools');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            goBackToTools();
        });
    }
    
    // Обработчик для кнопки "Наверх"
    const scrollButton = document.getElementById('scrollToTop');
    if (scrollButton) {
        scrollButton.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToTop();
        });
    }
    
    // Обработчик закрытия модального окна по клику вне его
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
    
    // Обработчик клавиши Escape для закрытия модального окна
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('modalOverlay');
            if (modal && modal.classList.contains('active')) {
                closeModal();
            }
        }
    });
    
    // Показать кнопку "Наверх" при прокрутке
    window.addEventListener('scroll', function() {
        const scrollButton = document.getElementById('scrollToTop');
        if (scrollButton) {
            if (window.pageYOffset > 300) {
                scrollButton.classList.add('visible');
            } else {
                scrollButton.classList.remove('visible');
            }
        }
    });
});

// Функция плавной прокрутки наверх (глобальная)
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Делаем функции глобально доступными
window.scrollToTop = scrollToTop;
window.goBackToTools = goBackToTools;

  // Прелоадер
  function initPreloader() {
      const preloader = document.getElementById('preloader');
      window.addEventListener('load', function() {
          setTimeout(() => {
              preloader.classList.add('hidden');
              setTimeout(() => {
                  preloader.style.display = 'none';
              }, 500);
          }, 1000);
      });
  }
  // Анимации при скролле
  function initScrollAnimations() {
      const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
      };
     const observer = new IntersectionObserver(function(entries) {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  entry.target.classList.add('visible');
              }
          });
      }, observerOptions);
      // Наблюдаем за всеми элементами с классом scroll-animate
      document.querySelectorAll('.scroll-animate').forEach(el => {
          observer.observe(el);
      });
  }

  // Счетчики в hero секции
  function initCounters() {
      const counters = document.querySelectorAll('.stat-number');
      let animationTriggered = false;
      const counterObserver = new IntersectionObserver(function(entries) {
          entries.forEach(entry => {
              if (entry.isIntersecting && !animationTriggered) {
                  animationTriggered = true;
                  animateCounters();
              }
          });
      }, { threshold: 0.5 });
      if (counters.length > 0) {
          counterObserver.observe(counters[0].closest('.hero-stats'));
      }
    function animateCounters() {
          counters.forEach(counter => {
              const target = parseInt(counter.getAttribute('data-target'));
              const duration = 2000;
              const step = target / (duration / 16);
              let current = 0;
              const timer = setInterval(() => {
                  current += step;
                  if (current >= target) {
                      counter.textContent = target;
                      clearInterval(timer);
                  } else {
                      counter.textContent = Math.floor(current);
                  }
              }, 16);
          });
      }
  }

  // FAQ функциональность
  function initFAQ() {
      const faqItems = document.querySelectorAll('.faq-item');
      faqItems.forEach(item => {
          const question = item.querySelector('.faq-question');
          const answer = item.querySelector('.faq-answer');
          question.addEventListener('click', () => {
              const isActive = item.classList.contains('active');

              // Закрываем все остальные FAQ
              faqItems.forEach(otherItem => {
                  if (otherItem !== item) {
                      otherItem.classList.remove('active');
                      const otherAnswer = otherItem.querySelector('.faq-answer');
                      otherAnswer.style.maxHeight = '0';
                  }
              });

              // Переключаем текущий FAQ
              if (isActive) {
                  item.classList.remove('active');
                  answer.style.maxHeight = '0';
              } else {
                  item.classList.add('active');
                  answer.style.maxHeight = answer.scrollHeight + 'px';
              }
          });
      });
  }

  // Кнопка "наверх"
  function initScrollToTop() {
      const scrollBtn = document.getElementById('scrollToTop');
      window.addEventListener('scroll', () => {
          if (window.pageYOffset > 300) {
              scrollBtn.classList.add('visible');
          } else {
              scrollBtn.classList.remove('visible');
          }
      });
  }

  // Функция прокрутки наверх
  function scrollToTop() {
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  }

 // Функция возврата к списку инструментов (должна быть в глобальной области)
function goBackToTools() {
    window.location.href = 'remote-management.html';
}

// Делаем функцию глобально доступной
window.goBackToTools = goBackToTools;

  // Модальное окно
  function initModal() {
      const modal = document.getElementById('modalOverlay');
      // Закрытие по клику на overlay
      modal.addEventListener('click', (e) => {
          if (e.target === modal) {
              closeModal();
          }
      });

      // Закрытие по Escape
      document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && modal.classList.contains('active')) {
              closeModal();
          }
      });
  }

  // Открытие модального окна
  function openModal(title, content) {
      const modal = document.getElementById('modalOverlay');
      const modalTitle = document.getElementById('modalTitle');
      const modalBody = document.getElementById('modalBody');
      modalTitle.textContent = title;
      modalBody.innerHTML = content;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
  }

  // Закрытие модального окна
  function closeModal() {
      const modal = document.getElementById('modalOverlay');
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
  }

  // FAQ toggle функция (для onclick в HTML)
  function toggleFAQ(element) {
      const faqItem = element.closest('.faq-item');
      const answer = faqItem.querySelector('.faq-answer');
      const isActive = faqItem.classList.contains('active');

      // Закрываем все FAQ
      document.querySelectorAll('.faq-item').forEach(item => {
          if (item !== faqItem) {
              item.classList.remove('active');
              const itemAnswer = item.querySelector('.faq-answer');
              itemAnswer.style.maxHeight = '0';
          }
      });

      // Переключаем текущий
      if (isActive) {
          faqItem.classList.remove('active');
          answer.style.maxHeight = '0';
      } else {
          faqItem.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
      }
  }

  // Функции для демонстрации функций TeamViewer
  function showTeamViewerDemo(feature) {
      let title, content;
      switch(feature) {
          case 'remote-access':
              title = 'Удаленный доступ TeamViewer';
              content = `
                  <div class="demo-content">
                      <h4>Как работает удаленный доступ:</h4>
                      <ol>
                          <li>Установите TeamViewer на оба компьютера</li>
                          <li>Запустите программу и получите ID и пароль</li>
                          <li>Введите ID удаленного компьютера</li>
                          <li>Введите пароль для подключения</li>
                          <li>Получите полный контроль над удаленным ПК</li>
                      </ol>
                      <p><strong>Особенности:</strong></p>
                      <ul>
                          <li>Поддержка мультимониторов</li>
                          <li>Масштабирование экрана</li>
                          <li>Полноэкранный режим</li>
                          <li>Запись сеансов</li>
                      </ul>
                  </div>
              `;
              break;
          case 'file-transfer':
              title = 'Передача файлов TeamViewer';
              content = `
                  <div class="demo-content">
                      <h4>Способы передачи файлов:</h4>
                      <ul>
                          <li><strong>Drag & Drop:</strong> Перетаскивание файлов между окнами</li>
                          <li><strong>Файловый менеджер:</strong> Встроенный проводник</li>
                          <li><strong>Буфер обмена:</strong> Копирование текста и изображений</li>
                      </ul>
                      <p><strong>Преимущества:</strong></p>
                      <ul>
                          <li>Шифрование при передаче</li>
                          <li>Возможность передачи больших файлов</li>
                          <li>Синхронизация буфера обмена</li>
                          <li>Поддержка папок</li>
                      </ul>
                  </div>
              `;
              break;
          case 'security':
              title = 'Безопасность TeamViewer';
              content = `
                  <div class="demo-content">
                      <h4>Уровни защиты:</h4>
                      <ul>
                          <li><strong>Шифрование:</strong> AES-256 и RSA-2048</li>
                          <li><strong>2FA:</strong> Двухфакторная аутентификация</li>
                          <li><strong>Whitelist:</strong> Список доверенных устройств</li>
                          <li><strong>Брутфорс защита:</strong> Блокировка при подборе пароля</li>
                      </ul>
                      <p><strong>Настройки доступа:</strong></p>
                      <ul>
                          <li>Постоянный пароль</li>
                          <li>Случайные пароли</li>
                          <li>Подтверждение подключений</li>
                          <li>Ограничение прав доступа</li>
                      </ul>
                  </div>
              `;
              break;
          default:
              title = 'TeamViewer';
              content = '<p>Информация о функции недоступна.</p>';
      }
      openModal(title, content);
  }
  // Функция для показа системных требований
  function showSystemRequirements(platform) {
      let title, content;
      switch(platform) {
          case 'windows':
              title = 'TeamViewer для Windows';
              content = `
                  <div class="requirements-content">
                      <h4>Минимальные требования:</h4>
                      <ul>
                          <li>Windows 7 или новее</li>
                          <li>512 МБ ОЗУ</li>
                          <li>200 МБ свободного места</li>
                          <li>Интернет-соединение</li>
                      </ul>
                      <h4>Рекомендуемые требования:</h4>
                      <ul>
                          <li>Windows 10/11</li>
                          <li>2 ГБ ОЗУ</li>
                          <li>Широкополосный интернет</li>
                          <li>Дискретная видеокарта</li>
                      </ul>
                      <h4>Поддерживаемые версии:</h4>
                      <ul>
                          <li>Windows 7 (SP1)</li>
                          <li>Windows 8.1</li>
                          <li>Windows 10</li>
                          <li>Windows 11</li>
                          <li>Windows Server 2008 R2+</li>
                      </ul>
                  </div>
              `;
              break;
          case 'mac':
              title = 'TeamViewer для macOS';
              content = `
                  <div class="requirements-content">
                      <h4>Минимальные требования:</h4>
                      <ul>
                          <li>macOS 10.13 или новее</li>
                          <li>512 МБ ОЗУ</li>
                          <li>200 МБ свободного места</li>
                          <li>Intel или Apple Silicon процессор</li>
                      </ul>
                      <h4>Поддерживаемые версии:</h4>
                      <ul>
                          <li>macOS 10.13 High Sierra</li>
                          <li>macOS 10.14 Mojave</li>
                          <li>macOS 10.15 Catalina</li>
                          <li>macOS 11 Big Sur</li>
                          <li>macOS 12 Monterey</li>
                          <li>macOS 13 Ventura</li>
                          <li>macOS 14 Sonoma</li>
                      </ul>
                  </div>
              `;
              break;
          case 'linux':
              title = 'TeamViewer для Linux';
              content = `
                  <div class="requirements-content">
                      <h4>Поддерживаемые дистрибутивы:</h4>
                      <ul>
                          <li>Ubuntu 18.04+</li>
                          <li>Debian 9+</li>
                          <li>Red Hat Enterprise Linux 7+</li>
                          <li>CentOS 7+</li>
                          <li>Fedora 29+</li>
                          <li>openSUSE 15.1+</li>
                      </ul>
                      <h4>Требования:</h4>
                      <ul>
                          <li>x86_64 архитектура</li>
                          <li>512 МБ ОЗУ</li>
                          <li>200 МБ свободного места</li>
                          <li>X11 или Wayland</li>
                          <li>Графическая оболочка</li>
                      </ul>
                  </div>
              `;
              break;
          case 'mobile':
              title = 'TeamViewer Mobile';
              content = `
                  <div class="requirements-content">
                      <h4>Android:</h4>
                      <ul>
                          <li>Android 6.0 (API 23) или новее</li>
                          <li>1 ГБ ОЗУ</li>
                          <li>ARM или x86 процессор</li>
                          <li>Wi-Fi или мобильный интернет</li>
                      </ul>
                      <h4>iOS:</h4>
                      <ul>
                          <li>iOS 12.0 или новее</li>
                          <li>iPhone 6s / iPad Air 2 или новее</li>
                          <li>Wi-Fi или мобильный интернет</li>
                      </ul>
                      <h4>Функции мобильной версии:</h4>
                      <ul>
                          <li>Удаленное управление ПК</li>
                          <li>Передача файлов</li>
                          <li>Виртуальная клавиатура</li>
                          <li>Жесты управления</li>
                      </ul>
                  </div>
              `;
              break;
      }
      openModal(title, content);
  }
  // Функция для показа сравнения с конкурентами
  function showComparison(competitor) {
      let title, content;
      switch(competitor) {
          case 'anydesk':
              title = 'TeamViewer vs AnyDesk';
              content = `
                  <div class="comparison-content">
                      <h4>Преимущества TeamViewer:</h4>
                      <ul>
                          <li>Больший опыт на рынке (с 2005 года)</li>
                          <li>Более широкая функциональность</li>
                          <li>Лучшая интеграция с корпоративными системами</li>
                          <li>Поддержка записи сеансов</li>
                          <li>Больше вариантов лицензирования</li>
                      </ul>
                      <h4>Преимущества AnyDesk:</h4>
                      <ul>
                          <li>Более высокая скорость соединения</li>
                          <li>Меньшая задержка</li>
                          <li>Более низкая цена</li>
                          <li>Лучшее качество изображения</li>
                      </ul>
                  </div>
              `;
              break;
          case 'aeroadmin':
              title = 'TeamViewer vs AeroAdmin';
              content = `
                  <div class="comparison-content">
                      <h4>Преимущества TeamViewer:</h4>
                      <ul>
                          <li>Мобильные приложения</li>
                          <li>Больше функций безопасности</li>
                          <li>Файловый менеджер</li>
                          <li>VPN функциональность</li>
                          <li>Групповые политики</li>
                      </ul>
                      <h4>Преимущества AeroAdmin:</h4>
                      <ul>
                          <li>Полностью бесплатный</li>
                          <li>Простота использования</li>
                          <li>Не требует установки</li>
                          <li>Работает в России без VPN</li>
                      </ul>
                  </div>
              `;
              break;
          case 'chrome-remote':
              title = 'TeamViewer vs Chrome Remote Desktop';
              content = `
                  <div class="comparison-content">
                      <h4>Преимущества TeamViewer:</h4>
                      <ul>
                          <li>Не требует браузера Chrome</li>
                          <li>Больше функций безопасности</li>
                          <li>Передача файлов</li>
                          <li>Профессиональная техподдержка</li>
                          <li>Корпоративные функции</li>
                      </ul>
                      <h4>Преимущества Chrome Remote Desktop:</h4>
                      <ul>
                          <li>Полностью бесплатный</li>
                          <li>Интеграция с Google аккаунтом</li>
                          <li>Простая настройка</li>
                          <li>Работает через браузер</li>
                      </ul>
                  </div>
              `;
              break;
      }
      openModal(title, content);
  }
  // Функция для показа инструкции по установке
  function showInstallationGuide(step) {
      let title, content;
      switch(step) {
          case 'download':
              title = 'Скачивание TeamViewer';
              content = `
                  <div class="installation-content">
                      <h4>Где скачать:</h4>
                      <ul>
                          <li><strong>Официальный сайт:</strong> teamviewer.com</li>
                          <li><strong>Microsoft Store:</strong> для Windows 10/11</li>
                          <li><strong>Mac App Store:</strong> для macOS</li>
                          <li><strong>Google Play:</strong> для Android</li>
                          <li><strong>App Store:</strong> для iOS</li>
                      </ul>
                      <h4>Версии для скачивания:</h4>
                      <ul>
                          <li><strong>TeamViewer Full:</strong> Полная версия с установкой</li>
                          <li><strong>TeamViewer QuickSupport:</strong> Портативная версия</li>
                          <li><strong>TeamViewer Host:</strong> Для постоянного доступа</li>
                      </ul>
                      <div style="background: rgba(255,152,0,0.1); padding: 15px; border-radius: 8px; margin-top: 15px;">
                          <strong>⚠️ Важно:</strong> В России и Беларуси TeamViewer заблокирован с мая 2022 года. 
                          Для работы может потребоваться VPN.
                      </div>
                  </div>
              `;
              break;
          case 'installation':
              title = 'Установка TeamViewer';
              content = `
                  <div class="installation-content">
                      <h4>Процесс установки:</h4>
                      <ol>
                          <li>Запустите скачанный файл установки</li>
                          <li>Выберите тип установки:
                              <ul>
                                  <li><strong>Установить:</strong> полная установка</li>
                                  <li><strong>Запустить только:</strong> портативный режим</li>
                              </ul>
                          </li>
                          <li>Выберите назначение:
                              <ul>
                                  <li>Личное / некоммерческое использование</li>
                                  <li>Коммерческое использование</li>
                              </ul>
                          </li>
                          <li>Дождитесь завершения установки</li>
                          <li>Запустите TeamViewer</li>
                      </ol>
                      <h4>Права администратора:</h4>
                      <p>Для полной функциональности в Windows может потребоваться запуск от имени администратора.</p>
                  </div>
              `;
              break;
          case 'first-run':
              title = 'Первый запуск TeamViewer';
              content = `
                  <div class="installation-content">
                      <h4>При первом запуске:</h4>
                      <ol>
                          <li>TeamViewer автоматически сгенерирует уникальный ID</li>
                          <li>Будет создан временный пароль</li>
                          <li>Откроется главное окно программы</li>
                      </ol>
                      <h4>Настройка учетной записи:</h4>
                      <ul>
                          <li>Создайте аккаунт TeamViewer (необязательно)</li>
                          <li>Настройте постоянный пароль</li>
                          <li>Добавьте компьютер в список "Мои компьютеры"</li>
                      </ul>
                      <h4>Основные настройки:</h4>
                      <ul>
                          <li><strong>Безопасность:</strong> настройка паролей и доступа</li>
                          <li><strong>Общие:</strong> автозапуск, звуки</li>
                          <li><strong>Удаленное управление:</strong> качество, цвета</li>
                      </ul>
                  </div>
              `;
              break;
          case 'configuration':
              title = 'Настройка TeamViewer';
              content = `
                  <div class="installation-content">
                      <h4>Важные настройки безопасности:</h4>
                      <ul>
                          <li><strong>Постоянный пароль:</strong> для неконтролируемого доступа</li>
                          <li><strong>Двухфакторная аутентификация:</strong> дополнительная защита</li>
                          <li><strong>Белый список:</strong> разрешенные партнеры</li>
                          <li><strong>Черный список:</strong> заблокированные ID</li>
                      </ul>
                      <h4>Настройки производительности:</h4>
                      <ul>
                          <li><strong>Качество:</strong> оптимизация скорости/качество</li>
                          <li><strong>Цвета:</strong> 32-bit, 16-bit, 256 цветов</li>
                          <li><strong>Обои:</strong> скрытие для ускорения</li>
                      </ul>
                      <h4>Корпоративные настройки:</h4>
                      <ul>
                          <li>Групповые политики</li>
                          <li>Централизованное управление</li>
                          <li>Кастомный брендинг</li>
                      </ul>
                  </div>
              `;
              break;
      }
      openModal(title, content);
  }

  // Функция для показа информации о лицензиях
  function showLicenseInfo(license) {
      let title, content;
      switch(license) {
          case 'free':
              title = 'TeamViewer - Бесплатная версия';
              content = `
                  <div class="license-content">
                      <h4>Что включено:</h4>
                      <ul>
                          <li>Удаленный доступ к личным устройствам</li>
                          <li>Передача файлов</li>
                          <li>Чат и VoIP</li>
                          <li>Базовые настройки безопасности</li>
                      </ul>
                      <h4>Ограничения:</h4>
                      <ul>
                          <li>Только для некоммерческого использования</li>
                          <li>Ограничение времени сеанса при подозрении на коммерческое использование</li>
                          <li>Нет приоритетной поддержки</li>
                          <li>Ограниченные возможности управления</li>
                      </ul>
                      <div style="background: rgba(255,152,0,0.1); padding: 15px; border-radius: 8px; margin-top: 15px;">
                          <strong>⚠️ Внимание:</strong> При частом использовании TeamViewer может 
                          заблокировать сеансы, требуя покупки лицензии.
                      </div>
                  </div>
              `;
              break;
          case 'business':
              title = 'TeamViewer Business';
              content = `
                  <div class="license-content">
                      <h4>Стоимость: $50.90/месяц</h4>
                      <h4>Что включено:</h4>
                      <ul>
                          <li>До 3 одновременных сеансов</li>
                          <li>Коммерческое использование</li>
                          <li>Управление пользователями и группами</li>
                          <li>Отчеты о подключениях</li>
                          <li>Приоритетная поддержка</li>
                          <li>Wake-on-LAN</li>
                      </ul>
                      <h4>Дополнительные функции:</h4>
                      <ul>
                          <li>Массовое развертывание</li>
                          <li>Кастомизация интерфейса</li>
                          <li>Интеграция с Active Directory</li>
                          <li>Мобильное управление устройствами</li>
                      </ul>
                  </div>
              `;
              break;
          case 'premium':
              title = 'TeamViewer Premium';
              content = `
                  <div class="license-content">
                      <h4>Стоимость: $90.90/месяц</h4>
                      <h4>Все функции Business плюс:</h4>
                      <ul>
                          <li>До 10 одновременных сеансов</li>
                          <li>Расширенная отчетность</li>
                          <li>Дополнительные каналы поддержки</li>
                          <li>Приоритет в технической поддержке</li>
                      </ul>
                      <h4>Расширенные возможности:</h4>
                      <ul>
                          <li>Ticket система поддержки</li>
                          <li>Сервисные очереди</li>
                          <li>Расширенная аналитика</li>
                          <li>Белый лейбл (частичный)</li>
                      </ul>
                  </div>
              `;
              break;
          case 'corporate':
              title = 'TeamViewer Corporate';
              content = `
                  <div class="license-content">
                      <h4>Стоимость: $134.90/месяц</h4>
                      <h4>Все функции Premium плюс:</h4>
                      <ul>
                          <li>Неограниченное количество сеансов</li>
                          <li>Полный белый лейбл</li>
                          <li>On-premises развертывание</li>
                          <li>Индивидуальные настройки</li>
                          <li>Выделенный менеджер аккаунта</li>
                      </ul>
                      <h4>Корпоративные функции:</h4>
                      <ul>
                          <li>Собственный сервер лицензий</li>
                          <li>Полная кастомизация</li>
                          <li>SLA соглашения</li>
                          <li>Обучение персонала</li>
                      </ul>
                  </div>
              `;
              break;
      }
      openModal(title, content);
  }

  // Функция для показа советов по использованию
  function showUsageTips(category) {
      let title, content;
      switch(category) {
          case 'performance':
              title = 'Советы по производительности';
              content = `
                  <div class="tips-content">
                      <h4>Оптимизация скорости:</h4>
                      <ul>
                          <li>Используйте проводное подключение вместо Wi-Fi</li>
                          <li>Закройте ненужные программы на обоих компьютерах</li>
                          <li>Снизьте качество изображения в настройках</li>
                          <li>Отключите обои и эффекты на удаленном ПК</li>
                          <li>Используйте режим "Оптимизация скорости"</li>
                      </ul>
                      <h4>Настройки качества:</h4>
                      <ul>
                          <li><strong>Высокое качество:</strong> для точной работы</li>
                          <li><strong>Оптимизация скорости:</strong> для медленного интернета</li>
                          <li><strong>Автоматическое качество:</strong> адаптивный режим</li>
                      </ul>
                  </div>
              `;
              break;
          case 'security':
              title = 'Советы по безопасности';
              content = `
                  <div class="tips-content">
                      <h4>Основные правила безопасности:</h4>
                      <ul>
                          <li>Никогда не сообщайте ID и пароль незнакомцам</li>
                          <li>Используйте сложные постоянные пароли</li>
                          <li>Включите двухфакторную аутентификацию</li>
                          <li>Регулярно проверяйте журнал подключений</li>
                          <li>Блокируйте подозрительные ID</li>
                      </ul>
                      <h4>Корпоративная безопасность:</h4>
                      <ul>
                          <li>Используйте белые списки партнеров</li>
                          <li>Настройте групповые политики</li>
                          <li>Ограничьте права доступа пользователей</li>
                          <li>Включите логирование всех действий</li>
                      </ul>
                  </div>
              `;
              break;
          case 'troubleshooting':
              title = 'Решение проблем';
              content = `
                              <div class="tips-content">
                      <h4>Частые проблемы и решения:</h4>
                      <ul>
                          <li><strong>Не удается подключиться:</strong>
                              <ul>
                                  <li>Проверьте интернет-соединение</li>
                                  <li>Убедитесь, что TeamViewer запущен на обоих ПК</li>
                                  <li>Проверьте правильность ID и пароля</li>
                                  <li>Временно отключите антивирус/файрвол</li>
                              </ul>
                          </li>
                          <li><strong>Медленная работа:</strong>
                              <ul>
                                  <li>Снизьте качество изображения</li>
                                  <li>Закройте ненужные программы</li>
                                  <li>Проверьте скорость интернета</li>
                                  <li>Используйте режим "только просмотр"</li>
                              </ul>
                          </li>
                          <li><strong>Проблемы с аудио:</strong>
                              <ul>
                                  <li>Проверьте настройки звука в TeamViewer</li>
                                  <li>Убедитесь, что аудио включено в сеансе</li>
                                  <li>Проверьте драйверы звуковой карты</li>
                              </ul>
                          </li>
                      </ul>
                      <h4>Коды ошибок:</h4>
                      <ul>
                          <li><strong>Timeout:</strong> проблемы с сетью</li>
                          <li><strong>Failed to connect:</strong> неверный ID или блокировка</li>
                          <li><strong>Authentication failed:</strong> неверный пароль</li>
                          <li><strong>Commercial use detected:</strong> нужна платная лицензия</li>
                      </ul>
                  </div>
              `;
              break;
          case 'mobile':
              title = 'Использование мобильной версии';
              content = `
                  <div class="tips-content">
                      <h4>Особенности мобильного управления:</h4>
                      <ul>
                          <li><strong>Жесты управления:</strong>
                              <ul>
                                  <li>Тап - клик левой кнопкой мыши</li>
                                  <li>Долгий тап - клик правой кнопкой</li>
                                  <li>Два пальца - прокрутка</li>
                                  <li>Щипок - масштабирование</li>
                              </ul>
                          </li>
                          <li><strong>Виртуальная клавиатура:</strong> для ввода текста</li>
                          <li><strong>Панель инструментов:</strong> быстрый доступ к функциям</li>
                      </ul>
                      <h4>Советы для работы:</h4>
                      <ul>
                          <li>Используйте Wi-Fi для стабильного соединения</li>
                          <li>Поворачивайте устройство для лучшего обзора</li>
                          <li>Используйте полноэкранный режим</li>
                          <li>Настройте качество под скорость интернета</li>
                      </ul>
                  </div>
              `;
              break;
      }
      openModal(title, content);
  }

  // Функция для показа альтернатив
  function showAlternatives() {
      const title = 'Альтернативы TeamViewer';
      const content = `
          <div class="alternatives-content">
              <h4>Популярные альтернативы:</h4>
              <div class="alternative-item">
                  <h5>🔹 AnyDesk</h5>
                  <p><strong>Плюсы:</strong> высокая скорость, низкая задержка, хорошее качество</p>
                  <p><strong>Минусы:</strong> ограниченный функционал в бесплатной версии</p>
                  <p><strong>Лучше для:</strong> быстрого удаленного доступа</p>
              </div>
              <div class="alternative-item">
                  <h5>🔹 AeroAdmin</h5>
                  <p><strong>Плюсы:</strong> полностью бесплатный, простой интерфейс</p>
                  <p><strong>Минусы:</strong> ограниченный функционал, нет мобильных приложений</p>
                  <p><strong>Лучше для:</strong> простых задач удаленного управления</p>
              </div>
              <div class="alternative-item">
                  <h5>🔹 Chrome Remote Desktop</h5>
                  <p><strong>Плюсы:</strong> бесплатный, интеграция с Google</p>
                  <p><strong>Минусы:</strong> требует Chrome, ограниченные функции</p>
                  <p><strong>Лучше для:</strong> личного использования</p>
              </div>
              <div class="alternative-item">
                  <h5>🔹 Parsec</h5>
                  <p><strong>Плюсы:</strong> отличное качество видео, низкая задержка</p>
                  <p><strong>Минусы:</strong> ориентирован на игры, платные функции</p>
                  <p><strong>Лучше для:</strong> удаленных игр и графических приложений</p>
              </div>        
              <div class="alternative-item">
                  <h5>🔹 RustDesk</h5>
                  <p><strong>Плюсы:</strong> открытый исходный код, самохостинг</p>
                  <p><strong>Минусы:</strong> требует технических знаний</p>
                  <p><strong>Лучше для:</strong> пользователей, ценящих приватность</p>
              </div>
              <h4>Выбор альтернативы зависит от:</h4>
              <ul>
                  <li>Бюджета и требований к функциональности</li>
                  <li>Технических навыков пользователей</li>
                  <li>Требований к безопасности и приватности</li>
                  <li>Планируемого объема использования</li>
              </ul>
          </div>
      `;
      openModal(title, content);
  }

  // Функция для демонстрации настроек
  function showSettingsDemo(category) {
      let title, content;
      switch(category) {
          case 'general':
              title = 'Общие настройки TeamViewer';
              content = `
                  <div class="settings-content">
                      <h4>Основные настройки:</h4>
                      <ul>
                          <li><strong>Запуск TeamViewer с Windows:</strong> автоматический старт</li>
                          <li><strong>Показывать в области уведомлений:</strong> минимизация в трей</li>
                          <li><strong>Звуковые сигналы:</strong> уведомления о событиях</li>
                          <li><strong>Язык интерфейса:</strong> выбор локализации</li>
                      </ul>
                      <h4>Настройки отображения:</h4>
                      <ul>
                          <li><strong>Тема оформления:</strong> светлая/темная тема</li>
                          <li><strong>Размер шрифта:</strong> адаптация под экран</li>
                          <li><strong>Показать дополнительную информацию:</strong> статистика подключения</li>
                      </ul>
                      <h4>Настройки сети:</h4>
                      <ul>
                          <li><strong>Качество соединения:</strong> автоматическое определение</li>
                          <li><strong>Прокси-сервер:</strong> настройка корпоративного прокси</li>
                          <li><strong>Wake-on-LAN:</strong> пробуждение удаленных ПК</li>
                      </ul>
                  </div>
              `;
              break;
          case 'security':
              title = 'Настройки безопасности';
              content = `
                  <div class="settings-content">
                      <h4>Управление доступом:</h4>
                      <ul>
                          <li><strong>Постоянный пароль:</strong> для неконтролируемого доступа</li>
                          <li><strong>Случайный пароль:</strong> генерируется автоматически</li>
                          <li><strong>Подтверждение подключений:</strong> запрос разрешения</li>
                          <li><strong>Время ожидания:</strong> автоматическое отключение</li>
                      </ul>
                      <h4>Двухфакторная аутентификация:</h4>
                      <ul>
                          <li>Привязка к мобильному приложению</li>
                          <li>SMS-коды подтверждения</li>
                          <li>Аппаратные токены</li>
                      </ul>
                      <h4>Белые и черные списки:</h4>
                      <ul>
                          <li><strong>Разрешенные партнеры:</strong> доверенные ID</li>
                          <li><strong>Заблокированные партнеры:</strong> запрещенные ID</li>
                          <li><strong>Правила доступа:</strong> по IP-адресам или группам</li>
                      </ul>
                  </div>
              `;
              break;
          case 'remote-control':
              title = 'Настройки удаленного управления';
              content = `
                  <div class="settings-content">
                      <h4>Качество изображения:</h4>
                      <ul>
                          <li><strong>Автоматическое качество:</strong> адаптация к скорости</li>
                          <li><strong>Оптимизация качества:</strong> лучшее изображение</li>
                          <li><strong>Оптимизация скорости:</strong> быстрая работа</li>
                          <li><strong>Пользовательские настройки:</strong> ручная настройка</li>
                      </ul>
                      <h4>Цветовые режимы:</h4>
                      <ul>
                          <li><strong>32-bit цвета:</strong> максимальное качество</li>
                          <li><strong>16-bit цвета:</strong> компромисс качество/скорость</li>
                          <li><strong>256 цветов:</strong> максимальная скорость</li>
                          <li><strong>Оттенки серого:</strong> минимальный трафик</li>
                      </ul>
                      <h4>Дополнительные опции:</h4>
                      <ul>
                          <li><strong>Скрыть обои:</strong> ускорение работы</li>
                          <li><strong>Показать курсор:</strong> отображение указателя</li>
                          <li><strong>Передача звука:</strong> аудио с удаленного ПК</li>
                          <li><strong>Печать:</strong> удаленная печать документов</li>
                      </ul>
                  </div>
              `;
              break;
      }
      openModal(title, content);
  }

  // Utility функции
  function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
          showNotification('Скопировано в буфер обмена', 'success');
      }).catch(() => {
          showNotification('Ошибка копирования', 'error');
      });
  }
  function showNotification(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.textContent = message;
      notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 20px;
          border-radius: 8px;
          color: white;
          font-weight: 500;
          z-index: 10001;
          opacity: 0;
          transform: translateX(100%);
          transition: all 0.3s ease;
      `;
      switch(type) {
          case 'success':
              notification.style.background = '#4CAF50';
              break;
          case 'error':
              notification.style.background = '#f44336';
              break;
          case 'warning':
              notification.style.background = '#ff9800';
              break;
          default:
              notification.style.background = '#2196F3';
      }
      document.body.appendChild(notification);
      setTimeout(() => {
          notification.style.opacity = '1';
          notification.style.transform = 'translateX(0)';
      }, 100);
      setTimeout(() => {
          notification.style.opacity = '0';
          notification.style.transform = 'translateX(100%)';
          setTimeout(() => {
              document.body.removeChild(notification);
          }, 300);
      }, 3000);
  }

  // Функция для экспорта настроек
  function exportSettings() {
      const settings = {
          timestamp: new Date().toISOString(),
          version: 'TeamViewer Settings Export v1.0',
          settings: {
              general: {
                  language: 'ru',
                  theme: 'dark',
                  autostart: true,
                  notifications: true
              },
              security: {
                  permanentPassword: '••••••••',
                  confirmConnections: true,
                  timeout: 30,
                  twoFactorAuth: false
              },
              display: {
                  quality: 'automatic',
                  colors: '32bit',
                  hideWallpaper: true,
                  showCursor: true
              }
          }
      };
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], {type: 'application/json'});
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
          link.download = `teamviewer-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification('Настройки экспортированы', 'success');
  }
  // Функция для показа статистики использования
  function showUsageStats() {
      const title = 'Статистика использования TeamViewer';
      const content = `
          <div class="stats-content">
              <h4>Глобальная статистика:</h4>
              <div class="stats-grid">
                  <div class="stat-item">
                      <strong>2.5+ миллиардов</strong>
                      <span>Установленных устройств</span>
                  </div>
                  <div class="stat-item">
                      <strong>45+ миллионов</strong>
                      <span>Ежедневных сеансов</span>
                  </div>
                  <div class="stat-item">
                      <strong>600,000+</strong>
                      <span>Корпоративных клиентов</span>
                  </div>
                  <div class="stat-item">
                      <strong>190+</strong>
                      <span>Стран мира</span>
                  </div>
              </div>
              <h4>Популярность по регионам:</h4>
              <ul>
                  <li><strong>Европа:</strong> 35% пользователей</li>
                  <li><strong>Северная Америка:</strong> 28% пользователей</li>
                  <li><strong>Азия:</strong> 25% пользователей</li>
                  <li><strong>Остальные:</strong> 12% пользователей</li>
              </ul>
              <h4>Отрасли использования:</h4>
              <ul>
                  <li>IT поддержка и обслуживание - 40%</li>
                  <li>Образование - 15%</li>
                  <li>Здравоохранение - 12%</li>
                  <li>Производство - 10%</li>
                  <li>Финансы - 8%</li>
                  <li>Прочие - 15%</li>
              </ul>
          </div>
      `;
      openModal(title, content);
  }

  // Функция для показа истории версий
  function showVersionHistory() {
      const title = 'История версий TeamViewer';
      const content = `
          <div class="version-history">
              <h4>Основные версии:</h4>
              <div class="version-item">
                  <h5>TeamViewer 15 (2019)</h5>
                  <ul>
                      <li>Улучшенная безопасность</li>
                      <li>Оптимизация производительности</li>
                      <li>Новый интерфейс</li>
                  </ul>
              </div>
              <div class="version-item">
                  <h5>TeamViewer 14 (2018)</h5>
                  <ul>
                      <li>Поддержка 4K мониторов</li>
                      <li>Улучшенная работа с мобильными устройствами</li>
                      <li>Новые функции безопасности</li>
                  </ul>
              </div>
              <div class="version-item">
                  <h5>TeamViewer 13 (2017)</h5>
                  <ul>
                      <li>Улучшенная скорость соединения</li>
                      <li>Поддержка Linux</li>
                      <li>Новые корпоративные функции</li>
                  </ul>
              </div>
              <div class="version-item">
                  <h5>TeamViewer 12 (2016)</h5>
                  <ul>
                      <li>Поддержка Windows 10</li>
                      <li>Улучшенная мобильная версия</li>
                      <li>Новый дизайн интерфейса</li>
                  </ul>
              </div>
              <h4>Текущая версия: TeamViewer 15</h4>
              <p>Последние обновления включают улучшения безопасности, 
              оптимизацию производительности и новые корпоративные функции.</p>
          </div>
      `;
      openModal(title, content);
  }

  // Функция для показа интеграций
  function showIntegrations() {
      const title = 'Интеграции TeamViewer';
      const content = `
          <div class="integrations-content">
              <h4>CRM системы:</h4>
              <ul>
                  <li><strong>Salesforce:</strong> управление клиентами</li>
                  <li><strong>ServiceNow:</strong> IT Service Management</li>
                  <li><strong>Zendesk:</strong> система тикетов</li>
                  <li><strong>Freshdesk:</strong> служба поддержки</li>
              </ul>
              <h4>Корпоративные системы:</h4>
              <ul>
                  <li><strong>Microsoft Teams:</strong> видеоконференции</li>
                  <li><strong>Slack:</strong> корпоративный мессенджер</li>
                  <li><strong>Active Directory:</strong> управление пользователями</li>
                  <li><strong>SCCM:</strong> развертывание ПО</li>
              </ul>
              <h4>Мониторинг и управление:</h4>
              <ul>
                  <li><strong>RMM решения:</strong> удаленный мониторинг</li>
                  <li><strong>PSA платформы:</strong> автоматизация сервисов</li>
                  <li><strong>ITSM системы:</strong> управление IT-услугами</li>
              </ul>
              <h4>API и разработка:</h4>
              <ul>
                  <li><strong>REST API:</strong> интеграция с приложениями</li>
                  <li><strong>SDK:</strong> разработка собственных решений</li>
                  <li><strong>PowerShell модули:</strong> автоматизация</li>
              </ul>
          </div>
      `;
      openModal(title, content);
  }

  // Функция для проверки совместимости системы
function checkSystemCompatibility() {
    const userAgent = navigator.userAgent;
    let os = 'Неизвестная ОС';
    let compatible = true;
    let recommendations = [];
    
    if (userAgent.includes('Windows')) {
        os = 'Windows';
        if (userAgent.includes('Windows NT 6.1')) {
            recommendations.push('Windows 7 поддерживается, но рекомендуется обновление');
        }
    } else if (userAgent.includes('Mac')) {
        os = 'macOS';
        recommendations.push('Проверьте версию macOS (требуется 10.13+)');
    } else if (userAgent.includes('Linux')) {
        os = 'Linux';
        recommendations.push('Убедитесь, что установлен X11 или Wayland');
    } else if (userAgent.includes('Android')) {
        os = 'Android';
        recommendations.push('Требуется Android 6.0 или новее');
    } else if (userAgent.includes('iOS')) {
        os = 'iOS';
        recommendations.push('Требуется iOS 12.0 или новее');
    }
    
    // Проверка характеристик
    const ram = navigator.deviceMemory ? navigator.deviceMemory + ' ГБ' : 'Неизвестно';
    const cores = navigator.hardwareConcurrency || 'Неизвестно';
    const connection = navigator.connection ? navigator.connection.effectiveType : 'Неизвестно';
    
    const title = 'Проверка совместимости системы';
    const content = `
        <div class="compatibility-check">
            <h4>Информация о системе:</h4>
            <ul>
                <li><strong>Операционная система:</strong> ${os}</li>
                <li><strong>Оперативная память:</strong> ${ram}</li>
                <li><strong>Процессорные ядра:</strong> ${cores}</li>
                <li><strong>Тип соединения:</strong> ${connection}</li>
            </ul>
            
            <div class="compatibility-status ${compatible ? 'compatible' : 'incompatible'}">
                <h4>${compatible ? '✅ Система совместима' : '❌ Возможны проблемы'}</h4>
            </div>
            
            ${recommendations.length > 0 ? `
                <h4>Рекомендации:</h4>
                <ul>
                    ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            ` : ''}
            
            <h4>Минимальные требования:</h4>
            <ul>
                <li>512 МБ ОЗУ</li>
                <li>200 МБ свободного места</li>
                <li>Интернет-соединение от 100 Кбит/с</li>
                <li>Поддержка современных протоколов шифрования</li>
            </ul>
        </div>
    `;
    
    openModal(title, content);
}

// Функция для калькулятора стоимости
function showPricingCalculator() {
    const title = 'Калькулятор стоимости TeamViewer';
    const content = `
        <div class="pricing-calculator">
            <h4>Рассчитайте стоимость лицензии:</h4>
            <form id="pricingForm">
                <div class="form-group">
                    <label>Количество пользователей:</label>
                    <select id="userCount">
                        <option value="1">1 пользователь</option>
                        <option value="3">2-3 пользователя</option>
                        <option value="5">4-5 пользователей</option>
                        <option value="10">6-10 пользователей</option>
                        <option value="20">11-20 пользователей</option>
                        <option value="50">21-50 пользователей</option>
                        <option value="100">50+ пользователей</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Тип использования:</label>
                    <select id="usageType">
                        <option value="personal">Личное использование</option>
                        <option value="business">Бизнес</option>
                        <option value="enterprise">Предприятие</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Необходимые функции:</label>
                    <div class="checkbox-group">
                        <label><input type="checkbox" id="mobileSupport"> Мобильная поддержка</label>
                        <label><input type="checkbox" id="fileTransfer"> Передача файлов</label>
                        <label><input type="checkbox" id="recording"> Запись сеансов</label>
                        <label><input type="checkbox" id="customBranding"> Кастомный брендинг</label>
                        <label><input type="checkbox" id="apiAccess"> Доступ к API</label>
                    </div>
                </div>
                
                <button type="button" onclick="calculatePrice()" class="btn-primary">
                    Рассчитать стоимость
                </button>
            </form>
            
            <div id="calculationResult" style="display: none;">
                <h4>Результат расчета:</h4>
                <div class="price-result">
                    <div class="recommended-plan">
                        <h5 id="recommendedPlan"></h5>
                        <div class="price-display">
                            <span class="price-currency">$</span>
                            <span class="price-amount" id="monthlyPrice"></span>
                            <span class="price-period">/месяц</span>
                        </div>
                        <div class="annual-price">
                            или <span id="annualPrice"></span> в год (скидка 20%)
                        </div>
                    </div>
                    <div class="alternative-plans" id="alternativePlans"></div>
                </div>
            </div>
        </div>
        
        <style>
            .pricing-calculator .form-group {
                margin-bottom: 20px;
            }
            .pricing-calculator label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
            }
            .pricing-calculator select {
                width: 100%;
                padding: 10px;
                border: 1px solid #333;
                background: rgba(255,255,255,0.1);
                color: white;
                border-radius: 5px;
            }
            .checkbox-group label {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
            }
            .checkbox-group input[type="checkbox"] {
                margin-right: 8px;
            }
            .price-result {
                margin-top: 20px;
                padding: 20px;
                background: rgba(197,164,126,0.1);
                border-radius: 10px;
            }
            .recommended-plan {
                text-align: center;
                margin-bottom: 20px;
            }
            .price-display {
                font-size: 2rem;
                font-weight: bold;
                color: #c5a47e;
                margin: 10px 0;
            }
            .annual-price {
                color: #999;
                font-size: 0.9rem;
            }
        </style>
    `;
    
    openModal(title, content);
}

// Функция расчета стоимости
function calculatePrice() {
    const userCount = parseInt(document.getElementById('userCount').value);
    const usageType = document.getElementById('usageType').value;
    
    let basePrice = 0;
    let planName = '';
    
    if (usageType === 'personal') {
        basePrice = 0;
        planName = 'TeamViewer Free';
            } else if (usageType === 'business') {
        if (userCount <= 3) {
            basePrice = 50.90;
            planName = 'TeamViewer Business';
        } else if (userCount <= 10) {
            basePrice = 90.90;
            planName = 'TeamViewer Premium';
        } else {
            basePrice = 134.90;
            planName = 'TeamViewer Corporate';
        }
    } else if (usageType === 'enterprise') {
        basePrice = 134.90;
        planName = 'TeamViewer Corporate';
        if (userCount > 20) {
            basePrice += Math.floor(userCount / 10) * 20;
        }
    }
    
    // Дополнительные функции
    const mobileSupport = document.getElementById('mobileSupport').checked;
    const fileTransfer = document.getElementById('fileTransfer').checked;
    const recording = document.getElementById('recording').checked;
    const customBranding = document.getElementById('customBranding').checked;
    const apiAccess = document.getElementById('apiAccess').checked;
    
    let additionalCost = 0;
    if (customBranding && basePrice < 134.90) additionalCost += 20;
    if (apiAccess && basePrice < 90.90) additionalCost += 15;
    
    const totalMonthly = basePrice + additionalCost;
    const totalAnnual = Math.round(totalMonthly * 12 * 0.8); // 20% скидка за год
    
    // Показать результат
    document.getElementById('recommendedPlan').textContent = planName;
    document.getElementById('monthlyPrice').textContent = totalMonthly.toFixed(2);
    document.getElementById('annualPrice').textContent = `$${totalAnnual}`;
    
    // Альтернативные планы
    let alternatives = '';
    if (planName !== 'TeamViewer Free' && usageType === 'personal') {
        alternatives += '<div class="alt-plan">💡 Рассмотрите бесплатную версию для личного использования</div>';
    }
    if (totalMonthly > 50 && userCount <= 3) {
        alternatives += '<div class="alt-plan">💰 Business план может быть достаточным для ваших нужд</div>';
    }
    
    document.getElementById('alternativePlans').innerHTML = alternatives;
    document.getElementById('calculationResult').style.display = 'block';
}

// Функция для показа учебных материалов
function showLearningResources() {
    const title = 'Обучающие материалы TeamViewer';
    const content = `
        <div class="learning-resources">
            <h4>Официальные ресурсы:</h4>
            <ul>
                <li><strong>Документация:</strong> 
                    <a href="https://www.teamviewer.com/support/" target="_blank">
                        Официальная документация TeamViewer
                    </a>
                </li>
                <li><strong>Видеоуроки:</strong> 
                    <a href="https://www.youtube.com/user/TeamViewer" target="_blank">
                        YouTube канал TeamViewer
                    </a>
                </li>
                <li><strong>Вебинары:</strong> 
                    <a href="https://www.teamviewer.com/events/" target="_blank">
                        Расписание вебинаров
                    </a>
                </li>
            </ul>
            
            <h4>Курсы и сертификация:</h4>
            <ul>
                <li>TeamViewer Certified Professional</li>
                <li>TeamViewer Administrator Course</li>
                <li>TeamViewer Security Best Practices</li>
            </ul>
            
            <h4>Полезные статьи:</h4>
            <ul>
                <li>"Настройка TeamViewer для корпоративного использования"</li>
                <li>"Оптимизация производительности TeamViewer"</li>
                <li>"Лучшие практики безопасности"</li>
                <li>"Интеграция с корпоративными системами"</li>
            </ul>
            
            <h4>Сообщество:</h4>
            <ul>
                <li><strong>Форум:</strong> community.teamviewer.com</li>
                <li><strong>Reddit:</strong> r/teamviewer</li>
                <li><strong>Stack Overflow:</strong> вопросы по API</li>
            </ul>
        </div>
    `;
    
    openModal(title, content);
}

// Функция для показа новостей и обновлений
function showNews() {
    const title = 'Новости TeamViewer';
    const content = `
        <div class="news-content">
            <h4>Последние новости:</h4>
            
            <div class="news-item">
                <h5>🆕 TeamViewer 15.35 - Новые функции безопасности</h5>
                <p><strong>Дата:</strong> Октябрь 2023</p>
                <p>Добавлена поддержка условного доступа, улучшена двухфакторная аутентификация, 
                обновлены алгоритмы шифрования.</p>
            </div>
            
            <div class="news-item">
                <h5>🔒 Блокировка в России и Беларуси</h5>
                <p><strong>Дата:</strong> Май 2022</p>
                <p>TeamViewer прекратил работу в России и Беларуси. Существующие лицензии 
                продолжают работать, но новые не продаются.</p>
            </div>
            
            <div class="news-item">
                <h5>📱 Улучшения мобильных приложений</h5>
                <p><strong>Дата:</strong> Сентябрь 2023</p>
                <p>Обновленный интерфейс для iOS и Android, поддержка новых жестов управления, 
                улучшенная производительность.</p>
            </div>
            
            <div class="news-item">
                <h5>🤖 Интеграция с AI-помощниками</h5>
                <p><strong>Дата:</strong> Август 2023</p>
                <p>Экспериментальная поддержка AI-помощников для автоматизации задач 
                технической поддержки.</p>
            </div>
            
            <h4>Планируемые обновления:</h4>
            <ul>
                <li>Улучшенная поддержка Linux дистрибутивов</li>
                <li>Новые функции для образовательных учреждений</li>
                <li>Расширенная аналитика использования</li>
                <li>Интеграция с облачными платформами</li>
            </ul>
        </div>
    `;
    
    openModal(title, content);
}

// Функция для быстрого теста скорости
function runSpeedTest() {
    const title = 'Тест скорости соединения';
    const content = `
        <div class="speed-test">
            <h4>Проверка скорости интернет-соединения</h4>
            <p>Для комфортной работы TeamViewer рекомендуется:</p>
            <ul>
                <li><strong>Минимум:</strong> 100 Кбит/с</li>
                <li><strong>Рекомендуется:</strong> 1 Мбит/с</li>
                <li><strong>Оптимально:</strong> 5+ Мбит/с</li>
            </ul>
            
            <div class="test-results" id="speedTestResults">
                <div class="test-item">
                    <span class="test-label">Скорость загрузки:</span>
                    <span class="test-value" id="downloadSpeed">Тестирование...</span>
                </div>
                <div class="test-item">
                    <span class="test-label">Скорость отдачи:</span>
                    <span class="test-value" id="uploadSpeed">Тестирование...</span>
                </div>
                <div class="test-item">
                    <span class="test-label">Пинг:</span>
                    <span class="test-value" id="pingValue">Тестирование...</span>
                </div>
                <div class="test-item">
                    <span class="test-label">Рекомендация:</span>
                    <span class="test-recommendation" id="recommendation">Анализ...</span>
                </div>
            </div>
            
            <button onclick="startSpeedTest()" class="btn-primary" id="testButton">
                Запустить тест
            </button>
        </div>
        
        <style>
            .speed-test .test-results {
                margin: 20px 0;
                padding: 20px;
                background: rgba(255,255,255,0.05);
                border-radius: 10px;
            }
            .test-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding: 5px 0;
            }
            .test-label {
                font-weight: 500;
            }
            .test-value {
                color: #c5a47e;
            }
            .test-recommendation {
                color: #4CAF50;
                font-weight: 500;
            }
        </style>
    `;
    
    openModal(title, content);
    
    // Симуляция теста скорости
    setTimeout(() => {
        simulateSpeedTest();
    }, 1000);
}

// Симуляция теста скорости
function simulateSpeedTest() {
    const downloadSpeed = Math.random() * 50 + 5; // 5-55 Мбит/с
    const uploadSpeed = Math.random() * 20 + 2;   // 2-22 Мбит/с
    const ping = Math.random() * 100 + 10;        // 10-110 мс
    
    document.getElementById('downloadSpeed').textContent = `${downloadSpeed.toFixed(1)} Мбит/с`;
    document.getElementById('uploadSpeed').textContent = `${uploadSpeed.toFixed(1)} Мбит/с`;
    document.getElementById('pingValue').textContent = `${ping.toFixed(0)} мс`;
    
    let recommendation = '';
    let recommendationClass = '';
    
    if (downloadSpeed >= 5 && uploadSpeed >= 2 && ping <= 50) {
        recommendation = '✅ Отличное соединение для TeamViewer';
        recommendationClass = 'excellent';
    } else if (downloadSpeed >= 1 && uploadSpeed >= 0.5 && ping <= 100) {
        recommendation = '✅ Хорошее соединение для TeamViewer';
        recommendationClass = 'good';
    } else {
        recommendation = '⚠️ Возможны проблемы с производительностью';
        recommendationClass = 'warning';
    }
    
    const recElement = document.getElementById('recommendation');
    recElement.textContent = recommendation;
    recElement.className = `test-recommendation ${recommendationClass}`;
}

function startSpeedTest() {
    document.getElementById('downloadSpeed').textContent = 'Тестирование...';
    document.getElementById('uploadSpeed').textContent = 'Тестирование...';
    document.getElementById('pingValue').textContent = 'Тестирование...';
    document.getElementById('recommendation').textContent = 'Анализ...';
    document.getElementById('testButton').disabled = true;
    document.getElementById('testButton').textContent = 'Тестирование...';
    
    setTimeout(() => {
        simulateSpeedTest();
        document.getElementById('testButton').disabled = false;
        document.getElementById('testButton').textContent = 'Повторить тест';
    }, 3000);
}

// Функция для генерации QR-кода
function generateQRCode() {
    const title = 'QR-код для быстрого доступа';
    const teamviewerId = 'TV-ID-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const content = `
        <div class="qr-code-generator">
            <h4>QR-код для TeamViewer</h4>
            <p>Сканируйте QR-код мобильным приложением TeamViewer для быстрого подключения</p>
            
            <div class="qr-display">
                <div class="qr-placeholder">
                    <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                        <rect width="200" height="200" fill="white"/>
                        <g fill="black">
                            <!-- Имитация QR-кода -->
                            <rect x="10" y="10" width="60" height="60"/>
                            <rect x="130" y="10" width="60" height="60"/>
                            <rect x="10" y="130" width="60" height="60"/>
                            <rect x="20" y="20" width="40" height="40" fill="white"/>
                            <rect x="140" y="20" width="40" height="40" fill="white"/>
                            <rect x="20" y="140" width="40" height="40" fill="white"/>
                            <rect x="30" y="30" width="20" height="20"/>
                            <rect x="150" y="30" width="20" height="20"/>
                            <rect x="30" y="150" width="20" height="20"/>
                            <!-- Случайный паттерн -->
                            <rect x="90" y="20" width="10" height="10"/>
                            <rect x="110" y="20" width="10" height="10"/>
                            <rect x="90" y="40" width="10" height="10"/>
                            <rect x="100" y="50" width="10" height="10"/>
                            <rect x="80" y="60" width="10" height="10"/>
                            <rect x="120" y="60" width="10" height="10"/>
                            <rect x="90" y="80" width="10" height="10"/>
                            <rect x="110" y="80" width="10" height="10"/>
                            <rect x="80" y="100" width="10" height="10"/>
                            <rect x="100" y="100" width="10" height="10"/>
                            <rect x="120" y="100" width="10" height="10"/>
                            <rect x="90" y="120" width="10" height="10"/>
                        </g>
                    </svg>
                </div>
                <div class="qr-info">
                    <p><strong>ID:</strong> ${teamviewerId}</p>
                    <p><strong>Пароль:</strong> 123456</p>
                    <button onclick="copyToClipboard('${teamviewerId}')" class="btn-secondary">
                        Копировать ID
                    </button>
                </div>
            </div>
        </div>
    `;
    
    openModal(title, content);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация слайдера
    initSlider();
    
    // Инициализация анимаций
    initAnimations();
    
    // Обработчик закрытия модального окна по клику вне его
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
    
    // Обработчик клавиши Escape для закрытия модального окна
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.getElementById('modalOverlay').style.display === 'flex') {
            closeModal();
        }
    });
    
    // Показать кнопку "Наверх" при прокрутке
    window.addEventListener('scroll', function() {
        const scrollButton = document.getElementById('scrollToTop');
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'flex';
        } else {
            scrollButton.style.display = 'none';
        }
    });
});

// Функция плавной прокрутки наверх
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Функция возврата к списку инструментов
function goBackToTools() {
    window.location.href = 'remote-management.html';
}

// Экспорт функций для глобального использования
window.TeamViewerApp = {
    showComparison,
    showInstallationGuide,
    showLicenseInfo,
    showUsageTips,
    showAlternatives,
    showSettingsDemo,
    checkSystemCompatibility,
    showPricingCalculator,
    runSpeedTest,
    generateQRCode,
    copyToClipboard,
    scrollToTop,
    goBackToTools
};
