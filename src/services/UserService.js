import { argv, stdout } from 'node:process';

export class UserService {
  userName = 'Username';

  init() {
    this.saveUserNameFromArgv();
    this.sayHi();
  };

  saveUserNameFromArgv() {
    argv.slice(2).forEach((arg) => {
      if (!arg.startsWith('--')) return;

      const [key, val] = arg.slice(2).split('=');

      if (key === 'username') {
        this.userName = val;
      }
    })
  };

  sayHi() {
    stdout.write(`Welcome to the File Manager, ${this.userName}!\n`);
  };
}
