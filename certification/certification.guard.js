(function () {
    function toNumber(value) {
        var number = Number(value);
        return Number.isFinite(number) ? number : 0;
    }

    function isTruthyFlag(value) {
        if (value === true || value === 1) return true;
        if (typeof value === 'string') {
            return ['1', 'true', 'yes', 'completed', 'complete'].indexOf(value.toLowerCase()) !== -1;
        }
        return false;
    }

    function hasCompletedProgram(session) {
        session = session || {};
        var user = session.user || {};
        var dashboard = session.dashboard || {};

        var progress = Math.max(
            toNumber(dashboard.progress),
            toNumber(dashboard.percentage),
            toNumber(user.progress),
            toNumber(user.progress_percent),
            toNumber(user.completion_percentage),
            toNumber(user.course_progress)
        );

        return progress >= 100 ||
            isTruthyFlag(user.completed) ||
            isTruthyFlag(user.has_completed) ||
            isTruthyFlag(user.course_completed) ||
            isTruthyFlag(user.certification_unlocked) ||
            isTruthyFlag(user.can_view_certification) ||
            isTruthyFlag(user.status);
    }

    function applyCertificationAccess() {
        var content = document.getElementById('mtk-certification-content');
        var locked = document.getElementById('mtk-certification-locked');
        var session = (window.wc && wc.session) ? wc.session : {};
        var allowed = hasCompletedProgram(session);

        if (content) content.hidden = !allowed;
        if (locked) locked.hidden = allowed;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyCertificationAccess);
    } else {
        applyCertificationAccess();
    }

    setTimeout(applyCertificationAccess, 250);
    window.addEventListener('focus', applyCertificationAccess);
})();
