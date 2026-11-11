
'use strict';
const fs = require('node:fs');
const path = require('node:path');

// ───────── Datos de cada producto (colores = los de cada página) ─────────
const PRODUCTOS = {
  cloth: { nombre: '#Mais Cachos', linea: 'RULOS', fondo: '#919cff', aro: '#2e3eac', tinta: '#141c63', claro: '#dfe3ff', palabra: 'DIOSA' },
  masking: { nombre: 'Divino Potão', linea: 'TRANSICIÓN', fondo: '#fcd805', aro: '#fa8005', tinta: '#6b2f00', claro: '#fff4b0', palabra: 'CREATIVA' },
  double: { nombre: 'Hidro-Nutritivo Plus', linea: 'HIDRATACIÓN', fondo: '#8bd8f5', aro: '#007db2', tinta: '#00405c', claro: '#dff5ff', palabra: 'SERENA' },
  opp: { nombre: 'Raízes do Morro', linea: 'FUERZA', fondo: '#ff8cc4', aro: '#c2185b', tinta: '#5c0a2c', claro: '#ffe0ef', palabra: 'PODEROSA' },
  'opp-quiet': { nombre: 'Crespinho Divino', linea: 'CRESPOS', fondo: '#ffe066', aro: '#a88700', tinta: '#4d3d00', claro: '#fff6c9', palabra: 'SEDOSA' },
  stationery: { nombre: '#Mais Cachinhos', linea: 'PARA CHICOS', fondo: '#ffb3a1', aro: '#a82712', tinta: '#5a1206', claro: '#ffe5de', palabra: 'PEQUE' },
};
const ORDEN = ['masking', 'double', 'stationery', 'cloth', 'opp', 'opp-quiet'];
const VIOLETA = '#451356';
const ROSA = '#ff4fa3';
const FUENTE = "'Arial Black','Segoe UI Black','Helvetica Neue',Impact,sans-serif";

// palabra de cada página (carpeta assets/words/<x>) → producto
const PALABRAS = { fixer: 'cloth', creative: 'masking', trusty: 'double', reliable: 'opp', silent: 'opp-quiet', buddy: 'stationery' };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function productoDe(nombre) {
  const n = decodeURIComponent(nombre).toLowerCase();
  if (/opp-quiet|no-noise|low-noise/.test(n)) return 'opp-quiet';
  if (/opp/.test(n)) return 'opp';
  if (/cloth/.test(n)) return 'cloth';
  if (/double/.test(n)) return 'double';
  if (/stationery|stationary/.test(n)) return 'stationery';
  if (/mask/.test(n)) return 'masking';
  return null;
}
function varianteDe(nombre) {
  const n = nombre.toLowerCase();
  if (/xtra-strong/.test(n)) return 'SHAMPOO';
  if (/strong|cello|black/.test(n)) return '250 G';
  return '1 KG';
}

// Parte un nombre en líneas cortas
function lineas(texto, max = 11) {
  const out = [];
  for (const p of texto.split(/\s+/)) {
    if (out.length && (out[out.length - 1] + ' ' + p).length <= max) out[out.length - 1] += ' ' + p;
    else out.push(p);
  }
  return out;
}

function svg(w, h, cuerpo, vb) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb || `0 0 ${w} ${h}`}">${cuerpo}</svg>`;
}

// Logo "skala" (texto en minúscula dentro de una pastilla)
function logoChico(cx, cy, alto, colorFondo, colorTexto) {
  const ancho = alto * 3.1;
  return `<g><rect x="${cx - ancho / 2}" y="${cy - alto / 2}" width="${ancho}" height="${alto}" rx="${alto / 2}" fill="${colorFondo}"/>` +
    `<text x="${cx}" y="${cy + alto * 0.3}" text-anchor="middle" font-family="${FUENTE}" font-weight="900" font-style="italic" font-size="${alto * 0.78}" fill="${colorTexto}" letter-spacing="${alto * 0.02}">skala</text></g>`;
}

