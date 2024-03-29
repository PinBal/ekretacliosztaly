const { Base64 } = require('js-base64');
const { bold, red } = require('chalk');
const configstore = require('configstore');
const request = require('request-promise-native');

const _reconfigure = require('./reconfigure');

exports.pkg = require('../package.json');
exports.conf = new configstore(exports.pkg.name);

exports.getInstitutes = async () => {
  const response = await request.get('https://kretaglobalmobileapi.ekreta.hu/api/v1/Institute', { headers: { apiKey: '7856d350-1fda-45f5-822d-e1a2f3f1acf0' } });
  return JSON.parse(response);
}

exports.login = async (institute, username, password) => {
  try {
    const response = await request.post(`https://${institute}.e-kreta.hu/idp/api/v1/Token`, { body: `institute_code=${institute}&userName=${username}&password=${password}&grant_type=password&client_id=919e0c1c-76a2-4646-a2fb-7085bbbf3c56` });
    return JSON.parse(response);
  } catch(e) {
    return e.statusCode || 0;
  }
}

exports.login_configStore = async () => {
  if ((exports.conf.get('institute') || '') == '' || (exports.conf.get('username') || '') == '' || (exports.conf.get('password') || '') == '') {
    console.log(`${red('A konfigurációból hiányoznak szükséges adatok.')} Running reconfigure...`);
    await _reconfigure();
  }

  const response = await exports.login(exports.conf.get('institute'), Base64.decode(exports.conf.get('username')), Base64.decode(exports.conf.get('password')));

  if (response == 0) {
    console.log(`${red('Hibás konfiguráció.')} ${bold('Run kreta --reconfigure.')}`);
    return false;
  }

  if (!response['access_token']) {
    console.log(`${red('Invalid username or password in configuration.')} ${bold('Run kreta --reconfigure.')}`);
    return false;
  }

  return response;
}
