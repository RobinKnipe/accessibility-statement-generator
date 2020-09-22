'use strict';

const fs = require('fs');
const remark = require('remark');
const recommended = require('remark-preset-lint-recommended');
const html = require('remark-html');
const reporter = require('vfile-reporter');

('## Hello world!', function(err, file) {
    console.error(report(err || file))
    console.log(String(file))
  });
const glob = require('glob').sync;
const pckg = require('./package.json');
const Promise = require('bluebird');
const today = new Date().toISOString().split('T')[0];
const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const formatDate = date => `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
const removeComments = answer => answer.replace(/(?:^|\n)\# [^\n]*/g, '').replace(/(?:(?:^|\n)\#)+\n/g, '\n').trim();

const render = remark().use(recommended).use(html).process;
const report = vfile => console.error(reporter(vfile)) || vfile;
const readFile = Promise.promisify(fs.readFile);
const writeFile = Promise.promisify(fs.writeFile);

const HELP = `#
# HELP: all lines that start with a hash and a space (# ), like these help
# instructions, will be ignored - otherwise, all content is treated as markdown
# syntax, see: https://www.markdownguide.org/basic-syntax/ for details.`;
const otherContactsInstructions = `

# Please enter the details of the contact methods.
${HELP} 
#
# Below are some examples that show the desired style:
#
# - text-phone - 03 8398 74663
# - your local Post Office
# - our offices:
#     Home Office
#     2 Marsham Street
#     Westminster
#     London
#     SW1P 4DF
# - further details on our [Contact Us page](/contact "Contact Us")
#
# NOTE: the spacing on the address lines is important to keep it part of the
# same list item (4 spaces at the start of those lines).
`;
const nonComplianceInstructions = `

# Please enter the details of any non-compliance issues. For each issue make
# sure you add:
#  1. a description of the issue, and what the effect will be for users
#  2. the WCAG 2.1 guideline that has not been met, if there is one
#  3. the date you plan to fix the issue
${HELP}
#
# Below are some examples that show the desired style:
#
# - Some images do not have a text alternative, so people using a screen reader
#     cannot access the information.  
#     This fails WCAG guideline 1.1 Text Alternatives.  
#     We plan to add text alternatives for all images by September 2020. When
#     we publish new content we’ll make sure our use of images meets
#     accessibility standards.
# - Some of the input fields on the application form do not have clear labels
#     which means they are not described well by screen readers. This could
#     cause some users to not know what information they need to provide and
#     stop them from completing the form.  
#     We plan to resolve this problem by 1 November 2020.
#
# NOTE: the dash (-) at the start of each issue, and spacing on the following
# lines are important to keep it part of the same list item (4 spaces at the
# start of those lines).
`;
const disproportionateBurdenInstructions = `

# Please enter the details of the disproportionate burden claims.
#
# NOTE: it is strongly recommended that you not rely on claiming a
# disproportionate burden. It is the Home Office's view not to claim
# disproportionate burden at any point. If you still wish to make a claim
# please contact access@digital.homeoffice.gov.uk
${HELP}
`;
const outOfScopeInstructions = `

# Please enter a title and a description of any items not covered by the
# regulations.
#${HELP}
#
# Below are some examples that show the desired style:
#
# #### PDFs and other documents
# Some of our PDFs and Word documents are essential to providing our services.
# For example we have PDFs with information on how users can access our
# services, and forms published as Word documents. By September 2020, we plan
# to either fix these or replace them with accessible HTML pages.
#
# The accessibility regulations do not require us to fix PDFs or other
# documents published before 23 September 2018 if they’re not essential to
# providing our services. For example, we do not plan to fix [example of
# non-essential document].
#
# Any new PDFs or Word documents we publish will meet accessibility standards.
#
# #### Live video
# We do not plan to add captions to live video streams because live video is
# exempt from meeting the accessibility regulations.
#
# NOTE: the 4 hash symbols (#### ), represent the appropriate heading style for
# the point in the statement, please prefix your titles with that.
`;
const complianceLevels = [
  { name: 'Yes, our service has been tested and is fully compliant', value: 'full' },
  { name: 'Our service has been tested and is mostly compliant', value: 'partial' },
  { name: 'Our service has been tested but is not compliant', value: 'not' },
  { name: 'No accessibility testing has been completed yet', value: 'untested' }
];
const stringifyComplianceStatus = input => input.map(i => i.replace(/ .*$/, '').toLowerCase()).join(' and ');

