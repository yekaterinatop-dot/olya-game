// 1. Предзагрузка всех спрайтов Оли
const preloadImages = [
    "olya_surprised.png",
    "olya_defend.png",
    "olya_thinking.png",
    "olya_serious.png",
    "olya_story.png",
    "olya_sad.png"
];

preloadImages.forEach(src => {
    const img = new Image();
    img.src = src;
});

const dialogues = {
    1: "Оля... Но для некоторых я просто нелюдимая девочка.",
    2: "Она защищает то, что внутри... То, что нельзя показывать.",
    3: "Они есть, но иногда кажется, что их нет рядом.",
    4: "Всё остальное ты узнаешь на премьере спектакля «Девочка с головой волка»"
};

let currentTypingTimeout;
let clickCount = 0; 
let seenQuestions = new Set();
const music = document.getElementById('bg-music');

// --- ГЛОБАЛЬНЫЙ ЗАПУСК МУЗЫКИ ---
function forceStartMusic() {
    if (music && music.paused) {
        music.play().then(() => {
            music.volume = 0.4;
            document.removeEventListener('click', forceStartMusic);
            document.removeEventListener('touchstart', forceStartMusic);
        }).catch(e => console.log("Ждем касания..."));
    }
}
document.addEventListener('click', forceStartMusic);
document.addEventListener('touchstart', forceStartMusic);

// --- ПЕЧАТЬ ТЕКСТА ---
function typeWriter(text, elementId, speed = 40) {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.textContent = ""; 
    let i = 0;
    clearTimeout(currentTypingTimeout);
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            currentTypingTimeout = setTimeout(type, speed);
        }
    }
    type();
}

// Эффект вспышки
function triggerFlash() {
    const flash = document.getElementById('flash-overlay');
    if (flash) {
        flash.style.backgroundColor = "rgba(255, 0, 0, 0.3)";
        setTimeout(() => { flash.style.backgroundColor = "transparent"; }, 300);
    }
}

// Главная функция выбора ответа
window.showDialogue = function(id) {
    const charImg = document.getElementById('olya-sprite');
    const promoBtn = document.getElementById('secret-promo-btn');
    const siteLink = document.getElementById('site-link');

    typeWriter(dialogues[id], 'dialogue-text', 40);
    hideQuestions();

    if (id >= 1 && id <= 3) seenQuestions.add(id);
    if (seenQuestions.size === 3 && promoBtn) promoBtn.style.display = "block";

    // Смена спрайтов на вопросы
    if (!charImg) return;

    if (id == 1) {
        charImg.src = "olya_thinking.png"; 
        setTimeout(() => { if(clickCount === 0) charImg.src = "character.png"; }, 4000);
    } else if (id == 2) {
        charImg.src = "olya_serious.png";
        setTimeout(() => { if(clickCount === 0) charImg.src = "character.png"; }, 4000);
    } else if (id == 3) {
        charImg.src = "olya_sad.png";
        setTimeout(() => { if(clickCount === 0) charImg.src = "character.png"; }, 4000);
    } else if (id == 4) {
        charImg.src = "olya_story.png";
        if (siteLink) siteLink.classList.add('show');
    }
};

function showQuestions() {
    const questionsContainer = document.querySelector('.choice-buttons');
    if (questionsContainer) {
        questionsContainer.style.display = 'flex';
        typeWriter("Выбери вопрос для Оли:", 'dialogue-text', 30);
    }
}

function hideQuestions() {
    const questionsContainer = document.querySelector('.choice-buttons');
    if (questionsContainer) questionsContainer.style.display = 'none';
}

// Реакция Оли на нажатие (прыжок)
function makeOlyaReact() {
    const charImg = document.getElementById('olya-sprite');
    if (!charImg) return;
    clickCount++; 

    if (clickCount === 3) {
        charImg.src = "olya_defend.png"; 
        triggerFlash();
        typeWriter("Не надо...", 'dialogue-text', 60);
        charImg.style.transition = "transform 0.2s ease-out";
        charImg.style.transform = "translateY(-5px) scale(0.95)";
        setTimeout(() => {
            charImg.src = "character.png";
            charImg.style.transform = "translateY(0) scale(1)";
            clickCount = 0;
        }, 2000); 
    } else {
        charImg.src = "olya_surprised.png";
        charImg.style.transition = "transform 0.1s ease-out";
        charImg.style.transform = "translateY(-30px) scale(1.05)";
        setTimeout(() => {
            if (clickCount < 3 && clickCount !== 0) {
                charImg.src = "character.png";
                charImg.style.transform = "translateY(0) scale(1)";
            }
        }, 300);
    }
}

// --- СТАРТ ПРИ ЗАГРУЗКЕ ---
window.addEventListener('DOMContentLoaded', () => {
    typeWriter("Оля внимательно на тебя смотрит. Нажми на стрелочку, чтобы начать разговор.", 'dialogue-text', 40);

    // Обработка кнопки "Далее"
    const nextBtn = document.getElementById('next-button');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showQuestions();
        });
    }

    // Обработка клика по Оле
    const olyaSprite = document.getElementById('olya-sprite');
    if (olyaSprite) {
        olyaSprite.addEventListener('click', makeOlyaReact);
    }

    // --- ОТКЛЮЧЕНИЕ МУЗЫКИ ПРИ ПЕРЕХОДЕ ПО БАННЕРУ ---
    const siteLink = document.getElementById('site-link');
    if (siteLink) {
        siteLink.addEventListener('click', () => {
            if (music) {
                music.pause();
                console.log("Музыка остановлена пользователем.");
            }
        });
    }

    // Обработка кнопки Mute
    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            if (music) {
                music.muted = !music.muted;
                muteBtn.innerText = music.muted ? "🔇" : "🔊";
            }
        });
    }
});