import { Replique } from './repliques';

const explainBtn = document.querySelector(
  '#speechExplication'
) as HTMLButtonElement;

const theTextElmt = document.querySelector('#theText') as HTMLDivElement;

const SR: typeof window.SpeechRecognition =
  window.SpeechRecognition ?? (window as any).webkitSpeechRecognition;
// const SpeechRecognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
const enum SpeechStatus {
  record,
  stop,
  restart,
}

/*
 * Instanciation et configuration d'un reconnaisseur vocal
 */
export const recognition = new SR();
recognition.lang = 'fr-FR'; // La langue à reconnaitre
recognition.interimResults = false; // Produit des résultats intermédiaires
recognition.maxAlternatives = 1; // Ne montre au plus qu'une alternative
recognition.continuous = false; // Fonctionne en continue

type CB_RESULT = (txt: string) => unknown;
//let onPartialResult: undefined | CB_RESULT;
let onFinalResult: undefined | CB_RESULT;

export function setResultsCB(c: CB_RESULT): void {
  //  onPartialResult = p;
  onFinalResult = c;
}

let aEteDit = '';
let currentReplique: Replique;
let tricher = true;
let status = SpeechStatus.restart;
export function direReplique(
  replique: Replique,
  btn: HTMLButtonElement,
  cheatButton: HTMLInputElement
) {
  var newPromise;
  currentReplique = replique;
  let textStr =
    "<div class='personnage'>" + replique.personnage + '</div><br/>';
  if (cheatButton.checked) {
    textStr += "<p class='texte'>" + replique.texte + '</p>';
  }
  theTextElmt.innerHTML = textStr;
  //  btn.setAttribute('disable', 'false');
  btn.className = 'record';
  //  btn.textContent = 'Parler';
  status = SpeechStatus.record;

  return new Promise((resolve) => {
    // Ecrire des trucs ici...
    console.log('resolving direReplique...');
    // En fait, il faut que la promesse soit résolueSpeechStatus.record, resolve);
    configureButtonSpeech(btn, resolve);
  });
}

export function configureButtonSpeech(
  btn: HTMLButtonElement,
  resolve: Function
) {
  btn.onclick = () => {
    switch (status) {
      case SpeechStatus.record:
        recognition.start();
        //        setResultsCB(finParole);
        btn.className = 'stop';
        explainBtn.className = 'parlez';
        status = SpeechStatus.stop;
        break;
      case SpeechStatus.stop:
        recognition.stop();
        setResultsCB(finParole);
        writeResultat();
        btn.className = 'restart';
        explainBtn.className = 'regardez';
        status = SpeechStatus.restart;
        break;
      case SpeechStatus.restart:
        btn.className = 'record';
        explainBtn.className = 'ecoutez';
        //        btn.textContent = 'Parler';
        status = SpeechStatus.record;
        resolve();
        break;
    }
  };
}

function finParole(str: string) {
  console.log(str);
  aEteDit = str;

  //  let textStr = theTextElmt.innerHTML;
  //  textStr += '<p> ---------------------------------- </p>';
  //  textStr += "<p class='reponse'>" + str + '</p>';
  //  theTextElmt.innerHTML = textStr;
}

function writeResultat() {
  let textStr =
    "<div class='personnage'>" + currentReplique.personnage + '</div><br/>';
  textStr += '<p> ------------Vous avez dit: ---------------------- </p>';
  textStr += "<p class='reponse'>" + aEteDit + '</p>';
  textStr += '<p> ------------La réplique est: ---------------------- </p>';
  textStr += "<p class='textOrg'>" + currentReplique.texte + '</p>';
  theTextElmt.innerHTML = textStr;
}

/*
 * Abonnement à la production de résultats par le reconnaisseur vocal.
 */
let startingIndex = 0;
recognition.onresult = (event) => {
  const res = event.results.item(event.results.length - 1);
  const { transcript } = res.item(0);
  if (res.isFinal) {
    onFinalResult?.(transcript);
    startingIndex = event.results.length;
  } else {
    // On récupère les résultats non finaux précédents
    const str = [...event.results]
      .slice(startingIndex)
      .map((r) => r.item(0).transcript)
      .join(' ');
    //    onPartialResult?.(transcript);
  }
};

recognition.onerror = console.error;
