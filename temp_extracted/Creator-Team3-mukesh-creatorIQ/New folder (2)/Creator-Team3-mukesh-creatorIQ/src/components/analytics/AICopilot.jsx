import React, { useState, useEffect, useRef } from "react";

export default function AICopilot({ token }) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! 🤖 I am your **CreatorIQ Copilot Agent**.\n\nI can analyze your channel performance, provide optimized content upload suggestions, generate trending hashtags, or answer any stats queries.\n\nWhat would you like to build or analyze today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestionChips = [
    { label: "📈 Analyze my stats", query: "Analyze my channel growth and performance stats" },
    { label: "💡 Upload suggestions", query: "Give me some upload suggestions and video ideas" },
    { label: "🏷️ Trending hashtags", query: "What trending hashtags should I use?" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend.trim();
    if (!query) return;

    // Append User message
    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: query }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Failed to fetch response from AI");
      }

      // Append AI Response
      setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `⚠️ **Error connecting to Copilot**: ${err.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Simple Markdown parsing helper for rich responses
  const renderMarkdown = (text) => {
    return text.split("\n").map((line, idx) => {
      // Bold text formatting **text**
      let formattedLine = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      formattedLine = formattedLine.replace(boldRegex, "<strong>$1</strong>");

      // Code blocks formatting `code`
      const codeRegex = /`(.*?)`/g;
      formattedLine = formattedLine.replace(codeRegex, "<code>$1</code>");

      // Bullet points
      if (line.trim().startsWith("*") || line.trim().startsWith("-")) {
        const cleanContent = line.replace(/^[\s*-]+/, "");
        return (
          <li key={idx} style={{ marginLeft: "1.5rem", marginBottom: "0.4rem" }} dangerouslySetInnerHTML={{ __html: cleanContent.replace(boldRegex, "<strong>$1</strong>").replace(codeRegex, "<code>$1</code>") }} />
        );
      }

      // Headings
      if (line.trim().startsWith("###")) {
        return (
          <h3 key={idx} style={{ fontSize: "1.1rem", fontWeight: "700", margin: "1rem 0 0.5rem 0", color: "var(--accent-primary)" }} dangerouslySetInnerHTML={{ __html: formattedLine.replace("###", "") }} />
        );
      }
      if (line.trim().startsWith("####")) {
        return (
          <h4 key={idx} style={{ fontSize: "0.95rem", fontWeight: "700", margin: "0.75rem 0 0.4rem 0", color: "var(--accent-secondary)" }} dangerouslySetInnerHTML={{ __html: formattedLine.replace("####", "") }} />
        );
      }

      return (
        <p
          key={idx}
          style={{ marginBottom: "0.5rem", lineHeight: "1.5", fontSize: "0.9rem" }}
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });
  };

  return (
    <div className="ai-copilot-container">
      <style>{`
        .ai-copilot-container {
          display: flex;
          flex-direction: column;
          background: var(--bg-secondary, #111827);
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          border-radius: 20px;
          height: calc(100vh - 180px);
          min-height: 450px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          font-family: 'Inter', sans-serif;
        }

        .copilot-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 1.25rem 1.5rem;
          background: rgba(15, 23, 42, 0.4);
          border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
        }

        .copilot-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, var(--accent-primary, #3b82f6), var(--accent-secondary, #ec4899));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .copilot-info h3 {
          font-size: 0.95rem;
          font-weight: 700;
          margin: 0;
          color: var(--text-primary, #f8fafc);
        }

        .copilot-info span {
          font-size: 0.75rem;
          color: var(--text-secondary, #94a3b8);
        }

        .copilot-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .message-bubble {
          max-width: 75%;
          padding: 1rem 1.25rem;
          border-radius: 16px;
          word-wrap: break-word;
        }

        .message-bubble.ai {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          color: var(--text-primary, #f8fafc);
          align-self: flex-start;
          border-top-left-radius: 4px;
        }

        .message-bubble.user {
          background: var(--accent-primary, #3b82f6);
          color: #ffffff;
          align-self: flex-end;
          border-top-right-radius: 4px;
          box-shadow: 0 4px 12px var(--accent-glow, rgba(59, 130, 246, 0.15));
        }

        .chips-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 0.5rem 1.5rem;
          background: rgba(15, 23, 42, 0.2);
        }

        .suggestion-chip {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          color: var(--text-secondary, #94a3b8);
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .suggestion-chip:hover {
          background: var(--accent-glow, rgba(59, 130, 246, 0.15));
          color: var(--text-primary, #f8fafc);
          border-color: var(--accent-primary, #3b82f6);
        }

        .copilot-footer {
          padding: 1.25rem 1.5rem;
          background: rgba(15, 23, 42, 0.4);
          border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
        }

        .chat-form {
          display: flex;
          gap: 0.75rem;
        }

        .chat-input {
          flex: 1;
          background: var(--input-bg, rgba(30, 41, 59, 0.6));
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          border-radius: 12px;
          padding: 12px 16px;
          color: var(--text-primary, #f8fafc);
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s ease;
        }

        .chat-input:focus {
          border-color: var(--accent-primary, #3b82f6);
          box-shadow: 0 0 0 3px var(--accent-glow, rgba(59, 130, 246, 0.15));
        }

        .chat-send-btn {
          background: var(--accent-primary, #3b82f6);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          padding: 0 1.5rem;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px var(--accent-glow, rgba(59, 130, 246, 0.15));
        }

        .chat-send-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .chat-send-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Pulsating dots styling */
        .typing-dots {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 4px 8px;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          background-color: var(--text-secondary, #94a3b8);
          border-radius: 50%;
          animation: pulsate 1.4s infinite ease-in-out both;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes pulsate {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>

      {/* Header */}
      <div className="copilot-header">
        <div className="copilot-avatar">🤖</div>
        <div className="copilot-info">
          <h3>CreatorIQ AI Copilot</h3>
          <span>Online • Context-Aware Analytics Assistant</span>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="chips-container">
        {suggestionChips.map((chip, i) => (
          <button
            key={i}
            type="button"
            className="suggestion-chip"
            onClick={() => handleSendMessage(chip.query)}
            disabled={loading}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Body / Message List */}
      <div className="copilot-body">
        {messages.map((msg, i) => (
          <div key={i} className={`message-bubble ${msg.sender}`}>
            {renderMarkdown(msg.text)}
          </div>
        ))}

        {loading && (
          <div className="message-bubble ai" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div className="typing-dots">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input Form */}
      <div className="copilot-footer">
        <form
          className="chat-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
        >
          <input
            type="text"
            className="chat-input"
            placeholder="Ask about channel stats, upload recommendations, hashtags..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={loading || !input.trim()}
          >
            Ask AI
          </button>
        </form>
      </div>
    </div>
  );
}
