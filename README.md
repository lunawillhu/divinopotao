# Versión Skala (trabajo práctico)

Esta copia ya está **convertida a Skala** (cremas para el pelo): textos en español, colores rosa/violeta, y las
imágenes de producto reemplazadas por dibujos propios de potes y tapas. Se prende igual que siempre (`npm start`
dentro de `original`, y abrir http://127.0.0.1:8092). Es un ejercicio de clase: **no es el sitio oficial de Skala
y no se publica**.

| Página | Antes (Sweet Tape) | Ahora (Skala) |
|---|---|---|
| `/products/cloth` | Cloth tape · The Fixer | #Mais Cachos · La Diosa |
| `/products/masking` | Masking tape · The Creative | Divino Potão · La Creativa |
| `/products/double` | Double-sided · The Trusty | Hidro-Nutritivo Plus · La Serena |
| `/products/opp` | OPP tape · The Reliable | Raízes do Morro · La Poderosa |
| `/products/opp-quiet` | OPP low noise · The Silent | Crespinho Divino · La Sedosa |
| `/products/stationery` | Stationery · The Buddy | #Mais Cachinhos · La Peque |

### Cómo cambiar algo (todo está en `original/herramientas/skala/`)
- **Textos** → `textos-skala.js`: a la izquierda el texto original en inglés, a la derecha el nuevo.
- **Colores** → `colores.js`: color viejo → color nuevo (siempre `#rrggbb`).
- **Imágenes** → `imagenes.js` (nombres, colores y palabra gigante de cada producto, en `PRODUCTOS`). Para usar una
  **foto real**, guardala en `herramientas/skala/fotos/` con el mismo nombre que la imagen original
  (por ejemplo `cloth-card.png` reemplaza a `cloth-card.webp`).
- **Etiquetas de los rollos 3D** → los PNG de `herramientas/skala/texturas/` (se meten dentro de los `.glb`).

Después de cambiar algo, parado en `original`:
```
node herramientas/skala/aplicar.js
```
y reiniciá el servidor (`Ctrl + C` y `npm start`). Para ver si quedó algo en inglés:
```
node herramientas/skala/listar-textos.js
```

**Cómo funciona:** la primera vez, `aplicar.js` guardó la grabación original intacta en `original/sitio-sweettape/`.
Cada vez que se corre, copia esa original a `sitio/` y le aplica los cambios: traduce los textos dentro de los datos
de React (RSC) y del HTML (incluidos los títulos animados letra por letra), cambia los colores en CSS/JS, dibuja
las imágenes nuevas como SVG en `sitio/skala/` y hace que el manifiesto apunte a ellas. Para volver a Sweet Tape
alcanza con borrar `sitio/` y renombrar `sitio-sweettape/` a `sitio/`.

**Pendiente / no cambiado:** algunas fotos "de época" de la página Nosotros (el diario, la fábrica, la canasta),
las tiras de cinta que decoran las fotos, los sonidos y la forma 3D (sigue siendo un rollo, con etiqueta Skala).

---

# SweetTape — copia local de sweet-tape.com

Calco del sitio https://sweet-tape.com/ (cintas adhesivas de Malasia, SB Tape Group), grabado el 20/10/2026 para
estudiarlo en clase. **No publicarlo**: textos, fotos, modelos 3D, sonidos, logo y código son de SB Tape Group;
las tipografías son de Adobe Fonts (con licencia para ese dominio).

## Prenderla
Necesitás **Node.js 22.12 o más nuevo** (recomendado 24): https://nodejs.org. Para ver qué versión tenés, escribí
`node -v` en PowerShell. No hace falta `npm install`, Docker ni base de datos.

### Paso 0 · Abrir la terminal en la carpeta correcta

1. Abrí la carpeta `epet20-sweet-tape` y adentro entrá a la carpeta **`original`** (la que tiene `package.json`).
2. Hacé clic derecho en un espacio vacío de la carpeta → **«Abrir en Terminal»**.
   (En Windows 10: mantené apretada la tecla **Shift**, clic derecho → «Abrir la ventana de PowerShell aquí».)
3. Se abre una ventana azul o negra. La línea de la izquierda tiene que terminar en `original>`, por ejemplo:
   ```
   PS C:\Users\Alumno\Downloads\epet20-sweet-tape\original>
   ```

**Cómo escribir los comandos:** cada bloque gris de abajo es un comando. Copiá **solo el texto del comando** (si abrís este archivo en el Bloc de notas y ves líneas con tres comillas al revés arriba y abajo, esas no se copian), pegalo en la terminal
(clic derecho o `Ctrl + V`), apretá **Enter** y esperá a que termine: termina cuando vuelve a aparecer la línea
`PS C:\...>`. Recién ahí pegás el siguiente.

### Paso 1 · Prender la página

```
npm start
```
Abrí el navegador en **http://127.0.0.1:8092**. La terminal **no vuelve** a la línea `PS C:\...>`: queda ocupada mientras la
página está prendida. Es normal; no la cierres. El servidor (`original/servidor.js`) usa solo Node.

**Apagar:** apretá `Ctrl + C` en la terminal. **Las veces siguientes:** lo mismo, paso 0 y paso 1.

**Si algo falla**
- **`npm` o `node` «no se reconoce como nombre de un cmdlet»**: falta instalar Node.js, o hay que cerrar y volver a
  abrir la terminal después de instalarlo.
- **`npm error enoent Could not read package.json`**: la terminal no está en la carpeta `original`. Volvé al paso 0.

## Cómo se hizo (es distinto a una plantilla; todo está dentro de `original/`)
El sitio es **Next.js** (con Turbopack) + **Payload CMS**: no hay código fuente para bajar, solo lo que el servidor
le manda al navegador. Por eso se **grabó**:
1. `herramientas/grabar-sitio.js` abre cada página del `sitemap.xml` en Edge (con Puppeteer), a lo ancho de compu y
   de celular, baja hasta el final, pasa el mouse por links y botones, y guarda **cada respuesta** en `sitio/`.
   También pide los datos de navegación de Next.js (RSC) de cada página. Arma `sitio/_manifiesto.json`.
   No entra a `/admin`, `/lab` ni recorre `/api` (lo prohíbe su `robots.txt`); solo guarda las imágenes de
   `/api/media/file/…` que las páginas muestran.
2. `herramientas/completar-sitio.js` busca en el JS/CSS rutas a archivos que el recorrido no disparó (los 13
   sonidos, modelos 3D) y los baja → `sitio/_manifiesto-extra.json`.
3. `herramientas/completar-iconos.js` baja íconos, `og.jpg`, `robots.txt` y `sitemap.xml`.
4. `herramientas/arreglar_codificacion.py` arregla los datos RSC: el sitio real los manda sin `charset`, el
   navegador los leyó como Windows-1252 y quedaban «BYÂ YOU» en vez de «BY YOU».

`servidor.js` contesta cada pedido con el archivo grabado para esa URL (también los pedidos RSC con header
`RSC: 1`, según su variante) y reescribe las URL de Adobe Fonts a `/__ext_/use.typekit.net/…`.

## Qué se cambió respecto al sitio real
- Google Analytics y el píxel de Adobe Fonts reciben una respuesta vacía: no sale nada a internet.
- El formulario de `/contact` manda a `POST /api/messages`; acá lo atiende `servidor.js`, que lo muestra en la
  consola y responde OK (la página muestra «SENT — WE'LL BE IN TOUCH»). Ahí se conectaría Express + MySQL.
- Los links a TikTok, Facebook e Instagram siguen apuntando afuera.

## Conocido
- `/assets/sticky-note.png` y `/assets/sounds/tape-cut.mp3` dan 404 también en el sitio real.
- Si el sitio real cambia (otro build de Next.js), la copia sigue siendo la del 20/10/2026.

## En criollo

**¿Cómo la prendo?** Abrís la terminal en `original`, escribís `npm start` y abrís el navegador en
**http://127.0.0.1:8092**. Una sola terminal, sin `npm install` y sin Docker.

**¿Por qué no hace falta instalar nada?** Esto no es el código fuente de la página: es una **grabación** de todo lo
que la página real le mandó al navegador (en `original/sitio`). El `servidor.js` es un programita de Node que, cuando
el navegador pide algo, le contesta con lo que se grabó para ese pedido. Node ya trae todo lo que necesita.

**¿El formulario de contacto guarda algo?** No: lo que mandás aparece en la terminal y nada más. Ahí es donde se
conectaría una API con Express y MySQL.

**Para apagar:** `Ctrl + C` en la terminal.
