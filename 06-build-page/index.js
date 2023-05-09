// Почему-то модули не работают, поэтому пришлось копировать код из заданий 4-5. 
// Точнее, они работают, но когда вызываю 6-ой таск, он почему-то вызывает 4-ый и 5-ый тоже.
// Наверняка это я просто тупенькая, разберусь потом и рефактор сделаю
// Заранее спасибо за проверку!

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const assetsDestDir = path.join(projectDist, 'assets');
const assetsSourceDir = path.join(__dirname, 'assets');
const stylesSourceDir = path.join(__dirname, 'styles');
const stylesDestDir = path.join(projectDist, 'style.css');
const componentsDir = path.join(__dirname, 'components');
const templateHtml = path.join(__dirname, 'template.html');

fs.mkdir(assetsDestDir, { recursive: true }, (err) => {
  if (err) throw err;
});

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
            fs.appendFile(stylesDestDir, data, (err) => {
              if (err) {
                console.log(err);
              }
            });
          });
        }
      });
      fs.writeFile(stylesDestDir, '', (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
}

fsp.readdir(componentsDir)
  .then(async (files) => {
    const checkRegex = /{{(.+?)}}/g;
    for (const file of files) {
      const templateTag = `${file.split('.')[0]}`;
      const insideHtml = await fsp.readFile(path.join(componentsDir, file), 'utf-8');
      this[templateTag] = insideHtml;
    }
    const tagHtml = await fsp.readFile(templateHtml, 'utf-8');
    // p1 for non-digits
    const replacedHtml = tagHtml.replace(checkRegex, (match, p1) => {
      const content = this[p1];
      return content ? content : '';
    });
    await fsp.writeFile(path.join(projectDist, 'index.html'), replacedHtml, 'utf-8');
  })
  .catch((err) => {
    console.log(err);
  });

// merge the css styles into one file
mergeStyles(stylesSourceDir);

// copy the files to the directory
copyFile(assetsSourceDir, assetsDestDir);