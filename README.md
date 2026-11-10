# Fiel · Estudio web

Landing de servicios de Fiel, hecha con Vite (HTML + CSS + JS, sin framework).

## Usar en local

```bash
npm install
npm run dev       # servidor de desarrollo en http://localhost:5173
npm run build     # genera la carpeta dist/
npm run preview   # sirve dist/ para probar el build
```

## Estructura

- `index.html`: todo el contenido del sitio.
- `src/style.css`: animaciones, hovers y estilos del armador de consulta.
- `src/main.js`: armador de consulta (arma el mensaje de WhatsApp según rubro y objetivo).
- `public/img/`: capturas de los trabajos (compu y celular).
- `public/favicon.svg`: ícono de la pestaña.
- `netlify.toml`: configuración de deploy (build `npm run build`, carpeta `dist`).

## Idiomas (ES / EN)

- El texto en español está escrito en `index.html`.
- Cada texto traducible tiene un atributo `data-i18n="tN"`; su versión en inglés está en `src/en.js` con la misma clave.
- Los mensajes de WhatsApp y los textos del armador de consulta, en los dos idiomas, están en `src/main.js` (objeto `COPY`).
- El idioma inicial sale del navegador del visitante (o de `?lang=en` en la URL) y se recuerda si lo cambia con el botón ES / EN.
- Si cambiás un texto en español, cambiá también su versión en `src/en.js`.

## Cambios frecuentes

- **Número de WhatsApp:** está en `src/main.js` (`WHATSAPP`) y en los links `wa.me/5493413145129` de `index.html`.
- **Color principal:** variable `--accent` al inicio de `src/style.css`.
- **Precio de entrada:** buscar `price-pill` en `index.html` ($300.000 ARS, US$ 200, 175 €).

## Deploy en Netlify

1. Subir la carpeta a un repo de GitHub.
2. En Netlify: Add new site → Import from Git → elegir el repo. Toma la configuración de `netlify.toml`.
3. Para el dominio: Domain management → Add domain, y en DonWeb apuntar los DNS como indica Netlify.
