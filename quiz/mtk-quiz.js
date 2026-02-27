// mtk-quiz.js
class MtkQuiz {
    constructor(element, config) {
	this.element = element;
	this.config = config;
	this.answers = {};
	
	this.elements = {
	    form: null,
	    questionsContainer: null,
	    submitBtn: null,
	    clearBtn: null,
	    testBtn: null,
	    progressFill: null,
	    progressText: null,
	    messageContainer: null
	};

	this.init();
    }

    init() {
	this.cacheElements();
	this.populateHeader();
	this.renderQuestions();
	this.attachEventListeners();
	this.subscribeToEvents();
	this.updateProgress();
    }

    cacheElements() {
	this.elements.form = this.element.querySelector('#quizForm');
	this.elements.questionsContainer = this.element.querySelector('#questionsContainer');
	this.elements.submitBtn = this.element.querySelector('#submitBtn');
	this.elements.clearBtn = this.element.querySelector('#clearBtn');
	this.elements.cancelBtn = this.element.querySelector('#cancelBtn');
	this.elements.testBtn = this.element.querySelector('#testBtn');
	this.elements.progressFill = this.element.querySelector('#progressFill');
	this.elements.progressText = this.element.querySelector('#progressText');
	this.elements.messageContainer = this.element.querySelector('#messageContainer');
    }

    populateHeader() {
	const titleEl = this.element.querySelector('#quizTitle');
	const moduleEl = this.element.querySelector('#moduleId');
	const countEl = this.element.querySelector('#questionCount');
	const sessionEl = this.element.querySelector('#sessionId');

	if (titleEl) titleEl.textContent = 'Locksmith Knowledge Quiz';
	if (moduleEl) moduleEl.textContent = this.config.module_id || '--';
	if (countEl) countEl.textContent = this.config.count || this.config.questions.length;
	if (sessionEl) sessionEl.textContent = this.config.quiz_session_id || '--';
    }

    renderQuestions() {
	if (!this.elements.questionsContainer) return;

	this.elements.questionsContainer.innerHTML = '';

	this.config.questions.forEach((question, index) => {
	    const questionEl = this.createQuestionElement(question, index);
	    this.elements.questionsContainer.appendChild(questionEl);
	});
    }

    createQuestionElement(question, index) {
	const questionDiv = document.createElement('div');
	questionDiv.className = 'mtk-quiz__question';
	questionDiv.setAttribute('data-question-id', question.id);

	const header = document.createElement('div');
	header.className = 'mtk-quiz__question-header';

	const number = document.createElement('div');
	number.className = 'mtk-quiz__question-number';
	number.textContent = index + 1;

	const questionText = document.createElement('h2');
	questionText.className = 'mtk-quiz__question-text';
	questionText.textContent = question.question;

	header.appendChild(number);
	header.appendChild(questionText);

	const optionsDiv = document.createElement('div');
	optionsDiv.className = 'mtk-quiz__options';

	// Create options from choice_a, choice_b, choice_c, choice_d
	const choices = ['a', 'b', 'c', 'd'];
	choices.forEach((choice) => {
	    const choiceKey = `choice_${choice}`;
	    if (question[choiceKey]) {
		const optionEl = this.createOptionElement(question.id, choice, question[choiceKey]);
		optionsDiv.appendChild(optionEl);
	    }
	});

	questionDiv.appendChild(header);
	questionDiv.appendChild(optionsDiv);

	return questionDiv;
    }

    createOptionElement(questionId, choiceKey, choiceText) {
	const label = document.createElement('label');
	label.className = 'mtk-quiz__option';

	const input = document.createElement('input');
	input.type = 'radio';
	input.name = `question_${questionId}`;
	input.value = choiceKey;
	input.className = 'mtk-quiz__option-input';
	input.setAttribute('data-question-id', questionId);
	input.setAttribute('aria-label', `${choiceText}`);

	const labelDiv = document.createElement('div');
	labelDiv.className = 'mtk-quiz__option-label';

	const radio = document.createElement('div');
	radio.className = 'mtk-quiz__option-radio';
	radio.setAttribute('aria-hidden', 'true');

	const text = document.createElement('span');
	text.className = 'mtk-quiz__option-text';
	text.textContent = choiceText;

	labelDiv.appendChild(radio);
	labelDiv.appendChild(text);

	label.appendChild(input);
	label.appendChild(labelDiv);

	return label;
    }

