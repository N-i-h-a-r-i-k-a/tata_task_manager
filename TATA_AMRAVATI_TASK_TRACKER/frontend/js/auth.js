
// ==========================================
// BACKEND CONFIGURATION
// ==========================================

const API_BASE = "../../backend/";

let csrfToken = "";


// ==========================================
// PASSWORD SHOW / HIDE
// ==========================================

document.querySelectorAll(".password-toggle").forEach((button) => {

    button.addEventListener("click", () => {

        const input = document.getElementById(button.dataset.target);

        if (!input) return;

        const isPassword = input.type === "password";

        input.type = isPassword ? "text" : "password";

        button.textContent = isPassword ? "Hide" : "Show";

    });

});


// ==========================================
// FORM VALIDATION HELPERS
// ==========================================

function showError(id, message) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = message;
    }

}


function clearErrors() {

    document.querySelectorAll(".error-message, .form-message")
        .forEach((element) => {

            element.textContent = "";

        });

}


// Email validation
function validEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


// Display server messages
function showMessage(id, message, success = false) {

    const element = document.getElementById(id);

    if (element) {

        element.textContent = message;

        element.style.color = success ? "#16a34a" : "#dc2626";

    }

}


// ==========================================
// GET CSRF SECURITY TOKEN
// ==========================================

async function getCsrfToken() {

    const response = await fetch(API_BASE + "auth/csrf.php", {

        method: "GET",

        credentials: "same-origin"

    });

    const result = await response.json();

    if (!response.ok || !result.success) {

        throw new Error(
            result.message || "Unable to initialize security token."
        );

    }

    // PHP respond() stores the token inside result.data
    csrfToken = result.data?.csrf_token || "";

    if (!csrfToken) {

        throw new Error("CSRF token was not returned by the server.");

    }

    console.log("CSRF token initialized successfully!");

}


// ==========================================
// SEND REQUEST TO PHP BACKEND
// ==========================================

async function sendRequest(endpoint, payload) {

    if (!csrfToken) {

        await getCsrfToken();

    }

    const response = await fetch(API_BASE + endpoint, {

        method: "POST",

        credentials: "same-origin",

        headers: {

            "Content-Type": "application/json",

            "X-CSRF-Token": csrfToken

        },

        body: JSON.stringify({

            ...payload,

            csrf_token: csrfToken

        })

    });

    let result;

    try {

        result = await response.json();

    } catch (error) {

        throw new Error("Invalid server response. Check your PHP backend.");

    }

    if (!response.ok || !result.success) {

        throw new Error(
            result.message || "Something went wrong. Please try again."
        );

    }

    return result;

}


// ==========================================
// INITIALIZE SECURITY TOKEN
// ==========================================

getCsrfToken().catch((error) => {

    console.error("Security initialization error:", error);

});


// ==========================================
// USER REGISTRATION
// ==========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        clearErrors();

        const name = document.getElementById("name").value.trim();

        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        let isValid = true;


        // Name validation
        if (name.length < 2) {

            showError("nameError", "Please enter your full name.");

            isValid = false;

        }


        // Email validation
        if (!validEmail(email)) {

            showError("emailError", "Please enter a valid email address.");

            isValid = false;

        }


        // Password validation
        if (password.length < 8) {

            showError(
                "passwordError",
                "Password must contain at least 8 characters."
            );

            isValid = false;

        }


        if (password.length > 72) {

            showError(
                "passwordError",
                "Password must not exceed 72 characters."
            );

            isValid = false;

        }


        // Confirm password validation
        if (password !== confirmPassword) {

            showError(
                "confirmPasswordError",
                "Passwords do not match."
            );

            isValid = false;

        }


        if (!isValid) return;


        const button = registerForm.querySelector('[type="submit"]');

        if (button) button.disabled = true;


        try {

            const result = await sendRequest("auth/register.php", {

                name: name,

                email: email,

                password: password

            });


            showMessage(
                "registerMessage",
                result.message || "Registration successful!",
                true
            );


            registerForm.reset();


            // Redirect to login page
            setTimeout(() => {

                window.location.href = "login.html";

            }, 1200);


        } catch (error) {

            showMessage("registerMessage", error.message);

            console.error("Registration error:", error);

        } finally {

            if (button) button.disabled = false;

        }

    });

}


// ==========================================
// USER LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        clearErrors();


        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value;


        let isValid = true;


        // Email validation
        if (!validEmail(email)) {

            showError("emailError", "Please enter a valid email address.");

            isValid = false;

        }


        // Password validation
        if (password.trim() === "") {

            showError("passwordError", "Please enter your password.");

            isValid = false;

        }


        if (!isValid) return;


        const button = loginForm.querySelector('[type="submit"]');

        if (button) button.disabled = true;


        try {

            const result = await sendRequest("auth/login.php", {

                email: email,

                password: password

            });


            showMessage(
                "loginMessage",
                result.message || "Login successful! Redirecting...",
                true
            );


            // Redirect to dashboard
            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 800);


        } catch (error) {

            showMessage("loginMessage", error.message);

            console.error("Login error:", error);

        } finally {

            if (button) button.disabled = false;

        }

    });

}
