const { bold, red, green, white, gray, yellow } = require('chalk');
const configstore = require('configstore');
const request = require('request-promise-native');
const utils = require('./utils');

module.exports = async () => {
  const credentials = await utils.login_configStore();

  if (!credentials)
    return console.log(`${red('Error occured while fetching data.')}\n`);

  const studentData = await request.get(`https://${utils.conf.get('institute')}.e-kreta.hu/mapi/api/v1/Student`, { auth: { bearer: credentials['access_token'] } });
  const Name = JSON.parse(studentData)['Name'];
  const Address = JSON.parse(studentData)['AddressDataList'];
  const MothersName = JSON.parse(studentData)['MothersName'];
  const OfoName = JSON.parse(studentData)['FormTeacher'];
  console.log(bold(yellow(('Egyéb:'))))
  console.log(bold(white(`  Tanuló neve: ${Name}`)))
  console.log(bold(white(`  Lakhely: ${Address}`)))
  console.log(bold(white(`  Anyja neve: ${MothersName}`)))
  console.log(bold(white(`  Osztályfőnök neve: ${OfoName['Name']}`)))
  
 
}