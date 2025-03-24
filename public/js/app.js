
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


// الحصول على العناصر المطلوبة
const authModal = document.getElementById("authModal");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const closeBtn = document.querySelector(".close");
const switchToSignup = document.getElementById("switchToSignup");
const loginRadio = document.getElementById("loginRadio");
const signupRadio = document.getElementById("signupRadio");

// عند الضغط على زر "Login"
loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    authModal.style.display = "block";
    loginRadio.checked = true;
});

// عند الضغط على زر "Signup"
signupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    authModal.style.display = "block";
    signupRadio.checked = true;
});

// عند الضغط على زر "×" (إغلاق المودال)
closeBtn.addEventListener("click", () => {
    authModal.style.display = "none";
});

// عند الضغط على رابط "Signup now" داخل نموذج تسجيل الدخول
switchToSignup.addEventListener("click", (e) => {
    e.preventDefault();
    signupRadio.checked = true;
});

// إغلاق المودال عند الضغط خارج النافذة
window.addEventListener("click", (e) => {
    if (e.target === authModal) {
        authModal.style.display = "none";
    }
});
