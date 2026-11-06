
const STORAGE_KEY = "englishFlameData";

const MAX_LIVES = 5;
const REGEN_TIME = 20 * 60 * 1000;

// ===============================
// 1. SAQLANADIGAN MA'LUMOTLAR
// ===============================

function loadData() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (saved && typeof saved === "object") {
            return {
                xp: Number(saved.xp) || 0,
                lives: Math.max(0, Math.min(5, Number(saved.lives ?? 5))),
                lastLifeTime: saved.lastLifeTime || null,
                streak: Number(saved.streak) || 0,
                lastStudyDate: saved.lastStudyDate || null,
                completedLessons: Array.isArray(saved.completedLessons)
                    ? saved.completedLessons : [],
                totalCorrect: Number(saved.totalCorrect) || 0,
                totalWrong: Number(saved.totalWrong) || 0
            };
        }
    } catch (error) {
        console.error("Saqlangan ma'lumotlarni o'qishda xato:", error);
    }

    return {
        xp: 0,
        lives: 5,
        lastLifeTime: null,
        streak: 0,
        lastStudyDate: null,
        completedLessons: [],
        totalCorrect: 0,
        totalWrong: 0
    };
}

let data = loadData();

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ===============================
// 2. 5 TA KURS VA SAVOLLAR
// ===============================

const lessons = [
    {
        title: "Basic English Words",
        questions: [
            {
                question: "What does 'Apple' mean?",
                hint: "Meva nomi.",
                answers: ["Nok", "Olma", "Uzum", "Banan"],
                correct: 1
            },
            {
                question: "What does 'Book' mean?",
                hint: "Maktabda o'qiymiz.",
                answers: ["Daftar", "Ruchka", "Kitob", "Stol"],
                correct: 2
            },
            {
                question: "How do you say 'Salom'?",
                hint: "Uchrashganda aytiladi.",
                answers: ["Goodbye", "Hello", "Thanks", "Sorry"],
                correct: 1
            },
            {
                question: "What does 'Water' mean?",
                hint: "Biz uni ichamiz.",
                answers: ["Suv", "Sut", "Choy", "Sharbat"],
                correct: 0
            },
            {
                question: "What does 'Dog' mean?",
                hint: "Uy hayvoni.",
                answers: ["Mushuk", "Ot", "It", "Qush"],
                correct: 2
            }
        ]
    },

    {
        title: "Greetings",
        questions: [
            {
                question: "What does 'Good morning' mean?",
                hint: "Ertalab salomlashish.",
                answers: ["Xayrli tun", "Xayrli tong", "Xayr", "Rahmat"],
                correct: 1
            },
            {
                question: "How do you say 'Rahmat'?",
                hint: "Minnatdorchilik bildirish.",
                answers: ["Sorry", "Please", "Thanks", "Hello"],
                correct: 2
            },
            {
                question: "What does 'Goodbye' mean?",
                hint: "Xayrlashish.",
                answers: ["Salom", "Xayr", "Rahmat", "Iltimos"],
                correct: 1
            },
            {
                question: "How do you say 'Iltimos'?",
                hint: "Biror narsa so'raganda.",
                answers: ["Please", "Sorry", "Hello", "Thanks"],
                correct: 0
            },
            {
                question: "What does 'How are you?' mean?",
                hint: "Hol-ahvol so'rash.",
                answers: ["Isming nima?", "Qayerdasan?", "Qalaysan?", "Yoshing nechida?"],
                correct: 2
            }
        ]
    },

    {
        title: "Numbers",
        questions: [
            {
                question: "What does 'One' mean?",
                hint: "1 raqami.",
                answers: ["Ikki", "Bir", "Uch", "To'rt"],
                correct: 1
            },
            {
                question: "What does 'Five' mean?",
                hint: "5 raqami.",
                answers: ["Olti", "To'rt", "Besh", "Yetti"],
                correct: 2
            },
            {
                question: "How do you say 'O'n'?",
                hint: "10 raqami.",
                answers: ["Ten", "Two", "Three", "Eight"],
                correct: 0
            },
            {
                question: "What does 'Twenty' mean?",
                hint: "20 raqami.",
                answers: ["O'n", "O'ttiz", "Yigirma", "Qirq"],
                correct: 2
            },
            {
                question: "What does 'Seven' mean?",
                hint: "7 raqami.",
                answers: ["Besh", "Yetti", "Sakkiz", "To'qqiz"],
                correct: 1
            }
        ]
    },

    {
        title: "Pronouns",
        questions: [
            {
                question: "What does 'I' mean?",
                hint: "O'zingiz haqingizda gapirganda.",
                answers: ["Sen", "U", "Men", "Biz"],
                correct: 2
            },
            {
                question: "What does 'You' mean?",
                hint: "Suhbatdoshingiz.",
                answers: ["Men", "Sen", "U", "Biz"],
                correct: 1
            },
            {
                question: "What does 'We' mean?",
                hint: "Bir guruh odam.",
                answers: ["Biz", "Ular", "Men", "Sen"],
                correct: 0
            },
            {
                question: "What does 'They' mean?",
                hint: "Bir nechta odam.",
                answers: ["Men", "U", "Sen", "Ular"],
                correct: 3
            },
            {
                question: "What does 'He' mean?",
                hint: "Erkak kishi haqida.",
                answers: ["U (erkak)", "U (ayol)", "Men", "Biz"],
                correct: 0
            }
        ]
    },

    {
        title: "Simple Sentences",
        questions: [
            {
                question: "Choose the correct sentence.",
                hint: "Men o'quvchiman.",
                answers: [
                    "I am a student.",
                    "I is a student.",
                    "I are student.",
                    "I student am."
                ],
                correct: 0
            },
            {
                question: "Complete: She ___ happy.",
                hint: "She bilan mos fe'l.",
                answers: ["am", "is", "are", "be"],
                correct: 1
            },
            {
                question: "What does 'I like English' mean?",
                hint: "Tarjima qiling.",
                answers: [
                    "Men ingliz tilini yomon ko'raman.",
                    "Men ingliz tilini o'rganaman.",
                    "Men ingliz tilini yoqtiraman.",
                    "Men ingliz tilida gaplashaman."
                ],
                correct: 2
            },
            {
                question: "Complete: They ___ friends.",
                hint: "They bilan mos fe'l.",
                answers: ["am", "is", "are", "be"],
                correct: 2
            },
            {
                question: "What does 'This is my book' mean?",
                hint: "Tarjima qiling.",
                answers: [
                    "Bu mening kitobim.",
                    "Bu sening kitobing.",
                    "Bu mening daftarim.",
                    "Bu uning kitobi."
                ],
                correct: 0
            }
        ]
    }
];

