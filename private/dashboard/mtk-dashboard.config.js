window.app = window.app || {};

window.app.dashboard = {
  title: "<strong>Sales Performance</strong>",
  description: "<p>High level overview of <em>revenue, leads, and pipeline</em>.</p>",
  tiles: [
    {
      title: "<span>Revenue</span>",
      description: "<p>Total sales for the current period.</p>",
      event: "nav.revenue"
    },
    {
      title: "<span>Leads</span>",
      description: "<p>New inbound opportunities.</p>",
      event: "nav.leads"
    },
    {
      title: "<span>Pipeline</span>",
      description: "<p>Active deals in progress.</p>",
      event: "nav.pipeline"
    }
  ]
};
