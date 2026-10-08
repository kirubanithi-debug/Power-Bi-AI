import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Bot, User, Send, Sparkles, AlertCircle, Loader2, Database, ShieldCheck, HelpCircle } from 'lucide-react';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      answer: "Hello! I am your AI Business Analytics Assistant. You can ask me natural language questions about your revenue, sales trends, top products, or regional performance.",
      insights: [
        "Ask: 'What is our total sales?'",
        "Ask: 'Which region has the highest profit?'",
        "Ask: 'Show the top 5 products by profit.'",
        "Ask: 'Why did profit decrease last month?'"
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "What is our total sales?",
    "Which region has the highest profit?",
    "Show the top 5 products by profit.",
    "Why did profit decrease last month?",
    "Compare this month with last month."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (questionText) => {
    const query = questionText || input;
    if (!query.trim() || loading) return;

    const userMessage = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!questionText) setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/ai/ask/',
        { question: query },
        { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
      );

      const aiResponse = {
        sender: 'ai',
        answer: response.data.answer,
        insights: response.data.insights || [],
        data: response.data.data || null,
        sql_query: response.data.sql_query || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error("AI Ask error:", err);
      const errorResponse = {
        sender: 'ai',
        answer: "I apologize, but I encountered an error connecting to the Django AI Orchestrator.",
        insights: ["Ensure Django server is running and AI endpoint is active."],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col h-[calc(100vh-5rem)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              AI Business Analytics Assistant
            </h1>
            <p className="text-xs text-slate-400">Natural Language Intelligence + Text-to-SQL + Power BI Insights</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Read-Only SQL Validation Active
          </span>
        </div>
      </div>

      {/* Suggested Question Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-500 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Suggested:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition shrink-0 whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat History Box */}
      <div className="flex-1 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-tr from-indigo-600 to-purple-600'
                  : 'bg-gradient-to-tr from-blue-600 to-indigo-600'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Message Content */}
            <div className={`max-w-2xl space-y-3 ${msg.sender === 'user' ? 'items-end text-right' : ''}`}>
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-950/90 text-slate-200 border border-slate-800 rounded-tl-none'
                }`}
              >
                {msg.text || msg.answer}
              </div>

              {/* Insights List if provided */}
              {msg.insights && msg.insights.length > 0 && (
                <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2 text-xs">
                  <div className="font-semibold text-blue-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Key Business Insights:
                  </div>
                  <ul className="space-y-1 text-slate-300 pl-2">
                    {msg.insights.map((insight, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Verified SQL Query Badge */}
              {msg.sql_query && (
                <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-lg text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span className="text-slate-500">Executed SQL:</span>
                  <span className="text-emerald-400 font-semibold">{msg.sql_query}</span>
                </div>
              )}

              <span className="text-[10px] text-slate-500 block px-1">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <div className="w-9 h-9 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-2xl flex items-center space-x-2">
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              <span>Analyzing business data & executing read-only query...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask a business question... (e.g. 'Why did profit decrease last month?')"
            className="w-full pl-4 pr-14 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition shadow-lg"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-500 hover:to-indigo-500 transition disabled:opacity-40 shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIAssistant;
