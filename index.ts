// Import stylesheets
import { extractRepliques, Replique } from './modules/repliques';
import { recognition, setResultsCB } from './modules/speech';
import {
  fillInVoiceList,
  getAllVoices,
  getVoiceList,
  speak,
} from './modules/vocalsynthesis';
import './style.css';

// Import des textes
import { harpagonFrosine } from './textes/harpagonEtFrosine';

console.clear();
let theTexte = '';
let personnages;
let repliques;

const theTextElmt = document.querySelector('#theText') as HTMLDivElement;
const persoSelection = document.querySelector(
  '#personnageSelection'
) as HTMLSelectElement;
const persovoix = document.querySelector('#choixPersoVoix') as HTMLTableElement;

let personages: string[];
let personagesVoces: any[];

// Ouverture du fichier de texte
const textSelect = document.querySelector(
  '#textSelection'
) as HTMLSelectElement;

const voiceSelect = document.querySelector('#voiceSelect') as HTMLSelectElement;

textSelect.onchange = () => {
  let filename = '';
  switch (textSelect.selectedIndex) {
    case 1:
      theTexte = harpagonFrosine;
      break;
    default:
      theTexte = "Veuillez choisir l'un des textes proposés.";
      break;
  }

  [personnages, repliques] = extractRepliques(theTexte);
  updatePersoVoix(personnages);

  theTextElmt.innerHTML = theTexte;
};

// Speech
const bt = document.querySelector('#speech') as HTMLButtonElement;
let reco = false;
bt.onclick = () => {
  if (reco) {
    recognition.stop();
    setResultsCB(speechCB);
  } else {
    recognition.start();
  }
  reco = !reco;
  bt.textContent = reco ? 'Stopper' : 'Parler';
};

function speechCB(str: string) {
  console.log(str);
}

const lectureBt = document.querySelector('#read') as HTMLButtonElement;
lectureBt.onclick = () => {
  speak('Tu aimes le thé ?');
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

function updatePersoSelection(personnages: string[]) {
  let invite = persoSelection.item(0).textContent;
  console.log('invite: ', invite);

  persoSelection.options.length = 0;

  let elmt = document.createElement('option');
  elmt.textContent = invite;
  persoSelection.options.add(elmt);
  for (let i in personnages) {
    let elmt = document.createElement('option');
    elmt.textContent = personnages[i];
    persoSelection.options.add(elmt);
  }
}
