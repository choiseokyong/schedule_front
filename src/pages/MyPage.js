import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Link 추가
import "../css/profile.css";
import "../css/style.css";

import Header from "../pages/Header";

function MyPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const today = new Date();

  useEffect(() => {
    fetch("http://localhost:8080/member/mypage", {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
          sessionStorage.setItem("redirectAfterLogin", "/mypage");
          window.location.href = "/login";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUserInfo(data);
        }
      })
      .catch((err) => {
        alert("사용자 정보를 가져오는 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (!userInfo) return null;

  return (
    <>
      <Header currentDate={today} setCurrentDate={() => {}} today={today} />

      <div className="mypage-container">
        <h1 className="mypage-title">마이페이지</h1>

        <div className="mypage-profile-wrapper">
          <div className="mypage-image-circle">
            <img
              src={
                userInfo.profile
                  ? `http://localhost:8080${userInfo.profile}`
                  : "/img/profile.svg"
              }
              alt="프로필 이미지"
              className="mypage-image profile"
            />
          </div>
        </div>

        <div className="mypage-info">
          <span className="mypage-label">이메일</span> {userInfo.email}
        </div>

        <div className="mypage-info">
          <span className="mypage-label">이름</span> {userInfo.name}
        </div>

        <div className="mypage-info">
          <span className="mypage-label">가입일</span>{" "}
          {userInfo.created_at.slice(0, 10)}
        </div>

        {userInfo.updated_at && (
          <div className="mypage-info">
            <span className="mypage-label">수정일</span>{" "}
            {userInfo.updated_at.slice(0, 10)}
          </div>
        )}

        <div className="mypage-util">
          <Link to="/myschedule/mylist" className="btn-basic color" data-util="schedule">
            내 일정 리스트
          </Link>
          <button
            className="btn-basic"
            onClick={() => navigate("/mypage/edit")}
            data-util="setting"
          >
            정보 수정
          </button>
        </div>
      </div>
    </>
  );
}

export default MyPage;
