import { stdout, exit } from 'node:process';

export function finishListen(userName) {
  stdout.write(`Thank you for using File Manager, ${userName}, goodbye!`);
  exit();
}
