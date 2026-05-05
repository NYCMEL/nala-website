/* mtk-settings.config.js */
window.mtkSettingsConfig = {
  tabs: [
    {
      id: "privacy",
      label: "Privacy",
      eyebrow: "Internal communications only",
      title: "Privacy Settings",
      description: "Manage contact details used only for internal communications.",
      fields: [
        {
          id: "fullName",
          label: "Full Name",
          type: "text",
          autocomplete: "name",
          required: true,
          value: ""
        },
        {
          id: "emailAddress",
          label: "Email Address",
          type: "email",
          autocomplete: "email",
          required: true,
          value: ""
        },
        {
          id: "contactPhoneNumber",
          label: "Contact Phone Number",
          type: "tel",
          autocomplete: "tel",
          required: false,
          value: ""
        },
        {
          id: "password",
          label: "Password",
          type: "password",
          autocomplete: "current-password",
          required: true,
          value: ""
        }
      ],
      actions: [
        {
          id: "saveUpdate",
          label: "Save/Update",
          variant: "primary",
          event: "mtk-settings:privacy-save"
        },
        {
          id: "changePassword",
          label: "Change Password",
          variant: "secondary",
          event: "mtk-settings:change-password"
        }
      ]
    },
    {
      id: "business",
      label: "Business Information",
      eyebrow: "Company profile",
      title: "Business Information",
      description: "Add business profile fields here."
    },
    {
      id: "services",
      label: "Services Offered",
      eyebrow: "Offerings",
      title: "Services Offered",
      description: "Add service fields and pricing options here."
    }
  ]
};
