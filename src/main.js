import { EN } from './en.js';

const WHATSAPP = '5493413145129';
const waLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

// ---------------------------------------------------------------------------
// Textos que arma el JavaScript (mensajes de WhatsApp y armador de consulta)
// ---------------------------------------------------------------------------
const COPY = {
  es: {
    title: document.title,
    description: document.querySelector('meta[name="description"]').content,
    wa: {
      general: '¡Hola Marcos! Vi la web de Fiel y quería hacerte una consulta sobre un sitio web.',
      presencia: '¡Hola Marcos! Vi la web de Fiel y me interesa el sitio de Presencia profesional. ¿Me contás cómo sería?',
      turismo: '¡Hola Marcos! Vi la web de Fiel y me interesa el sitio para Turismo y alojamiento. ¿Me contás cómo sería?',
      catalogo: '¡Hola Marcos! Vi la web de Fiel y me interesa el sitio de Catálogo + pedidos. ¿Me contás cómo sería?',
      mant: '¡Hola Marcos! Vi la web de Fiel y quería consultarte por los planes de mantenimiento.',
    },
    rubros: {
      prof: 'un estudio profesional',
      salud: 'un espacio de salud',
      turismo: 'un alojamiento o servicio turístico',
      comercio: 'un comercio o emprendimiento',
      gastro: 'un emprendimiento gastronómico',
      otro: 'un negocio',
    },
    necesidades: {
      contacto: 'una web para que me encuentren y me contacten',
      catalogo: 'una web para mostrar mis productos y recibir pedidos',
      reservas: 'una web para recibir consultas o reservas',
      renovar: 'renovar la web que ya tengo',
      nose: 'que me asesores sobre qué me conviene',
    },
    hello: '¡Hola Marcos! Te escribo desde la web de Fiel.',
    have: (r, neg) => `Tengo ${r}${neg ? ': ' + neg : ''}.`,
    business: (neg) => `Mi negocio: ${neg}.`,
    interest: (n) => `Me interesa ${n}.`,
    close: 'Me gustaría ver un borrador de cómo podría quedar mi sitio.',
    sug: {
      catalogo: 'Catálogo + pedidos',
      turismo: 'Turismo y alojamiento',
      juntos: 'lo definimos juntos en la primera charla',
      presencia: 'Presencia profesional',
    },
  },
  en: {
    title: 'Fiel · Web studio | Websites for professionals and small businesses',
    description: 'Website design and development for professionals, shops and small businesses. Based in Rosario, Argentina, working remotely. See a draft of your site before you pay anything.',
    wa: {
      general: 'Hi Marcos! I saw the Fiel website and I’d like to ask about a website.',
      presencia: 'Hi Marcos! I saw the Fiel website and I’m interested in the Professional presence website. Could you tell me more?',
      turismo: 'Hi Marcos! I saw the Fiel website and I’m interested in the Tourism & lodging website. Could you tell me more?',
      catalogo: 'Hi Marcos! I saw the Fiel website and I’m interested in the Catalog + orders website. Could you tell me more?',
      mant: 'Hi Marcos! I saw the Fiel website and I’d like to ask about the maintenance plans.',
    },
    rubros: {
      prof: 'a professional practice',
      salud: 'a health practice',
      turismo: 'a lodging or tourism business',
      comercio: 'a shop or small business',
      gastro: 'a food business',
      otro: 'a business',
    },
    necesidades: {
      contacto: 'a website so people can find and contact me',
      catalogo: 'a website to show my products and receive orders',
      reservas: 'a website to receive inquiries or bookings',
      renovar: 'redesigning my current website',
      nose: 'your advice on what would suit me best',
    },
    hello: 'Hi Marcos! I’m writing from the Fiel website.',
    have: (r, neg) => `I have ${r}${neg ? ': ' + neg : ''}.`,
    business: (neg) => `My business: ${neg}.`,
    interest: (n) => `I’m interested in ${n}.`,
    close: 'I’d like to see a draft of how my website could look.',
    sug: {
      catalogo: 'Catalog + orders',
      turismo: 'Tourism & lodging',
      juntos: 'we’ll figure it out together in our first chat',
      presencia: 'Professional presence',
    },
  },
};

