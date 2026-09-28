# Build "Bookmark Buddyy" — an iOS reading-shelf app (SwiftUI)

You are building a native iPhone app called **Bookmark Buddyy**, the mobile version of my website "Omari's Digital Library": a personal, Goodreads-style bookshelf where my books face the user spine-out on a shelf, open into a detail view, and visitors can recommend books to me.

Build it in **Swift + SwiftUI**, targeting **iOS 17+**, using **SwiftData** for local storage and **CloudKit (public database)** for shared recommendations. Use the `@Observable` macro, no third-party dependencies. Work in small, compiling steps and keep files organized (Models/, Views/, Components/, Data/, Resources/).

---

## 1. Look and feel

Quiet, editorial, library-like. Warm grey paper in light mode, near-black in dark mode. Support both, following the system setting.

Color tokens (create them in the Asset Catalog with light + dark variants):

| Token | Light | Dark |
|---|---|---|
| ground | #ECEAE5 | #161513 |
| ground2 | #E3E0D9 | #1E1C19 |
| ink | #24221E | #EDE9E1 |
| ink2 | #5C5850 | #BDB7AC |
| muted | #8E897F | #8A847A |
| line | #CFCBC2 | #35322D |
| accent | #8A5634 | #D09A70 |
| panel | #F5F3EF | #1F1D1A |
| ledge | #D6D2C9 | #2B2925 |

Typography (bundle these free Google Fonts, SIL Open Font License, and register them in Info.plist):
- **Cormorant Garamond** (italic 400/500): display titles, book titles, quotes.
- **DM Mono** (400/500): small uppercase labels with wide letter spacing (tracking ≈ 0.25–0.4em), chips, buttons.
- **Hanken Grotesk** (400/600): body text.
- Spine fonts: **Playfair Display** 800 ("serif"), **Oswald** 600 uppercase ("cond"), **Archivo Black** uppercase ("heavy"), **Libre Baskerville** ("classic"), Cormorant Garamond italic ("display").

Support Dynamic Type for body text, VoiceOver labels on every book ("Title by Author"), and **Reduce Motion** (skip the animations and show the final state).

---

## 2. Screens

### A. Home (first screen)
- Small uppercase eyebrow: "A PERSONAL ARCHIVE".
- Big italic title **"Bookmark Buddyy"** that types itself in like a typewriter, one character at a time (~85 ms per character, a slightly longer pause on spaces), with a blinking thin caret after it.
- A line in the accent color: "16 VOLUMES" (computed from the data).
- A short line: "What I've read, what shaped how I think about money, habits, and the stories worth staying up for."
- Two pill buttons side by side: **Go to the shelf** (filled ink) and **Recommend a book** (outlined).
- A **small floating recommendations shelf**: a plank that gently bobs up and down (6 s ease-in-out loop) with a soft shadow ellipse under it. Recommended books lie **flat, stacked, spine facing the user** (newest on top, max 8, then "+ N more"). Under it a small accent link: **"Add one"** → Recommend screen.
- Top-left pill button **"My Catalogue"**; top-right round **hamburger** button (three lines that animate into an X).

### B. The Shelf
- Eyebrow "THE SHELF", a search field ("What are you looking for?", italic serif placeholder) that filters by title, author or genre, and a wrapping row of genre chips: All, Finance & Investing, Self-Improvement, Memoir & Sport, Horror, Psychology & Society, Fiction & Fable.
- Below: a **horizontal shelf of book spines** standing on a wooden ledge, bottoms aligned. Each spine is drawn in SwiftUI from the data (no images): the background color with a subtle curved-spine gradient (darker edges, lighter left highlight), vertical title text reading top to bottom, the author in the accent color, a tiny publisher name at the bottom, and a decoration:
  - `bands`: two thin accent lines near the top and the bottom
  - `block`: an accent block over the top 18%
  - `foot`: an accent block over the bottom 12%
  - `rule`: one thin accent rule near the top
  - `dot`: a small accent circle near the top
  - Some spines are slightly tilted (−2.2°).
  - Width and height per book come from the data (points).
