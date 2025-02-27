import React from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './styles/home.css';

const Home = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');  // 로그인 화면으로 이동
    };

    const handleSignupClick = () => {
        navigate('/Signup');
    }

    const handleChatScreenClick = () => {
        navigate('/ChatScreen')
    }

    return (
        <div className="home">
            {/* 헤더 */}
            <header className="header">
                <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    LEXI.AI
                </div>
                <div className="profile-icon">
                    <button className="login-btn" onClick={handleLoginClick}>
                        <FaUser className="icon" />
                    </button>
                </div>
            </header>

            {/* 메인 배너 */}
            <div className="main-banner">
                <h1 className="T1">LEXI.AI</h1>
                <h3>AI 변호사와 함께하는 쉽고 빠른 법률 상담</h3>
                <p>실시간으로 법률 상담을 받고, 법률 정보를 확인하세요.</p>
                <button onClick={handleChatScreenClick}>상담 시작하기</button>
            </div>

            {/* 섹션 버튼 */}
            <section className="feature-section">
                <div className="intro-text">
                    <p>LEXI.AI는 민법을 전문으로 하는 법률 상담 AI 시스템으로, 최신 법령 데이터를 바탕으로 법률 상담을 제공합니다.</p>
                    <p>본 AI는 LLM ExaONE 3.5 모델을 사용하며, 한국 국가 법령 정보센터에서 수집한 법률 데이터를 통해 법률적인 질문에 신속하고 정확하게 답변합니다.</p>
                    <p>법률상담 AI가 제공하는 정보는 참고용으로만 사용해야 하며, 법적 조언을 대체할 수 없습니다. 복잡한 법적 문제는 전문 변호사와 상담을 권장드립니다.</p>
                    <p>이 AI는 사용자의 법률적 궁금증을 해결하는 데 도움을 주며, 빠르고 효율적인 법률 서비스를 제공합니다.</p>
                </div>
                <div className="feature-cards">
                    <button className="card" onClick={handleLoginClick}>서비스 이용안내</button>
                    <button className="card" onClick={handleLoginClick}>법률 문서 작업</button>
                    <button className="card" onClick={handleLoginClick}>상담 기록 보기</button>
                </div>
            </section>

            {/* 푸터 */}
            <footer className="footer">
                <div className="links">
                    <a href="/service-guide"onClick={handleSignupClick}>이용 약관</a> | 개인정보 보호정책
                </div>
            </footer>
        </div>
    );
};

export default Home;