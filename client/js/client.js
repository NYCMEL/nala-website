function waitForElement(selector, root = document, timeout = 8000) {
    return new Promise((resolve, reject) => {
	const el = root.querySelector(selector)
	if (el) return resolve(el)

	const observer = new MutationObserver(() => {
	    const el = root.querySelector(selector)
	    if (el) {
		observer.disconnect()
		resolve(el)
	    }
	})

	observer.observe(root, {
	    childList: true,
	    subtree: true,
	})

	setTimeout(() => {
	    observer.disconnect()
	    reject(new Error("Timeout waiting for: " + selector))
	}, timeout)
    })
}

// Public API: client(config)
// Assigned to both window and var so jQuery globalEval context can find it
var client = window.client = function(config) {
    if (window._clientProfileInstance) return  // guard against multiple instantiation
    waitForElement('.client-container').then(function() {
        wc.log('[client] DOM ready, instantiating ClientProfile');
        window._clientProfileInstance = new ClientProfile(config);
    });
};

class ClientProfile {
    constructor(data) {
	this.data = data
	this.data.reviews = Array.isArray(this.data.reviews) ? this.data.reviews : []
	this.init()
    }

    init() {
	this.applyExternalLogo()
	this.renderHeader()
	this.renderStats()
	this.renderTabs()
	this.renderContent()
	this.renderSidebar()
	this.attachEventListeners()
	this.initGlobalClickListener()
	// Always show header bar
	this.initEditSwitch()
	this.bindExternalLogo()
	this.loadSavedReviews()
	if (this.data && this.data.business && this.data.business.name) {
	    document.title = this.data.business.name
	}
    }

    applyExternalLogo() {
	try {
	    const stored = JSON.parse(localStorage.getItem('nalaBiabLogo') || 'null')
	    if (stored && stored.logo) {
		this.data.business.logo = stored.logo
		if (stored.businessName && (!this.data.business.name || this.data.business.name === 'Your Company Name')) {
		    this.data.business.name = stored.businessName
		}
	    }
	} catch (err) {
	    wc.warn('[client] Could not apply stored BIAB logo', err)
	}
    }

    bindExternalLogo() {
	window.addEventListener('message', (event) => {
	    if (!event.data || event.data.type !== 'nala:biab-logo' || !event.data.payload) return
	    this.data.business.logo = event.data.payload.logo
	    if (event.data.payload.businessName) this.data.business.name = event.data.payload.businessName
	    this.renderHeader()
	    document.title = this.data.business.name
	})
    }

    loadSavedReviews() {
	const uid = new URLSearchParams(window.location.search).get('nalaUID') || (this.data && this.data.nalaUID) || ''
	if (!uid || !window.fetch) return

	const self = this
	fetch((window.wc && wc.apiURL ? wc.apiURL : '') + '/api/business_in_a_box_reviews.php?nalaUID=' + encodeURIComponent(uid), {
	    credentials: 'include'
	}).then(function(res) {
	    return res.json().then(function(json) {
		if (!res.ok) throw new Error((json && (json.error || json.message)) || 'Could not load reviews.')
		return json
	    })
	}).then(function(json) {
	    if (Array.isArray(json.reviews) && json.reviews.length) {
		self.data.reviews = json.reviews
		self.data.business.rating = Number(json.rating || self.data.business.rating)
		self.data.business.reviewCount = Number(json.reviewCount || self.data.business.reviewCount)
		self.renderHeader()
		self.renderReviews()
	    }
	}).catch(function(err) {
	    wc.warn('[client] Could not load saved reviews', err)
	})
    }

