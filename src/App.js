import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import FindPage from "./pages/FindPage";
import HomePage from "./pages/HomePage";
import MyPage from "./pages/MyPage";
import MyInfoEditPage from "./pages/MyInfoEditPage";
import MyScheduleList from "./pages/MyScheduleList";
import ChatBot from "./pages/ChatBot";

import { AuthContext } from "./context/AuthContext";

const PrivateRoute = ({ user, children }) => {
  const location = useLocation();

  if (!user) {
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" replace />;
  }

  return children;
};

// 🔥 ChatBot 예외 처리용
const ChatBotWrapper = () => {
  const location = useLocation();
  const excludedPaths = ["/login", "/find"]; // 제외할 경로

  if (excludedPaths.includes(location.pathname)) {
    return null;
  }

  return <ChatBot />;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/member/cookiechk", {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          setUser(null);
          return null;
        }
        return await res.json();
      })
      .then((res) => {
        if (res?.email) {
          setUser({ email: res.email, id: res.id, name: res.name });
          console.log("✅ 로그인된 유저:", res.email);
        } else {
          console.log("❌ 로그인된 유저 없음.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ 세션 체크 실패:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/find" element={<FindPage />} />
          <Route path="/" element={<PrivateRoute user={user}><HomePage /></PrivateRoute>} />
          <Route path="/mypage" element={<PrivateRoute user={user}><MyPage /></PrivateRoute>} />
          <Route path="/mypage/edit" element={<PrivateRoute user={user}><MyInfoEditPage /></PrivateRoute>} />
          <Route path="/myschedule/mylist" element={<PrivateRoute user={user}><MyScheduleList /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>

        {/* ✅ 로그인·찾기 페이지 제외하고 항상 챗봇 표시 */}
        <ChatBotWrapper />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
