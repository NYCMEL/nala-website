/////////////////////////////////////////////////////////////////////////////////
//// INCLUDE HTML 
/////////////////////////////////////////////////////////////////////////////////
class Include extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        const self = this;
        const href = $(this).attr("href");

        // LOADING PLACEHOLDER INSIDE THIS ELEMENT
        $(self).html("<span class='wc-loading-img'></span>");

        if (!href) return;

        const runLoad = () => {
            self.dispatchEvent(new CustomEvent('include:before-load', {
                detail: { href: href, include: self },
                bubbles: true,
                composed: true
            }));

            $.ajax({
                url: href,
                method: "GET",
                dataType: "html",
                success: function (data) {
                    $(self).html(data); // <-- INJECT INSIDE <wc-include> ITSELF

                    self.dispatchEvent(new CustomEvent('include:loaded', {
                        detail: { href: href, include: self },
                        bubbles: true,
                        composed: true
                    }));
                },
                error: function () {
                    $(self).html("wc-include: Page not found: " + href);
                }
            });
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runLoad, { once: true });
        } else {
            runLoad();
        }
    }
}

window.customElements.define('wc-include', Include);
