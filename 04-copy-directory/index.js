const fs = require('fs/promises');
const path = require('path');

const getFiles = async (folder) => {
  const filesInFolder = [];

  try {
    const files = await fs.readdir(folder, { withFileTypes: false });

    files.forEach(file => {
      const filePath = path.join(folder, file);
      filesInFolder.push(filePath);
    });

  } catch (err) {
    console.error(err);
  }

  return filesInFolder;
};


const copyDir = async (src, dest) => {
  await fs.mkdir(dest, { recursive: true });
  const destFiles = await getFiles(dest);

  destFiles.forEach(async file => {
    try {
      await fs.rm(file, { recursive: true });
    } catch {
      console.log(`Can't remove file:  ${file}`);
    }
  });

  const srcFiles = await getFiles(src);

  srcFiles.forEach(async file => {
    const fileDest = path.join(dest, path.basename(file));
    try {
      const isFile = (await fs.stat(file)).isFile();
      isFile
        ? await fs.copyFile(file, fileDest)
        : await copyDir(file, fileDest);

    } catch (error) {
      console.log(`Can't copy file: ${file}`);
    }
  });
};

const src = path.join(__dirname, 'files');
const dest = path.join(__dirname, 'files-copy');

copyDir(src, dest);
