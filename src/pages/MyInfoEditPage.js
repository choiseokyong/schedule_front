import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../css/editPage.css";

function MyInfoEditPage() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profile, setProfile] = useState("");
  const [pw, setPw] = useState("");

  const [profileImg, setProfileImg] = useState("/img/profile.svg");
  const [profileFile, setProfileFile] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:8080/member/${user.id}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setName(data.name || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setProfile(data.profile || "");
        })
        .catch((err) => {
          alert("회원 정보를 불러오는 데 실패했습니다.");
        });
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      setProfileImg(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("pw", pw);
      formData.append("existingProfile", profile);
      if (profileFile) {
        formData.append("profile", profileFile);
      }

      const res = await fetch("http://localhost:8080/member/modify", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("회원정보 수정 실패");

      alert("회원정보 수정 성공!");
      setUser({ ...user, name });
      navigate("/mypage");

    } catch (error) {
      alert("회원정보 수정 실패: " + error.message);
    }
  };

  return (
    <div className="login-wrapper mypage-edit-wrapper">
      <div className="wrapper">
        <div className="container">
          <div className="sign-up-container">
            <form onSubmit={handleUpdate}>
              <h1>회원정보 수정</h1>

              <div className="social-links">
                <div><a href="#"><i className="fa fa-facebook" /></a></div>
                <div><a href="#"><i className="fa fa-twitter" /></a></div>
                <div><a href="#"><i className="fa fa-linkedin" /></a></div>
              </div>

              <div className="mypage-profile-wrapper">
                <div className="mypage-image-circle">
                  <img
                    src={
                      profileFile
                        ? profileImg
                        : profile
                          ? `http://localhost:8080${profile}`
                          : "/img/profile.svg"
                    }
                    alt="프로필 이미지"
                    className="mypage-image profile"
                  />
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginTop: "10px", fontSize: "12px" }}
              />

              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                disabled
              />

              <input
                type="text"
                placeholder="Phone"
                value={phone}
                disabled
              />

              <input
                type="password"
                placeholder="Password"
                value={pw}
                required
                onChange={(e) => setPw(e.target.value)}
              />

              <button type="submit" className="form_btn">Edit My info</button>
              <br></br>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyInfoEditPage;
