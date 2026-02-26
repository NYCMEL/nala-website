// mtk-settings Configuration
const mtkSettingsConfig = {
    user: {
	firstName: "John",
	middleInitial: "",
	lastName: "",
	email: "john.doe@example.com",
	currentPassword: "password123" // In production, never store plain text passwords
    },
    labels: {
	title: "Profile Settings",
	userName: "Full Name",
	userEmail: "Email Address",
	currentPassword: "Current Password",
	newPassword: "New Password",
	confirmPassword: "Confirm New Password",
	updateButton: "Update",
	saveButton: "Save Changes",
	cancelButton: "Cancel"
    },
    validation: {
	passwordMinLength: 8,
	passwordRequireUppercase: true,
	passwordRequireLowercase: true,
	passwordRequireNumber: true
    }
};
