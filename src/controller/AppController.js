import { stdout } from 'node:process';
import { NavController } from './NavController.js';

export class AppController {
  navController = new NavController();

  operations = {
    up: this.navController.changeDir,
    cd: this.navController.changeDir,
    ls: this.navController.printList,
  };

  execute(dataStr) {
    const [operation, ...argsArr] = dataStr.split(' ');

    if (!(operation in this.operations)) {
      stdout.write(`Invalid input\n`);
      return;
    }

    const [arg1, arg2] = argsArr;
    this.operations[operation](arg1, arg2);
  }
}
