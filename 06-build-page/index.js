const path = require('path');
const fs = require('fs/promises');

const dist = path.join(__dirname, 'project-dist');
const paths = {
  dist,
  componentsDir: path.join(__dirname, 'components'),
  templatePath: path.join(__dirname, 'template.html'),
  stylesPath: path.join(__dirname, 'styles'),
  stylesBundle: path.join(dist, 'style.css'),
  assetsPath: path.join(__dirname, 'assets'),
  assetsBundle: path.join(dist, 'assets')
};

build(paths);

async function build(paths) {
  const {
    dist,
    componentsDir,
    templatePath,
    stylesPath,
    stylesBundle,
    assetsPath,
    assetsBundle,
  } = paths;

  try {
    await makeDir(dist);
    await buildTemplate(dist, componentsDir, templatePath);
    await mergeStyles(stylesPath, stylesBundle);
    await copyDir(assetsPath, assetsBundle);
  } catch (error) {
    console.log(error.message);
  }
}

async function copyDir(src, dest) {
  await makeDir(dest);
  const files = await getFiles(src);

  for (const file of files) {
    const fileDest = path.join(dest, path.basename(file));
    const isFile = (await fs.stat(file)).isFile();
    isFile
      ? await fs.copyFile(file, fileDest)
      : await copyDir(file, fileDest);
  }
}

async function mergeStyles(src, bundle) {
  const allFilesContent = [];
  const files = await fs.readdir(src);

  for (const file of files) {
    const filePath = path.join(src, file);
    const fileStat = await fs.stat(filePath);

    if (fileStat.isFile() && path.extname(filePath) === '.css') {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      allFilesContent.push(fileContent);
    }
  }

  const content = allFilesContent.join('\n');
  await fs.writeFile(bundle, content);
}

async function buildTemplate(dist, componentsDir, templatePath) {
  const componentPaths = await getFiles(componentsDir);
  let template = await fs.readFile(templatePath, 'utf-8');

  for (const filePath of componentPaths) {
    const fileStat = await fs.stat(filePath);
    const isFile = fileStat.isFile();
    const templateName = path.basename(filePath, path.extname(filePath));

    if (isFile && path.extname(filePath) === '.html') {
      const component = await fs.readFile(filePath, 'utf-8');
      const temp = `{{${templateName}}}`;
      template = template.replaceAll(temp, component);
    }
  }

  await fs.writeFile(path.join(dist, 'index.html'), template);
}

async function makeDir(dir) {
  await fs.mkdir(dir, { recursive: true });
  const destFiles = await getFiles(dir);

  destFiles.forEach(async file => {
    await fs.rm(file, { recursive: true });
  });
}

async function getFiles(dir) {
  const filesInFolder = [];
  const files = await fs.readdir(dir, { withFileTypes: false });

  files.forEach(file => {
    filesInFolder.push(path.join(dir, file));
  });

  return filesInFolder;
}