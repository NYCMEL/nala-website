/* NALA light/dark color mode */
(function (window, document) {
    "use strict";

    var STORAGE_KEY = "nala_theme";
    var root = document.documentElement;

    function systemTheme() {
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    function storedTheme() {
        try {
            var value = window.localStorage.getItem(STORAGE_KEY);
            return value === "dark" || value === "light" ? value : null;
        } catch (e) {
            return null;
        }
    }

    function currentTheme() {
        return root.getAttribute("data-theme") || storedTheme() || systemTheme();
    }

    function updateControls(theme) {
        document.querySelectorAll(".nala-theme-toggle").forEach(function (button) {
            var isDark = theme === "dark";
            button.setAttribute("aria-pressed", isDark ? "true" : "false");
            button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
            button.setAttribute("title", isDark ? "Light mode" : "Dark mode");
            var icon = button.querySelector("i");
            if (icon) icon.className = isDark ? "fa fa-sun-o" : "fa fa-moon-o";
        });
    }

    function applyTheme(theme, persist) {
        theme = theme === "dark" ? "dark" : "light";
        root.setAttribute("data-theme", theme);
        if (persist !== false) {
            try { window.localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
        }
        updateControls(theme);
        document.dispatchEvent(new CustomEvent("nala:theme-changed", { detail: { theme: theme } }));
        return theme;
    }

    function toggleTheme() {
        return applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
    }

    function bindControls() {
        document.querySelectorAll(".nala-theme-toggle").forEach(function (button) {
            if (button.dataset.themeBound === "1") return;
            button.dataset.themeBound = "1";
            button.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                toggleTheme();
            });
        });
        updateControls(currentTheme());
    }

    window.nalaTheme = {
        get: currentTheme,
        set: function (theme) { return applyTheme(theme, true); },
        toggle: toggleTheme
    };

    applyTheme(storedTheme() || systemTheme(), false);

    document.addEventListener("include:loaded", function () { setTimeout(bindControls, 0); });
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bindControls);
    } else {
        bindControls();
    }
}(window, document));
