
const { formatDate, removeComments, today } = require('../src/helpers');
const {HELP, otherContactsInstructions, nonComplianceInstructions, disproportionateBurdenInstructions, outOfScopeInstructions} = require('../src/helpStrings.js');
describe('helper functions', () => {
  describe('formatDate', () => {
    it('should format a date', () =>
      expect(formatDate('1999-12-31')).toEqual('31 December 1999')
    );
  });

  describe('removeComments', ()=> {
    it('should remove comments', () => {

      expect(removeComments(otherContactsInstructions)).toEqual('')
      expect(removeComments(nonComplianceInstructions)).toEqual('')
      expect(removeComments(disproportionateBurdenInstructions)).toEqual('')
      expect(removeComments(outOfScopeInstructions)).toEqual('')
    });
    it('should remove comments from user input', () => {
      expect(removeComments('some user input' + otherContactsInstructions)).toEqual('some user input')
      expect(removeComments('#\n\nsome user input\n#' + otherContactsInstructions)).toEqual('some user input')
      expect(removeComments(`#
# HELP: all lines that start with a hash and a space (# ), like these help
# instructions, will be ignored - otherwise, all content is treated as markdown
# syntax, see: https://www.markdownguide.org/basic-syntax/ for details.`)).toEqual('')
    });
  });

describe('check today function', ()=>{
  it('should return a string in format yyyy-mm-dd', ()=>{
    expect(today()).toMatch(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/);
  })
});

});
