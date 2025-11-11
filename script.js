const cardContainer = document.getElementById('cardContainer');
const hologram = document.getElementById('hologram');

let currentX = 0, currentY = 0;
let targetX = 0, targetY = 0;

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// === PC 마우스 ===
if (!isMobile) {
    cardContainer.addEventListener('mousemove', (e) => {
        const rect = cardContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        targetX = (y - centerY) / 10;
        targetY = (centerX - x) / 10;

        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        hologram.style.setProperty('--x', percentX + '%');
        hologram.style.setProperty('--y', percentY + '%');
    });

    cardContainer.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
    });
}

// === 모바일 터치 ===
if (isMobile) {
    let isTouching = false;
    let touchStartX = 0;
    let touchStartY = 0;

    cardContainer.addEventListener('touchstart', (e) => {
        isTouching = true;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    cardContainer.addEventListener('touchmove', (e) => {
        if (!isTouching) return;
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;

        const deltaX = touchX - touchStartX;
        const deltaY = touchY - touchStartY;

        targetY += deltaX / 10;
        targetX -= deltaY / 10;

        const rect = cardContainer.getBoundingClientRect();
        const percentX = ((touchX - rect.left) / rect.width) * 100;
        const percentY = ((touchY - rect.top) / rect.height) * 100;
        hologram.style.setProperty('--x', percentX + '%');
        hologram.style.setProperty('--y', percentY + '%');

        touchStartX = touchX;
        touchStartY = touchY;
    });

    cardContainer.addEventListener('touchend', () => {
        isTouching = false;
    });

    // === 기울기 센서 누적 방식 ===
    let lastBeta = null;
    let lastGamma = null;

    function enableMotion() {
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => {
                const { beta, gamma } = e;

                if (lastBeta !== null && lastGamma !== null) {
                    // 변화량 누적
                    const deltaX = beta - lastBeta;
                    const deltaY = gamma - lastGamma;

                    targetX += deltaX / 5; // 민감도
                    targetY += deltaY / 5;
                }

                lastBeta = beta;
                lastGamma = gamma;
            });
        }
    }

    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS
        DeviceOrientationEvent.requestPermission()
            .then(res => { if (res === 'granted') enableMotion(); })
            .catch(console.log);
    } else {
        enableMotion();
    }
}

// === 부드러운 애니메이션 ===
function animate() {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    cardContainer.style.transform = `
        rotateX(${currentX}deg)
        rotateY(${currentY}deg)
        scale3d(1.05, 1.05, 1.05)
    `;
    requestAnimationFrame(animate);
}
animate();

// === 버튼 클릭 하트 ===
document.querySelector('.card-button').addEventListener('click', function() {
    this.style.transform = 'translateZ(30px) scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'translateZ(30px) translateY(-2px)';
    }, 100);

    const buttonRect = this.getBoundingClientRect();
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.textContent = '💖';
    heart.style.left = (buttonRect.left + buttonRect.width / 2 - 10) + 'px';
    heart.style.top = (buttonRect.top + buttonRect.height / 2) + 'px';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2000);
});
