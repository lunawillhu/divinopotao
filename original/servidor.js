// Servidor local de la copia de sweet-tape.com, sin dependencias (solo Node).
// La copia es una "grabación": herramientas/grabar-sitio.js recorrió el sitio real con un navegador y guardó cada
// respuesta en sitio/, con sitio/_manifiesto.json diciendo qué archivo corresponde a cada URL.
// Este servidor responde lo mismo que el sitio real:
// - páginas, JS, CSS, imágenes y modelos 3D por su URL (con query, p. ej. ?v=… o /_next/image?url=…&w=…);
// - los pedidos RSC de Next.js (header "RSC: 1", cuando se navega sin recargar) según su variante;
// - las URL de otros servidores (fuentes de Adobe) se reescriben a /__ext_/<host>/… (mismo largo que "https://",
//   para no romper los datos de React, que guardan largos de texto) y se sirven desde la copia;
// - Google Analytics apunta a /__ext_/… y recibe una respuesta vacía: no sale nada a internet.
// Uso: node servidor.js   (puerto 8092, o PORT=xxxx)
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, 'sitio');
const PUERTO = Number(process.env.PORT) || 8092;
const manifiesto = JSON.parse(fs.readFileSync(path.join(RAIZ, '_manifiesto.json'), 'utf8'));
const extra = fs.existsSync(path.join(RAIZ, '_manifiesto-extra.json'))
  ? JSON.parse(fs.readFileSync(path.join(RAIZ, '_manifiesto-extra.json'), 'utf8'))
  : {};
Object.assign(manifiesto, extra);

// Hosts externos que se sirven desde la copia, más los de estadísticas (que se apagan)
const APAGADOS = ['www.googletagmanager.com', 'www.google-analytics.com', 'p.typekit.net'];
const EXTERNOS = new Set(APAGADOS);
for (const k of Object.keys(manifiesto)) if (k.startsWith('/__ext_/')) EXTERNOS.add(k.split('/')[2]);
const REESCRIBIR = new RegExp('https://(' + [...EXTERNOS].map((h) => h.replace(/\./g, '\\.')).join('|') + ')(?=[/"\'\\\\])', 'g');
const ES_TEXTO = /text\/|javascript|json|x-component|svg/;

// Índices para las búsquedas aproximadas
const rscPorRuta = {};
const imagenPorUrl = {};
for (const [k, v] of Object.entries(manifiesto)) {
  if (k.includes(' |rsc| ')) {
    const [ruta, variante] = k.split(' |rsc| ');
    (rscPorRuta[ruta] ||= {})[variante] = v;
  } else if (k.startsWith('/_next/image?')) {
    const u = new URLSearchParams(k.split('?')[1]).get('url');
    const w = Number(new URLSearchParams(k.split('?')[1]).get('w')) || 0;
    if (!imagenPorUrl[u] || imagenPorUrl[u].w < w) imagenPorUrl[u] = { w, v };
  }
}

function variante(h) {
  if (h['next-router-segment-prefetch']) return 'seg:' + h['next-router-segment-prefetch'];
  if (h['next-router-prefetch']) return 'prefetch';
  return 'full';
}

function buscar(req) {
  const u = new URL(req.url, 'http://local');
  u.searchParams.delete('_rsc');
  const ruta = u.pathname;
  const conQuery = ruta + (u.searchParams.toString() ? '?' + u.searchParams.toString() : '');
  if (req.headers.rsc === '1') {
    const deRuta = rscPorRuta[conQuery] || rscPorRuta[ruta];
    if (!deRuta) return null;
    const pedida = variante(req.headers);
    return deRuta[pedida] || (pedida.startsWith('seg:') ? null : deRuta.full) || null;
  }
  if (manifiesto[conQuery]) return manifiesto[conQuery];
  // Query sin "=" (p. ej. ?apple-icon.2fms….png): URLSearchParams le agrega "=", así que se prueba tal cual
  const crudo = ruta + new URL(req.url, 'http://local').search;
  if (manifiesto[crudo]) return manifiesto[crudo];
  if (ruta === '/_next/image') {
    const img = imagenPorUrl[u.searchParams.get('url')];
    return img ? img.v : null;
  }
  return manifiesto[ruta] || null; // mismo archivo con otro ?v=…
}

