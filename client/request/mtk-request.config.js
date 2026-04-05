window.mtkRequestConfig = {
  title:      "Contact Information",
  submitText: "Submit Request",
  fields: {
    name:    { label: "Full Name",                    placeholder: "e.g. John A. Smith",          required: true  },
    email:   { label: "Email",                        placeholder: "e.g. john@example.com",       required: true  },
    phone:   { label: "Phone",                        placeholder: "e.g. (646) 555-1234",         required: false },
    address: { label: "Address",                      placeholder: "e.g. 123 Main St, New York",  required: false },
    help:    { label: "What do you need help with?",  placeholder: "e.g. Locked out, need new locks installed, key duplication...", required: true  }
  },
  contactOptions: [
    { value: "email", label: "Contact me by email" },
    { value: "phone", label: "Contact me by phone"  }
  ],
  phoneTimes: [
    "Morning (8am - 12pm)",
    "Afternoon (12pm - 5pm)",
    "Evening (5pm - 9pm)"
  ]
};
