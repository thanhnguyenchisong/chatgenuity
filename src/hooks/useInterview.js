import {useState} from "react";
import { INTERVIEW_HOST } from '../config';

export const INTERVIEW_MODE = Object.freeze({
    DISABLED: Symbol("disabled"),
    INTERVIEW_QUESTION: Symbol("interview-question"),
    INTERVIEW_CONDUCT: Symbol("interview-conduct")
});

const useInterview = () => {
    const [botSpeak, setBotSpeak] = useState(false)
    const [interviewMode, setInterviewMode] = useState(INTERVIEW_MODE.DISABLED)
    const [interviewQuestion, setInterviewQuestion] = useState("")

    const transcribe = async (audioBlob, done) => {
        try {
            console.log("Start transcribing")
            const form = new FormData()
            form.append("audioFile", audioBlob, "audioFile.weba")
            const response = await fetch(`${INTERVIEW_HOST}/interview/transcribe`, {
                method: "POST",
                body: form
            })
            const stream = response.body.pipeThrough(new TextDecoderStream())
            let result = ""
            for await (const value of stream) {
                result += value
            }
            console.log("Done transcribing")
            if (done) done(result)
            return result
        } catch (error) {
            console.error('Error while transcribing', error)
            if (done) done(error)
        }
    }

    const speak = async (speech, done) => {
        try {
            console.log("Start speaking")
            const response = await fetch(`${INTERVIEW_HOST}/interview/speak`, {
                method: "POST",
                body: speech
            })
            const data = await response.arrayBuffer()
            const blob = new Blob([data], {type: "audio/mpeg"})
            const blobUrl = URL.createObjectURL(blob)
            let audio = new Audio(blobUrl)
            await audio.play()
            audio.onended = () => {
                console.log("Done speaking")
                if (done) done()
            }

        } catch (error) {
            console.error('Error while speaking', error)
            if (done) done(error)
        }
    }

    const question = async (jobDescription, appender, done) => {
        try {
            const response = await fetch(`${INTERVIEW_HOST}/interview/question`, {
                method: "POST",
                body: jobDescription
            })
            const stream = response.body.pipeThrough(new TextDecoderStream())
            let result = ""
            for await (const value of stream) {
                result += value
                appender(result)
            }
            if (done) done(result)
        } catch (error) {
            console.error('Error while generating questions', error)
            if (done) done(error)
        }
    }

    const questionFile = async (fileBlob, fileName, appender, done) => {
        try {
            const form = new FormData()
            form.append("jobDescriptionFile", fileBlob, fileName)
            const response = await fetch(`${INTERVIEW_HOST}/interview/question-file`, {
                method: "POST",
                body: form
            })
            const stream = response.body.pipeThrough(new TextDecoderStream())
            let result = ""
            for await (const value of stream) {
                result += value
                appender(result)
            }
            if (done) done(result)
        } catch (error) {
            console.error('Error while generating questions', error)
            if (done) done(error)
        }
    }

    const conduct = async (interviewTranscript, interviewQuestion, appender, done) => {
        try {
            const response = await fetch(`${INTERVIEW_HOST}/interview/conduct`, {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({interviewTranscript, interviewQuestion})
            })
            const stream = response.body.pipeThrough(new TextDecoderStream())
            let result = ""
            for await (const value of stream) {
                result += value
                appender(result)
            }
            if (done) done(result)
        } catch (error) {
            console.error('Error while conducting interview', error)
            if (done) done(error)
        }
    }

    const feedback = async (interviewTranscript, appender, done) => {
        try {
            const response = await fetch(`${INTERVIEW_HOST}/interview/feedback`, {
                method: "POST",
                body: interviewTranscript
            })
            const stream = response.body.pipeThrough(new TextDecoderStream())
            let result = ""
            for await (const value of stream) {
                result += value
                appender(result)
            }
            if (done) done(result)
        } catch (error) {
            console.error('Error while giving feedback', error)
            if (done) done(error)
        }
    }

    return {
        transcribe,
        speak,
        question,
        questionFile,
        conduct,
        feedback,
        botSpeak,
        setBotSpeak,
        interviewMode,
        setInterviewMode,
        interviewQuestion,
        setInterviewQuestion
    }
}

export default useInterview
