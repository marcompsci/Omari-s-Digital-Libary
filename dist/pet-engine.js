/* Universal, framework-free desktop pet engine for the site's two canonical PNG pets. */
const PET_DEBUG = false;
const petLayer = document.createElement('div');
petLayer.className = 'pet-engine-layer';
document.body.append(petLayer);
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const rand = (min, max) => min + Math.random() * (max - min);
const pick = items => items[Math.floor(Math.random() * items.length)];
let pointer = { x: -9999, y: -9999, touch: matchMedia('(pointer: coarse)').matches };
let hidden = document.hidden;
document.addEventListener('pointermove', event => { pointer.x = event.clientX; pointer.y = event.clientY; });
document.addEventListener('visibilitychange', () => { hidden = document.hidden; });

class PetEngine {
  constructor(profile) {
    this.p = profile; this.state = 'SPAWNING'; this.lastCorner = ''; this.dragging = false; this.paused = false;
    this.el = document.createElement('div'); this.el.className = `desktop-pet desktop-pet--${profile.id}`;
    const wingLayers = profile.id === 'guardian'
      ? `<span class="guardian-wings" aria-hidden="true"><span class="guardian-wing wing-upper-left"><img src="${profile.src}" alt=""></span><span class="guardian-wing wing-lower-left"><img src="${profile.src}" alt=""></span><span class="guardian-wing wing-upper-right"><img src="${profile.src}" alt=""></span><span class="guardian-wing wing-lower-right"><img src="${profile.src}" alt=""></span></span>`
      : '';
    this.el.innerHTML = `<span class="pet-art"><img src="${profile.src}" alt=""></span>${wingLayers}<i class="pet-shadow"></i>`;
    petLayer.append(this.el); this.shadow = this.el.querySelector('.pet-shadow');
    const saved = JSON.parse(sessionStorage.getItem(`omari-pet-${profile.id}`) || 'null');
    this.x = saved?.x ?? innerWidth * profile.start[0]; this.y = profile.type === 'hop' ? this.groundY() : (saved?.y ?? innerHeight * profile.start[1]);
    this.tx = this.x; this.ty = this.y; this.vx = 0; this.vy = 0; this.until = performance.now() + rand(800, 1600); this.last = performance.now();
    this.el.addEventListener('pointerdown', event => { this.dragging = true; this.state = 'DRAGGING'; this.el.setPointerCapture(event.pointerId); });
    this.el.addEventListener('pointermove', event => { if (this.dragging) { this.x = event.clientX; this.y = this.p.type === 'fly' ? this.topFlightY(event.clientY) : event.clientY; this.tx = this.x; this.ty = this.y; } });
    this.el.addEventListener('pointerup', () => { this.dragging = false; this.state = 'LANDING'; this.until = performance.now() + 1400; this.ty = this.p.type === 'hop' ? this.groundY() : this.topFlightY(this.y + 8); });
    this.el.addEventListener('click', () => this.surprise());
  }
  size() { return this.el.offsetWidth || 110; }
  groundY() { return innerHeight - this.size() * .32; }
  topFlightY(y) { const s = this.size(); return clamp(y, s * .45, Math.max(s * .6, innerHeight * .35)); }
  onLibraryPageTwo() {
    const discovery = document.querySelector('.discovery');
    return Boolean(discovery && discovery.getBoundingClientRect().top < innerHeight * .92);
  }
  welcomeTargets() {
    if (this.p.id !== 'guardian' || scrollY > innerHeight * .55) return [];
    const heading = document.querySelector('.hero h1');
    const textNode = [...(heading?.childNodes || [])].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.includes('Welcome'));
    if (!textNode) return [];
    const range = document.createRange(); range.selectNodeContents(textNode);
    const rect = range.getBoundingClientRect();
    if (!rect.width) return [];
    const y = this.topFlightY(rect.top + rect.height * .15);
    return [[rect.left + rect.width * .035, y], [rect.left + rect.width * .145, y]];
  }
  safePoint() { const s = this.size(), m = s * .55; return [rand(m, innerWidth - m), this.p.type === 'hop' ? this.groundY() : rand(s * .48, Math.max(s * .7, innerHeight * .34))]; }
  corner() { const available = this.p.type === 'hop' ? ['bottom-left','bottom-right'] : ['top-left','top-right']; const all = available.filter(c => c !== this.lastCorner); this.lastCorner = pick(all); const s = this.size() * .42; const x = this.lastCorner.includes('left') ? s - this.size() : innerWidth - s; const y = this.p.type === 'hop' ? this.groundY() : s - this.size(); return [x, y]; }
  moveTo(x, y, state = this.p.type === 'hop' ? 'JUMPING' : 'FLYING', duration = rand(650, 1250)) { this.fromX = this.x; this.fromY = this.y; this.tx = x; this.ty = y; this.state = state; this.movingUntil = performance.now() + duration; this.moveDuration = duration; this.jumpHeight = this.p.type === 'hop' ? rand(34, 105) : rand(8, 35); }
  decide(now) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { this.state = 'EDGE_IDLE'; this.tx = this.p.id === 'frog' ? 55 : innerWidth - 55; this.ty = this.p.id === 'frog' ? innerHeight - 55 : 60; return; }
    const nearCursor = !pointer.touch && Math.hypot(pointer.x - this.x, pointer.y - this.y) < 140;
    if (nearCursor && Math.random() < this.p.curiosity) { this.state = 'OBSERVING'; this.until = now + rand(600, 1300); if (Math.random() > this.p.bravery) { const [x, y] = this.safePoint(); this.moveTo(x, y, this.p.type === 'hop' ? 'FLEEING' : 'FLYING'); } return; }
    const welcomeTargets = this.welcomeTargets();
    if (welcomeTargets.length && Math.random() < .58) { const [x, y] = pick(welcomeTargets); this.moveTo(x, y, 'FLYING', rand(950, 1550)); this.afterMove = 'OBSERVING'; return; }
    const action = Math.random();
    if (action < .17) { const [x, y] = this.corner(); this.moveTo(x, y, this.p.type === 'hop' ? 'JUMPING' : 'FLYING', rand(700, 1400)); this.afterMove = 'PEEKING'; }
    else if (action < .67) { const [x, y] = this.safePoint(); this.moveTo(x, y); }
    else { this.state = Math.random() < this.p.sleepiness ? 'SLEEPING' : 'IDLE'; this.until = now + rand(1000, 5000); }
  }
  surprise() { if (this.dragging) return; this.state = 'SURPRISED'; const [x, y] = [this.x + rand(-35,35), this.p.type === 'hop' ? this.groundY() : this.topFlightY(this.y - 25)]; this.moveTo(x, y, this.p.type === 'hop' ? 'JUMPING' : 'FLYING', 430); }
  update(now) {
    if (hidden) { this.last = now; return; }
    if (this.p.id === 'guardian') {
      this.el.hidden = this.onLibraryPageTwo();
      if (this.el.hidden) { this.last = now; return; }
    }
    const dt = Math.min(35, now - this.last); this.last = now;
    if (!this.dragging && ['JUMPING','FLEEING','FLYING','LANDING','SURPRISED'].includes(this.state)) {
      const progress = clamp(1 - (this.movingUntil - now) / this.moveDuration, 0, 1);
      const eased = progress * (2 - progress); const arc = Math.sin(Math.PI * progress) * this.jumpHeight;
      this.x = this.fromX + (this.tx - this.fromX) * eased; this.y = this.fromY + (this.ty - this.fromY) * eased - arc;
      if (now >= this.movingUntil) { this.x = this.tx; this.y = this.ty; if (this.afterMove === 'PEEKING') { this.afterMove = ''; this.state = 'PEEKING'; this.until = now + rand(2000, 7000); } else { this.state = 'IDLE'; this.until = now + rand(600, 2200); } }
    } else if (!this.dragging && now >= this.until) { if (this.state === 'PEEKING') { this.state = 'RETURNING'; const [x,y] = this.safePoint(); this.moveTo(x,y); } else this.decide(now); }
    const movement = Math.hypot(this.tx - this.x, this.ty - this.y); const facing = this.p.id === 'guardian' ? 1 : (this.tx < this.x ? -1 : 1);
    const airborne = ['JUMPING','FLEEING'].includes(this.state) ? clamp(movement / 250, .12, 1) : 0;
    const peek = this.state === 'PEEKING' ? Math.sin(now * .004) * 6 : 0;
    const tilt = this.p.id === 'guardian' ? 0 : (this.state === 'PEEKING' ? Math.sin(now * .003) * 6 : clamp((this.tx - this.x) * .05, -9, 9));
    const sx = this.p.id === 'guardian' ? 1 : 1 + airborne * .12, sy = this.p.id === 'guardian' ? 1 : 1 - airborne * .1;
    this.el.style.transform = `translate3d(${this.x - this.size()/2 + peek}px,${this.y - this.size()/2}px,0) rotate(${tilt}deg) scaleX(${facing * sx}) scaleY(${sy})`;
    this.shadow.style.transform = `scale(${1 - airborne*.45})`; this.shadow.style.opacity = String(.48 - airborne*.3);
    if (PET_DEBUG) this.el.dataset.state = this.state;
    if (Math.random() < .003) sessionStorage.setItem(`omari-pet-${this.p.id}`, JSON.stringify({ x:this.x, y:this.y }));
  }
}

const pets = [
  new PetEngine({ id:'frog', type:'hop', src:'assets/frog-transparent.png', start:[.16,.8], curiosity:.8, bravery:.45, sleepiness:.3 }),
  new PetEngine({ id:'guardian', type:'fly', src:'assets/guardian-transparent.png', start:[.78,.28], curiosity:.7, bravery:.9, sleepiness:.2 })
];
addEventListener('pagehide', () => pets.forEach(pet => sessionStorage.setItem(`omari-pet-${pet.p.id}`, JSON.stringify({ x:pet.x, y:pet.y }))));
function loop(now) { pets.forEach(pet => pet.update(now)); requestAnimationFrame(loop); }
requestAnimationFrame(loop);