    attachEventListeners() {
	wc.log('🟢 Attaching event listeners...');
	
	// Form submission
	if (this.elements.form) {
	    wc.log('🟢 Form found, attaching submit listener');
	    this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));
	} else {
	    wc.log('🔴 Form NOT found!');
	}
	
	// Submit button direct click (backup)
	if (this.elements.submitBtn) {
	    wc.log('🟢 Submit button found, attaching click listener');
	    this.elements.submitBtn.addEventListener('click', (e) => {
		wc.log('🟢 Submit button CLICKED');
		// Check if button is inside a form
		const form = this.elements.submitBtn.closest('form');
		if (!form) {
		    wc.log('🟡 Button not in form, calling handleSubmit directly');
		    e.preventDefault();
		    this.handleSubmit(e);
		}
	    });
	} else {
	    wc.log('🔴 Submit button NOT found!');
	}

	// Clear button
	if (this.elements.clearBtn) {
	    wc.log('🟢 Clear button found');
	    this.elements.clearBtn.addEventListener('click', () => this.handleClear());
	}

	// Cancel button
	if (this.elements.cancelBtn) {
	    wc.log('🟢 Cancel button found');
	    this.elements.cancelBtn.addEventListener('click', () => this.handleCancel());
	}

	// Test button (select first option)
	if (this.elements.testBtn) {
	    wc.log('🟢 Test button found');
	    this.elements.testBtn.addEventListener('click', () => this.handleTest());
	}

	// Radio button changes
	if (this.elements.questionsContainer) {
	    this.elements.questionsContainer.addEventListener('change', (e) => {
		if (e.target.classList.contains('mtk-quiz__option-input')) {
		    this.handleOptionChange(e);
		}
	    });
	}

	// Keyboard navigation
	if (this.elements.questionsContainer) {
	    this.elements.questionsContainer.addEventListener('keydown', (e) => {
		this.handleKeyboard(e);
	    });
	}
	
	wc.log('🟢 All event listeners attached!');
    }

    handleOptionChange(e) {
	const input = e.target;
	const questionId = input.getAttribute('data-question-id');
	const value = input.value;

	this.answers[questionId] = value;
	this.updateProgress();

	// Publish option change event
	if (window.wc && window.wc.publish) {
	    const eventData = {
		questionId: parseInt(questionId),
		selectedOption: value,
		timestamp: new Date().toISOString()
	    };
	    
	    if (window.wc.log) {
		window.wc.log('4-mtk-quiz-option-changed', eventData);
	    }
	    
	    window.wc.publish('4-mtk-quiz-option-changed', eventData);
	}
    }

    handleSubmit(e) {
	wc.log('🔴 SUBMIT BUTTON CLICKED!');
	e.preventDefault();
	
	wc.log('🔴 Event prevented, continuing...');

	// Check if all questions are answered
	const totalQuestions = this.config.questions.length;
	const answeredCount = Object.keys(this.answers).length;
	
	wc.log('🔴 TOTAL QUESTIONS:', totalQuestions);
	wc.log('🔴 ANSWERED COUNT:', answeredCount);
	
	// Debug logging
	wc.log('=== SUBMIT DEBUG ===');
	wc.log('Total Questions:', totalQuestions);
	wc.log('Answered Count:', answeredCount);
	wc.log('Answers Object:', this.answers);
	wc.log('==================');

	if (answeredCount < totalQuestions) {
	    wc.log('🔴 VALIDATION FAILED - NOT ALL ANSWERED');
	    this.showMessage('error', `Please answer all questions. ${answeredCount}/${totalQuestions} answered.`);
	    
	    // Publish validation error event
	    if (window.wc && window.wc.publish) {
		const errorData = {
		    answered: answeredCount,
		    total: totalQuestions,
		    message: `Please answer all questions. ${answeredCount}/${totalQuestions} answered.`,
		    timestamp: new Date().toISOString()
		};
		
		if (window.wc.log) {
		    window.wc.log('4-mtk-quiz-validation-error', errorData);
		}
		
		window.wc.publish('4-mtk-quiz-validation-error', errorData);
	    }
	    
	    return;
	}

	wc.log('🔴 VALIDATION PASSED - ALL QUESTIONS ANSWERED');

	// Create submission data
	const submissionData = {
	    quiz_session_id: this.config.quiz_session_id,
	    module_id: this.config.module_id,
	    answers: this.config.questions.map(q => ({
		question_id: q.id,
		question: q.question,
		selected_answer: this.answers[q.id],
		selected_text: q[`choice_${this.answers[q.id]}`]
	    })),
	    submitted_at: new Date().toISOString(),
	    total_questions: totalQuestions
	};

	// Publish quiz submission
	if (window.wc && window.wc.publish) {
	    if (window.wc.log) {
		window.wc.log('quiz', submissionData);
	    }
	    window.wc.publish('quiz', submissionData);
	    
	    if (window.wc.log) {
		window.wc.log('4-mtk-quiz-submitted', submissionData);
	    }
	    window.wc.publish('4-mtk-quiz-submitted', submissionData);
	}

	this.showMessage('success', 'Quiz submitted successfully!');

	// Disable form after submission
	this.disableForm();
	
	// Publish form disabled event
	if (window.wc && window.wc.publish) {
	    const disabledData = {
		timestamp: new Date().toISOString()
	    };
	    
	    if (window.wc.log) {
		window.wc.log('4-mtk-quiz-form-disabled', disabledData);
	    }
	    
	    window.wc.publish('4-mtk-quiz-form-disabled', disabledData);
	}
    }

    handleClear() {
	// Clear all selections
	this.answers = {};
	const radioButtons = this.element.querySelectorAll('.mtk-quiz__option-input');
	radioButtons.forEach(radio => {
	    radio.checked = false;
	});

	this.updateProgress();
	this.clearMessage();

	// Enable form if it was disabled
	this.enableForm();

	// Publish clear event
	if (window.wc && window.wc.publish) {
	    const clearData = {
		timestamp: new Date().toISOString()
	    };
	    
	    if (window.wc.log) {
		window.wc.log('4-mtk-quiz-cleared', clearData);
	    }
	    
	    window.wc.publish('4-mtk-quiz-cleared', clearData);
	    
	    // Publish form enabled event
	    const enabledData = {
		timestamp: new Date().toISOString()
	    };
	    
	    if (window.wc.log) {
		window.wc.log('4-mtk-quiz-form-enabled', enabledData);
	    }
	    
	    window.wc.publish('4-mtk-quiz-form-enabled', enabledData);
	}
    }

    handleCancel() {
	mtk_pager.show('course');
    }

    handleTest() {
	// Select first option for each question
	this.config.questions.forEach(question => {
	    const firstInput = this.element.querySelector(`input[data-question-id="${question.id}"][value="a"]`);
	    if (firstInput) {
		firstInput.checked = true;
		
		// Manually register the answer since programmatic check doesn't trigger change event
		this.answers[question.id] = 'a';
		
		// Trigger change event programmatically
		const changeEvent = new Event('change', { bubbles: true });
		firstInput.dispatchEvent(changeEvent);
	    }
	});

	this.updateProgress();
	this.showMessage('success', 'Test mode: First option selected for all questions.');

	// Publish test event
	if (window.wc && window.wc.publish) {
	    const testData = {
		selectedCount: Object.keys(this.answers).length,
		totalQuestions: this.config.questions.length,
		timestamp: new Date().toISOString()
	    };
	    
	    if (window.wc.log) {
		window.wc.log('4-mtk-quiz-test-mode', testData);
	    }
	    
	    window.wc.publish('4-mtk-quiz-test-mode', testData);
	}
    }

    handleKeyboard(e) {
	const target = e.target;
	if (!target.classList.contains('mtk-quiz__option-input')) return;

	const currentOption = target.closest('.mtk-quiz__option');
	const question = target.closest('.mtk-quiz__question');
	let nextOption = null;

	switch (e.key) {
	case 'ArrowDown':
	case 'ArrowRight':
            e.preventDefault();
            nextOption = currentOption.nextElementSibling;
            if (!nextOption) {
		// Move to next question's first option
		const nextQuestion = question.nextElementSibling;
		if (nextQuestion) {
		    nextOption = nextQuestion.querySelector('.mtk-quiz__option');
		}
            }
            break;

	case 'ArrowUp':
	case 'ArrowLeft':
            e.preventDefault();
            nextOption = currentOption.previousElementSibling;
            if (!nextOption) {
		// Move to previous question's last option
		const prevQuestion = question.previousElementSibling;
		if (prevQuestion) {
		    const options = prevQuestion.querySelectorAll('.mtk-quiz__option');
		    nextOption = options[options.length - 1];
		}
            }
            break;
	}

	if (nextOption) {
	    const nextInput = nextOption.querySelector('.mtk-quiz__option-input');
	    if (nextInput) {
		nextInput.focus();
	    }
	}
    }

    updateProgress() {
	const totalQuestions = this.config.questions.length;
	const answeredCount = Object.keys(this.answers).length;
	const percentage = (answeredCount / totalQuestions) * 100;

	if (this.elements.progressFill) {
	    this.elements.progressFill.style.width = `${percentage}%`;
	}

	if (this.elements.progressText) {
	    this.elements.progressText.textContent = `${answeredCount} / ${totalQuestions}`;
	}

	// Publish progress update event
	if (window.wc && window.wc.publish) {
	    const progressData = {
		answered: answeredCount,
		total: totalQuestions,
		percentage: percentage.toFixed(2),
		timestamp: new Date().toISOString()
	    };
	    
	    if (window.wc.log) {
		window.wc.log('4-mtk-quiz-progress', progressData);
	    }
	    
	    window.wc.publish('4-mtk-quiz-progress', progressData);
	}
    }

    showMessage(type, text) {
	if (!this.elements.messageContainer) return;

	const messageDiv = document.createElement('div');
	messageDiv.className = `mtk-quiz__message mtk-quiz__message--${type}`;
	messageDiv.setAttribute('role', type === 'error' ? 'alert' : 'status');

	const icon = document.createElement('span');
	icon.className = 'mtk-quiz__message-icon';
	icon.textContent = type === 'error' ? 'error' : 'check_circle';

	const textSpan = document.createElement('span');
	textSpan.textContent = text;

	messageDiv.appendChild(icon);
	messageDiv.appendChild(textSpan);

	this.elements.messageContainer.innerHTML = '';
	this.elements.messageContainer.appendChild(messageDiv);

	// Auto-hide success messages after 5 seconds
	if (type === 'success') {
	    setTimeout(() => {
		this.clearMessage();
	    }, 5000);
	}
    }

    clearMessage() {
	if (this.elements.messageContainer) {
	    this.elements.messageContainer.innerHTML = '';
	}
    }

    disableForm() {
	const inputs = this.element.querySelectorAll('.mtk-quiz__option-input');
	inputs.forEach(input => {
	    input.disabled = true;
	});

	if (this.elements.submitBtn) {
	    this.elements.submitBtn.disabled = true;
	}
	
	// Publish form state change
	if (window.wc && window.wc.publish) {
	    const stateData = {
		state: 'disabled',
		timestamp: new Date().toISOString()
	    };
	    
	    if (window.wc.log) {
		window.wc.log('4-mtk-quiz-form-state-changed', stateData);
	    }
	    
	    window.wc.publish('4-mtk-quiz-form-state-changed', stateData);
	}
    }

    enableForm() {
	const inputs = this.element.querySelectorAll('.mtk-quiz__option-input');
	inputs.forEach(input => {
	    input.disabled = false;
	});

	if (this.elements.submitBtn) {
	    this.elements.submitBtn.disabled = false;
	}
	
	// Publish form state change
	if (window.wc && window.wc.publish) {
	    const stateData = {
		state: 'enabled',
		timestamp: new Date().toISOString()
	    };
	    
	    if (window.wc.log) {
		window.wc.log('4-mtk-quiz-form-state-changed', stateData);
	    }
	    
	    window.wc.publish('4-mtk-quiz-form-state-changed', stateData);
	}
    }

    subscribeToEvents() {
	if (!window.wc || !window.wc.subscribe) return;

	// Subscribe to all 4-mtk-quiz events
	window.wc.subscribe('4-mtk-quiz-option-changed', this.onMessage.bind(this));
	window.wc.subscribe('4-mtk-quiz-submitted', this.onMessage.bind(this));
	window.wc.subscribe('4-mtk-quiz-cleared', this.onMessage.bind(this));
	window.wc.subscribe('4-mtk-quiz-test-mode', this.onMessage.bind(this));
	window.wc.subscribe('4-mtk-quiz-progress', this.onMessage.bind(this));
	window.wc.subscribe('4-mtk-quiz-validation-error', this.onMessage.bind(this));
	window.wc.subscribe('4-mtk-quiz-form-state-changed', this.onMessage.bind(this));
	window.wc.subscribe('4-mtk-quiz-form-enabled', this.onMessage.bind(this));
	window.wc.subscribe('4-mtk-quiz-form-disabled', this.onMessage.bind(this));
    }

    onMessage(event, data) {
	wc.log('📩 Received message:', event, data);
	// Handle incoming messages here if needed
	// This allows the component to react to external events
    }
}

