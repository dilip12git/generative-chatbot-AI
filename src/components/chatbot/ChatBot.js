import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';
import { HiArrowUp } from "react-icons/hi";
import { HashLoader } from "react-spinners";
import { marked } from 'marked';

const API_KEY = process.env.REACT_APP_GEMINI_API;
const ChatBot = () => {
    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(true);
    const [allMessages, setAllMessages] = useState([]);
    const [typingMessage, setTypingMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const textareaRef = useRef(null);
    const chatBodyRef = useRef(null);
    const [randomItems, setRandomItems] = useState([]);

    const trainingPrompt = [
        { "role": "user", "parts": [{ "text": "Hello there! I'm the ChatBot.AI created by Dilip Kumar. I'm here to help!" }] },
        { "role": "model", "parts": [{ "text": "Got it!" }] },
        { "role": "user", "parts": [{ "text": "You" }] },
        { "role": "model", "parts": [{ "text": "I am a chatbot created by Dilip Kumar." }] },
    ];

    const recommendedPrompts  = [
        { 'id': 1, 'prompt': 'How to manage stress effectively?' },
        { 'id': 2, 'prompt': 'Tips for learning a new language.' },
        { 'id': 3, 'prompt': 'Best ways to stay motivated daily.' },
        { 'id': 4, 'prompt': 'How to start a meditation practice?' },
        { 'id': 5, 'prompt': 'Tips for improving time management.' },
        { 'id': 6, 'prompt': 'How to write engaging blog posts?' },
        { 'id': 7, 'prompt': 'Strategies to improve public speaking.' },
        { 'id': 8, 'prompt': 'Tips for building healthy habits.' },
        { 'id': 9, 'prompt': 'How to improve your focus at work?' },
        { 'id': 10, 'prompt': 'Creative ways to boost productivity.' },
        { 'id': 11, 'prompt': 'How to start a successful podcast?' },
        { 'id': 12, 'prompt': 'Tips for creating a morning routine.' },
        { 'id': 13, 'prompt': 'How to improve your coding skills?' },
        { 'id': 14, 'prompt': 'Strategies for effective networking.' },
        { 'id': 15, 'prompt': 'Tips for maintaining work-life balance.' },
        { 'id': 16, 'prompt': 'How to build a personal brand online?' },
        { 'id': 17, 'prompt': 'Ways to enhance creative thinking.' },
        { 'id': 18, 'prompt': 'Tips for becoming a better listener.' },
        { 'id': 19, 'prompt': 'How to overcome procrastination?' },
        { 'id': 20, 'prompt': 'Strategies for financial planning.' },
        { 'id': 21, 'prompt': 'Tips for learning digital marketing.' },
        { 'id': 22, 'prompt': 'How to prepare for a job interview?' },
        { 'id': 23, 'prompt': 'Ways to build self-confidence.' },
        { 'id': 24, 'prompt': 'Tips for improving sleep quality.' },
        { 'id': 25, 'prompt': 'How to start a side hustle?' },
        { 'id': 26, 'prompt': 'Strategies for managing anxiety.' },
        { 'id': 27, 'prompt': 'Tips for learning graphic design.' },
        { 'id': 28, 'prompt': 'How to develop a growth mindset?' },
        { 'id': 29, 'prompt': 'Ways to enhance communication skills.' },
        { 'id': 30, 'prompt': 'Tips for staying organized at home.' },
        { 'id': 31, 'prompt': 'How to improve your memory?' },
        { 'id': 32, 'prompt': 'Strategies for weight loss success.' },
        { 'id': 33, 'prompt': 'Tips for learning photography basics.' },
        { 'id': 34, 'prompt': 'How to handle difficult conversations?' },
        { 'id': 35, 'prompt': 'Ways to create a balanced diet plan.' },
        { 'id': 36, 'prompt': 'Tips for enhancing team collaboration.' },
        { 'id': 37, 'prompt': 'How to practice gratitude daily?' },
        { 'id': 38, 'prompt': 'Strategies for building strong relationships.' },
        { 'id': 39, 'prompt': 'Tips for learning to play an instrument.' },
        { 'id': 40, 'prompt': 'How to stay informed on current events?' },
        { 'id': 41, 'prompt': 'Ways to develop better writing skills.' },
        { 'id': 42, 'prompt': 'Tips for maintaining mental health.' },
        { 'id': 43, 'prompt': 'How to start a fitness routine?' },
        { 'id': 44, 'prompt': 'Strategies for effective goal setting.' },
        { 'id': 45, 'prompt': 'Tips for sustainable living.' },
        { 'id': 46, 'prompt': 'How to become a better leader?' },
        { 'id': 47, 'prompt': 'Ways to boost emotional intelligence.' },
        { 'id': 48, 'prompt': 'Tips for learning web development.' },
        { 'id': 49, 'prompt': 'How to create a minimalist lifestyle?' },
        { 'id': 50, 'prompt': 'Strategies for reducing screen time.' }
    ];
    const sendMessage = async () => {
        if (!API_KEY) {
            console.error('API key is missing');
            return;
        }
        setMessage('');
        const messagesToSend = [
            ...trainingPrompt,
            ...allMessages,
            { "role": "user", "parts": [{ "text": message }] }
        ];
        
        setAllMessages(prevMessages => [...prevMessages, { "role": "user", "parts": [{ "text": message }] }]);
        setIsSent(false);
        
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "contents": messagesToSend })
            });

            if (!res.ok) throw new Error('Network response was not ok');
            const resJson = await res.json();
            const responseMessage = resJson.candidates[0].content.parts[0].text;

            adjustTextareaHeight();
            setMessage('');
            setIsTyping(true);
            simulateTyping(marked(responseMessage));
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSent(true);
        }
    };

    const simulateTyping = (responseMessage) => {
        let index = -1;
        setTypingMessage('');
        const typingInterval = setInterval(() => {
            if (index < responseMessage.length) {
                setTypingMessage(prev => prev + responseMessage[index]);
                index++;
            } else {
                clearInterval(typingInterval);
                setIsTyping(false);
                setAllMessages(prevMessages => [...prevMessages, { "role": "model", "parts": [{ "text": responseMessage }] }]);
            }
        }, 10);
    };


    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    const handleInputChange = (e) => {
        setMessage(e.target.value);
        adjustTextareaHeight();
    };

    const handleKeyDown = (e) => {
        if (message.trim() && e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    useEffect(() => {
        const shuffledPrompts = recommendedPrompts.sort(() => 0.5 - Math.random());
        setRandomItems(shuffledPrompts.slice(0, 3));
    }, []);

    const setRecommended = (prompt) => {
        setMessage(prompt);
    }

    return (
        <div className="chatbot-container">
            <div className="chat-header">
                <span>ChatBot.AI</span>
            </div>

            <div className="chat-body" >
                <div className='message_body'>
                    {allMessages.length > 0 ? (
                        allMessages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.role}`}>
                                <div className={`message-content ${msg.role}`}>
                                    {msg.role === 'model' && (
                                        <div className='model-profile'>
                                            <img src='/icon.png' className='model-img' alt='icon' />
                                            <span>Chatbot</span>
                                        </div>
                                    )}
                                    <div className={`response-message ${msg.role}`} dangerouslySetInnerHTML={{ __html: msg.parts[0].text }}></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="suggestions">
                            <h1>How can I help you today?</h1>
                            <div className="suggestions_container">
                                {randomItems.map((prompt, index) => (
                                    <div
                                        key={index}
                                        className="suggestion-card"
                                        onClick={() => setRecommended(prompt.prompt)}
                                    >
                                        <p>{prompt.prompt}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {isTyping && (
                        <div className="chat-message model">
                            <div className="message-content model">
                                <div className='model-profile'>
                                    <img src='/icon.png' className='model-img' alt='icon' />
                                    <span>Chatbot</span>
                                </div>
                                <div className='response-message' dangerouslySetInnerHTML={{ __html: typingMessage }}></div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="input-container">
                    <div className='ctr'>
                        <textarea
                            ref={textareaRef}
                            placeholder="Message ChatBot"
                            value={message}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            style={{
                                width: '100%',
                                minHeight: '10px',
                                maxHeight: '300px',
                                resize: 'none',
                                overflow: 'hidden',
                                boxSizing: 'border-box',
                            }}
                        />
                        {isSent ? (
                            <button
                                className="send-button"
                                onClick={sendMessage}
                                disabled={!message.trim()}
                                style={{
                                    backgroundColor: message.trim() && !isTyping ? 'white' : 'grey',
                                }}
                            >
                                <HiArrowUp style={{ color: message.trim() && !isTyping ? 'black' : '#2F2F2F' }} />
                            </button>
                        ) : (
                            <HashLoader color="#36d7b7" size={30} />
                        )}
                    </div>
                    <span style={{ color: 'white', fontSize: '11px' }}>Chatbot can make mistakes. Check important info.</span>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
