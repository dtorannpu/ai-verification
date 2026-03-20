import { useState, useRef, useEffect } from "react";

type Role = "user" | "ai";

interface Message {
  id: number;
  role: Role;
  text: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "ai",
    text: "こんにちは！何かお手伝いできることはありますか？",
  },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text }]);
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "40px";
    el.style.height = `${el.scrollHeight}px`;
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.headerTitle}>AI Chat</span>
      </div>

      {/* Messages */}
      <div style={styles.messageList}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.messageRow,
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                ...styles.bubble,
                ...(msg.role === "user" ? styles.userBubble : styles.aiBubble),
              }}
            >
              <p style={styles.bubbleText}>{msg.text}</p>
              <p
                style={{
                  ...styles.bubbleLabel,
                  color:
                    msg.role === "user" ? "rgba(255,255,255,0.7)" : "#9ca3af",
                  textAlign: "right",
                }}
              >
                {msg.role === "user" ? "You" : "AI"}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={styles.inputArea}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="メッセージを入力... (Shift+Enterで改行)"
          style={styles.textarea}
        />
        <button onClick={sendMessage} style={styles.sendButton}>
          送信
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0,
    overflow: "hidden",
    maxWidth: "720px",
    margin: "0 auto",
    backgroundColor: "#f9fafb",
  },
  header: {
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#111827",
  },
  messageList: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  messageRow: {
    display: "flex",
  },
  bubble: {
    maxWidth: "70%",
    padding: "10px 14px",
    lineHeight: 1.5,
  },
  userBubble: {
    backgroundColor: "#378ADD",
    borderRadius: "16px 4px 16px 16px",
  },
  aiBubble: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "4px 16px 16px 16px",
  },
  bubbleText: {
    fontSize: "14px",
    margin: 0,
    color: "inherit",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  bubbleLabel: {
    fontSize: "11px",
    margin: "4px 0 0",
  },
  inputArea: {
    display: "flex",
    gap: "8px",
    padding: "12px 16px",
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  textarea: {
    flex: 1,
    resize: "none",
    fontSize: "14px",
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    backgroundColor: "#f9fafb",
    color: "#111827",
    lineHeight: 1.5,
    outline: "none",
    fontFamily: "inherit",
    height: "160px",
    minHeight: "160px",
    maxHeight: "160px",
    overflowY: "auto",
    boxSizing: "border-box",
  },
  sendButton: {
    padding: "10px 18px",
    borderRadius: "12px",
    backgroundColor: "#378ADD",
    border: "none",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    height: "40px",
    whiteSpace: "nowrap",
  },
};
