// Функция для автоматического добавления индикаторов копирования
function initPresetLines() {
    const presetLines = document.querySelectorAll('.preset-line');
    
    presetLines.forEach(line => {
        // Проверяем, есть ли уже индикаторы
        if (!line.querySelector('.copy-indicator')) {
            // Создаем индикатор копирования
            const copyIndicator = document.createElement('span');
            copyIndicator.className = 'copy-indicator';
            copyIndicator.textContent = 'Copied!';
            
            // Создаем иконку копирования
            const copyIcon = document.createElement('span');
            copyIcon.className = 'copy-icon';
            copyIcon.textContent = '📋';
            
            // Добавляем индикаторы в элемент
            line.appendChild(copyIndicator);
            line.appendChild(copyIcon);
            
            // Добавляем обработчик клика
            line.addEventListener('click', function() {
                copyPresetText(this);
            });
        }
    });
}

// Функция для копирования текста пресета
function copyPresetText(element) {
    const text = element.querySelector('p').innerText;
    
    // Используем современный Clipboard API, если доступен
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback(element);
        }).catch(err => {
            // Если не сработало, используем старый метод
            copyUsingExecCommand(text, element);
        });
    } else {
        // Используем старый метод
        copyUsingExecCommand(text, element);
    }
}

function copyUsingExecCommand(text, element) {
    // Создаем временный textarea для копирования
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showCopyFeedback(element);
}

function showCopyFeedback(element) {
    // Показываем индикатор копирования
    const indicator = element.querySelector('.copy-indicator');
    indicator.classList.add('show');
    
    // Меняем стиль блока
    element.classList.add('copied');
    
    // Убираем выделение текста
    window.getSelection().removeAllRanges();

    // Возвращаем исходный стиль через 1 секунды
    setTimeout(() => {
        indicator.classList.remove('show');
        element.classList.remove('copied');
    }, 1000);
}

// Инициализация Swiper и всего остального в одном обработчике
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем preset-line с индикаторами
    initPresetLines();
    
    // Swiper инициализация
    const swipers = document.querySelectorAll('.swiper');
    
    swipers.forEach(swiperElement => {
        if (swiperElement) {
            new Swiper(swiperElement, {
                direction: 'horizontal',
                loop: true,
                pagination: {
                    el: swiperElement.querySelector('.swiper-pagination'),
                    clickable: true,
                },
                navigation: {
                    nextEl: swiperElement.querySelector('.swiper-button-next'),
                    prevEl: swiperElement.querySelector('.swiper-button-prev'),
                },
            });
        }
    });

    // Кнопка "Go to top" - исправленная версия
    const myButton = document.getElementById("myBtn");
    
    if (myButton) {
        function getScrollPosition() {
            return window.pageYOffset || 
                   document.documentElement.scrollTop || 
                   document.body.scrollTop || 
                   0;
        }

        function toggleScrollButton() {
            const scrollTop = getScrollPosition();
            
            if (scrollTop > 100) {
                myButton.style.display = "block";
            } else {
                myButton.style.display = "none";
            }
        }

        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            myButton.style.display = "none";
            
            setTimeout(() => {
                if (getScrollPosition() === 0) {
                    myButton.style.display = "none";
                }
            }, 1000);
        }

        window.addEventListener('scroll', toggleScrollButton);
        myButton.addEventListener('click', scrollToTop);
        
        toggleScrollButton();
    }

    // Остальной код модального окна...
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalPagination = document.getElementById('modalPagination');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    
    let currentImageIndex = 0;
    let images = [];

    // Собираем все изображения из слайдера
    document.querySelectorAll('.swiper-slide img').forEach(function(img) {
        images.push(img.src);
    });

    // Создаем bullets для пагинации
    function createPagination() {
        if (!modalPagination) return;
        
        modalPagination.innerHTML = '';
        images.forEach((_, index) => {
            const bullet = document.createElement('div');
            bullet.className = 'modal-bullet';
            if (index === 0) bullet.classList.add('active');
            bullet.addEventListener('click', () => {
                currentImageIndex = index;
                updateModalImage();
                updateBullets();
            });
            modalPagination.appendChild(bullet);
        });
    }

    // Функция обновления активного bullet
    function updateBullets() {
        if (!modalPagination) return;
        
        const bullets = document.querySelectorAll('.modal-bullet');
        bullets.forEach((bullet, index) => {
            bullet.classList.toggle('active', index === currentImageIndex);
        });
    }

    // Функция обновления изображения в модальном окне
    function updateModalImage() {
        if (modalImg && images[currentImageIndex]) {
            modalImg.src = images[currentImageIndex];
            updateBullets();
        }
    }

    // Функция открытия модального окна
    function openModal(index) {
        if (!modal) return;
        
        currentImageIndex = index;
        modal.style.display = "flex"; // Меняем на flex
        // Блокируем прокрутку на html и body
        document.documentElement.classList.add('modal-open');
        document.body.classList.add('modal-open');
        updateModalImage();
    }

    // Функция закрытия модального окна
    function closeModal() {
        if (!modal) return;
        
        modal.style.display = "none";
        // Разблокируем прокрутку
        document.documentElement.classList.remove('modal-open');
        document.body.classList.remove('modal-open');
    }

    // Функция показа следующего изображения
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateModalImage();
    }

    // Функция показа предыдущего изображения
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateModalImage();
    }

    // Обработчик изменения размера окна
    function handleResize() {
        // При изменении размера окна обновляем позиционирование модального окна
        if (modal && modal.style.display === "flex") {
            // Принудительное обновление позиционирования
            updateModalImage();
        }
    }

    // Инициализация модального окна только если есть элементы
    if (modal && modalImg && images.length > 0) {
        // Создаем пагинацию
        createPagination();
        
        // Добавляем обработчики клика на все изображения в слайдере
        document.querySelectorAll('.swiper-slide img').forEach(function(img, index) {
            img.addEventListener('click', function() {
                openModal(index);
            });
        });

        // Обработчики для кнопок навигации
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                showNextImage();
                e.stopPropagation();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                showPrevImage();
                e.stopPropagation();
            });
        }

        // Закрытие модального окна
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // Закрытие при клике вне изображения
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Предотвращаем закрытие при клике на само изображение
        if (modalImg) {
            modalImg.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }

        // Управление клавиатурой
        document.addEventListener('keydown', function(e) {
            if (modal.style.display === "flex") {
                if (e.key === "Escape") {
                    closeModal();
                } else if (e.key === "ArrowRight") {
                    showNextImage();
                } else if (e.key === "ArrowLeft") {
                    showPrevImage();
                }
            }
        });

        // Добавляем обработчик ресайза
        window.addEventListener('resize', handleResize);
    }
});
