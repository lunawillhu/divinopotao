// Convierte la grabación de Sweet Tape en la página de Skala.
// Uso (parado en la carpeta original):   node herramientas/skala/aplicar.js
//
// La primera vez guarda una copia intacta en sitio-sweettape/. Cada vez que se corre, parte de esa
// copia y vuelve a generar sitio/ con los textos, colores e imágenes de Skala. Se puede correr
// todas las veces que quieras (por ejemplo, después de cambiar un texto en textos-skala.js).
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const RSC = require('./rsc');
const T = require('./textos');
const { frases, marcas, javascript } = require('./textos-skala');
const { colores } = require('./colores');
const imagenes = require('./imagenes');

const BASE = path.join(__dirname, '..', '..');
const ORIGEN = path.join(BASE, 'sitio-sweettape');
const DESTINO = path.join(BASE, 'sitio');

// 1) Copia intacta
if (!fs.existsSync(ORIGEN)) {
  console.log('Guardando la copia original en sitio-sweettape/ ...');
  fs.cpSync(DESTINO, ORIGEN, { recursive: true });
}
// (en Windows no se puede borrar la carpeta si algo la tiene abierta: se pisan los archivos uno por uno)
fs.cpSync(ORIGEN, DESTINO, { recursive: true, force: true });
fs.rmSync(path.join(DESTINO, 'skala'), { recursive: true, force: true });

// 2) Textos dentro de los datos RSC
const CLAVES_TEXTO = new Set(['children', 'alt', 'content', 'label', 'aria-label', 'title', 'placeholder', 'text', 'tail', 'head', 'heading', 'subtitle', 'caption', 'data-copy', 'data-tags']);
// ¿el texto de adentro es (casi) el mismo que el aria-label? (puede faltar alguna letra que es una imagen)
const casiIgual = (label, adentro) => {
  const a = sinEspacios(label), b = sinEspacios(adentro);
  if (!b || b.length < a.length * 0.5) return false;
  let i = 0;
  for (const c of b) { i = a.indexOf(c, i); if (i < 0) return false; i++; }
  return true;
};
const sinEspacios = (s) => s.replace(/[\s⁠​]+/g, '').toLowerCase();
const usadas = new Set();
const traducir = (s) => {
  if (typeof s !== 'string') return null;
  const clave = s.replace(/ /g, ' '); // los títulos animados usan espacios "duros"
  if (Object.prototype.hasOwnProperty.call(frases, clave)) { usadas.add(clave); return frases[clave]; }
  // probar sin los espacios de las puntas (y devolverlos igual)
  const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(s);
  if (m[2] !== s && m[2] && Object.prototype.hasOwnProperty.call(frases, m[2].replace(/ /g, ' '))) {
    usadas.add(m[2]);
    return m[1] + frases[m[2].replace(/ /g, ' ')] + m[3];
  }
  return null;
};
const aplicarMarcas = (s) => marcas.reduce((t, [re, nuevo]) => t.replace(re, nuevo), s);

// Reparte un texto en n líneas de largo parecido (sin cortar palabras)
function repartir(texto, n) {
  const palabras = texto.split(/\s+/).filter(Boolean);
  const objetivo = texto.length / n;
  const lineas = [];
  let actual = '';
  for (const p of palabras) {
    const restantes = n - lineas.length;
    if (actual && (actual + ' ' + p).length > objetivo * 1.15 && restantes > 1) { lineas.push(actual); actual = p; }
    else actual = actual ? actual + ' ' + p : p;
  }
  lineas.push(actual);
  while (lineas.length < n) lineas.push('');
  return lineas;
}

