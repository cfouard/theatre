import { Replique } from './repliques';

export function getAllVoices() {
  return speechSynthesis.getVoices();
}

export function getVoiceList() {
  let select: HTMLSelectElement;
  select = document.createElement('select');

  if (typeof speechSynthesis === 'undefined') {
    console.log('speechSynthesis undefined');
    return;
  }

  var voices = speechSynthesis.getVoices();

  for (var i = 0; i < voices.length; i++) {
    if (voices[i].lang.includes('fr')) {
      var option = document.createElement('option');
      //      let elmt = document.createElement('option') as HTMLOptionElement;

      option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

      if (voices[i].default) {
        option.textContent += ' -- DEFAULT';
      }

      option.setAttribute('data-lang', voices[i].lang);
      option.setAttribute('data-name', voices[i].name);
      // add the option to the select box
      select.appendChild(option);
      //      voiceSelect.add(elmt, undefined);
    }
  }
  return select;
}

export function updateVoices(repliques: Replique[], map: Map<string, string>) {
  map.forEach((key, value) => console.log('key: ', key, 'value: ', value));
  for (let i in repliques) {
    let replique = repliques[i];
    let perso = replique.personnage;
    replique.voix = map.get(perso);
    console.log('map.get(', perso, '): ', map.get(perso));
  }
}

function lireReplique(replique: Replique) {
  var speaker = new SpeechSynthesisUtterance();
  speaker.lang = 'fr-FR';
  if (replique.voix != '' && replique.voix != 'moi') {
    var theVoice = speechSynthesis.getVoices().filter(function (voice) {
      return voice.name == replique.voix;
    })[0];
    speaker.voice = theVoice;
  }
  speaker.text = replique.texte;
  speechSynthesis.speak(speaker);
}

export function répéter(repliques: Replique[]) {
  for (let i in repliques) {
    let replique = repliques[i];
    if (replique.voix != 'moi') {
      lireReplique(replique);
    }
  }
}
