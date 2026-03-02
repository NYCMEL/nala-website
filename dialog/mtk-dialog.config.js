window.app = window.app || {};

window.app.dialog = {
    title: "Delete Record",
    message: "Are you sure you want to delete this record? This action cannot be undone.",
    ariaLabel: "Confirmation Dialog",
    buttons: [
	{
	    label: "Cancel",
	    class: "btn-link",
	    event: "dialog.cancel"
	},
	{
	    label: "Yes, Delete",
	    class: "btn-success",
	    event: "dialog.delete"
	}
    ]
};
