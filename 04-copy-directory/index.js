function copyDir() {
  const fsPromises = require('fs/promises');
  const path = require('path');
  (async () => {
    await fsPromises.rm(path.join(__dirname, 'files-copy'), {
      force: true,
      recursive: true,
    });
    await fsPromises.mkdir(path.join(__dirname, 'files-copy'), {
      recursive: true,
    });
    const originalFiles = await fsPromises.readdir(
      path.join(__dirname, 'files'),
      { withFileTypes: true },
    );
    for (const file of originalFiles) {
      fsPromises.copyFile(
        path.join(__dirname, 'files', file.name),
        path.join(__dirname, 'files-copy', file.name),
      );
    }
  })();
}
copyDir();
