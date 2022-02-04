export function speak(text) {
  var karl = new SpeechSynthesisUtterance();
  karl.lang = 'fr-FR';
  karl.text = text;
  //  karl.onend = function () {
  //   if (callback) {
  //     callback();
  //   }
  // };
  //  karl.onerror = function (e) {
  //    if (callback) {
  //      callback(e);
  //    }
  //  };

  speechSynthesis.speak(karl);
}

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
    if (voices[i].lang.includes('fr') || voices[i].lang.includes('en')) {
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
