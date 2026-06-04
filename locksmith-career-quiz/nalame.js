(function () {
  'use strict';

  class MtkNalame {
    constructor(root) {
      this.root = root;
      this.config = window.NalameConfig || {};
      this.app = this.config.app || {};
      this.questions = Array.isArray(this.config.questions) ? this.config.questions : [];
      this.questionMedia = this.config.questionMedia || {};
      this.currentIndex = 0;
      this.answers = {};
      this.theme = this.app.defaultTheme === 'dark' ? 'dark' : 'light';
      this.statusText = '';
      this.isTransitioning = false;
      this.transitionDuration = 650;
      this.transitionActive = false;
      this.transitionDirection = 'next';
      this.onMessage = this.onMessage.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleKeydown = this.handleKeydown.bind(this);
      this.init();
    }

    init() {
      if (!this.root || this.root.dataset.nalameInitialized === 'true') {
        return;
      }

      this.root.dataset.nalameInitialized = 'true';
      this.root.setAttribute('data-theme', this.theme);
      this.root.addEventListener('click', this.handleClick);
      this.root.addEventListener('change', this.handleChange);
      this.root.addEventListener('keydown', this.handleKeydown);

      if (window.wc && typeof window.wc.subscribe === 'function') {
        window.wc.subscribe('4-nalame', this.onMessage);
      }

      this.render();
      this.publish('nalame:ready', {
        totalQuestions: this.questions.length,
        theme: this.theme
      });
    }

    onMessage(message) {
      if (!message || typeof message !== 'object') {
        return;
      }

      const action = message.action || message.type;

      switch (action) {
        case 'goToQuestion':
          this.goToQuestion(Number(message.index));
          break;
        case 'setTheme':
          this.setTheme(message.theme);
          break;
        case 'restart':
          this.restart();
          break;
        case 'next':
          this.next();
          break;
        case 'previous':
          this.previous();
          break;
        case 'skip':
          this.skip();
          break;
        default:
          break;
      }
    }

    handleClick(event) {
      if (this.isTransitioning) {
        return;
      }

      const actionTarget = event.target.closest('[data-nalame-action]');
      if (!actionTarget) {
        return;
      }

      const action = actionTarget.getAttribute('data-nalame-action');

      switch (action) {
        case 'theme-light':
          this.setTheme('light');
          break;
        case 'theme-dark':
          this.setTheme('dark');
          break;
        case 'previous':
          this.previous();
          break;
        case 'next':
          this.next();
          break;
        case 'skip':
          this.skip();
          break;
        case 'restart':
          this.restart();
          break;
        default:
          break;
      }
    }

    handleChange(event) {
      if (this.isTransitioning) {
        return;
      }

      const input = event.target.closest('[data-nalame-answer]');
      if (!input) {
        return;
      }

      const question = this.getCurrentQuestion();
      const selectedAnswer = this.findAnswer(question, input.value);

      if (!question || !selectedAnswer) {
        return;
      }

      this.answers[question.id] = selectedAnswer.id;
      this.statusText = '';
      this.publish('nalame:answerSelected', {
        questionId: question.id,
        answerId: selectedAnswer.id,
        answerText: selectedAnswer.text,
        index: this.currentIndex
      });
      this.render();
    }

    handleKeydown(event) {
      if (this.isTransitioning || event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.next();
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.previous();
      }
    }

    getCurrentQuestion() {
      return this.questions[this.currentIndex] || null;
    }

    findAnswer(question, answerId) {
      if (!question || !Array.isArray(question.answers)) {
        return null;
      }

      return question.answers.find((answer) => answer.id === answerId) || null;
    }

    setTheme(theme) {
      const safeTheme = theme === 'dark' ? 'dark' : 'light';
      this.theme = safeTheme;
      this.root.setAttribute('data-theme', safeTheme);
      this.publish('nalame:themeChanged', { theme: safeTheme });
      this.render();
    }

    goToQuestion(index) {
      if (!Number.isInteger(index) || index < 0 || index > this.questions.length || index === this.currentIndex || this.isTransitioning) {
        return;
      }

      this.fadeTo(index, index > this.currentIndex ? 'next' : 'previous');
    }

    next() {
      if (this.currentIndex >= this.questions.length || this.isTransitioning) {
        return;
      }

      this.fadeTo(this.currentIndex + 1, 'next');
    }

    previous() {
      if (this.currentIndex <= 0 || this.isTransitioning) {
        return;
      }

      this.fadeTo(this.currentIndex - 1, 'previous');
    }

    fadeTo(targetIndex, direction) {
      if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex > this.questions.length || this.isTransitioning) {
        return;
      }

      this.isTransitioning = true;
      this.transitionDirection = direction === 'previous' ? 'previous' : 'next';
      this.currentIndex = targetIndex;
      this.transitionActive = true;

      this.publish(this.transitionDirection === 'previous' ? 'nalame:previous' : 'nalame:next', {
        index: this.currentIndex,
        complete: this.currentIndex >= this.questions.length,
        questionId: this.getCurrentQuestion() ? this.getCurrentQuestion().id : ''
      });

      this.render();

      window.setTimeout(() => {
        this.transitionActive = false;
        this.isTransitioning = false;
        this.render();
      }, this.transitionDuration);
    }

    skip() {
      const question = this.getCurrentQuestion();

      if (question) {
        this.answers[question.id] = '';
        this.publish('nalame:skipped', {
          questionId: question.id,
          index: this.currentIndex
        });
      }

      this.next();
    }

    restart() {
      this.currentIndex = 0;
      this.answers = {};
      this.statusText = '';
      this.transitionActive = false;
      this.isTransitioning = false;
      this.publish('nalame:restart', {
        totalQuestions: this.questions.length
      });
      this.render();
    }

    publish(type, detail) {
      const payload = {
        source: 'nalame',
        type,
        detail: detail || {},
        timestamp: new Date().toISOString()
      };

      if (window.wc && typeof window.wc.log === 'function') {
        window.wc.log('nalame publish', payload);
      }

      if (window.wc && typeof window.wc.publish === 'function') {
        window.wc.publish(type, payload);
      }
    }

    updateStatus() {
      const status = this.root.querySelector('[data-nalame-status]');
      if (status) {
        status.textContent = this.statusText || '';
      }
    }

    render() {
      this.root.innerHTML = this.template();
      this.updateStatus();
    }

    template() {
      return `
        <div class="nalame__shell">
          ${this.progressTemplate()}
          ${this.headerTemplate()}
          <main class="nalame__main">
            ${this.screenStackTemplate()}
          </main>
          <div class="nalame__sr-only" aria-live="polite" data-nalame-status>${this.escape(this.statusText || '')}</div>
        </div>
      `;
    }

    progressTemplate() {
      const completed = this.questions.length ? Math.min(this.currentIndex, this.questions.length) : 0;
      const progress = this.questions.length ? (completed / this.questions.length) * 100 : 0;

      return `
        <div class="nalame__progress-wrap" aria-label="${this.escape(this.app.progressLabel)} ${completed} of ${this.questions.length}">
          <span class="nalame__progress-track" aria-hidden="true">
            <span class="nalame__progress-bar" style="width: ${progress}%"></span>
          </span>
        </div>
      `;
    }

    screenStackTemplate() {
      const directionClass = this.transitionDirection === 'previous' ? 'nalame__screen-track--fade-lift-back' : 'nalame__screen-track--fade-lift';

      return `
        <div class="nalame__screen-viewport">
          <div class="nalame__screen-track ${this.transitionActive ? directionClass : ''}">
            <div class="nalame__screen">
              ${this.contentTemplate(this.currentIndex)}
            </div>
          </div>
        </div>
      `;
    }

    contentTemplate(index) {
      if (index >= this.questions.length) {
        return this.summaryTemplate();
      }

      return this.questionTemplate(index);
    }

    headerTemplate() {
      return `
        <header class="nalame__header">
          <div class="nalame__brand">
            <span class="nalame__eyebrow">${this.escape(this.app.eyebrow)}</span>
            <h1 class="nalame__title">${this.escape(this.app.title)}</h1>
          </div>
          <div class="nalame__theme" role="group" aria-label="${this.escape(this.app.modeLabel)}">
            <button class="nalame__theme-button" type="button" data-nalame-action="theme-light" aria-pressed="${this.theme === 'light'}">${this.escape(this.app.lightLabel)}</button>
            <button class="nalame__theme-button" type="button" data-nalame-action="theme-dark" aria-pressed="${this.theme === 'dark'}">${this.escape(this.app.darkLabel)}</button>
          </div>
        </header>
      `;
    }

    questionTemplate(index) {
      const questionIndex = Number.isInteger(index) ? index : this.currentIndex;
      const question = this.questions[questionIndex] || this.getCurrentQuestion();
      const currentAnswer = question ? this.answers[question.id] || '' : '';
      const isLast = questionIndex === this.questions.length - 1;

      return `
        <section class="nalame__card nalame__card--quiz" aria-labelledby="nalame-question-title">
          ${this.questionImageTemplate(question)}
          <h2 class="nalame__question" id="nalame-question-title">${this.escape(question ? question.text : '')}</h2>
          <fieldset class="nalame__answers" aria-label="${this.escape(this.app.answerGroupLabel)}">
            <legend class="nalame__sr-only">${this.escape(this.app.answerGroupLabel)}</legend>
            ${question && Array.isArray(question.answers) ? question.answers.map((answer) => this.answerTemplate(question, answer, currentAnswer)).join('') : ''}
          </fieldset>
          <div class="nalame__actions" aria-label="Quiz navigation">
            <button class="nalame__button" type="button" data-nalame-action="previous" ${questionIndex === 0 ? 'disabled' : ''}>&#8249; ${this.escape(this.app.previousLabel)}</button>
            <button class="nalame__button nalame__button--primary" type="button" data-nalame-action="next">${this.escape(isLast ? this.app.completeLabel : this.app.nextLabel)} &#8250;</button>
          </div>
        </section>
      `;
    }

    questionImageTemplate(question) {
      const media = this.questionMedia && question ? this.questionMedia[question.id] : null;

      if (!media || !media.src) {
        return '<figure class="nalame__question-media nalame__question-media--empty" aria-hidden="true"></figure>';
      }

      return `
        <figure class="nalame__question-media">
          <img class="nalame__question-image" src="${this.escape(media.src)}" alt="${this.escape(media.alt || '')}">
        </figure>
      `;
    }

    answerTemplate(question, answer, currentAnswer) {
      const checked = currentAnswer === answer.id ? 'checked' : '';

      return `
        <div class="nalame__answer">
          <input class="nalame__answer-input" type="radio" name="${this.escape(question.id)}" value="${this.escape(answer.id)}" data-nalame-answer ${checked} aria-label="${this.escape(answer.text)}">
          <span class="nalame__answer-label">
            <span class="nalame__answer-check" aria-hidden="true"></span>
            <span class="nalame__answer-text">${this.escape(answer.text)}</span>
          </span>
        </div>
      `;
    }

    summaryTemplate() {
      return `
        <section class="nalame__card nalame__summary" aria-label="${this.escape(this.app.summaryAriaLabel)}">
          <div class="nalame__summary-header">
            <h2 class="nalame__summary-title">${this.escape(this.app.summaryTitle)}</h2>
            <p class="nalame__summary-intro">${this.escape(this.app.summaryIntro)}</p>
          </div>
          <ol class="nalame__summary-list">
            ${this.questions.map((question, index) => this.summaryItemTemplate(question, index)).join('')}
          </ol>
          <div class="nalame__actions">
            <button class="nalame__button nalame__button--primary" type="button" data-nalame-action="restart">${this.escape(this.app.restartLabel)}</button>
          </div>
        </section>
      `;
    }

    summaryItemTemplate(question, index) {
      const answerId = this.answers[question.id] || '';
      const answer = this.findAnswer(question, answerId);
      const answerText = answer ? answer.text : this.app.emptyAnswerLabel;

      return `
        <li class="nalame__summary-item">
          <p class="nalame__summary-question">${index + 1}. ${this.escape(question.text)}</p>
          <p class="nalame__summary-answer">${this.escape(answerText)}</p>
        </li>
      `;
    }

    escape(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    static boot() {
      const roots = document.querySelectorAll('nalame.nalame, .nalame');
      roots.forEach((root) => {
        if (root.tagName && root.tagName.toLowerCase() === 'nalame') {
          new MtkNalame(root);
        }
      });
    }
  }

  window.MtkNalame = MtkNalame;

  const whenReady = () => {
    MtkNalame.boot();

    const observer = new MutationObserver(() => {
      MtkNalame.boot();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', whenReady, { once: true });
  } else {
    whenReady();
  }
}());