- **Signature animation (domino effect):** as the user scrolls from Home down to the Shelf, the books stand up **one by one from left to right, like dominoes**. Each book starts lying on its side (rotated ~88° around its bottom-leading corner, transparent) and swings upright with a slight overshoot, just after the previous one. While this happens, the whole row is **enlarged (~1.5×) and lifted up so it dramatically overlaps the search bar and genre chips**, which dim to ~25% opacity and blur slightly. As the scroll finishes, the books **settle down to normal size onto the ledge**, the ledge grows in from left to right after the last book lands, and the header returns to full focus. The animation is **scrubbed by scroll position** (use `onScrollGeometryChange` / `visualEffect` / `GeometryReader`) so scrolling back up reverses it. On filter changes, spines that remain rise in quickly with a short stagger.
- Pressing and holding (or hovering on iPad/Mac) a spine lifts it slightly and shows a small card with title, author, year · publisher, and genre.
- Tapping a spine opens the Book Detail.

### C. Book Detail
- Transition: the spine **pulls off the shelf and turns into the front cover** (use `matchedGeometryEffect` plus a `rotation3DEffect` on the Y axis from ~78° to 0°), with a blurred backdrop.
- Cover (2:3): original typographic design, not the real cover art. The spine colors, a small uppercase kicker (the subtitle or genre), a simple vector motif drawn with SwiftUI shapes (see `coverMotif` in the data), and at the bottom the title in the spine font plus the author in bold uppercase. Add a darker binding strip on the left edge.
- Info: uppercase kicker "GENRE · YEAR", the title typed in with the typewriter effect (faster, ~34 ms per character), the author in italic accent color (with `authorNote` if present), the description, then:
  - **Quotes**: styled as italic serif blockquotes with an accent left border. If a quote has a `why`, show a small panel under it labeled "WHY IT IS POWERFUL" with that text.
  - **Expandable panels** (pill buttons with a + that turns into −; only one open at a time), shown only when that book has them:
    - **Why This Matters** → `panels.whyThisMatters`
    - **Brief Summary** → `panels.briefSummary`
    - **Brief Investment Strategies** → `panels.briefInvestmentStrategies` (render the markdown table as a clean two-column grid)
  - Facts row: Published (year), First edition (if any), Publisher.
  - Navigation: "← Previous", "Next →", a small "or swipe" hint, and **"Shelve it"** (close).
- **Swipe left/right** between books (within the current filter), with the cover rotating in 3D as it follows the finger and springing back if the swipe is short. Use a paged `TabView` or a custom `DragGesture`.
- Closing reverses the animation back onto the shelf.

### D. My Catalogue
- A separate screen: eyebrow "EVERY BOOK, ONE LIST", typewriter title "My Catalogue", the volume count, and sort chips **Title / Author / Year** (Title ignores a leading "The"; Author sorts by last name).
- Rows: a thin color swatch using the spine colors, the title in serif, the author below, the genre in small uppercase, and the year right-aligned. Tapping a row opens Book Detail.

