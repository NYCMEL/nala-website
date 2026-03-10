window.app = window.app || {};

window.app['mtk-login'] = {
    title: "Welcome Back",
    email: {
	label: "Email",
	placeholder: "Enter your email",
	required: true
    },
    password: {
	label: "Password",
	placeholder: "Enter your password",
	required: true
    },
    submit: {
	label: "Login"
    },
    links: {
	forgotPassword: "Forgot Password?",
	register: "Don't have an account? Register"
    },
    forgotPassword: {
	title: "Reset Your Password",
	emailLabel: "Please provide email used to login with NALA",
	emailPlaceholder: "Enter your email",
	helpText: "After submitting your email, we will send you a link to update/reset your password",
	submitLabel: "Submit",
	cancelLabel: "Cancel"
    },
    events: {
	submit: "mtk-login-submit",
	forgotPassword: "mtk-login-forgot",
	forgotPasswordSubmit: "mtk-login-forgot-submit",
	register: "mtk-login-register",
	focusChange: "mtk-login-focus"
    }
};
