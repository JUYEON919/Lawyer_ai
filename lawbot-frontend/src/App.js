import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./components/Home"
import ChatScreen from "./components/ChatScreen";
import MemberChatScreen from "./components/MemberChatScreen";
import Login from "./components/login";
import LoginRecovery from "./components/LoginRecovery";
import Signup from "./components/Signup";
import DocumentRequest from "./components/DocumentRequest";
import LoginRecoveryVerify from "./components/LoginRecoveryVerify";
import ResetPassword from "./components/ResetPassword";
import PersonalInfo from "./components/PersonalInfo";

function App() {
  return (
      <Router>
        <Routes>
            <Route path="/" element={<Home/>}/>
          <Route path="/ChatScreen" element={<ChatScreen/>}/>
          <Route path="/login" element={<Login/>}/>
            <Route path="/Signup" element={<Signup/>}/>
            <Route path="/LoginRecovery" element={<LoginRecovery/>}/>
            <Route path="/loginrecovery/verify" element={<LoginRecoveryVerify/>}/>
            <Route path="/reset-password" element={<ResetPassword/>}/>
          <Route path="/MemberChatScreen" element={<MemberChatScreen/>}/>
            <Route path="/DocumentRequest" element={<DocumentRequest/>}/>
            <Route path="/PersonalInfo" element={<PersonalInfo/>}/>
        </Routes>
      </Router>
  )
}

export default App;

