'use strict';

module.exports = {
  formatDate: date => {
    const dateObj = new Date(date);
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  },
  removeComments: answer => {
    return answer.replace(/(?:^|\n)\# [^\n]*/g, '').replace(/(?:(?:^|\n)\#)+\n/g, '\n').trim();
  },
  today: () => {return new Date().toISOString().split('T')[0];}
};
