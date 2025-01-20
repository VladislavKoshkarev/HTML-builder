const fs = require('fs');
const path = require('path');
const textPath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(textPath);
let output = '';
stream.on('data', (chunk) => (output += chunk));
stream.on('end', () => console.log(output));
