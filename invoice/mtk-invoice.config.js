window.MTK_INVOICE_CONFIG = {
  component: "mtk-invoice",
  version: "1.0.0",
  labels: {
    title: "Locksmith Invoice",
    subtitle: "Create a quick service invoice and print or save as PDF.",
    printButton: "Print / Save PDF",
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
      { id: "businessName", label: "Business Name", placeholder: "Example: ABC Locksmith Services", type: "text", value: "", required: true },
      { id: "invoiceNumber", label: "Invoice #", placeholder: "Example: INV-1001", type: "text", value: "", required: true },
      { id: "businessPhone", label: "Business Phone", placeholder: "Example: (555) 555-5555", type: "tel", value: "", required: true },
      { id: "invoiceDate", label: "Invoice Date", placeholder: "Example: 2026-04-29", type: "date", value: "", required: true }
    ],
    customer: [
      { id: "customerName", label: "Customer Name", placeholder: "Example: Jane Smith", type: "text", value: "", required: true },
      { id: "customerPhone", label: "Customer Phone", placeholder: "Example: (555) 123-4567", type: "tel", value: "", required: true },
      { id: "serviceAddress", label: "Service Address", placeholder: "Example: 123 Main Street, Tampa, FL", type: "text", value: "", required: true, full: true }
    ],
    service: [
      { id: "serviceType", label: "Service Type", type: "select", value: "", options: ["Lockout Service", "Rekey Service", "Deadbolt Installation", "Lock Repair", "Commercial Lock Change", "Emergency Service"] },
      { id: "serviceFee", label: "Service Fee", placeholder: "Example: 95", type: "number", value: "" },
      { id: "partsMaterials", label: "Parts / Materials", placeholder: "Example: 25", type: "number", value: "" },
      { id: "emergencyFee", label: "Emergency Fee", placeholder: "Example: 50", type: "number", value: "" },
      { id: "discount", label: "Discount", placeholder: "Example: 10", type: "number", value: "" },
      { id: "taxRate", label: "Tax Rate %", placeholder: "Example: 6.625", type: "number", value: "" },
      { id: "notes", label: "Notes", type: "textarea", value: "", placeholder: "Example: Rekeyed front door lock and tested keys.", full: true }
    ]
  }
};