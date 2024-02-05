import { stdout } from 'node:process';
import { NavController } from './NavController.js';
import { FileController } from './FileController.js';
import { OsController } from './OsController.js';
import { HashController } from './HashController.js';

export class AppController {
  navController = new NavController();
  fileController = new FileController();
  osController = new OsController();
  hashController = new HashController();

  operations = {
    up: this.navController.changeDir.bind(this.navController),
    cd: this.navController.changeDir.bind(this.navController),
    ls: this.navController.printList.bind(this.navController),
    cat: this.fileController.readFileContent.bind(this.fileController),
    add: this.fileController.addNewFile.bind(this.fileController),
    rn: this.fileController.renameFile.bind(this.fileController),
    cp: this.fileController.copyFile.bind(this.fileController),
    mv: this.fileController.moveFile.bind(this.fileController),
    rm: this.fileController.removeFile.bind(this.fileController),
    os: this.osController.executeOsOperation.bind(this.osController),
    hash: this.hashController.printFileHash.bind(this.hashController),
  };

  async execute(dataStr) {
    const [operation, ...argsArr] = dataStr.split(' ');

    if (!(operation in this.operations)) {
      stdout.write(`Invalid input\n`);
      return;
    }

    await this.operations[operation](argsArr);
  }
}
