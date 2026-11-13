

// ---------- โหมดมืด: ใช้ค่าเดียวกับที่เคยเลือกไว้ ----------
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// ---------- ความก้าวหน้ารายวัน ----------
function dateKey(date) {
  // รูปแบบ 2026-11-13 ตามเวลาในเครื่อง
  return date.toLocaleDateString("sv-SE");
}

function getProgress() {
  return JSON.parse(localStorage.getItem("progress")) || {
    days: {},
    streak: 0,
    lastDay: ""
  };
}

// เรียกทุกครั้งที่ผู้เรียนทำแบบฝึกหัดสำเร็จ 1 ครั้ง
function markPracticed() {
  const p = getProgress();
  const today = dateKey(new Date());

  p.days[today] = (p.days[today] || 0) + 1;

  if (p.lastDay !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    // ถ้าเมื่อวานฝึกด้วย streak เพิ่ม ถ้าขาดไปให้เริ่มนับ 1 ใหม่
    p.streak = p.lastDay === dateKey(yesterday) ? p.streak + 1 : 1;
    p.lastDay = today;
  }

  localStorage.setItem("progress", JSON.stringify(p));
}


// ---------- เมนูกลาง (ใช้ร่วมกันทุกหน้า) ----------
const SITE_NAME = "🗣️ SpeakUp"; // เปลี่ยนชื่อเว็บตรงนี้

const pages = [
  { href: "index.html", label: "หน้าแรก" },
  { href: "english.html", label: "คำศัพท์" },
  { href: "dialogue.html", label: "บทสนทนา" }
];

function renderNav() {
  const nav = document.getElementById("mainNav");
  if (!nav) return;

  // หน้าปัจจุบัน (ถ้า path ว่างหรือลงท้ายด้วย / ให้ถือเป็น index.html)
  const current = location.pathname.split("/").pop() || "index.html";

  const links = pages
    .map((p) => {
      const active = p.href === current ? "active" : "";
      return `<a href="${p.href}" class="${active}">${p.label}</a>`;
    })
    .join("");

  nav.innerHTML = `
    <a href="index.html" class="brand">${SITE_NAME}</a>
    ${links}
    <button id="themeBtn" class="theme-btn" aria-label="สลับโหมดมืด">🌙</button>
  `;

  document.getElementById("themeBtn").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

renderNav();