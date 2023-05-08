const fs = require('fs');
const dirPath = require('path');

const folderPath = dirPath.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  console.log('\nCurrent directory files:');
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      const filePath = dirPath.join(folderPath, `${file.name}`);
      const ext = dirPath.extname(file.name).substring(1);
      fs.stat(filePath, (err, stats) => {
        if(stats.isFile()) {
          console.log(`${file.name} - ${ext} - ${parseFloat((stats.size/1000))}kb`);
        }
      });
    });
  }
});

