// mtk-settings Configuration
const mtkSettingsConfig = {
  user: {
    firstName: "John",
    middleInitial: "M",
    lastName: "Doe",
    currentPassword: "password123" // In production, never store plain text passwords
  },
  labels: {
    title: "Profile Settings",
    userName: "Full Name",
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
