const fs = require('fs');
const path = require('path');

// create a destination folder for copy
fs.mkdir(`${__dirname}/files-copy`, { recursive: true }, (err) => {
  if (err) throw err;
}); 

// create a source and destination folder paths
const source = path.join(__dirname, 'files');
const destination = path.join(__dirname, 'files-copy');

// create a copy of all files inside the directory
copyFile(source, destination);

function copyFile(source, destination) {
  fs.readdir(source, { withFileTypes: true }, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        const sourcePath = path.join(source, `${file.name}`);
        const destPath = path.join(destination, `${file.name}`);
        fs.stat(sourcePath, (err, stats) => {
          if(stats.isFile()) {
            fs.copyFile(`${sourcePath}`, `${destPath}`, callback);
          } else if (stats.isDirectory()) {
            fs.mkdir(destPath, { recursive: true }, (err) => {
              if (err) throw err;
            });
            copyFile(sourcePath, destPath);
          }
        });
      });
    }
  });
}

function callback(err) {
  if (err) throw err;
}