/**
 * Wait for mtk-quiz element to be ready in the DOM
 */
function waitForMtkQuizElement() {
    return new Promise((resolve) => {
	// Check if element already exists
	const checkElement = () => {
	    const element = document.querySelector('mtk-quiz.mtk-quiz') || 
		  document.querySelector('mtk-quiz') ||
		  document.querySelector('[class*="mtk-quiz"]');
	    
	    if (element) {
		wc.log('✅ mtk-quiz element found in DOM');
		return element;
	    }
	    return null;
	};
	
	// Immediate check
	const existingElement = checkElement();
	if (existingElement) {
	    resolve(existingElement);
	    return;
	}
	
	wc.log('⏳ Waiting for mtk-quiz element to appear in DOM...');
	
	// Use MutationObserver to watch for element
	const observer = new MutationObserver((mutations, obs) => {
	    const element = checkElement();
	    if (element) {
		obs.disconnect();
		resolve(element);
	    }
	});
	
	// Observe the entire document
	observer.observe(document.body, {
	    childList: true,
	    subtree: true
	});
	
	// Timeout after 30 seconds
	setTimeout(() => {
	    observer.disconnect();
	    wc.error('❌ Timeout: mtk-quiz element not found after 30 seconds');
	    resolve(null);
	}, 30000);
    });
}

