import { EOL, cpus, homedir } from 'node:os';
import { stdout, arch } from 'node:process';

export class OsController {
  flags = {
    EOL: () => stdout.write(`${JSON.stringify(EOL)}\n`),
    cpus: () => this.printCpus(),
    homedir: () => console.log(homedir()),
    username: () => this.printSystemUsername(),
    architecture: () => console.log(arch),
  }

  showFailing() {
    stdout.write('Invalid input\n');
  }

  executeOsOperation(operationsArr) {
    if (!operationsArr.length) {
      this.showFailing();
      return;
    }

    operationsArr.forEach((operation) => this.executeByFlag(operation));
  }

  executeByFlag(operation) {
    const isFlag = operation.slice(0, 2) === '--';
    if (!isFlag) {
      this.showFailing();
      return;
    }

    const flag = operation.slice(2);

    if (!(flag in this.flags)) {
      this.showFailing();
      return;
    }

    this.flags[flag]();
  }

  printCpus() {
    const cpusInfo = cpus().map((cpu) => {
      const { model, speed } = cpu;
      return { model, speed: speed / 1000 };
    })
    console.log(cpusInfo);
  }

  printSystemUsername() {
    const currentHomedir = homedir();
    const i = currentHomedir.lastIndexOf('/') + 1 || currentHomedir.lastIndexOf('\\') + 1;
    const userName = currentHomedir.slice(i);
    console.log(userName);
  }
}
