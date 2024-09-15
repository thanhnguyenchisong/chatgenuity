import React, {useRef, useState} from 'react';
import {ListStart, MonitorPlay} from 'lucide-react';
import {Textarea} from "@/components/ui/textarea.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {INTERVIEW_MODE} from "@/hooks/useInterview.js";

const InterviewQuestionArea = ({setInterviewMode, setInterviewQuestion, question, questionFile}) => {
    const [jobDescription, setJobDescription] = useState("")
    const [draftInterviewQuestion, setDraftInterviewQuestion] = useState("")
    const [isGeneratingInterviewQuestion, setIsGeneratingInterviewQuestion] = useState(false)
    const fileRef = useRef()

    const handleInterviewQuestion = e => {
        e.preventDefault();
        setDraftInterviewQuestion("")
        setIsGeneratingInterviewQuestion(true)
        if (fileRef.current?.value) {
            questionFile(
                fileRef.current?.files[0],
                fileRef.current?.files[0].name,
                text => setDraftInterviewQuestion(text),
                () => setIsGeneratingInterviewQuestion(false))
        } else {
            question(
                jobDescription,
                text => setDraftInterviewQuestion(text),
                () => setIsGeneratingInterviewQuestion(false))
        }
    }

    const handleInterviewConduct = e => {
        e.preventDefault();
        setInterviewQuestion(draftInterviewQuestion)
        setInterviewMode(INTERVIEW_MODE.INTERVIEW_CONDUCT)
    }

    return (
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <span className="font-bold text-center text-sm mb-4">Interview Questions</span>
            <div className="flex-1 overflow-y-auto mb-4">
                <form onSubmit={handleInterviewQuestion} className="flex items-end">
                    <div className="flex-1 mr-2">
                        <Textarea
                            disabled={isGeneratingInterviewQuestion}
                            value={jobDescription}
                            onChange={e => setJobDescription(e.target.value)}
                            placeholder="Job Description"
                            rows={9}
                        />
                        <Input ref={fileRef} disabled={isGeneratingInterviewQuestion} type="file"/>
                    </div>
                    <Button type="submit" disabled={isGeneratingInterviewQuestion} size="icon">
                        <ListStart className="h-4 w-4"/>
                    </Button>
                </form>
                <form onSubmit={handleInterviewConduct} className="flex items-end mt-16">
                    <div className="flex-1 mr-2">
                        <Textarea
                            disabled={isGeneratingInterviewQuestion}
                            value={draftInterviewQuestion}
                            onChange={e => setDraftInterviewQuestion(e.target.value)}
                            placeholder="Interview Questions"
                            rows={9}
                        />
                    </div>
                    <Button type="submit" disabled={isGeneratingInterviewQuestion} size="icon">
                        <MonitorPlay className="h-4 w-4"/>
                    </Button>
                </form>
            </div>
        </div>
);
};

export default InterviewQuestionArea;