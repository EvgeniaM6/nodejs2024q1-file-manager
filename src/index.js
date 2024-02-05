import process, { stdin, stdout, cwd, chdir } from 'node:process';
import { homedir } from 'node:os';
import { finishListen } from './utils/finishListen.js';
import { UserService } from './services/UserService.js';
import { AppController } from './controller/AppController.js';

const userService = new UserService();
userService.init();

chdir(homedir());
showCurrentDir();

const appController = new AppController(userService.userName);

stdin.on('data', async (data) => {
  const dataStr = data.toString().trim();
  await appController.execute(dataStr);
  showCurrentDir();
})

process.on('SIGINT', () => finishListen(userService.userName));

function showCurrentDir() {
  stdout.write(`You are currently in ${cwd()}\n`);
}