function enviar(req, res, archivo, tipo, estado = 200) {
  const ruta = path.join(RAIZ, archivo);
  if (!ruta.startsWith(RAIZ) || !fs.existsSync(ruta)) return false;
  const cabeceras = { 'Content-Type': tipo, 'Cache-Control': 'no-cache' };
  if (ES_TEXTO.test(tipo)) {
    // Reescritura del mismo largo: "https://" y "/__ext_/" tienen 8 caracteres
    const texto = fs.readFileSync(ruta, 'utf8').replace(REESCRIBIR, '/__ext_/$1');
    const cuerpo = Buffer.from(texto, 'utf8');
    if (tipo.includes('x-component')) {
      // El sitio real no manda charset y el navegador puede leerlo mal: acá se aclara UTF-8
      cabeceras['Content-Type'] = 'text/x-component; charset=utf-8';
      cabeceras.Vary = 'RSC, Next-Router-State-Tree, Next-Router-Prefetch';
    }
    res.writeHead(estado, { ...cabeceras, 'Content-Length': cuerpo.length });
    return res.end(req.method === 'HEAD' ? undefined : cuerpo), true;
  }
  const tamano = fs.statSync(ruta).size;
  const rango = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (rango) {
    const inicio = rango[1] ? Number(rango[1]) : tamano - Number(rango[2]);
    const fin = rango[1] && rango[2] ? Math.min(Number(rango[2]), tamano - 1) : tamano - 1;
    res.writeHead(206, { ...cabeceras, 'Content-Length': fin - inicio + 1, 'Content-Range': `bytes ${inicio}-${fin}/${tamano}`, 'Accept-Ranges': 'bytes' });
    fs.createReadStream(ruta, { start: inicio, end: fin }).pipe(res);
    return true;
  }
  res.writeHead(estado, { ...cabeceras, 'Content-Length': tamano, 'Accept-Ranges': 'bytes' });
  if (req.method === 'HEAD') res.end();
  else fs.createReadStream(ruta).pipe(res);
  return true;
}

http
  .createServer((req, res) => {
    const urlPath = new URL(req.url, 'http://local').pathname;
    if (req.method === 'POST') {
      // Formularios: no se mandan a ningún lado (ver README.md)
      let cuerpo = '';
      req.on('data', (d) => (cuerpo += d).length > 1e6 && req.destroy());
      return req.on('end', () => {
        console.log(new Date().toLocaleString('es-AR'), 'POST', req.url, cuerpo.slice(0, 500));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      });
    }
    if (urlPath.startsWith('/__ext_/') && APAGADOS.includes(urlPath.split('/')[2])) {
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      return res.end('');
    }
    const hallado = buscar(req);
    if (hallado && enviar(req, res, hallado.archivo, hallado.tipo)) return;
    if (req.headers.rsc !== '1') {
      // Archivo suelto en sitio/ que no esté en el manifiesto
      for (const c of [urlPath, path.posix.join(urlPath, 'index.html')]) {
        const r = path.join(RAIZ, decodeURIComponent(c));
        if (r.startsWith(RAIZ) && fs.existsSync(r) && fs.statSync(r).isFile()) {
          const ext = path.extname(r).toLowerCase();
          const tipos = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
          return enviar(req, res, path.relative(RAIZ, r), tipos[ext] || 'application/octet-stream');
        }
      }
    }
    console.log('falta', req.headers.rsc === '1' ? '(RSC ' + variante(req.headers) + ')' : '', req.url);
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('No está en la copia local: ' + req.url);
  })
  .listen(PUERTO, '127.0.0.1', () => console.log(`SweetTape (copia local): http://127.0.0.1:${PUERTO}`));
