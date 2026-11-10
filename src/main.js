// Armador de consulta: arma el mensaje de WhatsApp según lo que elige el visitante.

const WHATSAPP = '5493413145129';

const RUBROS = {
  prof: 'un estudio profesional',
  salud: 'un espacio de salud',
  turismo: 'un alojamiento o servicio turístico',
  comercio: 'un comercio o emprendimiento',
  gastro: 'un emprendimiento gastronómico',
  otro: 'un negocio',
};

const NECESIDADES = {
  contacto: 'una web para que me encuentren y me contacten',
  catalogo: 'una web para mostrar mis productos y recibir pedidos',
  reservas: 'una web para recibir consultas o reservas',
  renovar: 'renovar la web que ya tengo',
  nose: 'que me asesores sobre qué me conviene',
};

const state = { rubro: null, nec: null, negocio: '' };

const preview = document.getElementById('msg-preview');
const link = document.getElementById('msg-link');
const sug = document.getElementById('msg-sug');
const sugText = document.getElementById('msg-sug-text');
const input = document.getElementById('negocio');

const waLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

function buildMessage() {
  const neg = state.negocio.trim();
  const lines = ['¡Hola Marcos! Te escribo desde la web de Fiel.'];
  if (state.rubro) lines.push(`Tengo ${RUBROS[state.rubro]}${neg ? ': ' + neg : ''}.`);
  else if (neg) lines.push(`Mi negocio: ${neg}.`);
  if (state.nec) lines.push(`Me interesa ${NECESIDADES[state.nec]}.`);
  lines.push('Me gustaría ver un borrador de cómo podría quedar mi sitio.');
  return lines.join('\n');
}

function buildSuggestion() {
  const { rubro, nec } = state;
  if (nec === 'catalogo') return 'Catálogo + pedidos';
  if (nec === 'reservas' || (rubro === 'turismo' && nec !== 'nose' && nec !== 'renovar')) return 'Turismo y alojamiento';
  if (nec === 'renovar' || nec === 'nose') return 'lo definimos juntos en la primera charla';
  if (nec === 'contacto' || rubro === 'prof' || rubro === 'salud') return 'Presencia profesional';
  if (rubro === 'comercio' || rubro === 'gastro') return 'Catálogo + pedidos';
  return '';
}

function render() {
  const msg = buildMessage();
  preview.textContent = msg;
  link.href = waLink(msg);

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
    render();
  });
});

input.addEventListener('input', () => {
  state.negocio = input.value.slice(0, 80);
  render();
});

render();
