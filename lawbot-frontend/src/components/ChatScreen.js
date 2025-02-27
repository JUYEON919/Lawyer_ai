import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [showKeywords, setShowKeywords] = useState(true);
    const [loading, setLoading] = useState(false); // ✅ `loading` 상태 추가
    const navigate = useNavigate();
    const recommendedKeywords = [
        "전세사기를 당했어요.",
        "지인이 돈을 안갚아요.",
        "건물에서 넘어졌어요.",
        "교통사고를 당했어요.",
    ];

    useEffect(() => {
        console.log("메시지 업데이트됨:", messages);
    }, [messages]);

    const fetchLLMResponse = async (text) => {
        try {
            setLoading(true); //로딩 시작
            const response = await fetch("https://port-0-lawyer-ai-m2eej1jqd8b44d66.sel4.cloudtype.app/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: text })
            });

            if (!response.ok) {
                throw new Error(`API 요청 실패 (HTTP ${response.status})`);
            }
            const data = await response.json();
            console.log("🔍 LLM 응답 데이터:", data);  // ✅ 응답 데이터 콘솔 출력

            console.log("🔍 API 응답 데이터:", data);

            if (!data || typeof data.answer !== "string") {
                console.error("잘못된 응답 형식:", data);
                return "서버 응답 오류";
            }

            await new Promise(resolve => setTimeout(resolve,3000)); //⚠️ 3초후 에러 메시지 반환

            return data.answer;

        } catch (error) {
            console.error("오류 발생:", error);
            return "오류 발생";
        } finally {
            setLoading(false);//로딩 종료
        }
    };

    const handleSendMessage = async (text = "") => {
        text = text.trim();
        if (!text) return;

        console.log("📩 사용자가 입력한 메시지:", text);

        // ✅ 사용자의 메시지를 채팅창에 추가
        setMessages((prev) => [...prev, { sender: "user", text }]);
        setShowKeywords(false);
        setInput("");

        setLoading(true); // 로딩 시작

        // ✅ 로딩 메시지 추가 (AI가 응답하는 동안)
        setMessages((prev) => [...prev, { sender: "ai", text: "답변을 생성중입니다..." }]);

        // ✅ AI 응답 가져오기
        const aiResponse = await fetchLLMResponse(text);
        console.log("🤖 AI 응답:", aiResponse);

        // ✅ 로딩 메시지 제거
        setMessages((prev) => prev.filter(msg => msg.text !== "답변을 생성중입니다..."));

        // ✅ AI 응답 크기 분할
        const safeResponse = typeof aiResponse === 'string' ? aiResponse : '';
        const responseChunks = safeResponse ? safeResponse.split("\n\n") : ["응답이 없습니다."];
        responseChunks.forEach((chunk, index) => {
            setTimeout(() => {
                setMessages((prev) => [...prev, { sender: "ai", text: chunk }]);
            }, index * 500);
        });

        setLoading(false); // 로딩 종료
    };


    const handleKeywordClick = async (keyword) => {
        await handleSendMessage(keyword);
    };


    const handleProfileClick = () => {
        navigate("/login");
    };
    const handleLogoClick = () => {
        navigate("/");
    };
    const formatResponse = (text) => {
        // 제목 스타일링 (예: "제목:" 으로 시작하는 줄)
        text = text.replace(
            /(^|\n)(제목|결론|요약|분석|조언|권고|해결방안):\s*([^\n]+)/g,
            '$1<h3>$2: $3</h3>'
        );

        // 중요 문구 스타일링 (따옴표로 둘러싸인 텍스트)
        text = text.replace(
            /"([^"]+)"/g,
            '<span class="quote">$1</span>'
        );

        // 법률 조항 스타일링
        text = text.replace(
            /(제\d+조|법 제\d+조)([^\n]+)/g,
            '<span class="law-reference">$1$2</span>'
        );

        // 목록 스타일링
        text = text.replace(
            /^(\d+\.|•|\-)\s+([^\n]+)/gm,
            '<li>$2</li>'
        );
        return text;
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <img src="/lexi_logo.png" alt="Lexi.AI Logo" style={styles.logo} />
                    <h1 style={styles.brandName}>LEXI.AI</h1>
                </div>
                <div style={styles.headerRight}>
                    <img
                        src="/user_img.png"
                        alt="user profile"
                        style={styles.userIcon}
                        onClick={handleProfileClick}
                    />
                </div>
            </div>
            <div style={styles.mainContent}>
                <div style={styles.chatWindow}>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                ...styles.message,
                                ...(msg.sender === "user" ? styles.userMessage : styles.aiMessage),
                            }}
                        >
                            {msg.text === "답변을 생성중입니다..." ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    {msg.text}
                                    <ClipLoader
                                        color="#ffd700"
                                        size={15}
                                        speedMultiplier={0.7}
                                    />
                                </div>
                            ) : (
                                <div
                                    style={styles.messageContent}
                                    dangerouslySetInnerHTML={{
                                        __html: msg.sender === "ai" ? formatResponse(msg.text) : msg.text
                                    }}
                                />
                            )}
                        </div>
                    ))}

                    {showKeywords && (
                        <div style={styles.keywordSection}>
                            <div style={styles.keywordTitle}>무엇을 도와드릴까요?</div>
                            <div style={styles.keywordGrid}>
                                {recommendedKeywords.map((keyword, index) => (
                                    <button
                                        key={index}
                                        style={styles.keywordButton}
                                        onClick={() => handleKeywordClick(keyword)}
                                    >
                                        {keyword}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div style={styles.inputArea}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
                        placeholder="질문을 입력하세요..."
                        style={styles.input}
                        disabled={loading}
                    />
                    <button
                        onClick={() => handleSendMessage(input)}
                        style={styles.sendButton}
                        disabled={loading}
                    >
                        {loading ? "전송 중..." : "전송"}
                    </button>
                </div>
                <div style={styles.sourceText}>
                    LEXI 법률 상담 애플리케이션은 한국국가법령정보센터의 정보를 기반으로 대답 합니다.
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #111111 0%, #1c1c1c 100%)",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
    },
    header: {
        padding: "10px 20px",
        background: "rgba(18, 18, 18, 0.95)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
    },
    headerRight: {
        display: "flex",
        alignItems: "center",
        marginRight: "30px",
    },
    logo: {
        height: "40px",
        width: "auto",
    },
    brandName: {
        color: "#ffc107",
        fontSize: "24px",
        fontWeight: "600",
        margin: 0,
    },
    userIcon: {
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        objectFit: "cover",
        cursor: "pointer",
        transition: "transform 0.2s ease",
    },
    mainContent: {
        flex: 1,
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1c1c1c",
    },
    chatWindow: {
        flex: 1,
        background: "rgba(28, 28, 28, 0.6)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        padding: "25px",
        marginBottom: "20px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        overflowY: "auto",
        maxHeight: "calc(100vh - 260px)",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    message: {
        maxWidth: "70%",
        padding: "15px",
        borderRadius: "12px",
        fontSize: "15px",
        lineHeight: "1.5",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    userMessage: {
        alignSelf: "flex-end",
        background: "linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)",
        boxShadow: "0 4px 15px rgba(255, 215, 0, 0.2)",
        color: "#1c1c1c",
    },
    aiMessage: {
        alignSelf: "flex-start",
        background: "rgba(40, 40, 40, 0.8)",
        backdropFilter: "blur(5px)",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        color: "#fff",
        '& a': {
            color: '#ffd700',
            textDecoration: 'underline',
            '&:hover': {
                color: '#ffed4a',
            },
        },
    },
    keywordSection: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        padding: "20px",
        backgroundColor: "#333",
        borderRadius: "16px",
        marginTop: "auto",
        marginBottom: "20px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    },
    keywordTitle: {
        fontSize: "18px",
        fontWeight: "600",
        color: "#ffd700",
        textAlign: "center",
        marginBottom: "10px",
    },
    keywordGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "15px",
    },
    keywordButton: {
        padding: "20px",
        backgroundColor: "#ffc107",
        color: "#1c1c1c",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        textAlign: "center",
        whiteSpace: "normal",
        lineHeight: "1.4",
    },
    inputArea: {
        display: "flex",
        gap: "15px",
        padding: "20px",
        backgroundColor: "#2a2a2a",
        borderRadius: "16px",
        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    },
    input: {
        flex: 1,
        padding: "14px",
        borderRadius: "8px",
        border: "1px solid #424242",
        backgroundColor: "#333",
        color: "#fff",
        fontSize: "15px",
    },
    sendButton: {
        padding: "14px 28px",
        backgroundColor: "#ffc107",
        color: "#1c1c1c",
        border: "none",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
    },
    sourceText: {
        textAlign: "center",
        color: "#666",
        fontSize: "14px",
        marginTop: "20px",
        padding: "10px",
        borderRadius: "8px",
        backgroundColor: "#2a2a2a",
    },
    sidebar: {
        background: "rgba(28, 28, 28, 0.7)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    },
    sidebarButton: {
        background: "rgba(40, 40, 40, 0.8)",
        backdropFilter: "blur(5px)",
        transition: "all 0.3s ease",
        "&:hover": {
            background: "linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)",
            transform: "translateY(-2px)",
            color: "#111111",
        },
    },
    messageContent: {
        '& h3': {
            color: '#ffd700',
            fontSize: '18px',
            marginBottom: '10px',
            fontWeight: 'bold',
        },
        '& .case-number': {
            color: '#64B5F6',
            padding: '10px',
            margin: '10px 0',
            background: 'rgba(100, 181, 246, 0.1)',
            borderRadius: '8px',
        },
        '& .law-title': {
            color: '#ffd700',
            padding: '10px',
            margin: '10px 0',
            background: 'rgba(255, 215, 0, 0.1)',
            borderRadius: '8px',
        },
        '& .key-point': {
            color: '#4CAF50',
            padding: '10px',
            margin: '10px 0',
            background: 'rgba(76, 175, 80, 0.1)',
            borderRadius: '8px',
        },
        '& .warning': {
            color: '#ff9800',
            padding: '10px',
            margin: '10px 0',
            background: 'rgba(255, 152, 0, 0.1)',
            borderRadius: '8px',
        },
        '& .conclusion': {
            color: '#e91e63',
            padding: '10px',
            margin: '10px 0',
            background: 'rgba(233, 30, 99, 0.1)',
            borderRadius: '8px',
        },
        '& .quote': {
            color: '#4CAF50',
            fontStyle: 'italic',
            display: 'block',
            margin: '10px 0',
            padding: '10px',
            borderLeft: '3px solid #ffd700',
            background: 'rgba(255, 215, 0, 0.1)',
        },
        '& .law-reference': {
            color: '#64B5F6',
            fontWeight: '500',
        },
        '& li': {
            marginLeft: '20px',
            marginBottom: '8px',
            listStyleType: 'none',
            position: 'relative',
            '&::before': {
                content: '"•"',
                color: '#ffd700',
                position: 'absolute',
                left: '-15px',
            },
        },
    },
};

export default ChatScreen;