// A voir:
// forEach with promises: https://riptutorial.com/javascript/example/7609/foreach-with-promises
// How to promisify the speechSunthesis API: https://www.reddit.com/r/learnjavascript/comments/88chsf/how_to_promisify_the_speechsynthesis_api/

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

  // La première voix à rentrer est "Moi !"
  var option = document.createElement('option');
  option.textContent = 'Moi !';
  option.setAttribute('data-name', 'MOI');
  select.appendChild(option);

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
    select.selectedIndex = 1;
  }
  return select;
}

export function updateVoices(repliques: Replique[], map: Map<string, string>) {
  map.forEach((key, value) => console.log('key: ', key, 'value: ', value));
  for (let i in repliques) {
    let replique = repliques[i];
    let perso = replique.personnage;
    replique.voix = map.get(perso);
    //    console.log('map.get(', perso, '): ', map.get(perso));
  }
}

export function lireReplique(replique: Replique) {
  return new Promise((resolve) => {
    var speaker = new SpeechSynthesisUtterance();
    speaker.lang = 'fr-FR';
    if (replique.voix != '' && replique.voix != 'moi') {
      var theVoice = speechSynthesis.getVoices().filter(function (voice) {
        return voice.name == replique.voix;
      })[0];
      speaker.voice = theVoice;
    }
    speaker.text = replique.texte;
    speaker.onend = resolve;
    speechSynthesis.speak(speaker);
  });
}
