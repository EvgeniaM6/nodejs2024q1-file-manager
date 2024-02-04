import process, { stdin, stdout, exit, cwd, chdir } from 'node:process';
import { homedir } from 'node:os';
import { UserService } from './services/UserService.js';
import { AppController } from './controller/AppController.js';

const userService = new UserService();
userService.init();

chdir(homedir());
showCurrentDir();

const appController = new AppController();

stdin.on('data', (data) => {
  const dataStr = data.toString().trim();
  // console.log('dataStr=', dataStr);
  appController.execute(dataStr);
  showCurrentDir();
})

process.on('SIGINT', finishListen);

function finishListen() {
  stdout.write(`Thank you for using File Manager, ${userService.userName}, goodbye!`);
  exit();
}

function showCurrentDir() {
  stdout.write(`You are currently in ${cwd()}\n`);
}
