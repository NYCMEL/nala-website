window.MTK_INVOICE_CONFIG = {
  component: "mtk-invoice",
  version: "1.0.1",

  labels: {
    title: "Locksmith Invoice",
    subtitle: "Create a quick service invoice.",
    printButton: "Print",
    customerHeading: "Customer",
    serviceHeading: "Service Details",
    totalsHeading: "Totals",
    submitLabel: "Save Invoice"
  },

  events: {
    publish: {
      ready: "mtk-invoice:ready",
      print: "mtk-invoice:print",
      save: "mtk-invoice:save",
      change: "mtk-invoice:change"
    },
    subscribe: [
      "4-mtk-invoice",
      "4-mtk-invoice:reset",
      "4-mtk-invoice:print",
      "4-mtk-invoice:set-data"
    ]
  },

  fields: {
    business: [
      { id: "businessName", label: "Business Name", type: "text", value: "", placeholder: "Example: ABC Locksmith Services", required: true },
      { id: "invoiceNumber", label: "Invoice #", type: "text", value: "", placeholder: "Example: INV-1001", required: true },
      { id: "businessPhone", label: "Business Phone", type: "tel", value: "", placeholder: "Example: (555) 555-5555", required: true },
      { id: "invoiceDate", label: "Invoice Date", type: "date", value: "", placeholder: "Example: 2026-04-29", required: true }
    ],

    customer: [
      { id: "customerName", label: "Customer Name", type: "text", value: "", placeholder: "Example: Jane Smith", required: true },
      { id: "customerPhone", label: "Customer Phone", type: "tel", value: "", placeholder: "Example: (555) 123-4567", required: true },
      { id: "serviceAddress", label: "Service Address", type: "text", value: "", placeholder: "Example: 123 Main Street, Tampa, FL", required: true, full: true }
    ],

    service: [
      {
        id: "serviceType",
        label: "Service Type",
        type: "select",
        value: "",
        placeholder: "Select service type",
        options: [
          "Lockout Service",
          "Rekey Service",
          "Deadbolt Installation",
          "Lock Repair",
          "Commercial Lock Change",
          "Emergency Service"
        ]
      },
      { id: "serviceFee", label: "Service Fee", type: "number", value: "", placeholder: "Example: 95" },
      { id: "partsMaterials", label: "Parts / Materials", type: "number", value: "", placeholder: "Example: 25" },
      { id: "emergencyFee", label: "Emergency Fee", type: "number", value: "", placeholder: "Example: 50" },
      { id: "discount", label: "Discount", type: "number", value: "", placeholder: "Example: 10" },
      { id: "taxRate", label: "Tax Rate %", type: "number", value: "", placeholder: "Example: 6.625" },
      { id: "notes", label: "Notes", type: "textarea", value: "", placeholder: "Example: Rekeyed front door lock and tested keys.", full: true }
    ]
  }
};