import React, { useEffect, useMemo, useState } from 'react'

// ---------- card data ----------

const DECKS = [
  { id: 'javascript', name: 'JavaScript', icon: 'js', accent: '#b45309' },
  { id: 'react', name: 'React', icon: 'react', accent: '#0369a1' },
  { id: 'css', name: 'CSS', icon: 'css', accent: '#6d28d9' },
  { id: 'html', name: 'HTML & Web', icon: 'html', accent: '#166534' },
]

const CARDS = [
  // JavaScript
  { id: 'js1', deck: 'javascript', q: 'What is the difference between let, const and var?', a: 'var is function-scoped and hoisted with undefined. let and const are block-scoped and sit in the temporal dead zone until declared. const also prevents rebinding (but not mutation of objects).' },
  { id: 'js2', deck: 'javascript', q: 'Explain event delegation.', a: 'Attach one listener to a parent instead of many to children. Events bubble up, so the parent handler uses event.target to find the real source. Fewer listeners, works for dynamically added children.' },
  { id: 'js3', deck: 'javascript', q: 'What is a closure?', a: 'A function that remembers variables from the scope where it was created, even after that scope has finished executing. Used for data privacy, factories and callbacks.' },
  { id: 'js4', deck: 'javascript', q: 'What does "this" refer to?', a: 'Depends on the call site: a method call binds the object, a plain function call binds undefined (strict) or window, call/apply/bind set it explicitly, and arrow functions inherit it from the surrounding scope.' },
  { id: 'js5', deck: 'javascript', q: 'map vs forEach?', a: 'map returns a new array with transformed items; forEach returns undefined and is used for side effects. If you are not using the result, you probably want forEach.' },
  { id: 'js6', deck: 'javascript', q: 'What is the event loop?', a: 'The model that lets JS handle async work on one thread: run the call stack, then drain the microtask queue (promises), then take the next macrotask (setTimeout, I/O). That is why promise callbacks run before timeouts.' },
  { id: 'js7', deck: 'javascript', q: 'null vs undefined?', a: 'undefined means "declared but never assigned" (also missing properties/returns). null is an explicit "no value" set by the programmer. typeof null is "object" - a famous historical bug.' },
  { id: 'js8', deck: 'javascript', q: 'What do call, apply and bind do?', a: 'All set "this" for a function. call invokes with args listed one by one, apply takes an array, bind returns a new function with "this" fixed without calling it yet.' },
  { id: 'js9', deck: 'javascript', q: 'What is destructuring?', a: 'Unpacking values from arrays or properties from objects into variables: const { name, age = 18 } = user. Works with defaults, renaming (name: userName) and nesting.' },
  { id: 'js10', deck: 'javascript', q: 'What are Promises and async/await?', a: 'A Promise represents a future value (pending, fulfilled, rejected). async/await is syntax over promises: await pauses the function until the promise settles, try/catch handles rejections.' },
  { id: 'js11', deck: 'javascript', q: 'What is the spread operator used for?', a: 'Expanding iterables: copying arrays/objects ([...arr], {...obj}), merging, and passing elements as arguments. It makes shallow copies - nested objects are still shared.' },
  { id: 'js12', deck: 'javascript', q: '== vs ===?', a: '== compares after type coercion ("5" == 5 is true). === compares value AND type with no coercion. Always use === unless you intentionally want coercion.' },
  // React
  { id: 'rc1', deck: 'react', q: 'What are React hooks and their rules?', a: 'Functions that let components use state and lifecycle features (useState, useEffect...). Rules: only call them at the top level, never in loops/conditions, and only inside React functions.' },
  { id: 'rc2', deck: 'react', q: 'What does useEffect do and when does it run?', a: 'Runs side effects after render. The dependency array controls re-runs: [] once on mount, [x] when x changes, none means after every render. Return a cleanup function for subscriptions/timers.' },
  { id: 'rc3', deck: 'react', q: 'What are keys in lists and why not use index?', a: 'Keys let React match items between renders. Index keys break when the list reorders or filters: state can stick to the wrong row. Use a stable unique id.' },
  { id: 'rc4', deck: 'react', q: 'Controlled vs uncontrolled components?', a: 'Controlled: form value lives in React state and updates onChange - single source of truth. Uncontrolled: the DOM holds the value, read via ref when needed.' },
  { id: 'rc5', deck: 'react', q: 'What is lifting state up?', a: 'When two components need the same data, move the state to their closest common parent and pass it down with props. Keeps siblings in sync.' },
  { id: 'rc6', deck: 'react', q: 'useMemo and useCallback - what for?', a: 'Memoization. useMemo caches a computed value until dependencies change; useCallback caches a function identity. Useful for expensive calculations and stable props, not everywhere by default.' },
  { id: 'rc7', deck: 'react', q: 'What is the Context API?', a: 'A way to share values (theme, user, locale) deep down the tree without prop drilling. createContext, a Provider above, and useContext below. Not a state manager by itself.' },
  { id: 'rc8', deck: 'react', q: 'What happens when state updates?', a: 'React re-renders that component and its children, batches multiple setState calls in one event into a single render, and updates the DOM with a diff of the previous output.' },
  { id: 'rc9', deck: 'react', q: 'What is prop drilling and how do you avoid it?', a: 'Passing props through many layers that do not use them. Avoid with composition (children), Context, or moving state closer to where it is used.' },
  { id: 'rc10', deck: 'react', q: 'What does the cleanup function in useEffect do?', a: 'Runs before the effect re-runs and on unmount. Used to unsubscribe, clear intervals and cancel fetches so nothing leaks or updates an unmounted component.' },
  // CSS
  { id: 'cs1', deck: 'css', q: 'Explain the box model.', a: 'Every element is content + padding + border + margin. box-sizing: border-box makes width include padding and border, which is why everyone sets it globally.' },
  { id: 'cs2', deck: 'css', q: 'Flexbox vs Grid - when do you pick each?', a: 'Flexbox for one-dimensional layouts (a row or a column of things, like navbars). Grid for two-dimensional layouts (rows AND columns, like page layouts and card galleries).' },
  { id: 'cs3', deck: 'css', q: 'How does position work (static, relative, absolute, fixed, sticky)?', a: 'relative offsets from normal flow; absolute positions against the nearest positioned ancestor and leaves the flow; fixed pins to the viewport; sticky scrolls normally until it hits a threshold, then sticks.' },
  { id: 'cs4', deck: 'css', q: 'What is specificity?', a: 'The rule that decides which style wins: inline > #id > .class / [attr] / :pseudo-class > element. Equal specificity? The later rule wins. Avoid !important - it breaks the whole system.' },
  { id: 'cs5', deck: 'css', q: 'How do you center a div?', a: 'display: grid; place-items: center on the parent (modern favorite). Or flexbox: justify-content + align-items. Or absolute + translate for overlays.' },
  { id: 'cs6', deck: 'css', q: 'What are media queries and mobile-first?', a: 'Media queries apply styles under conditions like min-width. Mobile-first means styling the small screen first, then adding min-width breakpoints for larger screens - cleaner and faster on phones.' },
  { id: 'cs7', deck: 'css', q: 'em vs rem vs px?', a: 'px is fixed. rem is relative to the root font size (predictable, great for spacing/typography). em is relative to the current element font size and compounds in nested elements.' },
  { id: 'cs8', deck: 'css', q: 'What are pseudo-classes and pseudo-elements?', a: 'Pseudo-classes select states: :hover, :focus, :nth-child(). Pseudo-elements style parts of an element: ::before, ::after, ::placeholder. One colon for classes, two for elements.' },
  { id: 'cs9', deck: 'css', q: 'What is z-index and stacking context?', a: 'z-index orders overlapping elements, but only within a stacking context. Transforms, opacity < 1 and position + z-index all create new contexts - which is why a huge z-index sometimes does nothing.' },
  // HTML & Web
  { id: 'ht1', deck: 'html', q: 'Why does semantic HTML matter?', a: 'Tags like header, nav, main, article and button carry meaning: screen readers navigate by them, SEO reads structure, and you get keyboard behavior for free. Divs mean nothing.' },
  { id: 'ht2', deck: 'html', q: 'localStorage vs sessionStorage vs cookies?', a: 'localStorage persists until cleared (~5MB, per origin). sessionStorage dies with the tab. Cookies are small, can be httpOnly/secure, and travel with every request to the server.' },
  { id: 'ht3', deck: 'html', q: 'What happens when you type a URL and press Enter?', a: 'DNS lookup, TCP connection, TLS handshake, HTTP request, server response, then the browser parses HTML, builds DOM + CSSOM, runs JS, and paints. Follow-ups: caching, render blocking.' },
  { id: 'ht4', deck: 'html', q: 'defer vs async on script tags?', a: 'Both download without blocking HTML parsing. async executes as soon as it downloads (order not guaranteed). defer waits for parsing to finish and keeps order - the safe default.' },
  { id: 'ht5', deck: 'html', q: 'What is accessibility (a11y) and quick wins?', a: 'Making the web usable for everyone. Quick wins: alt text, labels on inputs, keyboard focus states, sufficient contrast, semantic tags, and aria attributes only when native HTML falls short.' },
  { id: 'ht6', deck: 'html', q: 'What is CORS?', a: 'A browser security rule: a page can only call APIs on other origins if the server sends Access-Control-Allow-Origin headers. It is enforced by the browser, not the server - that is why curl works but fetch fails.' },
  { id: 'ht7', deck: 'html', q: 'GET vs POST?', a: 'GET reads data, is cacheable, and puts params in the URL. POST creates/changes things, carries a body, and should not be cached or repeated blindly. Use the right verb - APIs and browsers behave differently for each.' },
  { id: 'ht8', deck: 'html', q: 'What is responsive design?', a: 'One site that adapts to any screen: fluid grids, flexible images, media queries and relative units. Test from the smallest phone up, not the desktop down.' },
]

