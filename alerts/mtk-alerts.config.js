const MTKAlertsConfig = {
    labels: {
	title:         "Alerts",
	unread:        "Unread",
	archived:      "Archived",
	markRead:      "Mark as Read",
	archive:       "Archive",
	delete:        "Delete",
	noUnread:      "No unread alerts",
	noArchived:    "No archived alerts",
	confirmDelete: "Delete this alert?",
	back:          "Back to Alerts",
	viewArchived:  "View Archived",
	viewUnread:    "View Unread"
    },
    alerts: [],
    events: {
	alertRead:    "mtk-alerts:read",
	alertArchive: "mtk-alerts:archive",
	alertDelete:  "mtk-alerts:delete",
	alertView:    "mtk-alerts:view"
    }
};

window.MTKAlertsConfig = MTKAlertsConfig;
