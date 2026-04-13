(function () {
    "use strict";

    function initSetPasswordPage() {
        const form = document.getElementById("set-password-form");
        if (!form) return;

        const msg = document.getElementById("msg");
        const pw = document.getElementById("password");
        const pw2 = document.getElementById("password2");
        const token = new URLSearchParams(window.location.search).get("token") || "";

        function showError(text) {
            msg.className = "set-password-msg error";
            msg.textContent = text;
        }

        function showOk(text) {
            msg.className = "set-password-msg ok";
            msg.textContent = text;
        }

        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            msg.className = "set-password-msg";
            msg.textContent = "";

            if (!token) {
                showError("Invalid setup link.");
                return;
            }

            const password = pw.value || "";
            const password2 = pw2.value || "";

            if (password.length < 8) {
                showError("Password must be at least 8 characters.");
                pw.focus();
                return;
            }

            if (password !== password2) {
                showError("Passwords do not match.");
                pw2.focus();
                return;
            }

            try {
                const res = await fetch("../../api/set_password.php", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token, password, password2 })
                });

                const data = await res.json().catch(function () { return {}; });
                if (!res.ok || !data.ok) {
                    showError(data.error || "Could not set password.");
                    return;
                }

                showOk("Password set successfully. You can now log in.");
                setTimeout(function () {
                    window.location.href = "../index.html";
                }, 1500);
            } catch (err) {
                showError("Network error. Please try again.");
            }
        });
    }

    function boot() {
        initSetPasswordPage();
    }

    document.addEventListener("set-password:mounted", boot);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
}());
