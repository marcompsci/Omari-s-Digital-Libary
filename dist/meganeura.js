const pet = document.createElement('div');
pet.id = 'digital-pet';
pet.className = 'digital-pet meganeura';
pet.setAttribute('aria-label', 'Meganeura monyi digital pet');
pet.innerHTML = '<img src="assets/meganeura-guardian.png" alt=""><i class="pet-glow"></i>';
document.body.append(pet);

let x = window.innerWidth * .5, y = window.innerHeight * .38;
let targetX = x, targetY = y, velocityX = 0, velocityY = 0;
let dragging = false;

function chooseNewDestination() {
  if (dragging) return;
  const margin = 80;
  targetX = margin + Math.random() * Math.max(120, window.innerWidth - margin * 2);
  targetY = margin + Math.random() * Math.max(100, window.innerHeight - margin * 2);
}

function animate(time) {
  if (!dragging) {
    velocityX += (targetX - x) * .0008;
    velocityY += (targetY - y) * .0008;
    velocityX *= .958;
    velocityY *= .958;
    x += velocityX;
    y += velocityY;
  }
  const hoverX = Math.cos(time * .0018) * 3;
  const hoverY = Math.sin(time * .0025) * 8;
  const rotation = Math.max(-14, Math.min(14, velocityX * 1.8));
  const facing = velocityX < 0 ? -1 : 1;
  pet.style.transform = `translate3d(${x - pet.offsetWidth / 2 + hoverX}px,${y - pet.offsetHeight / 2 + hoverY}px,0) rotate(${rotation}deg) scaleX(${facing})`;
  requestAnimationFrame(animate);
}

pet.addEventListener('pointerdown', event => {
  dragging = true; velocityX = 0; velocityY = 0; pet.setPointerCapture(event.pointerId);
});
pet.addEventListener('pointermove', event => {
  if (!dragging) return;
  x = targetX = event.clientX; y = targetY = event.clientY;
});
pet.addEventListener('pointerup', () => { dragging = false; chooseNewDestination(); });
pet.addEventListener('click', () => pet.animate([{ scale: 1 }, { scale: 1.16 }, { scale: .95 }, { scale: 1 }], { duration: 430, easing: 'ease-out' }));
document.addEventListener('pointermove', event => {
  if (!dragging && Math.random() > .978) { targetX = event.clientX; targetY = event.clientY; }
});
window.addEventListener('resize', () => { x = Math.min(innerWidth - 55, Math.max(55, x)); y = Math.min(innerHeight - 55, Math.max(55, y)); targetX = x; targetY = y; });

setInterval(chooseNewDestination, 2000);
chooseNewDestination();
requestAnimationFrame(animate);
