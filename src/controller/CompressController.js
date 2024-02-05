import { stdout } from 'node:process';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream';

export class CompressController {
  showFailing() {
    stdout.write('Operation failed\n');
  }

  compress(argsArr) {
    this.executeZlibOperation(argsArr);
  }

  decompress(argsArr) {
    this.executeZlibOperation(argsArr, true);
  }

  executeZlibOperation([filePath, destinationPath], isDecompress = false) {
    if (!destinationPath) {
      this.showFailing();
      return;
    }

    const compressObj = isDecompress ? createBrotliDecompress() : createBrotliCompress();
    const readStream = createReadStream(filePath);
    const writeStream = createWriteStream(destinationPath);

    pipeline(readStream, compressObj, writeStream, (err) => {
      if (err) {
        this.showFailing();
      }
    })
  }
}
