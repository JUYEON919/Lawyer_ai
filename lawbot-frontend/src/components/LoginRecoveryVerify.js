import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginRecoveryVerify = () => {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState(null);  // ✅ 추가: 에러 메시지를 저장
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        setError(null);  // ✅ 이전 에러 메시지 초기화

        try {
            const response = await fetch("http://localhost:8080/api/recovery/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                // ✅ 서버 응답이 실패한 경우
                const errorData = await response.json();
                throw new Error(errorData.message || "코드 인증 실패!");
            }

            const data = await response.json();
            alert(data.message); // ✅ 성공 메시지 표시
            navigate("/reset-password"); // ✅ 코드 인증 성공 후 이동

        } catch (error) {
            setError(error.message);  // ✅ 에러 메시지를 UI에 표시
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>코드 입력</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleVerify} style={styles.form}>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="복구 코드 입력"
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>인증</button>
            </form>
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
        backgroundColor: "black",
        color: "white",
    },
    title: {
        fontSize: "24px",
        marginBottom: "10px",
    },
    error: {
        color: "red",
        marginBottom: "10px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    input: {
        width: "200px",
        height: "40px",
        fontSize: "16px",
        textAlign: "center",
        border: "2px solid purple",
        borderRadius: "5px",
        marginBottom: "10px",
        outline: "none",
    },
    button: {
        width: "200px",
        height: "40px",
        fontSize: "16px",
        backgroundColor: "yellow",
        color: "black",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default LoginRecoveryVerify;