// ───────── TAPA del pote vista desde arriba (reemplaza a los rollos de cinta) ─────────
function tapa(prod, variante, w, h) {
  const p = PRODUCTOS[prod];
  const id = 'arco' + prod.replace(/\W/g, '') + variante.replace(/\W/g, '');
  const nombre = lineas(p.nombre.replace(/-/g, '- '), 11).map((l) => l.replace(/- /g, '-'));
  const largo = Math.max(...nombre.map((l) => l.length));
  const fs = Math.min(150, 660 / (largo * 0.85));
  const y0 = 520 - ((nombre.length - 1) * fs * 0.95) / 2;
  const aro = variante === '250 G' ? p.tinta : p.aro;
  const cuerpo =
    `<defs><path id="${id}" d="M500 500 m-405 0 a405 405 0 1 1 810 0 a405 405 0 1 1 -810 0"/></defs>` +
    `<circle cx="512" cy="520" r="485" fill="#000" opacity=".18"/>` +
    `<circle cx="500" cy="500" r="485" fill="${aro}"/>` +
    `<circle cx="500" cy="500" r="355" fill="${p.fondo}"/>` +
    `<circle cx="500" cy="500" r="355" fill="none" stroke="#fff" stroke-width="10" opacity=".55"/>` +
    `<text font-family="${FUENTE}" font-weight="900" font-size="46" fill="#fff" letter-spacing="7"><textPath href="#${id}" startOffset="0">SKALA EXPERT • 100% VEGANO • CREMA 2 EN 1 • ${esc(p.linea)} •</textPath></text>` +
    logoChico(500, 255, 92, '#fff', aro) +
    nombre.map((l, i) => `<text x="500" y="${y0 + i * fs * 0.95}" text-anchor="middle" font-family="${FUENTE}" font-weight="900" font-size="${fs.toFixed(0)}" fill="${p.tinta}">${esc(l.toUpperCase())}</text>`).join('') +
    `<rect x="${500 - 150}" y="735" width="300" height="84" rx="42" fill="${aro}"/>` +
    `<text x="500" y="793" text-anchor="middle" font-family="${FUENTE}" font-weight="900" font-size="52" fill="#fff">${esc(variante)}</text>`;
  return svg(w, h, cuerpo, '0 0 1000 1000');
}

// ───────── POTE visto de costado ─────────
function pote(prod, cx, cy, alto, giro = 0, variante = '1 KG') {
  const p = PRODUCTOS[prod];
  const an = alto * 1.15;
  const tapaAlto = alto * 0.27;
  const x = cx - an / 2;
  const y = cy - alto / 2;
  const nombre = lineas(p.nombre, 11);
  const fs = Math.min(alto * 0.13, (an * 0.8) / (Math.max(...nombre.map((l) => l.length)) * 0.68));
  return `<g transform="rotate(${giro} ${cx} ${cy})">` +
    `<ellipse cx="${cx}" cy="${y + alto + alto * 0.03}" rx="${an * 0.55}" ry="${alto * 0.07}" fill="#000" opacity=".22"/>` +
    // cuerpo
    `<rect x="${x + an * 0.03}" y="${y + tapaAlto * 0.8}" width="${an * 0.94}" height="${alto - tapaAlto * 0.8}" rx="${an * 0.12}" fill="#fffaf5"/>` +
    `<rect x="${x + an * 0.03}" y="${y + tapaAlto * 1.15}" width="${an * 0.94}" height="${alto * 0.5}" fill="${p.fondo}"/>` +
    `<rect x="${x + an * 0.03}" y="${y + tapaAlto * 1.15}" width="${an * 0.94}" height="${alto * 0.05}" fill="${p.aro}"/>` +
    logoChico(cx, y + tapaAlto * 1.15 + alto * 0.13, alto * 0.1, '#fff', p.aro) +
    nombre.map((l, i) => `<text x="${cx}" y="${y + tapaAlto * 1.15 + alto * 0.29 + i * fs}" text-anchor="middle" font-family="${FUENTE}" font-weight="900" font-size="${fs.toFixed(1)}" fill="${p.tinta}">${esc(l.toUpperCase())}</text>`).join('') +
    `<text x="${cx}" y="${y + alto * 0.92}" text-anchor="middle" font-family="${FUENTE}" font-weight="900" font-size="${(alto * 0.07).toFixed(1)}" fill="${p.aro}">${esc(variante)}</text>` +
    `<rect x="${x + an * 0.1}" y="${y + tapaAlto * 1.3}" width="${an * 0.06}" height="${alto * 0.55}" rx="${an * 0.03}" fill="#fff" opacity=".35"/>` +
    // tapa
    `<rect x="${x}" y="${y}" width="${an}" height="${tapaAlto}" rx="${tapaAlto * 0.25}" fill="${p.aro}"/>` +
    Array.from({ length: 9 }, (_, i) => `<rect x="${x + an * (0.06 + i * 0.105)}" y="${y + tapaAlto * 0.15}" width="${an * 0.035}" height="${tapaAlto * 0.7}" rx="${an * 0.017}" fill="#000" opacity=".12"/>`).join('') +
    `<rect x="${x}" y="${y}" width="${an}" height="${tapaAlto * 0.25}" rx="${tapaAlto * 0.12}" fill="#fff" opacity=".25"/>` +
    `</g>`;
}

