// mtk-footer.config.js
window.app = window.app || {};
window.app.footer = {
  brand: {
    logo: "img/logo-nala-association.webp",
    description: "NALA Association is dedicated to connecting communities and fostering growth."
  },
  navigation: [
    {
      title: "Contact Information",
      links: [
        { text: "Phone: +1 555-123-4567", event: "contact-phone" },
        { text: "Email: info@nala.org", event: "contact-email" },
        { text: "Address: 123 Main Street, NYC, NY", event: "contact-address" }
      ]
    },
    {
      title: "Social Media",
      links: [
        { text: "Facebook", icon: "fab fa-facebook-f", event: "social-facebook" },
        { text: "Instagram", icon: "fab fa-instagram", event: "social-instagram" },
        { text: "LinkedIn", icon: "fab fa-linkedin-in", event: "social-linkedin" },
        { text: "YouTube", icon: "fab fa-youtube", event: "social-youtube" }
      ]
    }
  ]
};
