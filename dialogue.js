

// ---------- บทสนทนา ----------
// who: "staff" = เว็บพูด, "you" = ผู้เรียนพูด
const scenarios = {
  "สั่งอาหารที่ร้าน": [
    { who: "staff", en: "Hello! Are you ready to order?", th: "สวัสดีค่ะ พร้อมสั่งอาหารหรือยังคะ" },
    { who: "you", en: "Yes, I would like a glass of water, please.", th: "ครับ ขอน้ำเปล่าหนึ่งแก้วครับ" },
    { who: "staff", en: "Sure. Anything else?", th: "ได้เลยค่ะ รับอะไรเพิ่มไหมคะ" },
    { who: "you", en: "No, thank you. The food is delicious.", th: "ไม่ครับ ขอบคุณ อาหารอร่อยมากครับ" },
    { who: "staff", en: "Thank you! Have a nice day.", th: "ขอบคุณค่ะ ขอให้มีความสุขกับวันนี้นะคะ" }
  ],
  "ถามทาง": [
    { who: "you", en: "Excuse me, where is the toilet?", th: "ขอโทษครับ ห้องน้ำอยู่ที่ไหนครับ" },
    { who: "staff", en: "Go straight and turn left.", th: "เดินตรงไปแล้วเลี้ยวซ้ายค่ะ" },
    { who: "you", en: "Thank you very much.", th: "ขอบคุณมากครับ" },
    { who: "staff", en: "You are welcome.", th: "ยินดีค่ะ" }
  ]
};

// ---------- อ้างอิง element ----------
const scenarioSelect = document.getElementById("scenario");
const chat = document.getElementById("chat");
const startBtn = document.getElementById("startBtn");
const status = document.getElementById("status");

Object.keys(scenarios).forEach((name) => {
  const option = document.createElement("option");
  option.value = name;
  option.textContent = name;
  scenarioSelect.appendChild(option);
});

// ---------- เครื่องมือช่วย ----------
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// คิดความคล้าย: สัดส่วนคำเป้าหมายที่ผู้เรียนพูดถูก (ผ่อนปรนกว่าการเทียบตรงๆ)
function similarity(spoken, target) {
  const spokenWords = normalize(spoken).split(" ");
  const targetWords = normalize(target).split(" ");
  const hit = targetWords.filter((w) => spokenWords.includes(w)).length;
  return hit / targetWords.length;
}

function speak(text) {
  return new Promise((resolve) => {
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 0.9;
    utter.onend = resolve;
    utter.onerror = resolve;
    speechSynthesis.speak(utter);
  });
}

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

function listen() {
  return new Promise((resolve, reject) => {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.maxAlternatives = 3;
    recognition.onresult = (e) => resolve(Array.from(e.results[0]));
    recognition.onerror = (e) => reject(e.error);
    recognition.onnomatch = () => resolve([]);
    recognition.start();
  });
}

// ---------- วาดบทสนทนา ----------
let bubbles = [];

function drawChat() {
  chat.innerHTML = "";
  bubbles = [];
  scenarios[scenarioSelect.value].forEach((line) => {
    const div = document.createElement("div");
    div.className = `bubble ${line.who} hidden`;
    div.innerHTML = `${line.en}<small>${line.th}</small>`;
    chat.appendChild(div);
    bubbles.push(div);
  });
  status.textContent = "";
}

scenarioSelect.addEventListener("change", drawChat);

// ---------- เล่นบทสนทนา ----------
let running = false;

async function play() {
  if (running) return;
  running = true;
  startBtn.disabled = true;
  drawChat();

  const lines = scenarios[scenarioSelect.value];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const bubble = bubbles[i];
    bubble.classList.remove("hidden");

    if (line.who === "staff") {
      status.textContent = "กำลังฟังพนักงาน...";
      await speak(line.en);
    } else {
      let passed = false;

      while (!passed) {
        bubble.classList.add("waiting");
        startBtn.classList.add("listening");
        status.textContent = "ถึงตาคุณ! พูดประโยคที่เห็นในกรอบสีน้ำเงิน 🎤";

        try {
          const results = await listen();
          const best = results.length
            ? Math.max(...results.map((r) => similarity(r.transcript, line.en)))
            : 0;

          if (best >= 0.7) {
            passed = true;
            markPracticed();
            status.textContent = "เยี่ยมมาก! 🎉";
          } else {
            status.textContent = "ยังไม่ชัด ฟังตัวอย่างแล้วลองอีกครั้ง";
            await speak(line.en);
          }
        } catch (err) {
          status.textContent =
            err === "not-allowed"
              ? "กรุณาอนุญาตให้เว็บใช้ไมโครโฟน แล้วกดเริ่มใหม่"
              : "เกิดข้อผิดพลาด กดเริ่มใหม่อีกครั้ง";
          bubble.classList.remove("waiting");
          startBtn.classList.remove("listening");
          startBtn.disabled = false;
          running = false;
          return;
        }
      }

      bubble.classList.remove("waiting");
      bubble.classList.add("done-ok");
      startBtn.classList.remove("listening");
    }
  }

  status.textContent = "จบบทสนทนา เก่งมาก! ลองเปลี่ยนสถานการณ์ดูได้เลย 🎊";
  startBtn.disabled = false;
  startBtn.textContent = "▶ เล่นอีกครั้ง";
  running = false;
}

if (!SpeechRecognition) {
  startBtn.disabled = true;
  status.textContent = "เบราว์เซอร์นี้ไม่รองรับการฝึกพูด ลองใช้ Chrome หรือ Edge";
} else {
  startBtn.addEventListener("click", play);
}

drawChat();

