const dominoShelf = document.querySelector('#shelfGrid');
const shelfBase = document.querySelector('.shelf-base');
const shelfSection = document.querySelector('.shelf-section');
let dominoStarted = false;
let animationEpoch = 0;
let previousScrollY = window.scrollY;

function resetDomino() {
  dominoStarted = false;
  animationEpoch += 1;
  dominoShelf.classList.remove('is-dominoing');
  dominoShelf.querySelectorAll('.book').forEach(book => book.classList.remove('domino-up'));
  shelfBase.classList.remove('domino-ready');
}

function startDomino() {
  const bounds = dominoShelf.getBoundingClientRect();
  const movingUp = window.scrollY < previousScrollY - 2;
  previousScrollY = window.scrollY;

  // On the return journey only, let the books climb into the hero before the shelf leaves view.
  const inLiftZone = bounds.top > window.innerHeight * .32 && bounds.top < window.innerHeight * 1.04;
  shelfSection.classList.toggle('shelf-preview', movingUp && inLiftZone && dominoStarted);
  // Reset only after returning above the shelf. Never reset after scrolling
  // through page two: that previously made a completed shelf disappear.
  if (bounds.top > window.innerHeight * 1.08) {
    shelfSection.classList.remove('shelf-preview');
    if (dominoStarted) resetDomino();
    return;
  }
  // Begin just before the shelf reaches the viewport, so the domino effect is
  // visible during the transition into page two.
  if (dominoStarted || bounds.top > window.innerHeight * 1.08) return;

  dominoStarted = true;
  dominoShelf.classList.add('is-dominoing');
  const currentEpoch = ++animationEpoch;
  const books = [...dominoShelf.querySelectorAll('.book')];
  books.forEach((book, index) => setTimeout(() => {
    if (currentEpoch === animationEpoch) book.classList.add('domino-up');
  }, 75 * index));
  setTimeout(() => {
    if (currentEpoch === animationEpoch) shelfBase.classList.add('domino-ready');
  }, books.length * 75 + 140);
}

window.addEventListener('scroll', startDomino, { passive: true });
window.addEventListener('resize', startDomino);
startDomino();

new MutationObserver(() => {
  if (dominoStarted) dominoShelf.querySelectorAll('.book').forEach(book => book.classList.add('domino-up'));
}).observe(dominoShelf, { childList: true });
