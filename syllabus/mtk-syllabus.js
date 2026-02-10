/**
 * MTK Syllabus Component
 * Simple bulleted list syllabus
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
   * Create lesson HTML
   * @param {Object} lesson - Lesson object
   * @returns {string}
   */
  function createLesson(lesson) {
    return `
      <li class="mtk-syllabus__lesson">
        <div 
          class="mtk-syllabus__lesson-link"
          data-lesson-no="${lesson.lesson_no}"
          data-access="${lesson.access}"
          role="button"
          tabindex="0"
        >
          <h5 class="mtk-syllabus__lesson-title">${escapeHtml(lesson.title)}</h5>
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
    return `
      <li class="mtk-syllabus__lesson">
        <div 
          class="mtk-syllabus__lesson-link"
          data-lesson-no="${quiz.lesson_no}"
          data-module-id="${quiz.module_id}"
          data-type="quiz"
          data-access="${quiz.access}"
          role="button"
          tabindex="0"
        >
          <h5 class="mtk-syllabus__lesson-title">${escapeHtml(quiz.title)}</h5>
        </div>
      </li>
    `;
  }
  
  /**
   * Create section HTML
   * @param {Object} section - Section object
   * @returns {string}
   */
  function createSection(section) {
    // Collect all lessons and quizzes from all modules
    const allLessonsHtml = [];
    
    section.modules.forEach(module => {
      // Add all lessons from this module
      module.lessons.forEach(lesson => {
        allLessonsHtml.push(createLesson(lesson));
      });
      
      // Add quiz if it exists
      if (module.quiz) {
        allLessonsHtml.push(createQuiz(module.quiz));
      }
    });
    
    return `
      <div class="mtk-syllabus__section">
        <h2 class="mtk-syllabus__section-title">${escapeHtml(section.title)}</h2>
        <ul class="mtk-syllabus__lessons">
          ${allLessonsHtml.join('')}
        </ul>
      </div>
    `;
  }
  
  /**
   * Handle lesson click
   * @param {Object} lessonData - Lesson data
   */
  function handleLessonClick(lessonData) {
    // Publish event using wc object if available
    if (window.wc && typeof window.wc.publish === 'function') {
      window.wc.publish('lesson-selected', {
        lessonNo: lessonData.lessonNo,
        type: lessonData.type || 'lesson',
        moduleId: lessonData.moduleId,
        access: lessonData.access,
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
        .map(section => createSection(section))
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
