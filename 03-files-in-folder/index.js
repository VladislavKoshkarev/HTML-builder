const fsPromises = require('fs/promises');
const path = require('path');
const files = fsPromises.readdir(path.join(__dirname, 'secret-folder'), {
  withFileTypes: true,
});
files.then((el) => {
  for (const file of el) {
    if (file.isFile()) {
      (async () => {
        let stats = await fsPromises.stat(
          path.join(__dirname, 'secret-folder', file.name),
        );
        console.log(
          `${file.name.split('.')[0]} - ${file.name.split('.')[1]} - ${(
            stats.size / 1024
          ).toFixed(2)} kb`,
        );
      })();
    }
  }
});
