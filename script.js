const cardContainer = document.getElementById('cardContainer');
const hologram = document.getElementById('hologram');
const motionButton = document.getElementById('motionButton');

let currentX = 0, currentY = 0;
let targetX = 0, targetY = 0;

// === PC 마우스 이벤트 ===
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

// === 모바일 기울기 이벤트 ===
function enableMotion() {
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
            const { beta, gamma } = e;
            targetX = beta / 5;
            targetY = gamma / 5;
        });
    }
}

// iOS 권한 요청
motionButton.addEventListener('click', async () => {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res === 'granted') {
            motionButton.style.display = 'none';
            enableMotion();
        }
    } else {
        motionButton.style.display = 'none';
        enableMotion();
    }
});

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
