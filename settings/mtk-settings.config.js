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
      eyebrow: "Business profile",
      title: "Business Information",
      description: "Manage the public and legal details for your business.",
      fields: [
        {
          id: "customerFacingBusinessName",
          label: "Customer-facing business name",
          type: "text",
          autocomplete: "organization",
          required: true,
          value: "",
          placeholder: "Harbor Lock & Key"
        },
        {
          id: "legalBusinessName",
          label: "Legal business name",
          type: "text",
          autocomplete: "organization",
          required: false,
          value: "",
          placeholder: "Harbor Lock & Key LLC"
        },
        {
          id: "ownerOrResponsiblePartyName",
          label: "Owner or responsible party name",
          type: "text",
          autocomplete: "name",
          required: false,
          value: "",
          placeholder: "Owner name"
        },
        {
          id: "businessPhone",
          label: "Business phone",
          type: "tel",
          autocomplete: "tel",
          required: true,
          value: "",
          placeholder: "(555) 123-4567"
        },
        {
          id: "businessEmail",
          label: "Business email",
          type: "email",
          autocomplete: "email",
          required: true,
          value: "",
          placeholder: "service@example.com"
        },
        {
          id: "businessHours",
          label: "Business hours",
          type: "text",
          autocomplete: "off",
          required: false,
          value: "",
          placeholder: "Mon-Fri 8am-6pm; emergency calls by appointment"
        }
      ],
      actions: [
        {
          id: "saveBusiness",
          label: "Save/Update",
          variant: "primary",
          event: "mtk-settings:business-save"
        }
      ]
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
