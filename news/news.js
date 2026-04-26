/**
 * news.js
 * Renders news cards from NEWS_CONFIG and handles article detail view.
 * "Read More" replaces the grid with the full article + Back button.
 */

(function () {
    'use strict';

    function init() {
        const page = document.querySelector('.news-page');
        if (!page) return;
        if (page.dataset.newsInit === '1') return;
        page.dataset.newsInit = '1';

        const config = (typeof window.NEWS_CONFIG !== 'undefined') ? window.NEWS_CONFIG : null;
        if (!config) {
            console.error('[news] NEWS_CONFIG not found.');
            return;
        }

        renderGrid(page, config);
    }

    function renderGrid(page, config) {
        const grid = page.querySelector('#newsGrid');
        if (!grid) return;

        grid.innerHTML = config.articles.map(article => `
            <article class="news-card" data-article-id="${article.id}">
                <div class="news-card__image">
                    <span class="material-icons" aria-hidden="true">${article.icon}</span>
                </div>
                <div class="news-card__body">
                    <span class="news-card__category">${article.category}</span>
                    <h2 class="news-card__title">${article.title}</h2>
                    <p class="news-card__excerpt">${article.excerpt}</p>
                    <div class="news-card__meta">
                        <span class="news-card__date"><i class="fa fa-calendar"></i> ${article.date}</span>
                        <a href="#" class="news-card__link" data-article-id="${article.id}">Read More <i class="fa fa-arrow-right"></i></a>
                    </div>
                </div>
            </article>
        `).join('');

        bindReadMore(grid, page, config);

        wc.log('news:grid-rendered', { count: config.articles.length });
        wc.publish('news:grid-rendered', { count: config.articles.length });
    }

    function bindReadMore(grid, page, config) {
        grid.querySelectorAll('.news-card__link').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const id = this.dataset.articleId;
                const article = config.articles.find(a => a.id === id);
                if (article) showArticle(page, config, article);
            });
        });
    }

    function showArticle(page, config, article) {
        const container = page.querySelector('.container-fluid, .container');
        if (!container) return;

        if (!page.dataset.gridHtml) {
            page.dataset.gridHtml = page.innerHTML;
        }

        page.innerHTML = `
            <link href="news/news.css" rel="stylesheet">
            <div class="container" style="max-width:800px;margin:0 auto;padding:24px 16px">
                <div class="news-article">
                    <button class="news-article__back" id="newsBackBtn">
                        <i class="fa fa-arrow-left"></i> Back to News
                    </button>
                    <div class="news-article__header">
                        <span class="news-card__category">${article.category}</span>
                        <h1 class="news-article__title">${article.title}</h1>
                        <p class="news-article__date"><i class="fa fa-calendar"></i> ${article.date}</p>
                    </div>
                    <div class="news-article__body">
                        ${article.body}
                    </div>
                </div>
            </div>
        `;

        page.querySelector('#newsBackBtn').addEventListener('click', () => showGrid(page, config));
        window.scrollTo({ top: 0, behavior: 'smooth' });

        wc.log('news:article-open', { id: article.id, title: article.title });
        wc.publish('news:article-open', { id: article.id, title: article.title });
    }

    function showGrid(page, config) {
        if (!page.dataset.gridHtml) return;

        page.innerHTML = page.dataset.gridHtml;
        delete page.dataset.gridHtml;

        const grid = page.querySelector('#newsGrid');
        if (grid) bindReadMore(grid, page, config);
        // Re-trigger distribution
        if (typeof wc !== 'undefined') wc.publish('news:grid-rendered', {});

        window.scrollTo({ top: 0, behavior: 'smooth' });
        wc.log('news:grid-restored', {});
        wc.publish('news:grid-restored', {});
    }

    if (typeof wc !== 'undefined' && typeof wc.subscribe === 'function') {
        wc.subscribe('news:article-open',  (e, d) => wc.log('[news] article-open',  d));
        wc.subscribe('news:grid-rendered', (e, d) => wc.log('[news] grid-rendered', d));
        wc.subscribe('news:grid-restored', (e, d) => wc.log('[news] grid-restored', d));
    }

    function tryInit() {
        if (document.querySelector('.news-page')) { init(); return true; }
        return false;
    }

    if (!tryInit()) {
        const obs = new MutationObserver(() => { if (tryInit()) obs.disconnect(); });
        obs.observe(document.body, { childList: true, subtree: true });
    }

})();
