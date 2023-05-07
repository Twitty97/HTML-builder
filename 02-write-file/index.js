const fs = require('fs');
const dirPath = require('path');
const process = require('process');
const filePath = dirPath.join(__dirname, 'text.txt');

process.stdout.write('Please enter some text: \n');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

process.stdin.on('data', data => {
  const input = data.toString().trim();
  if (input === 'exit') {
    process.exit();
  } else {
    writeStream.write(input + '\n');
    process.stdout.write('Please enter some text: \n');
  }
});
process.on('SIGINT', function() {
  process.exit();
});