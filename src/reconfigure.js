const { Base64 } = require('js-base64');
const { green } = require('chalk');
const Fuse = require('fuse.js');
const inquirer = require('inquirer');
const utils = require('./utils');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

module.exports = async () => {
  const institutes = await utils.getInstitutes();

  const fuse = new Fuse(institutes, {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      'Name',
      'InstituteCode'
    ]
  });

  const answers = await inquirer.prompt([
    {
      type: 'autocomplete',
      name: 'institute',
      message: 'Válassz iskolát:',
      source: function(answers, input = '') {
        return new Promise(function(resolve) {
          if (input.length < 1)
            return resolve(institutes.map(e => e.Name.trim()));

          resolve(fuse.search(input).map(e => e.Name.trim()));
        });
      }
    },
    {
      type: 'input',
      name: 'username',
      message: 'Felhasználónév:'
    },
    {
      type: 'input',
      name: 'password',
      message: 'Jelszó:'
    }
  ]);

  utils.conf.set('institute', institutes.filter(x => x.Name.trim() == answers['institute'])[0]['InstituteCode']);
  utils.conf.set('username', Base64.encode(answers['username']));
  utils.conf.set('password', Base64.encode(answers['password']));

  console.log(`${green('A konfigurálás sikeresen frissítve / beállítva.')}`)
  
};