function transformarArbol(raiz, pares) {
  T.recorrer(raiz, (n, padre, clave) => {
    // Elemento con aria-label conocido: se reescribe entero (incluye letras/palabras animadas)
    if (T.esElemento(n) && typeof n[3]['aria-label'] === 'string') {
      const nuevo = traducir(n[3]['aria-label']);
      if (nuevo !== null) {
        const viejoHtml = T.aHtml(n);
        const label = n[3]['aria-label'];
        n[3]['aria-label'] = nuevo;
        const hijos = n[3].children;
        // solo si el aria-label describe el texto cortado de adentro (si no, es un menú u otra cosa)
        const igual = hijos !== undefined && casiIgual(label, T.textoTotal(hijos));
        if (igual) T.reescribirElemento(n, nuevo, pares);
        const nuevoHtml = T.aHtml(n);
        if (viejoHtml && nuevoHtml) pares.push([viejoHtml, nuevoHtml]);
        return !igual;
      }
    }
    // Secuencia de letras o palabras sueltas
    if (Array.isArray(n) && !T.esElemento(n) && T.piezasDe(n)) {
      const nuevo = traducir(T.textoTotal(n));
      if (nuevo !== null) {
        const viejoHtml = T.aHtml(n);
        const lleno = T.rellenar(n, nuevo);
        n.length = 0;
        n.push(...lleno);
        const nuevoHtml = T.aHtml(n);
        if (viejoHtml && nuevoHtml) pares.push([viejoHtml, nuevoHtml]);
        return false;
      }
    }
    // Párrafo repartido en líneas (una <span> con texto completo por línea, p. ej. "hand-line")
    if (Array.isArray(n) && !T.esElemento(n) && n.length >= 2 && n.every((x) => T.esElemento(x) && typeof x[3].children === 'string')) {
      const clase = n[0][3].className;
      if (clase && n.every((x) => x[3].className === clase)) {
        const nuevo = traducir(n.map((x) => x[3].children.trim()).join(' '));
        if (nuevo !== null) {
          const viejoHtml = T.aHtml(n);
          repartir(nuevo, n.length).forEach((linea, i) => (n[i][3].children = linea));
          const nuevoHtml = T.aHtml(n);
          if (viejoHtml && nuevoHtml) pares.push([viejoHtml, nuevoHtml]);
          return false;
        }
      }
    }
    // Texto común
    if (typeof n === 'string' && padre && !Array.isArray(padre) && CLAVES_TEXTO.has(clave) && !n.startsWith('$')) {
      const nuevo = traducir(n);
      padre[clave] = aplicarMarcas(nuevo !== null ? nuevo : n);
    } else if (typeof n === 'string' && Array.isArray(padre) && !T.esElemento(padre) && /[A-Z ]/.test(n) && !n.startsWith('$')) {
      // texto suelto dentro de una lista de hijos (no se aplican las marcas: podría ser una ruta)
      const nuevo = traducir(n);
      if (nuevo !== null) padre[clave] = nuevo;
    }
    return true;
  });
}

function transformarFlight(texto, pares = []) {
  const filas = RSC.parsear(texto);
  T.FRAGMENTOS.clear();
  for (const f of filas) if (f.tipo === 'J' && f.json === '$Sreact.fragment') T.FRAGMENTOS.add('$' + f.id);
  // Next manda algunos pedazos aparte ("$L1f" = "el contenido está en la fila 1f"). Para poder leer y
  // reescribir un párrafo entero, esos pedazos se meten en su lugar (React acepta las dos formas).
  const porId = new Map(filas.filter((f) => f.tipo === 'J').map((f) => [f.id, f.json]));
  const esRef = (x) => typeof x === 'string' && /^\$L[0-9a-f]+$/.test(x) && porId.has(x.slice(2)) &&
    (Array.isArray(porId.get(x.slice(2))) || typeof porId.get(x.slice(2)) === 'string');
  const meter = (n, prof = 0, esProps = false) => {
    if (prof > 800 || !n || typeof n !== 'object') return;
    if (Array.isArray(n)) {
      if (T.esElemento(n)) return meter(n[3], prof + 1, true);
      for (let i = 0; i < n.length; i++) {
        if (esRef(n[i])) n[i] = JSON.parse(JSON.stringify(porId.get(n[i].slice(2))));
        meter(n[i], prof + 1);
      }
    } else if (esProps) {
      // en las props de un elemento solo se toca "children"
      if (esRef(n.children)) n.children = JSON.parse(JSON.stringify(porId.get(n.children.slice(2))));
      meter(n.children, prof + 1);
    } else {
      for (const k of Object.keys(n)) meter(n[k], prof + 1);
    }
  };
  for (const f of filas) if (f.tipo === 'J') meter(f.json);
  for (const f of filas) if (f.tipo === 'J') transformarArbol(f.json, pares);
  return RSC.serializar(filas);
}

// Cambia en el HTML los pedazos que se re-armaron (mismo HTML que dibuja React)
// Cada par cambia una sola aparición, en el orden en que aparecen en la página.
function aplicarPares(html, pares, archivo) {
  let cursor = 0;
  for (const [viejo, nuevo] of pares) {
    if (!viejo || viejo === nuevo) continue;
    let i = html.indexOf(viejo, cursor);
    if (i < 0) i = html.indexOf(viejo);
    if (i < 0) {
      paresFaltan++;
      if (DETALLE) console.log('  no está en', archivo + ':', viejo.replace(/<[^>]+>/g, '').slice(0, 60));
      continue;
    }
    html = html.slice(0, i) + nuevo + html.slice(i + viejo.length);
    cursor = i + nuevo.length;
    paresOk++;
  }
  return html;
}
let paresOk = 0, paresFaltan = 0;
const DETALLE = process.argv.includes('--detalle');

