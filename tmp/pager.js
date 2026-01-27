class Pager {
    constructor(pagerId) {
        this.pager = document.getElementById(pagerId);
        this.sections = {};
        this.init();
    }

    init() {
        PubSub.subscribe('navigate', (sectionId) => {
            this.showSection(sectionId);
        });
    }

    async showSection(sectionId) {
        let section = this.sections[sectionId];

        if (!section) {
            section = document.createElement('div');
            section.id = `_pager-${sectionId}`;
            section.classList.add('pager-section');
            this.pager.appendChild(section);
            this.sections[sectionId] = section;
        }

        // Hide all other sections
        Object.values(this.sections).forEach(sec => sec.classList.remove('active'));

        // Show existing content immediately
        section.classList.add('active');

        // Only fetch if not loaded
        if (!section.dataset.loaded) {
            const loadingDiv = document.createElement('div');
            loadingDiv.classList.add('loading');
            loadingDiv.innerText = 'Loading...';
            section.appendChild(loadingDiv);

            const content = await this.loadContent(sectionId);

            section.innerHTML = content;
            section.dataset.loaded = "true";
        }
    }

    async loadContent(sectionId) {
        try {
            const res = await fetch('pagerContent.json');
            const data = await res.json();
            return data[sectionId] || '<p>Content not found.</p>';
        } catch (err) {
            return '<p>Error loading content.</p>';
        }
    }
}

const pager = new Pager('_pager');
