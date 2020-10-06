'use strict';

const path = require('path');
const args = process.argv.slice(2);
const { Plop, run } = require('plop');
const argv = require('minimist')(args);

Plop.launch({
  cwd: argv.cwd,
  configPath: path.join(__dirname, 'src/load-session.plopfile.js'),
  require: argv.require,
  completion: argv.completion
}, env => run({ ...env, dest: process.cwd() }, undefined, true));
