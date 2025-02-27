import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            await fetch("http://localhost:8080/api/recovery/reset-password", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ password }),
            });

            alert("비밀번호가 변경 되었습니다!");
            navigate("/login");
        } catch(error) {
            setError("비밀번호 변경 실패");
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>비밀번호 변경</h1>
            <hr style={styles.separator} />
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleReset} style={styles.form}>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="새로운 비밀번호"
                    required
                    style={styles.input}
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호 확인"
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>비밀번호 변경 확인</button>
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
        border: "2px solid purple",
        padding: "20px",
    },
    title: {
        fontSize: "24px",
        marginBottom: "10px",
    },
    separator: {
        width: "80%",
        borderTop: "1px solid white",
        marginBottom: "20px",
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
        width: "250px",
        height: "35px",
        fontSize: "16px",
        textAlign: "left",
        paddingLeft: "10px",
        border: "2px solid purple",
        borderRadius: "5px",
        marginBottom: "10px",
        outline: "none",
    },
    button: {
        width: "250px",
        height: "40px",
        fontSize: "16px",
        backgroundColor: "yellow",
        color: "black",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
    },
}

export default ResetPassword;