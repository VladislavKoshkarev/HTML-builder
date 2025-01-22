const path = require('path');
const fs = require('fs/promises');
const { createWriteStream, createReadStream } = require('fs');

const projectDist = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');
const bundleStylesPath = path.join(__dirname, 'project-dist', 'style.css');
const htmlTemplatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');

async function copyDir(from, to) {
  try {
    await fs.mkdir(to, { recursive: true });
    const elements = await fs.readdir(from, { withFileTypes: true });
    const promises = elements.map(async (element) => {
      const sourcePath = path.join(from, element.name);
      const directionPath = path.join(to, element.name);
      if (element.isDirectory()) {
        await copyDir(sourcePath, directionPath);
      } else {
        await fs.copyFile(sourcePath, directionPath);
      }
    });
    await Promise.all(promises);
  } catch (err) {
    console.error(err);
  }
}

async function createBundle() {
  const output = createWriteStream(bundleStylesPath);
  try {
    const items = await fs.readdir(stylesPath, { withFileTypes: true });
    for (const item of items) {
      if (item.isFile() && path.extname(item.name) === '.css') {
        const input = createReadStream(
          path.join(stylesPath, item.name),
          'utf-8',
        );
        input.pipe(output, { end: false });
        await new Promise((resolve) => input.on('end', resolve));
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    output.end();
  }
}

async function buildPage() {
  let html = await fs.readFile(htmlTemplatePath, 'utf8');
  const templates = [...html.matchAll(/\{\{(\w+)\}\}/g)];
  for (const template of templates) {
    const newPath = path.join(componentsPath, `${template[1]}.html`);
    const newHtml = await fs.readFile(newPath, 'utf8');
    html = html.replace(template[0], newHtml);
  }
  await fs.writeFile(path.join(projectDist, 'index.html'), html, 'utf8');
}

(async () => {
  try {
    await fs.rm(projectDist, { recursive: true, force: true });
    await fs.mkdir(projectDist, { recursive: true });
    await Promise.all([
      copyDir(path.join(__dirname, 'assets'), path.join(projectDist, 'assets')),
      createBundle(),
      buildPage(),
    ]);
  } catch (err) {
    console.error(err);
  }
})();
