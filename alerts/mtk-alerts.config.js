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
    alerts: [
	{
	    id:        "alert-006",
	    type:      "info",
	    icon:      "system_update",
	    title:     "System Update Available — v4.0.0",
	    message:   "Welcome to Nala. Your unread messages appear here",
	    timestamp: "2025-04-27T09:00:00Z",
	    read:      false,
	    archived:  false
	},
	{
	    id:        "alert-006",
	    type:      "info",
	    icon:      "system_update",
	    title:     "Nala Unboarding...",
	    message:   "A major system update (v4.0.0) is ready to install.\n\nHighlights:\n• Redesigned dashboard with customizable widgets\n• New role-based access control (RBAC) engine\n• Native dark mode support\n• 40% reduction in bundle size via tree-shaking\n\nThis update requires a 5-minute restart. Schedule it during a low-traffic period. Full release notes are available in the changelog.",
	    timestamp: "2025-04-27T09:00:00Z",
	    read:      true,
	    archived:  true
	},
	{
	    id:        "alert-007",
	    type:      "success",
	    icon:      "backup",
	    title:     "Weekly Backup Completed",
	    message:   "The weekly full-system backup completed successfully on April 27th at 03:00 UTC.\n\nBackup summary:\n  Duration:      47 minutes\n  Total size:    284 GB (compressed: 91 GB)\n  Destination:   offsite-backup-eu-west-1\n  Encryption:    AES-256-GCM\n  Retention:     90 days\n\nThe backup has been verified against its SHA-256 checksum. No errors or warnings were recorded.",
	    timestamp: "2025-04-27T03:00:00Z",
	    read:      true,
	    archived:  true
	}
    ],
    events: {
	alertRead:    "mtk-alerts:read",
	alertArchive: "mtk-alerts:archive",
	alertDelete:  "mtk-alerts:delete",
	alertView:    "mtk-alerts:view"
    }
};

window.MTKAlertsConfig = MTKAlertsConfig;
