window.mtkCardConfig = {
  component: "mtk-card",
  version: "1.0.0",
  sourceImage: "card-1.png",
  eventPrefix: "mtk-card",
  subscribeTopic: "4-mtk-card",
  ariaLabel: "Locksmith business card",
  labels: {
    enabled: true,
    background: "wheat",
    coverFields: true
  },
  card: {
    logoText: "Locksmith",
    companyName: "COMPANY NAME",
    personName: "John Smith",
    personTitle: "Manager",
    addressLine1: "123 Maine Street",
    addressLine2: "City, ST 00000",
    phoneLabel: "Tel:",
    phone: "123-456-7890",
    email: "Info@printit4less.com"
  },
  actions: {
    cardClick: "mtk-card:card-clicked",
    fieldClick: "mtk-card:field-clicked",
    ready: "mtk-card:ready"
  }
};
