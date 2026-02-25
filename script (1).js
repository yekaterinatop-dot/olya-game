g.style.transform = "translateY(0) scale(1)";
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