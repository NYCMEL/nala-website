/**
 * MTK Hierarchy - Material Design Course Hierarchy Component
 * A reusable, accessible hierarchy component with event-driven architecture
 * Uses wc.js library for PubSub and utilities
 */

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
	
	// Add IDs to items that don't have them
	this.ensureIds();
	
	// Bind methods
	this.onMessage = this.onMessage.bind(this);
	this.handleModuleClick = this.handleModuleClick.bind(this);
	this.handleLessonClick = this.handleLessonClick.bind(this);
	this.handleResourceClick = this.handleResourceClick.bind(this);
	this.handleQuizClick = this.handleQuizClick.bind(this);
	this.handleQuizStart = this.handleQuizStart.bind(this);
	
	// Wait for DOM to be ready
	this.waitForElement();
    }

    /**
     * Ensure all items have unique IDs and fix missing types
     */
    ensureIds() {
	if (!this.config || !Array.isArray(this.config)) return;
	
	this.config.forEach((course, cIdx) => {
	    if (!course.modules) return;
	    
	    course.modules.forEach((module, mIdx) => {
		if (!module.id) module.id = `module-${cIdx}-${mIdx}`;
		if (!module.lessons) return;
		
		module.lessons.forEach((lesson, lIdx) => {
		    if (!lesson.id) lesson.id = `lesson-${cIdx}-${mIdx}-${lIdx}`;
		    if (!lesson.resources) return;
		    
		    lesson.resources.forEach((resource, rIdx) => {
			if (!resource.id) resource.id = `resource-${cIdx}-${mIdx}-${lIdx}-${rIdx}`;
			// Fix missing type - if no type specified, assume photo
			if (!resource.type) {
			    resource.type = 'photo';
			}
		    });
		});
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
	
	// Use MutationObserver to watch for element addition
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
		// Start observing the document for changes
		observer.observe(document.documentElement, {
		    childList: true,
		    subtree: true
		});
	    }
	};
	
	// Wait for DOM to be ready
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
	
	// Publish initialization event
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
	
	// Publish render complete event
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
	// This method is now handled by renderCourses
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
	
	// Render quiz link if it exists
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
	
	// Module clicks
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
	
	// Keyboard navigation
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
	mtk_pager.show("quiz");
    }

    /**
     * Handle module header click
     */
    handleModuleClick(event, moduleHeader) {
	const moduleElement = moduleHeader.closest('.mtk-module');
	
	// Check if module is disabled
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
	
	// Toggle module
	const isOpen = this.openModules.has(moduleId);
	if (isOpen) {
	    this.openModules.delete(moduleId);
	} else {
	    this.openModules.add(moduleId);
	}
	
	// Update UI without full re-render
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
	
	// Publish event
	wc.publish('mtk-hierarchy:module-toggled', {
	    moduleId,
	    isOpen: !isOpen,
	    timestamp: new Date().toISOString()
	});
    }

    /**
     * Handle lesson header click
     */
    handleLessonClick(event, lessonHeader) {
	const lessonElement = lessonHeader.closest('.mtk-lesson');
	
	// Check if lesson is disabled
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
	
	// Toggle lesson
	const isOpen = this.openLessons.has(lessonKey);
	if (isOpen) {
	    this.openLessons.delete(lessonKey);
	} else {
	    this.openLessons.add(lessonKey);
	    
	    // When opening a lesson, automatically display all its resources
	    this.displayLessonResources(moduleId, lessonId);
	    
	    // Enable all resources in this lesson
	    this.enableLessonResources(moduleId, lessonId);
	    
	    // Enable next lesson or quiz link
	    this.enableNextLessonOrQuiz(moduleId, lessonId);
	}
	
	// Update UI without full re-render
	const toggle = lessonHeader.querySelector('.mtk-lesson__toggle');
	const body = lessonElement.querySelector('.mtk-lesson__body');
	
	if (isOpen) {
	    toggle.classList.remove('mtk-lesson__toggle--open');
	    body.classList.remove('mtk-lesson__body--open');
	    lessonHeader.setAttribute('aria-expanded', 'false');
	} else {
	    toggle.classList.add('mtk-lesson__toggle--open');
	    body.classList.add('mtk-lesson__body--open');
	    lessonHeader.setAttribute('aria-expanded', 'true');
	}
	
	// Publish event
	wc.publish('mtk-hierarchy:lesson-toggled', {
	    moduleId,
	    lessonId,
	    isOpen: !isOpen,
	    timestamp: new Date().toISOString()
	});
    }

    /**
     * Enable next lesson or quiz link when current lesson is clicked
     */
    enableNextLessonOrQuiz(moduleId, lessonId) {
	if (typeof wc !== 'undefined') {
	    wc.log("MTKHierarchy: Enabling next lesson or quiz", moduleId, lessonId);
	}
	
	// Find current lesson in config
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
	
	// Check if this is the last lesson in the module
	const isLastLesson = lessonIndex === currentModule.lessons.length - 1;
	
	if (isLastLesson) {
	    // Enable quiz link
	    if (typeof wc !== 'undefined') {
		wc.log("MTKHierarchy: Last lesson - enabling quiz link");
	    }
	    
	    // Publish event to enable quiz
	    wc.publish('mtk-hierarchy:enable-quiz', {
		moduleId,
		lessonId,
		timestamp: new Date().toISOString()
	    });
	    
	    // Update quiz in config if it exists
	    if (currentModule.quiz) {
		currentModule.quiz.access = true;
		
		// Update UI if quiz element exists
		const quizElement = this.elements.lhs.querySelector(`[data-quiz-id="${currentModule.quiz.id}"]`);
		if (quizElement) {
		    quizElement.classList.remove('mtk-quiz--disabled');
		    if (typeof wc !== 'undefined') {
			wc.log("MTKHierarchy: Quiz link enabled in UI");
		    }
		}
	    }
	} else {
	    // Enable next lesson
	    const nextLesson = currentModule.lessons[lessonIndex + 1];
	    
	    if (nextLesson) {
		if (typeof wc !== 'undefined') {
		    wc.log("MTKHierarchy: Enabling next lesson", nextLesson.id);
		}
		
		// Update lesson access in config
		nextLesson.access = true;
		
		// Update UI - remove disabled class from next lesson
		const nextLessonElement = this.elements.lhs.querySelector(
		    `[data-lesson-id="${nextLesson.id}"][data-module-id="${moduleId}"]`
		);
		
		if (nextLessonElement) {
		    nextLessonElement.classList.remove('mtk-lesson--disabled');
		    
		    if (typeof wc !== 'undefined') {
			wc.log("MTKHierarchy: Next lesson enabled in UI", nextLesson.title);
		    }
		}
		
		// Publish event
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
	if (typeof wc !== 'undefined') {
	    wc.log("MTKHierarchy: Enabling all resources for lesson", moduleId, lessonId);
	}
	
	// Find the lesson in config
	for (const course of this.config) {
	    if (!course.modules) continue;
	    
	    const module = course.modules.find(m => m.id === moduleId);
	    if (!module || !module.lessons) continue;
	    
	    const lesson = module.lessons.find(l => l.id === lessonId);
	    if (!lesson || !lesson.resources) continue;
	    
	    // Enable all resources in this lesson
	    lesson.resources.forEach(resource => {
		if (!resource.access) {
		    resource.access = true;
		    
		    if (typeof wc !== 'undefined') {
			wc.log("MTKHierarchy: Enabled resource", resource.id);
		    }
		}
	    });
	    
	    // Update UI - remove disabled class from all resources in this lesson
	    const resourceElements = this.elements.lhs.querySelectorAll(
		`[data-lesson-id="${lessonId}"][data-module-id="${moduleId}"].mtk-resource`
	    );
	    
	    resourceElements.forEach(resourceElement => {
		resourceElement.classList.remove('mtk-resource--disabled');
	    });
	    
	    if (typeof wc !== 'undefined') {
		wc.log(`MTKHierarchy: Enabled ${resourceElements.length} resources in UI`);
	    }
	    
	    // Publish event
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
	// Check if resource is disabled
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
	
	// Find the resource data
	const resource = this.findResource(moduleId, lessonId, resourceId);
	
	if (!resource) {
	    if (typeof wc !== 'undefined') {
		wc.warn("MTKHierarchy: Resource not found", resourceId);
	    }
	    return;
	}
	
	// Remove active class from all resources
	const allResources = this.elements.lhs.querySelectorAll('.mtk-resource');
	allResources.forEach(r => r.classList.remove('mtk-resource--active'));
	
	// Set as active
	this.activeResource = resourceId;
	resourceElement.classList.add('mtk-resource--active');
	
	// Mark as processed and add eye icon
	if (!resource.processed) {
	    resource.processed = true;
	    
	    // Add eye icon if not present
	    if (!resourceElement.querySelector('.mtk-resource__status')) {
		const statusHTML = '<span class="mtk-resource__status"><span class="material-icons">visibility</span></span>';
		resourceElement.insertAdjacentHTML('beforeend', statusHTML);
	    }
	}
	
	// Display resource content
	this.displayResource(resource);
	
	// Publish event
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
	
	// Find the module element
	const moduleElement = this.elements.lhs.querySelector(`[data-module-id="${moduleId}"]`);
	
	if (moduleElement) {
	    // Find the module header
	    const moduleHeader = moduleElement.querySelector('.mtk-module__header');
	    
	    if (moduleHeader) {
		// Change background to green (#198754)
		moduleHeader.style.background = '#198754';
		moduleHeader.style.backgroundImage = 'none';
		
		if (typeof wc !== 'undefined') {
		    wc.log("MTKHierarchy: Module background changed to green (completed)");
		}
		
		// Mark module as completed in config
		for (const course of this.config) {
		    if (!course.modules) continue;
		    
		    const module = course.modules.find(m => m.id === moduleId);
		    if (module) {
			module.completed = true;
			break;
		    }
		}
		
		// Publish event
		wc.publish('mtk-hierarchy:module-completed', {
		    moduleId,
		    timestamp: new Date().toISOString()
		});
	    }
	}
	
	// Open quiz in new tab
	window.open(quizUrl, '_blank');
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
     * Display all resources from a lesson
     */
    displayLessonResources(moduleId, lessonId) {
	if (!this.config || !Array.isArray(this.config)) return;
	
	// Find the lesson
	for (const course of this.config) {
	    if (!course.modules) continue;
	    
	    const module = course.modules.find(m => m.id === moduleId);
	    if (!module) continue;
	    
	    const lesson = module.lessons.find(l => l.id === lessonId);
	    if (!lesson || !lesson.resources) continue;
	    
	    // Get accessible resources (support legacy 'photo' and newer 'image' types)
	    const resources = (lesson.resources || []).map(r => ({
		...r,
		type: (r.type || '').toLowerCase()
	    }));
	    const isAccessible = (r) => (r.access !== false);
	    const isVideo = (r) => r.type === 'video' || /vimeo\.com|youtube\.com|youtu\.be/i.test(r.url || '');
	    const isImage = (r) => (r.type === 'photo' || r.type === 'image' || r.type === 'img' || r.type === 'picture' ||
				    /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(r.url || '')
				   );
	    const videos = resources.filter(r => isAccessible(r) && isVideo(r));
	    const photos = resources.filter(r => isAccessible(r) && isImage(r));
	    
	    if (typeof wc !== 'undefined') {
		wc.log("MTKHierarchy: Displaying lesson resources", lesson.title, "Videos:", videos.length, "Photos:", photos.length);
	    }
	    
	    // Display content
	    let contentHTML = '<div class="mtk-hierarchy-rhs__content">';
	    contentHTML += `<h2>${this.escapeHtml(lesson.title)}</h2>`;
	    
	    // Display first video from the lesson (if any)
	    if (videos.length > 0) {
		const firstVideo = videos[0];
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
	    
	    // Display all photos from the lesson
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
	    
	    // If no content
	    if (videos.length === 0 && photos.length === 0) {
		contentHTML += '<p style="color: var(--mtk-text-secondary);">No accessible content available for this lesson.</p>';
	    }
	    
	    contentHTML += '</div>';
	    
	    this.elements.rhs.innerHTML = contentHTML;
	    
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
	
	// Get all resources for this lesson
	const allResources = this.getAllResourcesForCurrentLesson(resource);
	const videos = allResources.filter(r => r.type === 'video' && r.access);
	const photos = allResources.filter(r => r.type === 'photo' && r.access);
	
	if (typeof wc !== 'undefined') {
	    wc.log("MTKHierarchy: Videos:", videos.length, "Photos:", photos.length);
	}
	
	let contentHTML = '<div class="mtk-hierarchy-rhs__content">';
	contentHTML += `<h2>${this.escapeHtml(resource.description)}</h2>`;
	
	// Display first video from the lesson (if any)
	if (videos.length > 0) {
	    const firstVideo = videos[0];
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
	
	// Display all photos from the lesson
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
	
	// If no content
	if (videos.length === 0 && photos.length === 0) {
	    contentHTML += '<p style="color: var(--mtk-text-secondary);">No accessible content available for this lesson.</p>';
	}
	
	contentHTML += '</div>';
	
	this.elements.rhs.innerHTML = contentHTML;
    }

    /**
     * Get all resources for the current lesson
     */
    getAllResourcesForCurrentLesson(resource) {
	// Find the lesson that contains this resource
	if (!this.config || !Array.isArray(this.config)) return [resource];
	
	for (const course of this.config) {
	    if (!course.modules) continue;
	    
	    for (const module of course.modules) {
		for (const lesson of module.lessons) {
		    // Check if this lesson contains the resource
		    if (lesson.resources && lesson.resources.some(r => r.id === resource.id)) {
			return lesson.resources;
		    }
		}
	    }
	}
	
	return [resource];
    }

    /**
     * Load resource by ID
     */
    loadResourceById(resourceId) {
	if (!this.config || !Array.isArray(this.config)) return;
	
	// Find the resource
	for (const course of this.config) {
	    if (!course.modules) continue;
	    
	    for (const module of course.modules) {
		for (const lesson of module.lessons) {
		    const resource = lesson.resources.find(r => r.id === resourceId);
		    if (resource) {
			// Open the module and lesson
			this.openModules.add(module.id);
			this.openLessons.add(`${module.id}-${lesson.id}`);
			
			// Set as active and display
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
	if (!url) return '';
	// Allow absolute http(s)
	if (url.startsWith('http://') || url.startsWith('https://')) return url;
	// Allow root-relative URLs like /media/...
	if (url.startsWith('/')) return url;
	// Allow protocol-relative URLs like //player.vimeo.com/...
	if (url.startsWith('//')) return window.location.protocol + url;

	// Otherwise treat as path relative to app.baseUrl (defaults to /repo_deploy/)
	const base = (window.app && window.app.baseUrl) ? window.app.baseUrl : '/';
	const baseNorm = base.endsWith('/') ? base : (base + '/');
	const rel = url.startsWith('./') ? url.slice(2) : url;
	return baseNorm + rel.replace(/^\//, '');
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
	
	// Clear elements
	this.elements = {};
	this.element = null;
	this.initialized = false;
	this.openModules.clear();
	this.openLessons.clear();
	
	// Publish destroy event
	wc.publish('mtk-hierarchy:destroyed', {
	    timestamp: new Date().toISOString()
	});
    }
}

// Initialize hierarchy - support both local and remote config
// GET FRESH DATA
if (typeof wc !== 'undefined' && wc.isLocal) {
    // LOCAL MODE - Use window.app.hierarchy
    if (typeof window.app !== 'undefined' && window.app.hierarchy) {
	wc.log("MTKHierarchy: Local mode - using window.app.hierarchy");
	wc.log("isLocal:", wc.isLocal, window.app.hierarchy);
	
	const hierarchy = new MTKHierarchy(window.app.hierarchy);
	
	// Expose to window namespace
	window.MTKHierarchy = hierarchy;
	
	// Subscribe to events
	subscribeToEvents();
	
	// Export for module systems
	if (typeof module !== 'undefined' && module.exports) {
	    module.exports = { MTKHierarchy };
	}
    } else {
	console.error('Local mode but window.app.hierarchy is not defined. Please include mtk-hierarchy.config.js before mtk-hierarchy.js');
    }
} else if (typeof wc !== 'undefined') {
    // REMOTE MODE - Prefer session (single call), fallback to curriculum endpoint
    wc.log("MTKHierarchy: Remote mode - initializing hierarchy");

    const initFromParts = (parts) => {
	window.app = window.app || {};
	window.app.hierarchy = Array.isArray(parts) ? parts : [];

	wc.log("MTKHierarchy: Hierarchy data ready");
	wc.log("isLocal:", wc.isLocal, window.app.hierarchy);

	const hierarchy = new MTKHierarchy(window.app.hierarchy);

	// Expose to window namespace
	window.MTKHierarchy = hierarchy;

	// Subscribe to events
	subscribeToEvents();

	// Export for module systems
	if (typeof module !== 'undefined' && module.exports) {
	    module.exports = { MTKHierarchy };
	}
    };

    // If session already exists on the page, use it immediately
    const existingParts =
	  (window.session && window.session.hierarchy && window.session.hierarchy.parts) ||
	  (window.app && window.app.session && window.app.session.hierarchy && window.app.session.hierarchy.parts) ||
	  null;

    if (existingParts && Array.isArray(existingParts)) {
	wc.log("MTKHierarchy: Using existing session hierarchy");
	initFromParts(existingParts);
    } else if (wc.getSession) {
	wc.getSession(function (err, data) {
	    if (err) {
		wc.error("MTKHierarchy: Error fetching session:", err);
		if (wc.getCurriculum) {
		    wc.getCurriculum(function (err2, data2) {
			if (err2) return wc.error("MTKHierarchy: Error fetching curriculum:", err2);
			initFromParts((data2 && data2.hierarchy && data2.hierarchy.parts) ? data2.hierarchy.parts : []);
		    });
		}
		return;
	    }
	    window.session = data;
	    initFromParts((data && data.hierarchy && data.hierarchy.parts) ? data.hierarchy.parts : []);
	});
    } else if (wc.getCurriculum) {
	wc.getCurriculum(function (err, data) {
	    if (err) return wc.error("MTKHierarchy: Error fetching curriculum:", err);
	    initFromParts((data && data.hierarchy && data.hierarchy.parts) ? data.hierarchy.parts : []);
	});
    } else {
	wc.error("MTKHierarchy: No getSession or getCurriculum available.");
	initFromParts([]);
    }
} else {
    // FALLBACK - Try window.app.hierarchy if wc is not available
    if (typeof window.app !== 'undefined' && window.app.hierarchy) {
	console.log("MTKHierarchy: Fallback mode - using window.app.hierarchy");
	
	const hierarchy = new MTKHierarchy(window.app.hierarchy);
	
	// Expose to window namespace
	window.MTKHierarchy = hierarchy;
	
	// Subscribe to events if wc is available
	if (typeof wc !== 'undefined') {
	    subscribeToEvents();
	}
	
	// Export for module systems
	if (typeof module !== 'undefined' && module.exports) {
	    module.exports = { MTKHierarchy };
	}
    } else {
	console.error('window.app.hierarchy is not defined and wc.getCurriculum is not available. Please include mtk-hierarchy.config.js before mtk-hierarchy.js');
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
	wc.info('📝 Lesson Toggled:', data.moduleId, data.lessonId);

	wc.setLessonComplete(data.moduleId, data.lessonId);
    });
    
    wc.subscribe('mtk-hierarchy:module-completed', function(msg, data) {
	wc.info('✅ Module Completed:', data);
    });
    
    wc.subscribe('mtk-hierarchy:initialized', function(msg, data) {
	wc.info('✅ Hierarchy Initialized:', data);
    });
    
    wc.subscribe('mtk-hierarchy:rendered', function(msg, data) {
	wc.info('✅ Hierarchy Rendered:', data);
    });
}

/**
 * Update MTK Hierarchy configuration
 * Sets access flags for modules and lessons based on current position
 * 
 * @param {string} moduleName - Module identifier (e.g., "M1", "M2")
 * @param {number} lessonNumber - Lesson number (1-based index)
 */
function mtkHierarchyUpdate(moduleName, lessonNumber) {
    wc.log('mtkHierarchyUpdate: Updating hierarchy', { moduleName, lessonNumber });
    
    // Validate inputs
    if (!moduleName || typeof lessonNumber !== 'number') {
        wc.error('mtkHierarchyUpdate: Invalid parameters', { moduleName, lessonNumber });
        return false;
    }
    
    // Check if hierarchy exists
    if (!window.app || !window.app.hierarchy) {
        wc.error('mtkHierarchyUpdate: window.app.hierarchy not found');
        return false;
    }
    
    let targetModuleFound = false;
    let targetLessonFound = false;
    
    // Iterate through courses
    window.app.hierarchy.forEach((course, courseIndex) => {
        if (!course.modules) return;
        
        // Iterate through modules
        course.modules.forEach((module, moduleIndex) => {
            const isTargetModule = module.id === moduleName || 
                  module.id === `module-${moduleName}` ||
                  module.id.endsWith(`-${moduleName}`);
            
            if (isTargetModule) {
                targetModuleFound = true;
                
                // Enable this module and all previous modules
                module.access = true;
                
                // Update lessons in this module
                if (module.lessons && Array.isArray(module.lessons)) {
                    module.lessons.forEach((lesson, lessonIndex) => {
                        const currentLessonNumber = lessonIndex + 1;
                        
                        if (currentLessonNumber <= lessonNumber) {
                            // Enable this lesson and all previous lessons
                            lesson.access = true;
                            targetLessonFound = true;
                            
                            // Enable all resources in enabled lessons
                            if (lesson.resources && Array.isArray(lesson.resources)) {
                                lesson.resources.forEach(resource => {
                                    resource.access = true;
                                });
                            }
                        } else {
                            // Disable future lessons
                            lesson.access = false;
                            
                            // Disable resources in disabled lessons
                            if (lesson.resources && Array.isArray(lesson.resources)) {
                                lesson.resources.forEach(resource => {
                                    resource.access = false;
                                });
                            }
                        }
                    });
                }
                
                // Enable quiz if all lessons are completed
                if (module.quiz) {
                    const totalLessons = module.lessons ? module.lessons.length : 0;
                    module.quiz.access = (lessonNumber >= totalLessons);
                }
            } else {
                // Check if this is a previous module (should be enabled)
                const moduleNumber = parseInt(module.id.match(/\d+$/)?.[0] || '0');
                const targetModuleNumber = parseInt(moduleName.match(/\d+$/)?.[0] || '0');
                
                if (moduleNumber < targetModuleNumber) {
                    // Enable all previous modules completely
                    module.access = true;
                    
                    if (module.lessons) {
                        module.lessons.forEach(lesson => {
                            lesson.access = true;
                            if (lesson.resources) {
                                lesson.resources.forEach(resource => {
                                    resource.access = true;
                                });
                            }
                        });
                    }
                    
                    if (module.quiz) {
                        module.quiz.access = true;
                    }
                } else {
                    // Disable future modules
                    module.access = false;
                    
                    if (module.lessons) {
                        module.lessons.forEach(lesson => {
                            lesson.access = false;
                            if (lesson.resources) {
                                lesson.resources.forEach(resource => {
                                    resource.access = false;
                                });
                            }
                        });
                    }
                    
                    if (module.quiz) {
                        module.quiz.access = false;
                    }
                }
            }
        });
    });
    
    if (!targetModuleFound) {
        wc.error('mtkHierarchyUpdate: Module not found', moduleName);
        return false;
    }
    
    if (!targetLessonFound) {
        wc.error('mtkHierarchyUpdate: Lesson not found', lessonNumber);
        return false;
    }
    
    // Re-render hierarchy if instance exists
    if (window.MTKHierarchy && window.MTKHierarchy.render) {
        wc.log('mtkHierarchyUpdate: Re-rendering hierarchy');
        window.MTKHierarchy.render();
    }
    
    // Publish update event
    if (wc.publish) {
        wc.publish('mtk-hierarchy:updated', {
            moduleName,
            lessonNumber,
            timestamp: new Date().toISOString()
        });
    }
    
    wc.log('mtkHierarchyUpdate: Update complete', { moduleName, lessonNumber });
    return true;
}

// Add to wc namespace
wc.mtkHierarchyUpdate = mtkHierarchyUpdate;
