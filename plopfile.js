'use strict';

const fs = require('fs');
const remark = require('remark');
const recommended = require('remark-preset-lint-recommended');
const html = require('remark-html');
const reporter = require('vfile-reporter');
const { makeDestPath, getRelativeToBasePath } = require('node-plop/lib/actions/_common-action-utils');

const glob = require('glob').sync;
const pckg = require('./package.json');
const Promise = require('bluebird');
const today = new Date().toISOString().split('T')[0];
const { formatDate, removeComments } = require('./src/helpers');

const render = remark().use(recommended).use(html).process;
const report = vfile => console.error(reporter(vfile)) || vfile;
const readFile = Promise.promisify(fs.readFile);
const writeFile = Promise.promisify(fs.writeFile);
const markdown = (answers, config, plop) => {
  const fileDestPath = makeDestPath(answers, config, plop);
  return readFile(config.source)
    .then(render)
    .then(report)
    .then(vfile => writeFile(fileDestPath, vfile.contents))
    .then(() => getRelativeToBasePath(fileDestPath, plop));
};
const {otherContactsInstructions, nonComplianceInstructions, disproportionateBurdenInstructions, outOfScopeInstructions} = require('./src/helpStrings.js');

const complianceLevels = [
  { name: 'Yes, our service has been tested and is fully compliant', value: 'full', short: 'fully compliant' },
  { name: 'Our service has been tested and is mostly compliant', value: 'partial', short: 'partially compliant' },
  { name: 'Our service has been tested but is not compliant', value: 'not', short: 'non-compliant' },
  { name: 'No accessibility testing has been completed yet', value: 'untested', short: 'never tested' }
];
const stringifyComplianceStatus = input => input.map(i => i.replace(/ .*$/, '').toLowerCase()).join(' and ');
const promptFormat = ['d', '/', 'm', '/', 'yyyy'];