// HTML ya renderizado (lo primero que se ve, antes de que React tome el control)
const escHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');

function transformarHtmlVisible(html) {
  // Solo se tocan textos entre etiquetas y atributos de texto, nunca links ni clases
  html = html.replace(/>([^<>]+)</g, (m, txt) => {
    const crudo = txt.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    const nuevo = Object.prototype.hasOwnProperty.call(frases, crudo) ? frases[crudo] : crudo;
    return '>' + escHtml(aplicarMarcas(nuevo)) + '<';
  });
  html = html.replace(/\b(alt|content|aria-label|title|placeholder)="([^"]*)"/g, (m, attr, val) => {
    const crudo = val.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    if (/^(https?:|\/|#[0-9a-fA-F]{3,8}$)/.test(crudo)) return m;
    const nuevo = Object.prototype.hasOwnProperty.call(frases, crudo) ? frases[crudo] : crudo;
    return `${attr}="${escHtml(aplicarMarcas(nuevo))}"`;
  });
  return html;
}

// 3) Colores (mismo largo, así no se rompen los datos de React)
const reColor = new RegExp('#(' + Object.keys(colores).map((c) => c.slice(1)).join('|') + ')(?![0-9a-fA-F])', 'gi');
const cambiarColores = (s) => s.replace(reColor, (m) => colores[m.toLowerCase()] || m);

// 4) Recorrer archivos
const esTexto = (p) => /\.(html|txt|js|css|svg|json|webmanifest)$/i.test(p) && !p.includes('_manifiesto');
let cambiados = 0;
const usadasJs = new Set();
function procesar(dir) {
  for (const nombre of fs.readdirSync(dir)) {
    const p = path.join(dir, nombre);
    if (fs.statSync(p).isDirectory()) { procesar(p); continue; }
    if (!esTexto(p)) continue;
    const rel = path.relative(DESTINO, p).replace(/\\/g, '/');
    const antes = fs.readFileSync(p, 'utf8');
    let t = antes;
    if (rel.startsWith('_rsc/')) t = transformarFlight(t);
    else if (nombre.endsWith('.html')) {
      const flight = RSC.extraerDeHtml(t);
      const pares = [];
      if (flight) t = RSC.reemplazarEnHtml(t, transformarFlight(flight, pares));
      // separar la parte de scripts para no tocarla con el reemplazo de HTML visible
      const partes = t.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>)/);
      const guardados = partes.filter((x, i) => i % 2);
      let visible = partes.map((x, i) => (i % 2 ? '\u0000' : x)).join('');
      visible = transformarHtmlVisible(aplicarPares(visible, pares, rel));
      let k = 0;
      t = visible.replace(/\u0000/g, () => guardados[k++]);
    } else if (nombre.endsWith('.webmanifest')) t = aplicarMarcas(t).replace(/Stick By You/g, 'Tu pelo, tu mundo');
    if (nombre.endsWith('.js')) for (const [viejo, nuevo] of javascript) if (t.includes(viejo)) { t = t.split(viejo).join(nuevo); usadasJs.add(viejo); }
    t = cambiarColores(t);
    t = imagenes.reescribirTexto(t, rel);
    if (t !== antes) { fs.writeFileSync(p, t); cambiados++; }
  }
}
procesar(DESTINO);

// 5) Imágenes
const nImg = imagenes.aplicar(DESTINO);

const sinUsar = Object.keys(frases).filter((k) => !usadas.has(k));
console.log(`Listo: ${cambiados} archivos de texto modificados, ${nImg} imágenes reemplazadas.`);
console.log(`HTML animado: ${paresOk} bloques cambiados, ${paresFaltan} no encontrados.`);
const jsSinUsar = javascript.filter(([v]) => !usadasJs.has(v)).map(([v]) => v);
if (jsSinUsar.length) console.log('Ojo, estos textos de JavaScript no se encontraron:', jsSinUsar);
if (process.argv.includes('--detalle') && sinUsar.length) console.log('Frases del diccionario que no aparecieron en los datos:', sinUsar);
