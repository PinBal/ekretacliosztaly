const { bold, red, green, white, gray, yellow } = require('chalk');
const configstore = require('configstore');
const request = require('request-promise-native');
const utils = require('./utils');


module.exports = async () => {
  const credentials = await utils.login_configStore();

  if (!credentials)
    return console.log(`${red('Error occured while fetching data.')}\n`);


  const studentData = await request.get(`https://${utils.conf.get('institute')}.e-kreta.hu/mapi/api/v1/Student`, { auth: { bearer: credentials['access_token'] } });
  const subjectAverages = JSON.parse(studentData)['Evaluations'];
  subjectAverages.sort((a, b) => a['Subject'].localeCompare(b['Subject']));
  
  function tantargyak(){
    var array = [];
    subjectAverages.forEach(subj => {
      array[array.length] = subj['Subject'];
    })
    return array
  }

  var tantargyak = tantargyak()
  function removeDups(names) {
  let unique = {};
  names.forEach(function(i) {
    if(!unique[i]) {
      unique[i] = true;
    }
  });
  return Object.keys(unique);
  }

  var tantargyak = removeDups(tantargyak);
  function jegy_by_subj(a){
    var tantargy = a;
    var jegyek_array = [];
    subjectAverages.forEach(subj => {
      if (subj['Subject'] == tantargy){
        var x = subj['NumberValue']
        jegyek_array[jegyek_array.length] = x;
      } 
    })
    return jegyek_array;
  }

  function end(){
    console.log(bold(yellow('Jegyek tantárgyanként:')));
    var i = 0;
    var len = tantargyak.length;
    var text = "";
    for (; i < len; ) {
      console.log(white(bold(`  ${tantargyak[i]}: ${jegy_by_subj(tantargyak[i])}`)));
      i++;
      
    }
  }

  end()

}