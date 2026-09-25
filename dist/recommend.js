const storageKey = 'omari-library-reader-recommendations';
const colors = ['#355c55', '#ad604b', '#5d4a86', '#a58035', '#8b4551', '#58716b'];
const form = document.querySelector('#recommendForm');
const shelf = document.querySelector('#readerShelf');
const message = document.querySelector('#formMessage');

function getBooks() { try { const saved = JSON.parse(localStorage.getItem(storageKey) || '[]'); return Array.isArray(saved) ? saved.slice(0, 50) : []; } catch { return []; } }
function saveBooks(books) { localStorage.setItem(storageKey, JSON.stringify(books.slice(0, 50))); }
function render() {
  const books = getBooks();
  document.querySelector('#shelfCount').textContent = `${books.length} ${books.length === 1 ? 'title waiting' : 'titles waiting'}`;
  shelf.innerHTML = books.length ? books.map((book, index) => `<article class="suggested-book" style="--color:${colors[index % colors.length]};--height:${62 + (index % 3) * 10}px;--width:${130 + (index % 3) * 22}px;--lift:${index % 2 * 7};--tilt:${index % 2 ? '-1.2deg' : '1.2deg'}" title="${escapeHtml(book.note || 'Recommended by a reader')}"><strong>${escapeHtml(book.title)}</strong><small>${escapeHtml(book.author)}</small></article>`).join('') : '<p class="empty-shelf">The shelf is ready for its first recommendation.</p>';
}
function escapeHtml(value) { return value.replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char])); }
form.addEventListener('submit', event => {
  event.preventDefault();
  const fields = new FormData(form);
  const clean = (value, limit) => String(value || '').trim().replace(/[\u0000-\u001F\u007F]/g, '').slice(0, limit);
  const title = clean(fields.get('title'), 90), author = clean(fields.get('author'), 70), note = clean(fields.get('note'), 220);
  if (!title || !author) return;
  const books = getBooks();
  books.push({ title, author, note });
  saveBooks(books); form.reset(); message.textContent = `“${title}” has found its place on the shelf.`; render();
});
render();