// ---------- spaced repetition engine (SM-2 lite) ----------

const DAY = 24 * 60 * 60 * 1000
const NEW_PER_SESSION = 8
const LS_KEY = 'dev-quiz-cards:v1'

const freshCardState = () => ({ reps: 0, ease: 2.5, interval: 0, due: 0, seen: false, grades: { again: 0, hard: 0, good: 0, easy: 0 } })

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { cards: {}, days: [] }
}

function gradeCard(s, grade) {
  const next = { ...s, seen: true, grades: { ...s.grades, [grade]: s.grades[grade] + 1 } }
  if (grade === 'again') {
    next.reps = 0
    next.interval = 10 / (60 * 24) // 10 minutes
    next.ease = Math.max(1.3, next.ease - 0.2)
  } else if (grade === 'hard') {
    next.reps = s.reps + 1
    next.interval = Math.max(1, (s.interval || 1) * 1.2)
    next.ease = Math.max(1.3, next.ease - 0.15)
  } else if (grade === 'good') {
    next.reps = s.reps + 1
    next.interval = s.reps === 0 ? 1 : Math.max(1, s.interval * s.ease)
  } else {
    next.reps = s.reps + 1
    next.interval = s.reps === 0 ? 4 : Math.max(2, s.interval * s.ease * 1.3)
    next.ease = next.ease + 0.15
  }
  next.due = Date.now() + next.interval * DAY
  return next
}

