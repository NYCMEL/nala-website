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
    this.openModules = new Set();
    this.openLessons = new Set();
    
    // Bind methods
    this.onMessage = this.onMessage.bind(this);
    this.handleModuleClick = this.handleModuleClick.bind(this);
    this.handleLessonClick = this.handleLessonClick.bind(this);
    this.handleResourceClick = this.handleResourceClick.bind(this);
    
    // Wait for DOM to be ready
    this.waitForElement();
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
    
    this.renderModules();
    
    if (typeof wc !== 'undefined') {
      wc.groupEnd();
    }
    
    // Publish render complete event
    this.publish('mtk-hierarchy:rendered', {
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Render modules
   */
  renderModules() {
    if (!this.elements.lhs || !this.config.modules) {
      if (typeof wc !== 'undefined') {
        wc.warn("MTKHierarchy: Cannot render modules - missing element or config");
      }
      return;
    }
    
    const modulesHTML = this.config.modules.map(module => this.renderModule(module)).join('');
    this.elements.lhs.innerHTML = modulesHTML;
    
    if (typeof wc !== 'undefined') {
      wc.log("MTKHierarchy: Modules rendered", this.config.modules.length);
    }
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
        </div>
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
    
    // Re-render to update UI
    this.render();
    
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
    }
    
    // Re-render to update UI
    this.render();
    
    // Publish event
    this.publish('mtk-hierarchy:lesson-toggled', {
      moduleId,
      lessonId,
      isOpen: !isOpen,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Handle resource click
   */
  handleResourceClick(event, resourceElement) {
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
    
    // Set as active
    this.activeResource = resourceId;
    
    // Mark as processed
    resource.processed = true;
    
    // Re-render LHS to show eye icon
    this.render();
    
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
   * Find a resource by IDs
   */
  findResource(moduleId, lessonId, resourceId) {
    const module = this.config.modules.find(m => m.id === moduleId);
    if (!module) return null;
    
    const lesson = module.lessons.find(l => l.id === lessonId);
    if (!lesson) return null;
    
    return lesson.resources.find(r => r.id === resourceId);
  }

  /**
   * Display resource content in RHS
   */
  displayResource(resource) {
    if (!this.elements.rhs) return;
    
    if (typeof wc !== 'undefined') {
      wc.log("MTKHierarchy: Displaying resource", resource);
    }
    
    // Collect all resources for this lesson to display images
    const allResources = this.getAllResourcesForCurrentLesson(resource);
    const videos = allResources.filter(r => r.type === 'video');
    const photos = allResources.filter(r => r.type === 'photo');
    
    let contentHTML = '<div class="mtk-hierarchy-rhs__content">';
    contentHTML += `<h2>${this.escapeHtml(resource.description)}</h2>`;
    
    // Display video if current resource is video
    if (resource.type === 'video') {
      contentHTML += `
        <div class="mtk-video-container">
          <iframe src="${this.sanitizeUrl(resource.url)}" 
                  allowfullscreen 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title="${this.escapeHtml(resource.description)}">
          </iframe>
        </div>
      `;
    }
    
    // Display all photos
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
    
    contentHTML += '</div>';
    
    this.elements.rhs.innerHTML = contentHTML;
  }

  /**
   * Get all resources for the current lesson
   */
  getAllResourcesForCurrentLesson(resource) {
    // For now, just return the single resource
    // In a more complex implementation, this would find all resources in the same lesson
    return [resource];
  }

  /**
   * Load resource by ID
   */
  loadResourceById(resourceId) {
    // Find the resource
    for (const module of this.config.modules) {
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

  /**
   * Expand all modules and lessons
   */
  expandAll() {
    this.config.modules.forEach(module => {
      if (module.access) {
        this.openModules.add(module.id);
        module.lessons.forEach(lesson => {
          if (lesson.access) {
            this.openLessons.add(`${module.id}-${lesson.id}`);
          }
        });
      }
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
      wc.log('🎯 Resource Clicked:', data);
    });
    
    wc.subscribe('mtk-hierarchy:module-toggled', function(msg, data) {
      wc.log('📂 Module Toggled:', data);
    });
    
    wc.subscribe('mtk-hierarchy:lesson-toggled', function(msg, data) {
      wc.log('📝 Lesson Toggled:', data);
    });
    
    wc.subscribe('mtk-hierarchy:initialized', function(msg, data) {
      wc.log('✅ Hierarchy Initialized:', data);
    });
    
    wc.subscribe('mtk-hierarchy:rendered', function(msg, data) {
      wc.log('✅ Hierarchy Rendered:', data);
    });
  }
} else {
  console.error('window.app.hierarchy is not defined. Please include mtk-hierarchy.config.js before mtk-hierarchy.js');
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MTKHierarchy };
}
