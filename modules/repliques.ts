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