    initEditSwitch() {
	// Hide header entirely when loading from ?nalaUID= URL
	if (new URLSearchParams(window.location.search).get('nalaUID')) {
	    return
	}
	const bar     = document.getElementById('editModeBar')
	const toggle  = document.getElementById('editModeToggle')
	const slider  = bar && bar.querySelector('.edit-switch-slider')
	const knob    = bar && bar.querySelector('.edit-switch-knob')
	const saveBtn = document.getElementById('saveChangesBtn')
	if (!bar || !toggle) return

	// Always show the bar
	bar.style.display = 'flex'
	bar.style.flexDirection = 'column'
	this.renderPersonalUrl()

	// Only show controls if editable is defined
	// Always show edit controls on /client (nalaUID guard already handled above)
	const controls = bar.querySelector('.bar-controls')
	if (controls) controls.style.display = 'flex'

	// Always start in review mode
	toggle.checked = false
	this._applyEditSwitchStyle(slider, knob, false)

	// Save Changes — replace handler each time to avoid stacking listeners
	if (saveBtn) {
	    const self = this
	    const saveHandler = function() {
		const changes = {}

		// Text editable fields
		document.querySelectorAll('[data-editable]').forEach(function(el) {
		    if (el.id === 'socialMediaLinks') return // handled separately
		    if (el.id === 'clientLogo') return       // handled separately (base64)
		    if (el.dataset.statIndex !== undefined) return // handled separately below
		    const key = el.id || el.className
		    changes[key] = el.textContent.trim()
		})

		// Stats — collect updated number and write back into this.data so renderStats() uses new value
		const updatedStats = []
		document.querySelectorAll('[data-stat-index]').forEach(function(el) {
		    const i = parseInt(el.dataset.statIndex)
		    const newNum = el.textContent.trim()
		    updatedStats[i] = newNum
		    // Update the data so renderStats() re-renders with the new number
		    const stat = self.data.stats[i]
		    if (stat) {
			const match = stat.text.match(/^(\d+)(.*)$/)
			if (match) stat.text = newNum + match[2]
		    }
		})
		if (updatedStats.length) changes.stats = updatedStats

		// Logo (if updated)
		const logoImg = document.querySelector('#clientLogo img')
		if (logoImg && logoImg.src.startsWith('data:')) {
		    changes.clientLogo = logoImg.src
		}

		// Social media links
		const socialLinks = []
		document.querySelectorAll('.social-url').forEach(function(input) {
		    const i = parseInt(input.dataset.index)
		    const link = self.data.socialMedia.links[i]
		    if (link) socialLinks.push({ platform: link.platform, icon: link.icon, url: input.value.trim() })
		})
		if (socialLinks.length) changes.socialMedia = socialLinks

		wc.log('[client] Save Changes →', changes)
		wc.publish('client:save', changes)

		// Generate new config file content (without editable:true)
		const configJs = self._generateConfigJs(changes)
		wc.log('[client] Generated config for /websites/' + (changes.nalaUID || self.data.nalaUID) + '.js:\n' + configJs)

		// Switch to review mode
		toggle.checked = false
		self._applyEditSwitchStyle(slider, knob, false)
		self.disableEditable()

		// Visual feedback
		newSaveBtn.textContent = 'Saved ✓'
		newSaveBtn.style.background = '#2e7d32'
		setTimeout(function() {
		    newSaveBtn.style.display = 'none'
		    newSaveBtn.textContent = 'Save Changes'
		    newSaveBtn.style.background = '#7a5e0c'
		}, 2000)
	    }
	    // Strip all previous click listeners via cloneNode, then attach once
	    const newSaveBtn = saveBtn.cloneNode(true)
	    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn)
	    newSaveBtn.addEventListener('click', saveHandler)
	}

