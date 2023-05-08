const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'project-dist');
const bundlePath = path.join(dirPath, 'bundle.css');
const stylesPath = path.join(__dirname, 'styles');

function mergeStyles(stylesPath) {
  fs.readdir(stylesPath, 'utf-8', (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        const filePath = path.join(stylesPath, file);
        const ext = path.extname(filePath);
        if(ext === '.css') {
          const readStream = fs.createReadStream(filePath);
          readStream.on('data', (data) => {
            fs.appendFile(bundlePath, data, (err) => {
              if (err) {
                console.log(err);
              }
            });
          });
        }
      });
      fs.writeFile(bundlePath, '', (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
}

mergeStyles(stylesPath);

module.exports = mergeStyles;