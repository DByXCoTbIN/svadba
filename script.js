// ===== ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .reveal-rotate').forEach(el => {
        observer.observe(el);
    });
} else {
    // Если пользователь предпочитает уменьшенное движение — показываем всё сразу
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .reveal-rotate').forEach(el => {
        el.classList.add('visible');
    });
}

// ===== ПЛАВАЮЩИЕ СЕРДЕЧКИ =====
(function createFloatingHearts() {
    if (prefersReducedMotion) return;

    const heartsLayer = document.querySelector('.hearts-layer');
    if (!heartsLayer) return;

    const heartSymbols = ['♥', '♡', '❦', '❧'];
    const colors = ['#800020', '#a52a2a', '#b22222', '#cd5c5c', '#bc8f8f', '#d8a0a0'];
    const animations = ['floatUp1', 'floatUp2', 'floatUp3'];

    const spawnHeart = () => {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 16 + 12) + 'px';
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];
        heart.style.animationName = animations[Math.floor(Math.random() * animations.length)];
        heart.style.animationDuration = (Math.random() * 7 + 9) + 's';
        heart.style.animationDelay = (Math.random() * 3) + 's';
        heart.style.animationTimingFunction = 'linear';
        heart.style.animationIterationCount = 'infinite';

        heartsLayer.appendChild(heart);

        // Удаляем сердечко после завершения цикла, чтобы не засорять DOM
        const duration = parseFloat(heart.style.animationDuration) * 1000;
        setTimeout(() => {
            if (heart.parentNode) heart.parentNode.removeChild(heart);
        }, duration + 3000);
    };

    // Создаём начальные сердечки
    for (let i = 0; i < 10; i++) {
        setTimeout(spawnHeart, i * 350);
    }

    // Продолжаем создавать новые
    setInterval(spawnHeart, 2500);
})();

// ===== СЕНСОРНОЕ ВЗАИМОДЕЙСТВИЕ С БЛОКАМИ =====
document.querySelectorAll('.invitation-card, .map-link, .btn-copy, .color-circle').forEach(el => {
    el.addEventListener('touchstart', () => {
        el.classList.add('touched');
    }, { passive: true });
    el.addEventListener('touchend', () => {
        el.classList.remove('touched');
    }, { passive: true });
    el.addEventListener('touchcancel', () => {
        el.classList.remove('touched');
    }, { passive: true });
});

// ===== RIPPLE ЭФФЕКТ ПРИ КАСАНИИ =====
function createRipple(event) {
    const button = event.currentTarget;
    const heart = document.createElement('span');
    heart.classList.add('ripple');

    const rect = button.getBoundingClientRect();
    const x = (event.clientX || rect.left + rect.width / 2);
    const y = (event.clientY || rect.top + rect.height / 2);

    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.position = 'fixed';
    heart.style.zIndex = '9999';

    document.body.appendChild(heart);
    setTimeout(() => {
        if (heart.parentNode) heart.parentNode.removeChild(heart);
    }, 700);
}

document.querySelectorAll('.invitation-card, .map-link, .btn-copy, .color-circle').forEach(el => {
    el.addEventListener('click', createRipple);
});

// ===== КНОПКА КОПИРОВАНИЯ АДРЕСА =====
const copyBtn = document.getElementById('copyAddressBtn');
if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        const address = 'г. Подольск, п. Дубровицы, д. 65А (роспись) / Кафе Парк, пос. Дубровицы (банкет)';
        navigator.clipboard.writeText(address).then(() => {
            const original = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Готово!';
            setTimeout(() => copyBtn.innerHTML = original, 2000);
        }).catch(() => alert('Адрес: ' + address));
    });
}
