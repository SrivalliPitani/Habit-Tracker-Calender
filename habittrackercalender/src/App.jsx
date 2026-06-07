import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [completedDays, setCompletedDays] = useState(() => {
    return JSON.parse(localStorage.getItem("habitData")) || {};
  });

  const [notes, setNotes] = useState(() => {
    return JSON.parse(localStorage.getItem("habitNotes")) || {};
  });

  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    localStorage.setItem("habitData", JSON.stringify(completedDays));
  }, [completedDays]);

  useEffect(() => {
    localStorage.setItem("habitNotes", JSON.stringify(notes));
  }, [notes]);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const monthName = today.toLocaleString("default", {
    month: "long",
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDay = new Date(year, month, 1).getDay();

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const todayDate = new Date().toISOString().split("T")[0];

  const toggleHabit = (date) => {
    setCompletedDays((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));

    setSelectedDate(date);
  };

  const resetTracker = () => {
    localStorage.removeItem("habitData");
    localStorage.removeItem("habitNotes");

    setCompletedDays({});
    setNotes({});
    setSelectedDate("");
  };

  const completed = Object.keys(completedDays).filter(
    (date) => completedDays[date]
  ).length;

  const progress =
    daysInMonth > 0
      ? Math.round((completed / daysInMonth) * 100)
      : 0;

  const emptyCells = [];

  for (let i = 0; i < firstDay; i++) {
    emptyCells.push(
      <div key={`empty-${i}`} className="empty"></div>
    );
  }

  const dayCells = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${year}-${String(month + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    dayCells.push(
      <div
        key={dateString}
        className={`day ${
          completedDays[dateString] ? "completed" : ""
        } ${dateString === todayDate ? "today" : ""}`}
        onClick={() => toggleHabit(dateString)}
      >
        {day}
      </div>
    );
  }

  return (
    <div className="app">
      <h1>🌸 Habit Tracker Calendar</h1>

      <h2>
        {monthName} {year}
      </h2>

      <div className="stats">
        <p>✅ Completed: {completed}</p>
        <p>📊 Progress: {progress}%</p>
      </div>

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="calendar">
        {weekDays.map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}

        {emptyCells}
        {dayCells}
      </div>

      {selectedDate && (
        <div className="notes-card">
          <h3>📝 Notes for {selectedDate}</h3>

          <textarea
            rows="5"
            placeholder="Write your notes here..."
            value={notes[selectedDate] || ""}
            onChange={(e) =>
              setNotes({
                ...notes,
                [selectedDate]: e.target.value,
              })
            }
          />
        </div>
      )}

      <button
        className="reset-btn"
        onClick={resetTracker}
      >
        Reset Tracker
      </button>
    </div>
  );
}

export default App;