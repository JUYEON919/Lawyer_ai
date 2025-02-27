import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useCallback } from "react";
import axios from "axios";

const MemberChatScreen = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [showKeywords, setShowKeywords] = useState(true);
    const [loading, setLoading] = useState(false);// ✅ `loading` 상태 추가
    const [showChatDrawer, setShowChatDrawer] = useState(false);    // 채팅 목록 사이드바 표시 여부
    const [savedChats, setSavedChats] = useState([]);               // 저장된 채팅 목록
    const [currentChatId, setCurrentChatId] = useState(null);       // 현재 채팅 ID 관리
    const userId = localStorage.getItem("user_id");                 // 사용자 ID를 로컬 스토리지에서 가져오기
    const navigate = useNavigate();// 페이지 이동을 위한 네비게이터

    //키워드 함수
    const recommendedKeywords = [
        "전세사기를 당했어요.",
        "지인이 돈을 안갚아요.",
        "건물에서 넘어졌어요.",
        "교통사고를 당했어요.",
    ];

    //저장된 채팅목록 불러오기
    const fetchSavedChats = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/chats/chats/${userId}`);
            setSavedChats(response.data);
        } catch (error) {
            console.error("채팅 목록 불러오기 실패:", error);
        }
    }, [userId]);  // ✅ useCallback 사용

    // 특정 채팅 불러오기 (채팅방을 선택하면 해당 대화 내용을 가져옴)
    const loadChat = async (chatId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/chats/chat/${chatId}`);
            setMessages(response.data);
            setCurrentChatId(chatId);
        } catch (error) {
            console.error("채팅 불러오기 실패:", error);
        }
    };

    const startNewChat = async (firstMessage = "새로운 채팅") => {
        if (!userId) {
            console.error("❌ 사용자 ID 없음!");
            alert("로그인이 필요합니다.");
            return null;
        }

        try {
            console.log("새 채팅 요청 데이터:", {user_id: userId, title: firstMessage});

            const response = await axios.post("http://localhost:8080/api/chats/chat", {
                user_id: userId,
                title: firstMessage,  // title 추가
            });

            console.log("✅ 새 채팅 생성 성공:", response.data);
            //응답에 맟춰 chatId를 읽어 옵니다.
            const newChatId = response.data.chatId;
            // 현재 채팅방 변경 -> 즉시 이동
            setCurrentChatId(newChatId);
            // 채팅 메시지 목록도 초기화
            setMessages([]);
            //fetchSavedChats();  // 채팅 목록 새로고침

            // 새 채팅 생성 후 채팅 목록 새로 고침
            await fetchSavedChats(); // 최신 목록 불러오기
            // 채팅 목록 갱신을 위해 상태에 추가
            setSavedChats((prevChats) => [
                ...prevChats,
                {chat_id: newChatId, title: firstMessage, messages: []}
            ]);


            return newChatId;
        } catch (error) {
            console.error("❌ 새 채팅 생성 실패:", error.response?.data || error.message);
            alert(`채팅 생성 실패: ${JSON.stringify(error.response?.data)}`);
            return null;
        }
    };

    //  메시지를 DB에 저장 (useCallback 활용)
    const saveMessageToDB = useCallback(async (text, sender, chatId) => {
        const chat_id = chatId || currentChatId;
        if (!chat_id) {
            console.log("채팅방 ID가 아직 없어요. 기다려주세요.");
            return;
        }

        try {
            console.log("메시지 저장 요청:", {chat_id, sender, text});

            const response = await axios.post("http://localhost:8080/api/chats/message", {
                chat_id,
                sender,
                text,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('메시지 저장 성공:', response.data);
        } catch (error) {
            console.error("메시지 저장 실패:", error.response?.data || error.message);
        }
    }, [currentChatId]);

    // 메시지 전송 함수
    const handleSendMessage = async (text = "") => {
        text = text.trim();
        if (!text) return;

        console.log("📩 사용자가 입력한 메시지:", text);

        let chatId = currentChatId;

        // 채팅방이 없으면 새로 생성 후, loadChat 호출하여 채팅 내용을 불러옴
        if (!chatId) {
            chatId = await startNewChat(text);
            if (!chatId) {
                console.error("채팅방 생성 실패");
                return;
            }
            // 새 채팅 생성 후 바로 채팅 내용을 불러옵니다.
            await loadChat(chatId)
        }

        // 사용자 메시지 저장 및 표시
        await saveMessageToDB(text, "user", chatId);
        setMessages((prev) => [...prev, { sender: "user", text }]);
        setShowKeywords(false);
        setInput("");

        setLoading(true); // 로딩 시작

        // 로딩 메시지 추가
        setMessages((prev) => [...prev, { sender: "ai", text: "답변을 생성중입니다..." }]);

        // AI 응답 가져오기
        const aiResponse = await fetchLLMResponse(text);
        console.log("🤖 AI 응답:", aiResponse);

        // 로딩 메시지 제거
        setMessages((prev) => prev.filter(msg => msg.text !== "답변을 생성중입니다..."));

        // AI 응답 저장 및 표시
        await saveMessageToDB(aiResponse, "ai", chatId);
        const safeResponse = typeof aiResponse === 'string' ? aiResponse : '';
        const responseChunks = safeResponse ? safeResponse.split("\n\n") : ["응답이 없습니다."];

        responseChunks.forEach((chunk, index) => {
            setTimeout(() => {
                setMessages((prev) => [...prev, { sender: "ai", text: chunk }]);
            }, index * 500);
        });

        setLoading(false); // 로딩 종료
    };

    // 키워드 클릭 시 채팅 시작 및 메시지 전송
    const handleKeywordClick = async (keyword) => {
        console.log("키워드 클릭:", keyword);

        let chatId = currentChatId;
        if (!chatId) {
            chatId = await startNewChat();
            if (!chatId) {
                console.error("채팅방 생성 실패");
                return;
            }
        }

        await handleSendMessage(keyword);
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {sender: "ai", text: `AI 답변: "${keyword}"에 대한 답변입니다.`},
            ]);
        }, 1000);
    };


    const fetchLLMResponse = async (text) => {
        try {
            setLoading(true); //로딩 시작
            const response = await fetch("https://port-0-lawyer-ai-m2eej1jqd8b44d66.sel4.cloudtype.app/ask", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({question: text})
            });

            if (!response.ok) {
                throw new Error(`API 요청 실패 (HTTP ${response.status})`);
            }
            const data = await response.json();
            console.log("🔍 LLM 응답 데이터:", data);  // ✅ 응답 데이터 콘솔 출력

            if (!data || typeof data.answer !== "string") {
                console.error("⚠️ 잘못된 응답 형식:", data);
                return "서버 응답 오류";
            }

            await new Promise(resolve => setTimeout(resolve, 1500)); //⚠️ 3초후 에러 메시지 반환

            return data.answer;

        } catch (error) {
            console.error("❌ 오류 발생:", error);
            return "오류 발생";
        } finally {
            setLoading(false); //로딩 종료
        }
    };
    const handleDocumentRequestClick = () => {
        navigate("/DocumentRequest")
    };
    const handleProfileClick = () => {
        navigate("/PersonalInfo");
    };
    const handleLogoClick = () => {
        navigate("/MemberChatScreen");
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
    const styles = {
        container: {
            display: "flex",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #111111 0%, #1c1c1c 100%)",
            color: "#fff",
            fontFamily: "Arial, sans-serif",
        },
        header: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
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
        toggleButton: {
            backgroundColor: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "24px",
            cursor: "pointer",
            padding: "5px 10px",
            marginRight: "15px",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            "&:hover": {
                color: "#ffc107",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
        },
        sidebar: {
            position: "fixed",
            top: "60px",
            left: 0,
            width: "250px",
            height: "calc(100vh - 60px)",
            background: "rgba(28, 28, 28, 0.7)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            padding: "80px 20px 30px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            overflowY: "auto",
            transition: "all 0.3s ease",
            transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
            visibility: isSidebarOpen ? "visible" : "hidden",
            opacity: isSidebarOpen ? 1 : 0,
        },
        sidebarButton: {
            padding: "12px 15px",
            background: "rgba(40, 40, 40, 0.8)",
            backdropFilter: "blur(5px)",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
            color: "#fff",
            transition: "all 0.3s ease",
            whiteSpace: "nowrap",
            "&:hover": {
                background: "linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)",
                transform: "translateY(-2px)",
                color: "#111111",
            },
        },
        mainContent: {
            flex: 1,
            marginLeft: isSidebarOpen ? "250px" : "0",
            marginTop: "60px",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            minHeight: "calc(100vh - 60px)",
            backgroundColor: "#1c1c1c",
            transition: "margin-left 0.3s ease",
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
        userSection: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px",
            color: "#e0e0e0",
        },
        userIcon: {
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            objectFit: "cover",
            cursor: "pointer",
            transition: "transform 0.2s ease",
            "&:hover": {
                transform: "scale(1.1)",
            },
        },
        chatWindow: {
            flex: 1,
            background: "rgba(28, 28, 28, 0.6)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            padding: "25px",
            marginBottom: "20px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            overflowY: "auto",  // 스크롤 추가
            maxHeight: "calc(100vh - 260px)",  // 채팅창 최대 높이 설정
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
            backgroundColor: "#ffc107",
            color: "#1c1c1c",
        },
        aiMessage: {
            alignSelf: "flex-start",
            backgroundColor: "#424242",
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
            "&:hover": {
                transform: "translateY(-2px)",
                backgroundColor: "#ffcd38",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            },
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
            transition: "all 0.2s ease",
            "&:focus": {
                borderColor: "#ffc107",
                outline: "none",
                boxShadow: "0 0 0 2px rgba(255,193,7,0.2)",
            },
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
            transition: "all 0.2s ease",
            "&:hover": {
                backgroundColor: "#ffcd38",
                transform: "translateY(-2px)",
            },
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
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <button
                        style={styles.toggleButton}
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? "☰" : "☰"}
                    </button>
                    <img src="/lexi_logo.png" alt="Lexi.AI Logo" style={styles.logo} onClick={handleLogoClick}/>
                    <h1 style={styles.brandName} onClick={handleLogoClick}>LEXI.AI</h1>
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
            <div style={styles.sidebar}>
                <button style={styles.sidebarButton} onClick={handleDocumentRequestClick}>문서 생성</button>
                <button style={styles.sidebarButton} onClick={() => setShowChatDrawer(!showChatDrawer)}>
                    채팅 서랍
                </button>
                {showChatDrawer && (
                    <div className={styles.chatDrawer}>
                        <div className={styles.savedChatsList}>
                            {savedChats.length > 0 ? (
                                savedChats.map((chat) => (
                                    <div key={chat.id} onClick={() => loadChat(chat.id)} className={styles.savedChatItem}>
                                        <strong>{chat.title}</strong>
                                        <span>{chat.created_at}</span>
                                    </div>
                                ))
                            ) : (
                                <p style={styles.sidebarButton}>저장된 대화가 없습니다.</p>
                            )}
                        </div>
                        <button style={styles.sidebarButton} onClick={() => startNewChat("")}>새 대화</button>
                    </div>
                )}
                <button style={styles.sidebarButton}>기존 대화</button>
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
                                    <ClipLoader color="#ffd700" size={15} speedMultiplier={0.7} />
                                </div>
                            ) : (
                                <div
                                    style={styles.messageContent}
                                    dangerouslySetInnerHTML={{
                                        __html: formatResponse(msg.text)
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

export default MemberChatScreen;