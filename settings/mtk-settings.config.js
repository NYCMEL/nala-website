/* mtk-settings.config.js */
window.mtkSettingsConfig = {
  title: "Profile & Settings",
  eyebrow: "Account Management",
  tabs: [
    {
      id: "privacy",
      label: "Privacy",
      icon: "lock",
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
      icon: "business",
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
      icon: "handyman",
      eyebrow: "Service coverage",
      title: "Services Offered",
      description: "Manage your service areas and launch services.",
      fields: [
        {
          id: "serviceArea",
          label: "Service area",
          type: "textarea",
          required: true,
          value: "",
          placeholder: "Brooklyn, Queens, Manhattan",
          rows: 4,
          fullWidth: true
        },
        {
          id: "launchServices",
          label: "Launch services",
          type: "checkboxGroup",
          required: true,
          fullWidth: true,
          options: [
            {
              id: "houseLockouts",
              label: "House lockouts",
              value: "House lockouts",
              checked: false
            },
            {
              id: "rekeys",
              label: "Rekeys",
              value: "Rekeys",
              checked: false
            },
            {
              id: "lockChanges",
              label: "Lock changes",
              value: "Lock changes",
              checked: false
            },
            {
              id: "deadboltInstallation",
              label: "Deadbolt installation",
              value: "Deadbolt installation",
              checked: false
            },
            {
              id: "mailboxCabinetLocks",
              label: "Mailbox / cabinet locks",
              value: "Mailbox / cabinet locks",
              checked: false
            },
            {
              id: "carLockouts",
              label: "Car lockouts",
              value: "Car lockouts",
              checked: false
            },
            {
              id: "basicCommercialLockService",
              label: "Basic commercial lock service",
              value: "Basic commercial lock service",
              checked: false
            }
          ]
        }
      ],
      actions: [
        {
          id: "saveServices",
          label: "Save/Update",
          variant: "primary",
          event: "mtk-settings:services-save"
        }
      ]
    }
  ]
};
