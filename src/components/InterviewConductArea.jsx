import React, {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import ChatInput from './ChatInput';
import FormattedMessage from './FormattedMessage';
import {Bot} from 'lucide-react';
import {format} from 'date-fns';

const InterviewConductArea = ({interviewQuestion, conduct, feedback, speak, botSpeak, transcribe}) => {
    const [isGeneratingInterviewQuestion, setIsGeneratingInterviewQuestion] = useState(false);
    const [isInterviewDone, setIsInterviewDone] = useState(false);
    const [interviewTranscript, setInterviewTranscript] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom()
    }, [interviewTranscript, isGeneratingInterviewQuestion])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }

    const sendCandidateAnswer = async (content) => {
        setIsGeneratingInterviewQuestion(true)

        const candidateAnswer = {id: Date.now(), content, isCandidate: true, timestamp: new Date()};
        const interviewTranscriptWithCandidateAnswer = [...interviewTranscript, candidateAnswer];
        setInterviewTranscript(interviewTranscriptWithCandidateAnswer);
        const interviewTranscriptText = interviewTranscriptWithCandidateAnswer
            .map(message => (message.isCandidate ? "Candidate" : "Interviewer") + ": " + message.content)
            .join("\n\n")
        conduct(
            interviewTranscriptText,
            interviewQuestion,
            text => {
                if (!text.includes("!END!")) {
                    const interviewerQuestion = {
                        id: Date.now() + 1,
                        content: text,
                        isCandidate: false,
                        timestamp: new Date()
                    };
                    const interviewTranscriptWithInterviewerQuestion = [...interviewTranscriptWithCandidateAnswer, interviewerQuestion];
                    setInterviewTranscript(interviewTranscriptWithInterviewerQuestion);
                }
            },
            async text => {
                if (!text.includes("!END!")) {
                    setIsGeneratingInterviewQuestion(false)
                    if (botSpeak) await speak(text)
                } else {
                    feedback(interviewTranscriptText,
                        text => {
                            const feedbackMessage = {
                                id: Date.now() + 1,
                                content: text,
                                isCandidate: false,
                                timestamp: new Date()
                            };
                            const interviewTranscriptWithFeedback = [...interviewTranscriptWithCandidateAnswer, feedbackMessage];
                            setInterviewTranscript(interviewTranscriptWithFeedback);
                        },
                        () => {
                            setIsGeneratingInterviewQuestion(false)
                            setIsInterviewDone(true)
                        })
                }
            })
    }

    return (
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <span className="font-bold text-center text-sm mb-4">Interview Conduct</span>
            <div className="flex-1 overflow-y-auto mb-4">
                <span className="text-sm mb-4">Start by greeting the interviewer</span>
                <AnimatePresence>
                    {interviewTranscript.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
                            className={`mb-4 ${message.isCandidate ? 'text-right' : 'text-left'}`}
                        >
                            <div
                                className={`inline-block p-3 rounded-lg ${message.isCandidate ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                                {!message.isCandidate && <Bot className="inline-block mr-2 h-4 w-4"/>}
                                <FormattedMessage content={message.content}/>
                                <span className="text-xs text-muted-foreground ml-2">
                  {format(new Date(message.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isGeneratingInterviewQuestion && (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                                className="flex items-center text-muted-foreground">
                        <Bot className="mr-2 h-4 w-4"/>
                        <span className="typing-animation">
              <span>.</span><span>.</span><span>.</span>
            </span>
                    </motion.div>
                )}
                <div ref={messagesEndRef}/>
            </div>
            <ChatInput onSendMessage={sendCandidateAnswer} transcribe={transcribe} disabled={isInterviewDone || isGeneratingInterviewQuestion}/>
        </div>
    );
};

export default InterviewConductArea;