module.exports = (plop) => {
  plop.setPrompt('date', require('inquirer-datepicker-prompt'));
  plop.setHelper('formatDate', formatDate);
  plop.setHelper('json', obj => JSON.stringify(obj));
  plop.setHelper('natural-list', list => list.join(' and '));
  plop.setActionType('markdown', markdown);
  plop.setGenerator('basics', {
    description: pckg.description,
    prompts: [{
      type: 'input',
      name: 'title',
      message: 'Please enter the title of the service'
    }, {
      type: 'input',
      name: 'scope',
      message: 'Please enter the scope of the service'
    }, {
      type: 'input',
      name: 'organisation',
      message: 'Please enter the name of the organisation responsible for the service'
    }, {
      type: 'checkbox',
      name: 'accessibility-features',
      message: 'Please select the accessibility features your service supports from the list',
      choices: [
        { name: 'Change colours, contrast levels and fonts', short: 'change styles' },
        { name: 'Zoom in up to 300% without the text spilling off the screen', short: 'zoom' },
        { name: 'Navigate most of the website using just a keyboard', short: 'keyboard navigation' },
        { name: 'Navigate most of the website using speech recognition software', short: 'speech navigation' },
        { name: 'Listen to most of the website using a screen reader ' +
            '(including the most recent versions of JAWS, NVDA and VoiceOver)', short: 'screen reader friendly' }
      ].map(c => ({ value: c.name, ...c }))
    }, {
      type: 'input',
      name: 'email-address',
      message: 'Please enter the email address where users can get help with the service',
      // validate(input, answers) {
      //   return input.contains('@');
      // }
    }, {
      type: 'input',
      name: 'phone-number',
      message: 'Please enter a phone number where users can get help with the service [optional]'
    }, {
      type: 'confirm',
      name: 'other-contacts',
      message: 'Are there any other forms of contact where users can get help with the service?'
    }, {
      type: 'editor',
      name: 'other-contacts',
      message: 'Please enter the details of the contact methods in the editor...',
      default: otherContactsInstructions,
      askAnswered: true,
      when: answers => answers['other-contacts'] === true,
      filter: removeComments
    }, {
      type: 'number',
      name: 'response-time',
      message: 'Please enter the maximum response time (in days)'
    }, {
      type: 'input',
      name: 'how-to-report-issues',
      message: 'Please describe the process for reporting accessibility issues to your organisation'
    }, {
      type: 'input',
      name: 'issues-contact',
      message: 'Please provide contact details for the unit or person responsible for dealing with reports'
    }, {
      type: 'confirm',
      name: 'contact-phone-person',
      message: 'Can users contact you by phone or in person?'
    }, {
      type: 'confirm',
      name: 'deaf',
      message: 'Do you provide a text relay service for people with a hearing impairment or a speech impediment?'
    }, {
      type: 'confirm',
      name: 'induction-loops',
      message: 'Do you provide audio induction loops in your offices, and can users book a sign language translator?'
    }, {
      type: 'input',
      name: 'contact-page-link',
      message: 'If you have a link to a contact page, please enter the URL [optional]'
    }, {
      type: 'rawlist',
      name: 'compliance.level',
      message: 'Has your service been tested and verified to be WCAG 2.1 AA compliant?',
      choices: complianceLevels,
      filter: (input, answers) => {
        answers.compliance = {
          ...answers.compliance,
          [input]: true
        };
        if (input !== complianceLevels[0].value) {
          answers.compliance['non-accessible'] = true;
        }
        return complianceLevels.indexOf(complianceLevels.find(c => c.value === input)) + 1;
      }
    }, {
      type: 'confirm',
      name: 'compliance.non-accessible',
      message: 'Would you still like to include the boilerplate "Non-accessible content" section?',
      when: answers => answers.compliance.full
    }, {
      type: 'checkbox',
      name: 'compliance.status',
      message: 'What types of issues does your service have? [Select both if they apply]',
      choices: [{
        name: 'Non-compliances - i.e. content in scope of the regulations but with accessibility issues',
        short: 'non-compliances'
      }, {
        name: 'Exemptions - i.e. inaccessible content that is out of scope of the regulations, ' +
          'or it’d be a disproportionate burden for you to make it accessible',
        short: 'exemptions'
      }].map(c => ({ value: c.short, ...c })),
      validate: answer => !!(answer && answer.length),
      when: answers => answers.compliance['non-accessible']
    }, {
      type: 'editor',
      name: 'non-compliance-list',
      message: 'Please enter the details of any non-compliance issues in the editor...',
      default: nonComplianceInstructions,
      askAnswered: true,
      when: answers => !answers.compliance.untested && (answers.compliance.status || []).some(l => l === 'non-compliances'),
      filter: removeComments
    }, {
      type: 'confirm',
      name: 'disproportionate-burden-list',
      message: 'Are you planning to claim a disproportionate burden?',
      when: answers => !answers.compliance.full && !answers.compliance.untested
    }, {
      type: 'editor',
      name: 'disproportionate-burden-list',
      message: 'Please enter the details of disproportionate burden claims in the editor...',
      default: disproportionateBurdenInstructions,
      askAnswered: true,
      when: answers => answers['disproportionate-burden-list'] === true,
      filter: removeComments
    }, {
      type: 'editor',
      name: 'not-in-scope-list',
      message: 'Please enter details of items not covered by the regulations in the editor...',
      default: outOfScopeInstructions,
      askAnswered: true,
      when: answers => (answers.compliance.status || []).some(l => l === 'exemptions'),
      filter: removeComments
    }, {
      type: 'date',
      name: 'date-first-published',
      message: 'Please enter the date this statement will be published',
      format: promptFormat,
      date: { max: today }
    // }, {
    //   type: 'date',
    //   name: 'date-last-reviewed',
    //   message: 'Please enter the date this statement was last reviewed'
    }, {
      type: 'date',
      name: 'date-tested',
      message: 'Please enter the date the last accessibility test was completed',
      format: promptFormat,
      date: { max: today },
      when: answers => !answers.compliance.untested
    }, {
      type: 'confirm',
      name: 'home-office-tested',
      message: 'Was the accessibility testing carried out by the Home Office?',
      when: answers => !answers.compliance.untested
    }, {
      type: 'input',
      name: 'organisation-tested',
      message: 'Please enter the name of the organisation that did the test, or leave blank if your team did it',
      when: answers => !answers.compliance.untested && !answers['home-office-tested']
    }, {
      type: 'input',
      name: 'extra-test-info',
      message: 'Please enter any extra details about how the testing was carried out [optional]',
      when: answers => !answers.compliance.untested
    }],

    actions: answers => {
      process.chdir(plop.getPlopfilePath());

      const pathName = `accessibility-statements/${answers.title}-${today}`;
      const versions = glob(pathName + '*')
        .map(p => p.match(/-v(?<version>\d+)\.\w+/))
        .map(v => parseInt(v ? v.groups.version : 0, 10));
      const version = versions.length && (Math.max(...versions) + 1);
      const pathNameVersion = `${pathName}${version ? '-v' + version : ''}`;
      const data = {
        'date-last-reviewed': today
      };

      return [{
        type: 'add',
        path: `${pathNameVersion}.json`,
        template: '{{#json this}}{{/json}}',
        data
      }, {
        type: 'add',
        path: `${pathNameVersion}.md`,
        templateFile: 'statement-template.md.hbs',
        data
      }, {
        type: 'markdown',
        path: `${pathNameVersion}.html`,
        source: `${pathNameVersion}.md`
      }];
    }
  });

  return plop;
};
