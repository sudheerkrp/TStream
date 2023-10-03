"use client"
import { send, bot, user } from "@/public/assets";
import { useState, useRef, useEffect } from "react";

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
    const [loadInterval, setLoadInterval] = useState<any>(undefined);
    const [loaderContent, setLoaderContent] = useState("");
    const [prevConversation, setPrevConversation] = useState<Conversation[]>([{prompt: "Hello", response: "Hi there!", uniqueId: "xxx1233"}]);
    const [response, setResponse] = useState("");
    const [prompt, setPrompt] = useState("");
    const [formTxt, setFormTxt] = useState("");

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
		const handleKeyUp = (event: KeyboardEvent) => {
            if (event.keyCode === 13) {
              handleSubmit(event);
            }
          };
        
          const currentForm = formRef.current;
          if (currentForm) {
            currentForm.addEventListener('keyup', handleKeyUp);
          }
        
          return () => {
            if (currentForm) {
              currentForm.removeEventListener('keyup', handleKeyUp);
            }
          };
	}, []);

    const loader = () => {
        setLoaderContent("");
        setLoadInterval(setInterval(() => {
            setLoaderContent(loaderContent+".");
            if(loaderContent === "....")
                setLoaderContent("");
        }, 300));
    }

    const typeText = (text: string) => {
        let index = 0;
        setResponse("");
        let interval = setInterval(() => {
            if(index < text.length)
            {
                setResponse(response+text.charAt(index));
                index++;
            }
            else
            {
                let newConversation = prevConversation;
                newConversation.push({prompt: prompt, response: response, uniqueId: generateUniqueId()});
                setPrompt("");
                setResponse("");
                setPrevConversation(newConversation);
                clearInterval(interval);
            }
        }, 20);
    }

    const generateUniqueId = () => {
        const timestamp = Date.now();
        const randomNumber = Math.random();
        const hexadecimalString = randomNumber.toString(16);
        return `id-${timestamp}-${hexadecimalString}`;
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("FormTxt: ", formTxt);
        setPrompt(formTxt);
        console.log("Prompt: ", prompt);
        setFormTxt("");

        const data = "Hello, I am doing fine, what about you!";
        typeText(data);
    }

    const handleChange = async (e: any) => {
        e.preventDefault();
        setFormTxt(e.target.value);
    }

    return (
        <div id="app">
            <div id="chat_container">
                {prevConversation.map((conversation: Conversation) => (
                    <div key={conversation.uniqueId}>
                        <ChatStripe isAi={false} value={conversation.prompt} />
                        <ChatStripe isAi={true} value={conversation.response} />
                    </div>
                ))}
                {prompt && (
                    <>
                        <ChatStripe isAi={false} value={prompt} />
                        <ChatStripe isAi={true} value={response} />
                    </>
                )}
            </div>
            <form ref={formRef} className="ai-text-form">
                <textarea placeholder="Enter your prompt" value={formTxt} onChange={handleChange} onSubmit={handleSubmit} name="prompt" cols={1} rows={1} className="ai-text-textarea">
                </textarea>
                <button className="ai-text-button" type="button" onClick={handleSubmit}>
                    <img src={send.src} alt="Send"/>
                </button>
            </form>
        </div>
    );
}