'use strict';

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
# -   text-phone - 03 8398 74663
# -   your local Post Office
# -   our offices:
#     Home Office
#     2 Marsham Street
#     Westminster
#     London
#     SW1P 4DF
# -   further details on our [Contact Us page](/contact "Contact Us")
#
# NOTE: the spacing on the address lines is important to keep it part of the
# same list item (4 spaces at the start of those lines). Also each list item
# line should begin with a dash (-) and 3 spaces.
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
# -   Some images do not have a text alternative, so people using a screen
#     reader cannot access the information.
#     This fails WCAG guideline 1.1 Text Alternatives.
#     We plan to add text alternatives for all images by September 2020. When
#     we publish new content we’ll make sure our use of images meets
#     accessibility standards.
# -   Some of the input fields on the application form do not have clear labels
#     which means they are not described well by screen readers. This could
#     cause some users to not know what information they need to provide and
#     stop them from completing the form.
#     We plan to resolve this problem by 1 November 2020.
#
# NOTE: the dash (-), and 3 spaces, at the start of each issue, and spacing on
# the following lines are important to keep it part of the same list item (4
# spaces at the start of those lines).
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
${HELP}
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

module.exports = {
  otherContactsInstructions, nonComplianceInstructions, disproportionateBurdenInstructions,outOfScopeInstructions
}
