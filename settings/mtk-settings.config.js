window.mtkSettingsConfig = {
  title: "Profile & Settings",
  eyebrow: "Account Management",
  tabs: [
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
          placeholder: "Enter any additional services you offer...",
          rows: 4
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
