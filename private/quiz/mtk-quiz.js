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
	this.updateProgress();
    }

    cacheElements() {
	this.elements.form = this.element.querySelector('#quizForm');
	this.elements.questionsContainer = this.element.querySelector('#questionsContainer');
	this.elements.submitBtn = this.element.querySelector('#submitBtn');
	this.elements.clearBtn = this.element.querySelector('#clearBtn');
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
	// Form submission
	if (this.elements.form) {
	    this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));
	}

	// Clear button
	if (this.elements.clearBtn) {
	    this.elements.clearBtn.addEventListener('click', () => this.handleClear());
	}

	// Test button (select first option)
	if (this.elements.testBtn) {
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
    }

    handleOptionChange(e) {
	const input = e.target;
	const questionId = input.getAttribute('data-question-id');
	const value = input.value;

	this.answers[questionId] = value;
	this.updateProgress();

	// Publish option change event
	wc.publish('4-mtk-quiz-option-changed', {
	    questionId: parseInt(questionId),
	    selectedOption: value,
	    timestamp: new Date().toISOString()
	});
    }

    handleSubmit(e) {
	alert("X")

	e.preventDefault();

	// Check if all questions are answered
	const totalQuestions = this.config.questions.length;
	const answeredCount = Object.keys(this.answers).length;

	if (answeredCount < totalQuestions) {
	    this.showMessage('error', `Please answer all questions. ${answeredCount}/${totalQuestions} answered.`);
	    return;
	}

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
	wc.publish('quiz', submissionData);
	wc.publish('4-mtk-quiz-submitted', submissionData);
	
	this.showMessage('success', 'Quiz submitted successfully!');

	// Disable form after submission
	this.disableForm();
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
	wc.publish('4-mtk-quiz-cleared', {
	    timestamp: new Date().toISOString()
	});
    }

    handleTest() {
	// Select first option for each question
	this.config.questions.forEach(question => {
	    const firstInput = this.element.querySelector(`input[data-question-id="${question.id}"][value="a"]`);
	    if (firstInput) {
		firstInput.checked = true;
		this.answers[question.id] = 'a';
	    }
	});

	this.updateProgress();
	this.showMessage('success', 'Test mode: First option selected for all questions.');

	// Publish test event
	wc.publish('4-mtk-quiz-test-mode', {
	    timestamp: new Date().toISOString()
	});
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
	wc.publish('4-mtk-quiz-progress', {
	    answered: answeredCount,
	    total: totalQuestions,
	    percentage: percentage.toFixed(2),
	    timestamp: new Date().toISOString()
	});
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
	alert("AAAAAAAAAAAA")
	
	const inputs = this.element.querySelectorAll('.mtk-quiz__option-input');
	inputs.forEach(input => {
	    input.disabled = true;
	});

	if (this.elements.submitBtn) {
	    this.elements.submitBtn.disabled = true;
	}
    }

    enableForm() {
	alert("BBBBBBBBBB")

	const inputs = this.element.querySelectorAll('.mtk-quiz__option-input');
	inputs.forEach(input => {
	    input.disabled = false;
	});

	if (this.elements.submitBtn) {
	    this.elements.submitBtn.disabled = false;
	}
    }
}

// Initialize function that waits for both element and config
function initMtkQuiz() {
    // Use MutationObserver to watch for element availability
    const observer = new MutationObserver((mutations, obs) => {
	// Look for mtk-quiz element (works with wc-include)
	const element = document.querySelector('mtk-quiz.mtk-quiz') || 
              document.querySelector('mtk-quiz') ||
              document.querySelector('[class*="mtk-quiz"]');
	
	// Check if config is available
	const configAvailable = typeof mtkQuizConfig !== 'undefined';
	
	if (element && configAvailable) {
	    // Stop observing once we found the element
	    obs.disconnect();
	    
	    // Small delay to ensure all DOM is fully loaded
	    setTimeout(() => {
		// Initialize the quiz component
		const quiz = new MtkQuiz(element, mtkQuizConfig);
		
		// Store instance on element for external access
		element.mtkQuizInstance = quiz;
		
		console.log('✅ MTK Quiz initialized successfully');
	    }, 50);
	}
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, {
	childList: true,
	subtree: true
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
	observer.disconnect();
    }, 30000);
}

// Multiple initialization strategies to ensure component loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMtkQuiz);
} else {
    initMtkQuiz();
}

// Also try on window load as backup
window.addEventListener('load', () => {
    const element = document.querySelector('mtk-quiz.mtk-quiz') || 
          document.querySelector('mtk-quiz') ||
          document.querySelector('[class*="mtk-quiz"]');
    
    if (element && !element.mtkQuizInstance && typeof mtkQuizConfig !== 'undefined') {
	const quiz = new MtkQuiz(element, mtkQuizConfig);
	element.mtkQuizInstance = quiz;
	console.log('✅ MTK Quiz initialized on window load');
    }
});
