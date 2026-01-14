import { useState, useRef, useEffect, type FormEvent, type ChangeEvent, type KeyboardEvent } from 'react'
import { X, Send, Sparkles, Trash2, ShieldAlert } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import './KnowledgeChat.css'

interface KnowledgeChatProps {
    isOpen: boolean
    onToggle: () => void
    articleContent?: string
    articleId?: string
}

interface Message {
    id: number | string
    role: 'user' | 'ai'
    content: string
    timestamp: string
    isError?: boolean
}

export default function KnowledgeChat({ isOpen, onToggle, articleContent, articleId }: KnowledgeChatProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [hasConsented, setHasConsented] = useState(() => {
        return localStorage.getItem('ai_chat_consent') === 'true'
    })
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    // Generate or retrieve session ID
    const [sessionId] = useState(() => {
        if (articleId) {
            const savedSession = localStorage.getItem(`chat_session_${articleId}`)
            if (savedSession) return savedSession

            const newSession = `session_${articleId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            localStorage.setItem(`chat_session_${articleId}`, newSession)
            return newSession
        }
        return `session_${Date.now()}`
    })

    // Load history from local storage on mount
    useEffect(() => {
        if (articleId) {
            const saved = localStorage.getItem(`chat_history_${articleId}`)
            if (saved) {
                try {
                    setMessages(JSON.parse(saved))
                } catch (e) {
                    console.error('Failed to parse chat history', e)
                }
            } else {
                setMessages([{
                    id: 'init',
                    role: 'ai',
                    content: "Hello! I am your AI assistant for this article. I have access to the full content and context of this page. Feel free to ask me for summaries, clarifications, or specific details about the topic.",
                    timestamp: new Date().toISOString()
                }])
            }
        }
    }, [articleId])

    // Save history to local storage
    useEffect(() => {
        if (articleId && messages.length > 0) {
            localStorage.setItem(`chat_history_${articleId}`, JSON.stringify(messages))
        }
    }, [messages, articleId])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isOpen])

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault()
        if (!inputValue.trim() || isLoading) return

        const userMsg: Message = {
            id: Date.now(),
            role: 'user',
            content: inputValue,
            timestamp: new Date().toISOString()
        }

        setMessages(prev => [...prev, userMsg])
        setInputValue('')
        setIsLoading(true)

        if (inputRef.current) {
            inputRef.current.style.height = 'auto'
        }

        try {
            // Prepare payload for n8n with Session ID
            const payload = {
                message: userMsg.content,
                sessionId: sessionId,
                article_content: articleContent,
                article_id: articleId
            }

            const webhookUrl = import.meta.env.VITE_N8N_CHAT_WEBHOOK

            if (!webhookUrl) {
                throw new Error('Webhook URL not configured')
            }

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!response.ok) throw new Error('Network response was not ok')

            const data = await response.json()

            // Expecting data.output or data.text or similar from n8n
            const aiResponseText = data.output || data.text || data.answer || "I received your message but got no text response from the workflow."

            const aiMsg: Message = {
                id: Date.now() + 1,
                role: 'ai',
                content: aiResponseText,
                timestamp: new Date().toISOString()
            }

            setMessages(prev => [...prev, aiMsg])

        } catch (error) {
            console.error('Chat Error:', error)
            const errorMsg: Message = {
                id: Date.now() + 1,
                role: 'ai',
                content: "Sorry, I couldn't connect to the AI service right now. Please try again later.",
                timestamp: new Date().toISOString(),
                isError: true
            }
            setMessages(prev => [...prev, errorMsg])
        } finally {
            setIsLoading(false)
        }
    }

    const clearHistory = () => {
        if (window.confirm('Clear chat history?')) {
            const initMsg: Message = {
                id: Date.now(),
                role: 'ai',
                content: 'History cleared. What would you like to know?',
                timestamp: new Date().toISOString()
            }
            setMessages([initMsg])
            localStorage.removeItem(`chat_history_${articleId}`)
        }
    }

    const handleInputResize = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target
        target.style.height = 'auto'
        target.style.height = `${Math.min(target.scrollHeight, 100)}px`
        setInputValue(target.value)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage(e as unknown as FormEvent)
        }
    }

    const handleConsent = () => {
        localStorage.setItem('ai_chat_consent', 'true')
        setHasConsented(true)
    }

    if (!isOpen) {
        return (
            <div className="knowledge-chat-container collapsed">
                <button className="chat-trigger-btn" onClick={onToggle}>
                    <Sparkles size={16} />
                    <span>Discuss with AI</span>
                </button>
            </div>
        )
    }

    // Show consent screen if user hasn't accepted yet
    if (!hasConsented) {
        return (
            <div className="knowledge-chat-container expanded">
                <div className="chat-header">
                    <div className="chat-title">
                        <ShieldAlert size={14} />
                        <span>HINWEIS</span>
                    </div>
                    <button className="chat-close-btn" onClick={onToggle}>
                        <X size={16} />
                    </button>
                </div>
                <div className="chat-consent">
                    <div className="consent-icon">
                        <ShieldAlert size={32} />
                    </div>
                    <h3>Bevor Sie fortfahren</h3>
                    <div className="consent-content">
                        <p>
                            Dieser KI-Assistent nutzt die <strong>Google Gemini API</strong> zur Verarbeitung
                            Ihrer Anfragen. Ihre Eingaben werden an Google-Server übermittelt.
                        </p>
                        <p>
                            <strong>Datenschutz-Hinweis:</strong> Bitte geben Sie keine personenbezogenen
                            Daten Dritter ein, es sei denn, Sie haben deren ausdrückliche Einwilligung.
                        </p>
                        <p>
                            <strong>Wichtig:</strong> KI-Modelle wie Gemini 3.0 können Fehler machen.
                            Überprüfen Sie wichtige Informationen stets unabhängig.
                        </p>
                    </div>
                    <button className="consent-btn" onClick={handleConsent}>
                        Verstanden & Fortfahren
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="knowledge-chat-container expanded">
            {/* Header */}
            <div className="chat-header">
                <div className="chat-title">
                    <Sparkles size={14} />
                    <span>AI ASSISTANT</span>
                </div>
                <div className="chat-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        className="chat-close-btn"
                        onClick={clearHistory}
                        title="Clear History"
                    >
                        <Trash2 size={14} />
                    </button>
                    <button className="chat-close-btn" onClick={onToggle}>
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.role} ${msg.isError ? 'error' : ''}`}>
                        {msg.role === 'ai' ? (
                            <div className="markdown-content">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        ) : (
                            msg.content
                        )}
                        <span className="message-time">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
                {isLoading && (
                    <div className="message ai loading">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input-area">
                <form className="chat-input-wrapper" onSubmit={handleSendMessage}>
                    <textarea
                        ref={inputRef}
                        className="chat-input"
                        placeholder="Ask a question..."
                        value={inputValue}
                        onChange={handleInputResize}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="send-btn"
                        disabled={!inputValue.trim() || isLoading}
                    >
                        <Send size={14} />
                    </button>
                </form>
            </div>
        </div>
    )
}
