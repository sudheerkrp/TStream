"use client"
import { generateAIText } from "@/lib/actions/openAI.actions";
import { send, bot, user } from "@/public/assets";
import { useState, useRef, useEffect} from "react";

interface Conversation 
{
    prompt: string;
    response: string;
    uniqueId: string;
};

interface Props 
{
    isAi: boolean;
    value: string;
};

const ChatStripe = ({isAi, value}: Props) => {
    return (
        <div className={`wrapper ${isAi && 'ai'}`}>
            <div className="chat">
                <div className="profile">
                    <img src={isAi ? bot.src : user.src} alt={isAi ? "Bot" : "User"} />
                </div>
                <div className="message">{value}</div>
            </div>
        </div>
    );
}

export default function Page() 
{
    const [prevConversation, setPrevConversation] = useState<Conversation[]>([]);
    const [response, setResponse] = useState("");
    const [promptTxt, setPromptTxt] = useState("");
    const [formTxt, setFormTxt] = useState("");
    const [typing, setTyping] = useState(false);

    const Ref = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if(Ref && Ref.current)
            Ref.current.scrollTop = Ref.current.scrollHeight;
    };

    useEffect(() => {
        scrollToBottom();
      }, [response]);

    const typeText = (questionText: string, ansText: string) => {
        let index = 0;
        setResponse("");
        setPromptTxt(questionText);
        setTyping(true);
        scrollToBottom();
        let interval = setInterval(() => {
            if(index < ansText.length)
            {
                setResponse(ansText.substring(0, index+1));
                index++;
            }
            else
            {
                let newConversation = prevConversation;
                newConversation.push({prompt: questionText, response: ansText, uniqueId: generateUniqueId()});
                setPromptTxt("");
                setResponse("");
                setPrevConversation(newConversation);
                setTyping(false);
                clearInterval(interval);
            }
        }, 10);
    }

    const generateTxt = async (questionText: string) => {
        let data = await generateAIText(questionText);
        data = data.trim();
        typeText(questionText, data);
    }

    const generateUniqueId = () => {
        const timestamp = Date.now();
        const randomNumber = Math.random();
        const hexadecimalString = randomNumber.toString(16);
        return `id-${timestamp}-${hexadecimalString}`;
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if(formTxt !== '')
        {
            await generateTxt(formTxt);
            setFormTxt("");
        }
    }

    const handleChange = async (e: any) => {
        e.preventDefault();
        setFormTxt(e.target.value);
    }

    return (
        <div id="app">
            <div ref={Ref} id="chat_container">
                {prevConversation.map((conversation: Conversation) => (
                    <div key={conversation.uniqueId}>
                        <ChatStripe isAi={false} value={conversation.prompt} />
                        <ChatStripe isAi={true} value={conversation.response} />
                    </div>
                ))}
                {typing && (
                    <>
                        <ChatStripe isAi={false} value={promptTxt} />
                        <ChatStripe isAi={true} value={response} />
                    </>
                )}
            </div>
            <form className="ai-text-form">
                <textarea placeholder="Enter your prompt here ..." value={formTxt} onChange={handleChange} cols={1} rows={1} className="ai-text-textarea">
                </textarea>
                <button disabled={typing} className="ai-text-button" type="button" onClick={handleSubmit}>
                    <img src={send.src} alt="Send"/>
                </button>
            </form>
        </div>
    );
}