module.exports = (plop) => {
  plop.setPrompt('date', require('inquirer-datepicker-prompt'));
  plop.setHelper('json', obj => JSON.stringify(obj));
  plop.setActionType('markdown', (answers, config, plop) =>
    readFile(config.source)
      .then(render)
      .then(report)
      .then(writeFile.bind(null, config.path))
  );
  plop.setGenerator('basics', {
    description: pckg.description,
    prompts: [{
      type: 'input',
      name: 'title',
      loop: true,
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
        'Change colours, contrast levels and fonts',
        'Zoom in up to 300% without the text spilling off the screen',
        'Navigate most of the website using just a keyboard',
        'Navigate most of the website using speech recognition software',
        'Listen to most of the website using a screen reader ' +
        '(including the most recent versions of JAWS, NVDA and VoiceOver)'
      ]
    }, {
      type: 'input',
      name: 'email-address',
      message: 'Please enter the email address where users can get help with the service'
    }, {
      type: 'input',
      name: 'phone-number',
      message: 'Please enter the phone number where users can get help with the service'
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
      message: 'Has your service been tested and verified to be fully WCAG 2.1 AA compliant?',
      choices: complianceLevels.map(c => c.name),
      filter: (input, answers) => {
        if (input !== complianceLevels[0].name) {
          answers['non-accessible'] = true;
        }
        answers.compliance = {
          ...answers.compliance,
          [complianceLevels.find(c => c.name === input).value]: true
        };
        return input;
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
      choices: [
        'Non-compliances - i.e. content in scope of the regulations but with accessibility issues',
        'Exemptions - i.e. inaccessible content that is out of scope of the regulations, ' +
        'or it’d be a disproportionate burden for you to make it accessible'
      ],
      filter: stringifyComplianceStatus,
      when: answers => answers.compliance['non-accessible']
    }, {
      type: 'confirm',
      name: 'non-compliance-list',
      message: 'Are there any known non-compliance issue that you would like to declare?',
      when: answers => !answers.compliance.full && !answers.compliance.untested
    }, {
      type: 'editor',
      name: 'non-compliance-list',
      message: 'Please enter the details of any non-compliance issues in the editor...',
      default: nonComplianceInstructions,
      askAnswered: true,
      when: answers => answers['non-compliance-list'] === true,
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
      type: 'confirm',
      name: 'not-in-scope-list',
      message: 'Are any areas of your service not in scope of the regulations?',
      when: answers => !answers.compliance.untested && answers.compliance['non-accessible']
    }, {
      type: 'input',
      name: 'not-in-scope-list',
      message: 'Please enter details of items not covered by the regulations in the editor...',
      default: outOfScopeInstructions,
      askAnswered: true,
      when: answers => answers['not-in-scope-list'] === true,
      filter: removeComments
    }, {
      type: 'date',
      name: 'date-first-published',
      message: 'Please enter the date this statement will be published',
      format: ['d', '/', 'm', '/', 'yy'],
      date: { max: today }
    // }, {
    //   type: 'date',
    //   name: 'date-last-reviewed',
    //   message: 'Please enter the date this statement was last reviewed'
    }, {
      type: 'date',
      name: 'date-tested',
      message: 'Please enter the date the last accessibility test was completed',
      format: ['d', '/', 'm', '/', 'yy'],
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

      const date = formatDate(today);
      const pathName = `accessibility-statements/${answers.title}-${date}`;
      const versions = glob(pathName + '*')
        .map(p => p.match(/-v(?<version>\d+)\.\w+/))
        .map(v => parseInt(v ? v.groups.version : 0, 10));
      const version = versions.length && (Math.max(...versions) + 1);
      const pathNameVersion = `${pathName}${version ? '-v' + version : ''}`;
      const data = {
        'date-last-reviewed': date
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
};