// Decoraciones: rulos (espirales), estrellitas y corazones
function adornos(w, h, color, semilla) {
  let s = semilla * 9301 + 49297;
  const azar = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const m = Math.min(w, h);
  let out = '';
  for (let i = 0; i < 7; i++) {
    const x = azar() * w, y = azar() * h, r = m * (0.03 + azar() * 0.05);
    const tipo = i % 3;
    if (tipo === 0) out += `<path d="M${x} ${y} c${r} ${-r} ${2 * r} ${r} ${r} ${1.6 * r} s${-2.2 * r} ${-0.4 * r} ${-1.4 * r} ${-2.4 * r} s${2.6 * r} ${-1.4 * r} ${3 * r} ${0.6 * r}" fill="none" stroke="${color}" stroke-width="${m * 0.012}" stroke-linecap="round" opacity=".8"/>`;
    else if (tipo === 1) out += `<path d="M${x} ${y - r} L${x + r * 0.28} ${y - r * 0.28} L${x + r} ${y} L${x + r * 0.28} ${y + r * 0.28} L${x} ${y + r} L${x - r * 0.28} ${y + r * 0.28} L${x - r} ${y} L${x - r * 0.28} ${y - r * 0.28}Z" fill="#fff" opacity=".9"/>`;
    else out += `<path d="M${x} ${y + r * 0.9} C${x - r * 1.6} ${y - r * 0.2} ${x - r * 0.6} ${y - r * 1.4} ${x} ${y - r * 0.4} C${x + r * 0.6} ${y - r * 1.4} ${x + r * 1.6} ${y - r * 0.2} ${x} ${y + r * 0.9}Z" fill="${ROSA}" opacity=".85"/>`;
  }
  return out;
}

// ───────── ESCENA: pote grande sobre fondo de color (reemplaza a las fotos "en acción") ─────────
function escena(prod, w, h, semilla = 1) {
  const p = PRODUCTOS[prod];
  const m = Math.min(w, h);
  const fondos = [p.fondo, p.claro, p.aro];
  const fondo = fondos[semilla % 3];
  const tinta = fondo === p.aro ? '#fff' : p.aro;
  const giro = [-8, 6, -4, 10][semilla % 4];
  return svg(w, h,
    `<rect width="${w}" height="${h}" fill="${fondo}"/>` +
    `<circle cx="${w * 0.5}" cy="${h * 0.5}" r="${m * 0.42}" fill="#fff" opacity=".28"/>` +
    `<circle cx="${w * 0.18}" cy="${h * 0.2}" r="${m * 0.16}" fill="${p.claro}" opacity=".5"/>` +
    adornos(w, h, tinta, semilla) +
    pote(prod, w * 0.5, h * 0.52, m * 0.5, giro));
}

// ───────── GRUPO: las seis cremas juntas ─────────
function grupo(w, h, semilla = 0) {
  const m = Math.min(w, h);
  const alto = m * 0.27;
  const pos = [[0.22, 0.36], [0.5, 0.3], [0.78, 0.36], [0.22, 0.7], [0.5, 0.66], [0.78, 0.7]];
  const fondo = [ROSA, '#ffd6ea', VIOLETA][semilla % 3];
  return svg(w, h,
    `<rect width="${w}" height="${h}" fill="${fondo}"/>` +
    `<circle cx="${w / 2}" cy="${h / 2}" r="${m * 0.47}" fill="#fff" opacity=".22"/>` +
    adornos(w, h, '#fff', semilla + 3) +
    ORDEN.map((k, i) => pote(k, w * pos[i][0], h * pos[i][1], alto, [-6, 3, 7, -3, 5, -7][i])).join('') +
    logoChico(w / 2, h * 0.93, m * 0.07, VIOLETA, '#fff'));
}

