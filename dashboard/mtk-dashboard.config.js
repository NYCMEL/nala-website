var _dashT = (window.i18n && typeof window.i18n.t === 'function')
    ? function (key, fallback) {
        var value = window.i18n.t(key);
        return value === key ? fallback : value;
      }
    : function (_key, fallback) {
        return fallback;
      };

window.mtkDashboardConfig = {
    user: {
        fullName: "User"
    },
    progress: {
        label: _dashT("dashboard.progress.label", "Your progress to date:"),
        percentage: 0,
        courseTitle: _dashT("dashboard.course.title", "NALA - Locksmith Course")
    },
    subscriptions: {
        title: _dashT("dashboard.chooseNext", "Choose your next step:"),
        options: []
    }
};
