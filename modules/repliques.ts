import { direReplique } from './speech';
import { lireReplique } from './vocalsynthesis';

export class Replique {
  personnage: string;
  voix: string;
  texte: string;

  constructor(personnage: string, texte: string, voix: string) {
    this.personnage = personnage;
    this.texte = texte;
    this.voix = voix;
  }
}

export function extractRepliques(texteInput: string, separator = '==') {
  var currentText = texteInput;
  var firstSeparator = -1;
  var nextSeparator = -1;
  var personnage = '';
  var texte = '';
  var personnagesSet = new Set<string>();
  var personnages = new Array<string>();
  var repliques = new Array<Replique>();

  do {
    firstSeparator = -1;
    nextSeparator = -1;
    firstSeparator = currentText.indexOf(separator);

    currentText = currentText.substring(firstSeparator + separator.length);
    nextSeparator = currentText.indexOf(separator);

    personnage = currentText.substring(0, nextSeparator).trim();

    currentText = currentText.substring(nextSeparator + separator.length);

    nextSeparator = currentText.indexOf(separator);
    if (nextSeparator != -1) {
      texte = currentText.substring(0, nextSeparator);
    } else {
      texte = currentText;
    }
    personnagesSet.add(personnage);
    repliques.push(new Replique(personnage, texte, 'default'));
  } while (nextSeparator != -1);
  personnages = Array.from(personnagesSet);

  return [personnages, repliques];
}

function afficheReplique(replique: Replique, theTextElmt: HTMLDivElement) {
  let textStr =
    "<div class='personnage'>" + replique.personnage + '</div><br/>';
  textStr += "<p class='texte'>" + replique.texte + '</p>';
  theTextElmt.innerHTML = textStr;
}

export function apprendreTexte(
  repliques: Replique[],
  theTextElmt: HTMLDivElement,
  btn: HTMLButtonElement,
  cheatButton: HTMLInputElement
) {
  var newPromise;
  var i = 0;

  var nextPromise = function () {
    if (i >= repliques.length) {
      // Processing finished
      return;
    }
    let replique = repliques[i];

    if (replique.voix != 'MOI') {
      afficheReplique(replique, theTextElmt);
      // Process next function. Wrap Promise.resolve in
      // case the function does not return a promiqe
      newPromise = Promise.resolve(lireReplique(replique));
    } else {
      newPromise = Promise.resolve(
        direReplique(replique, theTextElmt, btn, cheatButton)
      );
    }
    i++;
    // Chain to finish Processing
    return newPromise.then(nextPromise);
  };

  // Kick of the Chain
  return Promise.resolve().then(nextPromise);
}
