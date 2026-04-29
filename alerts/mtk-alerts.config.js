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
      id:        "alert-001",
      type:      "error",
      icon:      "error",
      title:     "Database Connection Failed",
      message:   "The primary database connection timed out after 30 seconds with error code ECONNREFUSED.\n\nFailover to the secondary database was initiated automatically. During this switch a brief read-only window of approximately 8 seconds was observed.\n\nAction required: Review your connection pool settings and confirm the primary host is reachable. Contact the infrastructure team if the issue persists beyond the next maintenance window.",
      timestamp: "2025-04-29T08:15:00Z",
      read:      false,
      archived:  false
    },
    {
      id:        "alert-002",
      type:      "warning",
      icon:      "warning",
      title:     "Storage Capacity at 85%",
      message:   "Your cloud storage bucket (us-east-1, prod-assets) has reached 85% of its allocated 2 TB capacity.\n\nAt the current growth rate of ~12 GB/day, the bucket will reach 100% in approximately 12 days.\n\nRecommended actions:\n• Archive logs older than 90 days to cold storage\n• Enable lifecycle rules to auto-expire temp files\n• Or upgrade your storage plan to 5 TB ($0.023/GB/month)",
      timestamp: "2025-04-29T07:42:00Z",
      read:      false,
      archived:  false
    },
    {
      id:        "alert-003",
      type:      "success",
      icon:      "check_circle",
      title:     "Deployment Successful — v3.4.1",
      message:   "Version 3.4.1 was deployed to production at 23:10 UTC with zero downtime.\n\nChanges included in this release:\n• Performance: reduced API p95 latency from 340 ms to 190 ms\n• Fix: resolved race condition in the session refresh flow\n• Security: rotated all third-party OAuth tokens\n\nAll health checks passed. Rollback window expires in 24 hours. Deployment log available in the CI dashboard.",
      timestamp: "2025-04-28T23:10:00Z",
      read:      false,
      archived:  false
    },
    {
      id:        "alert-004",
      type:      "info",
      icon:      "info",
      title:     "Scheduled Maintenance — May 3rd",
      message:   "A planned maintenance window has been scheduled for Saturday, May 3rd, 2025 between 02:00 and 04:00 UTC.\n\nDuring this window the following services will be unavailable:\n• API Gateway (all regions)\n• Admin dashboard\n• Webhook delivery (queued, not dropped)\n\nUser-facing read operations will remain available via the CDN cache. No data will be lost. A status page update will be posted 30 minutes before the window begins.",
      timestamp: "2025-04-28T18:00:00Z",
      read:      false,
      archived:  false
    },
    {
      id:        "alert-005",
      type:      "warning",
      icon:      "security",
      title:     "Unusual Login Activity Detected",
      message:   "A login attempt was recorded from an unrecognized device and location:\n\n  Location: São Paulo, Brazil (IP 177.84.xx.xx)\n  Device:   Chrome 124 / Windows 11\n  Time:     April 28, 2025 at 14:28 UTC\n\nThis differs significantly from your usual access pattern (New York, macOS).\n\nIf this was you, no action is needed. If not, reset your password immediately and review active sessions under Security Settings. We have temporarily flagged this session for review.",
      timestamp: "2025-04-28T14:30:00Z",
      read:      false,
      archived:  false
    },
    {
      id:        "alert-006",
      type:      "info",
      icon:      "system_update",
      title:     "System Update Available — v4.0.0",
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
