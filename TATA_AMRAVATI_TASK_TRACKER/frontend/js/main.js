const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    if (themeIcon) {
        themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
    }
}

const savedTheme = localStorage.getItem("taskTrackerTheme") || "light";
applyTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const current =
            document.documentElement.getAttribute("data-theme") || "light";

        const next = current === "light" ? "dark" : "light";

        localStorage.setItem("taskTrackerTheme", next);
        applyTheme(next);
    });
}
