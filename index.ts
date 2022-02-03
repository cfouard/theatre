// Import stylesheets
import { recognition, setResultsCB } from './modules/speech';
import { speak } from './modules/vocalsynthesis';
import './style.css';

// Import des textes
import { harpagonFrosine } from './textes/harpagonEtFrosine';

let theTexte = '';
const theTextElmt = document.querySelector('#theText') as HTMLDivElement;
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
  theTextElmt.innerHTML = theTexte;
};

// Speech
const bt = document.querySelector('#speech') as HTMLButtonElement;
let reco = false;
bt.onclick = () => {
  if (reco) {
    recognition.stop();
    setResultsCB(speechCB, speechCB);
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
