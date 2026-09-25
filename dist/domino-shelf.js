const dominoShelf = document.querySelector('#shelfGrid');
const shelfBase = document.querySelector('.shelf-base');
const shelfSection = document.querySelector('.shelf-section');
let dominoStarted = false;
let animationEpoch = 0;
let previousScrollY = window.scrollY;

function resetDomino() {
  dominoStarted = false;
  animationEpoch += 1;
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
  const outsideTransition = bounds.top > window.innerHeight * 1.05 || bounds.bottom < window.innerHeight * .08;
  if (outsideTransition) {
    shelfSection.classList.remove('shelf-preview');
    if (dominoStarted) resetDomino();
    return;
  }
  if (dominoStarted || bounds.top > window.innerHeight * .98) return;

  dominoStarted = true;
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
