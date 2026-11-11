// Lee y escribe los datos RSC ("flight") de Next.js que guarda la grabación.
// Formato: filas "id:contenido\n". El contenido puede ser JSON, I[...] (módulo), HL[...] (pista)
// o T<largo hex>,<texto> (texto crudo de ese largo en bytes, que puede tener saltos de línea).
'use strict';

function parsear(texto) {
  const buf = Buffer.from(texto, 'utf8');
  const filas = [];
  let i = 0;
  while (i < buf.length) {
    const dosPuntos = buf.indexOf(0x3a, i); // ':'
    if (dosPuntos < 0) { filas.push({ crudo: buf.slice(i).toString('utf8') }); break; }
    const id = buf.slice(i, dosPuntos).toString('utf8');
    const resto = dosPuntos + 1;
    // Fila de texto: T<hex>,
    const m = /^T([0-9a-f]+),/.exec(buf.slice(resto, resto + 20).toString('latin1'));
    if (m) {
      const largo = parseInt(m[1], 16);
      const ini = resto + m[0].length;
      filas.push({ id, tipo: 'T', texto: buf.slice(ini, ini + largo).toString('utf8') });
      i = ini + largo;
      continue;
    }
    let fin = buf.indexOf(0x0a, resto);
    if (fin < 0) fin = buf.length;
    const contenido = buf.slice(resto, fin).toString('utf8');
    let json;
    if (/^[\[{"\d\-tfn]/.test(contenido)) {
      try { json = JSON.parse(contenido); } catch { json = undefined; }
    }
    if (json !== undefined) filas.push({ id, tipo: 'J', json });
    else filas.push({ id, tipo: 'X', contenido });
    i = fin + 1;
  }
  return filas;
}

function serializar(filas) {
  let out = '';
  for (const f of filas) {
    if (f.crudo !== undefined) out += f.crudo;
    else if (f.tipo === 'T') out += `${f.id}:T${Buffer.byteLength(f.texto, 'utf8').toString(16)},${f.texto}`;
    else if (f.tipo === 'J') out += `${f.id}:${JSON.stringify(f.json)}\n`;
    else out += `${f.id}:${f.contenido}\n`;
  }
  return out;
}

// HTML: los datos van en <script>self.__next_f.push([1,"..."])</script>
const RE_PUSH = /<script>self\.__next_f\.push\(\[1,("(?:[^"\\]|\\.)*")\]\)<\/script>/g;

function extraerDeHtml(html) {
  let datos = '';
  for (const m of html.matchAll(RE_PUSH)) datos += JSON.parse(m[1]);
  return datos;
}

function escaparScript(s) {
  return JSON.stringify(s)
    .replace(/</g, '\\u003c')
    .replace(new RegExp(String.fromCharCode(0x2028), 'g'), '\\u2028')
    .replace(new RegExp(String.fromCharCode(0x2029), 'g'), '\\u2029');
}

function reemplazarEnHtml(html, datosNuevos) {
  let primero = true;
  return html.replace(RE_PUSH, () => {
    if (!primero) return '';
    primero = false;
    return `<script>self.__next_f.push([1,${escaparScript(datosNuevos)}])</script>`;
  });
}

module.exports = { parsear, serializar, extraerDeHtml, reemplazarEnHtml };