### E. Recommend a book
- Back link "← Back to the library", eyebrow "PAGE THREE", typewriter title "Recommend a book", and the intro "Tell me what I should read next. Your pick goes on the floating shelf under my library, spine out, for everyone to see."
- Form: Book title (required, ≤ 90 chars), Author (required, ≤ 60), Your name (optional, ≤ 40), Why should I read it? (optional, ≤ 280, with a live "0 / 280" counter), and **Spine color** swatches (8 colors: #7A2E2E, #1F3B5A, #2F5D46, #C9A24A, #E9E3D6, #4A3F6B, #B5562E, #1E1E1E, with a matching readable text color for each).
- A **live preview** of the flat book on a mini plank that updates as they type.
- Submit button "Add it to the shelf" → success state "It's on the shelf." with the buttons "See it on the shelf" and "Recommend another". The new book **drops onto the floating shelf** with a bounce.
- Validation messages in plain language ("Add both the title and the author.").

### F. Hamburger menu
A side sheet from the trailing edge with large serif rows: **Genres** (each with a zero-padded count, for example "02"; tapping one filters the shelf and scrolls to it), then **Browse**: The shelf, My catalogue, Recommended to me, Recommend a book. Stagger the rows in on open.

---

## 3. Data

- Put the book data below into `Resources/books.json` and decode it into a `Book` model (`Codable`, `Identifiable`). Colors are hex strings, so add a `Color(hex:)` helper.
- `Recommendation` is a SwiftData `@Model` with `title`, `author`, `from`, `note`, `colorIndex`, `createdAt`, and `creatorID`.
- **Sync recommendations through CloudKit's public database** so everyone sees the same shelf. Security rules:
  - Each user can create, and edit or delete only **their own** records (use CloudKit's default "creator" security role).
  - Only the app owner can remove anyone's recommendation (an admin check against my iCloud user record ID stored in a config).
  - Limit each user to 10 recommendations and 1 submission every 15 seconds.
  - Trim whitespace, strip control and bidirectional-override characters, and enforce the length limits before saving.
  - Always render user text as plain `Text`, never as markdown or attributed HTML.
- Works offline: the books are bundled, and recommendations show the last synced copy.

---

## 4. Legal / copyright

- Footer on the Catalogue screen: "© {current year} Bookmark Buddyy. All rights reserved." plus: "The app's design, code, descriptions, and cover and spine illustrations are original works owned by Omari. Book titles, author names, and quoted passages belong to their authors and publishers and appear here for commentary. Recommendations are visible to everyone who uses the app."
- Do **not** download or embed real book cover images; covers and spines are drawn in code from the data.

---

## 5. Build order

1. Color tokens, fonts, and the `Book` model with JSON decoding.
2. `SpineView` + `ShelfView` (static), then the scroll-scrubbed domino effect.
3. `BookDetailView` with the cover, quotes, and panels, then the matched-geometry transition and swipe.
4. `HomeView` with the typewriter title, buttons, and navigation.
5. `CatalogueView`, `RecommendView` (SwiftData, local first), then the floating mini shelf.
6. CloudKit sync, security checks, and rate limits.
7. Accessibility, Reduce Motion, dark mode, and iPad layout polish.

After each step, make sure the project builds and show me a SwiftUI preview.

---

## books.json

```json
[
 {
  "title": "The Intelligent Investor",
  "subtitle": "Third Edition",
  "author": "Benjamin Graham",
  "authorNote": "with commentary by Jason Zweig",
  "year": 2024,
  "firstPublished": 1949,
  "genre": "Finance & Investing",
  "publisher": "Harper Business",
  "spine": {
   "title": "Intelligent Investor",
   "author": "Graham",
   "background": "#1D2B45",
   "text": "#F1E7CF",
   "accent": "#C9A45C",
   "fontStyle": "classic",
   "decoration": "bands",
   "widthPt": 60,
   "heightPt": 318,
   "tilted": false
  },
  "coverMotif": "rule",
  "description": "Benjamin Graham's case for investing through analysis instead of emotion, updated with Jason Zweig's chapter-by-chapter commentary for today's markets. This is where Mr. Market, the margin of safety, and the line between investing and speculating come from, and why Warren Buffett keeps pointing people to it.",
  "quotes": [
   "The investor's chief problem—and even his worst enemy—is likely to be himself.",
   "In the short run, the market is a voting machine, but in the long run, it is a weighing machine.",
   "An investment operation is one which, upon thorough analysis, promises safety of principal and an adequate return. Operations not meeting these requirements are speculative."
  ],
  "panels": {
   "whyThisMatters": "## Key Reasons\n- \"The investor's chief problem…\" ### The Psychology of Investing\nFinancial failure rarely stems from a lack of intelligence or complex financial analysis. Instead, it comes from letting emotion, like panic during a market drop or greed during a bull market, dictate your financial choices. True investors conquer their own impulses before trying to conquer the market.\n- \"In the short run, the market is a voting machine…\" ### Value vs. Market Sentiment\nShort-term stock prices merely reflect a popularity contest driven by hype, fear, and current trends. Over long time horizons, however, the market eventually \"weighs\" a company's real underlying value, tying its price directly to actual earnings and fundamental health.\n- \"An investment operation is one which…\" ### The Definition of True Investing\nGraham draws a sharp line between real investing and gambling. If you buy an asset without deeply analyzing its fundamentals, or if you expose your core capital to complete loss for the promise of massive returns, you are speculating. Protecting your initial money is always step number one."
  }
 },
 {
  "title": "Money Works",
  "subtitle": "The Guide to Financial Literacy",
  "author": "Abhijeet Kolapkar",
  "year": 2023,
  "genre": "Finance & Investing",
  "publisher": "Penguin",
  "spine": {
   "title": "Money Works",
   "author": "Kolapkar",
   "background": "#1F4D3A",
   "text": "#F4EFE2",
   "accent": "#E3B23C",
   "fontStyle": "heavy",
   "decoration": "block",
   "widthPt": 36,
   "heightPt": 270,
   "tilted": false
  },
  "coverMotif": "coins",
  "description": "A plain-language primer on personal finance. It walks through budgeting, saving, debt, insurance, and investing, then shows how small, steady decisions add up to real financial freedom. A good first book for anyone who never got this in school.",
  "quotes": [
   "The best weight you'll ever lose is the weight of other people's opinion of you.",
   "Financial literacy is a learnable skill schools never taught you.",
   "Overconfidence, not ignorance, is what wrecks financial decisions."
  ],
  "panels": {
   "briefSummary": "## Key Lessons\n### 1. Mindset and Behavioral Traps\n- **The Overconfidence Trap:** Kolapkar highlights the *Dunning-Kruger effect* in personal finance. Many investors lose money because they mistake a rising market for personal skill, leading to uncalculated risks.\n- **Social Comparison:** Spending money on \"status symbols\" to impress peers is the fastest way to derail wealth generation.\n### 2. Structural Budgeting\n- **Flip Your Formula:** Most people follow the pattern: *Income − Expenses = Savings*. The book advises changing this entirely to: **Income − Savings = Expenses**. By automating savings first, you eliminate structural overspending.\n- **The Three-Jar System:** When income is received, partition it immediately into three destinations: **Expenses** (everyday needs), **Savings** (liquid cash for goals or emergencies), and **Investments** (wealth building for tomorrow).\n### 3. Defending What You Build\n- **The Foundation First:** Before investing a single dollar into the market, you must clear your financial \"gravity\". This requires building an **emergency fund covering 3 to 6 months of living expenses** and aggressively paying down high-interest \"bad debt\" (like credit cards or personal loans) using methods like the debt avalanche.\n- **Insurance vs. Investing:** Kolapkar strongly urges readers never to mix insurance with wealth generation (such as traditional endowment policies). Buy simple **term life and health insurance** solely for risk coverage, and keep investment accounts completely separate.",
   "briefInvestmentStrategies": "Kolapkar's approach favors low-maintenance, high-discipline wealth accumulation over active market-timing.\nStrategy elementThe *Money Works* approach\n| Time Horizon | Focus on long-term compound growth. Starting early at age 25 with smaller sums vastly outperforms starting at 40 with larger amounts. |\n| Asset Allocation | Strategically diversify your capital across mutual funds, diversified index funds, real estate, and fixed income. |\n| Trading vs. Investing | Avoid intra-day trading or chasing volatile crypto trends. The book defines fast trading as disguised gambling rather than wealth creation. |\n| Handling Inflation | Cash left sitting idle in traditional checking accounts loses value over time. Your capital must be put to work in compounding assets to outpace inflation. |\n| Risk Guardrails | \"If financial returns sound too good to be true, you are the product, not the investor.\" The book counsels extreme skepticism toward unregulated high-yield platforms or Ponzi schemes. |"
  }
 },
 {
  "title": "The Let Them Theory",
  "author": "Mel Robbins",
  "year": 2024,
  "genre": "Self-Improvement",
  "publisher": "Hay House",
  "spine": {
   "title": "The Let Them Theory",
   "author": "Mel Robbins",
   "background": "#2F7FD8",
   "text": "#FFFFFF",
   "accent": "#FFD34D",
   "fontStyle": "heavy",
   "decoration": "foot",
   "widthPt": 44,
   "heightPt": 296,
   "tilted": false
  },
  "coverMotif": "burst",
  "description": "Mel Robbins builds a whole way of living on two words. Let other people be who they are, then decide what you'll do next. The book shows how much energy comes back when you stop trying to manage things you were never in control of.",
  "panels": {}
 },
 {
  "title": "Open",
  "subtitle": "An Autobiography",
  "author": "Andre Agassi",
  "year": 2009,
  "genre": "Memoir & Sport",
  "publisher": "Knopf",
  "spine": {
   "title": "Open",
   "author": "Andre Agassi",
   "background": "#F2F0EB",
   "text": "#121212",
   "accent": "#B8322A",
   "fontStyle": "cond",
   "decoration": "rule",
   "widthPt": 50,
   "heightPt": 300,
   "tilted": false
  },
  "coverMotif": "court",
  "description": "Andre Agassi, writing with J. R. Moehringer, gives a candid account of a champion who admits he spent much of his career hating the sport he mastered. It follows a childhood built around a ball machine and a demanding father, the rise on tour, and the long search for a life that felt like his own.",
  "panels": {}
 },
 {
  "title": "The Shining",
  "author": "Stephen King",
  "year": 1977,
  "genre": "Horror",
  "publisher": "Anchor",
  "spine": {
   "title": "The Shining",
   "author": "Stephen King",
   "background": "#131313",
   "text": "#E9E6E0",
   "accent": "#C4232B",
   "fontStyle": "serif",
   "decoration": "dot",
   "widthPt": 50,
   "heightPt": 284,
   "tilted": false
  },
  "coverMotif": "maze",
  "description": "Jack Torrance takes a winter caretaker job at the Overlook Hotel, high in the Colorado Rockies, and brings his wife Wendy and their five-year-old son Danny, who has a gift he doesn't fully understand. Once the snow closes the roads, the hotel begins to take an interest in the family.",
  "panels": {}
 },
 {
  "title": "It",
  "author": "Stephen King",
  "year": 1986,
  "genre": "Horror",
  "publisher": "Scribner",
  "spine": {
   "title": "It",
   "author": "Stephen King",
   "background": "#1A1716",
   "text": "#F2EEE6",
   "accent": "#D8272E",
   "fontStyle": "heavy",
   "decoration": "foot",
   "widthPt": 72,
   "heightPt": 326,
   "tilted": true
  },
  "coverMotif": "boat",
  "description": "In Derry, Maine, seven kids who call themselves the Losers' Club run up against something that has been feeding on the town's children for a very long time. Decades later, one phone call asks them to come home and keep the promise they made.",
  "panels": {}
 },
 {
  "title": "David and Goliath",
  "subtitle": "Underdogs, Misfits, and the Art of Battling Giants",
  "author": "Malcolm Gladwell",
  "year": 2013,
  "genre": "Psychology & Society",
  "publisher": "Little, Brown",
  "spine": {
   "title": "David and Goliath",
   "author": "Gladwell",
   "background": "#F5F3EE",
   "text": "#1B1B1B",
   "accent": "#B0472E",
   "fontStyle": "classic",
   "decoration": "dot",
   "widthPt": 40,
   "heightPt": 292,
   "tilted": false
  },
  "coverMotif": "stone",
  "description": "Gladwell revisits the oldest underdog story there is and asks what we get wrong about advantages. Using stories from classrooms, battlefields, and hospitals, he argues that the things that look like weaknesses can turn into strengths.",
  "panels": {}
 },
 {
  "title": "The Tipping Point",
  "subtitle": "How Little Things Can Make a Big Difference",
  "author": "Malcolm Gladwell",
  "year": 2000,
  "genre": "Psychology & Society",
  "publisher": "Little, Brown",
  "spine": {
   "title": "The Tipping Point",
   "author": "Gladwell",
   "background": "#FBFAF6",
   "text": "#1B1B1B",
   "accent": "#E0592A",
   "fontStyle": "classic",
   "decoration": "rule",
   "widthPt": 36,
   "heightPt": 276,
   "tilted": false
  },
  "coverMotif": "match",
  "description": "Gladwell's first book looks at how ideas, products, and behaviors spread the way epidemics do. He introduces the Law of the Few, the Stickiness Factor, and the Power of Context to explain how small changes can set off very large ones.",
  "panels": {}
 },
 {
  "title": "Outliers",
  "subtitle": "The Story of Success",
  "author": "Malcolm Gladwell",
  "year": 2008,
  "genre": "Psychology & Society",
  "publisher": "Little, Brown",
  "spine": {
   "title": "Outliers",
   "author": "Gladwell",
   "background": "#F3F1EC",
   "text": "#16213A",
   "accent": "#2E6FB0",
   "fontStyle": "cond",
   "decoration": "bands",
   "widthPt": 38,
   "heightPt": 288,
   "tilted": false
  },
  "coverMotif": "dots",
  "description": "Why do some people achieve so much more than everyone else? Gladwell looks past raw talent to the hidden advantages of timing, culture, and opportunity, and makes the case for the 10,000 hours it takes to get truly good at something.",
  "panels": {}
 },
 {
  "title": "The Body Keeps the Score",
  "subtitle": "Brain, Mind, and Body in the Healing of Trauma",
  "author": "Bessel van der Kolk",
  "year": 2014,
  "genre": "Psychology & Society",
  "publisher": "Viking",
  "spine": {
   "title": "The Body Keeps the Score",
   "author": "van der Kolk",
   "background": "#F4F1EA",
   "text": "#161616",
   "accent": "#1F3E9A",
   "fontStyle": "serif",
   "decoration": "block",
   "widthPt": 46,
   "heightPt": 300,
   "tilted": false
  },
  "coverMotif": "pulse",
  "description": "Psychiatrist Bessel van der Kolk draws on decades of clinical work and research to show how overwhelming experiences reshape the brain and stay lodged in the body. He explains the science in plain language, then surveys paths to recovery, from EMDR, yoga, and neurofeedback to theater and the healing power of safe relationships.",
  "quotes": [
   {
    "q": "Trauma is not just an event that took place in the past; it is also the imprint left by that experience on mind, brain, and body.",
    "why": "This quote explains that trauma is an ongoing physical and psychological state, not just a memory of a bad event."
   },
   {
    "q": "The body keeps the score: If the memory of trauma is encoded in our senses, in muscle tension, and in anxiety, then the body must also be involved in the healing process.",
    "why": "It highlights the central thesis of the book: you cannot just talk away trauma with your mind; you must also heal through physical awareness and safety."
   }
  ],
  "panels": {}
 },
 {
  "title": "Atomic Habits",
  "subtitle": "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
  "author": "James Clear",
  "year": 2018,
  "genre": "Self-Improvement",
  "publisher": "Avery",
  "spine": {
   "title": "Atomic Habits",
   "author": "James Clear",
   "background": "#F7F4EC",
   "text": "#141414",
   "accent": "#C79A2C",
   "fontStyle": "cond",
   "decoration": "block",
   "widthPt": 40,
   "heightPt": 282,
   "tilted": false
  },
  "coverMotif": "atom",
  "description": "James Clear's practical system for building good habits and dropping bad ones. His argument is that 1% improvements compound, and he lays out the Four Laws of Behavior Change for making a habit obvious, attractive, easy, and satisfying.",
  "panels": {}
 },
 {
  "title": "Don't Believe Everything You Think",
  "subtitle": "Why Your Thinking Is the Beginning & End of Suffering",
  "author": "Joseph Nguyen",
  "year": 2022,
  "genre": "Self-Improvement",
  "publisher": "Joseph Nguyen",
  "spine": {
   "title": "Don't Believe Everything You Think",
   "author": "Nguyen",
   "background": "#CFE2EE",
   "text": "#10263B",
   "accent": "#10263B",
   "fontStyle": "cond",
   "decoration": "rule",
   "widthPt": 28,
   "heightPt": 262,
   "tilted": false
  },
  "coverMotif": "cloud",
  "description": "Joseph Nguyen argues that most of our suffering starts with how we think about our circumstances rather than the circumstances themselves. It's a short, direct read on telling the difference between having thoughts and getting lost in them.",
  "panels": {}
 },
 {
  "title": "Ikigai",
  "subtitle": "The Japanese Secret to a Long and Happy Life",
  "author": "Héctor García & Francesc Miralles",
  "year": 2017,
  "firstPublished": 2016,
  "genre": "Self-Improvement",
  "publisher": "Penguin Life",
  "spine": {
   "title": "Ikigai",
   "author": "García · Miralles",
   "background": "#FAF6F1",
   "text": "#2A2320",
   "accent": "#D2383F",
   "fontStyle": "serif",
   "decoration": "dot",
   "widthPt": 34,
   "heightPt": 250,
   "tilted": false
  },
  "coverMotif": "sun",
  "description": "Héctor García and Francesc Miralles travel to Okinawa, home to some of the longest-lived people on earth, to learn how they live. The book explores ikigai, the reason you get up in the morning, along with the food, movement, friendships, and sense of flow that go with it.",
  "panels": {}
 },
 {
  "title": "The Alchemist",
  "subtitle": "A Fable About Following Your Dream",
  "author": "Paulo Coelho",
  "year": 1988,
  "genre": "Fiction & Fable",
  "publisher": "HarperOne",
  "spine": {
   "title": "The Alchemist",
   "author": "Paulo Coelho",
   "background": "#D9A441",
   "text": "#2B1A0E",
   "accent": "#7A2E1B",
   "fontStyle": "display",
   "decoration": "bands",
   "widthPt": 30,
   "heightPt": 264,
   "tilted": true
  },
  "coverMotif": "dune",
  "description": "Santiago, a young shepherd from Andalusia, keeps dreaming of treasure buried near the Egyptian pyramids, so he sets out to find it. The people he meets on the way, including a king, a crystal merchant, and an alchemist, teach him to read the omens and listen to his own heart.",
  "panels": {}
 },
 {
  "title": "The Mountain Is You",
  "subtitle": "Transforming Self-Sabotage into Self-Mastery",
  "author": "Brianna Wiest",
  "year": 2020,
  "genre": "Self-Improvement",
  "publisher": "Thought Catalog",
  "spine": {
   "title": "The Mountain Is You",
   "author": "Brianna Wiest",
   "background": "#D8CBB6",
   "text": "#2E2419",
   "accent": "#6B5438",
   "fontStyle": "display",
   "decoration": "rule",
   "widthPt": 34,
   "heightPt": 272,
   "tilted": false
  },
  "coverMotif": "peak",
  "description": "Brianna Wiest makes the case that the biggest obstacle in most lives is internal. The book explains where self-sabotage comes from, what it's quietly protecting you from, and how to build the emotional intelligence to get past it.",
  "panels": {}
 },
 {
  "title": "The Art of Letting Go",
  "subtitle": "Stop Overthinking, Break Negative Cycles, and Embrace Peace",
  "author": "Lucas Hayes",
  "year": 2025,
  "genre": "Self-Improvement",
  "publisher": "Independent",
  "spine": {
   "title": "The Art of Letting Go",
   "author": "Lucas Hayes",
   "background": "#8FA392",
   "text": "#FBFAF5",
   "accent": "#2F3E34",
   "fontStyle": "display",
   "decoration": "foot",
   "widthPt": 30,
   "heightPt": 258,
   "tilted": false
  },
  "coverMotif": "wave",
  "description": "The first book in Lucas Hayes's Overthinking Cure series offers practical tools for quieting a busy mind. It covers spotting negative thought loops, releasing what you can't control, and building routines that make calm your default.",
  "panels": {}
 }
]
```
