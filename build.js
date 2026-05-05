const fs = require('fs');
const path = require('path');

const kokoPath = path.join(__dirname, 'koko baju.png');
const olahragaPath = path.join(__dirname, 'olahraga baju.png');
const templatePath = path.join(__dirname, 'index.template.html');
const outputPath = path.join(__dirname, 'index.html');
const getBase64 = (filename) => {
    return fs.readFileSync(path.join(__dirname, filename)).toString('base64');
};

let template = fs.readFileSync(path.join(__dirname, 'index.template.html'), 'utf-8');

let result = template.replaceAll('__KOKO_BASE64__', getBase64('koko baju.png'));
result = result.replaceAll('__OLAHRAGA_BASE64__', getBase64('olahraga baju.png'));

// Inject both assembled and exploded references
result = result.replaceAll('__SATPAM_ASSEMBLED_BASE64__', getBase64('satpam_tanpa_bayangan.png'));
result = result.replaceAll('__SATPAM_EXPLODED_BASE64__', getBase64(path.join('new_template_skin', 'Full body.png')));

// Inject template skin
const skinFiles = [
    'badan.png', 'kaki kanan.png', 'kaki kiri.png', 
    'pinggul.png', 'tangan kanan.png', 'tangan kiri.png'
];
skinFiles.forEach(file => {
    const key = `__SKIN_${file.replace('.png', '').replace(' ', '_').toUpperCase()}__`;
    result = result.replaceAll(key, getBase64(path.join('new_template_skin', file)));
});

fs.writeFileSync(path.join(__dirname, 'index.html'), result);
console.log('index.html generated successfully.');