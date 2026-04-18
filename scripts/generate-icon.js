/* eslint-disable */
const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico');

const src = path.resolve(__dirname, '../resources/icon.png');
const outDir = path.resolve(__dirname, '../build');
const out = path.resolve(outDir, 'icon.ico');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

pngToIco(src)
  .then(buffer => {
    fs.writeFileSync(out, buffer);
    console.log('Wrote', out);
  })
  .catch(err => {
    console.error('Error creating ico:', err);
    process.exit(1);
  });