// ===============================
// 3. O'YIN HOLATI
// ===============================

let currentLesson = 1;
let currentQuestion = 0;
let correctCount = 0;
let wrongCount = 0;
let selectedAnswer = null;
let answered = false;
let lessonActive = false;

// ===============================
// 4. SANA VA OL OVCHA
// ===============================

function getToday() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function dayDifference(date1, date2) {
    const a = new Date(date1 + "T12:00:00");
    const b = new Date(date2 + "T12:00:00");

    return Math.round((b - a) / 86400000);
}

function checkStreak() {
    if (!data.lastStudyDate) {
        data.streak = 0;
        return;
    }

    const difference = dayDifference(
        data.lastStudyDate,
        getToday()
    );

    if (difference > 1 || difference < 0) {
        data.streak = 0;
    }
}

// ===============================
// 5. JONLARNI TIKLASH
// ===============================

function updateLives() {
    const now = Date.now();

    if (data.lives < MAX_LIVES) {
        if (!data.lastLifeTime) {
            data.lastLifeTime = now;
        }

        const elapsed = now - data.lastLifeTime;
        const recovered = Math.floor(elapsed / REGEN_TIME);

        if (recovered > 0) {
            data.lives = Math.min(
                MAX_LIVES,
                data.lives + recovered
            );

            if (data.lives === MAX_LIVES) {
                data.lastLifeTime = null;
            } else {
                data.lastLifeTime += recovered * REGEN_TIME;
            }
        }
    }

    saveData();
}

// ===============================
// 6. DASHBOARD YANGILASH
// ===============================

function updateDashboard() {
    updateLives();
    checkStreak();

    document.getElementById("xp").textContent = data.xp;
    document.getElementById("lives").textContent = data.lives;
    document.getElementById("streak").textContent = data.streak;

    // Dashboard statistikasi
    const xpDashboard = document.getElementById("xpDashboard");
    const dashboardLives = document.getElementById("dashboardLives");
    const streakDashboard = document.getElementById("streakDashboard");

    if (xpDashboard) xpDashboard.textContent = data.xp;
    if (dashboardLives) dashboardLives.textContent = data.lives;
    if (streakDashboard) streakDashboard.textContent = data.streak;

    // Dars oynasidagi jonlar
    const lessonLives = document.querySelector("#lessonPage #lessonLives");
    if (lessonLives) lessonLives.textContent = data.lives;

    const completed = data.completedLessons.length;

    const percentage = (completed / lessons.length) * 100;

    document.getElementById("courseProgress").style.width =
        percentage + "%";

    document.getElementById("progressText").textContent =
        completed + " / " + lessons.length + " dars bajarildi";

    updateLessonButtons();

    saveData();
}

