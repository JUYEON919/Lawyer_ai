import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        name: "",
        birthDate: "",
        email: "",
        phoneNumber: "",
        agreement: false,
    });

    const [privacyText, setPrivacyText] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/Infoprivacy.txt")
            .then(response => response.text())
            .then(text => setPrivacyText(text))
            .catch(error => console.error("개인정보 보호 정책 로드 실패:", error));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleAgreementClick = () => {
        setShowPopup(true);
    };

    const handlePopupClose = () => {
        setShowPopup(false);
        setFormData({ ...formData, agreement: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.agreement) {
            alert("약관에 동의해주세요.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/Signup", formData);
            alert("회원가입 성공: " + response.data.message);
            navigate("/login");
        } catch (error) {
            if (error.response) {
                alert("회원가입 실패: " + error.response.data.message);
            } else {
                alert("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
            }
            console.error("회원가입 에러:", error);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>회원가입</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.label}>아이디:
                    <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="아이디를 입력하세요" style={styles.input} />
                </label>
                <label style={styles.label}>비밀번호:
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호를 입력하세요" style={styles.input} />
                </label>
                <label style={styles.label}>비밀번호 확인:
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="비밀번호를 다시 입력하세요" style={styles.input} />
                </label>
                <label style={styles.label}>이름:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="이름을 입력하세요" style={styles.input} />
                </label>
                <label style={styles.label}>Email:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="이메일을 입력하세요" style={styles.input} />
                </label>
                <div style={styles.label}>
                    <span>이용약관 동의:</span>
                    <button type="button" onClick={handleAgreementClick} style={styles.agreementButton}>약관 보기</button>
                    <input type="checkbox" name="agreement" checked={formData.agreement} onChange={handleChange} disabled style={styles.checkbox} />
                </div>
                <button type="submit" style={styles.submitButton}>가입하기</button>
            </form>

            {showPopup && (
                <div style={styles.popupContainer}>
                    <div style={styles.popup}>
                        <div style={styles.popupContent}>{privacyText}</div>
                        <button onClick={handlePopupClose} style={styles.closeButton}>동의합니다</button>
                    </div>
                </div>
            )}
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
    title: {
        fontSize: "42px",
        fontWeight: "bold",
        color: "#ffd700",
        marginBottom: "30px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "360px",
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
        display: "block",
    },
    input: {
        width: "calc(100% - 30px)",
        padding: "12px 15px",
        marginBottom: "20px",
        border: "1px solid rgba(255, 215, 0, 0.3)",
        borderRadius: "8px",
        background: "rgba(35, 35, 35, 0.7)",
        backdropFilter: "blur(5px)",
        color: "#fff",
        fontSize: "15px",
        transition: "all 0.3s ease",
        "&:focus": {
            borderColor: "#ffd700",
            boxShadow: "0 0 0 2px rgba(255, 215, 0, 0.2)",
            background: "rgba(40, 40, 40, 0.9)",
        },
    },
    checkbox: {
        marginLeft: "10px",
        cursor: "pointer",
    },
    agreementButton: {
        padding: "8px 15px",
        background: "linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)",
        color: "#111111",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        marginLeft: "10px",
        transition: "all 0.3s ease",
        "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 8px rgba(255, 215, 0, 0.2)",
        },
    },
    submitButton: {
        padding: "12px",
        background: "linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)",
        color: "#111111",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "18px",
        fontWeight: "bold",
        marginTop: "20px",
        transition: "all 0.3s ease",
        "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 15px rgba(255, 215, 0, 0.2)",
        },
    },
    popupContainer: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(5px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    popup: {
        width: "90%",
        maxWidth: "450px",
        background: "rgba(28, 28, 28, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "25px",
        borderRadius: "15px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        color: "#fff",
    },
    popupContent: {
        maxHeight: "400px",
        overflowY: "auto",
        marginBottom: "20px",
        padding: "15px",
        background: "rgba(40, 40, 40, 0.5)",
        borderRadius: "8px",
        fontSize: "14px",
        lineHeight: "1.6",
    },
    closeButton: {
        width: "100%",
        padding: "12px",
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
            boxShadow: "0 4px 8px rgba(255, 215, 0, 0.2)",
        },
    },
};

export default Signup;
