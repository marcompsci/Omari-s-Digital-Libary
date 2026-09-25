/* Detail-panel additions are kept separate from the core shelf behavior. */
const extras = document.querySelector('#investorFramework');
const title = document.querySelector('#dialogTitle');

const moneyWorksContent = `
  <section class="money-works-extras" aria-label="Money Works notes">
    <div class="quote-stack">
      <blockquote>“The best weight you’ll ever lose is the weight of other people’s opinion of you.”</blockquote>
      <blockquote>“Financial literacy is a learnable skill schools never taught you.”</blockquote>
      <blockquote>“Overconfidence, not ignorance, is what wrecks financial decisions.”</blockquote>
    </div>
    <details class="book-accordion">
      <summary>Brief summery <span>+</span></summary>
      <div>
        <h3>Key Lessons</h3>
        <h4>1. Mindset and Behavioral Traps</h4>
        <ul>
          <li><strong>The Overconfidence Trap:</strong> Kolapkar highlights the <em>Dunning–Kruger effect</em> in personal finance. A rising market can be mistaken for personal skill, encouraging uncalculated risk.</li>
          <li><strong>Social Comparison:</strong> Spending on status symbols to impress peers can derail long-term wealth generation.</li>
        </ul>
        <h4>2. Structural Budgeting</h4>
        <ul>
          <li><strong>Flip Your Formula:</strong> Replace <em>Income − Expenses = Savings</em> with <strong>Income − Savings = Expenses</strong>. Automate savings first to reduce structural overspending.</li>
          <li><strong>The Three-Jar System:</strong> Divide income immediately among <strong>Expenses</strong>, <strong>Savings</strong>, and <strong>Investments</strong>.</li>
        </ul>
        <h4>3. Defending What You Build</h4>
        <ul>
          <li><strong>The Foundation First:</strong> Build an emergency fund covering 3–6 months of expenses and pay down high-interest debt, such as credit cards or personal loans.</li>
          <li><strong>Insurance vs. Investing:</strong> Keep straightforward risk coverage, such as term life and health insurance, separate from investment accounts.</li>
        </ul>
      </div>
    </details>
    <details class="book-accordion">
      <summary>Brief Investment Strategies <span>+</span></summary>
      <div>
        <p>Kolapkar’s approach favors low-maintenance, high-discipline wealth accumulation over active market timing.</p>
        <dl class="strategy-list">
          <dt>Time Horizon</dt><dd>Focus on long-term compound growth. Starting early with smaller sums can outperform starting later with larger ones.</dd>
          <dt>Asset Allocation</dt><dd>Diversify across mutual funds, broad index funds, real estate, and fixed income.</dd>
          <dt>Trading vs. Investing</dt><dd>Avoid intra-day trading and chasing volatile crypto trends; fast trading can become disguised gambling.</dd>
          <dt>Handling Inflation</dt><dd>Cash kept idle loses purchasing power over time; compounding assets can help address inflation risk.</dd>
          <dt>Risk Guardrails</dt><dd>“If financial returns sound too good to be true, you are the product, not the investor.” Apply extreme skepticism to unregulated high-yield platforms and Ponzi schemes.</dd>
        </dl>
      </div>
    </details>
    <p class="education-note">Educational book notes only — not financial advice.</p>
  </section>`;

const intelligentInvestorContent = `
  <section class="money-works-extras" aria-label="The Intelligent Investor notes">
    <div class="quote-stack">
      <blockquote>“The investor’s chief problem—and even his worst enemy—is likely to be himself.”</blockquote>
      <blockquote>“In the short run, the market is a voting machine, but in the long run, it is a weighing machine.”</blockquote>
      <blockquote>“An investment operation is one which, upon thorough analysis, promises safety of principal and an adequate return. Operations not meeting these requirements are speculative.”</blockquote>
    </div>
    <details class="book-accordion">
      <summary>Why This Matters <span>+</span></summary>
      <div>
        <h4>The Psychology of Investing</h4>
        <p>Financial failure rarely stems from a lack of intelligence or complex analysis. It more often comes from letting panic during a drop or greed during a bull market dictate choices. True investors learn to govern their own impulses before trying to conquer the market.</p>
        <h4>Value vs. Market Sentiment</h4>
        <p>Short-term prices can reflect a popularity contest shaped by hype, fear, and current trends. Over long horizons, the market eventually “weighs” a company’s underlying value, connecting price to earnings and fundamental health.</p>
        <h4>The Definition of True Investing</h4>
        <p>Graham draws a sharp line between investing and gambling. Buying without understanding fundamentals—or risking core capital for the promise of massive returns—is speculation. Protecting the initial capital comes first.</p>
      </div>
    </details>
    <details class="book-accordion">
      <summary>Defensive investor framework <span>+</span></summary>
      <div>
        <p>A practical system inspired by Graham’s principles: automate contributions, evaluate the business behind the price, and require a margin of safety.</p>
        <a href="defensive_investor.py" download>Download the Python framework <span>↓</span></a>
      </div>
    </details>
    <p class="education-note">Educational book notes only — not investment advice.</p>
  </section>`;

