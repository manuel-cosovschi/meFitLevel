// Genera los iconos PWA como PNG reales sin dependencias externas.
// Dibuja el emblema del "Sistema": un rombo/gate con glow azul-violeta.
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "icons");
mkdirSync(OUT, { recursive: true });

// ---- CRC32 para chunks PNG ----
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}
function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  // raw scanlines con filtro 0
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));

function draw(size, { pad = 0.16 } = {}) {
  const buf = Buffer.alloc(size * size * 4);
  const c = (size - 1) / 2;
  const R = (size / 2) * (1 - pad);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x - c) / size;
      const ny = (y - c) / size;
      const dist = Math.sqrt(nx * nx + ny * ny);

      // Fondo oscuro con glow radial superior.
      const glow = Math.max(0, 1 - dist * 2.2);
      let r = lerp(7, 24, glow);
      let g = lerp(10, 35, glow);
      let b = lerp(18, 70, glow);

      // Métrica de rombo (diamante).
      const dval = (Math.abs(x - c) + Math.abs(y - c)) / R;
      // Gradiente cyan(top)->violeta(bottom) para los trazos.
      const ty = (y / size);
      const er = lerp(34, 139, ty);
      const eg = lerp(211, 92, ty);
      const eb = lerp(238, 246, ty);

      if (dval < 0.52) {
        // Relleno interior azul con leve degradé.
        const t = dval / 0.52;
        r = lerp(59, 37, t);
        g = lerp(130, 99, t);
        b = lerp(246, 200, t);
      } else if (dval >= 0.78 && dval <= 0.96) {
        // Anillo brillante del gate.
        const edge = 1 - Math.abs(dval - 0.87) / 0.09;
        r = lerp(r, er, Math.max(0.2, edge));
        g = lerp(g, eg, Math.max(0.2, edge));
        b = lerp(b, eb, Math.max(0.2, edge));
      } else if (dval > 0.52 && dval < 0.78) {
        // Halo interior tenue.
        const t = (0.78 - dval) / 0.26;
        r = lerp(r, er, 0.18 * t);
        g = lerp(g, eg, 0.18 * t);
        b = lerp(b, eb, 0.18 * t);
      }

      const i = (y * size + x) * 4;
      buf[i] = clamp(r);
      buf[i + 1] = clamp(g);
      buf[i + 2] = clamp(b);
      buf[i + 3] = 255;
    }
  }
  return encodePNG(size, size, buf);
}

const targets = [
  { name: "icon-192.png", size: 192, pad: 0.16 },
  { name: "icon-512.png", size: 512, pad: 0.16 },
  { name: "icon-maskable-512.png", size: 512, pad: 0.26 },
  { name: "apple-touch-icon.png", size: 180, pad: 0.14 },
];

for (const t of targets) {
  const png = draw(t.size, { pad: t.pad });
  writeFileSync(join(OUT, t.name), png);
  console.log("✓", t.name, `(${t.size}x${t.size}, ${png.length} bytes)`);
}
console.log("Iconos generados en public/icons/");
