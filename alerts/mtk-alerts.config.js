const MTKAlertsConfig = {
  labels: {
    title: "Alerts",
    unread: "Unread",
    archived: "Archived",
    markRead: "Mark as Read",
    archive: "Archive",
    delete: "Delete",
    noUnread: "No unread alerts",
    noArchived: "No archived alerts",
    confirmDelete: "Delete this alert?",
    back: "Back to Alerts",
    viewArchived: "View Archived",
    viewUnread: "View Unread"
  },
  alerts: [
    {
      id: "alert-001",
      type: "error",
      icon: "error",
      title: "Database Connection Failed",
      message: "The primary database connection has timed out. Failover to secondary DB was initiated automatically. Please review your connection settings.",
      timestamp: "2025-04-29T08:15:00Z",
      read: false,
      archived: false
    },
    {
      id: "alert-002",
      type: "warning",
      icon: "warning",
      title: "Storage Capacity at 85%",
      message: "Your cloud storage is at 85% capacity. Consider archiving older files or upgrading your storage plan to avoid service interruption.",
      timestamp: "2025-04-29T07:42:00Z",
      read: false,
      archived: false
    },
    {
      id: "alert-003",
      type: "success",
      icon: "check_circle",
      title: "Deployment Successful",
      message: "Version 3.4.1 has been deployed to production successfully. All health checks passed. Zero downtime achieved.",
      timestamp: "2025-04-28T23:10:00Z",
      read: false,
      archived: false
    },
    {
      id: "alert-004",
      type: "info",
      icon: "info",
      title: "Scheduled Maintenance Window",
      message: "A scheduled maintenance window is planned for May 3rd, 2025, from 02:00 to 04:00 UTC. Services may be briefly unavailable.",
      timestamp: "2025-04-28T18:00:00Z",
      read: false,
      archived: false
    },
    {
      id: "alert-005",
      type: "warning",
      icon: "security",
      title: "Unusual Login Activity Detected",
      message: "A login attempt was made from an unrecognized device in São Paulo, Brazil. If this was not you, please reset your password immediately.",
      timestamp: "2025-04-28T14:30:00Z",
      read: false,
      archived: false
    },
    {
      id: "alert-006",
      type: "info",
      icon: "system_update",
      title: "System Update Available",
      message: "A new system update (v4.0.0) is available. This update includes performance improvements and security patches.",
      timestamp: "2025-04-27T09:00:00Z",
      read: true,
      archived: true
    },
    {
      id: "alert-007",
      type: "success",
      icon: "backup",
      title: "Backup Completed",
      message: "Weekly backup completed successfully. All data has been securely stored to the offsite backup server.",
      timestamp: "2025-04-27T03:00:00Z",
      read: true,
      archived: true
    }
  ],
  events: {
    alertRead:    "mtk-alerts:read",
    alertArchive: "mtk-alerts:archive",
    alertDelete:  "mtk-alerts:delete",
    alertView:    "mtk-alerts:view"
  }
};