// ===============================
// 7. DARSLARNI OCHISH
// ===============================

function updateLessonButtons() {
    const items = document.querySelectorAll(".lesson-item");

    items.forEach((item, index) => {
        const lessonNumber = index + 1;
        const isCompleted = data.completedLessons.includes(lessonNumber);
        const unlocked =
            lessonNumber === 1 ||
            data.completedLessons.includes(lessonNumber - 1);

        let button = item.querySelector("button");
        let lock = item.querySelector("span");

        if (lock) {
            lock.remove();
        }

        if (!button) {
            button = document.createElement("button");
            item.appendChild(button);
        }

        if (isCompleted) {
            button.textContent = "Bajarildi ✓";
            button.style.background = "#304c38";
            button.style.color = "#58cc02";
            button.disabled = false;
            button.onclick = () => startLesson(lessonNumber);

        } else if (unlocked) {
            button.textContent = "Boshlash";
            button.style.background = "";
            button.style.color = "";
            button.disabled = false;
            button.onclick = () => startLesson(lessonNumber);

        } else {
            button.textContent = "🔒 Yopiq";
            button.style.background = "#39443d";
            button.style.color = "#aaaaaa";
            button.disabled = true;
            button.onclick = null;
        }
    });
}

// ===============================
// 8. SAHIFALAR
// ===============================

function hideAllPages() {
    document.getElementById("homePage").classList.add("hidden");
    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("lessonPage").classList.add("hidden");
    document.getElementById("resultPage").classList.add("hidden");
}

function showHome() {
    lessonActive = false;
    hideAllPages();

    document.getElementById("homePage").classList.remove("hidden");

    window.scrollTo(0, 0);
}

function showDashboard() {
    lessonActive = false;
    hideAllPages();

    updateDashboard();

    document.getElementById("dashboard").classList.remove("hidden");

    window.scrollTo(0, 0);
}

// ===============================
// 9. DARSLARNI BOSHLASH
// ===============================

function startLesson(lessonNumber = 1) {
    updateLives();

    if (data.lives <= 0) {
        alert("Jonlaringiz tugadi! ❤️ Keyingi jon tiklanishini kuting.");
        return;
    }

    if (lessonNumber < 1 || lessonNumber > lessons.length) {
        return;
    }

    const unlocked =
        lessonNumber === 1 ||
        data.completedLessons.includes(lessonNumber - 1);

    if (!unlocked) {
        alert("Avval oldingi darsni tugating! 🔒");
        return;
    }

    currentLesson = lessonNumber;
    currentQuestion = 0;

    correctCount = 0;
    wrongCount = 0;

    selectedAnswer = null;
    answered = false;
    lessonActive = true;

    hideAllPages();

    document.getElementById("lessonPage").classList.remove("hidden");

    renderQuestion();

    window.scrollTo(0, 0);
}

// ===============================
// 10. SAVOLNI KO'RSATISH
// ===============================

function renderQuestion() {
    if (!lessonActive) return;

    updateLives();

    if (data.lives <= 0) {
        finishLesson(false);
        return;
    }

    const lesson = lessons[currentLesson - 1];
    const q = lesson.questions[currentQuestion];

    document.getElementById("question").textContent = q.question;

    document.getElementById("questionHint").textContent = q.hint;

    document.getElementById("lessonLives").textContent = data.lives;

    document.getElementById("lessonProgress").style.width =
        (currentQuestion / lesson.questions.length * 100) + "%";

    document.getElementById("feedback").textContent = "";

    const answersBox = document.getElementById("answers");

    answersBox.innerHTML = "";

    selectedAnswer = null;
    answered = false;

    const checkButton = document.getElementById("checkButton");

    checkButton.disabled = true;
    checkButton.textContent = "Tekshirish";

    q.answers.forEach((answer, index) => {
        const button = document.createElement("button");

        button.className = "answer-option";
        button.textContent = answer;

        button.addEventListener("click", () => {
            if (answered) return;

            selectedAnswer = index;

            document.querySelectorAll(".answer-option").forEach(btn => {
                btn.classList.remove("selected");
            });

            button.classList.add("selected");

            checkButton.disabled = false;
        });

        answersBox.appendChild(button);
    });
}

