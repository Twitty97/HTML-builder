const fs = require('fs');
const dirPath = require('path');
const filePath = dirPath.join(__dirname, 'text.txt');
const stream = fs.createReadStream(filePath);
stream.on('data', (chunk) => {
  console.log(`${chunk}`);
});