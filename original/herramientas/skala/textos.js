// Recorre el árbol de React que viene en los datos RSC y reemplaza textos.
// Muchos textos están "cortados" para animarlos: una <span> por letra (clip > char), una por palabra
// (body-clip > body-rise) o palabras que adentro tienen letras (word > clip > char).
// Acá se reconoce esa secuencia y se la vuelve a armar con otro texto, copiando la forma de las piezas.
'use strict';

const esElemento = (n) =>
  Array.isArray(n) && n[0] === '$' && typeof n[1] === 'string' && n.length === 4 && n[3] !== null && typeof n[3] === 'object';

const clonar = (x) => JSON.parse(JSON.stringify(x));

// Texto completo (concatenado) de un nodo
function textoTotal(n) {
  if (typeof n === 'string') return n.startsWith('$') ? '' : n;
  if (Array.isArray(n)) {
    if (esElemento(n)) return n[3].children === undefined ? '' : textoTotal(n[3].children);
    return n.map(textoTotal).join('');
  }
  return '';
}

// ¿Es un array con piezas cortadas? Devuelve la lista de piezas o null.
// Pieza: elemento con texto, o separador (" ", null).
function piezasDe(arr) {
  if (!Array.isArray(arr) || esElemento(arr) || arr.length < 2) return null;
  let elementos = 0;
  for (const it of arr) {
    if (it === null || it === undefined || it === false) continue;
    if (typeof it === 'string') {
      if (it.trim() !== '') return null;
      continue;
    }
    if (!esElemento(it)) return null;
    const t = textoTotal(it);
    if (t === '' || t.length > 30 || /\s\S/.test(t.trim())) return null;
    elementos++;
  }
  return elementos >= 2 ? arr : null;
}

// Dentro de un elemento, el primer array "cortado" (búsqueda en profundidad)
function primerCortado(n) {
  if (Array.isArray(n) && !esElemento(n)) {
    if (piezasDe(n)) return n;
    for (const h of n) {
      const r = primerCortado(h);
      if (r) return r;
    }
    return null;
  }
  if (esElemento(n)) return primerCortado(n[3].children);
  return null;
}

// Pone texto en la "hoja" de un elemento (baja por children únicos)
function ponerHoja(el, texto) {
  let n = el;
  while (esElemento(n) && esElemento(n[3].children)) n = n[3].children;
  if (esElemento(n)) n[3].children = texto;
}

// Una pieza "palabra" puede tener letras adentro (un array cortado)
function rellenarPieza(molde, texto) {
  const copia = clonar(molde);
  const interno = primerCortado(copia);
  if (interno && [...texto].length >= 1 && textoTotal(molde).length > 1) {
    const nuevo = rellenar(interno, texto);
    interno.length = 0;
    interno.push(...nuevo);
  } else ponerHoja(copia, texto);
  return copia;
}

// Arma de nuevo un array cortado con otro texto
function rellenar(arr, nuevo) {
  const els = arr.filter(esElemento);
  const porLetra = els.every((e) => [...textoTotal(e)].length === 1);
  const molde = els.find((e) => textoTotal(e).trim() !== '') || els[0];
  const moldeEspacio = els.find((e) => textoTotal(e).trim() === '');
  const separador = arr.find((x) => typeof x === 'string');
  const salida = [];
  if (arr[0] === null) salida.push(null);
  const fichas = porLetra ? [...nuevo] : nuevo.split(/\s+/).filter(Boolean);
  const inicio = molde[3].style && typeof molde[3].style['--i'] === 'number' ? els[0][3].style?.['--i'] ?? 0 : null;
  const prefijoClave = typeof molde[2] === 'string' && /^\d+-\d+$/.test(molde[2]) ? molde[2].split('-')[0] + '-' : '';
  // a veces el espacio entre palabras va como última letra de cada palabra ("THAT'S " + "WHY")
  const espacioFinal = !porLetra && separador === undefined ? (els.map((e) => textoTotal(e)).find((t) => /\s$/.test(t)) || '').slice(-1) : '';
  if (espacioFinal) fichas.forEach((f, k) => { if (k < fichas.length - 1) fichas[k] = f + espacioFinal; });
  fichas.forEach((f, k) => {
    if (!porLetra && k > 0) {
      if (separador !== undefined) salida.push(separador);
      else if (moldeEspacio) salida.push(clonar(moldeEspacio));
    }
    let pieza;
    if (porLetra && f.trim() === '' && moldeEspacio) pieza = clonar(moldeEspacio);
    else pieza = rellenarPieza(molde, f);
    if (pieza[2] !== null) pieza[2] = prefijoClave ? prefijoClave + k : String(k);
    if (inicio !== null && pieza[3].style) pieza[3].style = { ...pieza[3].style, '--i': inicio + k };
    salida.push(pieza);
  });
  return salida;
}

