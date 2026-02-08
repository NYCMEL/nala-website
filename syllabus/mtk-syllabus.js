/**
 * MTK Syllabus Component
 * Material Design + Bootstrap 5 Course Syllabus
 * Load-order safe, fully JSON-driven
 */

(function() {
  'use strict';
  
  // Configuration
  const CONFIG = {
    elementId: 'mtk-syllabus',
    dataPath: 'window.app.syllabus',
    maxRetries: 50,
    retryInterval: 100
  };
  
  // State
  let retryCount = 0;
  let isInitialized = false;
  let expandedSections = new Set();
  let expandedModules = new Set();
  
  /**
   * Check if all required dependencies are available
   * @returns {boolean}
   */
  function checkDependencies() {
    const element = document.getElementById(CONFIG.elementId);
    const data = window.app && window.app.syllabus;
    
    return !!(element && data);
  }
  
  /**
   * Get syllabus data safely
   * @returns {Array|null}
   */
  function getSyllabusData() {
    try {
      return window.app && window.app.syllabus ? window.app.syllabus : null;
    } catch (error) {
      console.error('MTK Syllabus: Error accessing syllabus data', error);
      return null;
    }
  }
  
  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string}
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  /**
   * Get badge class based on color
   * @param {string} color - Badge color
   * @returns {string}
   */
  function getBadgeClass(color) {
    return `mtk-syllabus__badge mtk-syllabus__badge--${color}`;
  }
  
  /**
   * Get badge icon based on text
   * @param {string} text - Badge text
   * @returns {string}
   */
  function getBadgeIcon(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('free') || lowerText.includes('preview')) {
      return '<i class="fas fa-unlock mtk-syllabus__badge-icon"></i>';
    }
    if (lowerText.includes('locked') || lowerText.includes('quiz')) {
      return '<i class="fas fa-lock mtk-syllabus__badge-icon"></i>';
    }
    return '';
  }
  
  /**
   * Create lesson HTML
   * @param {Object} lesson - Lesson object
   * @returns {string}
   */
  function createLesson(lesson) {
    const isLocked = !lesson.access;
    const lockedClass = isLocked ? 'mtk-syllabus__lesson-link--locked' : '';
    const badgeClass = getBadgeClass(lesson.badge.color);
    const badgeIcon = getBadgeIcon(lesson.badge.text);
    
    // Count resources by type
    const videoCount = lesson.resources.filter(r => r.type === 'video').length;
    const photoCount = lesson.resources.filter(r => r.type === 'photo').length;
    
    const resourcesHtml = [];
    if (videoCount > 0) {
      resourcesHtml.push(`
        <span class="mtk-syllabus__lesson-resources">
          <i class="fas fa-play-circle mtk-syllabus__resource-icon"></i>
          <span class="mtk-syllabus__resource-count">${videoCount}</span>
        </span>
      `);
    }
    if (photoCount > 0) {
      resourcesHtml.push(`
        <span class="mtk-syllabus__lesson-resources">
          <i class="fas fa-image mtk-syllabus__resource-icon"></i>
          <span class="mtk-syllabus__resource-count">${photoCount}</span>
        </span>
      `);
    }
    
    return `
      <li class="mtk-syllabus__lesson">
        <div 
          class="mtk-syllabus__lesson-link ${lockedClass}"
          data-lesson-no="${lesson.lesson_no}"
          data-access="${lesson.access}"
          role="button"
          tabindex="0"
        >
          <div class="mtk-syllabus__lesson-info">
            <span class="mtk-syllabus__lesson-number">L${lesson.lesson_no}</span>
            <h5 class="mtk-syllabus__lesson-title">${escapeHtml(lesson.title)}</h5>
          </div>
          <div class="mtk-syllabus__lesson-meta">
            ${resourcesHtml.join('')}
            <span class="${badgeClass}">
              ${badgeIcon}
              ${escapeHtml(lesson.badge.text)}
            </span>
          </div>
        </div>
      </li>
    `;
  }
  
  /**
   * Create quiz HTML
   * @param {Object} quiz - Quiz object
   * @returns {string}
   */
  function createQuiz(quiz) {
    const isLocked = !quiz.access;
    const lockedClass = isLocked ? 'mtk-syllabus__lesson-link--locked' : '';
    const badgeClass = getBadgeClass(quiz.badge.color);
    const badgeIcon = getBadgeIcon(quiz.badge.text);
    
    return `
      <li class="mtk-syllabus__lesson">
        <div 
          class="mtk-syllabus__lesson-link mtk-syllabus__lesson-link--quiz ${lockedClass}"
          data-lesson-no="${quiz.lesson_no}"
          data-module-id="${quiz.module_id}"
          data-type="quiz"
          data-access="${quiz.access}"
          role="button"
          tabindex="0"
        >
          <div class="mtk-syllabus__lesson-info">
            <span class="mtk-syllabus__lesson-number">Q${quiz.lesson_no}</span>
            <h5 class="mtk-syllabus__lesson-title">
              ${escapeHtml(quiz.title)}
              <span class="mtk-syllabus__quiz-info">
                <i class="fas fa-question-circle"></i>
                ${quiz.rules.questions} questions | ${quiz.rules.pass_percent}% to pass
              </span>
            </h5>
          </div>
          <div class="mtk-syllabus__lesson-meta">
            <span class="${badgeClass}">
              ${badgeIcon}
              ${escapeHtml(quiz.badge.text)}
            </span>
          </div>
        </div>
      </li>
    `;
  }
  
  /**
   * Create module HTML
   * @param {Object} module - Module object
   * @param {number} sectionIndex - Section index
   * @returns {string}
   */
  function createModule(module, sectionIndex) {
    const isLocked = !module.access;
    const moduleKey = `section-${sectionIndex}-${module.module_id}`;
    const isExpanded = expandedModules.has(moduleKey);
    const expandedClass = isExpanded ? 'expanded' : '';
    const lockedClass = isLocked ? 'mtk-syllabus__module-header--locked' : '';
    
    const lessonsHtml = module.lessons.map(lesson => createLesson(lesson)).join('');
    const quizHtml = module.quiz ? createQuiz(module.quiz) : '';
    
    return `
      <div class="mtk-syllabus__module">
        <div 
          class="mtk-syllabus__module-header ${expandedClass} ${lockedClass}"
          data-module-key="${moduleKey}"
          data-access="${module.access}"
          role="button"
          tabindex="0"
        >
          <div class="mtk-syllabus__module-title">
            <span class="mtk-syllabus__module-id">${module.module_id}</span>
            ${escapeHtml(module.title)}
            ${isLocked ? '<i class="fas fa-lock mtk-syllabus__lock-icon"></i>' : ''}
          </div>
          <i class="fas fa-chevron-down mtk-syllabus__module-icon"></i>
        </div>
        <div class="mtk-syllabus__module-content ${expandedClass}">
          <ul class="mtk-syllabus__lessons">
            ${lessonsHtml}
            ${quizHtml}
          </ul>
        </div>
      </div>
    `;
  }
  
  /**
   * Create section HTML
   * @param {Object} section - Section object
   * @param {number} index - Section index
   * @returns {string}
   */
  function createSection(section, index) {
    const isLocked = !section.access;
    const sectionKey = `section-${index}`;
    const isExpanded = expandedSections.has(sectionKey);
    const expandedClass = isExpanded ? 'expanded' : '';
    const lockedClass = isLocked ? 'mtk-syllabus__section-header--locked' : '';
    
    const modulesHtml = section.modules
      .map(module => createModule(module, index))
      .join('');
    
    return `
      <div class="mtk-syllabus__section">
        <div 
          class="mtk-syllabus__section-header ${expandedClass} ${lockedClass}"
          data-section-key="${sectionKey}"
          data-access="${section.access}"
          role="button"
          tabindex="0"
        >
          <h2 class="mtk-syllabus__section-title">
            ${escapeHtml(section.title)}
            ${isLocked ? '<i class="fas fa-lock mtk-syllabus__lock-icon"></i>' : ''}
          </h2>
          <i class="fas fa-chevron-down mtk-syllabus__section-icon"></i>
        </div>
        <div class="mtk-syllabus__section-content ${expandedClass}">
          ${modulesHtml}
        </div>
      </div>
    `;
  }
  
  /**
   * Toggle section expansion
   * @param {string} sectionKey - Section key
   */
  function toggleSection(sectionKey) {
    if (expandedSections.has(sectionKey)) {
      expandedSections.delete(sectionKey);
    } else {
      expandedSections.add(sectionKey);
    }
    
    const header = document.querySelector(`[data-section-key="${sectionKey}"]`);
    const content = header.nextElementSibling;
    
    header.classList.toggle('expanded');
    content.classList.toggle('expanded');
  }
  
  /**
   * Toggle module expansion
   * @param {string} moduleKey - Module key
   */
  function toggleModule(moduleKey) {
    if (expandedModules.has(moduleKey)) {
      expandedModules.delete(moduleKey);
    } else {
      expandedModules.add(moduleKey);
    }
    
    const header = document.querySelector(`[data-module-key="${moduleKey}"]`);
    const content = header.nextElementSibling;
    
    header.classList.toggle('expanded');
    content.classList.toggle('expanded');
  }
  
  /**
   * Handle lesson click
   * @param {Object} lessonData - Lesson data
   */
  function handleLessonClick(lessonData) {
    if (!lessonData.access) {
      console.log('MTK Syllabus: Lesson is locked', lessonData);
      return;
    }
    
    // Publish event using wc object if available
    if (window.wc && typeof window.wc.publish === 'function') {
      window.wc.publish('lesson-selected', {
        lessonNo: lessonData.lessonNo,
        type: lessonData.type || 'lesson',
        moduleId: lessonData.moduleId,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('MTK Syllabus: Lesson selected', lessonData);
    }
  }
  
  /**
   * Attach event listeners
   * @param {HTMLElement} containerElement - Container element
   */
  function attachEventListeners(containerElement) {
    try {
      // Section headers
      const sectionHeaders = containerElement.querySelectorAll('.mtk-syllabus__section-header');
      sectionHeaders.forEach(header => {
        const sectionKey = header.getAttribute('data-section-key');
        const access = header.getAttribute('data-access') === 'true';
        
        if (!access) {
          return;
        }
        
        header.addEventListener('click', function() {
          toggleSection(sectionKey);
        });
        
        header.addEventListener('keydown', function(event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleSection(sectionKey);
          }
        });
      });
      
      // Module headers
      const moduleHeaders = containerElement.querySelectorAll('.mtk-syllabus__module-header');
      moduleHeaders.forEach(header => {
        const moduleKey = header.getAttribute('data-module-key');
        const access = header.getAttribute('data-access') === 'true';
        
        if (!access) {
          return;
        }
        
        header.addEventListener('click', function() {
          toggleModule(moduleKey);
        });
        
        header.addEventListener('keydown', function(event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleModule(moduleKey);
          }
        });
      });
      
      // Lesson links
      const lessonLinks = containerElement.querySelectorAll('.mtk-syllabus__lesson-link');
      lessonLinks.forEach(link => {
        const lessonNo = parseInt(link.getAttribute('data-lesson-no'), 10);
        const access = link.getAttribute('data-access') === 'true';
        const type = link.getAttribute('data-type');
        const moduleId = link.getAttribute('data-module-id');
        
        link.addEventListener('click', function() {
          handleLessonClick({ lessonNo, access, type, moduleId });
        });
        
        link.addEventListener('keydown', function(event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleLessonClick({ lessonNo, access, type, moduleId });
          }
        });
      });
      
    } catch (error) {
      console.error('MTK Syllabus: Error attaching event listeners', error);
    }
  }
  
  /**
   * Render the syllabus
   * @param {HTMLElement} containerElement - Container element
   * @param {Array} data - Syllabus data
   */
  function renderSyllabus(containerElement, data) {
    try {
      if (!Array.isArray(data)) {
        console.error('MTK Syllabus: Invalid syllabus data');
        return;
      }
      
      const sectionsHtml = data
        .map((section, index) => createSection(section, index))
        .join('');
      
      containerElement.innerHTML = sectionsHtml;
      
      attachEventListeners(containerElement);
      
    } catch (error) {
      console.error('MTK Syllabus: Error rendering syllabus', error);
    }
  }
  
  /**
   * Initialize the component
   */
  function initialize() {
    if (isInitialized) {
      return;
    }
    
    try {
      const containerElement = document.getElementById(CONFIG.elementId);
      const syllabusData = getSyllabusData();
      
      if (!containerElement) {
        console.error('MTK Syllabus: Container element not found');
        return;
      }
      
      if (!syllabusData) {
        console.error('MTK Syllabus: Syllabus data not available');
        return;
      }
      
      renderSyllabus(containerElement, syllabusData);
      
      isInitialized = true;
      console.log('MTK Syllabus: Initialized successfully');
      
    } catch (error) {
      console.error('MTK Syllabus: Initialization error', error);
    }
  }
  
  /**
   * Retry initialization if dependencies are not ready
   */
  function retryInitialization() {
    if (checkDependencies()) {
      initialize();
    } else if (retryCount < CONFIG.maxRetries) {
      retryCount++;
      setTimeout(retryInitialization, CONFIG.retryInterval);
    } else {
      console.error('MTK Syllabus: Failed to initialize after maximum retries. Dependencies not available.');
    }
  }
  
  /**
   * Start the initialization process
   */
  function start() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', retryInitialization);
    } else {
      retryInitialization();
    }
  }
  
  // Start the component
  start();
  
})();
