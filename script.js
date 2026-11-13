
const btn = document.getElementById("btn");
const message = document.getElementById("message");

btn.addEventListener("click", () => {
  message.textContent = "สวัสดีครับ! เว็บของคุณทำงานแล้ว 🎉";
});


const form = document.getElementById("contactForm");
const result = document.getElementById("formResult");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // กันไม่ให้หน้ารีเฟรช

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("msg").value.trim();

  if (!name || !email || !msg) {
    result.textContent = "กรุณากรอกข้อมูลให้ครบ";
    result.style.color = "red";
    return;
  }

  result.textContent = `ขอบคุณคุณ ${name} ข้อความถูกส่งแล้ว`;
  result.style.color = "green";
  form.reset();
});



const themeBtn = document.getElementById("themeBtn");

// โหลดค่าที่เคยเลือกไว้
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});