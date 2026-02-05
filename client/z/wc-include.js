// Web Component Include Utility
class WCInclude extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const src = this.getAttribute('src');
        if (src) {
            this.loadContent(src);
        }
    }

    async loadContent(src) {
        try {
            const response = await fetch(src);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            this.shadowRoot.innerHTML = html;
            
            // Load styles into shadow DOM
            const link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', 'styles.css');
            this.shadowRoot.insertBefore(link, this.shadowRoot.firstChild);
            
            // Dispatch loaded event
            this.dispatchEvent(new CustomEvent('wc-loaded', { 
                bubbles: true, 
                detail: { src } 
            }));
        } catch (error) {
            console.error('Error loading component:', error);
            this.shadowRoot.innerHTML = `<p style="color: red;">Error loading component: ${error.message}</p>`;
        }
    }

    static get observedAttributes() {
        return ['src'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'src' && oldValue !== newValue && newValue) {
            this.loadContent(newValue);
        }
    }
}

customElements.define('wc-include', WCInclude);
