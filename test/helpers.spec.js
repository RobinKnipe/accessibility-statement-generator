
const { formatDate, removeComments } = require('../src/helpers');
const {HELP, otherContactsInstructions, nonComplianceInstructions, disproportionateBurdenInstructions, outOfScopeInstructions} = require('../src/helpComments.js');
describe('helper functions', () => {
  describe('formatDate', () => {
    it('should format a date', () =>
      expect(formatDate('1999-12-31')).toEqual('31 December 1999')
    );
  });
});
