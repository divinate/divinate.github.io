document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.card');
    const logo = document.querySelector('.logo');
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Animate in logo after 1 second
    setTimeout(() => {
        logo.style.animation = 'logoEntrance 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards';
    }, 1000);
    
    function handleMove(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = ((x - centerX) / centerX) * 3;
        const rotateX = -((y - centerY) / centerY) * 3;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    function handleDeviceOrientation(e) {
        // Beta is front-to-back tilt in degrees, gamma is left-to-right tilt in degrees
        const rotateX = -(e.beta - 40) * 0.15;  // Subtract 40 to make the neutral position when phone is held at a natural angle
        const rotateY = e.gamma * 0.15;

        // Clamp values to avoid extreme rotations
        const clampedX = Math.max(Math.min(rotateX, 6), -6);
        const clampedY = Math.max(Math.min(rotateY, 6), -6);

        requestAnimationFrame(() => {
            card.style.transform = `perspective(1000px) rotateX(${clampedX}deg) rotateY(${clampedY}deg)`;
        });
    }

    function resetCard() {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }

    if (isMobile) {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            // iOS 13+ requires permission
            card.addEventListener('touchstart', () => {
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        if (permissionState === 'granted') {
                            window.addEventListener('deviceorientation', handleDeviceOrientation);
                        }
                    })
                    .catch(console.error);
            }, { once: true });
        } else {
            // Android and older iOS
            window.addEventListener('deviceorientation', handleDeviceOrientation);
        }
    } else {
        // Desktop behavior
        card.addEventListener('mousemove', handleMove);
        card.addEventListener('mouseleave', resetCard);
        card.addEventListener('mouseout', resetCard);
    }

    // Add entrance shine effect
    setTimeout(() => {
        const shine = document.createElement('div');
        shine.style.cssText = `
            position: absolute;
            inset: 0;
            background: linear-gradient(105deg, 
                transparent 20%, 
                rgba(255, 255, 255, 0.08) 40%,
                rgba(255, 255, 255, 0.08) 60%,
                transparent 80%
            );
            transform: translateX(-100%);
            animation: shineEntrance 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            pointer-events: none;
            z-index: 1;
        `;
        card.appendChild(shine);
        setTimeout(() => shine.remove(), 1500);
    }, 800);
});
