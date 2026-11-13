
const DAILY_GOAL = 10; // เป้าหมายต่อวัน (ปรับได้)

const p = getProgress();
const today = dateKey(new Date());
const todayCount = p.days[today] || 0;

// ถ้าวันนี้ยังไม่ได้ฝึก และเมื่อวานก็ไม่ได้ฝึก แปลว่า streak ขาดแล้ว
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const streakAlive = p.lastDay === today || p.lastDay === dateKey(yesterday);

document.getElementById("streak").textContent = streakAlive ? p.streak : 0;
document.getElementById("todayCount").textContent = todayCount;

const score = JSON.parse(localStorage.getItem("score")) || { speak: 0, quiz: 0 };
document.getElementById("totalScore").textContent = score.speak + score.quiz;

const percent = Math.min(100, (todayCount / DAILY_GOAL) * 100);
document.getElementById("goalFill").style.width = percent + "%";
document.getElementById("goalText").textContent =
  todayCount >= DAILY_GOAL
    ? "ครบเป้าหมายวันนี้แล้ว เก่งมาก! 🎉"
    : `เป้าหมายวันนี้: ${todayCount} / ${DAILY_GOAL} ครั้ง`;

// ปุ่มสลับโหมดมืด
document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});