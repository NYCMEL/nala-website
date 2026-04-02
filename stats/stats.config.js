window.app = window.app || {};

function _t(key, fallback) {
    return window.i18n ? window.i18n.t(key) : fallback;
}

window.app.stats = [
    {
	"id": "students",
	"value": 20,
	"suffix": "K+",
	"label": _t("stats.students", "Students Trained")
    },
    {
	"id": "placement",
	"value": 95,
	"suffix": "%",
	"label": _t("stats.placement", "Job Placement")
    },
    {
	"id": "experience",
	"value": 10,
	"suffix": "+",
	"label": _t("stats.experience", "Years Experience")
    }
];
