const fs = require('fs');
const path = require('path');

// create a destination folder for copy
fs.mkdir(`${__dirname}/files-copy`, { recursive: true }, (err) => {
  if (err) throw err;
}); 

// create a source and destination folder paths
const source = path.join(__dirname, 'files');
const destination = path.join(__dirname, 'files-copy');


// clean the directory before copying 
cleanDirectory(destination);
// create a copy of all files inside the directory
copyFile(source, destination);

function cleanDirectory(destination) {
  fs.readdir(destination, { withFileTypes: true }, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        fs.unlink(path.join(destination, file.name), (err) => {
          if (err) throw err;
        });
      });
    }
  });
}

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