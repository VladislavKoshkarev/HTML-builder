const fsPromises = require('fs/promises');
const path = require('path');
(async () => {
  const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
  const styles = await fsPromises.readdir(path.join(__dirname, 'styles'), {
    withFileTypes: true,
  });
  await fsPromises.writeFile(bundlePath, '');
  for (const style of styles) {
    if (style.isFile() && style.name.split('.')[1] === 'css') {
      const styleString = await fsPromises.readFile(
        path.join(__dirname, 'styles', style.name),
      );
      await fsPromises.appendFile(bundlePath, styleString);
    }
  }
})();
