const SR: typeof window.SpeechRecognition =
  window.SpeechRecognition ?? (window as any).webkitSpeechRecognition;
// const SpeechRecognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;

/*
 * Instanciation et configuration d'un reconnaisseur vocal
 */
export const recognition = new SR();
recognition.lang = 'fr-FR'; // La langue à reconnaitre
recognition.interimResults = false; // Produit des résultats intermédiaires
recognition.maxAlternatives = 1; // Ne montre au plus qu'une alternative
recognition.continuous = false; // Fonctionne en continue

type CB_RESULT = (txt: string) => unknown;
let onPartialResult: undefined | CB_RESULT;
let onFinalResult: undefined | CB_RESULT;

export function setResultsCB(p: CB_RESULT, c: CB_RESULT): void {
  onPartialResult = p;
  onFinalResult = c;
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
    onPartialResult?.(transcript);
  }
};
recognition.onerror = console.error;
