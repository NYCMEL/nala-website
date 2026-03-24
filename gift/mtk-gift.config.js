const MTKGiftConfig = {
  gift: {
    id: "mtk-gift-lockout-kit",
    title: "Your Free Lockout Kit",
    subtitle: "We'll ship it right to your door — completely free.",
    icon: "card_giftcard",
    form: {
      addressLabel: "Where do you want us to send your free Lockout Kit?",
      fields: [
        {
          id: "full-name",
          name: "fullName",
          type: "text",
          label: "Full Name",
          placeholder: " ",
          required: true,
          autocomplete: "name",
          icon: "person",
          gridCol: "col-12"
        },
        {
          id: "address-line1",
          name: "addressLine1",
          type: "text",
          label: "Street Address",
          placeholder: " ",
          required: true,
          autocomplete: "address-line1",
          icon: "home",
          gridCol: "col-12"
        },
        {
          id: "address-line2",
          name: "addressLine2",
          type: "text",
          label: "Apt, Suite, Unit (optional)",
          placeholder: " ",
          required: false,
          autocomplete: "address-line2",
          icon: "apartment",
          gridCol: "col-12"
        },
        {
          id: "city",
          name: "city",
          type: "text",
          label: "City",
          placeholder: " ",
          required: true,
          autocomplete: "address-level2",
          icon: "location_city",
          gridCol: "col-12 col-md-6"
        },
        {
          id: "state",
          name: "state",
          type: "select",
          label: "State",
          placeholder: " ",
          required: true,
          autocomplete: "address-level1",
          icon: "map",
          gridCol: "col-12 col-md-6",
          options: [
            { value: "", label: "State" },
            { value: "AL", label: "AL" },
            { value: "AK", label: "AK" },
            { value: "AZ", label: "AZ" },
            { value: "AR", label: "AR" },
            { value: "CA", label: "CA" },
            { value: "CO", label: "CO" },
            { value: "CT", label: "CT" },
            { value: "DE", label: "DE" },
            { value: "FL", label: "FL" },
            { value: "GA", label: "GA" },
            { value: "HI", label: "HI" },
            { value: "ID", label: "ID" },
            { value: "IL", label: "IL" },
            { value: "IN", label: "IN" },
            { value: "IA", label: "IA" },
            { value: "KS", label: "KS" },
            { value: "KY", label: "KY" },
            { value: "LA", label: "LA" },
            { value: "ME", label: "ME" },
            { value: "MD", label: "MD" },
            { value: "MA", label: "MA" },
            { value: "MI", label: "MI" },
            { value: "MN", label: "MN" },
            { value: "MS", label: "MS" },
            { value: "MO", label: "MO" },
            { value: "MT", label: "MT" },
            { value: "NE", label: "NE" },
            { value: "NV", label: "NV" },
            { value: "NH", label: "NH" },
            { value: "NJ", label: "NJ" },
            { value: "NM", label: "NM" },
            { value: "NY", label: "NY" },
            { value: "NC", label: "NC" },
            { value: "ND", label: "ND" },
            { value: "OH", label: "OH" },
            { value: "OK", label: "OK" },
            { value: "OR", label: "OR" },
            { value: "PA", label: "PA" },
            { value: "RI", label: "RI" },
            { value: "SC", label: "SC" },
            { value: "SD", label: "SD" },
            { value: "TN", label: "TN" },
            { value: "TX", label: "TX" },
            { value: "UT", label: "UT" },
            { value: "VT", label: "VT" },
            { value: "VA", label: "VA" },
            { value: "WA", label: "WA" },
            { value: "WV", label: "WV" },
            { value: "WI", label: "WI" },
            { value: "WY", label: "WY" },

            { value: "DC", label: "DC" },
            { value: "AS", label: "AS" },
            { value: "GU", label: "GU" },
            { value: "MP", label: "MP" },
            { value: "PR", label: "PR" },
            { value: "UM", label: "UM" },
            { value: "VI", label: "VI" },
          ]
        },
        {
          id: "zip",
          name: "zip",
          type: "text",
          label: "ZIP Code",
          placeholder: " ",
          required: true,
          autocomplete: "postal-code",
          icon: "pin",
          gridCol: "col-12 col-md-3",
          pattern: "^[0-9]{5}(-[0-9]{4})?$",
          maxLength: 10
        }
      ],
      buttons: {
        submit: {
          label: "Send My Kit",
          icon: "send",
          type: "submit"
        },
        cancel: {
          label: "Cancel",
          icon: "close",
          type: "button"
        }
      }
    },
    messages: {
      success: "Your free Lockout Kit is on the way! 🎁",
      error: "Please fill in all required fields.",
      cancel: "Request cancelled."
    },
    events: {
      submit: "mtk-gift:submit",
      cancel: "mtk-gift:cancel",
      open: "mtk-gift:open",
      close: "mtk-gift:close"
    },
    deliveryApi: {
      endpoint: "",
      enabled: false
    }
  }
};
