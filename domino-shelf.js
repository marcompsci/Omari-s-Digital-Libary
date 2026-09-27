const dominoShelf = document.querySelector('#shelfGrid');
const shelfSection = document.querySelector('.shelf-section');
let dominoPlayed = false;

function playDomino() {
  const bounds = shelfSection.getBoundingClientRect();
  const isApproachingShelf = bounds.top < window.innerHeight * 0.96 && bounds.bottom > 0;

  if (isApproachingShelf && !dominoPlayed) {
    dominoPlayed = true;
    [...dominoShelf.querySelectorAll('.book')].forEach((book, index) => {
      book.style.setProperty('--domino-delay', `${index * 70}ms`);
    });
    dominoShelf.classList.add('is-dominoing');
  }

  // Let the entrance replay after the reader has returned to page one.
  if (bounds.top > window.innerHeight * 1.12) {
    dominoPlayed = false;
    dominoShelf.classList.remove('is-dominoing');
  }
}

window.addEventListener('scroll', playDomino, { passive: true });
window.addEventListener('resize', playDomino);
playDomino();

new MutationObserver(() => {
  if (dominoPlayed) {
    [...dominoShelf.querySelectorAll('.book')].forEach((book, index) => {
      book.style.setProperty('--domino-delay', `${index * 70}ms`);
    });
  }
}).observe(dominoShelf, { childList: true });
