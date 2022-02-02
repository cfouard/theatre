// Import stylesheets
import { recognition, setResultsCB } from './modules/speech';
import { speak } from './modules/vocalsynthesis';
import './style.css';

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
