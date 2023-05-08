const path = require('path');
const fs = require('fs');

const output = fs.WriteStream(path.join(__dirname, 'output.txt'));
const readLine = require('readline').createInterface(process.stdin, process.stdout);

console.log('Enter some text');
readLine.setPrompt('> ');
readLine.prompt();
readLine
  .on('line', line => {
    if (line === 'exit') readLine.close();
    output.write(line + '\n');
    readLine.prompt();
  })
  .on('close', () => {
    console.log('\nGoodbye!');
    process.exit(0);
  });
