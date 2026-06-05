// Waitlist JS
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("waitlist-form");
    const status = document.getElementById("form-message");
    const menuBtn = document.getElementById("menu-btn");
    const menu = document.getElementById("menu");

    // Mobile Menu Toggle
    if (menuBtn && menu) {
        menuBtn.addEventListener("click", () => {
            menu.classList.toggle("show");
        });
    }

    // Form Submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();

        if (!name || !email) {
            showStatus("⚠️ Please fill out all fields.", "error");
            return;
        }

        if (!validateEmail(email)) {
            showStatus("⚠️ Please enter a valid email address.", "error");
            return;
        }

        showStatus("⏳ Joining waitlist...", "loading");

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: {
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                showStatus("✅ Successfully added to the waitlist!", "success");
                form.reset();
            } else {
                const data = await response.json();
                showStatus(
                    data.errors?.[0]?.message ||
                    "❌ Something went wrong. Please try again.",
                    "error"
                );
            }
        } catch (error) {
            console.error(error);
            showStatus("❌ Network error. Please try again.", "error");
        }
    });

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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