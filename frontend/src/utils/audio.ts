export const playAudio = (text: any, onEnd: any) => {
    if (!window.speechSynthesis) {
        console.error("speech synthesis is not supported this browser")
        onEnd?.()
        return
    }

    let utterance: any = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"
    utterance.rate = 1
    utterance.volume = 1
    utterance.pitch = 1

    utterance.onend = () => {
        onEnd?.()
    }

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
}