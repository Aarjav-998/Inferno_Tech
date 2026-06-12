document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("waitlist-form");
    const status = document.getElementById("form-message");
    const accountMessage = document.getElementById("waitlist-account-message");
    const menuBtn = document.getElementById("menu-btn");
    const menu = document.getElementById("menu");
    let currentUser = null;

    if (menuBtn && menu) {
        menuBtn.addEventListener("click", () => {
            menu.classList.toggle("show");
        });
    }

    loadSavedSession();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!currentUser) {
            showStatus("Please log in from the home page before joining.", "error");
            return;
        }

        showStatus("Joining waitlist...", "loading");

        try {
            const response = await fetch("/api/waitlist", {
                method: "POST",
                headers: authHeaders()
            });
            const data = await response.json();

            if (response.ok) {
                saveSession(localStorage.getItem("infernoToken"), data.user);
                submitWaitlistToFormspree(data.user);
                showStatus("Successfully added to the waitlist and sent to Formspree!", "success");
            } else {
                showStatus(data.message || "Something went wrong. Please try again.", "error");
            }
        } catch (error) {
            showStatus("Network error. Please try again.", "error");
        }
    });

    async function loadSavedSession() {
        const token = localStorage.getItem("infernoToken");

        if (!token) {
            renderAccountMessage();
            return;
        }

        try {
            const response = await fetch("/api/auth/me", {
                headers: authHeaders()
            });
            const data = await response.json();

            if (!response.ok) {
                localStorage.removeItem("infernoToken");
                currentUser = null;
                renderAccountMessage();
                return;
            }

            currentUser = data.user;
            renderAccountMessage();
        } catch (error) {
            renderAccountMessage();
        }
    }

    function saveSession(token, user) {
        localStorage.setItem("infernoToken", token);
        currentUser = user;
        renderAccountMessage();
    }

    function authHeaders() {
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("infernoToken") || ""}`
        };
    }

    function renderAccountMessage() {
        if (!accountMessage) return;

        if (!currentUser) {
            accountMessage.textContent = "You are not logged in yet. Please log in on the home page first.";
            return;
        }

        accountMessage.textContent = `Logged in as ${currentUser.name}. Your User ID is ${currentUser.id}.`;
    }

    function submitWaitlistToFormspree(user) {
        document.getElementById("waitlist-formspree-name").value = user.name || "";
        document.getElementById("waitlist-formspree-email").value = user.email || "";
        document.getElementById("waitlist-formspree-user-id").value = user.id || "";
        document.getElementById("waitlist-formspree-bio").value = user.bio || "";
        document.getElementById("waitlist-formspree-gender").value = user.gender || "";
        document.getElementById("waitlist-formspree-joined-at").value = user.waitlistJoinedAt || "";
        form.submit();
    }

    function showStatus(text, type) {
        status.textContent = text;
        status.className = "mt-4 text-sm";

        switch (type) {
            case "success":
                status.classList.add("text-green-500");
                break;
            case "error":
                status.classList.add("text-red-500");
                break;
            case "loading":
                status.classList.add("text-yellow-500");
                break;
        }
    }
});
