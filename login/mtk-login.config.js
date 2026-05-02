window.app = window.app || {};

window.app['mtk-login'] = {
    title: "Welcome back",
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
	label: "Log in"
    },
    links: {
	forgotPassword: "Forgot password?",
	register: "Don't have an account? Register"
    },
    forgotPassword: {
	title: "Reset your password",
	emailLabel: "Enter the email address you use for NALA",
	emailPlaceholder: "Enter your email",
	helpText: "After you submit your email, we will send you a link to reset your password.",
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
