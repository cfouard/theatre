// Import stylesheets
import { extractRepliques, Replique } from './modules/repliques';
import { recognition, setResultsCB } from './modules/speech';
import { speak } from './modules/vocalsynthesis';
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

let personages: string[];
let personagesVoces: any[];

// Ouverture du fichier de texte
const textSelect = document.querySelector(
  '#textSelection'
) as HTMLSelectElement;

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

  console.log('personnages: ', personnages);
  console.log('répliques: ' + repliques);
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
