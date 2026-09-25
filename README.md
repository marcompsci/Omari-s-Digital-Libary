# Omari's Digital Library

An editorial, interactive personal library built as a static website.

## Included

- A searchable, genre-filtered digital bookshelf with book-detail pop-ups.
- Verified cover loading through Open Library, plus custom illustrated book spines.
- A scroll-driven domino shelf entrance and a recommendation page that stores reader suggestions locally.
- Contextual quotes, notes, and expandable summaries for selected titles.
- Two animated desktop pets: a bottom-hopping frog and a welcome-screen Meganeura guardian.

## Run locally

Open `index.html` in a modern browser. For the most reliable cover-image loading, serve the folder with any local static web server.

## Main files

- `index.html` — library home and shelf
- `recommend.html` — book recommendation form and reader shelf
- `app.js` — book catalog, search, filtering, modal behavior, and cover loading
- `book-extras.js` — quotes, notes, and expanded book content
- `pet-engine.js` — frog and Meganeura behavior

## Notes

Book recommendations are stored in the browser’s local storage. Cover images are requested from Open Library when a book is opened.
