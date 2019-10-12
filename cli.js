const { bold } = require('chalk');
const inquirer = require('inquirer');
const meow = require('meow');

const pkg = require('./package.json');
const _averages = require('./src/averages');
const _reconfigure = require('./src/reconfigure');
const _jegyek = require('./src/jegyek');
const _absences = require('./src/absences');
const _about = require('./src/about');
const _dabsences = require('./src/dabsences');

const cli = meow(`
 ${bold('Használat:')}
   $ kreta <opciók>

 ${bold('Options')}
   -a, --averages       Átlag tantárgyantként
   -j					Jegyek kiírása
   -h 					Hiányzások kiírása
   -e					Egyéb információk kiírása
   --reconfigure        Konfiguráció frissítése / beállítása

 ${bold('Examples')}
   See: majd te paraszt xd
`,
{
  flags: {
    averages: {
      type: 'boolean',
      alias: 'a',
      default: false
    },
    interactive: {
      type: 'boolean',
      alias: 'i',
      default: false
    },
    reconfigure: {
      type: 'boolean',
      default: false
    },
    jegyek: {
      type: 'boolean',
      alias: 'j'
    },
    absences: {
      type: 'boolean',
      alias: 'h'
    },
	about: {
	  type: 'boolean',
	  alias: 'e'
	},
	dabsences: {
	  type: 'boolean',
	  alias: 'k'
	}
  }
});

const {
  averages: AVERAGES,
  interactive: INTERACTIVE,
  reconfigure: RECONFIGURE,
  jegyek: JEGYEK,
  absences: ABSENCES,
  about: ABOUT,
  dabsences: DABSENCES
} = cli.flags;

async function _interactive() {
  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'tasks',
      message: 'Válassz:',
      choices: [
        { name: 'Átlag', value: 'averages', checked: false },
        { name: 'Jegyek', value: 'jegyek', checked: false },
        { name: 'Hiányzások', value: 'absences', checked: false },
		{ name: 'Egyéb', value: 'about', checked: false },
        { name: 'Konfiguráció frissítése', value: 'reconfigure', checked: false }
      ]
    }
  ]);

  for (const task of answers['tasks']) {
    switch (task) {
      case 'averages':
        await _averages();
        break;
      case 'reconfigure':
        await _reconfigure();
        break;
      case 'jegyek':
        await _jegyek();
        break;
      case 'absences':
        await _absences();
        break;
	  case 'interactive':
	    await _interactive();
		break;
	  case 'about':
	    await _about();
		break
	   case 'dabsences':
		await _dabsences();
		break
    }
  }
}


(async () => {
  let noFlag = true;

  if (INTERACTIVE) {
    await _interactive();
    return;
  }

  if (JEGYEK) {
    await _jegyek();
    noFlag = false;
  }

  if (RECONFIGURE) {
    await _reconfigure();
    noFlag = false;
  }

  if (AVERAGES) {
    await _averages();
    noFlag = false;
  }
  if (ABSENCES) {
    await _absences();
    noFlag = false;
  }

  if (ABOUT) {
	  await _about();
	  noFlag = false;
  }
  
  if (DABSENCES) {
	  await _dabsences();
	  noFlag = false;
  }

  if (noFlag)
    await _interactive();

 
  process.exit();
})();