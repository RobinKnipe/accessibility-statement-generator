'use strict';

const pckg = require('./package.json');
const today = new Date().toISOString().split('T')[0];
const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const formatDate = date => `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;

module.exports = (plop) => {
  plop.setPrompt('date', require('inquirer-datepicker-prompt'));
  // plop.setPrompt('recursive', require('./src/recursive'));
  plop.setHelper('json', obj => JSON.stringify(obj));
  plop.setGenerator('basics', {
    description: pckg.description,
    prompts: [{
      type: 'input',
      name: 'title',
      loop: true,
      message: 'Please enter the title of the service'
    }, { /*
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
    }, { */
      type: 'confirm',
      name: 'other-contacts',
      message: 'Are there any other forms of contact where users can get help with the service?'
    }, {
      type: 'editor',
      name: 'other-contacts',
      message: 'Please enter the details of the contact methods',
      askAnswered: true,
      when: answers => console.log(answers) || answers['other-contacts'],
      default: '# Please enter the details of the contact methods below.' +
        ''
    }, {
      type: 'number',
      name: 'response-time',
      message: 'Please enter the maximum response time (in days)' /*
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
      type: 'confirm',
      name: 'compliance.full',
      message: 'Has your service been tested and verified to be fully WCAG 2.1 AA compliant?'
    }, {
      type: 'confirm',
      name: 'compliance.non-accessible',
      message: 'Would you still like to include the boilerplate "Non-accessible content" section?'
    }, {
      type: 'confirm',
      name: 'compliance.partial',
      message: 'Has your service been tested and verified to be mostly WCAG 2.1 AA compliant?'
    }, {
      type: 'checkbox',
      name: 'compliance.status',
      message: 'What types of issues does your service have? [Select both if they apply]',
      choices: [
        'Non-compliances - i.e. content in scope of the regulations but with accessibility issues',
        'Exemptions - i.e. inaccessible content that is out of scope of the regulations, ' +
        'or it’d be a disproportionate burden for you to make it accessible'
      ],
      // filter: stringifyComplianceStatus
    }, {
      type: 'recursive',
      name: 'non-compliance-list',
      message: 'Would you like to add details of a non-compliance issue?',
      prompts: [{
        type: 'input',
        name: 'accessibility-problem',
        message: 'Please enter the name of the accessibility problem'
      }, {
        type: 'input',
        name: 'wcag-guideline',
        message: 'Please enter the reference for the WCAG guideline [optional]'
      }, {
        type: 'date',
        name: 'resolution-date',
        message: 'Please enter the date when the problem should have been resolved',
        // default: new Date().toISOString().split('T')[0],
        format: ['d', '/', 'm', '/', 'yy'],
        date: { min: today }
      }]
    }, {
      type: 'recursive',
      name: 'disproportionate-burden-list',
      message: 'Would you like to add details of an area of disproportionate burden?',
      prompts: [{
        type: 'input',
        name: 'disproportionate-burden',
        message: 'Please enter the details of the disproportionate burden'
      }]
    }, {
      type: 'recursive',
      name: 'not-in-scope-list',
      message: 'Would you like to add details of something not in scope of the regulations?',
      prompts: [{
        type: 'input',
        name: 'scope-title',
        message: 'Please enter the title of the item not covered by the regulations'
      }, {
        type: 'input',
        name: 'scope-description',
        message: 'Please enter the description of the item not covered by the regulations'
      }]
    // }, {
    //   type: 'date',
    //   name: 'date-first-published',
    //   message: 'Please enter the date this statement will be published'
    // }, {
    //   type: 'date',
    //   name: 'date-last-reviewed',
    //   message: 'Please enter the date this statement was last reviewed'
    }, {
      type: 'date',
      name: 'date-tested',
      message: 'Please enter the date the last accessibility test was completed',
      format: ['d', '/', 'm', '/', 'yy'],
      date: { max: today }
    }, {
      type: 'confirm',
      name: 'home-office-tested',
      message: 'Was the accessibility testing carried out by the Home Office?'
    }, {
      type: 'input',
      name: 'organisation-tested',
      message: 'Please enter the name of the organisation that carried out the test, or leave blank if your team did it'
    }, {
      type: 'input',
      name: 'extra-test-info',
      message: 'Please enter any extra details about how the testing was carried out [optional]' */
    }],

    actions: [{
      type: 'add',
      path: 'accessibility-statements/{{title}}-{{date}}.json',
      template: '{{#json this}}{{/json}}'
    }, {
      type: 'add',
      path: 'accessibility-statements/{{title}}-{{date}}.md',
      templateFile: 'statement-template.md.hbs'
    }]
  });
};
