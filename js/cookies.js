/**
 * Vanilla JS Cookie Utilities
 * Basic functions for managing browser cookies
 */

const wc = {
    /**
     * Set a cookie
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value
     * @param {number} days - Days until expiration (optional)
     * @param {string} path - Cookie path (default: '/')
     * @param {string} domain - Cookie domain (optional)
     * @param {boolean} secure - Secure flag (optional)
     * @param {string} sameSite - SameSite attribute (optional: 'Strict', 'Lax', 'None')
     */
    set(name, value, days = null, path = '/', domain = null, secure = false, sameSite = 'Lax') {
	let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
	
	if (days) {
	    const date = new Date();
	    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	    cookie += `; expires=${date.toUTCString()}`;
	}
	
	cookie += `; path=${path}`;
	
	if (domain) {
	    cookie += `; domain=${domain}`;
	}
	
	if (secure) {
	    cookie += '; secure';
	}
	
	if (sameSite) {
	    cookie += `; SameSite=${sameSite}`;
	}
	
	document.cookie = cookie;
    },

    /**
     * Get a cookie value by name
     * @param {string} name - Cookie name
     * @returns {string|null} Cookie value or null if not found
     */
    get(name) {
	const nameEQ = encodeURIComponent(name) + '=';
	const cookies = document.cookie.split(';');
	
	for (let i = 0; i < cookies.length; i++) {
	    let cookie = cookies[i].trim();
	    if (cookie.indexOf(nameEQ) === 0) {
		return decodeURIComponent(cookie.substring(nameEQ.length));
	    }
	}
	
	return null;
    },

    /**
     * Delete a cookie
     * @param {string} name - Cookie name
     * @param {string} path - Cookie path (default: '/')
     * @param {string} domain - Cookie domain (optional)
     */
    delete(name, path = '/', domain = null) {
	this.set(name, '', -1, path, domain);
    },

    /**
     * Check if a cookie exists
     * @param {string} name - Cookie name
     * @returns {boolean} True if cookie exists
     */
    exists(name) {
	return this.get(name) !== null;
    },

    /**
     * Get all cookies as an object
     * @returns {Object} Object with cookie names as keys and values
     */
    getAll() {
	const cookies = {};
	const cookieArray = document.cookie.split(';');
	
	for (let i = 0; i < cookieArray.length; i++) {
	    const cookie = cookieArray[i].trim();
	    const [name, value] = cookie.split('=');
	    if (name) {
		cookies[decodeURIComponent(name)] = decodeURIComponent(value || '');
	    }
	}
	
	return cookies;
    },

    /**
     * Delete all cookies
     * @param {string} path - Cookie path (default: '/')
     * @param {string} domain - Cookie domain (optional)
     */
    deleteAll(path = '/', domain = null) {
	const cookies = this.getAll();
	for (let name in cookies) {
	    this.delete(name, path, domain);
	}
    },

    /**
     * Set a cookie with JSON value
     * @param {string} name - Cookie name
     * @param {*} value - Value to be JSON stringified
     * @param {number} days - Days until expiration (optional)
     * @param {string} path - Cookie path (default: '/')
     */
    setJSON(name, value, days = null, path = '/') {
	try {
	    const jsonValue = JSON.stringify(value);
	    this.set(name, jsonValue, days, path);
	} catch (error) {
	    console.error('Error stringifying JSON for cookie:', error);
	}
    },

    /**
     * Get a cookie and parse it as JSON
     * @param {string} name - Cookie name
     * @returns {*|null} Parsed JSON value or null if not found or invalid
     */
    getJSON(name) {
	const value = this.get(name);
	if (!value) return null;
	
	try {
	    return JSON.parse(value);
	} catch (error) {
	    console.error('Error parsing JSON from cookie:', error);
	    return null;
	}
    }
};

// Alternative: Individual functions (non-object approach)
function setCookie(name, value, days = null, path = '/', domain = null, secure = false, sameSite = 'Lax') {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    if (days) {
	const date = new Date();
	date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	cookie += `; expires=${date.toUTCString()}`;
    }
    
    cookie += `; path=${path}`;
    
    if (domain) {
	cookie += `; domain=${domain}`;
    }
    
    if (secure) {
	cookie += '; secure';
    }
    
    if (sameSite) {
	cookie += `; SameSite=${sameSite}`;
    }
    
    document.cookie = cookie;
}

function getCookie(name) {
    const nameEQ = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
	let cookie = cookies[i].trim();
	if (cookie.indexOf(nameEQ) === 0) {
	    return decodeURIComponent(cookie.substring(nameEQ.length));
	}
    }
    
    return null;
}

function deleteCookie(name, path = '/', domain = null) {
    setCookie(name, '', -1, path, domain);
}

function cookieExists(name) {
    return getCookie(name) !== null;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
	wc,
	setCookie,
	getCookie,
	deleteCookie,
	cookieExists
    };
}
