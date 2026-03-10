/**
 * MTK Hierarchy - Material Design Course Hierarchy Component
 * A reusable, accessible hierarchy component with event-driven architecture
 * Uses wc.js library for PubSub and utilities
 */
(function () {

/**
 * MTKHierarchy Class
 * Manages the hierarchy UI, data binding, and event handling
 */
class MTKHierarchy {
    constructor(config) {
        this.config = config;
        this.element = null;
        this.elements = {};
        this.initialized = false;
        this.activeResource = null;
        this.activeQuiz = null;
        this.openModules = new Set();
        this.openLessons = new Set();
        this._vimeoApiLoading = false;
        this._vimeoApiCallbacks = [];

        // Add IDs to items that don't have them
        this.ensureIds();
        this.enforceRegisteredAccessCaps();

        // Bind methods
        this.onMessage = this.onMessage.bind(this);
        this.handleModuleClick = this.handleModuleClick.bind(this);
        this.handleLessonClick = this.handleLessonClick.bind(this);
        this.handleResourceClick = this.handleResourceClick.bind(this);
        this.handleQuizClick = this.handleQuizClick.bind(this);
        this.handleQuizStart = this.handleQuizStart.bind(this);
        this.enableNextModule = this.enableNextModule.bind(this);

        // Wait for DOM to be ready
        this.waitForElement();
    }

    /**
     * Return true if the current logged-in role is registered (unpaid).
     */
    isRegisteredRole() {
        const role = (typeof wc !== 'undefined' && wc.session && wc.session.user && wc.session.user.role)
            ? String(wc.session.user.role).toLowerCase()
            : '';
        return role === 'registered';
    }

    /**
     * Hard-cap registered users to intro + first 3 lessons (lesson_no 0..3)
     * regardless of overly-permissive payloads.
     */
    enforceRegisteredAccessCaps() {
        if (!this.isRegisteredRole()) return;
        if (!this.config || !Array.isArray(this.config)) return;

        this.config.forEach(course => {
            if (!course.modules) return;

            course.modules.forEach(module => {
                let moduleHasAccess = false;

                if (Array.isArray(module.lessons)) {
                    module.lessons.forEach(lesson => {
                        const lessonNo = Number(lesson.lesson_no);
                        const allowed = Number.isFinite(lessonNo) && lessonNo <= 3;

                        lesson.access = allowed;
                        if (allowed) moduleHasAccess = true;

                        if (Array.isArray(lesson.resources)) {
                            lesson.resources.forEach(resource => {
                                resource.access = allowed;
                            });
                        }
                    });
                }

                module.access = moduleHasAccess;
                if (module.quiz) {
                    module.quiz.access = false;
                }
            });
        });

        if (typeof wc !== 'undefined') {
            wc.log('MTKHierarchy: enforced registered access cap (lesson_no <= 3)');
        }
    }

    /**
     * Ensure all items have IDs and types (only fills missing values)
     * IMPORTANT: Uses IDs from JSON input - does NOT create new unique IDs
     * Fallback IDs follow M1, M2, M3 format for modules
     */
    ensureIds() {
        if (!this.config || !Array.isArray(this.config)) return;

        let globalModuleCounter = 1;

        this.config.forEach((course, cIdx) => {
            if (!course.modules) return;

            course.modules.forEach((module, mIdx) => {
                if (!module.id) {
                    module.id = `M${globalModuleCounter}`;
                }
                globalModuleCounter++;

                if (!module.lessons) return;

                module.lessons.forEach((lesson, lIdx) => {
                    if (!lesson.id) {
                        lesson.id = `${module.id}-L${lIdx + 1}`;
                    }

                    if (!lesson.resources) return;

                    lesson.resources.forEach((resource, rIdx) => {
                        if (!resource.id) {
                            resource.id = `${lesson.id}-R${rIdx + 1}`;
                        }

                        if (!resource.type) {
                            resource.type = 'photo';
                        }
                    });
                });

                if (module.quiz && !module.quiz.id) {
                    module.quiz.id = `${module.id}-Quiz`;
                }
            });
        });
    }

    /**
     * Wait for hierarchy element to be available in DOM
     */
    waitForElement() {
        if (typeof wc !== 'undefined') {
            wc.log("MTKHierarchy: Waiting for DOM element...");
        }

        const observer = new MutationObserver((mutations, obs) => {
            this.element = document.querySelector('.mtk-hierarchy');

            if (this.element) {
                if (typeof wc !== 'undefined') {
                    wc.log("MTKHierarchy: Element found via MutationObserver");
                }
                obs.disconnect();
                this.init();
            }
        });

        const checkElement = () => {
            this.element = document.querySelector('.mtk-hierarchy');

            if (this.element) {
                if (typeof wc !== 'undefined') {
                    wc.log("MTKHierarchy: Element found immediately");
                }
                this.init();
            } else {
                if (typeof wc !== 'undefined') {
                    wc.log("MTKHierarchy: Element not found, starting observer...");
                }
                observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true
                });
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', checkElement);
        } else {
            checkElement();
        }
    }

    /**
     * Initialize the hierarchy
     */
    init() {
        if (this.initialized) return;

        if (typeof wc !== 'undefined') {
            wc.group("MTKHierarchy: Initializing");
        }

        this.cacheElements();
        this.subscribeToEvents();
        this.render();
        this.attachEventListeners();

        this.initialized = true;

        if (typeof wc !== 'undefined') {
            wc.groupEnd();
        }

        wc.publish('mtk-hierarchy:initialized', {
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Cache DOM elements for performance
     */
    cacheElements() {
        this.elements = {
            lhs: this.element.querySelector('.mtk-hierarchy-lhs'),
            rhs: this.element.querySelector('.mtk-hierarchy-rhs')
        };

        if (typeof wc !== 'undefined') {
            wc.log("MTKHierarchy: Elements cached", this.elements);
        }
    }

    /**
     * Subscribe to hierarchy events
     */
    subscribeToEvents() {
        this.subscribe('mtk-hierarchy:refresh', this.onMessage);
        this.subscribe('mtk-hierarchy:load-resource', this.onMessage);
        this.subscribe('mtk-hierarchy:expand-all', this.onMessage);
        this.subscribe('mtk-hierarchy:collapse-all', this.onMessage);

        if (typeof wc !== 'undefined') {
            wc.log("MTKHierarchy: Subscribed to events");
        }
    }

    /**
     * Handle incoming messages from event subscriptions
     */
    onMessage(message, data) {
        if (typeof wc !== 'undefined') {
            wc.log("MTKHierarchy: Message received", message, data);
        }

        const { type, payload } = data || {};

        switch (type) {
        case 'refresh':
            this.render();
            break;

        case 'load-resource':
            if (payload && payload.resourceId) {
                this.loadResourceById(payload.resourceId);
            }
            break;

        case 'expand-all':
            this.expandAll();
            break;

        case 'collapse-all':
            this.collapseAll();
            break;

        default:
            if (typeof wc !== 'undefined') {
                wc.warn(`Unknown message type: ${type}`);
            }
        }
    }

    /**
     * Render the hierarchy
     */
    render() {
        if (typeof wc !== 'undefined') {
            wc.group("MTKHierarchy: Rendering");
        }

        this.renderCourses();

        if (typeof wc !== 'undefined') {
            wc.groupEnd();
        }

        wc.publish('mtk-hierarchy:rendered', {
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Render courses
     */
    renderCourses() {
        if (!this.elements.lhs || !this.config || !Array.isArray(this.config)) {
            if (typeof wc !== 'undefined') {
                wc.warn("MTKHierarchy: Cannot render courses - missing element or config");
            }
            return;
        }

        const coursesHTML = this.config.map(course => this.renderCourse(course)).join('');
        this.elements.lhs.innerHTML = coursesHTML;

        if (typeof wc !== 'undefined') {
            wc.log("MTKHierarchy: Courses rendered", this.config.length);
        }
    }

    /**
     * Render a single course
     */
    renderCourse(course) {
        if (!course.modules) return '';

        const modulesHTML = course.modules.map(module => this.renderModule(module)).join('');
        return modulesHTML;
    }

    /**
     * Render modules
     */
    renderModules() {
        this.renderCourses();
    }

    /**
     * Render a single module
     */
    renderModule(module) {
        const disabledClass = !module.access ? 'mtk-module--disabled' : '';
        const isOpen = this.openModules.has(module.id);
        const openClass = isOpen ? 'mtk-module__toggle--open' : '';
        const bodyOpenClass = isOpen ? 'mtk-module__body--open' : '';

        const lessonsHTML = module.lessons ? module.lessons.map(lesson =>
            this.renderLesson(lesson, module.id)
        ).join('') : '';

        const quizHTML = module.quiz ? this.renderQuiz(module.quiz, module.id) : '';

        return `
      <div class="mtk-module ${disabledClass}" data-module-id="${module.id}">
        <div class="mtk-module__header"
             role="button"
             tabindex="0"
             aria-expanded="${isOpen}"
             aria-label="Module: ${this.escapeHtml(module.title)}">
          <span class="material-icons">folder</span>
          <span class="mtk-module__title">${this.escapeHtml(module.title)}</span>
          <span class="mtk-module__toggle ${openClass}">
            <span class="material-icons">expand_more</span>
          </span>
        </div>
        <div class="mtk-module__body ${bodyOpenClass}">
          ${lessonsHTML}
          ${quizHTML}
        </div>
      </div>
    `;
    }

    /**
     * Render a quiz link
     */
    renderQuiz(quiz, moduleId) {
        const disabledClass = !quiz.access ? 'mtk-quiz--disabled' : '';
        const activeClass = this.activeQuiz === quiz.id ? 'mtk-quiz--active' : '';

        return `
      <div class="mtk-quiz ${disabledClass} ${activeClass}"
           data-quiz-id="${quiz.id}"
           data-module-id="${moduleId}"
           role="button"
           tabindex="0"
           aria-label="Quiz: ${this.escapeHtml(quiz.title)}">
        <span class="mtk-quiz__icon material-icons">quiz</span>
        <span class="mtk-quiz__title">${this.escapeHtml(quiz.title)}</span>
        <span class="mtk-quiz__badge material-icons">arrow_forward</span>
      </div>
    `;
    }

    /**
     * Render a single lesson
     */
    renderLesson(lesson, moduleId) {
        const disabledClass = !lesson.access ? 'mtk-lesson--disabled' : '';
        const lessonKey = `${moduleId}-${lesson.id}`;
        const isOpen = this.openLessons.has(lessonKey);
        const openClass = isOpen ? 'mtk-lesson__toggle--open' : '';
        const bodyOpenClass = isOpen ? 'mtk-lesson__body--open' : '';

        const resourcesHTML = lesson.resources ? lesson.resources.map(resource =>
            this.renderResource(resource, moduleId, lesson.id)
        ).join('') : '';

        return `
      <div class="mtk-lesson ${disabledClass}" data-lesson-id="${lesson.id}" data-module-id="${moduleId}">
        <div class="mtk-lesson__header"
             role="button"
             tabindex="0"
             aria-expanded="${isOpen}"
             aria-label="Lesson: ${this.escapeHtml(lesson.title)}">
          <span class="material-icons">folder_open</span>
          <span class="mtk-lesson__title">${this.escapeHtml(lesson.title)}</span>
          <span class="mtk-lesson__toggle ${openClass}">
            <span class="material-icons">expand_more</span>
          </span>
        </div>
        <div class="mtk-lesson__body ${bodyOpenClass}">
          ${resourcesHTML}
        </div>
      </div>
    `;
    }

    /**
     * Render a single resource
     */
    renderResource(resource, moduleId, lessonId) {
        const disabledClass = !resource.access ? 'mtk-resource--disabled' : '';
        const activeClass = this.activeResource === resource.id ? 'mtk-resource--active' : '';

        const icon = resource.type === 'video' ? 'play_circle_outline' : 'image';
        const statusIcon = resource.processed ? '<span class="mtk-resource__status"><span class="material-icons">visibility</span></span>' : '';

        return `
      <div class="mtk-resource ${disabledClass} ${activeClass}"
           data-resource-id="${resource.id}"
           data-lesson-id="${lessonId}"
           data-module-id="${moduleId}"
           role="button"
           tabindex="0"
           aria-label="${resource.type}: ${this.escapeHtml(resource.description)}">
        <span class="mtk-resource__icon material-icons">${icon}</span>
        <span class="mtk-resource__title">${this.escapeHtml(resource.description)}</span>
        ${statusIcon}
      </div>
    `;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        if (!this.elements.lhs) return;

        this.elements.lhs.addEventListener('click', (e) => {
            console.log('📍 LHS Click detected:', e.target);

            const moduleHeader = e.target.closest('.mtk-module__header');
            if (moduleHeader) {
                console.log('→ Module header clicked');
                this.handleModuleClick(e, moduleHeader);
                return;
            }

            const lessonHeader = e.target.closest('.mtk-lesson__header');
            if (lessonHeader) {
                console.log('→ Lesson header clicked');
                this.handleLessonClick(e, lessonHeader);
                return;
            }

            const resource = e.target.closest('.mtk-resource');
            if (resource) {
                console.log('→ Resource clicked, disabled?', resource.classList.contains('mtk-resource--disabled'));
                if (!resource.classList.contains('mtk-resource--disabled')) {
                    this.handleResourceClick(e, resource);
                }
                return;
            }

            const quiz = e.target.closest('.mtk-quiz');
            if (quiz) {
                console.log('→ Quiz element found!');
                console.log('→ Quiz disabled?', quiz.classList.contains('mtk-quiz--disabled'));
                if (!quiz.classList.contains('mtk-quiz--disabled')) {
                    console.log('→ Calling handleQuizClick...');
                    this.handleQuizClick(e, quiz);
                } else {
                    console.log('→ Quiz is disabled, not calling handler');
                }
                return;
            }

            console.log('→ No matching element found');
        });

        this.elements.lhs.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.target.click();
            }
        });

        if (typeof wc !== 'undefined') {
            wc.log("MTKHierarchy: Event listeners attached");
        }
    }

    /**
     * Handle quiz click - delegate to mtk_pager
     */
    handleQuizClick(event, quizElement) {
        let module = $(quizElement).attr("data-module-id");

        // CONSUMED BY QUIZ
        wc.quizModule = module;

        wc.log("handleQuizClick > Module:", module);

        wc.pages.show("quiz");
    }

    /**
     * Handle module header click
     */
    handleModuleClick(event, moduleHeader) {
        const moduleElement = moduleHeader.closest('.mtk-module');

        if (moduleElement.classList.contains('mtk-module--disabled')) {
            if (typeof wc !== 'undefined') {
                wc.warn("MTKHierarchy: Module is disabled (access=false)");
            }
            return;
        }

        const moduleId = moduleElement.dataset.moduleId;

        if (typeof wc !== 'undefined') {
            wc.log("MTKHierarchy: Module clicked", moduleId);
        }

        const isOpen = this.openModules.has(moduleId);
        if (isOpen) {
            this.openModules.delete(moduleId);
        } else {
            this.openModules.add(moduleId);
        }

        const toggle = moduleHeader.querySelector('.mtk-module__toggle');
        const body = moduleElement.querySelector('.mtk-module__body');

        if (isOpen) {
            toggle.classList.remove('mtk-module__toggle--open');
            body.classList.remove('mtk-module__body--open');
            moduleHeader.setAttribute('aria-expanded', 'false');
        } else {
            toggle.classList.add('mtk-module__toggle--open');
            body.classList.add('mtk-module__body--open');
            moduleHeader.setAttribute('aria-expanded', 'true');
        }

        wc.publish('mtk-hierarchy:module-toggled', {
            moduleId,
            isOpen: !isOpen,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Handle lesson header click
     * Accordion behaviour: closes all other open lessons, opens only the selected one.
     */
    handleLessonClick(event, lessonHeader) {
        const lessonElement = lessonHeader.closest('.mtk-lesson');

        if (lessonElement.classList.contains('mtk-lesson--disabled')) {
            if (typeof wc !== 'undefined') {
                wc.warn("MTKHierarchy: Lesson is disabled (access=false)");
            }
            return;
        }

        const moduleId = lessonElement.dataset.moduleId;
        const lessonId = lessonElement.dataset.lessonId;
        const lessonKey = `${moduleId}-${lessonId}`;

        if (typeof wc !== 'undefined') {
            wc.log("MTKHierarchy: Lesson clicked", lessonKey);
        }

        // Capture open state BEFORE we clear
        const isOpen = this.openLessons.has(lessonKey);

        // Close all open lesson DOM elements (except the clicked one)
        const allLessonEls = this.elements.lhs.querySelectorAll('.mtk-lesson');
        allLessonEls.forEach(el => {
            const elLessonId = el.dataset.lessonId;
            const elModuleId = el.dataset.moduleId;
            const elKey = `${elModuleId}-${elLessonId}`;

            if (elKey === lessonKey) return;

            const elToggle = el.querySelector('.mtk-lesson__toggle');
            const elBody   = el.querySelector('.mtk-lesson__body');
            const elHeader = el.querySelector('.mtk-lesson__header');

            if (elToggle) elToggle.classList.remove('mtk-lesson__toggle--open');
            if (elBody)   elBody.classList.remove('mtk-lesson__body--open');
            if (elHeader) elHeader.setAttribute('aria-expanded', 'false');
        });

        // Clear all open lesson state
        this.openLessons.clear();

        // Toggle the clicked lesson
        if (!isOpen) {
            this.openLessons.add(lessonKey);
            this.displayLessonResources(moduleId, lessonId);
            this.enableLessonResources(moduleId, lessonId);
        }

        const toggle = lessonHeader.querySelector('.mtk-lesson__toggle');
        const body   = lessonElement.querySelector('.mtk-lesson__body');

        if (isOpen) {
            toggle.classList.remove('mtk-lesson__toggle--open');
            body.classList.remove('mtk-lesson__body--open');
            lessonHeader.setAttribute('aria-expanded', 'false');
        } else {
            toggle.classList.add('mtk-lesson__toggle--open');
            body.classList.add('mtk-lesson__body--open');
            lessonHeader.setAttribute('aria-expanded', 'true');
        }

        wc.publish('mtk-hierarchy:lesson-toggled', {
            moduleId,
            lessonId,
            isOpen: !isOpen,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Load Vimeo player API once and invoke callback when ready.
     */
    ensureVimeoApi(callback) {
        if (typeof window !== 'undefined' && window.Vimeo && window.Vimeo.Player) {
            callback();
            return;
        }

        this._vimeoApiCallbacks.push(callback);
        if (this._vimeoApiLoading) return;
        this._vimeoApiLoading = true;

        const existing = document.querySelector('script[data-vimeo-player-api="1"]');
        if (existing) return;

        const script = document.createElement('script');
        script.src = 'https://player.vimeo.com/api/player.js';
        script.async = true;
        script.setAttribute('data-vimeo-player-api', '1');

        script.onload = () => {
            this._vimeoApiLoading = false;
            const callbacks = this._vimeoApiCallbacks.slice();
            this._vimeoApiCallbacks = [];
            callbacks.forEach(fn => {
                try { fn(); } catch (e) { wc.warn('MTKHierarchy: Vimeo callback error', e); }
            });
        };

        script.onerror = () => {
            this._vimeoApiLoading = false;
            this._vimeoApiCallbacks = [];
            wc.warn('MTKHierarchy: failed to load Vimeo API');
        };

        document.head.appendChild(script);
    }

    /**
     * Find lesson_no for a resource id.
     */
    findLessonContextForResource(resourceId) {
        if (!this.config || !Array.isArray(this.config)) return null;
        for (const course of this.config) {
            if (!course.modules) continue;
            for (const module of course.modules) {
                if (!module.lessons) continue;
                for (const lesson of module.lessons) {
                    if (!lesson.resources) continue;
                    if (lesson.resources.some(r => r.id === resourceId)) {
                        return {
                            moduleId: module.id,
                            lessonId: lesson.id,
                            lessonNo: Number.isFinite(Number(lesson.lesson_no)) ? Number(lesson.lesson_no) : null
                        };
                    }
                }
            }
        }
        return null;
    }

    /**
     * Advance progress only when the lesson video is fully watched (Vimeo ended).
     */
    attachVideoCompletionTracking(lessonNo, moduleId, lessonId) {
        if (!Number.isFinite(Number(lessonNo))) return;
        if (typeof wc === 'undefined' || typeof wc.lessonComplete !== 'function') return;
        if (!wc.session || !wc.session.user) return;

        const iframe = this.elements && this.elements.rhs
            ? this.elements.rhs.querySelector('.mtk-video-container iframe')
            : null;
        if (!iframe) return;
        if (iframe.dataset.progressBound === '1') return;
        iframe.dataset.progressBound = '1';

        this.ensureVimeoApi(() => {
            if (!(window.Vimeo && window.Vimeo.Player)) return;
            const player = new window.Vimeo.Player(iframe);
            player.on('ended', () => {
                const current = Number(wc.session.user.current_lesson);
                if (!Number.isFinite(current)) return;
                wc.lessonComplete(Number(lessonNo), current, (err, result) => {
                    if (err) {
                        wc.warn('MTKHierarchy: lessonComplete failed on video end', err);
                        return;
                    }
                    if (result && Number.isFinite(Number(result.current_lesson))) {
                        wc.session.user.current_lesson = Number(result.current_lesson);
                    }
                    if (result && result.advanced === true && moduleId && lessonId) {
                        this.enableNextLessonOrQuiz(moduleId, lessonId);
                    }
                    wc.log('MTKHierarchy: video-ended progress sync', {
                        lesson_no: Number(lessonNo),
                        previous_current: current,
                        response: result
                    });
                });
            });
        });
    }

    /**
     * Enable next lesson or quiz link when current lesson is clicked
     */
    enableNextLessonOrQuiz(moduleId, lessonId) {
        const role = (wc && wc.session && wc.session.user && wc.session.user.role)
            ? String(wc.session.user.role).toLowerCase()
            : '';
        if (role === 'registered') {
            if (typeof wc !== 'undefined') {
                wc.log("MTKHierarchy: registered role - skipping client-side unlock of next lesson/quiz");
            }
            return;
        }

        if (typeof wc !== 'undefined') {
            wc.log("MTKHierarchy: Enabling next lesson or quiz", moduleId, lessonId);
        }

        let currentLesson = null;
        let currentModule = null;
        let lessonIndex = -1;

        for (const course of this.config) {
            if (!course.modules) continue;

            const module = course.modules.find(m => m.id === moduleId);
            if (!module || !module.lessons) continue;

            currentModule = module;
            lessonIndex = module.lessons.findIndex(l => l.id === lessonId);

            if (lessonIndex !== -1) {
                currentLesson = module.lessons[lessonIndex];
                break;
            }
        }

        if (!currentLesson || !currentModule) {
            if (typeof wc !== 'undefined') {
                wc.warn("MTKHierarchy: Lesson not found", moduleId, lessonId);
            }
            return;
        }

        const isLastLesson = lessonIndex === currentModule.lessons.length - 1;

        if (isLastLesson) {
            if (typeof wc !== 'undefined') {
                wc.log("MTKHierarchy: Last lesson - enabling quiz link");
            }

            wc.publish('mtk-hierarchy:enable-quiz', {
                moduleId,
                lessonId,
                timestamp: new Date().toISOString()
            });

            if (currentModule.quiz) {
                currentModule.quiz.access = true;

                const quizElement = this.elements.lhs.querySelector(`[data-quiz-id="${currentModule.quiz.id}"]`);
                if (quizElement) {
                    quizElement.classList.remove('mtk-quiz--disabled');
                    if (typeof wc !== 'undefined') {
                        wc.log("MTKHierarchy: Quiz link enabled in UI");
                    }
                }
            }
        } else {
            const nextLesson = currentModule.lessons[lessonIndex + 1];

            if (nextLesson) {
                if (typeof wc !== 'undefined') {
                    wc.log("MTKHierarchy: Enabling next lesson", nextLesson.id);
                }

                nextLesson.access = true;

                const nextLessonElement = this.elements.lhs.querySelector(
                    `[data-lesson-id="${nextLesson.id}"][data-module-id="${moduleId}"]`
                );

                if (nextLessonElement) {
                    nextLessonElement.classList.remove('mtk-lesson--disabled');

                    if (typeof wc !== 'undefined') {
                        wc.log("MTKHierarchy: Next lesson enabled in UI", nextLesson.title);
                    }
                }

                wc.publish('mtk-hierarchy:lesson-enabled', {
                    moduleId,
                    lessonId: nextLesson.id,
                    previousLessonId: lessonId,
                    timestamp: new Date().toISOString()
                });
            }
        }
    }

    /**
     * Enable all resources in a lesson when it's expanded
     */
    enableLessonResources(moduleId, lessonId) {
        const role = (wc && wc.session && wc.session.user && wc.session.user.role)
            ? String(wc.session.user.role).toLowerCase()
            : '';
        if (role === 'registered') {
            if (typeof wc !== 'undefined') {
                wc.log("MTKHierarchy: registered role - keeping resource access from API payload");
            }
            return;
        }

        if (typeof wc !== 'undefined') {
            wc.log("MTKHierarchy: Enabling all resources for lesson", moduleId, lessonId);
        }

        for (const course of this.config) {
            if (!course.modules) continue;

            const module = course.modules.find(m => m.id === moduleId);
            if (!module || !module.lessons) continue;

            const lesson = module.lessons.find(l => l.id === lessonId);
            if (!lesson || !lesson.resources) continue;

            lesson.resources.forEach(resource => {
                if (!resource.access) {
                    resource.access = true;

                    if (typeof wc !== 'undefined') {
                        wc.log("MTKHierarchy: Enabled resource", resource.id);
                    }
                }
            });

            const resourceElements = this.elements.lhs.querySelectorAll(
                `[data-lesson-id="${lessonId}"][data-module-id="${moduleId}"].mtk-resource`
            );

            resourceElements.forEach(resourceElement => {
                resourceElement.classList.remove('mtk-resource--disabled');
            });

            if (typeof wc !== 'undefined') {
                wc.log(`MTKHierarchy: Enabled ${resourceElements.length} resources in UI`);
            }

            wc.publish('mtk-hierarchy:lesson-resources-enabled', {
                moduleId,
                lessonId,
                resourceCount: lesson.resources.length,
                timestamp: new Date().toISOString()
            });

            return;
        }
    }

    /**
     * Handle resource click
     */
    handleResourceClick(event, resourceElement) {
        if (resourceElement.classList.contains('mtk-resource--disabled')) {
            if (typeof wc !== 'undefined') {
                wc.warn("MTKHierarchy: Resource is disabled (access=false)");
            }
            return;
        }

        const resourceId = resourceElement.dataset.resourceId;
        const lessonId = resourceElement.dataset.lessonId;
        const moduleId = resourceElement.dataset.moduleId;

        if (typeof wc !== 'undefined') {
            wc.log("MTKHierarchy: Resource clicked", resourceId);
        }

        const resource = this.findResource(moduleId, lessonId, resourceId);

        if (!resource) {
            if (typeof wc !== 'undefined') {
                wc.warn("MTKHierarchy: Resource not found", resourceId);
            }
            return;
        }

        const allResources = this.elements.lhs.querySelectorAll('.mtk-resource');
        allResources.forEach(r => r.classList.remove('mtk-resource--active'));

        this.activeResource = resourceId;
        resourceElement.classList.add('mtk-resource--active');

        if (!resource.processed) {
            resource.processed = true;

            if (!resourceElement.querySelector('.mtk-resource__status')) {
                const statusHTML = '<span class="mtk-resource__status"><span class="material-icons">visibility</span></span>';
                resourceElement.insertAdjacentHTML('beforeend', statusHTML);
            }
        }

        this.displayResource(resource);

        wc.publish('mtk-hierarchy:resource-clicked', {
            moduleId,
            lessonId,
            resourceId,
            resource,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Handle quiz start button click
     */
    handleQuizStart(moduleId, quizUrl) {
        if (typeof wc !== 'undefined') {
            wc.log("MTKHierarchy: Starting quiz for module", moduleId);
        }

        const moduleElement = this.elements.lhs.querySelector(`[data-module-id="${moduleId}"]`);

        if (moduleElement) {
            const moduleHeader = moduleElement.querySelector('.mtk-module__header');

            if (moduleHeader) {
                moduleHeader.style.background = '#198754';
                moduleHeader.style.backgroundImage = 'none';

                if (typeof wc !== 'undefined') {
                    wc.log("MTKHierarchy: Module background changed to green (completed)");
                }

                for (const course of this.config) {
                    if (!course.modules) continue;

                    const module = course.modules.find(m => m.id === moduleId);
                    if (module) {
                        module.completed = true;
                        break;
                    }
                }

                wc.publish('mtk-hierarchy:module-completed', {
                    moduleId,
                    timestamp: new Date().toISOString()
                });
            }
        }

        window.open(quizUrl, '_blank');
    }

    /**
     * Enable the next disabled module.
     * Scans all modules across all courses in order and enables
     * the first one with access: false.
     *
     * Call this publicly from outside, e.g.:
     *   window.MTKHierarchy.enableNextModule();
     */
    enableNextModule() {
        const role = (wc && wc.session && wc.session.user && wc.session.user.role)
            ? String(wc.session.user.role).toLowerCase()
            : '';
        if (role === 'registered') {
            if (typeof wc !== 'undefined') {
                wc.log("MTKHierarchy: registered role - skipping client-side module unlock");
            }
            return;
        }

        if (typeof wc !== 'undefined') {
            wc.log("MTKHierarchy: enableNextModule called");
        }

        if (!this.config || !Array.isArray(this.config)) {
            if (typeof wc !== 'undefined') {
                wc.warn("MTKHierarchy: enableNextModule - no config available");
            }
            return;
        }

        const allModules = [];
        this.config.forEach(course => {
            if (!course.modules) return;
            course.modules.forEach(module => {
                allModules.push(module);
            });
        });

        const nextModule = allModules.find(m => !m.access);

        if (!nextModule) {
            if (typeof wc !== 'undefined') {
                wc.log("MTKHierarchy: enableNextModule - no disabled modules found");
            }
            return;
        }

        nextModule.access = true;

        const nextModuleEl = this.elements.lhs
            ? this.elements.lhs.querySelector(`[data-module-id="${nextModule.id}"]`)
            : null;

        if (nextModuleEl) {
            nextModuleEl.classList.remove('mtk-module--disabled');

            const nextModuleHeader = nextModuleEl.querySelector('.mtk-module__header');
            if (nextModuleHeader) {
                nextModuleHeader.style.cursor = 'pointer';
            }

            if (typeof wc !== 'undefined') {
                wc.log("MTKHierarchy: enableNextModule - enabled in DOM:", nextModule.id, nextModule.title);
            }
        } else {
            if (typeof wc !== 'undefined') {
                wc.warn("MTKHierarchy: enableNextModule - DOM element not found for", nextModule.id);
            }
        }

        wc.publish('mtk-hierarchy:module-enabled', {
            moduleId: nextModule.id,
            moduleTitle: nextModule.title,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Find a resource by IDs
     */
    findResource(moduleId, lessonId, resourceId) {
        if (!this.config || !Array.isArray(this.config)) return null;

        for (const course of this.config) {
            if (!course.modules) continue;

            const module = course.modules.find(m => m.id === moduleId);
            if (!module) continue;

            const lesson = module.lessons.find(l => l.id === lessonId);
            if (!lesson) continue;

            return lesson.resources.find(r => r.id === resourceId);
        }

        return null;
    }

    /**
     * Display all resources from a lesson in the RHS
     */
    displayLessonResources(moduleId, lessonId) {
        if (!this.config || !Array.isArray(this.config)) return;

        for (const course of this.config) {
            if (!course.modules) continue;

            const module = course.modules.find(m => m.id === moduleId);
            if (!module) continue;

            const lesson = module.lessons.find(l => l.id === lessonId);
            if (!lesson || !lesson.resources) continue;

            const videos = lesson.resources.filter(r => r.type === 'video' && r.access);
            const photos = lesson.resources.filter(r => r.type === 'photo' && r.access);

            if (typeof wc !== 'undefined') {
                wc.log("MTKHierarchy: Displaying lesson resources", lesson.title, "Videos:", videos.length, "Photos:", photos.length);
            }

            let contentHTML = '<div class="mtk-hierarchy-rhs__content">';
            contentHTML += `<h2>${this.escapeHtml(lesson.title)}</h2>`;

            let firstVideo = null;
            if (videos.length > 0) {
                firstVideo = videos[0];
                contentHTML += `<p style="color: var(--mtk-text-secondary); margin-bottom: 1rem;">${this.escapeHtml(firstVideo.description)}</p>`;
                contentHTML += `
          <div class="mtk-video-container">
            <iframe src="${this.sanitizeUrl(firstVideo.url)}"
                    allowfullscreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    title="${this.escapeHtml(firstVideo.description)}">
            </iframe>
          </div>
        `;
            }

            if (photos.length > 0) {
                contentHTML += '<div class="mtk-images-gallery">';
                photos.forEach(photo => {
                    contentHTML += `
            <div class="mtk-image-item">
              <img src="${this.sanitizeUrl(photo.url)}"
                   alt="${this.escapeHtml(photo.description)}"
                   loading="lazy">
              <div class="mtk-image-item__caption">${this.escapeHtml(photo.description)}</div>
            </div>
          `;
                });
                contentHTML += '</div>';
            }

            if (videos.length === 0 && photos.length === 0) {
                contentHTML += '<p style="color: var(--mtk-text-secondary);">No accessible content available for this lesson.</p>';
            }

            contentHTML += '</div>';

            this.elements.rhs.innerHTML = contentHTML;

            if (firstVideo && Number.isFinite(Number(lesson.lesson_no))) {
                this.attachVideoCompletionTracking(Number(lesson.lesson_no), moduleId, lessonId);
            }

            return;
        }
    }

    /**
     * Display resource content in RHS
     */
    displayResource(resource) {
        if (!this.elements.rhs) return;

        if (typeof wc !== 'undefined') {
            wc.log("MTKHierarchy: Displaying resource", resource);
        }

        const allResources = this.getAllResourcesForCurrentLesson(resource);
        const videos = allResources.filter(r => r.type === 'video' && r.access);
        const photos = allResources.filter(r => r.type === 'photo' && r.access);

        if (typeof wc !== 'undefined') {
            wc.log("MTKHierarchy: Videos:", videos.length, "Photos:", photos.length);
        }

        let contentHTML = '<div class="mtk-hierarchy-rhs__content">';
        contentHTML += `<h2>${this.escapeHtml(resource.description)}</h2>`;

        let firstVideo = null;
        if (videos.length > 0) {
            firstVideo = videos[0];
            contentHTML += `
        <div class="mtk-video-container">
          <iframe src="${this.sanitizeUrl(firstVideo.url)}"
                  allowfullscreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title="${this.escapeHtml(firstVideo.description)}">
          </iframe>
        </div>
      `;
        }

        if (photos.length > 0) {
            contentHTML += '<div class="mtk-images-gallery">';
            photos.forEach(photo => {
                contentHTML += `
          <div class="mtk-image-item">
            <img src="${this.sanitizeUrl(photo.url)}"
                 alt="${this.escapeHtml(photo.description)}"
                 loading="lazy">
            <div class="mtk-image-item__caption">${this.escapeHtml(photo.description)}</div>
          </div>
        `;
            });
            contentHTML += '</div>';
        }

        if (videos.length === 0 && photos.length === 0) {
            contentHTML += '<p style="color: var(--mtk-text-secondary);">No accessible content available.</p>';
        }

        contentHTML += '</div>';

        this.elements.rhs.innerHTML = contentHTML;

        const lessonContext = this.findLessonContextForResource(resource.id);
        if (firstVideo && lessonContext && Number.isFinite(Number(lessonContext.lessonNo))) {
            this.attachVideoCompletionTracking(Number(lessonContext.lessonNo), lessonContext.moduleId, lessonContext.lessonId);
        }
    }

    /**
     * Get all resources for the current lesson
     */
    getAllResourcesForCurrentLesson(resource) {
        if (!this.config || !Array.isArray(this.config)) return [resource];

        for (const course of this.config) {
            if (!course.modules) continue;

            for (const module of course.modules) {
                for (const lesson of module.lessons) {
                    if (lesson.resources && lesson.resources.some(r => r.id === resource.id)) {
                        return lesson.resources;
                    }
                }
            }
        }

        return [resource];
    }

    /**
     * Load resource by ID (used by external event load-resource)
     */
    loadResourceById(resourceId) {
        if (!this.config || !Array.isArray(this.config)) return;

        for (const course of this.config) {
            if (!course.modules) continue;

            for (const module of course.modules) {
                for (const lesson of module.lessons) {
                    const resource = lesson.resources.find(r => r.id === resourceId);
                    if (resource) {
                        if (!resource.access) {
                            if (typeof wc !== 'undefined') {
                                wc.warn('MTKHierarchy: Skipping loadResourceById for disabled resource', resourceId);
                            }
                            return;
                        }

                        this.openModules.add(module.id);
                        this.openLessons.add(`${module.id}-${lesson.id}`);

                        this.activeResource = resourceId;
                        resource.processed = true;

                        this.render();
                        this.displayResource(resource);

                        return;
                    }
                }
            }
        }
    }

    /**
     * Expand all modules and lessons
     */
    expandAll() {
        if (!this.config || !Array.isArray(this.config)) return;

        this.config.forEach(course => {
            if (!course.modules) return;

            course.modules.forEach(module => {
                if (module.access) {
                    this.openModules.add(module.id);
                    module.lessons.forEach(lesson => {
                        if (lesson.access) {
                            this.openLessons.add(`${module.id}-${lesson.id}`);
                        }
                    });
                }
            });
        });
        this.render();
    }

    /**
     * Collapse all modules and lessons
     */
    collapseAll() {
        this.openModules.clear();
        this.openLessons.clear();
        this.render();
    }

    /**
     * Reset hierarchy to a specific module and lesson position.
     *
     * role     - 'student' | 'admin'
     *            admin  → unlocks every module, lesson, resource and quiz; clears processed flags
     *            student → resets to the given moduleId / lessonNo position
     * moduleId - target module ID (e.g. 'M3')   [ignored for admin]
     * lessonNo - 1-based lesson index within that module  [ignored for admin]
     *
     * Usage:
     *   window.MTKHierarchy.reset('student', 'M3', 2)
     *   window.MTKHierarchy.reset('admin')
     */
    reset(role, moduleId, lessonNo) {
        if (typeof wc !== 'undefined') {
            wc.log("MTKHierarchy: reset() called", { role, moduleId, lessonNo });
        }

        if (!this.config || !Array.isArray(this.config)) return;

        // ── 1. Clear all open/active state ───────────────────────────────
        this.openModules.clear();
        this.openLessons.clear();
        this.activeResource = null;
        this.activeQuiz = null;

        // ── 2. Walk config and set access flags ──────────────────────────
        this.config.forEach(course => {
            if (!course.modules) return;

            course.modules.forEach(module => {

                if (role === 'admin') {
                    // Admin: unlock everything
                    module.access = true;
                    module.completed = false;
                    if (module.quiz) module.quiz.access = true;

                    if (module.lessons) {
                        module.lessons.forEach(lesson => {
                            lesson.access = true;
                            if (lesson.resources) {
                                lesson.resources.forEach(r => {
                                    r.access = true;
                                    r.processed = false;
                                });
                            }
                        });
                    }

                } else {
                    // Student: reset to given moduleId + lessonNo
                    const isTargetModule = module.id === moduleId;

                    module.completed = false;
                    if (module.quiz) module.quiz.access = false;

                    if (isTargetModule) {
                        module.access = true;

                        if (module.lessons) {
                            module.lessons.forEach((lesson, idx) => {
                                const lessonIndex = idx + 1; // 1-based
                                lesson.access = lessonIndex <= lessonNo;

                                if (lesson.resources) {
                                    lesson.resources.forEach(r => {
                                        r.access = lessonIndex <= lessonNo;
                                        r.processed = false;
                                    });
                                }
                            });
                        }
                    } else {
                        // All other modules: only first lesson accessible
                        if (module.lessons) {
                            module.lessons.forEach((lesson, idx) => {
                                lesson.access = idx === 0;
                                if (lesson.resources) {
                                    lesson.resources.forEach(r => {
                                        r.access = idx === 0;
                                        r.processed = false;
                                    });
                                }
                            });
                        }
                    }
                }
            });
        });

        // ── 3. Clear RHS ─────────────────────────────────────────────────
        if (this.elements.rhs) {
            this.elements.rhs.innerHTML = '';
        }

        // ── 4. Re-render ─────────────────────────────────────────────────
        this.render();

        // ── 5. Publish ───────────────────────────────────────────────────
        wc.publish('mtk-hierarchy:reset', {
            role,
            moduleId,
            lessonNo,
            timestamp: new Date().toISOString()
        });

        if (typeof wc !== 'undefined') {
            wc.log("MTKHierarchy: reset() complete", { role, moduleId, lessonNo });
        }
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Sanitize URL
     */
    sanitizeUrl(url) {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return url;
    }

    /**
     * Subscribe to event using wc.subscribe or fallback
     */
    subscribe(event, callback) {
        if (typeof wc !== 'undefined' && wc.subscribe) {
            return wc.subscribe(event, callback);
        } else {
            console.log('subscribe:', event);
            return function() {};
        }
    }

    /**
     * Destroy the hierarchy and clean up
     */
    destroy() {
        if (typeof wc !== 'undefined') {
            wc.log("MTKHierarchy: Destroying");
        }

        this.elements = {};
        this.element = null;
        this.initialized = false;
        this.openModules.clear();
        this.openLessons.clear();

        wc.publish('mtk-hierarchy:destroyed', {
            timestamp: new Date().toISOString()
        });
    }
}

// ─── Initialization ───────────────────────────────────────────────────────────

if (wc.testing) {
    // LOCAL MODE - Use window.app.hierarchy
    if (typeof window.app !== 'undefined' && window.app.hierarchy) {
        wc.log("MTKHierarchy: Local mode - using window.app.hierarchy");
        wc.log("testing:", wc.testing, window.app.hierarchy);

        const hierarchy = new MTKHierarchy(window.app.hierarchy);
        window.MTKHierarchy = hierarchy;

        subscribeToEvents();

        if (typeof module !== 'undefined' && module.exports) {
            module.exports = { MTKHierarchy };
        }
    } else {
        console.error('Local mode but window.app.hierarchy is not defined. Please include mtk-hierarchy.config.js before mtk-hierarchy.js');
    }
} else if (wc.session && wc.session.hierarchy) {
    // REMOTE MODE
    wc.log("MTKHierarchy: Remote mode - fetching curriculum from API");

    window.app = window.app || {};
    window.app.hierarchy = wc.session.hierarchy.parts;

    wc.log("MTKHierarchy: Curriculum loaded");
    wc.log("testing:", wc.testing, window.app.hierarchy);

    const hierarchy = new MTKHierarchy(window.app.hierarchy);
    window.MTKHierarchy = hierarchy;

    subscribeToEvents();

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { MTKHierarchy };
    }
}

/**
 * Helper: find lesson object in the hierarchy config by moduleId + lessonId
 */
function findLessonInHierarchy(moduleId, lessonId) {
    try {
        const parts = (window.app && window.app.hierarchy) ? window.app.hierarchy : null;
        if (!parts || !Array.isArray(parts)) return null;

        for (const part of parts) {
            if (!part.modules) continue;
            const mod = part.modules.find(m => m.id === moduleId);
            if (!mod || !mod.lessons) continue;
            const lesson = mod.lessons.find(l => l.id === lessonId);
            if (lesson) return lesson;
        }
        return null;
    } catch (e) {
        console.error("findLessonInHierarchy error:", e);
        return null;
    }
}

/**
 * Subscribe to hierarchy events for logging
 */
function subscribeToEvents() {
    if (typeof wc === 'undefined') return;

    wc.subscribe('mtk-hierarchy:resource-clicked', function(msg, data) {
        wc.info('🎯 Resource Clicked:', data);
    });

    wc.subscribe('mtk-hierarchy:module-toggled', function(msg, data) {
        wc.info('📂 Module Toggled:', data);
    });

    wc.subscribe('mtk-hierarchy:lesson-toggled', function(msg, data) {
        wc.info('📝 Lesson Toggled:', data);

        // Only act when OPENING a lesson (not when collapsing)
        if (!data || data.isOpen !== true) return;

        const moduleId = data.moduleId;
        const lessonId = data.lessonId;

        const lessonObj = findLessonInHierarchy(moduleId, lessonId);
        const lessonNo = lessonObj && Number.isFinite(Number(lessonObj.lesson_no)) ? Number(lessonObj.lesson_no) : null;

        const current = wc.session && wc.session.user && Number.isFinite(Number(wc.session.user.current_lesson))
            ? Number(wc.session.user.current_lesson)
            : null;

        wc.info('📝 Lesson No:', lessonNo, 'Current:', current);
    });
}

})(); // end IIFE — prevents MTKHierarchy class from polluting global scope



