/* mtk-settings.config.js */
window.mtkSettingsConfig = {
  title: "Profile & Settings",
  eyebrow: "Account Management",
  tabs: [
    {
      id: "privacy",
      label: "Personal Information",
      icon: "account_circle",
      title: "Personal Information",
      description: "Enter the personal contact details NALA should use if we need to reach you. These details are for your account, not for customers.",
      nextStep: "Fill in your name and email address, then click Save personal information.",
      fields: [
        {
          id: "fullName",
          label: "Full Name",
          type: "text",
          required: true,
          placeholder: "Enter your full name",
          helpText: "Use your real first and last name."
        },
        {
          id: "emailAddress",
          label: "Email Address",
          type: "email",
          required: true,
          placeholder: "Enter your email address",
          helpText: "Use the email address where NALA can contact you."
        },
        {
          id: "contactPhoneNumber",
          label: "Contact Phone Number",
          type: "tel",
          required: false,
          placeholder: "Enter your phone number",
          helpText: "Use a number where NALA can reach you if we need help with your setup."
        },
        {
          id: "password",
          label: "Password",
          type: "password",
          required: true,
          placeholder: "Enter your password",
          helpText: "Your password is hidden. Click the eye icon if you need to see it."
        }
      ],
      actions: [
        {
          id: "savePrivacy",
          label: "Save personal information",
          icon: "save",
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
      title: "Business Information",
      description: "Enter the business details customers should see on your website, invoices, business card, and Google setup email.",
      nextStep: "Fill in the required fields marked with an asterisk, then click Save business information. Next, open Services Offered.",
      fields: [
        {
          id: "customerFacingBusinessName",
          label: "Customer-facing business name",
          type: "text",
          required: true,
          placeholder: "e.g. Harbor Lock & Key",
          helpText: "Enter the business name customers should see."
        },
        {
          id: "legalBusinessName",
          label: "Legal business name",
          type: "text",
          required: false,
          placeholder: "e.g. Harbor Lock & Key LLC",
          helpText: "If your legal name is different from the customer-facing name, enter it here."
        },
        {
          id: "ownerOrResponsiblePartyName",
          label: "Owner or responsible party name",
          type: "text",
          required: false,
          placeholder: "Enter owner name",
          helpText: "Enter the person responsible for this business."
        },
        {
          id: "businessPhone",
          label: "Business phone",
          type: "tel",
          required: true,
          placeholder: "(555) 123-4567",
          helpText: "Enter the phone number customers should call."
        },
        {
          id: "businessEmail",
          label: "Business email",
          type: "email",
          required: true,
          placeholder: "service@example.com",
          helpText: "Enter the email customers and Google should use for this business."
        },
        {
          id: "businessWebsite",
          label: "Business website",
          type: "url",
          required: false,
          placeholder: "https://pro.nalanetwork.com/your-locksmith",
          helpText: "Choose a short NALA client URL, or type a different website if you already use one."
        },
        {
          id: "businessHours",
          label: "Business hours",
          type: "text",
          required: false,
          placeholder: "Mon-Fri 8am-6pm",
          helpText: "Enter the hours customers should expect, for example: Mon-Fri 8am-6pm."
        }
      ],
      actions: [
        {
          id: "saveBusiness",
          label: "Save business information",
          icon: "save",
          variant: "primary",
          event: "mtk-settings:business-save"
        }
      ]
    },
    {
      id: "services",
      label: "Services Offered",
      icon: "handyman",
      title: "Services Offered",
      description: "Tell customers where you work and which locksmith services you offer.",
      nextStep: "Enter your service area, check every service you offer, then click Save services offered.",
      fields: [
        {
          id: "serviceArea",
          label: "Service area",
          type: "textarea",
          required: true,
          fullWidth: true,
          rows: 4,
          placeholder: "Brooklyn, Queens, Manhattan",
          helpText: "List the cities, neighborhoods, or counties where you want customers to call you."
        },
        {
          id: "launchServices",
          label: "Services offered",
          type: "checkboxGroup",
          required: true,
          fullWidth: true,
          helpText: "Check every service you want customers to see. If a service is missing, click Add service below.",
          options: [
            {
              label: "House lockouts",
              value: "House lockouts"
            },
            {
              label: "Rekeys",
              value: "Rekeys"
            },
            {
              label: "Lock changes",
              value: "Lock changes"
            },
            {
              label: "Deadbolt installation",
              value: "Deadbolt installation"
            },
            {
              label: "Mailbox / cabinet locks",
              value: "Mailbox / cabinet locks"
            },
            {
              label: "Car lockouts",
              value: "Car lockouts"
            },
            {
              label: "Basic commercial lock service",
              value: "Basic commercial lock service"
            }
          ]
        },
        {
          id: "customServices",
          label: "Add custom services",
          type: "customServiceList",
          required: false,
          fullWidth: true,
          buttonLabel: "Add another service",
          removeButtonLabel: "Remove checked services",
          placeholder: "Type the service name",
          helpText: "Click Add another service to add one blank line. Type the service name and leave the box checked if you offer it."
        }
      ],
      actions: [
        {
          id: "saveServices",
          label: "Save services offered",
          icon: "save",
          variant: "primary",
          event: "mtk-settings:services-save"
        }
      ]
    }
  ]
};
