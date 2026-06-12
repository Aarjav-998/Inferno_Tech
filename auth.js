document.addEventListener("DOMContentLoaded", () => {
    const authMessage = document.getElementById("auth-message");
    const authForms = document.getElementById("auth-forms");
    const accountPanel = document.getElementById("account-panel");
    const accountSummary = document.getElementById("account-summary");
    const accountUserId = document.getElementById("account-user-id");
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");
    const profileForm = document.getElementById("profile-form");
    const logoutButton = document.getElementById("logout-button");
    const deleteAccountButton = document.getElementById("delete-account-button");
    let currentUser = null;

    if (!authForms || !registerForm || !loginForm) return;

    loadSavedSession();

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("register-name").value.trim();
        const email = document.getElementById("register-email").value.trim();
        const password = document.getElementById("register-password").value;
        const bio = document.getElementById("register-bio").value.trim();
        const gender = document.getElementById("register-gender").value.trim();

        if (!name || !email || !password) {
            showAuthStatus("Please fill out name, email, and password.", "error");
            return;
        }

        if (!validateEmail(email)) {
            showAuthStatus("Please enter a valid email address.", "error");
            return;
        }

        await authRequest("/api/auth/register", { name, email, password, bio, gender });
        registerForm.reset();
    });

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;

        if (!email || !password) {
            showAuthStatus("Please enter your email and password.", "error");
            return;
        }

        await authRequest("/api/auth/login", { email, password });
        loginForm.reset();
    });

    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!currentUser) {
            showAuthStatus("Please log in first.", "error");
            return;
        }

        showAuthStatus("Updating profile...", "loading");

        try {
            const response = await fetch(`/api/users/${currentUser.id}`, {
                method: "PATCH",
                headers: authHeaders(),
                body: JSON.stringify({
                    name: document.getElementById("profile-name").value.trim(),
                    bio: document.getElementById("profile-bio").value.trim(),
                    gender: document.getElementById("profile-gender").value.trim()
                })
            });
            const data = await response.json();

            if (!response.ok) {
                showAuthStatus(data.message || "Could not update profile.", "error");
                return;
            }

            saveSession(localStorage.getItem("infernoToken"), data.user);
            showAuthStatus("Profile updated.", "success");
        } catch (error) {
            showAuthStatus("Network error. Please try again.", "error");
        }
    });

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("infernoToken");
        currentUser = null;
        renderAccount();
        showAuthStatus("Logged out.", "success");
    });

    deleteAccountButton.addEventListener("click", async () => {
        if (!currentUser || !confirm("Delete this account permanently?")) return;

        showAuthStatus("Deleting account...", "loading");

        try {
            const response = await fetch(`/api/users/${currentUser.id}`, {
                method: "DELETE",
                headers: authHeaders()
            });
            const data = await response.json();

            if (!response.ok) {
                showAuthStatus(data.message || "Could not delete account.", "error");
                return;
            }

            localStorage.removeItem("infernoToken");
            currentUser = null;
            renderAccount();
            showAuthStatus("Account deleted.", "success");
        } catch (error) {
            showAuthStatus("Network error. Please try again.", "error");
        }
    });

    async function authRequest(url, body) {
        showAuthStatus("Working...", "loading");

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            const data = await response.json();

            if (!response.ok) {
                showAuthStatus(data.message || "Authentication failed.", "error");
                return;
            }

            saveSession(data.token, data.user);
            showAuthStatus(`You are signed in. Your User ID is ${data.user.id}`, "success");
        } catch (error) {
            showAuthStatus("Network error. Please try again.", "error");
        }
    }

    async function loadSavedSession() {
        const token = localStorage.getItem("infernoToken");

        if (!token) {
            renderAccount();
            return;
        }

        try {
            const response = await fetch("/api/auth/me", { headers: authHeaders() });
            const data = await response.json();

            if (!response.ok) {
                localStorage.removeItem("infernoToken");
                renderAccount();
                return;
            }

            currentUser = data.user;
            renderAccount();
        } catch (error) {
            renderAccount();
        }
    }

    function saveSession(token, user) {
        localStorage.setItem("infernoToken", token);
        currentUser = user;
        renderAccount();
    }

    function authHeaders() {
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("infernoToken") || ""}`
        };
    }

    function renderAccount() {
        if (!currentUser) {
            authForms.classList.remove("hidden");
            accountPanel.classList.add("hidden");
            if (accountUserId) accountUserId.textContent = "";
            return;
        }

        authForms.classList.add("hidden");
        accountPanel.classList.remove("hidden");
        accountSummary.textContent = `Signed in as ${currentUser.name} (${currentUser.email}).`;
        if (accountUserId) accountUserId.textContent = currentUser.id;
        document.getElementById("profile-name").value = currentUser.name || "";
        document.getElementById("profile-bio").value = currentUser.bio || "";
        document.getElementById("profile-gender").value = currentUser.gender || "";
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showAuthStatus(text, type) {
        authMessage.textContent = text;
        authMessage.className = "mt-4 text-sm";

        switch (type) {
            case "success":
                authMessage.classList.add("text-green-500");
                break;
            case "error":
                authMessage.classList.add("text-red-500");
                break;
            case "loading":
                authMessage.classList.add("text-yellow-500");
                break;
        }
    }
});
