const fs = require('fs/promises');
const path = require('path');

const folder = path.join(__dirname, 'secret-folder');

const getFiles = async () => {
  try {
    const files = await fs.readdir(folder);

    files.forEach(async file => {
      const filePath = path.join(folder, file);
      const fileStat = await fs.stat(filePath);

      if (fileStat.isFile()) {
        const name = path.parse(filePath).name;
        console.log(`${name} - ${path.extname(filePath).slice(1)} - ${fileStat.size / 1000}kb`);
      }
    });

  } catch (err) {
    console.error(err);
  }
};

getFiles();