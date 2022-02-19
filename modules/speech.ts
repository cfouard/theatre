import { Replique } from './repliques';
const explainBtn = document.querySelector(
  '#speechExplication'
) as HTMLButtonElement;

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

let tricher = true;
let status = SpeechStatus.restart;
export function direReplique(
  replique: Replique,
  theTextElmt: HTMLDivElement,
  btn: HTMLButtonElement,
  cheatButton: HTMLInputElement
) {
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
    // En fait, il faut que la promesse soit résolue quand on reclique sur le bouton...
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
        setResultsCB(finParole);
        //        btn.textContent = 'Stop';
        btn.className = 'stop';
        explainBtn.className = 'parlez';
        status = SpeechStatus.stop;
        break;
      case SpeechStatus.stop:
        recognition.stop();
        //        btn.textContent = 'Restart';
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
