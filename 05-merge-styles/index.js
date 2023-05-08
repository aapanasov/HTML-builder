const path = require('path');
const fs = require('fs/promises');

const mergeSyles = async (src, bundle) => {
  const filesInFolder = [];

  try {
    const files = await fs.readdir(src);

    for (const file of files) {
      const filePath = path.join(src, file);
      const fileStat = await fs.stat(filePath);

      if (fileStat.isFile() && path.extname(filePath) === '.css') {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        filesInFolder.push(fileContent);
      }
    }

    const content = filesInFolder.join('\n');
    await fs.writeFile(bundle, content);

  } catch (err) {
    console.error(err.message);
  }
};

const src = path.join(__dirname, 'styles');
const bundle = path.join(__dirname, 'project-dist', 'bundle.css');

mergeSyles(src, bundle);