// ───────── LOGO ─────────
function logoGrande(w, h) {
  return svg(w, h,
    `<path d="M14 40 C10 12 40 6 95 8 C150 10 182 10 184 40 C186 72 182 108 120 110 C60 112 12 110 9 80 C7 64 16 56 14 40Z" fill="${VIOLETA}"/>` +
    `<text x="96" y="78" text-anchor="middle" font-family="${FUENTE}" font-weight="900" font-style="italic" font-size="50" fill="#fff" stroke="${ROSA}" stroke-width="3" paint-order="stroke">skala</text>`,
    '0 0 191 118');
}
function logoSello(w, h) {
  return svg(w, h,
    `<text x="69" y="60" text-anchor="middle" font-family="${FUENTE}" font-weight="900" font-style="italic" font-size="44" fill="#8a8a8a" opacity=".85">skala</text>`,
    '0 0 139 92');
}
function icono(w, h) {
  return svg(w, h,
    `<circle cx="75" cy="75" r="72" fill="${ROSA}"/><text x="75" y="105" text-anchor="middle" font-family="${FUENTE}" font-weight="900" font-style="italic" font-size="96" fill="${VIOLETA}">s</text>`,
    '0 0 150 150');
}

// ───────── LETRAS gigantes de cada página de producto ─────────
function letra(ch, color, sombra, w, h) {
  return svg(w, h,
    ch.trim() === '' ? '' :
      `<text x="${w / 2 + w * 0.03}" y="${h * 0.86 + h * 0.03}" text-anchor="middle" font-family="${FUENTE}" font-weight="900" font-size="${h * 1.0}" textLength="${w * 0.94}" lengthAdjust="spacingAndGlyphs" fill="${sombra}">${esc(ch)}</text>` +
      `<text x="${w / 2}" y="${h * 0.86}" text-anchor="middle" font-family="${FUENTE}" font-weight="900" font-size="${h * 1.0}" textLength="${w * 0.94}" lengthAdjust="spacingAndGlyphs" fill="${color}">${esc(ch)}</text>`);
}

// ───────── Tamaño real de una imagen (para que la nueva tenga la misma forma) ─────────
function medidas(archivo) {
  try {
    const b = fs.readFileSync(archivo);
    if (b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP') {
      const t = b.slice(12, 16).toString();
      if (t === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
      if (t === 'VP8L') { const v = b.readUInt32LE(21); return [1 + (v & 0x3fff), 1 + ((v >> 14) & 0x3fff)]; }
      if (t === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    }
    if (b.readUInt32BE(0) === 0x89504e47) return [b.readUInt32BE(16), b.readUInt32BE(20)];
    if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length) {
        const marca = b[i + 1], largo = b.readUInt16BE(i + 2);
        if (marca >= 0xc0 && marca <= 0xc3) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
        i += 2 + largo;
      }
    }
    const t = b.slice(0, 2000).toString();
    const vb = /viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)"/.exec(t);
    if (vb) return [Math.round(+vb[1]), Math.round(+vb[2])];
  } catch { /* sin medidas */ }
  return [1000, 1000];
}