/**
 * Initialize MTK Quiz component
 */
async function initMtkQuiz(config) {
    wc.log('🚀 Starting MTK Quiz initialization...');
    
    try {
	// Wait for element
	const element = await waitForMtkQuizElement();
	
	// Check if element is available
	if (!element) {
	    wc.error('❌ Cannot initialize: mtk-quiz element not found');
	    return;
	}
	
	if (!config) {
	    wc.error('❌ Cannot initialize: config not provided');
	    return;
	}
	
	// Check if already initialized
	if (element.mtkQuizInstance) {
	    wc.log('⚠️ MTK Quiz already initialized on this element');
	    return;
	}
	
	wc.log('✅ Element and config ready, initializing...');
	
	// Small delay to ensure DOM is stable
	await new Promise(resolve => setTimeout(resolve, 100));
	
	// Initialize the quiz component
	const quiz = new MtkQuiz(element, config);
	
	// Store instance on element
	element.mtkQuizInstance = quiz;
	
	// Expose to window namespace
	window.MtkQuiz = quiz;
	
	wc.log('✅ MTK Quiz initialized successfully');
	
	// Publish initialization event
	if (window.wc && window.wc.publish) {
	    const initData = {
		quiz_session_id: config.quiz_session_id,
		module_id: config.module_id,
		question_count: config.questions.length,
		timestamp: new Date().toISOString()
	    };
	    
	    wc.log('4-mtk-quiz-initialized', initData);
	    wc.publish('4-mtk-quiz-initialized', initData);
	}
	
    } catch (error) {
	wc.error('❌ Error initializing MTK Quiz:', error);
    }
}

