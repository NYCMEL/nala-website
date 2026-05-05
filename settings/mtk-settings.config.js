window.mtkSettingsConfig = {
  component: {
    name: "mtk-settings",
    title: "Profile & Settings",
    defaultTab: "privacy"
  },
  user: {
    fullName: "Business Test",
    email: "business@nala.com"
  },
  tabs: [
    {
      id: "privacy",
      label: "Privacy",
      icon: "privacy_tip",
      heading: "Privacy Settings",
      fields: [
        {
          id: "fullName",
          label: "Full Name",
          type: "text",
          valueKey: "fullName",
          readonly: true
        },
        {
          id: "email",
          label: "Email Address",
          type: "email",
          valueKey: "email",
          readonly: true
        },
        {
          id: "currentPassword",
          label: "Current Password",
          type: "password",
          placeholder: "Current password",
          readonly: false
        },
        {
          id: "newPassword",
          label: "New Password",
          type: "password",
          placeholder: "New password",
          readonly: false
        },
        {
          id: "confirmPassword",
          label: "Confirm New Password",
          type: "password",
          placeholder: "Confirm new password",
          readonly: false
        }
      ],
      actions: [
        {
          id: "privacy-save",
          label: "Save Privacy Settings",
          icon: "save",
          event: "mtk-settings:privacy-save"
        }
      ]
    },
    {
      id: "business",
      label: "Business Information",
      icon: "business",
      heading: "Business Information",
      fields: [
        {
          id: "businessName",
          label: "Business Name",
          type: "text",
          placeholder: "Enter business name"
        },
        {
          id: "licenseNumber",
          label: "License Number",
          type: "text",
          placeholder: "Enter license number"
        },
        {
          id: "phone",
          label: "Business Phone",
          type: "tel",
          placeholder: "Enter phone number"
        },
        {
          id: "website",
          label: "Website",
          type: "url",
          placeholder: "Enter website URL"
        },
        {
          id: "address",
          label: "Business Address",
          type: "textarea",
          placeholder: "Enter business address"
        }
      ],
      actions: [
        {
          id: "business-save",
          label: "Save Business Information",
          icon: "save",
          event: "mtk-settings:business-save"
        }
      ]
    },
    {
      id: "services",
      label: "Services Offered",
      icon: "construction",
      heading: "Services Offered",
      fields: [
        {
          id: "residential",
          label: "Residential Locksmith",
          type: "checkbox"
        },
        {
          id: "commercial",
          label: "Commercial Locksmith",
          type: "checkbox"
        },
        {
          id: "automotive",
          label: "Automotive Locksmith",
          type: "checkbox"
        },
        {
          id: "emergency",
          label: "Emergency Lockout Service",
          type: "checkbox"
        },
        {
          id: "safeService",
          label: "Safe Installation & Repair",
          type: "checkbox"
        },
        {
          id: "additionalServices",
          label: "Additional Services",
          type: "textarea",
          placeholder: "List additional services"
        }
      ],
      actions: [
        {
          id: "services-save",
          label: "Save Services Offered",
          icon: "save",
          event: "mtk-settings:services-save"
        }
      ]
    }
  ],
  events: {
    ready: "mtk-settings:ready",
    tabChanged: "mtk-settings:tab-changed",
    fieldChanged: "mtk-settings:field-changed"
  },
  subscribeTopic: "4-mtk-settings"
};
