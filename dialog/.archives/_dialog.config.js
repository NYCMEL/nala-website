window.app = window.app || {};

window.app.dialog = {
    id: "_dialog-1",
    title: "Confirm Action",
    body: "<p>Are you sure you want to perform this action?</p>",
    actions: [
	{ text: "Cancel", type: "cancel" },
	{ text: "Confirm", type: "confirm" }
    ]
};

