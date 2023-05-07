const fsPromises = require('fs/promises');
const path = require('path');
(async () => {
  const projectDistPath = path.join(__dirname, 'project-dist');
  await fsPromises.rm(projectDistPath, { force: true, recursive: true });
  await fsPromises.mkdir(projectDistPath, { recursive: true });

  await fsPromises.mkdir(path.join(projectDistPath, 'assets'), { recursive: true });
  copyAssets(path.join(__dirname, 'assets'));

  const originalStyles = await fsPromises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
  await fsPromises.writeFile(path.join(projectDistPath, 'style.css'), '');
  for (const style of originalStyles) {
    const string = await fsPromises.readFile(path.join(__dirname, 'styles', style.name));
    await fsPromises.appendFile(path.join(projectDistPath, 'style.css'), string);
  }

  await fsPromises.writeFile(path.join(projectDistPath, 'index.html'), '');
  const template = await fsPromises.open(path.join(__dirname, 'template.html'));
  for await (const line of template.readLines()) {
    if (line.split('').includes('{')) {
      const componentName = lineSlicer(line);
      const component = await fsPromises.readFile(path.join(__dirname, 'components', `${componentName}.html`));
      await fsPromises.appendFile(path.join(projectDistPath, 'index.html'), component + '\n');
    } else {
      await fsPromises.appendFile(path.join(projectDistPath, 'index.html'), line + '\n');
    }
  }
})();

async function copyAssets(dir, lastDir) {
  const originalFiles = await fsPromises.readdir(dir, {withFileTypes: true});
  for (const file of originalFiles) {
    if (file.isDirectory()) {
      await fsPromises.mkdir(path.join(__dirname, 'project-dist', 'assets', file.name), { recursive: true });
      copyAssets(path.join(dir, file.name), path.join(__dirname, 'project-dist', 'assets', file.name));
    } else if (file.isFile()) {
      fsPromises.copyFile(path.join(dir, file.name), path.join(lastDir, file.name));
    }
  }
}

function lineSlicer(str) {
  return str.trim().slice(2, str.trim().length - 2);
}