// Reemplaza todo el contenido cortado de un elemento (p. ej. el que tiene aria-label) por otro texto:
// se queda con la primera "línea", la llena con el texto nuevo y borra las demás.
// pares: lista donde se anotan [htmlViejo, htmlNuevo] para corregir también el HTML grabado.
// Todos los arrays cortados de un elemento, en orden (sin entrar en uno ya encontrado): cada uno es un renglón
function todosCortados(n, salida = []) {
  if (Array.isArray(n) && !esElemento(n)) {
    if (piezasDe(n)) { salida.push(n); return salida; }
    for (const h of n) todosCortados(h, salida);
  } else if (esElemento(n)) todosCortados(n[3].children, salida);
  return salida;
}

// Reparte un texto en n renglones de largo parecido, sin cortar palabras
function repartir(texto, n) {
  const palabras = texto.split(/\s+/).filter(Boolean);
  if (palabras.length <= n) return Array.from({ length: n }, (_, i) => palabras[i] || '');
  const lineas = [];
  let resto = palabras;
  for (let i = n; i > 1; i--) {
    const objetivo = resto.join(' ').length / i;
    let actual = resto[0], k = 1;
    while (k < resto.length - (i - 1) && Math.abs((actual + ' ' + resto[k]).length - objetivo) <= Math.abs(actual.length - objetivo)) actual += ' ' + resto[k++];
    lineas.push(actual);
    resto = resto.slice(k);
  }
  lineas.push(resto.join(' '));
  return lineas;
}

function reescribirElemento(el, nuevo, pares = []) {
  const props = el[3];
  const hijos = props.children;
  const cortado = primerCortado(hijos);
  if (!cortado) {
    if (typeof hijos === 'string') { props.children = nuevo; return true; }
    return reescribirTramos(hijos, nuevo, pares);
  }
  // Si el texto está en varios renglones, se reparte el nuevo en la misma cantidad (así no se rompe el diseño)
  const renglones = todosCortados(hijos);
  if (renglones.length > 1) {
    repartir(nuevo, renglones.length).forEach((texto, i) => {
      const r = renglones[i];
      const viejo = aHtml(r);
      const lleno = rellenar(r, texto);
      r.length = 0;
      r.push(...lleno);
      const nuevoHtml = aHtml(r);
      if (viejo && nuevoHtml) pares.push([viejo, nuevoHtml]);
    });
    return true;
  }
  const viejoHtml = aHtml(cortado);
  const lleno = rellenar(cortado, nuevo);
  // Quitar las otras líneas: en cada array del camino hasta "cortado" se deja solo la rama que lo contiene
  const borrados = [];
  podar(hijos, cortado, borrados);
  cortado.length = 0;
  cortado.push(...lleno);
  const nuevoHtml = aHtml(cortado);
  if (viejoHtml && nuevoHtml) pares.push([viejoHtml, nuevoHtml]);
  for (const b of borrados) {
    const h = aHtml(b);
    if (h) pares.push([h, '']);
  }
  return true;
}

// Letras cortadas mezcladas con imágenes (p. ej. "TO [imagen] CREATE"): cada tramo de letras seguidas
// se llena con una palabra del texto nuevo. Solo si la cantidad de palabras coincide con la de tramos.
function reescribirTramos(hijos, nuevo, pares) {
  if (!Array.isArray(hijos) || esElemento(hijos)) return false;
  const tramos = [];
  let actual = null;
  hijos.forEach((h, i) => {
    const t = esElemento(h) ? textoTotal(h) : null;
    if (t !== null && [...t].length === 1 && t.trim() !== '') {
      if (!actual) tramos.push((actual = { desde: i, hasta: i }));
      else actual.hasta = i;
    } else actual = null;
  });
  const palabras = nuevo.split(/\s+/).filter(Boolean);
  if (tramos.length === 0 || tramos.length !== palabras.length) return false;
  for (let k = tramos.length - 1; k >= 0; k--) {
    const { desde, hasta } = tramos[k];
    const viejos = hijos.slice(desde, hasta + 1);
    const nuevos = rellenar(viejos, palabras[k]);
    const a = aHtml(viejos), b = aHtml(nuevos);
    if (a && b) pares.push([a, b]);
    hijos.splice(desde, hasta - desde + 1, ...nuevos);
  }
  return true;
}

