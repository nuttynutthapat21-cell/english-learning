

const projects = [
  {
    title: "เว็บไซต์แรกของฉัน",
    desc: "หน้าเว็บพื้นฐานพร้อมฟอร์มติดต่อและโหมดมืด",
    tags: ["HTML", "CSS", "JavaScript"]
  },
  {
    title: "To-do List",
    desc: "จดงานที่ต้องทำ ติ๊กเสร็จ และลบได้ ข้อมูลไม่หายเมื่อปิดเว็บ",
    tags: ["JavaScript", "localStorage"]
  },
  {
    title: "พอร์ตโฟลิโอ",
    desc: "หน้าแสดงผลงานที่ปรับตามขนาดหน้าจออัตโนมัติ",
    tags: ["CSS Grid", "Responsive"]
  }
];

const container = document.getElementById("projects");

projects.forEach((project) => {
  const card = document.createElement("div");
  card.className = "project-card";

  const tagsHTML = project.tags
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join("");

  card.innerHTML = `
    <h3>${project.title}</h3>
    <p>${project.desc}</p>
    <div>${tagsHTML}</div>
  `;

  container.appendChild(card);
});