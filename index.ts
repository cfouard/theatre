// Import stylesheets
import {
  apprendreTexte,
  extractRepliques,
  Replique,
} from './modules/repliques';
import {
  configureButtonSpeech,
  recognition,
  setResultsCB,
} from './modules/speech';
import { getVoiceList, updateVoices } from './modules/vocalsynthesis';
import './style.css';

// Import des textes
import { harpagonFrosine } from './textes/harpagonEtFrosine';
import { extrait14juillet } from './textes/extraitPlateauLibre';

console.clear();
let theTexte = '';
let personnages;
let repliques;
let personagesVoces: any[];

const theTextElmt = document.querySelector('#theText') as HTMLDivElement;
const persoSelection = document.querySelector(
  '#personnageSelection'
) as HTMLSelectElement;
const persovoix = document.querySelector('#choixPersoVoix') as HTMLTableElement;

// Ouverture du fichier de texte
const textSelect = document.querySelector(
  '#textSelection'
) as HTMLSelectElement;

const voiceSelect = document.querySelector('#voiceSelect') as HTMLSelectElement;

const cheatButton = document.querySelector('#triche') as HTMLInputElement;

textSelect.onchange = () => {
  let filename = '';
  switch (textSelect.selectedIndex) {
    case 1:
      theTexte = extrait14juillet;
      break;
    case 2:
      theTexte = harpagonFrosine;
      break;
    default:
      theTexte = "Veuillez choisir l'un des textes proposés.";
      break;
  }
  [personnages, repliques] = extractRepliques(theTexte);
  //  console.log('personnages: ', personnages);
  updatePersoVoix(personnages);

  //  theTextElmt.innerHTML = theTexte;
};

// Speech
const bt = document.querySelector('#speech') as HTMLButtonElement;
//configureButtonSpeech(bt);

const lectureBt = document.querySelector('#read') as HTMLButtonElement;
let pause = false;
lectureBt.onclick = () => {
  updateVoices(repliques, getMapPersoVoix());
  apprendreTexte(repliques, theTextElmt, bt, cheatButton);
};

// //////

function updatePersoVoix(personnages: string[]) {
  for (let i in personnages) {
    let ligne = persovoix.tBodies[0].insertRow();

    let casePerso = ligne.insertCell();
    let caseVoix = ligne.insertCell();

    casePerso.appendChild(document.createTextNode(personnages[i]));

    let select = getVoiceList();
    caseVoix.appendChild(select);
  }
}

function getMapPersoVoix() {
  let map = new Map<string, string>();
  var rows = persovoix.getElementsByTagName('tr');
  if (rows.length > 1) {
    for (let i = 1; i < rows.length; i++) {
      let cells = rows[i].getElementsByTagName('td');
      if (cells.length == 2) {
        let perso = cells[0].innerHTML.trim();
        let voiceSelectionCell = cells[1] as HTMLTableDataCellElement;
        let voiceSelection = voiceSelectionCell.getElementsByTagName(
          'select'
        )[0] as HTMLSelectElement;
        let voiceName =
          voiceSelection[voiceSelection.selectedIndex].getAttribute(
            'data-name'
          );
        //        console.log('perso: [', perso, ']');
        //        console.log('voice: [', voiceName, ']');

        map.set(perso, voiceName);
      }
    }
  }
  return map;
}

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = getVoiceList;
}
