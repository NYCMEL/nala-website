(function () {
    var STYLE_ID = "nala-mxchat-layout-overrides";
    var MAX_ATTEMPTS = 80;
    var attempts = 0;

    var css = [
        ".chat-container.nala-chat-active {",
        "  min-height: 0 !important;",
        "}",
        ".chat-container.nala-compact-popular .chat-box {",
        "  flex: 0 0 auto !important;",
        "  height: auto !important;",
        "  min-height: 0 !important;",
        "  max-height: 150px !important;",
        "  padding: 10px 10px 0 !important;",
        "  overflow-y: auto !important;",
        "}",
        ".chat-container.nala-compact-popular .bot-message {",
        "  margin-bottom: 8px !important;",
        "}",
        ".chat-container.nala-compact-popular .mxchat-popular-questions {",
        "  margin-top: 8px !important;",
        "  padding-top: 0 !important;",
        "}",
        ".chat-container.nala-compact-popular .mxchat-popular-questions-container {",
        "  max-height: 270px !important;",
        "}",
        ".chat-container.nala-chat-active .chat-box {",
        "  flex: 1 1 auto !important;",
        "  height: auto !important;",
        "  min-height: 0 !important;",
        "  max-height: none !important;",
        "  padding-bottom: 12px !important;",
        "  overflow-y: auto !important;",
        "}",
        ".chat-container.nala-chat-active .mxchat-popular-questions {",
        "  display: none !important;",
        "  height: 0 !important;",
        "  min-height: 0 !important;",
        "  margin: 0 !important;",
        "  padding: 0 !important;",
        "  overflow: hidden !important;",
        "}",
        ".chat-container.nala-chat-active .input-container {",
        "  flex: 0 0 auto !important;",
        "  margin-top: 8px !important;",
        "  margin-bottom: 10px !important;",
        "}"
    ].join("\n");

    function isVisible(element) {
        if (!element) return false;
        var rect = element.getBoundingClientRect();
        var style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
    }

    function syncCompactState(root) {
        var container = root.querySelector(".chat-container");
        var wrapper = root.querySelector(".mxchat-chatbot-wrapper");
        var chatbot = root.querySelector(".mxchat-chatbot");
        var hasUserMessages = !!(container && container.querySelector(".user-message"));
        var popular = root.querySelector(".mxchat-popular-questions");
        var hasQuestions = !!(popular && popular.querySelector(".mxchat-popular-question"));

        if (container) {
            container.classList.toggle("nala-chat-active", hasUserMessages);
            container.classList.toggle("nala-compact-popular", !hasUserMessages && hasQuestions && isVisible(popular));
        }

        if (wrapper) wrapper.classList.toggle("nala-chat-active", hasUserMessages);
        if (chatbot) chatbot.classList.toggle("nala-chat-active", hasUserMessages);
    }

    function applyOverrides() {
        attempts += 1;

        var host = document.getElementById("mxchat-embed-host");
        var root = host && host.shadowRoot;

        if (!root) {
            if (attempts < MAX_ATTEMPTS) window.setTimeout(applyOverrides, 250);
            return;
        }

        if (!root.getElementById(STYLE_ID)) {
            var style = document.createElement("style");
            style.id = STYLE_ID;
            style.textContent = css;
            root.appendChild(style);
        }

        syncCompactState(root);

        var observer = new MutationObserver(function () {
            syncCompactState(root);
        });

        observer.observe(root, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", applyOverrides, { once: true });
    } else {
        applyOverrides();
    }
})();
