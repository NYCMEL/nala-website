window.mtkSettingsConfig = {
  title: "Profile & Settings",
  eyebrow: "Account Management",
  tabs: [
    {
      id: "privacy",
      label: "Privacy",
      icon: "lock",
      title: "Privacy Settings",
      fields: [
        { id: "fullName", label: "Full Name", type: "text", required: true, placeholder: "Enter your full name" },
        { id: "emailAddress", label: "Email Address", type: "email", required: true, placeholder: "Enter your email address" },
        { id: "contactPhoneNumber", label: "Contact Phone Number", type: "tel", placeholder: "Enter your phone number" },
        { id: "password", label: "Password", type: "password", required: true, placeholder: "Enter your password" }
      ],
      actions: [
        { id: "savePrivacy", label: "Save", icon: "save", variant: "primary", event: "mtk-settings:privacy-save" },
        { id: "changePassword", label: "Change Password", variant: "secondary", event: "mtk-settings:change-password" }
      ]
    },
    {
      id: "business",
      label: "Business Information",
      icon: "business",
      title: "Business Information",
      fields: [
        { id: "customerFacingBusinessName", label: "Customer-facing business name", type: "text", required: true, placeholder: "e.g. Harbor Lock & Key" },
        { id: "legalBusinessName", label: "Legal business name", type: "text", placeholder: "e.g. Harbor Lock & Key LLC" },
        { id: "ownerOrResponsiblePartyName", label: "Owner or responsible party name", type: "text", placeholder: "Enter owner name" },
        { id: "businessPhone", label: "Business phone", type: "tel", required: true, placeholder: "(555) 123-4567" },
        { id: "businessEmail", label: "Business email", type: "email", required: true, placeholder: "service@example.com" },
        { id: "businessHours", label: "Business hours", type: "text", placeholder: "Mon–Fri 8am–6pm" }
      ],
      actions: [
        { id: "saveBusiness", label: "Save", icon: "save", variant: "primary", event: "mtk-settings:business-save" }
      ]
    },
    {
      id: "services",
      label: "Services Offered",
      icon: "handyman",
      title: "Services Offered",
      fields: [
        {
          id: "launchServices",
          label: "Launch services",
          type: "checkboxGroup",
          fullWidth: true,
          required: true,
          options: [
            { label: "House lockouts", value: "House lockouts" },
            { label: "Rekeys", value: "Rekeys" },
            { label: "Lock changes", value: "Lock changes" },
            { label: "Deadbolt installation", value: "Deadbolt installation" },
            { label: "Mailbox / cabinet locks", value: "Mailbox / cabinet locks" },
            { label: "Car lockouts", value: "Car lockouts" },
            { label: "Basic commercial lock service", value: "Basic commercial lock service" }
          ]
        },
        {
          id: "customServices",
          label: "Add custom services",
          type: "textarea",
          fullWidth: true,
          rows: 4,
          placeholder: "Enter additional services, one per line"
        }
      ],
      actions: [
        { id: "saveServices", label: "Save", icon: "save", variant: "primary", event: "mtk-settings:services-save" }
      ]
    }
  ]
};
