import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // PW 유효성 검사 로직
        console.log("ID:", id, "Password:", password);

        try {
            //서버 연동 로그인 처리 (API 호출)
            const response = await axios.post("http://localhost:8080/api/login", {
                username: id,
                password: password,
            });

            if (response.status === 200) {
                //응답 데이터에서 토큰 추출 후 로컬 스토리지에 저장
                const { token, user_id } = response.data
                if (token) {
                    localStorage.setItem("token", token);
                    console.log(token)
                    localStorage.setItem("user_id", user_id);
                    console.log(user_id)
                } else {
                    console.error("로그인이 성공했으나 토큰이 전달되지 않았습니다.")
                }
                alert("로그인 성공!");
                navigate("/MemberChatScreen");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("로그인 실패: ID 또는 비밀번호가 틀렸습니다.");
            } else {
                alert("로그인 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.")
            }
            console.error("로그인 에러:", error)
        }
    };

    const handleLogoClick = () => {
        navigate("/Home")
    };

    const handleSignUp = () => {
        navigate("/Signup")
    }

    const handleFindIdPw = () => {
        navigate("/LoginRecovery")
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title} onClick={handleLogoClick}>LEXI.AI</h1>
            </header>
            <form style={styles.form} onSubmit={handleLogin}>
                <label htmlFor="id" style={styles.label}>
                    ID:
                </label>
                <input
                    type="text"
                    id="id"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="아이디를 입력하세요"
                    style={styles.input}
                />

                <label htmlFor="password" style={styles.label}>
                    PW:
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    style={styles.input}
                />
                <button type="submit" style={styles.loginButton}>
                    로그인
                </button>
            </form>

            <div style={styles.options}>
                <button onClick={handleSignUp} style={styles.optionButton}>
                    회원가입
                </button>
                <button onClick={handleFindIdPw} style={styles.optionButton}>
                    ID/PW 찾기
                </button>
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
        minHeight: "100vh",
        background: "linear-gradient(135deg, #111111 0%, #1c1c1c 100%)",
        color: "#fff",
        padding: "20px",
    },
    header: {
        marginBottom: "40px",
        textAlign: "center",
    },
    title: {
        fontSize: "42px",
        fontWeight: "bold",
        color: "#ffd700",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
            transform: "scale(1.05)",
        },
    },
    form: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "400px",
        padding: "30px",
        background: "rgba(28, 28, 28, 0.6)",
        backdropFilter: "blur(10px)",
        borderRadius: "15px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    },
    label: {
        marginBottom: "8px",
        fontSize: "16px",
        fontWeight: "500",
        color: "#ffd700",
    },
    input: {
        padding: "12px 15px",
        marginBottom: "20px",
        border: "1px solid rgba(255, 215, 0, 0.3)",
        borderRadius: "8px",
        background: "rgba(35, 35, 35, 0.7)",
        backdropFilter: "blur(5px)",
        color: "#fff",
        fontSize: "16px",
        transition: "all 0.3s ease",
        "&:focus": {
            borderColor: "#ffd700",
            boxShadow: "0 0 0 2px rgba(255, 215, 0, 0.2)",
            background: "rgba(40, 40, 40, 0.9)",
        },
    },
    loginButton: {
        padding: "12px",
        background: "linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)",
        color: "#111111",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "18px",
        fontWeight: "bold",
        marginTop: "10px",
        transition: "all 0.3s ease",
        "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 15px rgba(255, 215, 0, 0.2)",
        },
    },
    options: {
        marginTop: "25px",
        display: "flex",
        gap: "20px",
        justifyContent: "center",
    },
    optionButton: {
        backgroundColor: "transparent",
        color: "#ffd700",
        border: "none",
        fontSize: "15px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
            color: "#ffed4a",
            textDecoration: "underline",
        },
    },
};

export default Login;
