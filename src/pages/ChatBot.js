import React, { useState, useRef, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import "../css/ChatBot.css";
import chatIcon from "../img/chatbot.jpg";

function ChatBot() {
  const [visible, setVisible] = useState(false);

  // ✅ 최초 렌더 시 localStorage에서 복원
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatbotMessages");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // ✅ messages 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("chatbotMessages", JSON.stringify(messages));
  }, [messages]);

  // ✅ 항상 하단으로 스크롤 이동
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "당신은 일정관리 도우미 챗봇입니다. 사용자에게 친절하게 답하세요.",
            },
            ...updatedMessages,
          ],
        }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message;
      if (reply) {
        setMessages([...updatedMessages, reply]);
      } else {
        alert("❌ OpenAI 응답이 비정상입니다.");
      }
    } catch (error) {
      console.error("❌ OpenAI 호출 실패:", error);
      alert("챗봇 응답 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <img
        src={chatIcon}
        alt="챗봇 열기"
        className="chatbot-toggle-icon"
        onClick={() => setVisible((prev) => !prev)}
      />

      <CSSTransition
        in={visible}
        timeout={300}
        classNames="chatbot"
        unmountOnExit
      >
        <div className="chatbot-container">
          <div className="chatbot-header">
            챗봇
            <button className="chatbot-close" onClick={() => setVisible(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="chat-message assistant">답변 생성 중...</div>
            )}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="메시지를 입력하세요"
            />
            <button onClick={handleSend}>전송</button>
          </div>
        </div>
      </CSSTransition>
    </>
  );
}

export default ChatBot;
