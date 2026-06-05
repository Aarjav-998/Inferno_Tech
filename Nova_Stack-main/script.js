function toggleContact() {
    let contactInfo = document.getElementById("contact-info");
    contactInfo.classList.toggle("hidden");
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !message) {
            showStatus("⚠️ Please fill out all fields.", "error");
            return;
        }

        if (!validateEmail(email)) {
            showStatus("⚠️ Please enter a valid email address.", "error");
            return;
        }

        showStatus("⏳ Sending message...", "loading");

        let formData = new FormData(form);
        try {
            let response = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: { "Accept": "application/json" }
            });

            if (response.ok) {
                showStatus("✅ Message Sent Successfully!", "success");
                form.reset();
            } else {
                showStatus("❌ Something went wrong. Try again!", "error");
            }
        } catch (error) {
            showStatus("❌ Error sending message.", "error");
        }
    });

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showStatus(message, type) {
        status.innerHTML = message;
        status.style.color = type === "error" ? "red" : type === "success" ? "green" : "orange";
    }
});