	const self = this
	toggle.addEventListener('change', function() {
	    const isEdit = toggle.checked
	    self._applyEditSwitchStyle(slider, knob, isEdit)
	    if (isEdit) {
		wc.log('[client] Switch → Edit mode')
		self.enableEditable()
		const btn = document.getElementById('saveChangesBtn')
		if (btn) btn.style.display = 'inline-block'
	    } else {
		wc.log('[client] Switch → Review mode')
		self.disableEditable()
		const btn = document.getElementById('saveChangesBtn')
		if (btn) btn.style.display = 'none'
	    }
	})
    }

    renderPersonalUrl() {
	const urlText = document.getElementById('personalUrlText')
	const copyBtn = document.getElementById('copyPersonalUrlBtn')
	if (!urlText) return

	const uid = this.data && this.data.nalaUID ? String(this.data.nalaUID) : ''
	const url = this.getPersonalUrl(uid)
	urlText.textContent = url
	urlText.title = url

	if (copyBtn) {
	    copyBtn.onclick = function() {
		if (navigator.clipboard && navigator.clipboard.writeText) {
		    navigator.clipboard.writeText(url).then(function() {
			copyBtn.textContent = 'Copied'
			setTimeout(function() { copyBtn.textContent = 'Copy' }, 1400)
		    }).catch(function() {
			window.prompt('Copy your personal page URL:', url)
		    })
		} else {
		    window.prompt('Copy your personal page URL:', url)
		}
	    }
	}
    }

    getPersonalUrl(uid) {
	const origin = window.location.origin || ''
	const basePath = '/repo_deploy/client/index.html'
	const query = uid ? '?nalaUID=' + encodeURIComponent(uid) : ''
	return origin + basePath + query
    }

    _generateConfigJs(changes) {
	const d    = this.data
	const uid  = d.nalaUID || ''

	// Merge changes into a copy of the current data
	const name    = changes.clientName        || d.business.name
	const about   = changes.aboutText         || d.about.description
	const hours   = changes.businessHoursText || d.businessHours.text
	const payment = changes.paymentMethodsText|| d.paymentMethods.methods
	const gTitle  = changes.guaranteeTitle    || d.guarantee.title
	const gText   = d.guarantee.text
	const gLearn  = d.guarantee.learnMoreLink

	// Social links
	const socialLinks = (changes.socialMedia || d.socialMedia.links)
	    .map(function(l) {
		return '        { platform: "' + l.platform + '", icon: "' + l.icon + '", url: "' + (l.url||'') + '" }'
	    }).join(',\n')

	const reviews = (changes.reviews || d.reviews || [])
	    .map(function(r) {
		return '        ' + JSON.stringify({
		    id: r.id || '',
		    customerName: r.customerName || '',
		    rating: Number(r.rating || 0),
		    text: r.text || '',
		    createdAt: r.createdAt || '',
		    published: r.published !== false
		})
	    }).join(',\n')

	// Stats — merge updated numbers back in
	const stats = d.stats.map(function(s, i) {
	    const updatedNum = changes.stats && changes.stats[i]
	    const text = updatedNum
		? s.text.replace(/^\d+/, updatedNum)
		: s.text
	    return '        { icon: "' + s.icon + '", text: "' + text + '", type: "' + s.type + '" }'
	}).join(',\n')

	// Logo — use base64 or original path
	const logo = (changes.clientLogo && changes.clientLogo.startsWith('data:'))
	    ? changes.clientLogo
	    : d.business.logo

	return [
	    '// Auto-generated by NALA Go Live — ' + new Date().toISOString(),
	    '// nalaUID: ' + uid,
	    '',
	    'var config = {',
	    '    nalaUID:  "' + uid + '",',
	    '',
	    '    business: {',
	    '        name:        "' + name + '",',
	    '        logo:        "' + logo + '",',
	    '        rating:      ' + d.business.rating + ',',
	    '        ratingText:  "' + d.business.ratingText + '",',
	    '        reviewCount: ' + d.business.reviewCount + ',',
	    '        isTopPro:    ' + d.business.isTopPro + ',',
	    '        isOnline:    ' + d.business.isOnline + ',',
	    '    },',
	    '    stats: [',
	    stats,
	    '    ],',
	    '    contact: {',
	    '        priceText: "' + d.contact.priceText + '",',
	    '        ctaButton: "' + d.contact.ctaButton + '",',
	    '    },',
	    '    guarantee: {',
	    '        title:         "' + gTitle + '",',
	    '        text:          "' + gText + '",',
	    '        learnMoreLink: "' + gLearn + '",',
	    '    },',
	    '    tabs: [],',
	    '    about: {',
	    '        description: "' + about + '",',
	    '        readMoreLink: "",',
	    '    },',
	    '    businessHours: {',
	    '        title: "Business hours",',
	    '        text:  "' + hours + '",',
	    '    },',
	    '    paymentMethods: {',
	    '        title:   "Payment methods",',
	    '        methods: "' + payment + '",',
	    '    },',
	    '    socialMedia: {',
	    '        title: "Social media",',
	    '        links: [',
	    socialLinks,
	    '        ]',
	    '    },',
	    '    reviews: [',
	    reviews,
	    '    ],',
	    '    topProStatus: {',
	    '        title:       "' + d.topProStatus.title + '",',
	    '        description: "' + d.topProStatus.description + '",',
	    '        years:       ' + JSON.stringify(d.topProStatus.years) + ',',
	    '    },',
	    '}',
	    '',
	    'client(config);',
	].join('\n')
    }

    _applyEditSwitchStyle(slider, knob, isEdit) {
	if (slider) slider.style.background = isEdit ? '#a98212' : '#ccc'
	if (knob)   knob.style.transform    = isEdit ? 'translateX(20px)' : 'translateX(0)'
    }

    disableEditable() {
	document.querySelector('.client-container').classList.remove('edtable-mode')
	const hint = document.getElementById('editModeHint')
	if (hint) hint.style.display = 'none'

	document.querySelectorAll('[data-editable]').forEach(function(el) {
	    el.removeAttribute('contenteditable')
	    el.style.outline    = ''
	    el.style.minHeight  = ''
	    el.style.cursor     = ''
	    el.style.color      = ''
	    el.style.fontWeight = ''
	    el.title            = ''
	})
	// Re-render social media + stats in review view
	this.renderSocialMedia(false)
	this.renderStats()
    }

    enableEditable() {
	wc.log('[client] edtable mode ON')
	document.querySelector('.client-container').classList.add('edtable-mode')
	const hint = document.getElementById('editModeHint')
	if (hint) hint.style.display = 'block'

	this.renderSocialMedia(true)
	document.querySelectorAll('[data-editable]').forEach(function(el) {
	    el.style.outline = '2px dashed #a98212'

	    // Logo uses click-to-replace — no contenteditable
	    if (el.id === 'clientLogo') {
		el.style.cursor = 'pointer'
		el.title = 'Click to change photo'
		return
	    }

	    el.setAttribute('contenteditable', 'true')
	    el.style.minHeight = '1em'
	    el.style.cursor = 'text'
	    el.addEventListener('blur', function() {
		wc.log('[client] edtable changed:', el.id || el.className, el.textContent.trim())
		wc.publish('client:edtable-change', {
		    id:    el.id || null,
		    class: el.className || null,
		    value: el.textContent.trim()
		})
	    })
	})
    }

    renderHeader() {
	// Logo
	const logo = document.getElementById("clientLogo")
	logo.innerHTML = `<img src="${this.data.business.logo}" alt="${this.data.business.name}">`

	// Click on logo — always opens file picker (edit mode gates via cursor/outline in enableEditable)
	const self = this
	logo.addEventListener('click', function() {
	    if (!document.querySelector('.client-container').classList.contains('edtable-mode')) return
	    const picker = document.createElement('input')
	    picker.type = 'file'
	    picker.accept = 'image/*'
	    picker.onchange = function() {
		const file = picker.files[0]
		if (!file) return
		const reader = new FileReader()
		reader.onload = function(e) {
		    const img = logo.querySelector('img')
		    if (img) img.src = e.target.result
		    const payload = {
			id:    'clientLogo',
			class: 'client-logo',
			value: e.target.result,
			file:  file.name
		    }
		    wc.log('[client] publish → client:logo-change', payload)
		    wc.publish('client:logo-change', payload)
		}
		reader.readAsDataURL(file)
	    }
	    picker.click()
	})

	// Name
	document.getElementById("clientName").textContent = this.data.business.name

	// Rating
	const rating = document.getElementById("clientRating")
	const stars = "★".repeat(Math.floor(this.data.business.rating))
	rating.innerHTML = `
      <span class="rating-text">${this.data.business.ratingText}</span>
      <span class="rating-value">${this.data.business.rating}</span>
      <span class="stars">${stars}</span>
      <span class="review-count">(${this.data.business.reviewCount})</span>
    `

	// Badges
	if (this.data.business.isTopPro) {
	    const badges = document.getElementById("clientBadges")
	    badges.innerHTML = `
        <span class="badge">
          <span class="material-icons">verified</span>
          Top Pro
        </span>
      `
	}
    }

    renderStats() {
	const statsContainer = document.getElementById("clientStats")
	const statsHTML = this.data.stats
	      .map(
		  (stat, i) => `
      <div class="stat-item stat-${stat.type}">
        <span class="material-icons">${stat.icon}</span>
        ${(stat.type === 'team' && stat.text.match(/^(\d+)(.*)$/))
          ? '<span><span class="stat-num" data-editable data-stat-index="' + i + '">' + stat.text.match(/^(\d+)(.*)/)[1] + '</span><span class="stat-suffix">' + stat.text.match(/^(\d+)(.*)/)[2] + '</span></span>'
          : '<span class=\"stat-text\">' + stat.text + '</span>'}
      </div>
    `,
	      )
	      .join("")
	statsContainer.innerHTML = statsHTML
    }

    renderTabs() {
	const tabsContainer = document.getElementById("clientTabs")
	const tabsHTML = this.data.tabs
	      .map(
		  (tab) => `
      <button class="tab ${tab.active ? "active" : ""}" data-tab="${tab.id}">
        ${tab.label}
      </button>
    `,
	      )
	      .join("")
	tabsContainer.innerHTML = tabsHTML
    }

    renderContent() {
	// About section
	const aboutText = document.getElementById("aboutText")
	aboutText.innerHTML = `
      ${this.data.about.description}
      <a href="#">${this.data.about.readMoreLink}</a>
    `

	// Business hours
	document.getElementById("businessHoursTitle").textContent = this.data.businessHours.title
	document.getElementById("businessHoursText").textContent = this.data.businessHours.text

	// Payment methods
	document.getElementById("paymentMethodsTitle").textContent = this.data.paymentMethods.title
	document.getElementById("paymentMethodsText").textContent = this.data.paymentMethods.methods

	// Social media
	document.getElementById("socialMediaTitle").textContent = this.data.socialMedia.title
	this.renderSocialMedia()

	this.renderReviews()

	// Top Pro status
	// Only show Top Pro section if isTopPro is true
	const topProSection = document.getElementById("topProSection")
	if (topProSection) topProSection.style.display = this.data.business.isTopPro ? "" : "none"
	document.getElementById("topProTitle").textContent = this.data.topProStatus.title
	document.getElementById("topProDescription").textContent = this.data.topProStatus.description

	const proBadges = document.getElementById("topProBadges")
	proBadges.innerHTML = this.data.topProStatus.years
	    .map(
		(year) => `
      <div class="pro-badge">
        <div class="badge-icon">
          <span class="material-icons">star</span>
        </div>
        <span class="badge-year">${year}</span>
      </div>
    `,
	    )
	    .join("")
    }

    renderReviews() {
	const section = document.getElementById("reviewsSection")
	const list = document.getElementById("clientReviews")
	if (!section || !list) return

	const reviews = Array.isArray(this.data.reviews) ? this.data.reviews : []
	const visible = reviews.filter(function(review) {
	    return review && review.published !== false && review.text
	})

	const self = this
	section.style.display = visible.length ? "" : "none"
	list.innerHTML = visible.map(function(review) {
	    const rating = Math.max(0, Math.min(5, Number(review.rating || 0)))
	    const stars = "★".repeat(Math.round(rating))
	    return `
		<article class="client-review-card">
		    <div class="client-review-card__head">
			<strong>${self._escapeHtml(review.customerName || "Customer")}</strong>
			<span>${stars}</span>
		    </div>
		    <p>${self._escapeHtml(review.text)}</p>
		    <small>${self._escapeHtml(review.createdAt || "")}</small>
		</article>
	    `
	}).join("")
    }

    _escapeHtml(value) {
	return String(value)
	    .replace(/&/g, '&amp;')
	    .replace(/</g, '&lt;')
	    .replace(/>/g, '&gt;')
	    .replace(/"/g, '&quot;')
	    .replace(/'/g, '&#39;')
    }

    renderSocialMedia(forceEdit) {
	const links     = this.data.socialMedia.links
	const container = document.getElementById("socialMediaLinks")
	const isEdit    = forceEdit !== undefined
	    ? forceEdit
	    : !!(this.data.editable || window.edtable)

	const titleEl = document.getElementById("socialMediaTitle")

	if (!isEdit) {
	    // Review view — icons only, no table
	    const visibleLinks = links.filter(l => l.url)
	    container.innerHTML = visibleLinks
		.map(l => `<a href="${l.url}" target="_blank"><img src="${l.icon}" height="30" alt="${l.platform}"></a>&nbsp;`)
		.join("")
	    // Hide label if no social links to show
	    if (titleEl) titleEl.style.display = visibleLinks.length ? '' : 'none'
	    return
	}

	// Edit view — always show label
	if (titleEl) titleEl.style.display = 

	// Editable view — MD table + preview placeholder
	container.innerHTML = `
	    <style>
		.social-edit-table .social-url::placeholder { font-style:italic; color:#bbb; }
		.social-edit-table .social-url:focus::placeholder { color:#ccc; }
	    </style>
	    <table class="social-edit-table" style="width:100%;border-collapse:collapse;margin-bottom:16px">
		<thead>
		    <tr>
			<th style="width:44px;padding:0 8px 8px;font-size:11px;font-weight:600;
				   color:#9e9e9e;text-transform:uppercase;letter-spacing:0.06em;text-align:left">Media</th>
			<th style="padding:0 4px 8px;font-size:11px;font-weight:600;
				   color:#9e9e9e;text-transform:uppercase;letter-spacing:0.06em;text-align:left">Your Social Link</th>
		    </tr>
		</thead>
		<tbody>
		    ${links.map((l, i) => `
		    <tr data-platform="${l.platform}" style="border-bottom:1px solid #e0e0e0">
			<!-- Col 1: Icon -->
			<td style="width:44px;vertical-align:middle;padding:10px 8px">
			    <img src="${l.icon}" height="26" alt="${l.platform}" style="display:block;opacity:${l.url ? '1' : '0.4'}">
			</td>
			<!-- Col 3: MD floating-label text field -->
			<td style="vertical-align:middle;padding:10px 4px">
			    <div class="md-field" style="margin-bottom:0;position:relative">
				<input type="text" class="social-url" data-index="${i}"
				    value="${l.url || ''}"
				    placeholder="Your social media link"
				    style="width:100%;border:none;border-bottom:${l.url ? '2px solid #a98212' : '1px solid #ccc'};
					   outline:none;font-size:13px;
					   color:#212121;
					   padding:4px 0;background:transparent;transition:border 0.2s">
			    </div>
			</td>
		    </tr>`).join("")}
		</tbody>
	    </table>

	    <!-- Preview section -->
	    <div class="social-preview" style="display:flex;gap:10px;min-height:40px;
		 align-items:center;flex-wrap:wrap;padding:8px 0;
		 border-bottom:1px solid #e0e0e0">
	    </div>
	`

	const self      = this
	const preview   = container.querySelector(".social-preview")

	// MD floating label + live update
	container.querySelectorAll(".social-url").forEach(function(input) {

	    input.addEventListener("focus", function() {
		input.style.borderBottom = "2px solid #a98212"
	    })

	    input.addEventListener("blur", function() {
		input.style.borderBottom = input.value.trim() ? "2px solid #a98212" : "1px solid #ccc"
	    })

	    input.addEventListener("input", function() {
		const val = input.value.trim()
		// Update config
		const i = parseInt(input.dataset.index)
		self.data.socialMedia.links[i].url = val
		// Update checkbox + icon opacity
		const row = container.querySelector(`tr[data-platform="${self.data.socialMedia.links[i].platform}"]`)
		if (row) {
		    const img = row.querySelector("img")
		    if (img) img.style.opacity = val ? "1" : "0.4"
		}
		self._refreshSocialPreview(container, self.data.socialMedia.links)
	    })
	})



	// Init preview from pre-checked rows
	this._refreshSocialPreview(container, links)
    }

    _refreshSocialPreview(container, links) {
	const preview = container.querySelector(".social-preview")
	if (!preview) return
	preview.innerHTML = ""
	container.querySelectorAll(".social-url").forEach(function(input) {
	    const url = input.value.trim() || links[parseInt(input.dataset.index)].url || ""
	    if (!url) return
	    const i    = parseInt(input.dataset.index)
	    const link = links[i]
	    const a    = document.createElement("a")
	    a.href            = url || "#"
	    a.target          = "_blank"
	    a.style.display   = "inline-flex"
	    a.style.alignItems = "center"
	    a.innerHTML       = `<img src="${link.icon}" height="28" alt="${link.platform}">`
	    preview.appendChild(a)
	})
	if (!preview.children.length) {
	    preview.innerHTML = `<span style="color:#bbb;font-size:12px;font-style:italic">
		Checked icons will appear here</span>`
	}
    }

    renderSidebar() {
	// Contact info
	document.getElementById("contactPrice").textContent = this.data.contact.priceText
	document.getElementById("btnEstimate").textContent = this.data.contact.ctaButton

	// Online status
	if (!this.data.business.isOnline) {
	    document.getElementById("onlineStatus").style.display = "none"
	}

	// Guarantee
	document.getElementById("guaranteeTitle").textContent = this.data.guarantee.title
	document.getElementById("guaranteeText").textContent = this.data.guarantee.text
	document.getElementById("learnMoreLink").textContent = this.data.guarantee.learnMoreLink
    }

    attachEventListeners() {
	// Tab navigation
	const tabs = document.querySelectorAll(".tab")
	tabs.forEach((tab) => {
	    tab.addEventListener("click", (e) => {
		tabs.forEach((t) => t.classList.remove("active"))
		e.target.classList.add("active")
		this.publishClickEvent(e, "tab.clicked")
	    })
	})

	// Share button
	const shareBtn = document.getElementById("btnShare")
	let _sharing = false
	document.getElementById("btnShare").addEventListener("click", (e) => {
	    this.publishClickEvent(e, "button.share.clicked")
	    if (_sharing) return

	    const shareData = {
		title: this.data.business.name,
		text: `Check out ${this.data.business.name}!`,
		url: window.location.href,
	    }

	    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
		_sharing = true
		navigator.share(shareData)
		    .then(() => wc.log('[client] Share succeeded'))
		    .catch((err) => {
			wc.log('[client] Share dismissed or failed:', err.message)
			// Fallback to clipboard if share fails
			if (navigator.clipboard) {
			    navigator.clipboard.writeText(window.location.href)
				.then(() => {
				    shareBtn.textContent = 'Link Copied!'
				    setTimeout(() => { shareBtn.innerHTML = '<span class="material-icons">share</span> Share' }, 2000)
				})
			}
		    })
		    .finally(() => { _sharing = false })
	    } else if (navigator.clipboard) {
		// No share API — copy to clipboard
		navigator.clipboard.writeText(window.location.href).then(() => {
		    shareBtn.textContent = 'Link Copied!'
		    setTimeout(() => { shareBtn.innerHTML = '<span class="material-icons">share</span> Share' }, 2000)
		})
	    } else {
		prompt('Copy this link:', window.location.href)
	    }
	})

	// Request estimate button — opens mtk-request modal
	document.getElementById("btnEstimate").addEventListener("click", (e) => {
	    this.publishClickEvent(e, "button.estimate.clicked")
	    wc.log("btnEstimate clicked — opening mtk-request dialog")
	    // Pass nalaUID into the hidden field before opening
	    const uidField = document.querySelector(".mtk-request .nala-uid")
	    if (uidField && this.data.nalaUID) uidField.value = this.data.nalaUID
	    wc.publish("mtk-request:open")
	})

	document.querySelectorAll("a").forEach((link) => {
	    link.addEventListener("click", (e) => {
		this.publishClickEvent(e, "link.clicked")
	    })
	})

	// Material Design ripple effect
	this.addRippleEffect()
    }

    initGlobalClickListener() {
	document.addEventListener("click", (e) => {
	    const elementId = e.target.id || e.target.closest("[id]")?.id || "no-id"
	    const elementClass = e.target.className || "no-class"
	    const elementTag = e.target.tagName.toLowerCase()

	    const clickData = {
		elementId: elementId,
		elementClass: elementClass,
		elementTag: elementTag,
		timestamp: new Date().toISOString(),
		coordinates: {
		    x: e.clientX,
		    y: e.clientY,
		},
		target: e.target,
	    }

	    wc.publish("global.click", clickData)

	    // console.log("[_client] Global Click Event:", clickData)
	})
    }

    publishClickEvent(event, eventName) {
	if (!this.pubsub) return

	const elementId = event.target.id || event.target.closest("[id]")?.id || "no-id"
	const elementClass = event.target.className || "no-class"

	const clickData = {
	    eventName: eventName,
	    elementId: elementId,
	    elementClass: elementClass,
	    elementTag: event.target.tagName.toLowerCase(),
	    timestamp: new Date().toISOString(),
	    coordinates: {
		x: event.clientX,
		y: event.clientY,
	    },
	    data: event.target.dataset || {},
	}

	wc.publish(eventName.replace(":", "."), clickData)
	console.log(`[_client] ${eventName}:`, clickData)
    }

    addRippleEffect() {
	const buttons = document.querySelectorAll(".btn-primary, .btn-share, .tab")
	buttons.forEach((button) => {
	    button.addEventListener("click", function (e) {
		const ripple = document.createElement("span")
		const rect = this.getBoundingClientRect()
		const size = Math.max(rect.width, rect.height)
		const x = e.clientX - rect.left - size / 2
		const y = e.clientY - rect.top - size / 2

		ripple.style.width = ripple.style.height = size + "px"
		ripple.style.left = x + "px"
		ripple.style.top = y + "px"
		ripple.classList.add("ripple")

		this.appendChild(ripple)

		setTimeout(() => ripple.remove(), 600)
	    })
	})
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    console.log("[_client] Waiting for client DOM")

    try {
	// WAIT until wc-include injects the HTML
	await waitForElement(".client-container")

	console.log("[_client] Client DOM ready")

	// Instantiated externally via client(config) from client.config.js
	// No auto-instantiation here

	PubSub.subscribe("global.click", (msg, data) => {
	    // console.log("[_client] Global click:", msg, data)
	})

	PubSub.subscribe("button.estimate.clicked", (msg, data) => {
	    console.log("[_client] Estimate clicked:", data)
	})

	wc.subscribe("mtk-request:submit", (msg, data) => {
	    console.log("[_client] Request submitted:", data)
	    wc.log("mtk-request:submit received", data)
	})

	PubSub.subscribe("button.share.clicked", (msg, data) => {
	    console.log("[_client] Share clicked:", data)
	})

	PubSub.subscribe("tab.clicked", (msg, data) => {
	    console.log("[_client] Tab clicked:", data)
	})

	PubSub.subscribe("link.clicked", (msg, data) => {
	    console.log("[_client] Link clicked:", data)
	})

    } catch (err) {
	console.error("[_client] Failed to initialize:", err)
    }
})

