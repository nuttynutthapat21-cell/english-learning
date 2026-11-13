

// ---------- ข้อมูลคำศัพท์ ----------
const words = [
  { en: "Hello", th: "สวัสดี", cat: "ทั่วไป" },
  { en: "Thank you", th: "ขอบคุณ", cat: "ทั่วไป" },
  { en: "Please", th: "กรุณา / ได้โปรด", cat: "ทั่วไป" },
  { en: "Friend", th: "เพื่อน", cat: "ทั่วไป" },
  { en: "Water", th: "น้ำ", cat: "อาหาร" },
  { en: "Delicious", th: "อร่อย", cat: "อาหาร" },
  { en: "The bill, please", th: "คิดเงินด้วย", cat: "อาหาร" },
  { en: "Where is the toilet?", th: "ห้องน้ำอยู่ที่ไหน", cat: "เดินทาง" },
  { en: "How much is this?", th: "อันนี้ราคาเท่าไหร่", cat: "เดินทาง" },
  { en: "Turn left", th: "เลี้ยวซ้าย", cat: "เดินทาง" }
];

// ---------- ตัวแปรสถานะ ----------
let activeWords = words;
let index = 0;
let showingEnglish = true;
let answered = false;
let score = JSON.parse(localStorage.getItem("score")) || { speak: 0, quiz: 0 };

// ---------- อ้างอิง element ----------
const cardText = document.getElementById("cardText");
const cardHint = document.getElementById("cardHint");
const counter = document.getElementById("counter");
const flashcard = document.getElementById("flashcard");
const categorySelect = document.getElementById("category");
const speakScoreEl = document.getElementById("speakScore");
const quizScoreEl = document.getElementById("quizScore");
const question = document.getElementById("question");
const choicesBox = document.getElementById("choices");
const quizResult = document.getElementById("quizResult");
const micBtn = document.getElementById("micBtn");
const heard = document.getElementById("heard");
const speakResult = document.getElementById("speakResult");

// ---------- คะแนน ----------
function saveScore() {
  localStorage.setItem("score", JSON.stringify(score));
  showScore();
}

function showScore() {
  speakScoreEl.textContent = score.speak;
  quizScoreEl.textContent = score.quiz;
}

document.getElementById("resetBtn").addEventListener("click", () => {
  score = { speak: 0, quiz: 0 };
  saveScore();
});

// ---------- หมวดคำศัพท์ ----------
const categories = ["ทั้งหมด", ...new Set(words.map((w) => w.cat))];

categories.forEach((cat) => {
  const option = document.createElement("option");
  option.value = cat;
  option.textContent = cat;
  categorySelect.appendChild(option);
});

categorySelect.addEventListener("change", () => {
  const selected = categorySelect.value;
  activeWords = selected === "ทั้งหมด" ? words : words.filter((w) => w.cat === selected);
  index = 0;
  refresh();
});

// ---------- แฟลชการ์ด ----------
function showCard() {
  const word = activeWords[index];
  cardText.textContent = showingEnglish ? word.en : word.th;
  cardHint.textContent = showingEnglish ? "แตะเพื่อดูคำแปล" : "แตะเพื่อดูคำอังกฤษ";
  counter.textContent = `คำที่ ${index + 1} / ${activeWords.length}`;
}

function refresh() {
  showingEnglish = true;
  heard.textContent = "";
  speakResult.textContent = "";
  showCard();
  makeQuiz();
}

function goNext() {
  index = (index + 1) % activeWords.length;
  refresh();
}

function goPrev() {
  index = (index - 1 + activeWords.length) % activeWords.length;
  refresh();
}

flashcard.addEventListener("click", () => {
  showingEnglish = !showingEnglish;
  showCard();
});

document.getElementById("nextBtn").addEventListener("click", goNext);
document.getElementById("prevBtn").addEventListener("click", goPrev);

// ---------- ออกเสียง ----------
function speak(text) {
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = 0.9;
  speechSynthesis.speak(utter);
}

document.getElementById("speakBtn").addEventListener("click", () => {
  speak(activeWords[index].en);
});

// ---------- ทดสอบตัวเอง ----------
function makeQuiz() {
  const correct = activeWords[index];
  answered = false;
  question.textContent = `"${correct.en}" แปลว่าอะไร?`;
  quizResult.textContent = "";
  choicesBox.innerHTML = "";

  // ตัวเลือกหลอกดึงจากคำทั้งหมด เผื่อบางหมวดมีคำน้อย
  const wrong = words
    .filter((w) => w.en !== correct.en)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);

  const options = [correct, ...wrong].sort(() => Math.random() - 0.5);

  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt.th;
    btn.addEventListener("click", () => {
      if (opt.en === correct.en) {
        quizResult.textContent = "ถูกต้อง! 🎉";
        quizResult.style.color = "green";
        // นับคะแนนครั้งเดียวต่อคำถาม
        if (!answered) {
          score.quiz++;
          saveScore();
        }
        answered = true;
      } else {
        quizResult.textContent = "ลองอีกครั้ง";
        quizResult.style.color = "red";
      }
    });
    choicesBox.appendChild(btn);
  });
}

// ---------- ฝึกพูด ----------
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

if (!SpeechRecognition) {
  micBtn.disabled = true;
  speakResult.textContent = "เบราว์เซอร์นี้ไม่รองรับ ลองใช้ Chrome หรือ Edge";
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;

  micBtn.addEventListener("click", () => {
    heard.textContent = "";
    speakResult.textContent = "";
    micBtn.classList.add("listening");
    micBtn.textContent = "🎤 กำลังฟัง...";
    recognition.start();
  });

  recognition.addEventListener("result", (event) => {
    const target = normalize(activeWords[index].en);
    const results = Array.from(event.results[0]);

    heard.textContent = `ที่ได้ยิน: "${results[0].transcript}"`;

    const correct = results.some((r) => normalize(r.transcript) === target);

    if (correct) {
      speakResult.textContent = "ออกเสียงชัดมาก! 🎉 กำลังไปคำถัดไป...";
      speakResult.style.color = "green";
      score.speak++;
      saveScore();
      setTimeout(goNext, 1500); // ไปคำถัดไปอัตโนมัติ
    } else {
      speakResult.textContent = "ยังไม่ตรง ลองฟังเสียงตัวอย่างแล้วพูดอีกครั้ง";
      speakResult.style.color = "red";
    }
  });

  recognition.addEventListener("error", (event) => {
    speakResult.style.color = "red";
    speakResult.textContent =
      event.error === "not-allowed"
        ? "กรุณาอนุญาตให้เว็บใช้ไมโครโฟน"
        : "เกิดข้อผิดพลาด ลองอีกครั้ง";
  });

  recognition.addEventListener("end", () => {
    micBtn.classList.remove("listening");
    micBtn.textContent = "🎤 กดแล้วพูด";
  });
}

// ---------- เริ่มต้น ----------
showScore();
refresh();

