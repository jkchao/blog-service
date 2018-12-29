#!/usr/bin/env node

const program = require('commander');
const appInfo = require('../package.json');
const chalk = require('chalk');
const inquirer = require('inquirer');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

program.version(appInfo.version).usage(`进行性能检查的工具，利用 ${chalk.cyan.bold.underline('clinic')}`);

program
  .command('type')
  .alias('t')
  .description('select the type you want to check')
  .action(checkType);

program.parse(process.argv);

async function checkType() {
  const types = await require('./type');
  const { checkType } = await inquirer.prompt(types);

  const { endPort = 'localhost:8000/api' } = await inquirer.prompt({
    type: 'input',
    name: 'endPort',
    message: 'Which endPort you want to check (default localhost:8000/api)'
  });

  const command = `clinic ${checkType} --on-port 'autocannon ${endPort}'`;
  const shell = `${command} -- node -r ./tsconfig-paths-bootstrap.js ./dist/main.js`;

  console.log(`The check EndPort is ${chalk.red(endPort)}`);
  console.log(`The check type is ${chalk.red(checkType)}`);

  console.log('Wait a moment, and you can see the report');

  // loading
  const { Spinner } = require('cli-spinner');
  const spinner = new Spinner('processing.. %s');
  spinner.setSpinnerString('|/-\\');
  spinner.start();

  const { error, stdout } = await exec(shell);

  if (error) {
    console.log(`${chalk.red(error)}`);
  }

  console.log(stdout);

  spinner.stop();

  console.log(chalk.green('done ...'));
}