const bookNotes = {
  'Let Them Theory': { quotes: [
    ['“If they’re not showing up how you want them to show up, do not try to force them to change; let them be themselves because they are revealing who they are to you. Just let them — and then you get to choose what you do next.”'],
    ['“The Let Them Theory is about freedom. Two simple words — Let Them — will free you from the burden of trying to manage other people. When you stop obsessing over what other people think, say, or do, you finally have the energy to focus on your own life.”'],
    ['“Let them stay, let them go, let them choose — your peace doesn’t depend on their decision.”']
  ] },
  'The Alchemist': { quotes: [
    ['“And, when you want something, all the universe conspires in helping you to achieve it.”'],
    ['“Tell your heart that the fear of suffering is worse than the suffering itself. And that no heart has ever suffered when it goes in search of its dreams.”'],
    ['“The secret of life, though, is to fall seven times and to get up eight times.”']
  ] },
  'Ikigai': { quotes: [
    ['“Those who have a clear sense of purpose live longer.”', 'Why it is powerful', 'Having an inner reason to wake up each morning can be a driving force for mental health and physical survival.'],
    ['“Stop regretting the past and fearing the future. Today is all you have. Make the most of it. Make it worth remembering.”', 'Why it is powerful', 'It is a reminder to release anxiety and anchor yourself in the current moment, the core of daily joy.'],
    ['“Hurry is inversely proportional to quality of life.”', 'Why it is powerful', 'In a culture that glorifies constant busyness, this challenges us to slow down and deepen our appreciation for everyday life.']
  ] },
  'Don’t Believe Everything You Think': { quotes: [
    ['“The thoughts in our minds are not facts.”'],
    ['“Thought is not reality; yet it is through thought that our realities are created.”'],
    ['“As long as you continually remember that we can only ever feel what we’re thinking and that thinking is the root cause of all of our suffering, then you’re free.”']
  ] },
  'Atomic Habits': { quotes: [
    ['“You do not rise to the level of your goals. You fall to the level of your systems.”'],
    ['“Every action you take is a vote for the type of person you wish to become.”'],
    ['“Habits are the compound interest of self-improvement.”']
  ], accordions: [
    ['On Systems vs. Goals', 'Meaning: Goals help choose a general direction. Real progress comes from daily processes and systems. When stress or pressure hits, your routine is what catches you.'],
    ['On Identity and Action', 'Meaning: No single action instantly changes a whole life. Repeated small behaviors build proof and evidence for a new identity; habits show who you believe you are.'],
    ['On Compounding Growth', 'Meaning: Small habits may not look like much today, but repeated over months and years their value multiplies. Getting one percent better each day can add up to massive results.']
  ] },
  'Outliers': { quotes: [
    ['“Practice isn’t the thing you do once you’re good. It’s the thing you do that makes you good.”', 'Meaning', 'Gladwell challenges the myth of innate, overnight talent: mastery is the result of sustained, long-term effort.'],
    ['“Outliers are those who have been given opportunities — and who have had the strength and presence of mind to seize them.”', 'Meaning', 'Success is not only individual grit; it also needs the right breaks, timing, and environment, plus readiness when opportunity arrives.'],
    ['“Who we are cannot be separated from where we’re from.”', 'Meaning', 'Cultural legacies, family backgrounds, and social roots profoundly shape behavior, opportunity, and our paths.']
  ] },
  'The Tipping Point': { quotes: [
    ['“Look at the world around you. It may seem like an immovable, implacable place. It is not. With the slightest push — in just the right place — it can be tipped.”'],
    ['“The tipping point is that magic moment when an idea, trend, or social behavior crosses a threshold, tips, and spreads like wildfire.”'],
    ['“If you want to bring a fundamental change in people’s belief and behavior, you need to create a community around them, where those new beliefs can be practiced and expressed and nurtured.”']
  ] },
  'David and Goliath': { quotes: [
    ['“Gladwell explores how perceived advantages often harbor hidden vulnerabilities, challenging conventional ideas of power.”'],
    ['“The author notes how adversity can serve as an unexpected advantage, fostering true resourcefulness rather than corruption.”'],
    ['“Courage is what you earn when you’ve been through the tough times and you discover they aren’t so tough after all.”']
  ] },
  'It': { quotes: [
    ['“Get a little rock and roll on the radio and go toward all the life there is with all the courage you can find and all the belief you can muster. Be true, be brave, stand. All the rest is darkness.”', 'Meaning', 'A battle cry for life: push past fear and embrace the world with bravery and conviction.'],
    ['“Home is the place where when you go there, you have to finally face the thing in the dark.”', 'Meaning', 'It captures the theme of returning to confront unresolved childhood trauma and the literal and figurative monsters of the past.'],
    ['“Maybe there aren’t any such things as good friends or bad friends — maybe there are just friends, people who stand by you when you’re hurt and who help you feel not so lonely.”', 'Meaning', 'It highlights friendship and human connection as a shield against dark and lonely moments.']
  ] },
  'The Shining': { quotes: [
    ['“Sometimes human places create inhuman monsters.”', 'Meaning', 'Isolated, oppressive environments—and the history embedded within them—can twist ordinary human fragility into something destructive.'],
    ['“The world’s a hard place, Danny. It don’t care. It don’t hate you and me, but it don’t love us, either.”', 'Meaning', 'This captures a chilling indifference and the harsh realities Danny must face in a dangerous world.'],
    ['“The tears that heal are also the tears that scald and scourge.”', 'Meaning', 'Emotional recovery can be agonizing as well as necessary: confronting deep hurt is complex work.']
  ] },
  'Open': { quotes: [
    ['“I’ve been let in on a dirty little secret: winning changes nothing. A win doesn’t feel as good as a loss feels bad, and the good feeling doesn’t last as long as the bad.”', 'Why it is powerful', 'Agassi challenges the idea that external success brings permanent happiness, revealing the emotional toll of competitive pressure.'],
    ['“Of all the games men and women play, tennis is the closest to solitary confinement.”', 'Why it is powerful', 'It captures the psychological isolation of individual sport, where an athlete has no teammates to lean on.'],
    ['“I’ve been cheered by thousands, booed by thousands, but nothing feels as bad as the booing inside your own head.”', 'Why it is powerful', 'Public praise or criticism can pale beside the harsh judgment we direct at ourselves when alone with our thoughts.']
  ] },
  'Dare to Succeed': { quotes: [
    ['“No horse gets anywhere until he is harnessed. No stream or gas ever drives anything until it is confined. No Niagara ever turned light and power until it is tunneled. No life ever grows great until it is focused, dedicated, disciplined.” — Harry Emerson Fosdick.', 'Why it is powerful', 'It illustrates that talent and energy can be wasted without discipline, focus, and dedicated direction.'],
    ['“Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.” — Thomas A. Edison.', 'Why it is powerful', 'Failure is not a permanent state; persistence can turn a temporary hurdle into a next step.'],
    ['“Strive not to be a success, but rather to be of value.” — Albert Einstein.', 'Why it is powerful', 'It shifts attention from superficial rewards toward making a meaningful and lasting impact on others.']
  ] }
  ,
  'The Body Keeps the Score': { quotes: [
    ['“Trauma is not just an event that took place in the past; it is also the imprint left by that experience on mind, brain, and body.”', 'Why it is powerful', 'This explains that trauma can be an ongoing physical and psychological state, not only a memory of a difficult event.'],
    ['“The body keeps the score: If the memory of trauma is encoded in our senses, in muscle tension, and in anxiety, then the body must also be involved in the healing process.”', 'Why it is powerful', 'It highlights the book’s central thesis: healing cannot rely on thought alone; physical awareness and safety are also part of the process.']
  ] }
};

function notesContent(notes) {
  const quotes = notes.quotes.map(([quote, label, meaning]) => `<blockquote>${quote}${meaning ? `<p class="quote-meaning"><strong>${label}:</strong> ${meaning}</p>` : ''}</blockquote>`).join('');
  const accordions = (notes.accordions || []).map(([heading, copy]) => `<details class="book-accordion"><summary>${heading}<span>+</span></summary><div><p>${copy}</p></div></details>`).join('');
  return `<section class="money-works-extras" aria-label="Book quotes and notes"><div class="quote-stack">${quotes}</div>${accordions}</section>`;
}

function renderBookExtras() {
  extras.innerHTML = '';
  if (title.textContent === 'Money Works: The Guide to Financial Literacy') extras.innerHTML = moneyWorksContent;
  else if (title.textContent === 'The Intelligent Investor') extras.innerHTML = intelligentInvestorContent;
  else if (bookNotes[title.textContent]) extras.innerHTML = notesContent(bookNotes[title.textContent]);
}

new MutationObserver(renderBookExtras).observe(title, { childList: true, characterData: true, subtree: true });
