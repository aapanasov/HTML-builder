const fs = require('fs');
const path = require('path');

const input = fs.ReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

input.pipe(process.stdout);

input.on('error', error => console.log('Error', error.message));
