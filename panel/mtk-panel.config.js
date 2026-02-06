// MTK-panel.config.js
window.app = window.app || {};

// Panel metadata array (content is inline in HTML)
app.panels = [
    {
	id: "panel-1",
	height: 260,
	background: "#f5f5f5",
	columns: [
	    { col: "col-md-4" },   // left column width
	    { col: "col-md-8" }    // right column width
	]
    },
    {
	id: "panel-2",
	height: 200,
	background: "#ffffff",
	columns: [
	    { col: "col-md-6" },   // left column width
	    { col: "col-md-6" }    // right column width
	]
    }
];
