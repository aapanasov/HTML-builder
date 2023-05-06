const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'output.txt'));
output.on('error',(err) => console.log('Error:', err));

console.log('Enter some text:');

process.stdin.pipe(output);

process.on('SIGINT',  ()=>{
  console.log('Goodbye!');
  process.exit();
});