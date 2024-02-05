import process, { stdin, stdout, cwd, chdir } from 'node:process';
import { homedir } from 'node:os';
import { finishListen } from './utils/finishListen.js';
import { UserService } from './services/UserService.js';
import { AppController } from './controller/AppController.js';

export class App {
  userService = new UserService();
  appController;

  init() {
    this.userService.init();
    chdir(homedir());
    this.showCurrentDir();

    this.appController = new AppController(this.userService.userName);

    stdin.on('data', async (data) => {
      const dataStr = data.toString().trim();
      await appController.execute(dataStr);
      this.showCurrentDir();
    })

    process.on('SIGINT', () => finishListen(this.userService.userName));
  }

  showCurrentDir() {
    stdout.write(`You are currently in ${cwd()}\n`);
  }
}
