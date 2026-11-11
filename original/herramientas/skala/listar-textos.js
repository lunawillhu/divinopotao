// Lista los textos que todavía parecen estar en inglés en la página ya convertida (sitio/).
// Sirve para saber qué falta agregar en textos-skala.js.
// Uso:  node herramientas/skala/listar-textos.js
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const RSC = require('./rsc');
const T = require('./textos');

const SITIO = path.join(__dirname, '..', '..', 'sitio');
const INGLES = /\b(the|and|you|with|tape|tapes|for|your|our|we|is|it|of|to|stick|roll|from|that|this|what|who|news|about|family|next|back|share|story|hold|seal|stories|hover|colours|why|on|in|so|like|look|makes|works)\b/i;
const encontrados = new Map();

function anotar(texto, pagina) {
  texto = texto.replace(/ /g, ' ');
  if (!INGLES.test(texto) || /^[.#:@(]|\{|^\/|^https?:/.test(texto)) return;
  if (!encontrados.has(texto)) encontrados.set(texto, new Set());
  encontrados.get(texto).add(pagina);
}

for (const f of fs.readdirSync(path.join(SITIO, '_rsc'), { recursive: true })) {
  const p = path.join(SITIO, '_rsc', f);
  if (!fs.statSync(p).isFile()) continue;
  const filas = RSC.parsear(fs.readFileSync(p, 'utf8'));
  const porId = new Map(filas.filter((x) => x.tipo === 'J').map((x) => [x.id, x.json]));
  // filas que ya nadie usa (quedaron sueltas después de convertir): no se muestran
  const usadas = new Set();
  for (const x of filas) if (x.tipo === 'J') for (const m of JSON.stringify(x.json).matchAll(/"\$[L@]?([0-9a-f]+)"/g)) usadas.add(m[1]);
  for (const fila of filas) {
    if (fila.tipo !== 'J' || (fila.id !== '0' && !usadas.has(fila.id))) continue;
    T.recorrer(fila.json, (n, padre, clave) => {
      if (typeof n === 'string' && ['children', 'alt', 'content', 'label', 'aria-label', 'title', 'data-copy', 'data-tags', 'text', 'tail'].includes(clave)) anotar(n, f);
      if (Array.isArray(n) && !T.esElemento(n) && T.piezasDe(n)) {
        // texto de la secuencia, resolviendo los pedazos que están en otras filas
        const txt = n.map((x) => (typeof x === 'string' && /^\$L[0-9a-f]+$/.test(x) ? T.textoTotal(porId.get(x.slice(2)) ?? '') : T.textoTotal(x))).join('');
        anotar(txt, f);
      }
    });
  }
}
const lineas = [...encontrados].sort((a, b) => a[0].localeCompare(b[0])).map(([t, ps]) => `${JSON.stringify(t)}   ← ${[...ps].join(', ')}`);
console.log(lineas.join('\n') || 'No quedan textos en inglés (según esta búsqueda).');