// ───────── Qué imagen nueva va en lugar de cada una ─────────
let nEscena = 0;
function nuevaImagen(url, w, h) {
  const nombre = decodeURIComponent(url.split('?')[0].split('/').pop());
  const prod = productoDe(url);

  const pal = /\/assets\/words\/([a-z]+)\/([A-Z])(2?)\.webp/.exec(url);
  if (pal && PALABRAS[pal[1]]) {
    // la letra en la posición correspondiente de la palabra nueva
    const k = PALABRAS[pal[1]];
    const original = pal[1].toUpperCase();
    const letraVieja = pal[2];
    let pos = -1, vistas = 0;
    for (let i = 0; i < original.length; i++) if (original[i] === letraVieja) { if (vistas === (pal[3] ? 1 : 0)) { pos = i; break; } vistas++; }
    const nueva = PRODUCTOS[k].palabra[pos] || ' ';
    return letra(nueva, PRODUCTOS[k].aro, PRODUCTOS[k].tinta, w, h);
  }
  if (/\/assets\/middle-([THE])\.webp/.test(url)) {
    const ch = { T: 'L', H: 'A', E: ' ' }[/middle-([THE])/.exec(url)[1]];
    return letra(ch, '#ffffff', VIOLETA, w, h);
  }
  if (/preloader-image\.svg/.test(url)) return logoGrande(w, h);
  if (/about-logo/.test(url)) return logoSello(w, h);
  if (/^\/icon\.svg|^\/icon__|apple-icon/.test(url)) return icono(w, h);
  if (/make-it-stick|front-cta|news-generations|news-needtostick|Basket/.test(nombre)) return grupo(w, h, nEscena++);
  if (!prod) return null;
  if (/-card\.|-roll\.|sibling-|footer-(cloth|double|mask|stationery)|red cloth tape|Cloth tape black|masking-circle/.test(nombre)) return tapa(prod, varianteDe(nombre), w, h);
  if (/^img-|-shot|create-|tapex4|opp-tape-last|protect-opp|mask-image|inner-product/.test(nombre)) return escena(prod, w, h, ++nEscena);
  return null;
}

// Dibujo repetido del centro (cartón) de los rollos 3D (texturas/nucleo.png se hizo a partir de este dibujo)
function nucleoSvg(w, h) {
  let logos = '';
  for (let fila = 0; fila < 3; fila++) {
    for (let col = -1; col < 5; col++) {
      const x = col * 512 + (fila % 2 ? 256 : 0) + 256, y = 85 + fila * 170;
      logos += `<g transform="rotate(-8 ${x} ${y})">${logoChico(x, y, 110, VIOLETA, '#fff')}</g>`;
    }
  }
  return svg(w, h, `<rect width="2048" height="503" fill="${ROSA}"/>${logos}`, '0 0 2048 503');
}

// Rutas que se arman en el texto (no hace falta tocarlas: las imágenes conservan su dirección)
function reescribirTexto(t) { return t; }

