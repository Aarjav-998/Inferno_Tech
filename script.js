function toggleContact() {
    let contactInfo = document.getElementById("contact-info");
    contactInfo.classList.toggle("hidden");
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");
    const readForm = document.getElementById("message-read-form");
    const messageList = document.getElementById("message-list");
    const updateForm = document.getElementById("message-update-form");
    const updateStatus = document.getElementById("update-status");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();
        const userId = document.getElementById("userId").value.trim();

        if (!name || !email || !message) {
            showStatus("⚠️ Please fill out all fields.", "error");
            return;
        }

        if (!validateEmail(email)) {
            showStatus("⚠️ Please enter a valid email address.", "error");
            return;
        }

        showStatus("⏳ Sending message...", "loading");

        try {
            const apiResponse = await fetch("/api/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message, userId: userId || undefined })
            });
            const data = await apiResponse.json();

            if (apiResponse.ok) {
                const formspreeSent = await sendToFormspree(form.dataset.formspreeUrl, {
                    name,
                    email,
                    message,
                    userId: userId || ""
                });

                showStatus(
                    formspreeSent
                        ? `✅ Message sent and saved! Message ID: ${data.data._id}`
                        : `✅ Message saved! Message ID: ${data.data._id}. Formspree did not receive it.`,
                    formspreeSent ? "success" : "loading"
                );
                form.reset();
            } else {
                showStatus(data.message || "❌ Something went wrong. Try again!", "error");
            }
        } catch (error) {
            showStatus("❌ Error sending message.", "error");
        }
    });

    readForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const userId = document.getElementById("read-user-id").value.trim();

        messageList.innerHTML = `<div class="message-empty">Loading messages...</div>`;

        try {
            const response = await fetch(`/api/message/${encodeURIComponent(userId)}`);
            const data = await response.json();

            if (!response.ok) {
                messageList.innerHTML = `<div class="message-empty message-empty--error">${escapeHtml(data.message || "Could not load messages.")}</div>`;
                return;
            }

            if (!data.messages.length) {
                messageList.innerHTML = `<div class="message-empty">No messages found for that user.</div>`;
                return;
            }

            messageList.innerHTML = data.messages
                .map((item) => `
                    <div class="message-card">
                        <div class="message-card__top">
                            <div>
                                <strong>${escapeHtml(item.name)}</strong>
                                <span>${escapeHtml(item.email)}</span>
                            </div>
                            <small>${formatDate(item.createdAt)}</small>
                        </div>
                        <p>${escapeHtml(item.message)}</p>
                        <button type="button" class="message-id-btn" data-message-id="${escapeHtml(item._id)}">Use ID: ${escapeHtml(item._id)}</button>
                    </div>
                `)
                .join("");
        } catch (error) {
            messageList.innerHTML = `<div class="message-empty message-empty--error">Network error while loading messages.</div>`;
        }
    });

    messageList.addEventListener("click", function (event) {
        const button = event.target.closest(".message-id-btn");
        if (!button) return;

        document.getElementById("update-message-id").value = button.dataset.messageId;
        document.getElementById("update-message-text").focus();
    });

    updateForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const messageId = document.getElementById("update-message-id").value.trim();
        const message = document.getElementById("update-message-text").value.trim();

        updateStatus.textContent = "Updating message...";
        updateStatus.style.color = "orange";

        try {
            const response = await fetch(`/api/notes/${encodeURIComponent(messageId)}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            });
            const data = await response.json();

            if (response.ok) {
                setUpdateStatus("Message updated successfully.", "success");
                updateForm.reset();
            } else {
                setUpdateStatus(data.message || "Could not update message.", "error");
            }
        } catch (error) {
            setUpdateStatus("Network error while updating message.", "error");
        }
    });

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showStatus(message, type) {
        status.innerHTML = message;
        status.style.color = type === "error" ? "red" : type === "success" ? "green" : "orange";
    }

    async function sendToFormspree(url, values) {
        if (!url) return false;

        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const response = await fetch(url, {
            method: "POST",
            body: formData,
            headers: { Accept: "application/json" }
        });

        return response.ok;
    }

    function setUpdateStatus(message, type) {
        updateStatus.textContent = message;
        updateStatus.className = `message-status message-status--${type}`;
    }

    function formatDate(value) {
        if (!value) return "";
        return new Date(value).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