function contiene(n, objetivo) {
  if (n === objetivo) return true;
  if (Array.isArray(n)) return n.some((h) => contiene(h, objetivo));
  if (n && typeof n === 'object') return contiene(n.children, objetivo);
  return false;
}

function podar(n, objetivo, borrados = []) {
  if (n === objetivo || !n) return;
  if (Array.isArray(n) && !esElemento(n)) {
    const i = n.findIndex((h) => contiene(h, objetivo));
    if (i < 0) return;
    for (let j = n.length - 1; j >= 0; j--) {
      if (j === i) continue;
      const h = n[j];
      // se borran las otras ramas con texto (líneas); se dejan nulls, espacios y elementos sin texto
      if (textoTotal(h).trim() !== '' || (typeof h === 'string' && h.startsWith('$L'))) borrados.push(...n.splice(j, 1));
    }
    podar(n[n.findIndex((h) => contiene(h, objetivo))], objetivo, borrados);
  } else if (esElemento(n)) podar(n[3].children, objetivo, borrados);
}

function recorrer(n, visitar, padre = null, clave = null) {
  if (visitar(n, padre, clave) === false) return;
  if (Array.isArray(n)) for (let i = 0; i < n.length; i++) recorrer(n[i], visitar, n, i);
  else if (n && typeof n === 'object') for (const k of Object.keys(n)) recorrer(n[k], visitar, n, k);
}

// Renderiza a HTML un pedacito del árbol, igual que lo hace React en el servidor, para poder buscar
// ese mismo HTML en la página grabada y cambiarlo. Si hay algo que no sabe dibujar devuelve null.
const escTexto = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
const ATR = { className: 'class', htmlFor: 'for' };
const VACIOS = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'area', 'col', 'embed', 'wbr', 'track']);
// Referencias que en cada archivo apuntan a React.Fragment (p. ej. "$1"); las completa aplicar.js
const FRAGMENTOS = new Set();
function aHtml(n) {
  const partes = [];
  let ultimoTexto = false;
  function ir(x) {
    if (x === null || x === undefined || x === false || x === true) return true;
    if (typeof x === 'string' || typeof x === 'number') {
      const s = String(x);
      if (s.startsWith('$')) return false;
      if (ultimoTexto) partes.push('<!-- -->');
      partes.push(escTexto(s));
      ultimoTexto = true;
      return true;
    }
    if (!Array.isArray(x)) return false;
    if (!esElemento(x)) return x.every(ir);
    const [, tag, , props] = x;
    if (FRAGMENTOS.has(tag)) return props.children === undefined || ir(props.children);
    if (tag.startsWith('$') || !/^[a-z][a-z0-9]*$/.test(tag)) return false;
    let atrs = '';
    for (const [k, v] of Object.entries(props)) {
      if (k === 'children' || v === undefined || v === null || v === false || typeof v === 'function') continue;
      if (k === 'style' && typeof v === 'object') {
        atrs += ` style="${escTexto(Object.entries(v).map(([a, b]) => `${a}:${b}`).join(';'))}"`;
        continue;
      }
      if (typeof v === 'object') return false;
      if (typeof v === 'string' && v.startsWith('$')) return false;
      atrs += ` ${ATR[k] || k}="${v === true ? '' : escTexto(String(v))}"`;
    }
    if (VACIOS.has(tag)) {
      partes.push(`<${tag}${atrs}/>`);
      ultimoTexto = false;
      return true;
    }
    partes.push(`<${tag}${atrs}>`);
    ultimoTexto = false;
    if (props.children !== undefined && !ir(props.children)) return false;
    partes.push(`</${tag}>`);
    ultimoTexto = false;
    return true;
  }
  return ir(n) ? partes.join('') : null;
}

module.exports = { FRAGMENTOS, aHtml, esElemento, textoTotal, piezasDe, primerCortado, rellenar, reescribirElemento, recorrer };
