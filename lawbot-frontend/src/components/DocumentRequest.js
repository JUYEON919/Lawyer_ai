import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const DocumentRequest = () => {
    const [from, setFrom] = useState(""); // 갑
    const [to, setTo] = useState(""); // 을
    const [date, setDate] = useState(""); // 날짜
    const [documentType, setDocumentType] = useState(""); // 문서 타입
    const [additionalInfo, setAdditionalInfo] = useState(""); // 추가 내용
    const [resultLink, setResultLink] = useState(""); // 동적으로 결과 링크 설정
    const [loading, setLoading] = useState(false);
    const [isDocumentGenerated, setIsDocumentGenerated] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate("/MemberChatScreen");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResultLink("");
        setIsDocumentGenerated(false);

        const requestData = {
            contract_type: documentType,
            party_a: from,
            party_b: to,
            contract_date: date,
            additional_info: additionalInfo,
        };

        try {
            const response = await fetch("https://port-0-lawyer-ai-m2eej1jqd8b44d66.sel4.cloudtype.app/generate-document", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
                mode: "cors",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("문서 생성 응답:", data);

            if (data.download_link) {
                setResultLink(data.download_link);
                setIsDocumentGenerated(true);
            }

        } catch (error) {
            console.error("문서 생성 요청 오류:", error);
        } finally {
            setLoading(false);
        }
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
            padding: "15px 20px",
            background: "rgba(18, 18, 18, 0.95)",
            backdropFilter: "blur(10px)",
            textAlign: "left",
            zIndex: 10,
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
            display: "flex",
            alignItems: "center",
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
            backgroundColor: "#333",
            padding: "80px 20px 30px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            overflowY: "auto",
            transition: "all 0.3s ease",
            transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
            visibility: isSidebarOpen ? "visible" : "hidden",
            opacity: isSidebarOpen ? 1 : 0,
            background: "rgba(28, 28, 28, 0.7)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        },
        sidebarButton: {
            padding: "12px 15px",
            backgroundColor: "#424242",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
            color: "#fff",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
            background: "rgba(40, 40, 40, 0.8)",
            backdropFilter: "blur(5px)",
            "&:hover": {
                backgroundColor: "#ffc107",
                transform: "translateY(-2px)",
                color: "#111111",
            },
        },
        content: {
            flex: 1,
            marginLeft: isSidebarOpen ? "250px" : "0",
            marginTop: "60px",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "calc(100vh - 60px)",
            backgroundColor: "#1c1c1c",
            transition: "margin-left 0.3s ease",
        },
        title: {
            marginBottom: "30px",
            fontSize: "32px",
            color: "#ffc107",
            fontWeight: "600",
        },
        form: {
            width: "100%",
            maxWidth: "800px",
            background: "rgba(28, 28, 28, 0.6)",
            backdropFilter: "blur(10px)",
            padding: "35px",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            marginBottom: "40px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
        },
        fieldRow: {
            display: "flex",
            gap: "20px",
            width: "100%",
            flexWrap: "wrap",
        },
        field: {
            flex: "1 1 calc(50% - 10px)",
            minWidth: "250px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
        },
        fullWidthField: {
            width: "100%",
            maxWidth: "800px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            alignSelf: "flex-start",
        },
        label: {
            fontSize: "15px",
            color: "#e0e0e0",
            fontWeight: "500",
        },
        input: {
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            border: "1px solid rgba(255, 215, 0, 0.3)",
            fontSize: "15px",
            background: "rgba(35, 35, 35, 0.7)",
            backdropFilter: "blur(5px)",
            color: "#fff",
            transition: "all 0.3s ease",
            boxSizing: "border-box",
            "&:focus": {
                borderColor: "#ffd700",
                boxShadow: "0 0 0 2px rgba(255, 215, 0, 0.2)",
                background: "rgba(40, 40, 40, 0.9)",
            },
        },
        select: {
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            border: "1px solid #424242",
            fontSize: "15px",
            backgroundColor: "#333",
            color: "#fff",
            cursor: "pointer",
            boxSizing: "border-box",
            "&:focus": {
                borderColor: "#ffc107",
                outline: "none",
            },
        },
        textarea: {
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            border: "1px solid #424242",
            fontSize: "15px",
            backgroundColor: "#333",
            color: "#fff",
            resize: "vertical",
            minHeight: "150px",
            maxHeight: "300px",
            boxSizing: "border-box",
            "&:focus": {
                borderColor: "#ffc107",
                outline: "none",
            },
        },
        submitButton: {
            padding: "16px",
            color: "#1c1c1c",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            width: "100%",
            fontWeight: "600",
            marginTop: "20px",
            transition: "all 0.3s ease",
            background: "linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)",
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 15px rgba(255, 215, 0, 0.2)",
            },
        },
        result: {
            marginTop: "25px",
            width: "100%",
            backgroundColor: "#333",
            padding: "20px",
            borderRadius: "8px",
        },
        resultLabel: {
            display: "block",
            marginBottom: "12px",
            fontSize: "15px",
            color: "#e0e0e0",
            fontWeight: "500",
        },
        resultContent: {
            display: "flex",
            alignItems: "center",
            gap: "15px",
            width: "100%",
        },
        link: {
            color: "#ffc107",
            textDecoration: "none",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "14px",
            padding: "8px 12px",
            backgroundColor: "#424242",
            borderRadius: "6px",
            "&:hover": {
                backgroundColor: "#505050",
            },
        },
        downloadButton: {
            padding: "10px 20px",
            backgroundColor: "#ffc107",
            color: "#1c1c1c",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            flexShrink: 0,
            transition: "all 0.2s ease",
            "&:hover": {
                backgroundColor: "#ffcd38",
                transform: "translateY(-2px)",
            },
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button
                    style={styles.toggleButton}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? "←" : "☰"}
                </button>
                <h1
                    onClick={handleLogoClick}
                    style={{
                        cursor: 'pointer',
                        margin: 0,
                        userSelect: 'none'
                    }}
                >
                    LEXI.AI
                </h1>
            </div>
            <div style={styles.sidebar}>
                <button style={styles.sidebarButton}>문서 생성</button>
                <button style={styles.sidebarButton}>채팅 서랍</button>
            </div>
            <div style={styles.content}>
                <h2 style={styles.title}>문서 생성</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.fieldRow}>
                        <div style={styles.field}>
                            <label style={styles.label}>갑</label>
                            <input
                                type="text"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>을</label>
                            <input
                                type="text"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                style={styles.input}
                            />
                        </div>
                    </div>

                    <div style={styles.fieldRow}>
                        <div style={styles.field}>
                            <label style={styles.label}>날짜</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>문서 타입</label>
                            <select
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                                style={styles.select}
                            >
                                <option value="">문서 타입을 선택하세요</option>
                                <option value="계약서">계약서</option>
                                <option value="합의서">합의서</option>
                                <option value="진술서">진술서</option>
                            </select>
                        </div>
                    </div>

                    <div style={styles.fullWidthField}>
                        <label style={styles.label}>추가 내용</label>
                        <textarea
                            value={additionalInfo}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                            style={styles.textarea}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            ...styles.submitButton,
                            backgroundColor: loading ? "#666" : isDocumentGenerated ? "#28a745" : "#ffd700",
                            cursor: loading ? "not-allowed" : "pointer"
                        }}
                        disabled={loading}
                    >
                        {loading ? (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                문서 생성 중
                                <ClipLoader
                                    color="#111111"
                                    size={15}
                                    speedMultiplier={0.7}
                                />
                            </div>
                        ) : isDocumentGenerated ? "문서 생성 완료" : "문서 생성 요청"}
                    </button>

                    {resultLink && (
                        <div style={styles.result}>
                            <label style={styles.resultLabel}>다운로드 링크:</label>
                            <div style={styles.resultContent}>
                                <a href={resultLink} target="_blank" rel="noopener noreferrer" style={styles.link}>
                                    {resultLink}
                                </a>
                                <button
                                    type="button"
                                    onClick={() => window.open(resultLink, "_blank")}
                                    style={styles.downloadButton}
                                >
                                    다운로드
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default DocumentRequest;
