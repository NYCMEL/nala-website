window.app = window.app || {};
window.app.header = {
  logo: "https://via.placeholder.com/120x40?text=Logo",
  mode: "light", // light or dark
  fixed: true,   // true = fixed top
  menu: [
    {
      text: "Features",
      dropdown: ["Option 1", "Option 2"]
    },
    { text: "Pricing" },
    { text: "About" },
    { text: "Contact" }
  ],
  buttons: [
    { text: "Login", type: "secondary" },
    { text: "Sign Up", type: "primary" }
  ]
};
