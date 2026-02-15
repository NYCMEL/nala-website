class AppCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['title', 'subtitle', 'image'];
  }

  connectedCallback() {
    this.render();
    this.bindActions();
  }

  attributeChangedCallback() {
    this.render();
    this.bindActions();
  }

  render() {
    const title = this.getAttribute('title') || '';
    const subtitle = this.getAttribute('subtitle') || '';
    const image = this.getAttribute('image') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 420px;
          font-family: Roboto, Arial, sans-serif;
        }

        .card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,.15);
          display: flex;
          flex-direction: column;
          transition: box-shadow .3s ease;
        }

        .card:hover {
          box-shadow: 0 10px 28px rgba(0,0,0,.25);
        }

        .header {
          display: flex;
          gap: 16px;
          padding: 16px;
          align-items: center;
        }

        .image {
          width: 88px;
          height: 88px;
          border-radius: 4px;
          object-fit: cover;
        }

        .title h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .title p {
          margin: 4px 0 0;
          font-size: .85rem;
          color: #666;
        }

        .content {
          padding: 16px;
	  padding-top:0;
          font-size: .95rem;
        }

        ::slotted(a) {
          color: #6200ee;
          font-weight: 500;
          text-decoration: none;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding: 8px 16px 16px;
	  padding-top:0;
        }

        ::slotted(button) {
          background: transparent;
          border: none;
          color: #6200ee;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
        }

        ::slotted(button:hover) {
          background: rgba(98,0,238,.1);
        }

        @media (max-width: 480px) {
          :host {
            max-width: 100%;
          }
        }
      </style>

      <div class="card">
        <div class="header">
          ${image ? `<img class="image" src="${image}" alt="">` : ''}
          <div class="title">
            <h3>${title}</h3>
            <p>${subtitle}</p>
          </div>
        </div>

        <div class="content">
          <slot></slot>
        </div>

        <div class="actions">
          <slot name="actions"></slot>
        </div>
      </div>
    `;
  }

    bindActions() {
	const slot = this.shadowRoot.querySelector('slot[name="actions"]');
	if (!slot) return;

	const assigned = slot.assignedElements({ flatten: true });

	assigned.forEach(el => {
	    if (!el.dataset.action) return;

	    el.onclick = e => {
		console.log('Card action:', el.dataset.action);

		this.dispatchEvent(new CustomEvent('card-action', {
		    detail: { action: el.dataset.action },
		    bubbles: true,
		    composed: true
		}));
	    };
	});
    }
}

customElements.define('app-card', AppCard);
