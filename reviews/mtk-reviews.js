class MtkReviews {
  constructor(root, config) {
    this.root = root;
    this.config = config || {};
    this.labels = this.config.labels || {};
    this.events = this.config.events || { publish: {}, subscribe: [] };
    this.state = {
      name: this.config.defaults?.name || "",
      rating: Number(this.config.defaults?.rating || 0),
      review: this.config.defaults?.review || ""
    };
    this.previewRating = 0;
    this.isPublishing = false;
    this.onMessage = this.onMessage.bind(this);
    this._init();
  }

  _init() {
    this._subscribe();
    this._render();
    this._bind();
    this._publish(this.events.publish.ready || "mtk-reviews:ready", {
      component: this.config.component || "mtk-reviews",
      version: this.config.version || "1.0.1"
    });
  }

  _subscribe() {
    const list = Array.isArray(this.events.subscribe) ? this.events.subscribe : [];
    list.forEach((eventName) => {
      if (window.wc && typeof window.wc.subscribe === "function") {
        window.wc.subscribe(eventName, this.onMessage);
      }
    });
  }

  onMessage(eventName, data) {
    if (this.isPublishing) return;

    if (eventName === "4-mtk-reviews:reset" || eventName === "4-mtk-reviews") {
      if (data && data.action === "reset") {
        this._reset();
      }
    }

    if (eventName === "4-mtk-reviews:set-data" && data) {
      this.state = {
        ...this.state,
        ...data,
        rating: Number(data.rating ?? this.state.rating)
      };
      this.previewRating = 0;
      this._render();
    }
  }

  _publish(eventName, data) {
    this.isPublishing = true;

    if (window.wc && typeof window.wc.log === "function") {
      window.wc.log(eventName, data);
    } else {
      console.log(eventName, data);
    }

    if (window.wc && typeof window.wc.publish === "function") {
      window.wc.publish(eventName, data);
    }

    this.isPublishing = false;
  }

  _render() {
    const selected = this.previewRating || this.state.rating;

    this.root.innerHTML = `
      <section class="mtk-reviews__card" aria-labelledby="mtk-reviews-title">
        <div class="mtk-reviews__icon" aria-hidden="true">
          <span class="material-icons">${this._escape(this.config.icon || "rate_review")}</span>
        </div>

        <h2 class="mtk-reviews__title" id="mtk-reviews-title">
          ${this._escape(this.labels.title || "Leave a Review")}
        </h2>

        <p class="mtk-reviews__subtitle">
          ${this._escape(this.labels.subtitle || "")}
        </p>

        <form class="mtk-reviews__form" novalidate>
          <div class="mtk-reviews__field">
            <label class="mtk-reviews__label" for="mtk-reviews-name">
              ${this._escape(this.labels.nameLabel || "Your name")}
              <span class="mtk-reviews__required">${this._escape(this.labels.requiredText || "Required")}</span>
            </label>
            <input
              class="mtk-reviews__input"
              id="mtk-reviews-name"
              name="name"
              type="text"
              autocomplete="name"
              placeholder="${this._escape(this.labels.namePlaceholder || "")}"
              value="${this._escape(this.state.name)}"
              required
            >
          </div>

          <fieldset class="mtk-reviews__field">
            <legend class="mtk-reviews__label">
              ${this._escape(this.labels.ratingLabel || "Your rating")}
              <span class="mtk-reviews__required">${this._escape(this.labels.requiredText || "Required")}</span>
            </legend>

            <div class="mtk-reviews__stars" role="radiogroup" aria-label="${this._escape(this.labels.ratingLabel || "Your rating")}">
              ${[1, 2, 3, 4, 5].map((value) => `
                <button
                  class="mtk-reviews__star${value <= selected ? " is-selected" : ""}"
                  type="button"
                  role="radio"
                  aria-checked="${this.state.rating === value ? "true" : "false"}"
                  aria-label="${value} star${value === 1 ? "" : "s"}"
                  data-action="set-rating"
                  data-rating="${value}"
                >
                  <span class="material-icons" aria-hidden="true">star</span>
                </button>
              `).join("")}
            </div>
          </fieldset>

          <div class="mtk-reviews__field">
            <label class="mtk-reviews__label" for="mtk-reviews-review">
              ${this._escape(this.labels.reviewLabel || "Review")}
              <span class="mtk-reviews__required">${this._escape(this.labels.requiredText || "Required")}</span>
            </label>
            <textarea
              class="mtk-reviews__textarea"
              id="mtk-reviews-review"
              name="review"
              placeholder="${this._escape(this.labels.reviewPlaceholder || "")}"
              required
            >${this._escape(this.state.review)}</textarea>
          </div>

          <div class="mtk-reviews__actions">
            <button class="mtk-reviews__submit" type="submit">
              <span class="material-icons" aria-hidden="true">send</span>
              <span>${this._escape(this.labels.submitLabel || "Submit Review")}</span>
            </button>
            <p class="mtk-reviews__message" aria-live="polite"></p>
          </div>
        </form>
      </section>
    `;
  }

  _bind() {
    this.root.addEventListener("click", (event) => {
      const star = event.target.closest("[data-action='set-rating']");
      if (!star || !this.root.contains(star)) return;

      this.state.rating = Number(star.getAttribute("data-rating")) || 0;
      this.previewRating = 0;
      this._syncStateFromFields();
      this._render();

      this._publish(this.events.publish.ratingChange || "mtk-reviews:rating-change", {
        rating: this.state.rating
      });
    });

    this.root.addEventListener("mouseover", (event) => {
      const star = event.target.closest("[data-action='set-rating']");
      if (!star || !this.root.contains(star)) return;
      this.previewRating = Number(star.getAttribute("data-rating")) || 0;
      this._updateStars();
    });

    this.root.addEventListener("mouseleave", () => {
      this.previewRating = 0;
      this._updateStars();
    });

    this.root.addEventListener("input", (event) => {
      if (!this.root.contains(event.target)) return;
      this._syncStateFromFields();
    });

    this.root.addEventListener("keydown", (event) => {
      const star = event.target.closest("[data-action='set-rating']");
      if (!star || !this.root.contains(star)) return;

      if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        event.preventDefault();
        this._setRatingByKeyboard(Math.min(5, this.state.rating + 1 || 1));
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        event.preventDefault();
        this._setRatingByKeyboard(Math.max(1, this.state.rating - 1 || 1));
      }

      if (event.key === "Home") {
        event.preventDefault();
        this._setRatingByKeyboard(1);
      }

      if (event.key === "End") {
        event.preventDefault();
        this._setRatingByKeyboard(5);
      }
    });

    this.root.addEventListener("submit", (event) => {
      event.preventDefault();
      this._submit();
    });
  }

  _setRatingByKeyboard(value) {
    this.state.rating = value;
    this.previewRating = 0;
    this._syncStateFromFields();
    this._render();

    const next = this.root.querySelector(`[data-rating="${value}"]`);
    if (next) next.focus();

    this._publish(this.events.publish.ratingChange || "mtk-reviews:rating-change", {
      rating: this.state.rating
    });
  }

  _syncStateFromFields() {
    const name = this.root.querySelector("[name='name']");
    const review = this.root.querySelector("[name='review']");

    if (name) this.state.name = name.value;
    if (review) this.state.review = review.value;
  }

  _updateStars() {
    const selected = this.previewRating || this.state.rating;
    this.root.querySelectorAll("[data-action='set-rating']").forEach((star) => {
      const value = Number(star.getAttribute("data-rating")) || 0;
      star.classList.toggle("is-selected", value <= selected);
      star.setAttribute("aria-checked", this.state.rating === value ? "true" : "false");
    });
  }

  _submit() {
    this._syncStateFromFields();

    const message = this.root.querySelector(".mtk-reviews__message");
    const isValid = this.state.name.trim() && this.state.rating > 0 && this.state.review.trim();

    if (!isValid) {
      if (message) {
        message.textContent = this.labels.errorText || "Please complete the form.";
        message.classList.add("is-error");
      }
      return;
    }

    const payload = {
      name: this.state.name.trim(),
      rating: this.state.rating,
      review: this.state.review.trim(),
      submittedAt: new Date().toISOString()
    };

    this._publish(this.events.publish.submit || "mtk-reviews:submit", payload);

    if (message) {
      message.textContent = this.labels.successText || "Thank you.";
      message.classList.remove("is-error");
    }
  }

  _reset() {
    this.state = {
      name: this.config.defaults?.name || "",
      rating: Number(this.config.defaults?.rating || 0),
      review: this.config.defaults?.review || ""
    };
    this.previewRating = 0;
    this._render();
  }

  _escape(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  static initWhenReady() {
    const start = () => {
      const roots = Array.from(document.querySelectorAll("mtk-reviews.mtk-reviews"));
      let initialized = false;

      roots.forEach((root) => {
        if (!root || root.dataset.mtkReviewsReady === "true") return;

        root.dataset.mtkReviewsReady = "true";
        root.__mtkReviewsInstance = new MtkReviews(root, window.MTK_REVIEWS_CONFIG || {});
        initialized = true;
      });

      return initialized;
    };

    start();

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", start, { once: true });
    }

    if (!window.__mtkReviewsObserver) {
      window.__mtkReviewsObserver = new MutationObserver(start);
      window.__mtkReviewsObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  }
}

MtkReviews.initWhenReady();
