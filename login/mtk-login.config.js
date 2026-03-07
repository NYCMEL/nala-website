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
    events: {
	submit: "mtk-login-submit",
	forgotPassword: "mtk-login-forgot",
	register: "mtk-login-register",
	focusChange: "mtk-login-focus"
    }
};

// FILL VALUES WHEN TESTING
if (wc.testing) {
    wc.timeout(function(){
	$("#mtk-email").attr("value", "mel@google.com");
	$("#mtk-password").attr("value", "test");
    }, 200, 1);
}
