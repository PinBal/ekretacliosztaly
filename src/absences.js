const { bold, red, green, white, gray, yellow } = require('chalk');
const configstore = require('configstore');
const request = require('request-promise-native');
const utils = require('./utils');

module.exports = async () => {
  const credentials = await utils.login_configStore();

  if (!credentials)
    return console.log(`${red('Error occured while fetching data.')}\n`);

  const studentData = await request.get(`https://${utils.conf.get('institute')}.e-kreta.hu/mapi/api/v1/Student`, { auth: { bearer: credentials['access_token'] } });
  const subjectAverages = JSON.parse(studentData)['Absences'];
  function date_cutter(a) {
    var str = a; 
	var res = str.slice(0,10)
	return res
  }

  function test(){
    subjectAverages.forEach(subj => {
	    var TypeName = subj['TypeName']
	    var Teacher = subj['Teacher']
	    var Tantargy = subj['SubjectCategoryName']
	    var JustificationStateName = subj['JustificationStateName']
	    var JustificationTypeName = subj['JustificationTypeName']
	    var Datum = date_cutter(subj['LessonStartTime'])
	    return Datum
	    console.log(TypeName, Teacher, Tantargy, JustificationStateName, JustificationTypeName, Datum)
    })
  }






  function odb(){
    var arrey = []
	var arrey2 = []
    subjectAverages.forEach(subj => {
        arrey[arrey.length] = date_cutter(subj['LessonStartTime']);
		arrey2[arrey2.length] = subj['JustificationStateName'];
    })
    return arrey;
	return arrey2;
  }

  function odb2(){
	var arrey2 = []
    subjectAverages.forEach(subj => {
		arrey2[arrey2.length] = subj['JustificationStateName'];
    })
	return arrey2;
  }

  var hianyzott_napok = odb()

  function removeDups(names) {
  let unique = {};
  names.forEach(function(i) {
    if(!unique[i]) {
      unique[i] = true;
    }
  });
  return Object.keys(unique);
  }

  var hianyzott_napok = removeDups(hianyzott_napok);
  function igazolt(a){
	var p = ""
	iArray = []
    subjectAverages.forEach(subj => {
        if(subj['LessonStartTime'].includes(a)){
          if (subj['JustificationStateName'] == "Igazolt mulasztás"){
            iArray[iArray.length] = "igazolt";
            p = bold(green('√'))
          }else{
			iArray[iArray.length] = "igazolatlan";
            p = bold(red('×'))
          }
          }else{

          }
      
    })
    var oSz = iArray.length;
    return oSz;
  }
  
  function pipa(a){
	var p = ""
    subjectAverages.forEach(subj => {
        if(subj['LessonStartTime'].includes(a)){
          if (subj['JustificationStateName'] == "Igazolt mulasztás"){
            p = bold(green('√'))
          }else{
            p = bold(red('×'))
          }
          }else{
          }
      
    })
    return p;
  }  


  function end(){ 
    var a = hianyzott_napok
    console.log(bold(yellow('Hiányzások:')));
    for(i=0;i<a.length;i++){
		console.log(bold(white(`  ${a[i]} (${yellow(igazolt(a[i]))}${yellow("db")}) ${pipa([i])}`)));  

    }
  }

  
  end()
  
}