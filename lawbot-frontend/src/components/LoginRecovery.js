import React, { useState } from "react";
import {useNavigate} from "react-router-dom";

const LoginRecovery = () => {
    const [mode, setMode] = useState("ID"); // "ID" 또는 "PW" 모드
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const handleLogoClick = () => {
        navigate("/")
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email) {
            alert("이름과 이메일을 입력하세요.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/recovery/send",{
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({email}),
            });

            const data = await response.json();
            alert(data.message);
            navigate("/loginrecovery/verify");
        } catch (error) {
            alert("이메일 전송에 실패 했습니다.");
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header} onClick={handleLogoClick}>
                <h1>Lawyer.ai</h1>
            </header>

            <div style={styles.content}>
                <h2>아이디 / 비밀번호 찾기</h2>

                {/* 모드 전환 버튼 */}
                <div style={styles.modeSwitch}>
                    <button
                        onClick={() => setMode("ID")}
                        style={{
                            ...styles.switchButton,
                            backgroundColor: mode === "ID" ? "#ffc107" : "#555",
                        }}
                    >
                        아이디 찾기
                    </button>
                    <button
                        onClick={() => setMode("PW")}
                        style={{
                            ...styles.switchButton,
                            backgroundColor: mode === "PW" ? "#ffc107" : "#555",
                        }}
                    >
                        비밀번호 찾기
                    </button>
                </div>

                {/* 입력 폼 */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>
                        이름:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="이름을 입력하세요"
                            style={styles.input}
                        />
                    </label>

                    <label style={styles.label}>
                        이메일:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일을 입력하세요"
                            style={styles.input}
                        />
                    </label>

                    <button type="submit" style={styles.submitButton}>
                        send Email
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#1c1c1c",
        color: "#fff",
    },
    header: {
        marginBottom: "20px",
    },
    content: {
        width: "300px",
        textAlign: "center",
    },
    modeSwitch: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "20px",
    },
    switchButton: {
        flex: 1,
        padding: "10px",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
        margin: "0 5px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        marginBottom: "10px",
        textAlign: "left",
    },
    input: {
        width: "100%",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        fontSize: "16px",
        marginTop: "5px",
    },
    submitButton: {
        padding: "10px",
        backgroundColor: "#ffc107",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
        marginTop: "20px",
    },
};

export default LoginRecovery;