// ===============================
// 11. JAVOBNI TEKSHIRISH
// ===============================

function nextQuestion() {
    if (!lessonActive) return;

    if (!answered) {
        if (selectedAnswer === null) return;

        answered = true;

        const q = lessons[currentLesson - 1]
            .questions[currentQuestion];

        const options = document.querySelectorAll(".answer-option");

        const feedback = document.getElementById("feedback");

        if (selectedAnswer === q.correct) {
            correctCount++;

            options[selectedAnswer].classList.add("correct");

            feedback.textContent = "Ajoyib! To'g'ri javob! 🎉";
            feedback.style.color = "#58cc02";

        } else {
            wrongCount++;

            // Xato javob uchun bitta jon ketadi.
            updateLives();

            data.lives = Math.max(0, data.lives - 1);

            if (data.lives < MAX_LIVES && !data.lastLifeTime) {
                data.lastLifeTime = Date.now();
            }

            options[selectedAnswer].classList.add("wrong");

            options[q.correct].classList.add("correct");

            feedback.textContent =
                "Noto'g'ri! To'g'ri javob: " + q.answers[q.correct];

            feedback.style.color = "#ff6868";
        }

        updateDashboard();

        document.getElementById("lessonLives").textContent = data.lives;

        document.getElementById("checkButton").textContent =
            "Davom etish";

        return;
    }

    if (data.lives <= 0) {
        finishLesson(false);
        return;
    }

    currentQuestion++;

    const totalQuestions = lessons[currentLesson - 1].questions.length;

    if (currentQuestion >= totalQuestions) {
        finishLesson(true);
    } else {
        renderQuestion();
    }
}

// ===============================
// 12. DARSNI TUGATISH
// ===============================

function finishLesson(completed) {
    lessonActive = false;

    hideAllPages();

    document.getElementById("resultPage").classList.remove("hidden");

    let earnedXP = 0;

    if (completed) {

        // To'g'ri javob: 10 XP.
        // Kam xato: qo'shimcha XP.

        const bonus = Math.max(0, 20 - wrongCount * 5);

        earnedXP = correctCount * 10 + bonus;

        data.xp += earnedXP;

        data.totalCorrect += correctCount;
        data.totalWrong += wrongCount;

        if (!data.completedLessons.includes(currentLesson)) {
            data.completedLessons.push(currentLesson);
        }

        // Olovcha hisoblash.

        const today = getToday();

        if (data.lastStudyDate !== today) {
            if (!data.lastStudyDate) {
                data.streak = 1;
            } else {
                const difference = dayDifference(
                    data.lastStudyDate,
                    today
                );

                if (difference === 1) {
                    data.streak++;
                } else {
                    data.streak = 1;
                }
            }

            data.lastStudyDate = today;
        }

        document.getElementById("resultMessage").textContent =
            "Tabriklaymiz! " + currentLesson + "-darsni tugatdingiz! 🔥";

    } else {

        data.totalCorrect += correctCount;
        data.totalWrong += wrongCount;

        document.getElementById("resultMessage").textContent =
            "Jonlaringiz tugadi. Keyinroq yana urinib ko'ring! ❤️";
    }

    document.getElementById("earnedXP").textContent = earnedXP;

    document.getElementById("correctAnswers").textContent = correctCount;

    document.getElementById("wrongAnswers").textContent = wrongCount;

    document.getElementById("lessonProgress").style.width = "100%";

    saveData();
}

// ===============================
// 13. DARSDAN CHIQISH
// ===============================

function exitLesson() {
    if (!confirm("Darsdan chiqmoqchimisiz?")) {
        return;
    }

    lessonActive = false;

    showDashboard();
}

// ===============================
// 14. TIZIMNI ISHGA TUSHIRISH
// ===============================

function initialize() {
    updateLives();
    checkStreak();
    updateDashboard();

    // Har 10 soniyada jonlarni tekshirish.

    setInterval(() => {
        updateLives();
        updateDashboard();
    }, 10000);
}

initialize();


// Moslik uchun: eski HTML tugmasi checkAnswer() deb chaqirsa ham ishlaydi.
function checkAnswer() {
    nextQuestion();
}
