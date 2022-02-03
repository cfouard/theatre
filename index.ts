// Import stylesheets
import { recognition, setResultsCB } from './modules/speech';
import { speak } from './modules/vocalsynthesis';
import './style.css';

const theTextElmt = document.querySelector('#theText') as HTMLDivElement;
// Ouverture du fichier de texte
const textSelect = document.querySelector(
  '#textSelection'
) as HTMLSelectElement;

textSelect.onchange = () => {
  switch (textSelect.selectedIndex) {
    case 1:
      theTextElmt.innerHTML = '<p>Texte choisi: Harpagon et Frosine.</p>';
      break;
    default:
      theTextElmt.innerHTML =
        "<p class='.errormsg'>Veuillez choisir l'un des textes proposés.</p>";
      break;
  }
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
