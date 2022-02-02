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
