import { createReadStream, appendFile, rename, createWriteStream, rm, mkdir } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { stdout, cwd } from 'node:process';
import { join } from 'node:path';

export class FileController {
  showFailing() {
    stdout.write('Operation failed\n');
  }

  handleErr(err) {
    if (err) this.showFailing();
  }

  readFileContent(path) {
    if (!path) {
      this.showFailing();
      return;
    }

    const pathWithWhitespaces = path.replace('*', ' ');
    const readStream = createReadStream(pathWithWhitespaces, { autoClose: false });

    let fileContent = '';
    readStream.on('data', (data) => {
      fileContent += data;
    });

    readStream.on('end', () => {
      console.log(fileContent);
    })

    readStream.on('error', () => {
      this.showFailing();
    })
  }

  addNewFile(fileName) {
    if (!fileName) {
      this.showFailing();
      return;
    }

    appendFile(join(cwd(), fileName), '', this.handleErr.bind(this));
  }

  renameFile(path, newFileName) {
    if (!path || !newFileName) {
      this.showFailing();
      return;
    }

    const pathFull = this.getFullPath(path);
    const [pathToFile] = this.getPartsFromFilePath(pathFull);
    const newFilePath = join(pathToFile, newFileName);
    rename(pathFull, newFilePath, this.handleErr.bind(this));
  }

  getPartsFromFilePath(pathFull) {
    const i = pathFull.lastIndexOf('/') + 1 || pathFull.lastIndexOf('\\') + 1;
    const path = pathFull.slice(0, i);
    const fileName = pathFull.slice(i);
    return [path, fileName];
  }

  async copyFile(oldPath, newDirPath) {
    if (!oldPath || !newDirPath) {
      this.showFailing();
      return;
    }

    const newDirPathFull = this.getFullPath(newDirPath);
    mkdir(newDirPathFull, { recursive: true }, this.handleErr.bind(this));

    const oldPathFull = this.getFullPath(oldPath);
    const [dirName, fileName] = this.getPartsFromFilePath(oldPathFull);

    try {
      const filesArr = await readdir(dirName);
      const isSuccess = filesArr.some((file) => file === fileName);

      if (isSuccess) {
        const newFilePath = join(newDirPathFull, fileName);
        this.openStreamToCopy(oldPath, newFilePath);
        return true;
      } else {
        this.showFailing();
        return false;
      }
    } catch (error) {
      this.showFailing();
      return false;
    }
  }

  getFullPath(path) {
    const currDir = cwd();
    const isAbsolutePath = currDir === path.slice(0, currDir.length);
    return isAbsolutePath ? path : join(cwd(), path);
  }

  openStreamToCopy(oldPath, newFilePath) {
    const readStream = createReadStream(oldPath);
    const writeStream = createWriteStream(newFilePath);

    readStream.on('data', (chunk) => {
      writeStream.write(chunk);
    })

    readStream.on('error', () => {
      this.showFailing();
      return false;
    })

    writeStream.on('error', () => {
      this.showFailing();
      return false;
    })

    readStream.on('end', () => true);
  }

  removeFile(path) {
    if (!path) {
      this.showFailing();
      return;
    }

    const pathFull = this.getFullPath(path);
    rm(pathFull, { recursive: true }, this.handleErr.bind(this));
  }

  async moveFile(filePath, newDirPath) {
    if (!filePath || !newDirPath) {
      this.showFailing();
      return;
    }

    try {
      const isCopied = await this.copyFile(filePath, newDirPath);
      if (!isCopied) {
        this.showFailing();
      } else {
        this.removeFile(filePath);
      }
    } catch (error) {
      this.showFailing();
    }
  }
}
