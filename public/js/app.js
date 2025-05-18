<<<<<<< HEAD
=======

>>>>>>> 454aa3e244e0a08f5f06df8800df184cf5ac67ed
document.addEventListener("DOMContentLoaded", function () {
    const loginModal = document.getElementById("login-modal");
    const signupModal = document.getElementById("signup-modal");

    document.getElementById("loginBtn").addEventListener("click", function () {
        loginModal.style.display = "flex";
    });

    document.getElementById("signupBtn").addEventListener("click", function () {
        signupModal.style.display = "flex";
    });

    document.querySelectorAll(".close").forEach(btn => {
        btn.addEventListener("click", function () {
            loginModal.style.display = "none";
            signupModal.style.display = "none";
        });
    });

    window.addEventListener("click", function (event) {
        if (event.target === loginModal) loginModal.style.display = "none";
        if (event.target === signupModal) signupModal.style.display = "none";
    });

   


    // جلب بيانات الطقس
    document.getElementById("weather-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const city = document.getElementById("city").value;
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please log in first.");
            return;
        }

        const response = await fetch(`/api/weather?city=${city}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById("weather-result").innerHTML = `<h3>${data.name}</h3><p>${data.weather[0].description}, ${data.main.temp}°C</p>`;
        } else {
            alert("Failed to fetch weather: " + data.error);
        }
    });
});


<<<<<<< HEAD
// 🔹 الحصول على العناصر المطلوبة
=======
// الحصول على العناصر المطلوبة
>>>>>>> 454aa3e244e0a08f5f06df8800df184cf5ac67ed
const authModal = document.getElementById("authModal");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const closeBtn = document.querySelector(".close");
const switchToSignup = document.getElementById("switchToSignup");
const loginRadio = document.getElementById("loginRadio");
const signupRadio = document.getElementById("signupRadio");

<<<<<<< HEAD
// 🔹 عند الضغط على زر "Login"
=======
// عند الضغط على زر "Login"
>>>>>>> 454aa3e244e0a08f5f06df8800df184cf5ac67ed
loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    authModal.style.display = "block";
    loginRadio.checked = true;
});

<<<<<<< HEAD
// 🔹 عند الضغط على زر "Signup"
=======
// عند الضغط على زر "Signup"
>>>>>>> 454aa3e244e0a08f5f06df8800df184cf5ac67ed
signupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    authModal.style.display = "block";
    signupRadio.checked = true;
});

<<<<<<< HEAD
// 🔹 عند الضغط على زر "×" (إغلاق المودال)
=======
// عند الضغط على زر "×" (إغلاق المودال)
>>>>>>> 454aa3e244e0a08f5f06df8800df184cf5ac67ed
closeBtn.addEventListener("click", () => {
    authModal.style.display = "none";
});

<<<<<<< HEAD
// 🔹 عند الضغط على رابط "Signup now" داخل نموذج تسجيل الدخول
=======
// عند الضغط على رابط "Signup now" داخل نموذج تسجيل الدخول
>>>>>>> 454aa3e244e0a08f5f06df8800df184cf5ac67ed
switchToSignup.addEventListener("click", (e) => {
    e.preventDefault();
    signupRadio.checked = true;
});

<<<<<<< HEAD
// 🔹 إغلاق المودال عند الضغط خارج النافذة
=======
// إغلاق المودال عند الضغط خارج النافذة
>>>>>>> 454aa3e244e0a08f5f06df8800df184cf5ac67ed
window.addEventListener("click", (e) => {
    if (e.target === authModal) {
        authModal.style.display = "none";
    }
<<<<<<< HEAD
});
=======
});
>>>>>>> 454aa3e244e0a08f5f06df8800df184cf5ac67ed
