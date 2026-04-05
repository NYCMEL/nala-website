window.mtkRequestConfig = {
  title: "Request Assistance",
  fields: {
    name: { label: "Full Name", required: true },
    email: { label: "Email", required: true },
    phone: { label: "Phone", required: false },
    address: { label: "Address", required: false },
    help: { label: "What do you need help with?", required: true }
  },
  contactOptions: [
    { value: "email", label: "Contact me by email" },
    { value: "phone", label: "Contact me by phone" }
  ],
  phoneTimes: [
    "Morning (8am - 12pm)",
    "Afternoon (12pm - 5pm)",
    "Evening (5pm - 9pm)"
  ]
};
