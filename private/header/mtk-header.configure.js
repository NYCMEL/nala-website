window.app = window.app || {};

window.app.header = {
  theme: "dark",
  logo: {
    src: "https://via.placeholder.com/200x65?text=LOGO",
    alt: "Company Logo",
    href: "#"
  },
  menus: [
    {
      id: "account",
      label: "Account",
      type: "dropdown",
      items: [
        { id: "profile", label: "Profile" },
        { id: "logout", label: "Logout" }
      ]
    },
    {
      id: "dashboard",
      label: "Dashboard",
      href: "#dashboard"
    },
    {
      id: "settings",
      label: "Settings",
      href: "#settings"
    }
  ]
};
