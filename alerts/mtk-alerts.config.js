function _alertsT(key, fallback) {
    if (!window.i18n || typeof window.i18n.t !== 'function') return fallback;
    const value = window.i18n.t(key);
    return value === key ? fallback : value;
}

const MTKAlertsConfig = {
    labels: {
	title:         _alertsT("alerts.title", "Alerts"),
	unread:        _alertsT("alerts.unread", "Unread"),
	archived:      _alertsT("alerts.archived", "Archived"),
	markRead:      _alertsT("alerts.markRead", "Mark as Read"),
	archive:       _alertsT("alerts.archive", "Archive"),
	delete:        _alertsT("alerts.delete", "Delete"),
	noUnread:      _alertsT("alerts.noUnread", "No unread alerts"),
	noArchived:    _alertsT("alerts.noArchived", "No archived alerts"),
	confirmDelete: _alertsT("alerts.confirmDelete", "Delete this alert?"),
	back:          _alertsT("alerts.back", "Back to Alerts"),
	viewArchived:  _alertsT("alerts.viewArchived", "View Archived"),
	viewUnread:    _alertsT("alerts.viewUnread", "View Unread"),
	date:          _alertsT("alerts.date", "Date"),
	message:       _alertsT("alerts.message", "Message"),
	actions:       _alertsT("alerts.actions", "Actions")
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
