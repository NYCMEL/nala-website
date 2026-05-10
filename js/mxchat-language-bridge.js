(function () {
    "use strict";

    var LOADER_BASE = "https://nalanetwork.com/wp-json/mxchat-embed/v1/loader.js";
    var LOADER_KEY = "G9N61FC4MEplohp2CNRIQacbMkkjG32K";
    var LOADER_ID = "nala-mxchat-loader";

    function currentLang() {
        try {
            var lang = window.i18n && typeof window.i18n.getLang === "function"
                ? window.i18n.getLang()
                : (localStorage.getItem("nala_lang") || document.documentElement.lang || "en");
            return lang === "es" ? "es" : "en";
        } catch (e) {
            return "en";
        }
    }

    function currentPageUrl(lang) {
        try {
            var url = new URL(window.location.href);
            url.searchParams.set("lang", lang || currentLang());
            return url.toString();
        } catch (e) {
            return window.location.href;
        }
    }

    function syncPageLanguage(lang) {
        lang = lang === "es" ? "es" : "en";
        window.nalaMxChatLanguage = lang;
        document.documentElement.setAttribute("lang", lang);

        try {
            localStorage.setItem("nala_lang", lang);
        } catch (e) {}

        try {
            var url = new URL(window.location.href);
            if (url.searchParams.get("lang") !== lang) {
                url.searchParams.set("lang", lang);
                window.history.replaceState(window.history.state, "", url.toString());
            }
        } catch (e) {}
    }

    function isMxChatUrl(url) {
        return /\/wp-json\/mxchat|mxchat/i.test(String(url || ""));
    }

    function mxChatUrl(url, lang) {
        try {
            var parsed = new URL(String(url), window.location.href);
            if (isMxChatUrl(parsed.href)) {
                parsed.searchParams.set("site_lang", lang);
                parsed.searchParams.set("lang", lang);
                parsed.searchParams.set("nala_lang", lang);
                parsed.searchParams.set("current_page_url", currentPageUrl(lang));
            }
            return parsed.toString();
        } catch (e) {
            return url;
        }
    }

    function patchBody(body, lang) {
        if (!body) return body;

        if (body instanceof FormData) {
            body.set("site_lang", lang);
            body.set("lang", lang);
            body.set("nala_lang", lang);
            body.set("current_page_url", currentPageUrl(lang));
            return body;
        }

        if (body instanceof URLSearchParams) {
            body.set("site_lang", lang);
            body.set("lang", lang);
            body.set("nala_lang", lang);
            body.set("current_page_url", currentPageUrl(lang));
            return body;
        }

        if (typeof body === "string") {
            var trimmed = body.trim();
            if (trimmed.charAt(0) === "{") {
                try {
                    var json = JSON.parse(body);
                    json.site_lang = lang;
                    json.lang = lang;
                    json.nala_lang = lang;
                    json.current_page_url = currentPageUrl(lang);
                    return JSON.stringify(json);
                } catch (e) {
                    return body;
                }
            }

            if (trimmed.indexOf("=") !== -1) {
                try {
                    return patchBody(new URLSearchParams(body), lang).toString();
                } catch (e) {
                    return body;
                }
            }
        }

        return body;
    }

    function requestInitFromRequest(request, body) {
        return {
            method: request.method,
            headers: new Headers(request.headers),
            body: body,
            mode: request.mode,
            credentials: request.credentials,
            cache: request.cache,
            redirect: request.redirect,
            referrer: request.referrer,
            referrerPolicy: request.referrerPolicy,
            integrity: request.integrity,
            keepalive: request.keepalive,
            signal: request.signal
        };
    }

    function patchFetch() {
        if (window.__nalaMxChatFetchLanguagePatch || !window.fetch) return;

        window.__nalaMxChatFetchLanguagePatch = true;
        var originalFetch = window.fetch.bind(window);

        window.fetch = function (input, init) {
            var lang = currentLang();
            syncPageLanguage(lang);

            try {
                var requestUrl = input instanceof Request ? input.url : String(input || "");
                if (!isMxChatUrl(requestUrl)) {
                    return originalFetch(input, init);
                }

                var patchedUrl = mxChatUrl(requestUrl, lang);

                if (input instanceof Request && !init) {
                    return input.clone().text().then(function (text) {
                        var patchedBody = /^(GET|HEAD)$/i.test(input.method) ? undefined : patchBody(text, lang);
                        return originalFetch(new Request(patchedUrl, requestInitFromRequest(input, patchedBody)));
                    }).catch(function () {
                        return originalFetch(mxChatUrl(input.url, lang), input);
                    });
                }

                init = init || {};
                init.body = patchBody(init.body, lang);
                return originalFetch(patchedUrl, init);
            } catch (e) {
                return originalFetch(input, init);
            }
        };
    }

    function loaderSrc(lang) {
        var url = new URL(LOADER_BASE);
        url.searchParams.set("key", LOADER_KEY);
        url.searchParams.set("lang", lang);
        url.searchParams.set("site_lang", lang);
        url.searchParams.set("current_page_url", currentPageUrl(lang));
        url.searchParams.set("_", String(Date.now()));
        return url.toString();
    }

    function removeExistingChat() {
        var host = document.getElementById("mxchat-embed-host");
        if (host && host.parentNode) host.parentNode.removeChild(host);

        document.querySelectorAll("script[data-nala-mxchat-loader='1']").forEach(function (script) {
            if (script.parentNode) script.parentNode.removeChild(script);
        });
    }

    function loadChat(lang, options) {
        lang = lang === "es" ? "es" : "en";
        syncPageLanguage(lang);
        patchFetch();

        if (options && options.reload) {
            removeExistingChat();
        } else if (document.getElementById(LOADER_ID)) {
            return;
        }

        var script = document.createElement("script");
        script.id = LOADER_ID;
        script.setAttribute("data-nala-mxchat-loader", "1");
        script.src = loaderSrc(lang);
        script.async = true;
        document.head.appendChild(script);
    }

    window.nalaMxChatBridge = {
        currentLang: currentLang,
        load: loadChat,
        sync: function () { syncPageLanguage(currentLang()); },
        reload: function () { loadChat(currentLang(), { reload: true }); }
    };

    syncPageLanguage(currentLang());
    patchFetch();

    document.addEventListener("i18n:changed", function (event) {
        var lang = event && event.detail && event.detail.lang ? event.detail.lang : currentLang();
        window.setTimeout(function () {
            loadChat(lang, { reload: true });
        }, 50);
    });
}());