// ---------------------------------------------------------------------------
// Idioma
// ---------------------------------------------------------------------------
const i18nEls = [...document.querySelectorAll('[data-i18n]')];
const ES_HTML = new Map(i18nEls.map((el) => [el, el.innerHTML]));
const phEls = [...document.querySelectorAll('[data-i18n-ph]')];
const ES_PH = new Map(phEls.map((el) => [el, el.placeholder]));
const ariaEls = [...document.querySelectorAll('[data-i18n-aria]')];
const ES_ARIA = new Map(ariaEls.map((el) => [el, el.getAttribute('aria-label')]));

let lang = 'es';

function detectLang() {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (fromUrl === 'es' || fromUrl === 'en') return fromUrl;
  try {
    const saved = localStorage.getItem('fiel-lang');
    if (saved === 'es' || saved === 'en') return saved;
  } catch (e) { /* sin almacenamiento */ }
  return (navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en';
}

function setLang(next, save = true) {
  lang = next;
  const en = lang === 'en';
  document.documentElement.lang = lang;
  i18nEls.forEach((el) => {
    const t = en ? EN[el.dataset.i18n] : ES_HTML.get(el);
    if (t != null) el.innerHTML = t;
  });
  phEls.forEach((el) => { el.placeholder = en ? el.dataset.i18nPh : ES_PH.get(el); });
  ariaEls.forEach((el) => { el.setAttribute('aria-label', en ? el.dataset.i18nAria : ES_ARIA.get(el)); });
  document.title = COPY[lang].title;
  document.querySelector('meta[name="description"]').content = COPY[lang].description;
  document.querySelectorAll('[data-wa]').forEach((a) => { a.href = waLink(COPY[lang].wa[a.dataset.wa]); });
  document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  if (save) { try { localStorage.setItem('fiel-lang', lang); } catch (e) { /* sin almacenamiento */ } }
  renderBuilder();
}

document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

// ---------------------------------------------------------------------------
// Armador de consulta
// ---------------------------------------------------------------------------
const state = { rubro: null, nec: null, negocio: '' };
const preview = document.getElementById('msg-preview');
const msgLink = document.getElementById('msg-link');
const sug = document.getElementById('msg-sug');
const sugText = document.getElementById('msg-sug-text');
const input = document.getElementById('negocio');

function buildMessage() {
  const c = COPY[lang];
  const neg = state.negocio.trim();
  const lines = [c.hello];
  if (state.rubro) lines.push(c.have(c.rubros[state.rubro], neg));
  else if (neg) lines.push(c.business(neg));
  if (state.nec) lines.push(c.interest(c.necesidades[state.nec]));
  lines.push(c.close);
  return lines.join('\n');
}

function buildSuggestion() {
  const s = COPY[lang].sug;
  const { rubro, nec } = state;
  if (nec === 'catalogo') return s.catalogo;
  if (nec === 'reservas' || (rubro === 'turismo' && nec !== 'nose' && nec !== 'renovar')) return s.turismo;
  if (nec === 'renovar' || nec === 'nose') return s.juntos;
  if (nec === 'contacto' || rubro === 'prof' || rubro === 'salud') return s.presencia;
  if (rubro === 'comercio' || rubro === 'gastro') return s.catalogo;
  return '';
}

function renderBuilder() {
  const msg = buildMessage();
  preview.textContent = msg;
  msgLink.href = waLink(msg);
  const s = buildSuggestion();
  sug.hidden = !s;
  sugText.textContent = s;
  document.querySelectorAll('.chip').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(state[btn.dataset.group] === btn.dataset.id));
  });
}

document.querySelectorAll('.chip').forEach((btn) => {
  btn.addEventListener('click', () => {
    const { group, id } = btn.dataset;
    state[group] = state[group] === id ? null : id;
    renderBuilder();
  });
});

input.addEventListener('input', () => {
  state.negocio = input.value.slice(0, 80);
  renderBuilder();
});

const initial = detectLang();
if (initial === 'es') renderBuilder();
setLang(initial, false);
