'use strict';

const path = require('path');
const argv = require('minimist')(process.argv);
const chalk = require('chalk');
const nodePlop = require('node-plop');
const progress = require('plop').progressSpinner;
const fileSelect = require('inquirer-file-tree-selection-prompt');

const loadFileChoices = [
  'no, just generate a new statement',
  'yes, then let me edit the answers',
  'yes, then just produce the statement'
];
const sessionFileConf = {
  type: 'file-tree-selection',
  name: 'session-file',
  message: 'Choose a file to load',
  onlyShowValid: true,
  validate: input => /.*\.json$/.test(input)
};
const loadSession = file => require(path.resolve(process.cwd(), file));
const accessItem = (store, pathKey) => {
  const [first, ...rest] = Array.isArray(pathKey) ? pathKey : pathKey.split('.');
  if (store.hasOwnProperty(first)) {
    return rest.length ? accessItem(store[first], rest) : store[first];
  }
};

module.exports = (plop) => {
  plop.setPrompt('file-tree-selection', fileSelect);
  plop.setGenerator('load', {
    prompts: argv['session-file'] || /\.json$/i.test(argv._[2]) ? [
      sessionFileConf, {
      type: 'confirm',
      name: 'run-wizard',
      message: 'Would you like to edit the previous answers?'
    }] : [{
      type: 'rawlist',
      name: 'load-file',
      message: 'Would you like to load answers from a previous session?',
      choices: loadFileChoices,
      filter(input, answers) {
        const choice = loadFileChoices.indexOf(input);
        answers['run-wizard'] = choice < 2;
        return choice;
      }
    }, {
      ...sessionFileConf,
      when: answers => !!answers['load-file']
    }],
    actions: answers => {
      const main = nodePlop(path.resolve(__dirname, '../plopfile.js')).getGenerator('basics');
      const runActions = session => main.runActions(session, {
        onSuccess: change => console.log(chalk.green('++'), change.path),
        onFailure: fail => console.error(chalk.red('[ERROR]'), fail.path, fail.error || fail.message),
        onComment: console.log
      });

      if (answers['run-wizard']) {
        if (answers['session-file']) {
          progress.info(`loading session ${answers['session-file']}`);
          const defaults = loadSession(answers['session-file']);
          main.prompts.forEach(p => {
            const value = accessItem(defaults, p.name);
            if (value !== undefined) {
              p.default = p.type === 'editor' ? `${value}${p.default}` : value;
            }
          });
          progress.succeed(`session loaded`);
        }
        progress.stop();
        main.runPrompts().then(runActions);
      }
      else {
        runActions(loadSession(answers['session-file']));
      }

      return [];
    }
  });
};
