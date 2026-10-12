/* ============ CONFIG ============
   Paste the SAME free TMDB key you used in script.js to get real posters.
   Without a key the page uses coloured placeholder tiles. */
const API_KEY = 'YOUR_TMDB_API_KEY';
const BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ============ LANGUAGE (English / Hindi) ============ */
const I18N = {
  en: {
    signin: 'Sign In', title: 'Watch it before someone spoils it',
    price: 'Starts at ₹149. Cancel at any time.',
    prompt: 'Ready to watch? Enter your email to create or restart your membership.',
    email: 'Email address', start: 'Get Started', trending: 'Trending Now',
    reasons: 'More reasons to join', faq: 'Frequently Asked Questions',
    err1: 'Email is required.', err2: 'Please enter a valid email address.'
  },
  hi: {
    signin: 'साइन इन', title: 'कोई स्पॉइल करे, उससे पहले देख लो',
    price: '₹149 से शुरू। कभी भी रद्द करें।',
    prompt: 'देखने के लिए तैयार हैं? सदस्यता बनाने या दोबारा शुरू करने के लिए अपना ईमेल डालें।',
    email: 'ईमेल पता', start: 'शुरू करें', trending: 'अभी ट्रेंडिंग',
    reasons: 'जुड़ने के और कारण', faq: 'अक्सर पूछे जाने वाले प्रश्न',
    err1: 'ईमेल ज़रूरी है।', err2: 'कृपया सही ईमेल पता डालें।'
  }
};
let lang = 'en';
try { lang = localStorage.getItem('lang') || 'en'; } catch {}
const t = k => I18N[lang][k];

function applyLang(l) {
  lang = l;
  document.documentElement.lang = l;
  $$('[data-i18n]').forEach(e => e.textContent = I18N[l][e.dataset.i18n]);
  $$('.langSel').forEach(s => s.value = l);
  try { localStorage.setItem('lang', l); } catch {}
}

/* ============ EMAIL FORMS (hero + bottom) ============ */
$$('[data-form]').forEach(slot => slot.appendChild($('#formTpl').content.cloneNode(true)));

$$('.signup').forEach(f => {
  const input = $('input', f), err = $('.ferr', f);
  f.addEventListener('submit', e => {
    e.preventDefault();
    const v = input.value.trim();
    const msg = !v ? t('err1') : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? t('err2') : '';
    f.classList.toggle('bad', !!msg);
    err.textContent = msg;
    if (msg) return input.focus();
    location.href = 'login.html?mode=signup&email=' + encodeURIComponent(v);   // hand over to sign-up
  });
  input.addEventListener('input', () => { f.classList.remove('bad'); err.textContent = ''; });
});

$$('.langSel').forEach(s => s.addEventListener('change', () => applyLang(s.value)));
applyLang(lang);

/* ============ FAQ ACCORDION ============ */
const FAQS = [
  ['What is Netflix?', 'This site is a demo clone made for a college project. It is inspired by Netflix, a streaming service for TV shows and films. After signing in you can browse titles, watch trailers and save favourites to My List.'],
  ['How much does Netflix cost?', 'In this demo the price is a sample: plans start at ₹149 a month with no contracts and no cancellation fees. Real prices are listed on the official Netflix website.'],
  ['Where can I watch?', 'Open the site in any modern browser on your phone, tablet or laptop and sign in with your account to start browsing instantly.'],
  ['How do I cancel?', 'Accounts in this demo live only in your browser, so clearing the site data removes them. On a real service you would cancel online from your account settings.'],
  ['What can I watch on Netflix?', 'The catalogue comes from the TMDB database and covers movies, TV shows, documentaries and more. Each title has a details window with a trailer.'],
  ['Is Netflix good for kids?', 'A Kids profile gives children family-friendly shows and films in their own space, with PIN-protected parental controls to limit the maturity rating of what they can watch.']
];
const faq = $('#faq');
FAQS.forEach(([q, a], i) => {
  const d = document.createElement('div');
  d.className = 'fq';
  d.innerHTML = `<button aria-expanded="false" aria-controls="a${i}"><span>${q}</span><i class="pl"></i></button>
    <div class="ans" id="a${i}"><div><p>${a}</p></div></div>`;
  d.querySelector('button').addEventListener('click', () => {
    const open = !d.classList.contains('open');
    $$('.fq', faq).forEach(x => { x.classList.remove('open'); $('button', x).setAttribute('aria-expanded', 'false'); });
    if (open) { d.classList.add('open'); $('button', d).setAttribute('aria-expanded', 'true'); }
  });
  faq.appendChild(d);
});

/* ============ POSTERS: hero mosaic + Trending Now ============ */
const FAKE = ['Midnight Protocol', 'The Last Signal', 'Broken Arrow', 'Neon Streets', 'Hollow Crown', 'Paper Moons', 'Deep Current', 'Iron Orchard', 'Static', 'Wild Frontier'];
const grad = i => { const h = (i * 37) % 360; return `linear-gradient(150deg,hsl(${h},55%,32%),hsl(${h + 35},50%,12%))`; };

async function getTrending() {
  if (API_KEY.startsWith('YOUR')) return [];
  try {
    const r = await fetch(`${BASE}/trending/movie/week?api_key=${API_KEY}`);
    return (await r.json()).results || [];
  } catch { return []; }
}

function buildMosaic(list) {
  const m = $('#mosaic');
  for (let i = 0; i < 49; i++) {
    const tile = document.createElement('div'), it = list[i % (list.length || 1)];
    tile.className = 'tile';
    if (it && it.backdrop_path) tile.style.backgroundImage = `url(${IMG}w300${it.backdrop_path})`;
    else { tile.style.background = grad(i); tile.textContent = FAKE[i % FAKE.length]; }
    m.appendChild(tile);
  }
}

function buildTrending(list) {
  const track = $('#tTrack');
  for (let i = 0; i < 10; i++) {
    const it = list[i], item = document.createElement('div');
    item.className = 't-item';
    const p = document.createElement('div');
    p.className = 'poster';
    if (it && it.poster_path) p.style.backgroundImage = `url(${IMG}w342${it.poster_path})`;
    else { p.style.background = grad(i + 3); p.textContent = FAKE[i]; }
    item.append(p);
    item.insertAdjacentHTML('beforeend', `<span class="n">${i + 1}</span>`);
    item.addEventListener('click', () => {            // like the real page: nudge towards sign-up
      window.scrollTo({ top: 0 });
      setTimeout(() => $('.signup input').focus(), 300);
    });
    track.appendChild(item);
  }
  const prev = $('#tPrev'), next = $('#tNext');
  const sync = () => {
    prev.hidden = track.scrollLeft < 10;
    next.hidden = track.scrollLeft + track.clientWidth >= track.scrollWidth - 10;
  };
  prev.onclick = () => track.scrollBy({ left: -track.clientWidth * 0.8 });
  next.onclick = () => track.scrollBy({ left: track.clientWidth * 0.8 });
  track.addEventListener('scroll', sync);
  window.addEventListener('resize', sync);
  sync();
}

getTrending().then(list => { buildTrending(list); });
