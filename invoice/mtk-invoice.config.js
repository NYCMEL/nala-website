window.MTK_INVOICE_CONFIG = {
  component: "mtk-invoice",
  version: "1.0.2",

  labels: {
    title: "Locksmith Invoice",
    subtitle: "Create a quick service invoice.",
    printButton: "Print",
    customerHeading: "Customer",
    serviceHeading: "Service Details",
    totalsHeading: "Totals",
    saveButton: "Save Invoice"
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
      { id: "businessName", label: "Business Name", type: "text", value: "", helper: "Example: ABC Locksmith Services", required: true },
      { id: "invoiceNumber", label: "Invoice #", type: "text", value: "", helper: "Example: INV-1001", required: true },
      { id: "businessPhone", label: "Business Phone", type: "tel", value: "", helper: "Example: (555) 555-5555", required: true },
      { id: "invoiceDate", label: "Invoice Date", type: "date", value: "", helper: "Example: 2026-04-29", required: true }
    ],

    customer: [
      { id: "customerName", label: "Customer Name", type: "text", value: "", helper: "Example: Jane Smith", required: true },
      { id: "customerPhone", label: "Customer Phone", type: "tel", value: "", helper: "Example: (555) 123-4567", required: true },
      { id: "serviceAddress", label: "Service Address", type: "text", value: "", helper: "Example: 123 Main Street, Tampa, FL", required: true, full: true }
    ],

    service: [
      {
        id: "serviceType",
        label: "Service Type",
        type: "select",
        value: "",
        helper: "Select service type",
        options: [
          "Lockout Service",
          "Rekey Service",
          "Deadbolt Installation",
          "Lock Repair",
          "Commercial Lock Change",
          "Emergency Service"
        ]
      },
      { id: "serviceFee", label: "Service Fee", type: "number", value: "", helper: "Example: 95" },
      { id: "partsMaterials", label: "Parts / Materials", type: "number", value: "", helper: "Example: 25" },
      { id: "emergencyFee", label: "Emergency Fee", type: "number", value: "", helper: "Example: 50" },
      { id: "discount", label: "Discount", type: "number", value: "", helper: "Example: 10" },
      { id: "taxRate", label: "Tax Rate %", type: "number", value: "", helper: "Example: 6.625" },
      { id: "notes", label: "Notes", type: "textarea", value: "", helper: "Example: Rekeyed front door lock and tested keys.", full: true }
    ]
  }
};