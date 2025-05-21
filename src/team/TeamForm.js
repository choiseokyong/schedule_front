import React, { useState, useEffect } from "react";
import styles from "../css/ScheduleForm.module.css";
import { LocalHostInfoContext } from "../context/LocalHostInfoContext";

const TeamModal = ({ isOpen, onClose, onSave, onId }) => {
  
  const [data, setData] = useState({
    id: 0,
    ownerId: 0,
    title: "",
    regDt: "",
    updateDt: ""
  });
  
  useEffect(() => {
    if(onId){
      fetch(
        `${LocalHostInfoContext.teamPath}/api/modifyTeam/${onId}`
      ) // 일정 불러오는 백엔드 API 주소
      .then((res) => res.json())
      .then((info) => {
        // console.log(info);  // 실제 반환 값 확인
        setData(info); // 예: [{title, startDate, endDate, color}]
      })
      .catch((err) => {
        console.error("일정 불러오기 실패:", err);
      });
    }
  },[onId]);

  const handleSubmit = () => {
    const newEvent = data;
    console.log(newEvent);
    let path = "";
    if(onId == ""){
      path = "save";
    }else{
      path = "modify";
    }
    console.log(path);
    fetch(`${LocalHostInfoContext.teamPath}/api/${path}`, {
      method: "POST",
      // credentials: "include", // 쿠키를 포함하도록 설정
      headers: {
        "Content-Type": "application/json", // JSON 타입 명시
      },
      body: JSON.stringify(newEvent), // 데이터를 JSON 문자열로 변환
    })
      .then((response) => {
        // 응답(Response 객체)을 처리하는 부분
        if (!response.ok) {
          throw new Error("서버 오류");
        }
        return response.json(); // JSON으로 변환 (또는 text(), blob(), etc.)
      })
      .then((data) => {
        // 위에서 response.json()이 완료된 후 실제 데이터를 다룸
        window.location.reload();
        console.log("서버 응답:", data);
        alert("성공적으로 전송되었습니다.");
      })
      .catch((error) => {
        // 오류가 발생했을 때 처리
        console.error("전송 실패:", error);
        alert("데이터 전송 실패");
      });
    onSave(newEvent);
    onClose();
  };

  const changeValue = (e) => {
    const { name, type, value, checked } = e.target;
    setData({
      ...data,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <h2 className={styles.modalTitle}>팀 등록</h2>

          <label className={styles.label}>팀명</label>
          <input
            type="text"
            name="title"
            className={styles.input}
            value={data.title}
            onChange={(e) => changeValue(e)}
          />

          {/* <label className={styles.label}>등록일</label>
          <input
            type="text"
            name="regDt"
            className={styles.input}
            value={data.regDt}
            readOnly="true"
          />
          <label className={styles.label}>수정일</label>
          <input
            type="text"
            name="updateDt"
            className={styles.input}
            value={data.updateDt}
            readOnly="true"
          /> */}

          <div className={styles.buttonGroup}>
            <button onClick={onClose} className={styles.cancelButton}>
              취소
            </button>
            <button type="submit" className={styles.saveButton}>
              저장
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default TeamModal;