// ───────── Modelos 3D (.glb): se cambian las texturas de etiqueta y centro por los PNG de texturas/ ─────────
const TEXTURAS_GLB = {
  'Cloth-Tape.glb': { 'cloth-tape': 'etiqueta-cloth' },
  'Masking-Tape.glb': { 'Masking-Tape': 'etiqueta-masking' },
  'Double-Tape.glb': { 'Double-sided-tape': 'etiqueta-double' },
  'Low-Noise-Tape.glb': { 'opp-tape-low-noise': 'etiqueta-opp-quiet' },
  'Cello-Tape.glb': { 'stationary-tape': 'etiqueta-stationery' },
  'header-brown.glb': { 'header-tape-face-brown': 'etiqueta-opp' },
  'Header-Brown-Inner.glb': { 'header-tape-face-brown': 'etiqueta-opp' },
};
function cambiarGlb(archivo, cambios, carpetaTexturas) {
  const b = fs.readFileSync(archivo);
  const largoJson = b.readUInt32LE(12);
  const gltf = JSON.parse(b.slice(20, 20 + largoJson).toString('utf8'));
  const bin = b.slice(20 + largoJson + 8);
  // datos de cada bufferView
  const vistas = gltf.bufferViews.map((v) => bin.slice(v.byteOffset || 0, (v.byteOffset || 0) + v.byteLength));
  let n = 0;
  for (const img of gltf.images || []) {
    const nuevo = img.name === 'SWEET_TAPE_CORE' ? 'nucleo' : cambios[img.name];
    const png = nuevo && path.join(carpetaTexturas, nuevo + '.png');
    if (!png || !fs.existsSync(png)) continue;
    vistas[img.bufferView] = fs.readFileSync(png);
    img.mimeType = 'image/png';
    n++;
  }
  if (!n) return 0;
  // volver a armar el bloque binario (cada parte alineada a 4 bytes)
  const partes = [];
  let pos = 0;
  vistas.forEach((d, i) => {
    gltf.bufferViews[i].byteOffset = pos;
    gltf.bufferViews[i].byteLength = d.length;
    partes.push(d);
    const relleno = (4 - (d.length % 4)) % 4;
    if (relleno) partes.push(Buffer.alloc(relleno));
    pos += d.length + relleno;
  });
  gltf.buffers[0].byteLength = pos;
  let json = Buffer.from(JSON.stringify(gltf), 'utf8');
  if (json.length % 4) json = Buffer.concat([json, Buffer.alloc(4 - (json.length % 4), 0x20)]);
  const binario = Buffer.concat(partes);
  const cabecera = Buffer.alloc(12);
  cabecera.writeUInt32LE(0x46546c67, 0); cabecera.writeUInt32LE(2, 4);
  cabecera.writeUInt32LE(12 + 8 + json.length + 8 + binario.length, 8);
  const h1 = Buffer.alloc(8); h1.writeUInt32LE(json.length, 0); h1.writeUInt32LE(0x4e4f534a, 4);
  const h2 = Buffer.alloc(8); h2.writeUInt32LE(binario.length, 0); h2.writeUInt32LE(0x004e4942, 4);
  fs.writeFileSync(archivo, Buffer.concat([cabecera, h1, json, h2, binario]));
  return n;
}
function aplicarGlb(sitio) {
  const carpeta = path.join(__dirname, 'texturas');
  if (!fs.existsSync(carpeta)) return 0;
  let n = 0;
  for (const [glb, cambios] of Object.entries(TEXTURAS_GLB)) {
    const ruta = path.join(sitio, 'assets', 'tapes', glb);
    if (fs.existsSync(ruta)) n += cambiarGlb(ruta, cambios, carpeta);
  }
  return n;
}

function aplicar(sitio) {
  const carpeta = path.join(sitio, 'skala');
  fs.mkdirSync(carpeta, { recursive: true });
  const fotos = path.join(__dirname, 'fotos');
  const fotosHay = fs.existsSync(fotos) ? fs.readdirSync(fotos) : [];
  let cuenta = 0;
  for (const nombreManifiesto of ['_manifiesto.json', '_manifiesto-extra.json']) {
    const ruta = path.join(sitio, nombreManifiesto);
    if (!fs.existsSync(ruta)) continue;
    const man = JSON.parse(fs.readFileSync(ruta, 'utf8'));
    for (const [url, entrada] of Object.entries(man)) {
      if (!/^image\//.test(entrada.tipo || '') || url.startsWith('/_next/image')) continue;
      const base = decodeURIComponent(url.split('?')[0].split('/').pop()).replace(/\.[a-z0-9]+$/i, '');
      // ¿hay una foto real para esta imagen?
      const foto = fotosHay.find((f) => f.replace(/\.[a-z0-9]+$/i, '') === base);
      if (foto) {
        const destino = path.join(carpeta, foto);
        fs.copyFileSync(path.join(fotos, foto), destino);
        const ext = path.extname(foto).slice(1).toLowerCase();
        man[url] = { ...entrada, archivo: 'skala/' + foto, tipo: ext === 'svg' ? 'image/svg+xml' : 'image/' + (ext === 'jpg' ? 'jpeg' : ext) };
        cuenta++;
        continue;
      }
      const [w, h] = medidas(path.join(sitio, entrada.archivo));
      const nueva = nuevaImagen(url, w, h);
      if (!nueva) continue;
      const archivo = 'skala/' + url.replace(/^\//, '').replace(/[^a-zA-Z0-9.-]+/g, '_').replace(/\.[a-z]+(_|$)/i, '$1') + '.svg';
      fs.writeFileSync(path.join(sitio, archivo), nueva);
      man[url] = { ...entrada, archivo, tipo: 'image/svg+xml' };
      cuenta++;
    }
    fs.writeFileSync(ruta, JSON.stringify(man, null, 1));
  }
  return cuenta + aplicarGlb(sitio);
}

module.exports = { reescribirTexto, aplicar, PRODUCTOS, tapaSvg: tapa, nucleoSvg };
