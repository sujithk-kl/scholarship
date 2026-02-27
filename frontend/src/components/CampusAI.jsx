import React, { useState, useContext, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import ReactMarkdown from 'react-markdown';

const CampusAI = () => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi, I'm CampusAI! How can I help you with your scholarship application today?", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;
        const userMsg = input;
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInput("");
        setIsTyping(true);

        try {
            const { data } = await api.post('/ai', {
                message: userMsg,
                userId: user?._id
            });
            setMessages(prev => [...prev, { text: data.reply, isBot: true }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                text: "I'm having trouble connecting right now. Please try again later.",
                isBot: true
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="bg-white rounded-lg shadow-2xl w-80 mb-4 border border-gray-200 overflow-hidden animate-fade-in-up">
                    <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-0.5 shadow-inner">
                                <img
                                    src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=100&auto=format&fit=crop"
                                    className="w-full h-full rounded-full object-cover"
                                    alt="CampusAI Avatar"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-sm tracking-tight leading-none mb-0.5">CampusAI Assistant</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">Always Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-all"><X size={20} /></button>
                    </div>
                    <div className="h-64 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`p-3 rounded-lg text-sm max-w-[85%] ${msg.isBot ? 'bg-white border self-start text-gray-800 shadow-sm' : 'bg-blue-600 text-white self-end shadow-sm'}`}>
                                {msg.isBot ? (
                                    <div className="markdown-body prose prose-sm max-w-none prose-p:leading-snug prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="whitespace-pre-wrap">{msg.text}</div>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="bg-white border self-start p-2 rounded-lg flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Analyzing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-3 bg-white border-t flex gap-2">
                        <input
                            type="text"
                            className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-50"
                            placeholder={isTyping ? "CampusAI is thinking..." : "Ask me anything..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            disabled={isTyping}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isTyping}
                            className={`p-1 rounded transition-all ${isTyping ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'}`}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${isOpen ? 'bg-gray-700' : 'bg-blue-600 animate-bounce'} text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2`}
            >
                <MessageSquare size={24} />
                {!isOpen && <span className="font-semibold pr-2">Ask CampusAI</span>}
            </button>
        </div>
    );
};

export default CampusAI;
