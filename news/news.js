/**
 * news.js
 * News & Articles page — Vanilla JS
 * Subscribes to wc events, handles article interactions
 */

(function () {
    'use strict';

    // ── Wait for DOM ──────────────────────────────────────────
    function init() {
        const page = document.querySelector('.news-page');
        if (!page) return;

        bindCards(page);
        bindReadMore(page);
    }

    // ── Card hover interaction ────────────────────────────────
    function bindCards(page) {
        const cards = page.querySelectorAll('.news-card');
        cards.forEach(card => {
            card.addEventListener('click', function () {
                const title = this.querySelector('.news-card__title');
                if (!title) return;

                const payload = {
                    title:    title.textContent.trim(),
                    category: (this.querySelector('.news-card__category') || {}).textContent || '',
                    date:     (this.querySelector('.news-card__date')     || {}).textContent || ''
                };

                wc.log('news:article-click', payload);
                wc.publish('news:article-click', payload);
            });
        });
    }

    // ── Read More links ───────────────────────────────────────
    function bindReadMore(page) {
        page.querySelectorAll('.news-card__link').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                const card    = this.closest('.news-card');
                const title   = card  ? card.querySelector('.news-card__title')    : null;
                const category = card ? card.querySelector('.news-card__category') : null;

                const payload = {
                    title:    title    ? title.textContent.trim()    : '',
                    category: category ? category.textContent.trim() : ''
                };

                wc.log('news:read-more', payload);
                wc.publish('news:read-more', payload);
            });
        });
    }

    // ── Subscribe to wc events ────────────────────────────────
    if (typeof wc !== 'undefined' && typeof wc.subscribe === 'function') {
        wc.subscribe('news:article-click', function (event, data) {
            wc.log('[news] article-click received', data);
        });

        wc.subscribe('news:read-more', function (event, data) {
            wc.log('[news] read-more received', data);
        });
    }

    // ── Init on DOM ready ─────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ── Also re-init when wc-include injects the page ─────────
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function () {
            if (document.querySelector('.news-page')) {
                observer.disconnect();
                init();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

})();
