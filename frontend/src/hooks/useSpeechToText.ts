import { useEffect, useRef, useState } from "react"

type SpeechRecognitionInstance = {
    continuous: boolean
    interimResults: boolean
    lang: string
    start: () => void
    stop: () => void
    abort: () => void
    onresult: ((event: any) => void) | null
    onerror: ((event: any) => void) | null
    onend: (() => void) | null
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

declare global {
    interface Window {
        SpeechRecognition?: SpeechRecognitionConstructor
        webkitSpeechRecognition?: SpeechRecognitionConstructor
    }
}

export const useSpeechToText = (onSilence: any) => {
    const recognitionRef = useRef<any>("")
    const silenceTimeRef = useRef<any>("")
    const onSilenceRef = useRef<any>(onSilence)
    const transcriptRef = useRef<any>("")
    const [transcript, setTranscript] = useState<any>("")

    useEffect(() => {
        onSilenceRef.current = onSilence
    }, [onSilence])

    useEffect(() => {
        transcriptRef.current = transcript
    }, [transcript])


    const startListening = () => {
        const SpeechRecognition: any =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition

        if (!SpeechRecognition) {
            console.error('speech recognition is not supported')
            return
        }

        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.lang = "en-US"
        recognition.interimResult = true

        recognition.onresult = (event) => {
            let finalText = ''
            let interimText = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i]
                const transcript = result[0].transcript

                if (result.isFinal) {
                    finalText += transcript
                } else {
                    interimText += transcript
                }
            }

            if (finalText) {
                setTranscript((prev) => (prev + " " + finalText).trim())
            }

            if (finalText || interimText) {
                resetSilenceTimer()
            }
        }

        recognition.onerror = (error) => {
            console.error('speech recognition error', error)
        }

        recognition.start()
        recognitionRef.current = recognition
    }

    const resetSilenceTimer = () => {
        clearTimeout(silenceTimeRef.current)

        silenceTimeRef.current = setTimeout(() => {
            onSilenceRef.current(transcriptRef.current)
        }, 3000);
    }

    const stopListening = () => {
        recognitionRef?.current?.stop()
        clearTimeout(silenceTimeRef.current)
    }

    return {
        stopListening,
        startListening,
        resetSilenceTimer
    }
}