// Initialize quiz - support both local and remote config
// GET FRESH DATA
if (wc.isLocal) {
    // LOCAL MODE - Use window.mtkQuizConfig
    wc.log("MTK Quiz: Local mode - using window.mtkQuizConfig");
    wc.log("isLocal:", wc.isLocal);
    
    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => initMtkQuiz(mtkQuizConfig));
    } else {
	initMtkQuiz(mtkQuizConfig);
    }
    
    // Backup initialization on window load
    window.addEventListener('load', async () => {
	const element = document.querySelector('mtk-quiz.mtk-quiz') || 
	      document.querySelector('mtk-quiz') ||
	      document.querySelector('[class*="mtk-quiz"]');
	
	if (element && !element.mtkQuizInstance) {
	    wc.log('🔄 MTK Quiz: Backup initialization on window load');
	    await initMtkQuiz(mtkQuizConfig);
	}
    });
} else {
    // REMOTE MODE - Fetch from API
    wc.log("MTK Quiz: Remote mode - fetching quiz from API");
    
    wc.getQuiz(wc.quizModule, function(err, data) {
	if (err) {
	    alert(err.message);
	    return;
	}

	let quiz = data.quiz;

	quiz.module_id = wc.quizModule;

	wc.log("mtk-quiz.js: > data:", JSON.stringify(quiz));

	initMtkQuiz(quiz);
    });
}
