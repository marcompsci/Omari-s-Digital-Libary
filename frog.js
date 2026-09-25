(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const frog = document.createElement('div');
  frog.className = 'frog-pet';
  frog.setAttribute('aria-hidden', 'true');
  frog.innerHTML = '<img src="assets/digital-frog-pet.png" alt=""><i class="frog-pet__shadow"></i>';
  document.body.append(frog);

  const random = (min, max) => min + Math.random() * (max - min);
  const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  let state = 'IDLE', x = innerWidth * .15, y = innerHeight * .78;
  let lastCorner = '', jump = null, peekUntil = 0, dragging = false, paused = false, lastTime = performance.now();

  const size = () => frog.offsetWidth || 120;
  const bounds = () => ({ w: innerWidth, h: innerHeight, s: size() });
  const chooseCorner = () => {
    const options = corners.filter(corner => corner !== lastCorner);
    lastCorner = options[Math.floor(Math.random() * options.length)];
    return lastCorner;
  };
  function cornerPosition(corner) {
    const { w, h, s } = bounds(), visible = s * .42;
    if (corner === 'top-left') return [visible - s, visible - s, 26];
    if (corner === 'top-right') return [w - visible, visible - s, -26];
    if (corner === 'bottom-left') return [visible - s, h - visible, -12];
    return [w - visible, h - visible, 12];
  }
  function beginJump(toX, toY, after) {
    state = 'JUMPING';
    jump = { fromX: x, fromY: y, toX, toY, height: random(42, 100), duration: random(420, 670), started: performance.now(), after };
  }
  function beginCrossing() {
    if (reduced || dragging || paused) return;
    const { w, h, s } = bounds();
    const fromLeft = x < w / 2, hops = Math.floor(random(3, 7));
    let hopIndex = 0;
    const hop = () => {
      const progress = (++hopIndex) / hops;
      const nextX = fromLeft ? random(w * .2, w * .9) * progress + w * .05 : w - (random(w * .2, w * .9) * progress + w * .05);
      const nextY = random(h * .2, h * .78);
      beginJump(nextX, nextY, hopIndex < hops ? hop : () => beginPeek());
    };
    hop();
  }
  function beginPeek() {
    const corner = chooseCorner();
    const [toX, toY] = cornerPosition(corner);
    beginJump(toX, toY, () => { state = 'PEEKING'; peekUntil = performance.now() + random(2500, 6000); });
  }
  function surprise() {
    if (dragging) return;
    state = 'SURPRISED';
    const lift = y - 45;
    beginJump(x + random(-30, 30), lift, () => { state = 'IDLE'; setTimeout(beginCrossing, 500); });
  }
  function frame(now) {
    const dt = Math.min(34, now - lastTime); lastTime = now;
    if (!paused && !dragging && jump) {
      const elapsed = now - jump.started, t = Math.min(1, elapsed / jump.duration);
      x = jump.fromX + (jump.toX - jump.fromX) * t;
      y = jump.fromY + (jump.toY - jump.fromY) * t - Math.sin(Math.PI * t) * jump.height;
      if (t === 1) { x = jump.toX; y = jump.toY; const after = jump.after; jump = null; after?.(); }
    }
    if (!paused && state === 'PEEKING' && now > peekUntil) { state = 'IDLE'; beginCrossing(); }
    const airborne = jump ? Math.sin(Math.PI * Math.min(1, (now - jump.started) / jump.duration)) : 0;
    const peek = state === 'PEEKING' ? Math.sin(now * .004) * 5 : 0;
    const dx = jump ? jump.toX - jump.fromX : 0;
    const rotation = state === 'PEEKING' ? cornerPosition(lastCorner)[2] + Math.sin(now * .003) * 4 : Math.max(-10, Math.min(10, dx * .025));
    const facing = dx < 0 || lastCorner.endsWith('left') ? -1 : 1;
    const scaleX = 1 + airborne * .13, scaleY = 1 - airborne * .11;
    frog.style.transform = `translate3d(${x - size() / 2 + peek}px,${y - size() / 2}px,0) rotate(${rotation}deg) scaleX(${facing * scaleX}) scaleY(${scaleY})`;
    const shadow = frog.querySelector('.frog-pet__shadow');
    shadow.style.transform = `scale(${1 - airborne * .45})`; shadow.style.opacity = String(.45 - airborne * .3);
    requestAnimationFrame(frame);
  }
  frog.addEventListener('pointerdown', event => { dragging = true; state = 'DRAGGING'; jump = null; frog.setPointerCapture(event.pointerId); });
  frog.addEventListener('pointermove', event => { if (dragging) { x = event.clientX; y = event.clientY; } });
  frog.addEventListener('pointerup', () => { dragging = false; state = 'IDLE'; setTimeout(beginCrossing, 1800); });
  frog.addEventListener('click', surprise);
  document.addEventListener('pointermove', event => { if (!dragging && state === 'IDLE' && Math.hypot(event.clientX - x, event.clientY - y) < 125) beginJump(x + random(-180, 180), y + random(-100, 100), () => beginCrossing()); });
  addEventListener('resize', () => { const { w, h, s } = bounds(); x = Math.min(w - s * .3, Math.max(s * .3, x)); y = Math.min(h - s * .3, Math.max(s * .3, y)); });
  addEventListener('visibilitychange', () => { paused = document.hidden; lastTime = performance.now(); });
  if (reduced) { x = innerWidth - size() * .42; y = innerHeight - size() * .42; } else setTimeout(beginCrossing, 600);
  requestAnimationFrame(frame);
})();
