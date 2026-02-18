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
    this.publish('mtk-hierarchy:initialized', {
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
    this.publish('mtk-hierarchy:rendered', {
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
      const moduleHeader = e.target.closest('.mtk-module__header');
      if (moduleHeader) {
        this.handleModuleClick(e, moduleHeader);
        return;
      }
      
      const lessonHeader = e.target.closest('.mtk-lesson__header');
      if (lessonHeader) {
        this.handleLessonClick(e, lessonHeader);
        return;
      }
      
      const resource = e.target.closest('.mtk-resource');
      if (resource && !resource.classList.contains('mtk-resource--disabled')) {
        this.handleResourceClick(e, resource);
        return;
      }
      
      const quiz = e.target.closest('.mtk-quiz');
      if (quiz && !quiz.classList.contains('mtk-quiz--disabled')) {
        this.handleQuizClick(e, quiz);
        return;
      }
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
    this.publish('mtk-hierarchy:module-toggled', {
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
    this.publish('mtk-hierarchy:lesson-toggled', {
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
      this.publish('mtk-hierarchy:enable-quiz', {
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
        this.publish('mtk-hierarchy:lesson-enabled', {
          moduleId,
          lessonId: nextLesson.id,
          previousLessonId: lessonId,
          timestamp: new Date().toISOString()
        });
      }
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
    this.publish('mtk-hierarchy:resource-clicked', {
      moduleId,
      lessonId,
      resourceId,
      resource,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Handle quiz click
   */
  handleQuizClick(event, quizElement) {
    // Check if quiz is disabled
    if (quizElement.classList.contains('mtk-quiz--disabled')) {
      if (typeof wc !== 'undefined') {
        wc.warn("MTKHierarchy: Quiz is disabled (access=false)");
      }
      return;
    }
    
    const quizId = quizElement.dataset.quizId;
    const moduleId = quizElement.dataset.moduleId;
    
    if (typeof wc !== 'undefined') {
      wc.log("MTKHierarchy: Quiz clicked", quizId);
    }
    
    // Find the quiz data
    let quiz = null;
    for (const course of this.config) {
      if (!course.modules) continue;
      
      const module = course.modules.find(m => m.id === moduleId);
      if (module && module.quiz && module.quiz.id === quizId) {
        quiz = module.quiz;
        break;
      }
    }
    
    if (!quiz) {
      if (typeof wc !== 'undefined') {
        wc.warn("MTKHierarchy: Quiz not found", quizId);
      }
      return;
    }
    
    // Remove active class from all quizzes
    const allQuizzes = this.elements.lhs.querySelectorAll('.mtk-quiz');
    allQuizzes.forEach(q => q.classList.remove('mtk-quiz--active'));
    
    // Set as active
    this.activeQuiz = quizId;
    quizElement.classList.add('mtk-quiz--active');
    
    // Display quiz content in RHS
    this.displayQuiz(quiz, moduleId);
    
    // Publish event
    this.publish('mtk-hierarchy:quiz-clicked', {
      moduleId,
      quizId,
      quiz,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Display quiz in RHS
   */
  displayQuiz(quiz, moduleId) {
    if (!this.elements.rhs) return;
    
    if (typeof wc !== 'undefined') {
      wc.log("MTKHierarchy: Displaying quiz", quiz.title);
    }
    
    let contentHTML = '<div class="mtk-hierarchy-rhs__content">';
    contentHTML += `<h2>${this.escapeHtml(quiz.title)}</h2>`;
    contentHTML += `<p style="color: var(--mtk-text-secondary); margin-bottom: 1.5rem;">${this.escapeHtml(quiz.description || 'Click the button below to start the quiz.')}</p>`;
    
    // Quiz button/link
    contentHTML += `
      <div class="mtk-quiz-launch">
        <button class="mtk-quiz-launch__button" onclick="window.open('${this.sanitizeUrl(quiz.url)}', '_blank')">
          <span class="material-icons">quiz</span>
          <span>Start Quiz</span>
        </button>
      </div>
    `;
    
    contentHTML += '</div>';
    
    this.elements.rhs.innerHTML = contentHTML;
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
      
      // Get accessible resources
      const videos = lesson.resources.filter(r => r.type === 'video' && r.access);
      const photos = lesson.resources.filter(r => r.type === 'photo' && r.access);
      
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
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return '#';
  }

  /**
   * Publish event using wc.publish or fallback
   */
  publish(event, data) {
    if (typeof wc !== 'undefined' && wc.publish) {
      wc.publish(event, data);
    } else {
      console.log('publish:', event, data);
    }
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
    this.publish('mtk-hierarchy:destroyed', {
      timestamp: new Date().toISOString()
    });
  }
}

// Initialize hierarchy when config is available
if (typeof window.app !== 'undefined' && window.app.hierarchy) {
  if (typeof wc !== 'undefined') {
    wc.log("MTKHierarchy: Config found, creating instance");
  }
  
  const hierarchy = new MTKHierarchy(window.app.hierarchy);
  
  // Expose to window namespace
  window.MTKHierarchy = hierarchy;
  
  // Example: Listen to hierarchy events
  if (typeof wc !== 'undefined') {
    wc.subscribe('mtk-hierarchy:resource-clicked', function(msg, data) {
      wc.info('🎯 Resource Clicked:', data);
    });
    
    wc.subscribe('mtk-hierarchy:module-toggled', function(msg, data) {
      wc.info('📂 Module Toggled:', data);
    });
    
    wc.subscribe('mtk-hierarchy:lesson-toggled', function(msg, data) {
      wc.info('📝 Lesson Toggled:', data);
    });
    
    wc.subscribe('mtk-hierarchy:initialized', function(msg, data) {
      wc.info('✅ Hierarchy Initialized:', data);
    });
    
    wc.subscribe('mtk-hierarchy:rendered', function(msg, data) {
      wc.info('✅ Hierarchy Rendered:', data);
    });
  }
} else {
  console.error('window.app.hierarchy is not defined. Please include mtk-hierarchy.config.js before mtk-hierarchy.js');
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MTKHierarchy };
}
