const MTKDialogConfig = {
    dialog: {
	id: "mtk-dialog-main",
	title: "Confirm Action",
	message: "Are you sure you want to proceed with this action? This cannot be undone.",
	icon: "warning",
	iconColor: "#F59E0B",
	closeOnBackdrop: true,
	closeOnEscape: true,
	maxWidth: "480px",
	buttons: [
	    {
		label: "Cancel",
		action: "cancel",
		classes: "btn btn-link"
	    },
	    {
		label: "Delete",
		action: "delete",
		classes: "btn btn-danger"
	    },
	    {
		label: "Confirm",
		action: "confirm",
		classes: "btn btn-primary"
	    }
	]
    }
};