const fmtInterval = (days) => {
  if (days < 1) return `${Math.round(days * 24 * 60)}m`
  if (days < 30) return `${Math.round(days)}d`
  return `${Math.round(days / 30)}mo`
}

// ---------- components ----------

function Wordmark() {
  return (
    <div className="font-display text-2xl font-semibold tracking-tight text-ink">
      Dev Quiz <span className="text-ember">Cards</span>
    </div>
  )
}

function StatChip({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/70 px-4 py-3 text-center shadow-sm ring-1 ring-ink/5">
      <div className="font-display text-2xl font-semibold text-ink">{value}</div>
      <div className="text-xs font-medium uppercase tracking-wide text-ink/50">{label}</div>
    </div>
  )
}

function Home({ state, onStart }) {
  const now = Date.now()
  const perDeck = useMemo(() => DECKS.map((d) => {
    const cards = CARDS.filter((c) => c.deck === d.id)
    const seen = cards.filter((c) => state.cards[c.id]?.seen)
    const due = cards.filter((c) => state.cards[c.id]?.seen && state.cards[c.id].due <= now)
    const mastered = cards.filter((c) => (state.cards[c.id]?.interval || 0) >= 21)
    return { ...d, total: cards.length, seen: seen.length, due: due.length, mastered: mastered.length }
  }), [state, now])

  const totalDue = perDeck.reduce((s, d) => s + d.due, 0)
  const totalNew = perDeck.reduce((s, d) => s + (d.total - d.seen), 0)
  const totalSeen = perDeck.reduce((s, d) => s + d.seen, 0)
  const totalMastered = perDeck.reduce((s, d) => s + d.mastered, 0)
  const allGrades = Object.values(state.cards).reduce((acc, c) => {
    Object.entries(c.grades || {}).forEach(([k, v]) => (acc[k] = (acc[k] || 0) + v))
    return acc
  }, {})
  const totalGraded = Object.values(allGrades).reduce((a, b) => a + b, 0)
  const accuracy = totalGraded ? Math.round((((allGrades.good || 0) + (allGrades.easy || 0)) / totalGraded) * 100) : null
  const streak = useMemo(() => {
    const days = new Set(state.days || [])
    let n = 0
    const t = new Date()
    if (!days.has(t.toDateString())) t.setDate(t.getDate() - 1)
    while (days.has(t.toDateString())) {
      n++
      t.setDate(t.getDate() - 1)
    }
    return n
  }, [state.days])

  return (
    <div className="anim-deal mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="flex items-center justify-between">
        <Wordmark />
        <div className="text-sm font-medium text-ink/50">frontend interview prep</div>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-ember to-[#9a3412] p-8 text-paper shadow-lg">
        <h1 className="font-display text-4xl font-semibold leading-tight">
          {totalDue > 0 ? `${totalDue} card${totalDue === 1 ? '' : 's'} due today` : totalNew > 0 ? (totalSeen === 0 ? 'Ready to start your first session?' : 'All caught up. Learn something new?') : 'Deck fully mastered. Impressive.'}
        </h1>
        <p className="mt-2 max-w-lg text-paper/80">
          A spaced-repetition engine schedules every review for you. Grade each card honestly and it comes back exactly when you are about to forget it.
        </p>
        <button
          onClick={onStart}
          disabled={totalDue === 0 && totalNew === 0}
          className="mt-5 rounded-2xl bg-paper px-8 py-3.5 font-semibold text-ember shadow-md transition hover:brightness-105 active:translate-y-0.5 disabled:opacity-40"
        >
          {totalDue > 0 ? `Start today's session (${Math.min(totalDue + NEW_PER_SESSION, totalDue + totalNew)} cards)` : 'Study new cards'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatChip label="day streak" value={streak > 0 ? <span className="inline-flex items-center gap-1">{streak}<Flame /></span> : '0'} />
        <StatChip label="mastered" value={`${totalMastered}/${CARDS.length}`} />
        <StatChip label="accuracy" value={accuracy === null ? '—' : `${accuracy}%`} />
        <StatChip label="reviews" value={totalGraded} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {perDeck.map((d) => (
          <div key={d.id} className="rounded-3xl bg-white/70 p-5 shadow-sm ring-1 ring-ink/5">
            <div className="flex items-center justify-between">
              <div className="font-display text-xl font-semibold text-ink"><span className="inline-flex items-center gap-2"><DeckIcon name={d.icon} /> {d.name}</span></div>
              <div className="text-sm font-medium text-ink/50">{d.seen}/{d.total} seen</div>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-ink/10">
              <div className="h-full rounded-full transition-all" style={{ width: `${(d.mastered / d.total) * 100}%`, background: d.accent }} />
            </div>
            <div className="mt-2 flex justify-between text-sm text-ink/60">
              <span>{d.mastered} mastered</span>
              {d.due > 0 && <span className="font-semibold text-ember">{d.due} due</span>}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-ink/40">Progress is saved in your browser. Space flips the card, 1-4 grades it.</p>
    </div>
  )
}

const GRADES = [
  { id: 'again', label: 'Again', key: '1', style: 'bg-[#b91c1c] text-white' },
  { id: 'hard', label: 'Hard', key: '2', style: 'bg-[#b45309] text-white' },
  { id: 'good', label: 'Good', key: '3', style: 'bg-pine text-white' },
  { id: 'easy', label: 'Easy', key: '4', style: 'bg-[#0369a1] text-white' },
]

function Study({ state, setState, onDone }) {
  const [queue, setQueue] = useState(() => {
    const now = Date.now()
    const due = CARDS.filter((c) => state.cards[c.id]?.seen && state.cards[c.id].due <= now).sort((a, b) => state.cards[a.id].due - state.cards[b.id].due)
    const fresh = CARDS.filter((c) => !state.cards[c.id]?.seen).slice(0, NEW_PER_SESSION)
    return [...due, ...fresh].map((c) => c.id)
  })
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(0)

  const total = queue.length
  const current = CARDS.find((c) => c.id === queue[idx])

  const grade = (g) => {
    if (!flipped || !current) return
    const prev = state.cards[current.id] || freshCardState()
    const nextState = {
      ...state,
      cards: { ...state.cards, [current.id]: gradeCard(prev, g) },
      days: [...new Set([...(state.days || []), new Date().toDateString()])],
    }
    setState(nextState)
    setDone((d) => d + 1)
    setFlipped(false)
    if (g === 'again') {
      // see it again at the end of the session
      setQueue((q) => [...q, current.id])
    }
    if (idx + 1 >= total && g !== 'again') {
      onDone()
    } else {
      setIdx((i) => i + 1)
    }
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === ' ') {
        e.preventDefault()
        setFlipped((f) => !f)
      }
      const g = GRADES.find((x) => x.key === e.key)
      if (g) grade(g.id)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  })

  if (!current) return null
  const deck = DECKS.find((d) => d.id === current.deck)
  const cardState = state.cards[current.id]
  const preview = cardState?.seen
    ? { again: '10m', hard: fmtInterval(Math.max(1, (cardState.interval || 1) * 1.2)), good: fmtInterval(cardState.reps === 0 ? 1 : cardState.interval * cardState.ease), easy: fmtInterval(cardState.reps === 0 ? 4 : cardState.interval * cardState.ease * 1.3) }
    : { again: '10m', hard: '1d', good: '1d', easy: '4d' }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <Wordmark />
        <div className="text-sm font-semibold text-ink/60">{Math.min(done + 1, total)} / {total}</div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink/10">
        <div className="h-full rounded-full bg-ember transition-all duration-300" style={{ width: `${(done / total) * 100}%` }} />
      </div>

      <div className="relative">
        <div className="absolute inset-x-4 -bottom-2 h-full rounded-3xl bg-paper-deep ring-1 ring-ink/5" />
        <div
          key={current.id + (flipped ? '-back' : '-front')}
          onClick={() => setFlipped((f) => !f)}
          className={`relative cursor-pointer rounded-3xl bg-white p-8 shadow-lg ring-1 ring-ink/10 sm:p-10 ${flipped ? 'anim-flip' : 'anim-next'}`}
          style={{ minHeight: '20rem' }}
        >
          <div className="flex items-center justify-between">
            <span className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white" style={{ background: deck.accent }}>
              <span className="inline-flex items-center gap-2"><DeckIcon name={deck.icon} /> {deck.name}</span>
            </span>
            <span className="text-xs font-medium text-ink/40">{flipped ? 'answer' : 'question'}</span>
          </div>
          {!flipped ? (
            <div className="mt-8 font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">{current.q}</div>
          ) : (
            <div className="mt-8 text-lg leading-relaxed text-ink/85">{current.a}</div>
          )}
          <div className="absolute inset-x-0 bottom-5 text-center text-xs font-medium text-ink/40">
            {flipped ? 'grade yourself honestly' : 'tap to flip'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {GRADES.map((g) => (
          <button
            key={g.id}
            onClick={() => grade(g.id)}
            disabled={!flipped}
            className={`rounded-2xl py-3 text-center shadow-sm transition enabled:hover:brightness-110 enabled:active:translate-y-0.5 disabled:opacity-30 ${g.style}`}
          >
            <div className="font-semibold">{g.label}</div>
            <div className="text-xs opacity-80">{preview[g.id]}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

function SessionEnd({ state, onHome, onMore }) {
  const now = Date.now()
  const remaining = CARDS.filter((c) => state.cards[c.id]?.seen && state.cards[c.id].due <= now).length
  const fresh = CARDS.filter((c) => !state.cards[c.id]?.seen).length
  return (
    <div className="anim-deal mx-auto flex w-full max-w-md flex-col items-center gap-6 text-center">
      <div className="text-ember"><Party /></div>
      <h2 className="font-display text-4xl font-semibold text-ink">Session complete</h2>
      <p className="text-ink/60">
        {remaining > 0 ? `${remaining} card${remaining === 1 ? '' : 's'} still due.` : fresh > 0 ? `${fresh} new card${fresh === 1 ? '' : 's'} waiting in the decks.` : 'Every card is scheduled. Come back tomorrow to keep the streak.'}
      </p>
      <div className="flex gap-3">
        <button onClick={onHome} className="rounded-2xl bg-ink/10 px-6 py-3 font-semibold text-ink transition hover:bg-ink/15">Back to decks</button>
        {(remaining > 0 || fresh > 0) && (
          <button onClick={onMore} className="rounded-2xl bg-ember px-6 py-3 font-semibold text-white shadow transition hover:brightness-110">Keep going</button>
        )}
      </div>
    </div>
  )
}

// ---------- app ----------


function DeckIcon({ name }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', 'aria-hidden': true }
  if (name === 'js') return <svg {...common}><rect x="2" y="2" width="20" height="20" rx="4" fill="#f7df1e" /><text x="12" y="17" fontSize="11" fontWeight="800" textAnchor="middle" fill="#222" fontFamily="Arial">JS</text></svg>
  if (name === 'react') return <svg {...common} fill="none" stroke="#0ea5e9" strokeWidth="1.5"><ellipse cx="12" cy="12" rx="10" ry="4" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" /><circle cx="12" cy="12" r="1.8" fill="#0ea5e9" /></svg>
  if (name === 'css') return <svg {...common}><path d="M3 2l1.600 18L12 22l7.400-2L21 2z" fill="#6d28d9" /><path d="M16.500 8H8.300l.2 2.300h7.700l-.5 5.700-3.700 1-3.700-1-.2-2.400h2.300l.1 1.200 1.500.4 1.500-.4.200-2H8L7.600 6h9z" fill="#fff" /></svg>
  return <svg {...common} fill="none" stroke="#166534" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9.500" /><ellipse cx="12" cy="12" rx="4" ry="9.500" /><path d="M2.500 12h19" /></svg>
}
function Flame() {
  return <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2s5 4.500 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z" fill="#ea580c" /></svg>
}
function Party() {
  return <svg width="72" height="72" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l5-14 9 9z" fill="currentColor" fillOpacity=".15" /><path d="M14 4l1-2M18 8l2-1M16 3.500v0M20 12l2 .5M12 2v0" /></svg>
}

export default function App() {
  const [state, setStateRaw] = useState(loadState)
  const [screen, setScreen] = useState('home') // home | study | end

  const setState = (s) => {
    setStateRaw(s)
    localStorage.setItem(LS_KEY, JSON.stringify(s))
  }

  return (
    <div className="min-h-full bg-paper px-4 py-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col justify-center">
        {screen === 'home' && <Home state={state} onStart={() => setScreen('study')} />}
        {screen === 'study' && <Study state={state} setState={setState} onDone={() => setScreen('end')} />}
        {screen === 'end' && <SessionEnd state={state} onHome={() => setScreen('home')} onMore={() => setScreen('study')} />}
      </div>
    </div>
  )
}
