import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

const PersonalInfo = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const token = localStorage.getItem("token");

    //벡엔드에서 사용자 정보 가져오기
    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("저장된 토큰:", token);

        if (!token) {
            console.error("토큰이 없습니다.");
            navigate("/login")
            return;
        }

        axios.get("http://localhost:8080/api/user/info",{
            headers: {Authorization: `Bearer ${token}`},
            withCredentials : true
        }) //
            .then(response => {
                console.log("서버 응답 데이터:", response.data);
                setUserInfo(response.data);
            })
            .catch(error => {
               console.error("사용자 정보를 불러오는중 오류 발생:", error);
                if (error.response && error.response.status === 403) {
                    alert("세션이 만료되었거나 인증이 필요합니다.");
                    navigate("/login");
                }
            });
    }, [token, navigate]);

    const handleChatScreenClick = () => {
        navigate("/MemberChatScreen");
    };

    const handleDocumentRequestClick = () => {
        navigate("/DocumentRequest");
    };

    const handlePasswordChange = () => {
        alert("비밀번호 변경 페이지로 이동합니다.");
        // navigate("/password-change");
    };

    const handleLogout = () => {
        alert("로그아웃 되었습니다.");
        navigate("/login");
    };

    const handleAccountDeletion = () => {
        const confirmDelete = window.confirm("정말 회원 탈퇴를 진행하시겠습니까?");
        if (confirmDelete) {
            alert("회원 탈퇴가 완료되었습니다.");
            navigate("/signup");
        }
    };
    if (!userInfo) {
        return <p style={{ color: "#fff", textAlign: "center" }}>사용자 정보를 불러 오는중...</p>
    }

    const styles = {
        container: {
            display: "flex",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #111111 0%, #1c1c1c 100%)",
            color: "#fff",
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
        content: {
            flex: 1,
            marginLeft: isSidebarOpen ? "250px" : "0",
            marginTop: "60px",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transition: "margin-left 0.3s ease",
        },
        title: {
            fontSize: "28px",
            color: "#ffd700",
            marginBottom: "30px",
            fontWeight: "bold",
        },
        infoBox: {
            width: "100%",
            maxWidth: "600px",
            background: "rgba(28, 28, 28, 0.6)",
            backdropFilter: "blur(10px)",
            borderRadius: "15px",
            padding: "30px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        },
        infoItem: {
            display: "flex",
            alignItems: "center",
            padding: "15px",
            borderBottom: "1px solid rgba(255, 215, 0, 0.1)",
            "&:last-child": {
                borderBottom: "none",
            },
        },
        label: {
            width: "120px",
            color: "#ffd700",
            fontWeight: "500",
        },
        value: {
            flex: 1,
            color: "#fff",
        },
        changeButton: {
            marginLeft: "10px",
            padding: "8px 15px",
            background: "linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)",
            color: "#111111",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            transition: "all 0.3s ease",
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(255, 215, 0, 0.2)",
            },
        },
        actions: {
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "30px",
        },
        actionButton: {
            padding: "12px 25px",
            background: "linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)",
            color: "#111111",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            transition: "all 0.3s ease",
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 15px rgba(255, 215, 0, 0.2)",
            },
        },
        deleteButton: {
            padding: "12px 25px",
            background: "rgba(220, 53, 69, 0.9)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            transition: "all 0.3s ease",
            "&:hover": {
                background: "#dc3545",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 15px rgba(220, 53, 69, 0.3)",
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
                        {isSidebarOpen ? "←" : "☰"}
                    </button>
                    <img src="/lexi_logo.png" alt="Lexi.AI Logo" style={styles.logo} onClick={handleChatScreenClick} />
                    <h1 style={styles.brandName} onClick={handleChatScreenClick}>LEXI.AI</h1>
                </div>
            </div>
            <div style={styles.sidebar}>
                <button style={styles.sidebarButton} onClick={handleChatScreenClick}>채팅 상담</button>
                <button style={styles.sidebarButton} onClick={handleDocumentRequestClick}>문서 생성</button>
                <button style={styles.sidebarButton}>채팅 서랍</button>
                <button style={styles.sidebarButton}>기존 대화</button>
            </div>
            <div style={styles.content}>
                <h2 style={styles.title}>MY INFO</h2>
                <div style={styles.infoBox}>
                    <div style={styles.infoItem}>
                        <span style={styles.label}>ID:</span>
                        <span style={styles.value}>{userInfo.id}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.label}>Email:</span>
                        <span style={styles.value}>{userInfo.email}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.label}>Password:</span>
                        <span style={styles.value}>{userInfo.password}</span>
                        <button onClick={handlePasswordChange} style={styles.changeButton}>
                            비밀번호 변경
                        </button>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.label}>이름:</span>
                        <span style={styles.value}>{userInfo.name}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.label}>핸드폰 번호:</span>
                        <span style={styles.value}>userInfo.phone</span>
                    </div>
                    <div style={styles.actions}>
                        <button onClick={handleLogout} style={styles.actionButton}>
                            로그아웃
                        </button>
                        <button onClick={handleAccountDeletion} style={styles.deleteButton}>
                            회원 탈퇴
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfo;
