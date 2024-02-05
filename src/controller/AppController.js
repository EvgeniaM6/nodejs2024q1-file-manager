import { stdout } from 'node:process';
import { NavController } from './NavController.js';
import { FileController } from './FileController.js';

export class AppController {
  navController = new NavController();
  fileController = new FileController();

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
  };

  async execute(dataStr) {
    const [operation, ...argsArr] = dataStr.split(' ');

    if (!(operation in this.operations)) {
      stdout.write(`Invalid input\n`);
      return;
    }

    const [arg1, arg2] = argsArr;
    await this.operations[operation](arg1, arg2);
  }
}
