const shelfEntryRoot = document.documentElement;

function updateShelfEntry() {
  const viewport = window.innerHeight;
  const start = viewport * 0.32;
  const end = viewport * 0.98;
  const progress = Math.min(Math.max((window.scrollY - start) / (end - start), 0), 1);
  shelfEntryRoot.style.setProperty('--shelf-entry', progress.toFixed(3));
}

window.addEventListener('scroll', updateShelfEntry, { passive: true });
window.addEventListener('resize', updateShelfEntry);
updateShelfEntry();
