import React, { useContext, useState, useRef, useEffect } from "react"; // useRef, useEffect 추가
import Header from "../pages/Header";
import "../css/style.css";
import "../css/common.css";
import "../css/profile_home.css";
import "../css/Schedule.css";
import ScheduleForm from "../schedule/ScheduleForm";
import TeamForm from "../team/TeamForm";
import { LocalHostInfoContext } from "../context/LocalHostInfoContext";
import NotificationList from '../schedule/NotificationList';

function HomePage() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectValue, setSelectValue] = useState('개인'); // 일정 선택(개인,팀)

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0); // 이전 달의 마지막날
  const startDay = firstDay.getDay(); // getDay - 요일
  const totalDays = lastDay.getDate(); // 마지막 일 - 31
  const prevLastDay = new Date(year, month, 0).getDate();

  const daysArray = [];

  for (let i = startDay - 1; i >= 0; i--) {
    daysArray.push({ day: prevLastDay - i, currentMonth: false });
  }

  for (let i = 1; i <= totalDays; i++) {
    daysArray.push({ day: i, currentMonth: true });
  }

  let nextDay = 1;
  while (daysArray.length % 7 !== 0) {
    daysArray.push({ day: nextDay++, currentMonth: false });
  }

  const firstDayStr = firstDay.toISOString().split("T")[0]; // "2025-05-01"
  const lastDayStr = lastDay.toISOString().split("T")[0];

  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    // today 데이터 가져와서 반복문 하기.
    addNotification("✅ 페이지가 로드되었습니다");
    fetch(
      `${LocalHostInfoContext.schedulePath}/api/scheduleList?firstday=${firstDayStr}&lastday=${lastDayStr}`
    ) // 일정 불러오는 백엔드 API 주소
      .then((res) => res.json())
      .then((data) => {
        setSchedules(data); // 예: [{title, startDate, endDate, color}]
      })
      .catch((err) => {
        console.error("일정 불러오기 실패:", err);
      });
  }, []);

  //일정 등록
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [no, setNo] = useState(null);

  const handleSave = (event) => {
    setEvents([...events, event]);
    console.log("일정 등록됨:", event);
  };

  // 알림
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(), // 고유 ID
      message,
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };
  // 알림
  
  return (
    <>
      <NotificationList
        notifications={notifications}
        onClose={removeNotification}
      />

      <Header
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        today={today}
        onSelect={setSelectValue}
      />

      <div id="container">
        <div className="wrap">
          <table>
            <thead>
              <tr>
                <th>일</th>
                <th>월</th>
                <th>화</th>
                <th>수</th>
                <th>목</th>
                <th>금</th>
                <th>토</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: daysArray.length / 7 }).map(
                (_, weekIndex) => (
                  <tr key={weekIndex}>
                    {daysArray
                      .slice(weekIndex * 7, weekIndex * 7 + 7)
                      .map((date, idx) => {
                        const isToday =
                          date.currentMonth &&
                          year === today.getFullYear() &&
                          month === today.getMonth() &&
                          date.day === today.getDate();

                        let nowDate = null;
                        if (date.currentMonth) {
                          const paddedMonth = String(month + 1).padStart(
                            2,
                            "0"
                          );
                          const paddedDay = String(date.day).padStart(2, "0");
                          nowDate = year + "-" + paddedMonth + "-" + paddedDay;
                        }

                        return (
                          <td
                            key={idx}
                            className={`${
                              !date.currentMonth ? "disabled" : ""
                            } ${isToday ? "today" : ""}`}
                          >
                            <i className="day-number">{date.day}</i>
                            <div className="schedules">
                              {schedules.map((schedule, index) =>{
                                  const day = new Date(nowDate).getDay();
                                  if(schedule.category != selectValue){
                                    return;
                                  }
                                   if (
                                  schedule.repeat == "주중" &&
                                  day >= 1 &&
                                  day <= 5 &&
                                  nowDate >= schedule.startDate
                                ) {
                                  return (
                                    <div
                                      key={index}
                                      className="schedule-item"
                                      onClick={() => {
                                        setIsModalOpen(true);
                                        setNo(schedule.no);
                                      }}
                                    >
                                      <div
                                        className="schedule-bar"
                                        style={{
                                          backgroundColor: schedule.color,
                                        }}
                                      >
                                        {schedule.title}
                                      </div>
                                    </div>
                                  );
                                } else if (
                                  schedule.repeat == "매일" &&
                                  nowDate >= schedule.startDate
                                ) {
                                  return (
                                    <div
                                      key={index}
                                      className="schedule-item"
                                      onClick={() => {
                                        setIsModalOpen(true);
                                        setNo(schedule.no);
                                      }}
                                    >
                                      <div
                                        className="schedule-bar"
                                        style={{
                                          backgroundColor: schedule.color,
                                        }}
                                      >
                                        {schedule.title}
                                      </div>
                                    </div>
                                  );
                                } else if (nowDate >= schedule.startDate && nowDate <= schedule.endDate){
                                  return(
                                    <div key={index} className="schedule-item" onClick={() => {
                                      setIsModalOpen(true);
                                      setNo(schedule.no);
                                      }}>
                                      {/* <div className="schedule-title">
                                        {nowDate == schedule.startDate ? schedule.title : ""}
                                      </div>
                                      <div className="schedule-time">
                                        {schedule.startDate} ~ {schedule.endDate}
                                      </div> */}
                                      <div
                                        className="schedule-bar"
                                        style={{
                                          backgroundColor: schedule.color,
                                        }}
                                      >
                                        {nowDate == schedule.startDate
                                          ? schedule.title
                                          : ""}
                                      </div>
                                    </div>
                                  );
                                }
                              })}
                            </div>
                          </td>
                        );
                      })}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* 일정 등록 폼 */}
      <ScheduleForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onNo={no}
      />
    </>
  );
}

export default HomePage;
